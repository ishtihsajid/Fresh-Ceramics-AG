'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, Heart, Check, Share2, ArrowRight, X, Sparkles } from 'lucide-react'

export interface TileProduct {
  id: string
  code: string
  name: string
  slug: string
  category: 'floor' | 'wall'
  finishName: string
  finishSlug: string
  sizeName: string
  sizeCode: string
  imageUrl?: string
  imageAlt?: string
  isSlim?: boolean
  isHeatproof?: boolean
  waterAbsorption?: string
  mor?: string
  sqftPerBox?: number
}

function getTileRatioClass(sizeCode?: string, sizeName?: string) {
  const code = ((sizeCode || '') + ' ' + (sizeName || '')).toLowerCase()
  if (code.includes('60x120') || code.includes('60 x 120')) {
    return 'w-24 sm:w-28 h-48 sm:h-56 aspect-[1/2]' // 1:2 vertical rectangular
  }
  if (code.includes('80x80') || code.includes('80 x 80')) {
    return 'w-40 sm:w-44 h-40 sm:h-44 aspect-square' // full scale square
  }
  if (code.includes('60x60') || code.includes('60 x 60')) {
    return 'w-30 sm:w-34 h-30 sm:h-34 aspect-square' // 75% scale square
  }
  if (code.includes('40x40') || code.includes('40 x 40')) {
    return 'w-20 sm:w-24 h-20 sm:h-24 aspect-square' // 50% scale square
  }
  if (code.includes('30x30') || code.includes('30 x 30')) {
    return 'w-16 sm:w-18 h-16 sm:h-18 aspect-square' // 37.5% scale square
  }
  if (code.includes('30x60') || code.includes('30 x 60')) {
    return 'w-22 sm:w-26 h-44 sm:h-52 aspect-[1/2]' // 1:2 vertical
  }
  if (code.includes('30x50') || code.includes('30 x 50')) {
    return 'w-24 sm:w-28 h-40 sm:h-46 aspect-[3/5]' // 3:5 vertical
  }
  if (code.includes('30x45') || code.includes('30 x 45')) {
    return 'w-24 sm:w-28 h-36 sm:h-42 aspect-[2/3]' // 2:3 vertical
  }
  if (code.includes('25x40') || code.includes('25 x 40')) {
    return 'w-22 sm:w-26 h-36 sm:h-42 aspect-[5/8]' // 5:8 vertical
  }
  if (code.includes('20x30') || code.includes('20 x 30')) {
    return 'w-18 sm:w-22 h-28 sm:h-34 aspect-[2/3]' // 2:3 vertical
  }
  return 'w-32 h-32 aspect-square'
}

interface TilesCatalogClientProps {
  initialProducts: TileProduct[]
  locale?: string
}

