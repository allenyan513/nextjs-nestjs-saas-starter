import {strapiClient} from '@/utils/strapi-client'
import ProductListView from "@/components/ProductListView";
import type {Metadata} from "next";
import BreadCrumb, {BreadCrumbProps} from "@/components/BreadCrumb";
import ProductCategoryInformationView from "@/components/ProductCategoryInformationView";
import FeaturedProductsView from "@/components/FeaturedProductsView";
import {useTranslate} from "@/dictionaries/dictionaries";
import {getAllSlugs} from "@/services/product-category-service";

export const revalidate = 86400;

export async function generateMetadata(props: {
  params: Promise<{
    slug: string
    lang: string
  }>
}): Promise<Metadata> {
  const { lang, slug } = await props.params;
  const staticData = await fetchStaticData(lang, slug);
  return {
    title: staticData.title,
    description: staticData.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/${lang}/category/${slug}`,
    }
  };
}


export async function generateStaticParams() {
  const allSlugs = await getAllSlugs();
  const staticLangs = ['en']
  const result =  staticLangs.map((lang) => {
    return allSlugs.map((slug) => ({
      lang: lang,
      slug: slug
    }))
  })
  return result.flat()
}

async function fetchStaticData(lang:string, slug:string) {
  const topProductResponse = await strapiClient.collection('products').find({
    sort: 'monthlyVisit:desc',
    filters: {
      productStatus: {
        $eq: 'Approved',
      },
      productCategories: {
        slug: {
          $eq: slug,
        },
      }
    },
    populate: ['logo', 'screenShot', 'productCategories'],
    locale: lang,
  })

  const top10ListNames =
    topProductResponse.data.map((item: any) => item.name).slice(0, 10)
      .join(', ')
  const productCategoryResponse = await strapiClient.collection('product-categories').find({
    filters: {
      slug: {
        $eq: slug,
      }
    },
    locale: lang,
  })
  const productCategory = productCategoryResponse.data[0]
  const latestProducts = await strapiClient.collection('products').find({
    filters: {
      productStatus: {
        $eq: 'Approved',
      },
      productCategories: {
        slug: {
          $eq: slug,
        },
      }
    },
    sort: 'createdAt:desc',
    populate: ['logo', 'screenShot'],
    pagination: {
      pageSize: 3
    }
  })

  return {
    title: `Best ${topProductResponse.meta.pagination?.total} ${productCategory.name} AI Tools & Websites in ${new Date().getFullYear()}`,
    description: `Best ${topProductResponse.meta.pagination?.total} ${productCategory.name} AI Tools & Websites are: ${top10ListNames}.`,
    top10ListNames: top10ListNames,
    products: topProductResponse.data as any[],
    productCategory: productCategory,
    latestProducts: latestProducts.data as any[],
  }
}


export default async function ProductCategoryListPage(props: {
  params: Promise<{
    lang: string,
    slug: string,
  }>
}) {
  const { lang, slug } = await props.params;
  const t = await useTranslate(lang);
  const staticData = await fetchStaticData(lang, slug);
  const breadCrumbData = [
    {
      name: `${t('Home')}`,
      url: `/${lang}`
    },
    {
      name: `${t('Category')}`,
      url: `/${lang}/category`
    },
    {
      name: `${t(staticData.productCategory.name)}`,
      url: `/${lang}/category/${staticData.productCategory.slug}`
    }
  ]

  return (
    <div className=''>
      <div className='custom-padding bg-linear flex flex-col gap-8 pb-12 mb-8'>
        <BreadCrumb data={breadCrumbData}/>
        <div className='flex flex-col items-center justify-center gap-4'>
          <h1 className='text-5xl font-semibold text-center'>
            {staticData.title}
          </h1>
          <p>{staticData.top10ListNames}</p>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-8 custom-padding'>
        <div className='flex flex-col flex-1'>
          <ProductListView
            className={'md:grid-cols-3'}
            lang={lang}
            data={staticData.products}/>
          <ProductCategoryInformationView
            className={'my-8'}
            lang={lang}
            productCategory={staticData.productCategory}
            topProducts={staticData.products}
            latestProducts={staticData.latestProducts}/>
        </div>
        <FeaturedProductsView
          className={'w-1/5'}
          lang={lang}/>
      </div>
    </div>
  );
}
