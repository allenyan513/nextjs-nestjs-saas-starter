import {getStrapiMedia} from "@/utils/api-helpers";
import Link from "next/link";
import {Product} from "@/types";
import {formatI18nUrl, getLinkUrl} from "@/utils/utils";
import clsx from "clsx";


export default function ProductCompatListView(props: {
  lang: string
  data: any[]
  style?: 'grid' | 'list'
}) {
  if (!props || !props.data || props.data.length === 0) {
    return null
  }

  function cn(arg0: string): string | undefined {
    throw new Error("Function not implemented.");
  }

  return (
    <div className={
      props.style === 'list' ? `flex flex-col gap-4 ` : `grid grid-cols-2 md:grid-cols-4 gap-4`}>
      {props.data.map((item: Product, index: number) => (
        <Link
          key={item.id}
          target={item.featured ? '_blank' : '_self'}
          href={getLinkUrl(item, props.lang)}
          className={clsx('flex flex-col border border-gray-300 rounded px-4 py-3 gap-2 justify-start items-start shadow-sm hover:shadow-lg transition-shadow duration-300',
            item.featured ? 'border-amber-400':'',
          )}>
          <div className='flex flex-row gap-2 items-center'>
            {item.logo?.url ? (
              <img
                className='w-5 h-5 rounded-full object-cover'
                src={getStrapiMedia(item.logo?.url)}
                alt={item.name}/>
            ) : (
              <div>
                <p
                  className='w-6 h-6 rounded-full bg-black text-white text-center'>{item.name.charAt(0).toUpperCase()}</p>
              </div>
            )}
            <p className="text-lg font-semibold line-clamp-1">{item.name}</p>
          </div>
          <p className='text-gray-400 text-sm line-clamp-2 whitespace-break-spaces'>{item.description}</p>
        </Link>
      ))}
    </div>
  );
}
