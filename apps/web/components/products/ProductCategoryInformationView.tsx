import RichText from "@/components/RichText";
import {getDictionary, t} from "@/dictionaries/dictionaries";
import ProductTableView from "@/components/ProductTableView";
import clsx from "clsx";


export default async function ProductCategoryInformationView(props: {
  className?: string,
  lang: string,
  productCategory: any,
  topProducts: any[],
  latestProducts: any[],
}) {
  const dict = await getDictionary(props.lang)
  return (
    <div
      className={clsx(`flex flex-col w-full rounded border border-gray-300 px-5 py-4 gap-2 bg-white`, props.className)}>
      <h2 className={'h2'}>{dict.whatIs} {props.productCategory.name}</h2>
      <RichText data={{
        body: props.productCategory.description,
      }}/>
      <div className='divider'/>

      <h2 className={'h2'}>{t(dict.whatIsTheTop10AITools, {name: props.productCategory.name})}</h2>
      <ProductTableView data={props.topProducts.slice(0, 10)}/>
      <div className='divider'/>

      <h2 className={'h2'}>Newest {props.productCategory.name} AI Tools & Websites</h2>
      <ProductTableView data={props.latestProducts}/>
      <div className='divider'/>

      <h2 className={'h2'}>{props.productCategory.name} Core Features</h2>
      <RichText data={{
        body: props.productCategory.featuresmd,
      }}/>
      <div className='divider'/>
      <h2 className={'h2'}>Who is suitable to use {props.productCategory.name}</h2>
      <RichText data={{
        body: props.productCategory.whoToUse,
      }}/>
      <div className='divider'/>
      <h2 className={'h2'}>How does {props.productCategory.name} work?</h2>
      <RichText data={{
        body: props.productCategory.howItWork,
      }}/>
      <div className='divider'/>
      <h2 className={'h2'}>Advantages of {props.productCategory.name}</h2>
      <RichText data={{
        body: props.productCategory.advantages,
      }}/>
      <div className='divider'/>
      <h2 className={'h2'}>FAQ about {props.productCategory.name}</h2>
      <RichText data={{
        body: props.productCategory.faqs,
      }}/>
    </div>
  )
}