export function TilesCatalogClient({ initialProducts, locale = 'en' }: TilesCatalogClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isBn = locale === 'bn'

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'floor' | 'wall'>('all')
  const [selectedFinish, setSelectedFinish] = useState<string>('all')
  const [selectedSize, setSelectedSize] = useState<string>('all')
  const [selectedFeature, setSelectedFeature] = useState<'all' | 'slim' | 'heatproof'>('all')

  // Shortlist state initialized eagerly from localStorage
  const [shortlist, setShortlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('fresh_shortlist')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) return parsed
        }
      } catch {}
    }
    return []
  })
  const [copiedLink, setCopiedLink] = useState(false)

  // Sync shortlist when window gains focus or storage changes
  useEffect(() => {
    const syncShortlist = () => {
      try {
        const stored = localStorage.getItem('fresh_shortlist')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setShortlist(parsed)
          }
        }
      } catch {}
    }

    syncShortlist()
    window.addEventListener('storage', syncShortlist)
    window.addEventListener('focus', syncShortlist)
    return () => {
      window.removeEventListener('storage', syncShortlist)
      window.removeEventListener('focus', syncShortlist)
    }
  }, [])

  // Initialize from URL search parameters and query shortlist
  useEffect(() => {
    // 1. Initial category/finish/size from URL params if present
    const cat = searchParams.get('category')
    if (cat === 'floor' || cat === 'wall') setCategoryFilter(cat)

    const finish = searchParams.get('finish')
    if (finish) setSelectedFinish(finish)

    const size = searchParams.get('size')
    if (size) setSelectedSize(size)

    // 2. Shortlist from query if shared via URL
    const queryShortlist = searchParams.get('shortlist')
    if (queryShortlist) {
      const codes = queryShortlist.split(',').filter(Boolean)
      setShortlist(codes)
      try {
        localStorage.setItem('fresh_shortlist', JSON.stringify(codes))
      } catch {}
    }
  }, [searchParams])

  const toggleShortlist = (code: string) => {
    let next: string[]
    if (shortlist.includes(code)) {
      next = shortlist.filter((c) => c !== code)
    } else {
      next = [...shortlist, code]
    }
    setShortlist(next)
    try {
      localStorage.setItem('fresh_shortlist', JSON.stringify(next))
    } catch {}
  }

  const copyShareableLink = () => {
    if (shortlist.length === 0) return
    const url = new URL(window.location.href)
    url.searchParams.set('shortlist', shortlist.join(','))
    navigator.clipboard.writeText(url.toString())
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  // Derive unique finishes and sizes from dataset
  const finishOptions = useMemo(() => {
    const map = new Map<string, string>()
    initialProducts.forEach((p) => {
      if (p.finishSlug && p.finishName) map.set(p.finishSlug, p.finishName)
    })
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }))
  }, [initialProducts])

  const sizeOptions = useMemo(() => {
    const map = new Map<string, string>()
    initialProducts.forEach((p) => {
      if (p.sizeCode && p.sizeName) map.set(p.sizeCode, p.sizeName)
    })
    return Array.from(map.entries()).map(([code, name]) => ({ code, name }))
  }, [initialProducts])

  // Instant reactive client-side filtering (0ms latency, zero reload)
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      // Category filter
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false

      // Finish filter
      if (selectedFinish !== 'all' && p.finishSlug !== selectedFinish) return false

      // Size filter
      if (selectedSize !== 'all' && p.sizeCode !== selectedSize) return false

      // Features filter
      if (selectedFeature === 'slim' && !p.isSlim) return false
      if (selectedFeature === 'heatproof' && !p.isHeatproof) return false

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = (p.name || '').toLowerCase().includes(q)
        const matchCode = (p.code || '').toLowerCase().includes(q)
        const matchFinish = (p.finishName || '').toLowerCase().includes(q)
        const matchSize = (p.sizeName || '').toLowerCase().includes(q)
        if (!matchName && !matchCode && !matchFinish && !matchSize) return false
      }

      return true
    })
  }, [initialProducts, categoryFilter, selectedFinish, selectedSize, selectedFeature, searchQuery])

  const resetFilters = () => {
    setSearchQuery('')
    setCategoryFilter('all')
    setSelectedFinish('all')
    setSelectedSize('all')
    setSelectedFeature('all')
  }

  const hasActiveFilters =
    categoryFilter !== 'all' ||
    selectedFinish !== 'all' ||
    selectedSize !== 'all' ||
    selectedFeature !== 'all' ||
    searchQuery.trim().length > 0

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen text-stone">
      {/* Top Banner / Breadcrumb Bar */}
      <div className="bg-stone text-paper pt-28 pb-12 px-6 md:px-12 border-b border-stone-dark">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-fresh-red mb-2">
              <Link href={isBn ? '/bn' : '/'} className="hover:underline">
                {isBn ? 'হোম' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-grey">{isBn ? 'সকল টাইলস ক্যাটালগ' : 'Architectural Tile Catalogue'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-light text-paper tracking-tight">
              {isBn ? (
                <>আর্কিটেকচারাল সারফেস <span className="font-semibold text-white">ক্যাটালগ</span></>
              ) : (
                <>Architectural Surfaces <span className="font-semibold text-white">Catalogue</span></>
              )}
            </h1>
            <p className="text-sm md:text-base text-grey mt-2 max-w-2xl font-light">
              {isBn
                ? '৩৮৫টি অনন্য ফ্লোর ও ওয়াল টাইলসের সম্পূর্ণ কালেকশন। ডাবল চার্জ, মিরর পলিশড এবং টেকসই স্লিম উদ্ভাবন।'
                : '385 calibrated floor and wall porcelain surfaces. Double Charge, Mirror Polished, Matt, Slim and Heatproof.'}
            </p>
          </div>

          {/* Shortlist Floating Quick Bar */}
          <div className="flex items-center gap-3">
            <Link
              href={isBn ? '/bn/shortlist' : '/shortlist'}
              className="inline-flex items-center gap-2 px-5 py-3 bg-fresh-red hover:bg-ember text-white text-xs font-display font-semibold uppercase tracking-wider transition-colors shadow-md"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>
                {isBn ? 'শর্টলিস্ট দেখুন' : 'Shortlist'} ({shortlist.length})
              </span>
            </Link>

            {shortlist.length > 0 && (
              <button
                type="button"
                onClick={copyShareableLink}
                className="inline-flex items-center gap-1.5 px-4 py-3 bg-stone-dark border border-stone-light/30 hover:border-paper text-paper text-xs font-display font-semibold uppercase tracking-wider transition-colors"
                title="Copy shareable shortlist link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied Link' : 'Share'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Filter and Controls Strip */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-stone/15 px-6 md:px-12 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Tabs: All (385), Floor (204), Wall (181) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 text-xs font-display uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                categoryFilter === 'all'
                  ? 'bg-stone text-paper'
                  : 'bg-stone/5 text-stone hover:bg-stone/10'
              }`}
            >
              {isBn ? 'সকল ডিজাইন (৩৮৫)' : 'All Designs (385)'}
            </button>
            <button
              onClick={() => setCategoryFilter('floor')}
              className={`px-4 py-2 text-xs font-display uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                categoryFilter === 'floor'
                  ? 'bg-fresh-red text-white'
                  : 'bg-stone/5 text-stone hover:bg-stone/10'
              }`}
            >
              {isBn ? 'ফ্লোর টাইলস (২০৪)' : 'Floor Tiles (204)'}
            </button>
            <button
              onClick={() => setCategoryFilter('wall')}
              className={`px-4 py-2 text-xs font-display uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                categoryFilter === 'wall'
                  ? 'bg-fresh-red text-white'
                  : 'bg-stone/5 text-stone hover:bg-stone/10'
              }`}
            >
              {isBn ? 'ওয়াল টাইলস (১৮১)' : 'Wall Tiles (181)'}
            </button>
          </div>

          {/* Search Input & Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-stone-dark/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={isBn ? 'নাম বা কোড দিয়ে খুঁজুন...' : 'Search name, code, finish...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone/5 border border-stone/20 text-stone focus:outline-none focus:border-fresh-red"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-dark/50 hover:text-stone"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Finish Filter Dropdown */}
            <select
              value={selectedFinish}
              onChange={(e) => setSelectedFinish(e.target.value)}
              className="py-2 px-3 text-xs bg-stone/5 border border-stone/20 text-stone focus:outline-none focus:border-fresh-red"
            >
              <option value="all">{isBn ? 'সকল ফিনিশ' : 'All Finishes'}</option>
              {finishOptions.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.name}
                </option>
              ))}
            </select>

            {/* Size Filter Dropdown */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="py-2 px-3 text-xs bg-stone/5 border border-stone/20 text-stone focus:outline-none focus:border-fresh-red"
            >
              <option value="all">{isBn ? 'সকল সাইজ' : 'All Sizes'}</option>
              {sizeOptions.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Special Feature Filter Dropdown */}
            <select
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value as any)}
              className="py-2 px-3 text-xs bg-stone/5 border border-stone/20 text-stone focus:outline-none focus:border-fresh-red"
            >
              <option value="all">{isBn ? 'সকল বৈশিষ্ট্য' : 'All Features'}</option>
              <option value="slim">Slim Tiles (25-29% lighter)</option>
              <option value="heatproof">Heatproof (-30% thermal)</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-fresh-red hover:underline uppercase font-display font-semibold tracking-wider px-2 py-1"
              >
                {isBn ? 'রিসেট' : 'Reset'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* Results Counter Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-stone/15 mb-8">
          <p className="text-xs font-display font-medium text-stone-dark">
            {isBn ? 'প্রদর্শিত হচ্ছে' : 'Showing'}{' '}
            <span className="font-bold text-fresh-red">{filteredProducts.length}</span>{' '}
            {isBn ? 'টি ডিজাইন (মোট ৩৮৫ টির মধ্যে)' : `of ${initialProducts.length} designs`}
          </p>

          <span className="text-[11px] font-mono text-stone-dark/70 uppercase">
            {categoryFilter !== 'all' ? `${categoryFilter} Collection` : 'All Categories'}
          </span>
        </div>

        {/* 385 Items Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <SlidersHorizontal className="w-8 h-8 text-stone-dark/40 mx-auto" />
            <h3 className="text-lg font-display font-bold text-stone">
              {isBn ? 'কোনো পণ্য পাওয়া যায়নি' : 'No tiles found matching your criteria'}
            </h3>
            <p className="text-xs text-stone-dark/70 max-w-sm mx-auto">
              {isBn
                ? 'অনুগ্রহ করে ফিল্টার পরিবর্তন করুন অথবা রিসেট বাটনে ক্লিক করুন।'
                : 'Try adjusting your finish, size or search parameters to discover other surfaces.'}
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-stone text-paper text-xs font-display uppercase tracking-wider font-semibold hover:bg-stone-dark"
            >
              {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset All Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const isShortlisted = shortlist.includes(p.code)
              return (
                <div
                  key={p.code}
                  className="product-card group bg-white border border-stone/15 hover:border-fresh-red transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md"
                >
                  {/* Top Swatch / Proportional Physical Tile Frame */}
                  <div className="relative h-64 sm:h-72 w-full bg-[#F4F4F5] p-3 flex items-center justify-center overflow-hidden">
                    {/* Proportional Tile Frame */}
                    <div className={`relative ${getTileRatioClass(p.sizeCode, p.sizeName)} shadow-md border border-black/10 overflow-hidden transition-transform duration-300 group-hover:scale-105 bg-white`}>
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={p.imageAlt || p.name}
                          fill
                          sizes="280px"
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 opacity-20 pointer-events-none"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0px, transparent 2px, transparent 8px)',
                          }}
                        />
                      )}
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-start justify-between pointer-events-none">
                      <span className="text-[10px] font-mono font-bold text-stone-dark/90 bg-white/95 px-1.5 py-0.5 border border-stone/15 shadow-sm">
                        {p.code}
                      </span>

                      {/* Shortlist Toggle Button */}
                      <button
                        type="button"
                        onClick={() => toggleShortlist(p.code)}
                        title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                        className={`pointer-events-auto p-1.5 transition-colors shadow-sm ${
                          isShortlisted
                            ? 'bg-fresh-red text-white'
                            : 'bg-white/90 text-stone hover:text-fresh-red'
                        }`}
                        aria-label={`Shortlist ${p.name}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Ratio / Dimension Badge at Bottom of Canvas */}
                    <div className="absolute bottom-2 left-2 z-10">
                      <span className="text-[9px] font-mono bg-black/70 text-white px-1.5 py-0.5 font-semibold">
                        {p.sizeName}
                      </span>
                    </div>

                    {/* Finish Badge at Bottom Right of Canvas */}
                    <div className="absolute bottom-2 right-2 z-10">
                      <span className="text-[9px] font-display uppercase tracking-wider px-1.5 py-0.5 bg-fresh-red text-white font-semibold shadow-sm">
                        {p.finishName}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Meta & Action */}
                  <div className="p-4 border-t border-stone/10 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-dark/70 uppercase font-mono">
                          {p.category === 'floor' ? 'Floor Porcelain' : 'Wall Ceramic'}
                        </span>
                        {p.isSlim && (
                          <span className="text-[9px] font-mono text-fresh-red bg-fresh-red/10 px-1 py-0.5 font-bold">
                            SLIM
                          </span>
                        )}
                        {p.isHeatproof && (
                          <span className="text-[9px] font-mono text-amber-600 bg-amber-50 px-1 py-0.5 font-bold">
                            HEATPROOF
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-display font-bold text-stone mt-1 line-clamp-1 group-hover:text-fresh-red transition-colors">
                        {p.name}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-stone/10 flex items-center justify-between">
                      <Link
                        href={isBn ? `/bn/tiles/${p.slug}` : `/tiles/${p.slug}`}
                        className="text-xs font-display uppercase tracking-wider font-semibold text-stone hover:text-fresh-red inline-flex items-center gap-1 transition-colors"
                      >
                        <span>{isBn ? 'বিস্তারিত দেখুন' : 'View Tile'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <span className="text-[10px] font-mono text-stone-dark/50">
                        {p.sqftPerBox ? `${p.sqftPerBox} sqft/box` : 'Export Grade A'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
