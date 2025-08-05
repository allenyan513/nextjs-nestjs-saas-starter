import Link from "next/link";

export interface BreadCrumbItem {
  name: string
  url: string
}

export interface BreadCrumbProps {
  data: BreadCrumbItem[]
}

export default function BreadCrumb(props: {
  data: BreadCrumbItem[]
  className?: string
}) {
  return (
    <div className='flex flex-row gap-2'>
      {props.data.map((item: BreadCrumbItem, index: number) => (
        <div key={index} className='flex flex-row gap-2'>
          <Link href={item.url} className='text-gray-500 hover:text-gray-800'>
            {item.name}
          </Link>
          {index < props.data.length - 1 && (
            <span className='text-gray-500'>{">"}</span>
          )}
        </div>
      ))}
    </div>
  )
}
