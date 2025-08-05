import {strapiClient} from '@/utils/strapi-client'
import Link from "next/link";
import type {Metadata} from "next";
import {PRODUCT_CATEGORY_GROUP} from "@/config/groupConfig";
import {useTranslate} from "@/dictionaries/dictionaries";
import {i18n} from "@/config/i18n-config";

export async function generateMetadata(props: {
  params: Promise<{
    lang: string
  }>
}): Promise<Metadata> {
  const { lang } = await props.params;
  const t = await useTranslate(lang);
  return {
    title: t('All Categories AI Tools & Websites'),
    description: t('Find the best AI tools and websites by categories'),
  };
}
export async function generateStaticParams() {
  return i18n.locales.map((lang) => {
    return {
      lang: lang
    }
  })
}

async function getAllCategories() {
  const result = []
  // sort by item.name
  for (const item of PRODUCT_CATEGORY_GROUP.sort((a, b) => a.name.localeCompare(b.name))) {
    const categories = await strapiClient.collection('product-categories').find({
      sort: 'name:asc',
      filters: {
        group: {
          $eq: item.name,
        },
      },
      pagination:{
        limit:100
      }
    })
    result.push({
      name: item.name,
      text: item.text,
      categories: categories.data,
    })
  }
  return result
}

export default async function ProductCategoriesPage(props: {
  params: Promise<{
    lang: string
  }>
}) {
  const { lang } = await props.params;
  const t = await useTranslate(lang)
  const data = await getAllCategories()
  const countCategory =
    data.reduce((acc: number, item: any) => {
      return acc + item.categories.length
    }, 0)

  return (
    <div className=''>
      <div className='flex flex-col w-full justify-center items-center p-8 gap-4 text-center cursor-pointer bg-linear'>
        <h1 className='text-5xl font-bold'>{t("Find Best Products By Categories")}</h1>
        <p>{t("Over {{countCategory}} categories to find Best websites and tools", {countCategory: countCategory})}</p>
      </div>
      <div className='flex flex-row w-full custom-padding py-8'>
        <div className='sticky-category-list'>
          {PRODUCT_CATEGORY_GROUP.map((group) => (
            <ul key={group.name} className='flex flex-col gap-2'>
              <li className='mb-4'>
                <Link
                  href={`#${group.name}`}>
                  {t(group.text)}
                </Link>
              </li>
            </ul>
          ))}
        </div>
        <div className="flex flex-col w-full gap-8">
          {data.map((item) => (
            <div key={item.name}>
              <h3
                id={item.name}
                className="text-2xl font-bold mb-4">
                {t(item.text)}
              </h3>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {item.categories.map((category: any) => (
                  <Link
                    key={category.id}
                    href={`/${lang}/category/${category.slug}`}
                    className='flex flex-row items-start px-4 py-2 border border-gray-300 rounded-lg shadow sm hover:shadow-lg transition-shadow duration-300'>
                    <span className="text-lg">{t(category.name)}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
