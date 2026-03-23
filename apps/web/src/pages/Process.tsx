import { useState, useEffect } from "react"
import { BentoCard } from "../components/ui/BentoCard"
import { PageHeader } from "../components/layout/PageHeader"
import { SEO } from "../components/SEO"
import { getPageContent } from "../lib/api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

/**
 * Bento layout cycles every 4 phases:
 *  Layout A (index 0): Wide main (8col) + narrow side (4col)
 *  Layout B (index 1): Two equal cards (6col + 6col)
 *  Layout C (index 2): Narrow side (4col) + wide main (8col)
 *  Layout D (index 3): Full-width feature card (12col)
 *
 * Remainder handling for incomplete cycles:
 *  1 remaining: full-width
 *  2 remaining: 6+6
 *  3 remaining: 8+4, then full-width
 */

function PhaseCardWide({ phase }: { phase: AnyData }) {
  return (
    <BentoCard className="p-5 md:p-10 min-h-[400px] h-full bg-surface-container flex flex-col justify-between group">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          {phase.phase && (
            <span className="label-sm text-primary tracking-widest font-bold uppercase">{phase.phase}</span>
          )}
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-primary whitespace-pre-line">{phase.title}</h2>
        </div>
        {phase.icon && (
          <span className="material-symbols-outlined text-2xl md:text-4xl text-primary opacity-20 group-hover:opacity-100 transition-opacity duration-300">{phase.icon}</span>
        )}
      </div>
      <div className="mt-8">
        {phase.description && (
          <p className="text-on-surface-variant leading-relaxed font-medium mb-8">{phase.description}</p>
        )}
        {phase.metric && (
          <div className="bg-surface-container-low rounded-lg p-6 flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">{phase.metric.label}</span>
            <div className="text-xl md:text-3xl font-black text-primary tracking-tighter">{phase.metric.value}</div>
          </div>
        )}
        {phase.tags && phase.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {phase.tags.map((tag: string) => (
              <span key={tag} className="px-4 py-2 bg-surface-container-highest rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                {tag}
              </span>
            ))}
          </div>
        )}
        {phase.metrics && phase.metrics.length > 0 && (
          <div className="flex gap-8 items-center flex-wrap">
            {phase.metrics.map((m: AnyData, i: number) => (
              <div key={i} className="flex flex-col">
                <span className="text-[0.6rem] font-black uppercase tracking-widest text-on-surface-variant">{m.label}</span>
                <span className="text-2xl font-bold text-primary tracking-tighter">{m.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </BentoCard>
  )
}

function PhaseCardNarrow({ phase }: { phase: AnyData }) {
  return (
    <BentoCard className="p-5 md:p-8 h-full bg-surface-container-high flex flex-col justify-end gap-4 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-6 opacity-10">
        {phase.icon && (
          <span className="material-symbols-outlined text-[8rem]">{phase.icon}</span>
        )}
      </div>
      <div className="relative z-10">
        {phase.phase && (
          <span className="label-sm text-primary tracking-widest font-bold uppercase text-xs">{phase.phase}</span>
        )}
        <h3 className="text-xl font-bold text-primary mt-1">{phase.title}</h3>
        {phase.description && (
          <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">{phase.description}</p>
        )}
        {phase.metric && (
          <div className="mt-4 bg-surface-container-low rounded-lg p-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">{phase.metric.label}</span>
            <div className="text-lg font-black text-primary tracking-tighter">{phase.metric.value}</div>
          </div>
        )}
      </div>
    </BentoCard>
  )
}

function PhaseCardFull({ phase }: { phase: AnyData }) {
  return (
    <BentoCard className="p-5 md:p-10 bg-surface-container-lowest border border-outline-variant/10 flex flex-col md:flex-row gap-12 group">
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {phase.phase && (
            <span className="label-sm text-primary tracking-widest font-bold uppercase">{phase.phase}</span>
          )}
          <h2 className="text-xl md:text-3xl md:text-5xl font-extrabold tracking-tighter text-primary mt-4 whitespace-pre-line">{phase.title}</h2>
        </div>
        {phase.description && (
          <p className="text-on-surface-variant mt-8 max-w-md font-medium">{phase.description}</p>
        )}
        {phase.metric && (
          <div className="mt-6 bg-surface-container-low rounded-lg p-6 max-w-xs">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">{phase.metric.label}</span>
            <div className="text-xl md:text-3xl font-black text-primary tracking-tighter">{phase.metric.value}</div>
          </div>
        )}
        {phase.tags && phase.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {phase.tags.map((tag: string) => (
              <span key={tag} className="px-4 py-2 bg-surface-container-highest rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                {tag}
              </span>
            ))}
          </div>
        )}
        {phase.metrics && phase.metrics.length > 0 && (
          <div className="mt-6 flex gap-8 items-center flex-wrap">
            {phase.metrics.map((m: AnyData, i: number) => (
              <div key={i} className="flex flex-col">
                <span className="text-[0.6rem] font-black uppercase tracking-widest text-on-surface-variant">{m.label}</span>
                <span className="text-2xl font-bold text-primary tracking-tighter">{m.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {phase.features && phase.features.length > 0 && (
        <div className="flex-1 grid grid-cols-2 gap-4">
          {phase.features.map((feature: AnyData, i: number) => (
            <div key={i} className="bg-surface-container-high rounded-lg p-6 flex flex-col justify-center gap-2">
              {feature.icon && <span className="material-symbols-outlined text-primary">{feature.icon}</span>}
              <div className="text-xl font-bold text-primary">{feature.title}</div>
            </div>
          ))}
        </div>
      )}
    </BentoCard>
  )
}

export function Process() {
  const [pageData, setPageData] = useState<AnyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const page = await getPageContent("process")
        setPageData(page)
      } catch (err) {
        console.error("Failed to load process data:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading || !pageData) {
    return (
      <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto flex items-center justify-center min-h-screen">
        <div className="text-on-surface-variant text-sm uppercase tracking-widest animate-pulse">Loading...</div>
      </main>
    )
  }

  const hero = pageData.hero || {}

  // Unify all phases into a single flat array
  // Support both new (all in phases.items) and legacy (phases + phase4 + phase5) formats
  const phasesData = pageData.phases || {}
  const rawPhases: AnyData[] = Array.isArray(phasesData) ? phasesData : (phasesData.items || [])

  // Flatten legacy phase4/phase5 into the array if they exist and aren't already in phases
  const allPhases: AnyData[] = [...rawPhases]
  if (pageData.phase4) {
    const p4 = pageData.phase4
    // Legacy format: { sideCard: {...}, mainCard: {...} } → flatten into two items
    if (p4.sideCard && p4.mainCard) {
      const hasSide = allPhases.some(p => p.id === "p4-side")
      if (!hasSide) {
        allPhases.push({ ...p4.sideCard, id: "p4-side", isSideCard: true })
        allPhases.push({ ...p4.mainCard, id: "p4-main" })
      }
    }
  }
  if (pageData.phase5) {
    const p5 = pageData.phase5
    const hasP5 = allPhases.some(p => p.id === "p5")
    if (!hasP5) {
      allPhases.push({ ...p5, id: "p5" })
    }
  }

  // Separate main phases from side cards
  const mainPhases = allPhases.filter(p => !p.isSideCard)
  const sideCards = allPhases.filter(p => p.isSideCard)

  // Build layout rows using cycling bento pattern
  const rows: { type: string; phases: AnyData[] }[] = []
  let mainIdx = 0
  let sideIdx = 0
  let cyclePos = 0

  while (mainIdx < mainPhases.length) {
    const remaining = mainPhases.length - mainIdx

    if (remaining === 1) {
      // Last single phase → full width
      rows.push({ type: "full", phases: [mainPhases[mainIdx]] })
      mainIdx++
    } else {
      // Cycle: A (wide+side), B (equal), C (side+wide), D (full)
      const pos = cyclePos % 4

      if (pos === 0 && sideIdx < sideCards.length) {
        // Layout A: Wide main (8col) + narrow side card (4col)
        rows.push({ type: "wide-narrow", phases: [mainPhases[mainIdx], sideCards[sideIdx]] })
        mainIdx++
        sideIdx++
      } else if (pos === 0) {
        // No side card available → wide main + narrow from main phases
        rows.push({ type: "wide-narrow", phases: [mainPhases[mainIdx], mainPhases[mainIdx + 1]] })
        mainIdx += 2
      } else if (pos === 1) {
        // Layout B: Two equal cards (6col + 6col)
        rows.push({ type: "equal", phases: [mainPhases[mainIdx], mainPhases[mainIdx + 1]] })
        mainIdx += 2
      } else if (pos === 2 && sideIdx < sideCards.length) {
        // Layout C: Narrow side (4col) + wide main (8col)
        rows.push({ type: "narrow-wide", phases: [sideCards[sideIdx], mainPhases[mainIdx]] })
        mainIdx++
        sideIdx++
      } else if (pos === 2) {
        rows.push({ type: "narrow-wide", phases: [mainPhases[mainIdx + 1], mainPhases[mainIdx]] })
        mainIdx += 2
      } else {
        // Layout D: Full width
        rows.push({ type: "full", phases: [mainPhases[mainIdx]] })
        mainIdx++
      }
      cyclePos++
    }
  }

  // If there are leftover side cards, add them
  while (sideIdx < sideCards.length) {
    if (sideIdx + 1 < sideCards.length) {
      rows.push({ type: "equal", phases: [sideCards[sideIdx], sideCards[sideIdx + 1]] })
      sideIdx += 2
    } else {
      rows.push({ type: "full", phases: [sideCards[sideIdx]] })
      sideIdx++
    }
  }

  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <SEO title="Our Process" description="From conceptual architecture to full scale systems deployment." />
      <PageHeader
        label={hero.label}
        headline={hero.headline}
      >
        {hero.description && (
          <p className="text-on-surface-variant text-lg leading-relaxed font-medium text-left md:text-right">
            {hero.description}
          </p>
        )}
      </PageHeader>

      <div className="space-y-6">
        {rows.map((row, rowIdx) => {
          if (row.type === "full") {
            return (
              <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-12">
                  <PhaseCardFull phase={row.phases[0]} />
                </div>
              </div>
            )
          }

          if (row.type === "wide-narrow") {
            return (
              <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8">
                  <PhaseCardWide phase={row.phases[0]} />
                </div>
                <div className="md:col-span-4">
                  <PhaseCardNarrow phase={row.phases[1]} />
                </div>
              </div>
            )
          }

          if (row.type === "narrow-wide") {
            return (
              <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4">
                  <PhaseCardNarrow phase={row.phases[0]} />
                </div>
                <div className="md:col-span-8">
                  <PhaseCardWide phase={row.phases[1]} />
                </div>
              </div>
            )
          }

          // equal: 6+6
          return (
            <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-6">
                <PhaseCardWide phase={row.phases[0]} />
              </div>
              <div className="md:col-span-6">
                <PhaseCardWide phase={row.phases[1]} />
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
