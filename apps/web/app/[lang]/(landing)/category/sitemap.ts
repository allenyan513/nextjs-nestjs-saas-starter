import type {MetadataRoute} from 'next'
import {getAllSlugs} from "@/services/product-category-service";
import {i18n} from "@/config/i18n-config";

export async function generateSitemaps() {
  return i18n.locales.map((lang) => {
    return {
      id: lang,
    }
  })
}

export default async function sitemap(props: {
  id: string
}): Promise<MetadataRoute.Sitemap> {
  const result: any[] = []
  const allSlugs = await getAllSlugs()
  for (const slug of allSlugs) {
    result.push({
      url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/${props.id}/category/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }
  return [
    ...result,
  ]
}
