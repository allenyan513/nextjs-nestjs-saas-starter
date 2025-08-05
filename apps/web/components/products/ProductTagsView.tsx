import {BiAtom, BiCalendarCheck, BiCrown, BiBoltCircle, BiVideo} from "react-icons/bi";
import clsx from "clsx";
import {useTranslate} from "@/dictionaries/dictionaries";
import Link from "next/link";

const tags = [
  {
    name: 'Today',
    url: '/products',
    icon: <BiCalendarCheck/>
  },
  {
    name: 'New',
    url: '/products/new',
    icon: <BiBoltCircle/>
  },
  {
    name: 'Popular',
    url: '/products/popular',
    icon: <BiCrown/>
  }
]

export default async function ProductTagsView(props: {
  activeTag: string
  lang: string
}) {
  const t = await useTranslate(props.lang);
  return (
    <>
      <div className='flex flex-row gap-2 overflow-x-scroll'>
        {tags.map((item) => (
          <Link
            href={`/${props.lang}${item.url}`}
            key={item.name}
            className={clsx('flex flex-row items-center gap-2 border border-gray-300 rounded-full py-1 px-3 min-w-max',
              props.activeTag === item.name ? 'bg-black text-white' : 'bg-white text-black'
            )}>
            {item.icon}
            <span className=''>{t(item.name)}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
