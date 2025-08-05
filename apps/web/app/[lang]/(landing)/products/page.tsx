import {Metadata} from "next";
import {strapiClient} from '@/utils/strapi-client'
import ProductListView from "@/components/ProductListView";
import ProductCompatListView from "@/components/ProductCompactListView";
import FeaturedProductsView from "@/components/FeaturedProductsView";
import {useTranslate} from "@/dictionaries/dictionaries";
import {i18n} from "@/config/i18n-config";
import Hero from "@/components/Hero";
import ProductTagsView from "@/components/ProductTagsView";
import {getLetterFromDate} from "@/utils/utils";
import ProductGroupsView from "@/components/ProductGroupsView";


export const revalidate = 86400;

async function fetchStaticData(lang: string) {
  const t = await useTranslate(lang);
  //使用当前的日，对应一个a-z字母中的某个字母,比如 10月1日是a，10月2日是b
  const letter = getLetterFromDate()
  // 从最新里取12个产品
  const latestProducts = await strapiClient.collection('products').find({
    sort: 'createdAt:desc',
    filters: {
      productStatus: {
        $eq: 'Approved',
      },
    },
    populate: ['logo', 'screenShot'],
    pagination: {
      limit: 12
    },
    locale: lang
  })
  // 从字母取12个产品, 混合random
  const topProducts = await strapiClient.collection('products').find({
    sort: 'monthlyVisit:desc',
    filters: {
      productStatus: {
        $eq: 'Approved',
      },
      documentId: {
        $startsWith: letter
      }
    },
    populate: ['logo', 'screenShot'],
    pagination: {
      limit: 12
    },
    locale: lang
  })
  const todayProducts = [
    ...latestProducts.data,
    ...topProducts.data
  ]

  //random
  todayProducts.sort(() => Math.random() - 0.5);

  const productCategories = await strapiClient.collection('product-categories').find({})
  return {
    title: t("Discover The Best AI Websites & Tools"),
    description: t("{{key0}} AIs and {{key1}} categories in the best AI tools directory. AI tools list & GPTs store are updated daily by ChatGPT.", {
      key0: topProducts.meta.pagination?.total.toString() || '0',
      key1: productCategories.meta.pagination?.total.toString() || '0',
    }),
    todayProducts: todayProducts,
  }
}

export async function generateMetadata(props: {
  params: Promise<{
    lang: string
  }>
}): Promise<Metadata> {
  const {lang} = await props.params;
  const staticData = await fetchStaticData(lang);
  return {
    title: staticData.title,
    description: staticData.description,
  }
}

export async function generateStaticParams(props: any) {
  return i18n.locales.map((lang) => {
    return {
      lang: lang
    }
  })
}


export default async function ProductsPage(props: {
  params: Promise<{
    lang: string
  }>
}) {
  const {lang} = await props.params;
  const staticData = await fetchStaticData(lang)
  return (
    <>
      <Hero lang={lang}/>
      <div className='custom-padding py-8 flex flex-col lg:flex-row gap-8'>
        <div className='flex-1 flex flex-col gap-8'>
          <ProductTagsView
            activeTag={"Today"}
            lang={lang}
          />
          <div className='flex flex-col gap-4'>
            <ProductListView
              data={staticData.todayProducts.slice(0, 8)}
              lang={lang}/>
            <ProductCompatListView
              data={staticData.todayProducts.slice(8)}
              lang={lang}
            />
          </div>
          <ProductGroupsView lang={lang}/>
        </div>
        <FeaturedProductsView
          className={'w-full lg:w-1/5'}
          lang={lang}/>
      </div>
    </>
  );
}
