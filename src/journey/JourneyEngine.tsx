'use client'

import React, { useEffect, useState, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Prelude } from './components/Prelude'
import { ProgressRail } from './components/ProgressRail'
import { Chapter1Dawn } from './scenes/Chapter1Dawn'
import { Chapter2Ground } from './scenes/Chapter2Ground'
import { Chapter3Fire } from './scenes/Chapter3Fire'
import { Chapter4Surface } from './scenes/Chapter4Surface'
import { Chapter5Lighter } from './scenes/Chapter5Lighter'
import { Chapter6Reach } from './scenes/Chapter6Reach'
import { Chapter7Hands } from './scenes/Chapter7Hands'
import { Chapter8Home } from './scenes/Chapter8Home'
import { Chapter9Beyond } from './scenes/Chapter9Beyond'
import { Chapter10Horizon } from './scenes/Chapter10Horizon'

gsap.registerPlugin(ScrollTrigger)

const CHAPTERS = [
  { slug: 'dawn', title: 'A Fresh Start', number: 1, theme: 'dark' as const },
  { slug: 'ground', title: 'Responsible before beautiful', number: 2, theme: 'light' as const },
  { slug: 'fire', title: 'Heat gives form, care gives worth', number: 3, theme: 'dark' as const },
  { slug: 'surface', title: 'Surfaces for every kind of life', number: 4, theme: 'light' as const },
  { slug: 'lighter', title: 'Lighter and cooler', number: 5, theme: 'light' as const },
  { slug: 'reach', title: 'Within your reach', number: 6, theme: 'dark' as const },
  { slug: 'hands', title: 'Finished by hand', number: 7, theme: 'dark' as const },
  { slug: 'home', title: 'A fresh start, room by room', number: 8, theme: 'light' as const },
  { slug: 'beyond', title: 'What we owe beyond the tile', number: 9, theme: 'light' as const },
  { slug: 'horizon', title: 'Dawn again', number: 10, theme: 'dark' as const },
]

interface JourneyEngineProps {
  locale?: string
}

