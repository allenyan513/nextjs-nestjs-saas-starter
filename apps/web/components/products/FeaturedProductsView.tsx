import {getDictionary, t} from "@/dictionaries/dictionaries";
import {strapiClient} from "@/utils/strapi-client";
import ProductCompatListView from "@/components/ProductCompactListView";

export default async function FeaturedProductsView(props: {
  className?: string,
  lang: string,
}) {
  const dict = await getDictionary(props.lang)
  const featuredProducts = await strapiClient.collection('products').find({
    filters: {
      productStatus: {
        $eq: 'Approved',
      },
      featured: {
        $eq: true,
      }
    },
    populate: ['logo'],
    sort: 'createdAt:desc',
    pagination: {
      limit: 10
    },
    locale: props.lang
  })

  return (
    <div className={props.className}>
      <h2 className={'h2'}>{dict.Featured}</h2>
      <ProductCompatListView
        lang={props.lang}
        data={featuredProducts.data as any[]} style={'list'}/>
    </div>
  )
}
