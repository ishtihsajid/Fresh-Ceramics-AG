'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Chapter3FireProps {
  locale?: string
  isTouch?: boolean
}

const STATIONS = [
  {
    num: 1,
    titleEn: 'Digital printing',
    titleBn: 'ডিজিটাল প্রিন্টিং',
    detailEn: 'Ultra-high-definition digital ceramic printing units reproducing genuine organic veins.',
    detailBn: 'উচ্চ রেজ্যুলেশন ডিজিটাল সিরামিক প্রিন্টিং প্রযুক্তিতে প্রাকৃতিক মার্বেল টেক্সচার।',
  },
  {
    num: 2,
    titleEn: 'Automated lines',
    titleBn: 'কাটিং-এজ অটোমেটেড টেকনোলজি',
    detailEn: 'Precision continuous press lines engineered for maximum structural density.',
    detailBn: 'সম্পূর্ণ স্বয়ংক্রিয় প্রেস লাইন সর্বোচ্চ কাঠামোগত ঘনত্ব ও স্থায়িত্ব নিশ্চিত করে।',
  },
  {
    num: 3,
    titleEn: 'Nano finish on mirror polished tiles',
    titleBn: 'ন্যানো ফিনিশ মিরর পলিশ',
    detailEn: 'Micro-crystalline molecular seal provides 95+ gloss reflection and scratch resistance.',
    detailBn: 'মাইক্রো-ক্রিস্টালাইন সিলিংয়ের মাধ্যমে স্ক্র্যাচ প্রতিরোধী উজ্জ্বল মিরর পলিশ।',
  },
  {
    num: 4,
    titleEn: "The country's largest polishing line",
    titleBn: 'দেশের বৃহত্তম পলিশিং লাইন',
    detailEn: 'Industry-leading continuous multi-head diamond polishing battery in Bangladesh.',
    detailBn: 'বাংলাদেশে একক ছাদের নিচে সবচেয়ে বড় মাল্টি-হেড ডায়মন্ড পলিশিং লাইন।',
  },
  {
    num: 5,
    titleEn: 'Ultra Fine Squaring, corners that meet',
    titleBn: 'আল্ট্রা ফাইন স্কয়ারিং, নিখুঁত কোণা',
    detailEn: 'Sub-millimeter laser calibrated squaring ensures zero corner gaps and laser-flat joints.',
    detailBn: 'সাব-মিলিমিটার লেজার ক্যালিব্রেশন নিশ্চিত করে নিরবচ্ছিন্ন নিখুঁত জয়েন্ট।',
  },
  {
    num: 6,
    titleEn: 'Fourteen global standard tests',
    titleBn: '১৪টি আন্তর্জাতিক মানের পরীক্ষা',
    detailEn: 'Comprehensive ISO, MOR modulus of rupture and chemical resistance testing.',
    detailBn: 'আইএসও মানদণ্ডে ১৪টি কঠোর ল্যাব পরীক্ষায় উত্তীর্ণ শীর্ষ গুণমান।',
    isCounter14: true,
  },
  {
    num: 7,
    titleEn: 'Ninety-eight percent A-grade',
    titleBn: '৯৮% এ-গ্রেড মান',
    detailEn: 'Automated optical flaw detection certifies 98% A-grade export quality.',
    detailBn: 'স্বয়ংক্রিয় ত্রুটি সনাক্তকরণ দ্বারা প্রত্যয়িত ৯৮% রপ্তানিযোগ্য এ-গ্রেড পণ্য।',
    isCounter98: true,
  },
]

