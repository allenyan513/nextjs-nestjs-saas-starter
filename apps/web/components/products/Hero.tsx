import SearchBar from "@/components/SearchBar";
import {useTranslate} from "@/dictionaries/dictionaries";
import {strapiClient} from "@/utils/strapi-client";


export default async function Hero(props: {
  lang: string;
}) {
  const t = await useTranslate(props.lang);
  const productResponse = await strapiClient.collection('products').find({
    pagination: {
      limit: 1
    }
  })
  const productCategories = await strapiClient.collection('product-categories').find({
    pagination: {
      limit: 1
    }
  })
  return (
    <>
      <div className='flex flex-col items-center justify-center gap-4 bg-linear py-4 pb-8 custom-padding'>
        <h1 className='text-3xl lg:text-5xl font-semibold text-center'>{t("Discover The Best AI Websites & Tools")}</h1>
        <p
          className='text-center'>{t("{{key0}} AIs and {{key1}} categories in the best AI tools directory. AI tools list & GPTs store are updated daily by ChatGPT.", {
          key0: productResponse.meta.pagination?.total.toString() || '0',
          key1: productCategories.meta.pagination?.total.toString() || '0',
        })}</p>
        <SearchBar
          className='mt-4'
          lang={props.lang}/>
      </div>
    </>
  );
}
