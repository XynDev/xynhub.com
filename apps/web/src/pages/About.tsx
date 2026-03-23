import { useState, useEffect } from "react"
import { cn } from "../lib/utils"
import { BentoCard } from "../components/ui/BentoCard"
import { Button } from "../components/ui/Button"
import { PageHeader } from "../components/layout/PageHeader"
import { SectionHeader } from "../components/layout/SectionHeader"
import { SEO } from "../components/SEO"
import { getPageContent, getTeam } from "../lib/api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

export function About() {
  const [pageData, setPageData] = useState<AnyData | null>(null)
  const [teamData, setTeamData] = useState<AnyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [page, team] = await Promise.all([
          getPageContent("about"),
          getTeam(),
        ])
        setPageData(page)
        setTeamData(team.data)
      } catch (err) {
        console.error("Failed to load about data:", err)
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
  const timeline = pageData.timeline || {}
  const tenets = pageData.tenets || {}
  const culture = pageData.culture || {}
  const leadership = pageData.leadership || {}
  const ctaData = pageData.cta || {}
  const contact = pageData.contact || {}

  // Convert team API response (grouped object) to array format the UI expects
  const teams = teamData
    ? Object.entries(teamData).map(([group, members], idx) => ({
        id: idx + 1,
        group,
        members: members as AnyData[],
      }))
    : leadership.teams || []

  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <SEO title="About Us" description="Architecting the invisible layer between human intent and machine execution." />
      {/* Hero Section */}
      <PageHeader
        label={hero.label}
        headline={hero.headline}
        description={hero.description}
      />

      {/* Story Section: Bento Timeline */}
      <section className="mb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <BentoCard className="md:col-span-8 h-[400px] p-0 relative group !rounded-[3rem]">
            <img alt="Milestone 1" className="w-full h-full object-cover grayscale opacity-50 transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjMLnI54fjZWio56g4iIaHeWsp2W4C0_DUOIufgIkAaN0Ku5QsyIKWhpJZzd3REY-_erVBw_VA5Ew_78sFatguWwQZ28YpwK-mw9jnB3a2w9URMZhQdGGHI7Ht07UAnRwugqw5LVtQsONUrmYxs2M7EJFCjqDp1UNvs_h1QaPCWvH5YNJtiLoccxZFfbcv36ZmWXiLTdAwyD9xw7Ib_IImLqWcy8tt901i6-T7KBx3xlvA7VRttNHwNkZTp7PBmEMe0Ah65D2e_L4" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
            <div className="absolute bottom-12 left-12">
              <span className="label-sm text-primary tracking-widest">EST. 2021</span>
              <h3 className="text-xl md:text-3xl font-bold tracking-tight text-primary mt-2">The Founding</h3>
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-4 flex flex-col justify-center !rounded-[3rem] p-5 md:p-10">
            <span className="text-2xl md:text-4xl font-black text-outline/20 mb-4">{timeline.milestones?.[0]?.id}</span>
            <h4 className="text-xl font-bold text-primary mb-4">{timeline.milestones?.[0]?.title}</h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">{timeline.milestones?.[0]?.description}</p>
          </BentoCard>

          <BentoCard className="md:col-span-4 flex flex-col justify-center order-last md:order-none bg-surface-container-low !rounded-[3rem] p-5 md:p-10">
            <span className="text-2xl md:text-4xl font-black text-outline/20 mb-4">{timeline.milestones?.[1]?.id}</span>
            <h4 className="text-xl font-bold text-primary mb-4">{timeline.milestones?.[1]?.title}</h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">{timeline.milestones?.[1]?.description}</p>
          </BentoCard>

          <BentoCard className="md:col-span-8 h-[400px] p-0 relative group !rounded-[3rem]">
            <img alt="Milestone 2" className="w-full h-full object-cover grayscale opacity-40 transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe06qw0LilAoWCk9KtoDCd3xXnd2tQEl0BgAD_DZKVU-x4vslCpEzlvcB7jAXnqclH0Qr-fxCQ9-Su7ngiLptZKDIF842Sr-IfbDPu45pBBdGpU7Upc1CEJazeUO6w6odkbxhpMTTTqM13tVhtz3FDPg1G0FdnQKwlldI08vxLbvEV_bpJzGJDdSX9T74cHo914VRb2tKz3SYK2A9MjxPilR93L663_bAB-I4TGCXxJpuvknCPy-G3I72V1Eb9Ko_vOz9Mq7g6J5U" />
            <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent opacity-80"></div>
            <div className="absolute bottom-12 left-12">
              <span className="label-sm text-primary tracking-widest">PHASE 03</span>
              <h3 className="text-xl md:text-3xl font-bold tracking-tight text-primary mt-2">Quantum Integration</h3>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-32">
        <SectionHeader title={tenets.title} label={tenets.label} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tenets.items?.map((item: AnyData) => (
            <BentoCard key={item.id} className="bg-surface-container-low hover:bg-surface-container transition-colors duration-300 !rounded-[3rem] p-5 md:p-10 flex flex-col">
              <div className="w-12 h-12 bg-surface-container-high rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4 uppercase tracking-tight">{item.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{item.description}</p>
            </BentoCard>
          ))}
        </div>
      </section>

      {/* Engineering Ethos Section */}
      <section className="mb-32">
        <SectionHeader title={culture.title} label={culture.label} />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {culture.items?.map((item: AnyData) => (
            <BentoCard key={item.id} className={cn(item.span, item.bg, "!rounded-[3rem] p-5 md:p-10 md:p-12 flex flex-col justify-center")}>
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-primary mb-4 uppercase tracking-tighter">{item.title}</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-lg">{item.description}</p>
              </div>
              {item.iconbg && (
                <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[12rem] text-primary/5 group-hover:text-primary/10 transition-colors duration-500">{item.iconbg}</span>
              )}
            </BentoCard>
          ))}
        </div>
      </section>

      {/* Core Leadership Section */}
      <section className="mb-32">
        <SectionHeader title={leadership.title} label={leadership.label} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {teams.map((team: AnyData) => (
            <div key={team.id}>
              <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-outline mb-8">{team.group}</h3>
              <div className="space-y-4">
                {team.members?.map((member: AnyData) => (
                  <div key={member.id} className="flex items-center gap-6 p-6 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-all">
                    <div className="w-16 h-16 rounded-full overflow-hidden grayscale bg-surface-bright">
                      <img alt={member.name} className="w-full h-full object-cover" src={member.image_url || member.image} />
                    </div>
                    <div>
                      <div className="font-bold text-primary tracking-tight">{member.name}</div>
                      <div className="text-[10px] uppercase font-bold text-outline tracking-widest">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join the Revolution Section */}
      <section className="mb-32">
        <BentoCard className="bg-surface-container-high border border-outline-variant/30 p-16 flex flex-col md:flex-row items-center justify-between gap-12 !rounded-[3rem]">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl md:text-4xl md:text-5xl font-black tracking-tighter leading-none mb-6">{ctaData.headline}</h2>
            <p className="text-on-surface-variant font-medium">{ctaData.description}</p>
          </div>
          <Button className="px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity whitespace-nowrap">
            {ctaData.buttonText}
          </Button>
        </BentoCard>
      </section>

      {/* Contact & Global Locations Section */}
      <section className="mb-32">
        <SectionHeader title={contact.title} label={contact.label} />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <BentoCard className="md:col-span-4 bg-surface-container-low !rounded-[3rem] p-5 md:p-10 flex flex-col">
            <h4 className="text-xs font-bold text-outline uppercase tracking-widest mb-6">The Hub</h4>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-primary tracking-tighter mb-2">{contact.hq?.city}</p>
              <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">{contact.hq?.address}</p>
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-8 h-[350px] p-0 relative !rounded-[3rem] bg-surface-container overflow-hidden">
            <div className="absolute inset-0 opacity-20 grayscale scale-110 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="150" fill="white" r="2"></circle>
                <circle cx="500" cy="200" fill="white" r="4"></circle>
                <circle cx="800" cy="300" fill="white" r="2"></circle>
                <path d="M200 150 L500 200 L800 300" fill="none" stroke="white" strokeDasharray="4" strokeWidth="0.5"></path>
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12">
              <div className="text-center">
                <span className="label-sm text-outline tracking-[0.5em] block mb-4">{contact.map?.label}</span>
                <h4 className="text-xl md:text-3xl font-bold text-primary tracking-tighter">{contact.map?.text}</h4>
              </div>
            </div>
          </BentoCard>

          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {contact.channels?.map((ch: AnyData) => (
              <BentoCard key={ch.id} className="!rounded-[2rem] bg-surface-container-lowest border border-outline-variant/20 p-5 md:p-8 flex flex-row items-center gap-4">
                <span className="material-symbols-outlined text-outline">{ch.icon}</span>
                <span className="font-bold text-sm tracking-tight">{ch.text}</span>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
