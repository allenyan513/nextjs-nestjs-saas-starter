import {getStrapiMedia} from "@/utils/api-helpers";
import Link from "next/link";
import {formatI18nUrl, getLinkUrl} from "@/utils/utils";
import clsx from "clsx";
import {Product} from "@/types";


export default function ProductListView(props: {
  className?: string,
  lang: string,
  data: any
}) {
  if (!props.data || props.data.length === 0) {
    return null
  }
  return (
    <>
      <div className={clsx(props.className, 'grid grid-cols-1 md:grid-cols-4 gap-4')}>
        {props.data.map((item: Product, index: number) => (
          <Link
            key={item.id}
            target={item.featured ? '_blank' : '_self'}
            href={getLinkUrl(item, props.lang)}
            className={clsx('flex flex-col gap-1 border border-gray-300 rounded shadow-sm hover:shadow-lg transition-shadow duration-300',
              item.featured ? 'border-amber-400' : '',
            )}>
            <div className='relative'>
              {item.screenShot?.url && (
                <img
                  className='w-full rounded-t object-cover aspect-video'
                  src={getStrapiMedia(item.screenShot?.url)}
                  alt={item.name}/>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div className='px-4 pt-2 pb-3 flex flex-col gap-1'>
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
              <p className='line-clamp-2 text-gray-400 text-sm'>{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