export function JourneyEngine({ locale = 'en' }: JourneyEngineProps) {
  const [isTouch, setIsTouch] = useState(false)
  const [activeSlug, setActiveSlug] = useState('dawn')
  const [activeTheme, setActiveTheme] = useState<'dark' | 'light'>('dark')
  const [preludeDismissed, setPreludeDismissed] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Detect touch device
    const touchQuery = window.matchMedia('(pointer: coarse)')
    setIsTouch(touchQuery.matches)

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let lenis: Lenis | null = null

    if (!touchQuery.matches && !prefersReducedMotion) {
      lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.65,
        touchMultiplier: 1.0,
      })
      lenisRef.current = lenis

      lenis.on('scroll', ScrollTrigger.update)

      gsap.ticker.add((time) => {
        lenis?.raf(time * 1000)
      })
      gsap.ticker.lagSmoothing(0)
    }

    // Mould Calculation: All discrete stopping points (the moulds) across the Journey
    const getMoulds = (): { name: string; y: number }[] => {
      const moulds: { name: string; y: number }[] = []
      const vh = window.innerHeight
      const touch = window.matchMedia('(pointer: coarse)').matches

      const addMould = (name: string, y: number) => {
        const rounded = Math.round(y)
        if (moulds.length === 0 || Math.abs(rounded - moulds[moulds.length - 1].y) > 20) {
          moulds.push({ name, y: rounded })
        }
      }

      // 1. Dawn
      const chDawn = document.getElementById('dawn')
      if (chDawn) {
        addMould('dawn', chDawn.offsetTop)
      }

      // 2. Ground (6 panels)
      const chGround = document.getElementById('ground')
      if (chGround) {
        const top = chGround.offsetTop
        const dist = vh * (touch ? 3.0 : 5.0)
        for (let i = 0; i < 6; i++) {
          addMould(`ground-panel-${i + 1}`, top + (dist * (i / 5)))
        }
      }

      // 3. Fire (7 stations)
      const chFire = document.getElementById('fire')
      if (chFire) {
        const top = chFire.offsetTop
        const dist = vh * (touch ? 2.5 : 3.5)
        for (let i = 0; i < 7; i++) {
          addMould(`fire-station-${i + 1}`, top + (dist * (i / 6)))
        }
      }

      // 4. Surface (Mosaic + Double Charge banner)
      const chSurface = document.getElementById('surface')
      if (chSurface) {
        const top = chSurface.offsetTop
        const dist = vh * (touch ? 1.5 : 2.5)
        addMould('surface-mosaic', top)
        addMould('surface-dc', top + (dist * 0.5))
      }

      // 5. Lighter (Split intro + Slim Calculator)
      const chLighter = document.getElementById('lighter')
      if (chLighter) {
        const top = chLighter.offsetTop
        const dist = vh * (touch ? 1.5 : 2.5)
        addMould('lighter-intro', top)
        addMould('lighter-calc', top + (dist * 0.5))
      }

      // 6. Reach (Bangladesh SVG Map & Showrooms)
      const chReach = document.getElementById('reach')
      if (chReach) {
        addMould('reach', chReach.offsetTop)
      }

      // 7. Hands (Voices & Fitters Program)
      const chHands = document.getElementById('hands')
      if (chHands) {
        const top = chHands.offsetTop
        const dist = vh * (touch ? 1.2 : 2.0)
        addMould('hands-voices', top)
        addMould('hands-doors', top + (dist * 0.65))
      }

      // 8. Home (5 Interior Spaces)
      const chHome = document.getElementById('home')
      if (chHome) {
        const top = chHome.offsetTop
        const dist = vh * (touch ? 2.5 : 4.0)
        for (let i = 0; i < 5; i++) {
          addMould(`home-space-${i + 1}`, top + (dist * (i / 4)))
        }
      }

      // 9. Beyond (3 Sustainability & Craft Initiatives)
      const chBeyond = document.getElementById('beyond')
      if (chBeyond) {
        const top = chBeyond.offsetTop
        const dist = vh * (touch ? 1.5 : 2.4)
        for (let i = 0; i < 3; i++) {
          addMould(`beyond-initiative-${i + 1}`, top + (dist * (i / 3)))
        }
      }

      // 10. Horizon (Dawn Again Vision & Conversion)
      const chHorizon = document.getElementById('horizon')
      if (chHorizon) {
        const top = chHorizon.offsetTop
        const dist = vh * (touch ? 1.2 : 1.8)
        addMould('horizon-vision', top)
        addMould('horizon-actions', top + (dist * 0.6))
      }

      // 11. Footer
      const footer = document.querySelector('footer')
      if (footer) {
        addMould('footer', footer.offsetTop)
      }

      return moulds
    }

    let isTransitioning = false
    let lockUntil = 0
    let accumulatedDelta = 0
    let wheelClearTimer: NodeJS.Timeout
    let settleTimer: NodeJS.Timeout

    const findCurrentMouldIndex = (): number => {
      const moulds = getMoulds()
      if (moulds.length === 0) return 0
      const currentY = window.scrollY
      let closestIdx = 0
      let minDist = Infinity
      for (let i = 0; i < moulds.length; i++) {
        const dist = Math.abs(currentY - moulds[i].y)
        if (dist < minDist) {
          minDist = dist
          closestIdx = i
        }
      }
      return closestIdx
    }

    const goToMouldIndex = (targetIndex: number) => {
      const moulds = getMoulds()
      if (moulds.length === 0) return
      const clampedIndex = Math.max(0, Math.min(moulds.length - 1, targetIndex))
      const target = moulds[clampedIndex]
      if (!target) return

      isTransitioning = true
      lockUntil = Date.now() + 650

      if (lenis) {
        lenis.scrollTo(target.y, {
          duration: 0.65,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => {
            isTransitioning = false
          },
        })
      } else {
        window.scrollTo({ top: target.y, behavior: 'smooth' })
        setTimeout(() => {
          isTransitioning = false
        }, 650)
      }
    }

    // Hash navigation / Active chapter handler
    const updateActiveChapter = () => {
      const scrollY = window.scrollY
      const chElements = CHAPTERS.map((ch) => ({
        slug: ch.slug,
        theme: ch.theme,
        element: document.getElementById(ch.slug),
      })).filter((item) => item.element !== null)

      for (let i = chElements.length - 1; i >= 0; i--) {
        const item = chElements[i]
        if (item.element) {
          const top = item.element.offsetTop
          if (scrollY >= top - window.innerHeight * 0.4) {
            setActiveSlug(item.slug)
            setActiveTheme(item.theme)
            break
          }
        }
      }

      // Mould auto-fitter settle check: if user stops midway, smoothly lock into nearest mould
      clearTimeout(settleTimer)
      settleTimer = setTimeout(() => {
        if (!isTransitioning && Date.now() >= lockUntil) {
          const moulds = getMoulds()
          const currentY = window.scrollY
          const currentIdx = findCurrentMouldIndex()
          const targetMould = moulds[currentIdx]
          if (targetMould && Math.abs(currentY - targetMould.y) > 15) {
            goToMouldIndex(currentIdx)
          }
        }
      }, 180)
    }

    window.addEventListener('scroll', updateActiveChapter, { passive: true })
    updateActiveChapter()

    // Weighted Scroll Wheel Interceptor: deterministic slide advance, zero stranded states
    const WHEEL_THRESHOLD = 110 // Deliberate weighted scroll threshold

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest('select, [data-lenis-prevent], .overflow-y-auto')) {
        return
      }

      e.preventDefault()

      const now = Date.now()
      if (isTransitioning || now < lockUntil) return

      accumulatedDelta += e.deltaY

      clearTimeout(wheelClearTimer)
      wheelClearTimer = setTimeout(() => {
        accumulatedDelta = 0
      }, 250)

      if (Math.abs(accumulatedDelta) >= WHEEL_THRESHOLD) {
        const direction = accumulatedDelta > 0 ? 1 : -1
        accumulatedDelta = 0
        const currentIdx = findCurrentMouldIndex()
        goToMouldIndex(currentIdx + direction)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    // Touch swipe handler
    let touchStartY = 0
    let touchStartTime = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      touchStartTime = Date.now()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const deltaY = touchStartY - touchEndY
      const duration = Date.now() - touchStartTime

      if (Math.abs(deltaY) > 40 && duration < 600) {
        if (isTransitioning || Date.now() < lockUntil) return
        const direction = deltaY > 0 ? 1 : -1
        const currentIdx = findCurrentMouldIndex()
        goToMouldIndex(currentIdx + direction)
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    // Keyboard navigation (Arrow keys and Page keys)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        const currentIdx = findCurrentMouldIndex()
        goToMouldIndex(currentIdx + 1)
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        const currentIdx = findCurrentMouldIndex()
        goToMouldIndex(currentIdx - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Debounced resize handler for ScrollTrigger
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 250)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', updateActiveChapter)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
      clearTimeout(wheelClearTimer)
      clearTimeout(settleTimer)
      if (lenis) {
        lenis.destroy()
        lenisRef.current = null
      }
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  const handleSelectChapter = (slug: string) => {
    const el = document.getElementById(slug)
    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { duration: 1.0 })
      } else {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const isBn = locale === 'bn'

  return (
    <div className="relative w-full bg-ember text-paper selection:bg-fresh-red selection:text-white">
      {/* Skip Link for accessibility */}
      <a
        href={isBn ? '/bn/tiles' : '/tiles'}
        className="sr-only focus:not-sr-only focus:fixed focus:top-20 focus:left-6 focus:z-50 focus:px-4 focus:py-2 focus:bg-fresh-red focus:text-white focus:outline-none text-xs font-display uppercase tracking-widest"
      >
        {isBn ? 'ক্যাটালগে চলে যান' : 'Skip to the catalogue'}
      </a>

      {/* Prelude Animation */}
      {!preludeDismissed && (
        <Prelude onComplete={() => setPreludeDismissed(true)} />
      )}

      {/* Persistent Vertical Progress Rail */}
      <ProgressRail
        chapters={CHAPTERS}
        activeSlug={activeSlug}
        onSelectChapter={handleSelectChapter}
        theme={activeTheme}
      />

      {/* Pinned Scroll Chapters */}
      <main className="relative w-full">
        {/* Chapter 1: Dawn */}
        <Chapter1Dawn locale={locale} isTouch={isTouch} />

        {/* Chapter 2: Ground */}
        <Chapter2Ground locale={locale} isTouch={isTouch} />

        {/* Chapter 3: Fire */}
        <Chapter3Fire locale={locale} isTouch={isTouch} />

        {/* Chapter 4: Surface */}
        <Chapter4Surface locale={locale} isTouch={isTouch} />

        {/* Chapter 5: Lighter and cooler */}
        <Chapter5Lighter locale={locale} isTouch={isTouch} />

        {/* Chapter 6: Reach */}
        <Chapter6Reach locale={locale} isTouch={isTouch} />

        {/* Chapter 7: Hands */}
        <Chapter7Hands locale={locale} isTouch={isTouch} />

        {/* Chapter 8: Home */}
        <Chapter8Home locale={locale} isTouch={isTouch} />

        {/* Chapter 9: Beyond */}
        <Chapter9Beyond locale={locale} isTouch={isTouch} />

        {/* Chapter 10: Horizon */}
        <Chapter10Horizon locale={locale} isTouch={isTouch} />
      </main>
    </div>
  )
}
