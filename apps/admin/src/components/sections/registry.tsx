"use client";

import type { ComponentType } from "react";

// Home
import { HomeHero, HomeTrust, HomeStats, HomeServices, HomeWorks, HomeWhyUs, HomeCta, HomeContactInfo } from "./home";
// About
import { AboutHero, AboutTimeline, AboutTenets, AboutCulture, AboutLeadership, AboutCta, AboutContact } from "./about";
// Services
import { ServicesHero, ServicesWeb, ServicesTooling, ServicesApp, ServicesCloud, ServicesCta } from "./services";
// Service Detail
import { ServiceDetailHero, ServiceDetailSecurity, ServiceDetailMemory, ServiceDetailRouting, ServiceDetailStress, ServiceDetailHabits, ServiceDetailCta } from "./service-detail";
// Process
import { ProcessHero, ProcessPhases, ProcessPhase4, ProcessPhase5 } from "./process";
// Blogs
import { BlogsHero } from "./blogs";
// Portofolio
import { PortofolioHeader, PortofolioProficiency, PortofolioFeatures, PortofolioContact } from "./portofolio";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D = Record<string, any>;
type SectionForm = ComponentType<{ data: D; onChange: (data: D) => void }>;

const registry: Record<string, Record<string, SectionForm>> = {
  home: {
    hero: HomeHero,
    trust: HomeTrust,
    stats: HomeStats,
    services: HomeServices,
    works: HomeWorks,
    whyUs: HomeWhyUs,
    cta: HomeCta,
    contactInfo: HomeContactInfo,
  },
  about: {
    hero: AboutHero,
    timeline: AboutTimeline,
    tenets: AboutTenets,
    culture: AboutCulture,
    leadership: AboutLeadership,
    cta: AboutCta,
    contact: AboutContact,
  },
  services: {
    hero: ServicesHero,
    web: ServicesWeb,
    tooling: ServicesTooling,
    app: ServicesApp,
    cloud: ServicesCloud,
    cta: ServicesCta,
  },
  "service-detail": {
    hero: ServiceDetailHero,
    security: ServiceDetailSecurity,
    memory: ServiceDetailMemory,
    routing: ServiceDetailRouting,
    stress: ServiceDetailStress,
    habits: ServiceDetailHabits,
    cta: ServiceDetailCta,
  },
  process: {
    hero: ProcessHero,
    phases: ProcessPhases,
    phase4: ProcessPhase4,
    phase5: ProcessPhase5,
  },
  blogs: {
    hero: BlogsHero,
  },
  portofolio: {
    header: PortofolioHeader,
    proficiency: PortofolioProficiency,
    features: PortofolioFeatures,
    contact: PortofolioContact,
  },
};

export function getSectionForm(pageSlug: string, sectionKey: string): SectionForm | null {
  return registry[pageSlug]?.[sectionKey] ?? null;
}

// Description mapping for section info tooltips
export const SECTION_DESCRIPTIONS: Record<string, Record<string, string>> = {
  home: {
    hero: "Main hero banner — version badge, headline, and description",
    trust: "Trusted by section — title and list of client names",
    stats: "Statistics cards — deployments count and client count with descriptions",
    services: "Service cards — tagline and list of services with icon, title, description, image",
    works: "Featured works — title and project cards with label, title, description, image",
    whyUs: "Why choose us — title, description, and numbered feature list",
    cta: "Call-to-action banner — label, headline, description",
    contactInfo: "Contact info — phone, availability, address",
  },
  about: {
    hero: "Page header — label, headline, description",
    timeline: "Timeline milestones — numbered items with title and description",
    tenets: "Core principles — title, label, and items with icon/title/description",
    culture: "Engineering culture — title, label, and items with grid layout settings",
    leadership: "Leadership section header — title and label (team managed separately)",
    cta: "Call-to-action — headline, description, button text",
    contact: "Contact section — HQ info, map info, contact channels",
  },
  services: {
    hero: "Page header — label, headline, status badge",
    web: "Web development card — icon, number, title, description, metrics",
    tooling: "Tooling sidebar — title and stack list",
    app: "App development card — icon, title, description, platforms",
    cloud: "Cloud services card — icon, number, title, features, technologies",
    cta: "Call-to-action — title, description, buttons",
  },
  "service-detail": {
    hero: "Page header — label, title, description",
    security: "Zero-Trust section — icon, title, description, module status list",
    memory: "Memory Safety section — icon, title, description, metrics",
    routing: "Routing section — icon, title, description",
    stress: "Stress testing section — title prefix, highlight text, description",
    habits: "Engineering habits — numbered items with label, title, description",
    cta: "Call-to-action — title, description, button text",
  },
  process: {
    hero: "Page header — label, headline, description",
    phases: "Process phases grid — items with phase label, title, icon, description, layout settings",
    phase4: "Phase 4 cards — side card (icon, title, desc) + main card (phase, title, metrics)",
    phase5: "Phase 5 section — phase, title, description, feature icons",
  },
  blogs: {
    hero: "Blog listing header — label, title, description",
  },
  portofolio: {
    header: "Portfolio header — label, title prefix/suffix, stats badges, description",
    proficiency: "Skills section — label, title, skills with percentages, topology, footer line",
    features: "Feature items — icon, title, description cards",
    contact: "Contact CTA — label, title, description, action button, links",
  },
};
