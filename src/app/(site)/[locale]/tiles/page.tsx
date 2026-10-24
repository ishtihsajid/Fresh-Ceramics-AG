import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { TilesCatalogClient, TileProduct } from '@/components/catalogue/TilesCatalogClient'
import exportData from '../../../../../content-export/products.json'

export const dynamic = 'force-dynamic'

export default async function TilesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  let tileProducts: TileProduct[] = []

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'products',
      limit: 500,
      depth: 1,
      sort: 'code',
    })

    if (result.docs && result.docs.length > 0) {
      tileProducts = result.docs.map((doc: any) => ({
        id: String(doc.id),
        code: doc.code,
        name: doc.name || doc.code,
        slug: doc.slug || doc.code.toLowerCase(),
        category: doc.category || 'floor',
        finishName: typeof doc.finish === 'object' && doc.finish ? doc.finish.name : 'Porcelain Finish',
        finishSlug: typeof doc.finish === 'object' && doc.finish ? doc.finish.slug : 'finish',
        sizeName: typeof doc.size === 'object' && doc.size ? (doc.size.label || doc.size.name || '60x60 cm') : '60x60 cm',
        sizeCode: typeof doc.size === 'object' && doc.size ? (doc.size.slug || doc.size.code || '60x60') : '60x60',
        imageUrl: doc.images?.[0]?.url || (doc.images?.[0]?.filename ? `/media/${doc.images[0].filename}` : undefined),
        imageAlt: doc.images?.[0]?.alt || doc.name || doc.code,
        isSlim: Boolean(doc.slim),
        isHeatproof: Boolean(doc.heatproof),
        waterAbsorption: doc.waterAbsorption || '< 0.5%',
        mor: doc.modulusOfRuptureNmm2 ? `${doc.modulusOfRuptureNmm2} N/mm²` : '≥ 35 N/mm²',
        sqftPerBox: doc.sqftPerBox || 15.5,
      }))
    }
  } catch (err) {}

  if (tileProducts.length === 0) {
    tileProducts = (exportData as any[]).map((doc: any) => ({
      id: String(doc.id),
      code: doc.code,
      name: doc.name || doc.code,
      slug: doc.slug || doc.code.toLowerCase(),
      category: doc.category || 'floor',
      finishName: typeof doc.finish === 'object' && doc.finish ? doc.finish.name : 'Porcelain Finish',
      finishSlug: typeof doc.finish === 'object' && doc.finish ? doc.finish.slug : 'finish',
      sizeName: typeof doc.size === 'object' && doc.size ? (doc.size.label || doc.size.name || '60x60 cm') : '60x60 cm',
      sizeCode: typeof doc.size === 'object' && doc.size ? (doc.size.slug || doc.size.code || '60x60') : '60x60',
      imageUrl: doc.images?.[0]?.url || (doc.images?.[0]?.filename ? `/media/${doc.images[0].filename}` : undefined),
      imageAlt: doc.images?.[0]?.alt || doc.name || doc.code,
      isSlim: Boolean(doc.slim),
      isHeatproof: Boolean(doc.heatproof),
      waterAbsorption: doc.waterAbsorption || '< 0.5%',
      mor: doc.modulusOfRuptureNmm2 ? `${doc.modulusOfRuptureNmm2} N/mm²` : '≥ 35 N/mm²',
      sqftPerBox: doc.sqftPerBox || 15.5,
    }))
  }

  return <TilesCatalogClient initialProducts={tileProducts} locale={locale} />
}
