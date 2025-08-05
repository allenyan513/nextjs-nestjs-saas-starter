import {strapiClient} from '@/utils/strapi-client'
import {getStrapiMedia} from "@/utils/api-helpers";
import Link from "next/link";
import RichText from "@/components/RichText";
import BreadCrumb, {BreadCrumbProps} from "@/components/BreadCrumb";
import {BsBoxArrowUp} from "react-icons/bs";
import ProductListView from "@/components/ProductListView";
import ProductUrlView from "@/components/ProductUrlView";
import {Metadata} from "next";
import {formatMonthlyVisit, getFormatData2} from "@/utils/utils";
import FeaturedProductsView from "@/components/FeaturedProductsView";
import {getDictionary, templateString} from "@/dictionaries/dictionaries";
import {i18n} from "@/config/i18n-config";


export const revalidate = 86400

export async function generateMetadata(props: {
  params: Promise<{
    lang: string
    slug: string
  }>
}): Promise<Metadata | null> {
  const { lang, slug } = await props.params
  const response = await strapiClient.collection('products').find({
    filters: {
      productStatus: {
        $eq: 'Approved',
      },
      slug: {
        $eq: slug
      }
    },
    fields: ['name', 'description','longDescription'],
    pagination: {
      limit: 1,
    }
  })
  if (!response || response.data.length === 0) {
    return null
  }
  const product = response.data[0]
  return {
    title: `${product.name}: ${product.description}`.substring(0, 60),
    description: `${product.name}: ${product.longDescription}.`.substring(0, 160),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/${lang}/products/${slug}`,
    }
  }
}

// export async function generateStaticParams() {
//   return []
// }

export default async function ProductPage(props: {
  params: Promise<{
    lang: string
    slug: string
  }>
}) {
  const { lang, slug } = await props.params
  const dict = await getDictionary(lang)
  const query = {
    locale: lang,
    filters: {
      productStatus: {
        $eq: 'Approved',
      },
      slug: {
        $eq: slug
      }
    },
    populate: '*',
    pagination: {
      limit: 1,
    }
  }
  let products = await strapiClient.collection('products').find(query)
  if (!products || products.data.length === 0) {
    products = await strapiClient.collection('products').find({
      ...query,
      locale: i18n.defaultLocale,
    })
  }
  const product = products.data[0]
  const mainProductCategory = product.productCategories[0]
  const breadCrumbData: BreadCrumbProps = {
    data: [
      {
        name: 'Home',
        url: `/${lang}`
      },
      {
        name: `${mainProductCategory?.name}`,
        url: `/${lang}/category/${mainProductCategory?.slug}`
      },
      {
        name: `${product.name}`,
        url: ``
      }
    ]
  }
  let relativeProducts = null
  if (mainProductCategory) {
    relativeProducts = await strapiClient.collection('products').find({
      filters: {
        productCategories: {
          slug: {
            $eq: mainProductCategory.slug
          }
        },
      },
      populate: '*',
      pagination: {
        limit: 4
      }
    })
  }

  return (
    <>
      <div className='flex flex-col gap-8 pb-12 custom-padding bg-linear'>
        <BreadCrumb data={breadCrumbData.data}/>
        <div className='flex flex-row gap-2 items-center'>
          {product.logo?.url && (
            <img
              className='w-12 h-12 rounded object-cover aspect-video'
              src={getStrapiMedia(product.logo?.url)}
              alt={product.name}/>
          )}
          <div className='flex flex-col'>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <h2 className='text-gray-500 line-clamp-1'>{product.description}</h2>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='w-full lg:w-1/3'>
            <Link
              href={product.url}
              target='_blank'>
              <img
                className='rounded object-cover aspect-video shadow-sm hover:shadow-lg transition-shadow duration-300'
                src={getStrapiMedia(product.screenShot?.url)}
                alt={product.name}
              />
            </Link>
          </div>
          <div className='flex-1 flex flex-col gap-3 justify-start items-start'>
            <Link
              className=' inline-flex items-center bg-black text-white px-3 py-2 rounded gap-2 '
              href={product.url}
              target='_blank'>
              <span>{dict.Visit} {product.name}</span>
              <BsBoxArrowUp/>
            </Link>
            <div className='flex flex-row items-center gap-4'>
              <p className='w-36 font-semibold'>{dict.AddedOn}:</p>
              <p className=''>{getFormatData2(product.createdAt)}</p>
            </div>

            <div className='flex flex-row items-center gap-4'>
              <p className='w-36 font-semibold'>{dict.MonthlyVisitors}:</p>
              <p className=''>{formatMonthlyVisit(product.monthlyVisit)}</p>
            </div>

            <p className='w-32 font-semibold'>{dict.Categories}:</p>
            <div className='flex flex-row flex-wrap gap-2'>
              <Link
                href={``}
                className='product-category'>
                {product.productType}
              </Link>
              {product.productCategories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/${lang}/category/${category?.slug}`}
                  className='product-category'>
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col lg:flex-row gap-8 my-8 custom-padding w-full'>
        <div className='w-full'>
          {/*Information*/}
          <p className='h2'>{product.name} {dict.ProductInformation}</p>
          <div className='flex flex-col rounded border border-gray-300 px-5 py-4 gap-2 bg-white'>
            <h2 className='h3'>{templateString(dict.WhatIsIt, product.name)}</h2>
            <RichText data={{
              body: product.longDescription,
            }}/>
            <div className='divider'/>

            <h2 className='h3'>{templateString(dict.HowToUse, product.name)}</h2>
            <RichText data={{
              body: product.howToUse,
            }}/>
            <div className='divider'/>

            <h2 className='h3'>{templateString(dict.CoreFeatures, product.name)}</h2>
            <RichText data={{
              body: product.features,
            }}/>
            <div className='divider'/>

            {/*Use Cases*/}
            {product.useCases && product.useCases.length > 0 && (
              <>
                <h2 className='h3'>{templateString(dict.UseCases, product.name)}</h2>
                <RichText data={{
                  body: product.useCases,
                }}/>
                <div className='divider'/>
              </>
            )}
            {/*FAQs*/}
            {product.faq && product.faq.length > 0 && (
              <>
                <h2 className='h3'>{templateString(dict.FAQFrom, product.name)}</h2>
                {product.faq.map((item: any) => (
                  <div key={item.id} className='flex flex-col gap-2'>
                    <h3 className='text-lg font-semibold'>{item.question}</h3>
                    <RichText data={{
                      body: item.answer,
                    }}/>
                  </div>
                ))}
                <div className='divider'/>
              </>
            )}
            <ProductUrlView productName={product.name} urlName={'Pricing'} url={product.pricingUrl}/>
            <ProductUrlView productName={product.name} urlName={'Reddit'} url={product.redditUrl}/>
            <ProductUrlView productName={product.name} urlName={'Discord'} url={product.discordUrl}/>
            <ProductUrlView productName={product.name} urlName={'YouTube'} url={product.youtubeUrl}/>
            <ProductUrlView productName={product.name} urlName={'Twitter'} url={product.twitterUrl}/>
            <ProductUrlView productName={product.name} urlName={'LinkedIn'} url={product.linkedinUrl}/>
          </div>
          {/*Alternatives*/}
          <h2 className='h2 my-8'>{templateString(dict.AlternativeOf, product.name)}</h2>
          <ProductListView
            lang={lang}
            data={relativeProducts?.data}/>
        </div>
        <FeaturedProductsView
          className='w-1/3'
          lang={lang}/>
      </div>
    </>
  );
}
