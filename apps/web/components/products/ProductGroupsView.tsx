import {strapiClient} from '@/utils/strapi-client'
import {PRODUCT_CATEGORY_GROUP} from "@/config/groupConfig";
import ProductCompatListView from "@/components/ProductCompactListView";
import {useTranslate} from "@/dictionaries/dictionaries";
import Link from "next/link";

import {
  BsCameraVideo,
  BsCameraReels,
  BsSoundwave,
  BsImages,
  BsPencilSquare,
  BsCodeSlash,
  BsCurrencyDollar,
  BsChatDots,
  BsCrosshair,
  BsSignpostSplit,
  BsFeather,
  BsBug,
  BsGraphUpArrow,
  BsCupHot,
  BsBook,
  BsTextarea,
  BsExclamationOctagon
} from "react-icons/bs";

export const groupIconMap = [
  {
    name: 'video',
    icon: <BsCameraReels className='text-2xl'/>,
  },
  {
    name: 'voice',
    icon: <BsSoundwave className='text-2xl'/>,
  },
  {
    name: 'image',
    icon: <BsImages className='text-2xl'/>,
  }, {
    name: 'text&writing',
    icon: <BsFeather className='text-2xl'/>,
  }, {
    name: 'code&it',
    icon: <BsCodeSlash className='text-2xl'/>,
  }, {
    name: 'business',
    icon: <BsGraphUpArrow className='text-2xl'/>,
  },
  {
    name: 'marketing',
    icon: <BsCameraVideo className='text-2xl'/>,
  },
  {
    name: 'ai-detector',
    icon: <BsCrosshair className='text-2xl'/>,
  },
  {
    name: 'chatbot',
    icon: <BsChatDots className='text-2xl'/>,
  },
  {
    name: 'design&art',
    icon: <BsCameraReels className='text-2xl'/>,
  },
  {
    name: 'life-assistant',
    icon: <BsSignpostSplit className='text-2xl'/>,
  },
  {
    name: 'education',
    icon: <BsBook className='text-2xl'/>,
  },
  {
    name: 'prompt',
    icon: <BsCameraReels className='text-2xl'/>,
  },
  {
    name: 'productivity',
    icon: <BsCupHot className='text-2xl'/>,
  },
  {
    name: 'other',
    icon: <BsExclamationOctagon className='text-2xl'/>,
  }
]


async function fetchData(lang: string) {
  const groups: {
    name: string,
    text: string,
    products: any[]
    productCategories: any[]
  }[] = []
  for (const item of PRODUCT_CATEGORY_GROUP) {
    const productsResponse = await strapiClient.collection('products').find({
      filters: {
        group: {
          $eq: item.name
        },
      },
      fields: ['name', 'description', 'slug'],
      populate: ['logo'],
      pagination: {
        limit: 12
      },
      locale: lang
    })

    const productCategoriesResponse = await strapiClient.collection('product-categories').find({
      filters: {
        group: {
          $eq: item.name
        }
      },
      fields: ['name', 'slug'],
      pagination: {
        limit: 5
      },
    })

    groups.push({
      name: item.name,
      text: item.text,
      products: productsResponse.data,
      productCategories: productCategoriesResponse.data
    })
  }

  return {
    productGroups: groups
  }
}

export default async function ProductGroupsView(props: {
  lang: string,
  className?: string,
}) {
  const t = await useTranslate(props.lang);
  const data = await fetchData(props.lang)
  return (
    <>
      <div className='flex-1 flex flex-col gap-8'>
        {data.productGroups && data.productGroups.map((item) => (
          <div key={item.name} className='flex flex-col gap-4'>
            <h2 className='text-3xl font-semibold flex flex-row gap-2 items-center'>
              {groupIconMap.find((group) => group.name === item.name)?.icon}
              {t(item.text)}
            </h2>
            <div className='flex flex-row flex-wrap gap-2'>
              <Link
                href={``}
                key={item.name}
                className={'flex flex-row items-center gap-2 px-3 py-1 border border-gray-300 rounded-full text-white bg-black'}>
                <span className=''>{t('All')}</span>
              </Link>
              {item.productCategories.map((item) => (
                <Link
                  href={`/${props.lang}/category/${item.slug}`}
                  key={item.name}
                  className={'flex flex-row items-center gap-2 px-3 py-1 border border-gray-300 rounded-full  shadow-sm hover:shadow-lg transition-shadow duration-300 text-black bg-white'}>
                  <span className='line-clamp-1'>{t(item.name)}</span>
                </Link>
              ))}
            </div>
            <ProductCompatListView
              data={item.products}
              style={'grid'}
              lang={props.lang}/>
          </div>
        ))}
      </div>
    </>
  );
}
