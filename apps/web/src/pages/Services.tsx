import { BentoCard } from "../components/ui/BentoCard"
import { Button } from "../components/ui/Button"
import { PageHeader } from "../components/layout/PageHeader"
import { Link } from "react-router-dom"
import servicesData from "../data/list_services.json"

export function Services() {
  return (
    <main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">
      <PageHeader 
        label={servicesData.hero.label}
        headline={servicesData.hero.headline}
      >
        <div className="flex flex-col md:items-end w-full">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {servicesData.hero.status.text}
            </span>
          </div>
        </div>
      </PageHeader>

      {/* Bento Grid Structure */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Web Architecture Card */}
        <BentoCard className="md:col-span-8 group p-10 md:p-14 min-h-[500px]">
          <div className="h-full flex flex-col relative z-10">
            <div className="flex items-start justify-between mb-12">
              <div>
                <span className="material-symbols-outlined text-4xl text-primary mb-4">{servicesData.web.icon}</span>
                <h2 className="text-3xl font-bold tracking-tight text-primary">{servicesData.web.title}</h2>
              </div>
              <div className="text-right">
                <span className="text-5xl font-black text-on-surface-variant/20 tracking-tighter">{servicesData.web.number}</span>
              </div>
            </div>
            <p className="text-on-surface-variant max-w-lg mb-12 leading-relaxed text-lg">
              {servicesData.web.description}
            </p>
            <div className="mt-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
              {servicesData.web.metrics.map(metric => (
                <div key={metric.label} className="p-5 rounded-2xl bg-surface-container-low flex flex-col gap-1">
                  <span className="label-sm text-outline uppercase tracking-widest text-[10px]">{metric.label}</span>
                  <span className="text-xl font-bold text-primary tracking-tight">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* Tech Stack Tooling */}
        <BentoCard className="md:col-span-4 bg-surface-container-high p-10">
          <h3 className="label-sm text-on-surface-variant font-bold uppercase tracking-widest mb-8">{servicesData.tooling.title}</h3>
          <ul className="space-y-4">
            {servicesData.tooling.stack.map(tech => (
              <li key={tech.name} className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/10">
                <span className="font-bold text-sm tracking-tight">{tech.name}</span>
                <span className="material-symbols-outlined text-outline">check_circle</span>
              </li>
            ))}
          </ul>
        </BentoCard>

        {/* App Development Card */}
        <BentoCard className="md:col-span-5 bg-surface-container-high p-10 min-h-[400px]">
          <div className="flex flex-col h-full">
            <div className="mb-12">
              <span className="material-symbols-outlined text-4xl mb-4 text-primary">{servicesData.app.icon}</span>
              <h2 className="text-3xl font-bold tracking-tight text-primary">{servicesData.app.title}</h2>
            </div>
            <p className="mb-12 text-on-surface-variant leading-relaxed text-lg font-medium">
              {servicesData.app.description}
            </p>
            <div className="mt-auto space-y-4">
              {servicesData.app.platforms.map(platform => (
                <div key={platform} className="flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-sm font-bold uppercase tracking-widest text-on-surface">{platform}</span>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* Cloud Solutions Card */}
        <BentoCard className="md:col-span-7 relative overflow-hidden group p-10 md:p-14 min-h-[400px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-start justify-between mb-12">
              <div>
                <span className="material-symbols-outlined text-4xl text-primary mb-4">{servicesData.cloud.icon}</span>
                <h2 className="text-3xl font-bold tracking-tight text-primary">{servicesData.cloud.title}</h2>
              </div>
              <div className="text-right">
                <span className="text-5xl font-black text-on-surface-variant/20 tracking-tighter">{servicesData.cloud.number}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {servicesData.cloud.features.map(feat => (
                <div key={feat.title}>
                  <h4 className="label-sm text-outline mb-4 uppercase tracking-widest">{feat.title}</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-auto flex flex-wrap gap-3">
              {servicesData.cloud.technologies.map(tech => (
                <span key={tech} className="px-5 py-2.5 rounded-xl border border-outline-variant/30 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* Call to Action */}
        <BentoCard className="md:col-span-12 flex flex-col md:flex-row items-center justify-between gap-12 bg-surface-container p-12 lg:p-16">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-primary mb-4">{servicesData.cta.title}</h2>
            <p className="text-on-surface-variant text-lg font-medium">{servicesData.cta.description}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {servicesData.cta.buttons.map((btn, i) => (
              <Link key={i} to="/services/web-app">
                <Button variant={btn.variant as "primary" | "secondary"} className="px-10 py-4 font-bold tracking-widest text-sm w-full sm:w-auto">
                  {btn.text}
                </Button>
              </Link>
            ))}
          </div>
        </BentoCard>

      </div>
    </main>
  )
}