export function Chapter3Fire({ locale = 'en', isTouch = false }: Chapter3FireProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const bgGlowRef = useRef<HTMLDivElement>(null)
  const [activeStationIndex, setActiveStationIndex] = useState(0)
  const [testCount, setTestCount] = useState(0)
  const [gradeCount, setGradeCount] = useState(0)

  const isBn = locale === 'bn'

  useEffect(() => {
    const container = containerRef.current
    const scene = sceneRef.current
    if (!container || !scene) return

    const pinDistance = () => window.innerHeight * (isTouch ? 2.5 : 3.5)

    const ctx = gsap.context(() => {
      const scrollTrigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: () => `+=${pinDistance()}`,
        pin: scene,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress

          // Determine active station from snap intervals cleanly
          const stationIdx = Math.min(6, Math.max(0, Math.round(progress * 6)))
          setActiveStationIndex(stationIdx)

          if (stationIdx < 5) {
            setTestCount(0)
            setGradeCount(0)
          } else if (stationIdx === 5) {
            const p6 = Math.max(0, Math.min(1, (progress - 0.75) / 0.10))
            setTestCount(Math.min(14, Math.round(p6 * 14)))
            setGradeCount(0)
          } else {
            setTestCount(14)
            const p7 = Math.max(0, Math.min(1, (progress - 0.90) / 0.10))
            setGradeCount(Math.min(98, Math.round(p7 * 98)))
          }

          // Ease background from deep ember (#3B0A10 / #5A1219) to stone (#454548 / #2B2B2E)
          if (bgGlowRef.current) {
            const emberToStoneRatio = Math.max(0, Math.min(1, (progress - 0.75) / 0.25))
            bgGlowRef.current.style.opacity = String(1 - emberToStoneRatio * 0.7)
          }
        },
      })
    }, container)

    return () => ctx.revert()
  }, [isTouch])

  return (
    <section
      id="fire"
      ref={containerRef}
      className="relative w-full bg-[#1A0406] text-paper select-none transition-colors duration-700"
    >
      <div
        ref={sceneRef}
        className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col justify-between relative pt-20 sm:pt-24 pb-8 sm:pb-10 px-4 sm:px-8 md:px-12 lg:px-14 bg-gradient-to-b from-[#1F0508] via-[#2A070B] to-[#121214]"
      >
        {/* Real Kiln / High Heat Industrial Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-screen pointer-events-none"
          src="/media/videos/test_30s_desktop.mp4"
        />

        {/* Kiln Thermal Glow Simulating Deep Ember Heat */}
        <div
          ref={bgGlowRef}
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(ellipse at 60% 50%, rgba(227,6,19,0.35) 0%, rgba(90,18,25,0.4) 40%, rgba(20,5,8,0.95) 100%)',
          }}
        >
          {/* Subtle horizontal kiln heat shimmers */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, transparent 2px, transparent 12px)',
            }}
          />
        </div>

        {/* Top Kicker and Chapter Header */}
        <div className="relative z-10 max-w-4xl shrink-0">
          <p className="kicker text-fresh-red tracking-widest uppercase text-xs font-semibold">
            {isBn ? 'অধ্যায় ০৩: আগুন ও মান' : 'Chapter 03: Heat & Craft'}
          </p>
          <h2 className="title-section text-2xl sm:text-4xl md:text-5xl font-light text-paper mt-2 tracking-tight">
            {isBn ? (
              <>উত্তাপ টাইলকে রূপ দেয়। <span className="text-fresh-red font-semibold">যত্ন দেয় তার মান।</span></>
            ) : (
              <>Heat gives a tile its form. <span className="text-fresh-red font-semibold">Care gives it its worth.</span></>
            )}
          </h2>
        </div>

        {/* Middle Stage: Seven Quality Stations Scrub Display */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 my-auto items-center overflow-y-auto max-h-[calc(100dvh-13rem)] py-2 min-h-0">
          {/* Left Column: Vertical Stations Track (Desktop) */}
          <div className="lg:col-span-6 space-y-2 sm:space-y-2.5">
            {STATIONS.map((st, idx) => {
              const isActive = idx === activeStationIndex
              const isPast = idx < activeStationIndex
              return (
                <div
                  key={st.num}
                  className={`flex items-start gap-3 p-2 sm:p-2.5 transition-all duration-300 border-l-2 ${
                    isActive
                      ? 'border-fresh-red bg-stone/40 translate-x-1.5'
                      : isPast
                      ? 'border-fresh-red/40 bg-stone/10 opacity-70'
                      : 'border-white/10 opacity-30'
                  }`}
                >
                  <span
                    className={`text-xs sm:text-sm font-mono font-bold ${
                      isActive ? 'text-fresh-red' : isPast ? 'text-grey' : 'text-grey/40'
                    }`}
                  >
                    0{st.num}
                  </span>
                  <div>
                    <h3
                      className={`text-sm sm:text-base md:text-lg font-medium transition-colors ${
                        isActive ? 'text-paper' : isPast ? 'text-paper/80' : 'text-paper/40'
                      }`}
                    >
                      {isBn ? st.titleBn : st.titleEn}
                    </h3>
                    {isActive && (
                      <p className="text-xs sm:text-sm text-grey mt-0.5 sm:mt-1 leading-relaxed">
                        {isBn ? st.detailBn : st.detailEn}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Dynamic Focal Counter & Inspection Card */}
          <div className="lg:col-span-6 flex flex-col justify-center items-center lg:items-end">
            <div className="w-full max-w-md bg-[#25080C]/85 backdrop-blur-md p-5 sm:p-6 lg:p-8 border border-fresh-red/30 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-8 h-8 bg-fresh-red/20 border-b border-l border-fresh-red/40 flex items-center justify-center text-[10px] text-fresh-red font-mono">
                QC
              </div>

              {activeStationIndex < 5 && (
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-widest text-grey">
                    {isBn ? 'স্বয়ংক্রিয় মান নিয়ন্ত্রণ' : 'Automated Quality Inspection'}
                  </p>
                  <div className="h-32 flex flex-col justify-center">
                    <p className="text-xl md:text-2xl font-light text-paper leading-snug">
                      {isBn
                        ? STATIONS[activeStationIndex].detailBn
                        : STATIONS[activeStationIndex].detailEn}
                    </p>
                  </div>
                  <div className="w-full bg-stone h-1 overflow-hidden">
                    <div
                      className="bg-fresh-red h-full transition-all duration-300"
                      style={{ width: `${((activeStationIndex + 1) / 7) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {activeStationIndex === 5 && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest text-grey">
                    {isBn ? 'ল্যাব টেস্ট মানদণ্ড' : 'Factory Lab Standards'}
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl md:text-7xl font-light text-paper tracking-tighter">
                      {testCount}
                    </span>
                    <span className="text-fresh-red font-display text-lg font-semibold uppercase">
                      {isBn ? 'টি টেস্ট' : 'Global Tests'}
                    </span>
                  </div>
                  <p className="text-xs text-grey">
                    {isBn
                      ? 'ISO স্ট্যান্ডার্ড, ওয়াটার অ্যাবসর্পশন ও মডুলাস অব রাপচার যাচাই।'
                      : 'Verified by length, width, MOR, water absorption and chemical resistance tests.'}
                  </p>
                </div>
              )}

              {activeStationIndex === 6 && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest text-grey">
                    {isBn ? 'প্রিমিয়াম গ্রেডিং' : 'Finished Tile Precision'}
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl md:text-7xl font-light text-paper tracking-tighter">
                      {gradeCount}%
                    </span>
                    <span className="text-fresh-red font-display text-lg font-semibold uppercase">
                      {isBn ? 'এ-গ্রেড' : 'Grade A'}
                    </span>
                  </div>
                  <p className="text-xs text-grey">
                    {isBn
                      ? '৯৮% এ-গ্রেড এক্সপোর্ট কোয়ালিটি, কোনো শেড ভ্যারিয়েশন ছাড়া।'
                      : '98% A-grade export quality delivered with zero shade variance.'}
                  </p>
                </div>
              )}
            </div>

            {/* Machinery & Raw Materials Origin Footer Note */}
            <div className="mt-6 text-right max-w-md">
              <p className="text-[11px] text-grey/80 leading-relaxed">
                {isBn
                  ? 'যন্ত্রপাতি: মার্কিন যুক্তরাষ্ট্র, জার্মানি, ইতালি ও চীন। কাঁচামাল ও রঙ: চীন, মালয়েশিয়া, থাইল্যান্ড, তাইওয়ান, ভারত ও স্পেন।'
                  : 'Machinery: USA, Germany, Italy & China. Pigments & materials: China, Malaysia, Thailand, Taiwan, India & Spain.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Link to Quality & Technology page */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10 shrink-0">
          <p className="text-xs text-grey tracking-wide">
            {isBn ? 'মেঘনাঘাট প্ল্যান্ট ল্যাব টেস্ট ও মানদণ্ড' : 'Meghnaghat plant ISO lab testing & quality control'}
          </p>
          <Link
            href={isBn ? '/bn/quality-and-technology' : '/quality-and-technology'}
            className="inline-flex items-center gap-2 text-xs font-display uppercase tracking-widest text-paper hover:text-fresh-red transition-colors py-2 px-4 border border-white/20 hover:border-fresh-red"
          >
            <span>{isBn ? 'আমাদের প্রযুক্তি ও মানদণ্ড' : 'Our Technology & Standards'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
