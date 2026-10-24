'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './Logo'
import { Phone, Search, Menu, X } from 'lucide-react'

type HeaderProps = {
  locale?: 'en' | 'bn'
  activeMode?: 'journey' | 'catalogue'
}

export function Header({ locale = 'en', activeMode }: HeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Listen for Escape key to close menu
  React.useEffect(() => {
    if (!mobileMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  // Determine active view mode
  const isBn = locale === 'bn' || pathname?.startsWith('/bn')
  const currentLocale = isBn ? 'bn' : 'en'
  const isJourney = activeMode ? activeMode === 'journey' : (pathname === '/' || pathname === '/bn')

  const basePrefix = isBn ? '/bn' : ''
  const homePath = isBn ? '/bn' : '/'
  const cataloguePath = `${basePrefix}/tiles`

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 sm:h-20 px-4 md:px-8 bg-[#18181B] border-b border-white/10 shadow-xl pointer-events-auto select-none">
        {/* 1. Left (1/3): Solid Red Brand Plate */}
        <div className="w-1/3 flex items-center justify-start">
          <Link
            href={homePath}
            className="flex items-center justify-center bg-[#E30613] h-10 sm:h-11 px-3 sm:px-4 hover:bg-[#c40510] transition-colors shadow-md"
            title="Fresh Ceramics"
          >
            <Logo variant="white" locale={currentLocale} height={24} width={112} priority />
          </Link>
        </div>

        {/* 2. Centre (1/3): Mathematically Centered Segmented Control "Journey | Catalogue" */}
        <div className="w-1/3 flex items-center justify-center">
          <nav
            aria-label="Experience switcher"
            className="hidden md:flex items-center h-10 bg-white/10 p-1 border border-white/15 text-xs font-semibold uppercase tracking-wider"
          >
            <Link
              href={homePath}
              className={`h-full flex items-center px-4 transition-all ${
                isJourney
                  ? 'bg-[#E30613] text-white shadow-sm font-bold'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {isBn ? 'জার্নি' : 'Journey'}
            </Link>
            <Link
              href={cataloguePath}
              className={`h-full flex items-center px-4 transition-all ${
                !isJourney
                  ? 'bg-[#E30613] text-white shadow-sm font-bold'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {isBn ? 'ক্যাটালগ' : 'Catalogue'}
            </Link>
          </nav>
        </div>

        {/* 3. Right (1/3): Even, Balanced Uniform Height Controls */}
        <div className="w-1/3 flex items-center justify-end space-x-2 sm:space-x-2.5">
          {/* Hotline */}
          <a
            href="tel:16595"
            className="hidden lg:flex items-center space-x-1.5 h-10 px-3.5 bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 text-xs font-semibold"
            title={isBn ? 'হটলাইন কল করুন' : 'Call Hotline 16595'}
          >
            <Phone className="w-3.5 h-3.5 text-[#E30613]" />
            <span>16595</span>
          </a>

          {/* Language switch */}
          <div className="flex items-center h-10 bg-white/5 border border-white/10 text-xs font-semibold overflow-hidden">
            <Link
              href={pathname.replace(/^\/bn/, '') || '/'}
              className={`h-full px-2.5 sm:px-3 flex items-center transition-colors ${
                !isBn ? 'bg-[#E30613] text-white font-bold' : 'text-neutral-300 hover:text-white'
              }`}
            >
              EN
            </Link>
            <Link
              href={pathname.startsWith('/bn') ? pathname : `/bn${pathname === '/' ? '' : pathname}`}
              className={`h-full px-2.5 sm:px-3 flex items-center transition-colors ${
                isBn ? 'bg-[#E30613] text-white font-bold' : 'text-neutral-300 hover:text-white'
              }`}
            >
              বাংলা
            </Link>
          </div>

          {/* Search */}
          <Link
            href={`${basePrefix}/search`}
            className="h-10 w-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
            aria-label={isBn ? 'অনুসন্ধান' : 'Search'}
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-10 flex items-center space-x-2 px-3.5 sm:px-4 bg-[#E30613] text-white hover:bg-[#c40510] transition-colors text-xs font-bold uppercase tracking-wider shadow-sm"
            aria-expanded={mobileMenuOpen}
            aria-label={isBn ? 'মেনু' : 'Menu'}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span className="hidden sm:inline">{isBn ? 'মেনু' : 'Menu'}</span>
          </button>
        </div>
      </header>

      {/* Full screen / Overlay Menu Modal - 100% Solid Opaque #141416 with Zero Background Bleed */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#141416] opacity-100 z-[9999] pointer-events-auto p-6 sm:p-10 md:p-12 flex flex-col justify-between text-white overflow-y-auto select-none shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-6 max-w-5xl mx-auto w-full shrink-0">
            <div className="bg-[#E30613] h-10 px-3.5 flex items-center shadow-md">
              <Logo variant="white" locale={currentLocale} height={24} width={112} />
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-white/10 hover:bg-[#E30613] text-white transition-colors flex items-center gap-2 border border-white/15"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-white" />
              <span className="text-xs uppercase font-display font-semibold tracking-wider">
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </span>
            </button>
          </div>

          <nav className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 py-10 max-w-5xl mx-auto w-full my-auto">
            <div className="space-y-4">
              <h3 className="kicker text-[#E30613] pb-2 border-b border-white/10 font-bold tracking-widest text-xs uppercase">
                {isBn ? 'অনুসন্ধান ও পণ্য' : 'Products & Spaces'}
              </h3>
              <ul className="space-y-3 text-lg font-light">
                <li>
                  <Link
                    href={`${basePrefix}/tiles`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#E30613] transition-colors"
                  >
                    {isBn ? 'সকল টাইলস' : 'All Tiles'}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${basePrefix}/spaces`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#E30613] transition-colors"
                  >
                    {isBn ? 'স্পেস অনুযায়ী' : 'Inspiration by Space'}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${basePrefix}/slim-tiles`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#E30613] transition-colors"
                  >
                    {isBn ? 'স্লিম টাইলস' : 'Slim Tiles'}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${basePrefix}/heatproof-tiles`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#E30613] transition-colors"
                  >
                    {isBn ? 'হিটপ্রুফ টাইলস' : 'Heatproof Tiles'}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${basePrefix}/downloads`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#E30613] transition-colors"
                  >
                    {isBn ? 'ক্যাটালগ ডাউনলোড' : 'Catalogs & Downloads'}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="kicker text-[#E30613] mb-4">
                {isBn ? 'দায়িত্ব ও প্রযুক্তি' : 'Brand & Standards'}
              </h3>
              <ul className="space-y-3 text-lg font-light">
                <li>
                  <Link
                    href={`${basePrefix}/about`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#E30613] transition-colors"
                  >
                    {isBn ? 'আমাদের সম্পর্কে' : 'About Fresh'}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${basePrefix}/sustainability`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#E30613] transition-colors"
                  >
                    {isBn ? 'সাসটেইনেবিলিটি ও কারখানা' : 'Sustainability & Plant'}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${basePrefix}/quality-and-technology`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#E30613] transition-colors"
                  >
                    {isBn ? 'প্রযুক্তি ও মানদণ্ড' : 'Quality & Technology'}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${basePrefix}/initiatives`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#E30613] transition-colors"
                  >
                    {isBn ? 'উদ্যোগ ও কার্যক্রম' : 'Initiatives'}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="kicker text-[#E30613] mb-4">
                {isBn ? 'যোগাযোগ ও নেটওয়ার্ক' : 'Connect'}
              </h3>
              <ul className="space-y-3 text-lg font-light">
                <li>
                  <Link
                    href={`${basePrefix}/showrooms`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#E30613] transition-colors"
                  >
                    {isBn ? 'শোরুম খুঁজুন' : 'Find a Showroom'}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${basePrefix}/fitters`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#E30613] transition-colors"
                  >
                    {isBn ? 'নান্দনিকতার কারিগর (ফিটার)' : 'For Fitters'}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${basePrefix}/professionals`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#E30613] transition-colors"
                  >
                    {isBn ? 'স্থপতি ও ডিজাইনার' : 'For Professionals'}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${basePrefix}/become-a-dealer`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#E30613] transition-colors"
                  >
                    {isBn ? 'ডিলারশিপ আবেদন' : 'Become a Dealer'}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${basePrefix}/contact`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#E30613] transition-colors"
                  >
                    {isBn ? 'যোগাযোগ' : 'Contact'}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-6 text-sm text-neutral-400 max-w-5xl mx-auto w-full shrink-0">
            <p className="flex items-center gap-2">Hotline: <strong className="text-white tracking-wider">16595</strong> (Nationwide)</p>
            <p className="mt-2 sm:mt-0 text-xs">© {new Date().getFullYear()} Fresh Ceramics. All rights reserved.</p>
          </div>
        </div>
      )}
    </>
  )
}
