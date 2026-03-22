-- ============================================================
-- XYNHub CMS Seed Data (Complete)
-- Includes: settings, navigation, footer, pages, blogs,
--   portfolios, testimonials, team, faqs, services,
--   privacy-policy, terms-of-service
-- ============================================================

-- ============================================================
-- SITE SETTINGS
-- ============================================================
INSERT INTO site_settings (key, value) VALUES
('site_name', '{"value": "XYNHub"}'),
('site_description', '{"value": "Engineering the next generation of digital monoliths."}'),
('logo_light', '{"url": "/logo-text-dark.png"}'),
('logo_dark', '{"url": "/logo-text-white.png"}'),
('logo_icon_light', '{"url": "/logo-only-dark.png"}'),
('logo_icon_dark', '{"url": "/logo-only-white.png"}'),
('seo_default', '{"title": "XYNHub - The Architecture of Pure Performance", "description": "XYN provides the low-latency infrastructure required for next-generation synaptic computing and distributed ecosystem management.", "keywords": "infrastructure, low-latency, synaptic computing, distributed systems", "image": "/og-xynhub.png"}'),
('social_links', '{"github": "https://github.com/xyn-nodes", "telegram": "https://t.me/xyn_official", "email": "protocols@xyn.eth"}'),
('header_cta', '{"value": {"text": "Get Started", "url": "/services"}}'),
('contact_email', '{"value": "hello@xynhub.com"}');

-- ============================================================
-- NAVIGATION ITEMS
-- ============================================================
INSERT INTO navigation_items (label, path, sort_order, is_active) VALUES
('Home', '/', 1, true),
('About', '/about', 2, true),
('Services', '/services', 3, true),
('Process', '/process', 4, true),
('Portofolio', '/portofolio', 5, true),
('Intel', '/blogs', 6, true);

-- ============================================================
-- FOOTER SECTIONS
-- ============================================================
INSERT INTO footer_sections (section_key, title, content, sort_order) VALUES
('brand', 'XYNHub', '{"description": "Engineering the next generation of digital monoliths. We architect the invisible infrastructure that powers tomorrow."}', 1),
('platform', 'Platform', '{"links": [{"label": "Infrastructure", "url": "#"}, {"label": "Security", "url": "#"}, {"label": "Ecosystem", "url": "#"}, {"label": "Services", "url": "/services"}]}', 2),
('company', 'Company', '{"links": [{"label": "About Us", "url": "/about"}, {"label": "Process", "url": "/process"}, {"label": "Portfolio", "url": "/portofolio"}, {"label": "Blog", "url": "/blogs"}]}', 3),
('newsletter', 'Newsletter', '{"description": "Get the latest system updates.", "placeholder": "Email Address", "button_text": "Join"}', 4),
('bottom', 'Bottom', '{"copyright": "\u00a9 2026 XYN Engineering Ecosystem. All rights reserved.", "links": [{"label": "Privacy Policy", "url": "/privacy-policy"}, {"label": "Terms of Service", "url": "/terms-of-service"}]}', 5);

-- ============================================================
-- HOME PAGE CONTENT
-- ============================================================
INSERT INTO page_contents (page_slug, section_key, content, sort_order) VALUES
('home', 'hero', '{
  "version": "v2.5 Neural Core Live",
  "headline": "The Architecture of Pure Performance.",
  "description": "XYN provides the low-latency infrastructure required for next-generation synaptic computing and distributed ecosystem management."
}', 1),
('home', 'trust', '{
  "title": "Trusted by Global Innovators",
  "clients": [
    {"name": "VERTEX", "logo": ""},
    {"name": "QUANTUM", "logo": ""},
    {"name": "NEXUS.IO", "logo": ""},
    {"name": "SYNAPSE", "logo": ""},
    {"name": "CORE.SYS", "logo": ""}
  ]
}', 2),
('home', 'stats', '{
  "deployments": {
    "value": "50+",
    "label": "Global Deployments",
    "description": "Strategic infrastructure nodes distributed across six continents for ultra-low latency response."
  },
  "clients": {
    "value": "12+",
    "label": "Strategic Clients",
    "description": "Partnering with industry leaders to redefine the boundaries of synaptic computation."
  }
}', 3),
('home', 'services', '{
  "tagline": "Specialized solutions for a connected world.",
  "items": [
    {
      "id": "synaptic-routing",
      "title": "Synaptic Routing",
      "description": "Advanced packet distribution systems optimized for sub-millisecond neural network communication.",
      "icon": "hub",
      "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBd2Rnk3Tq9_5hXkBzjUR64oCwjPJrK4CoNmhXKU_iOXijDng-1DK_aXEdkQM-1_D63UEIkXgq55aUfkuZBGf1RHJOWFVO7JPNbi2iH6a3rG2rxTKDaE8DrlDkHxIFSywoV052uryOYscaMBtkLtGW8VU4YGuek5L1TQ-bUl8VGmie0UvIsZmMh3tm2lHicaaBSPX1A_2GAIVm-o66YCT_CFz2scpYgRGJXdgS0Uo5bzXy6KUtlzLauzU_PDsA7O6yPY2UqmNoVKUY"
    },
    {
      "id": "distributed-ledger",
      "title": "Distributed Ledger",
      "description": "High-integrity consensus mechanisms for secure, decentralized ecosystem governance.",
      "icon": "dataset",
      "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDnFpez7dIK63My52uG9jD724wbPEaPGMTiR8Ads4Z-6m_vXqnQDoeoyta381rSuS_hbXS5Qx22kXZMB0QMFgFechmwl_qHgpG6W-pqn5HGe_YS-LI4HiHMn4EJpNpWPnpTKlgtnBgypS-kcErgmEJSxBR3ET4p2jFhFmPtLT5_c7p65VOax6T42rPswlm0Vd07XOnXlMCjNjNeyC9-diXx1wZOyfYPKmdKy9NQXZNykqyUepJIKH353nsra2DupDWbzvul5B4aquw"
    },
    {
      "id": "edge-compute",
      "title": "Edge Compute",
      "description": "Localized processing units that minimize data transit times and maximize operational efficiency.",
      "icon": "memory",
      "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDZR5mZiCVDvN1PXCrUlbE_2wzlTEZNQdPxyIp33XJ6CWL6_q1voPQxmL4swtqx2iGpz46JWUydg5G8GZ4S5exr5wr41J2tdS-B5-gIzBusk0yOFnvmhQVZaJqrix0_wRnpES64Hds7Vh8oOomaKqJgI-rAyr3CqVqT93uDpSbT3vB8f4PRrTuvoUQ042U_uqbRdIhL_ndZRiMmmt9nN-EDbMz8n0oDCrZUUAN_CiutXBASeXI4NctbM-ID8_wW_fMK-KK8uZaL40k"
    }
  ]
}', 4),
('home', 'works', '{
  "title": "Proven implementations.",
  "projects": [
    {
      "id": "alpha",
      "label": "Project Alpha",
      "title": "Global Quantum Grid",
      "description": "Securing cross-continental financial transactions with zero-latency verification protocols.",
      "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuChrUihlWy9ExjKnOesL3jyU7kMLkHFXI-ifGyIw4rPqVhQ7kVaiGoMeDWrW-xladqU_OURmtFsEn4L8bX-Ye31Xl99yNONCFCksCV4HOKB7tEVr53RpVAS3-3_jUn8s2gzlQBDASzmr6z0as2jaUXQppm_DLlqmBqSLmds07UOgqoL1_JX9hm79I2FUuuFkdoxG3D1NT3RPhZGszloP7NSX6JdY3r-nceSimBubLSZ0TWui33KUm5_1qR3y3jOy4OuUsVebVjoY3Y"
    },
    {
      "id": "mesh",
      "label": "Case Study #04",
      "title": "Neural Data Mesh",
      "description": "Connecting distributed AI clusters into a singular, cohesive processing organism.",
      "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBYARelEpIWsJDqVb3Q7ODOsEC6-9K6Q6CYJhGKytY3RMiMzYDX3ogu7hCjG4G2S_cfydDxOuNP1Cw31wIPs__yDVtpUt9e4VfALPqQBSIHhlpY4SFdYFlBNCTYsuRGBYuP2ieqlU7_LeQ0SVCdokQS1gX4k7lvvAX6YvB-lJDq8PSrv9a6uO2IwQN0QQ8hftmnFQIZaiZIEz8P4wAbn8NGW70n0a466NEiUYOHsF1gmEiDrImaBS12U8WGhyWIQg96mvnOabxExyE"
    }
  ]
}', 5),
('home', 'testimonials', '{
  "title": "What industry leaders say."
}', 6),
('home', 'whyUs', '{
  "title": "Why engineering teams choose XYN.",
  "description": "We don''t just build software; we architect the physical and logical layers of the future. Our commitment to performance is uncompromising.",
  "features": [
    { "id": "01", "title": "Native Performance", "description": "Built from the ground up in systems-level languages for maximum resource utilization." },
    { "id": "02", "title": "Sovereign Control", "description": "Complete ownership of your data and infrastructure with no vendor lock-in mechanisms." },
    { "id": "03", "title": "Predictive Scaling", "description": "AI-driven resource allocation that anticipates demand before it affects your systems." }
  ]
}', 7),
('home', 'cta', '{
  "label": "Project Integration Phase",
  "headline": "Ready to transcend?",
  "description": "Join 400+ leading enterprises already scaling on XYN''s neural framework. Deploy your first node in minutes.",
  "buttons": [
    { "text": "Get Started Now", "url": "/services", "variant": "primary" },
    { "text": "Talk to Engineering", "url": "/about", "variant": "secondary" }
  ]
}', 8),
('home', 'faq', '{
  "title": "Frequently Asked Questions."
}', 9),
('home', 'contactInfo', '{
  "phone": "+1 (888) XYN-NODE",
  "phone_title": "Direct Terminal",
  "availability": "Active 24/7/365",
  "address": "One Infinite Way,\nSilicon Heights, CA 94025",
  "address_title": "Nexus Core HQ",
  "maps_link": "https://maps.google.com",
  "maps_text": "View Maps"
}', 10);

-- ============================================================
-- ABOUT PAGE CONTENT
-- ============================================================
INSERT INTO page_contents (page_slug, section_key, content, sort_order) VALUES
('about', 'hero', '{
  "label": "Our Origin Story",
  "headline": "The Genesis of Synaptic",
  "description": "Architecting the invisible layer between human intent and machine execution. We don''t just build nodes; we engineer evolution."
}', 1),
('about', 'timeline', '{
  "milestones": [
    {
      "id": "01",
      "title": "Initial Convergence",
      "description": "In a windowless lab in Zurich, our founders conceptualized a decentralized neural fabric that could bypass legacy latency bottlenecks."
    },
    {
      "id": "02",
      "title": "Node Expansion",
      "description": "Scaling the network to 4,000 hyper-nodes across six continents, establishing the first global synaptic mesh."
    }
  ]
}', 2),
('about', 'tenets', '{
  "title": "Core Tenets",
  "label": "XYN / PRINCIPLES",
  "items": [
    { "id": "t1", "icon": "target", "title": "Precision", "description": "Every calculation, every node handshake, and every protocol update is executed with nanosecond fidelity." },
    { "id": "t2", "icon": "auto_awesome", "title": "Autonomy", "description": "We believe in self-healing systems. Our infrastructure is designed to anticipate failure without human intervention." },
    { "id": "t3", "icon": "shield", "title": "Resilience", "description": "Built for the long tail of uncertainty. Our network maintains integrity through decentralized consensus." }
  ]
}', 3),
('about', 'culture', '{
  "title": "Engineering Ethos",
  "label": "XYN / CULTURE",
  "items": [
    { "id": "c1", "title": "Deep Focus Intervals", "description": "We operate on four-hour blocks of uninterrupted work. No Slack, no pings, just pure algorithmic architecture.", "span": "md:col-span-4", "bg": "bg-surface-container-low", "iconbg": "" },
    { "id": "c2", "title": "Radical Candor Protocols", "description": "Code reviews at XYN aren''t polite; they''re rigorous. We believe the fastest way to truth is through direct, objective scrutiny of logic.", "span": "md:col-span-8", "bg": "bg-surface-container-high relative overflow-hidden group", "iconbg": "code" },
    { "id": "c3", "title": "The 10% Innovation Habit", "description": "Every Friday afternoon is dedicated to \"Entropy Projects\"—building things that shouldn''t work to understand why they don''t.", "span": "md:col-span-7", "bg": "bg-surface-container", "iconbg": "" },
    { "id": "c4", "title": "Asynchronous First", "description": "Meetings are a failure of documentation. We communicate via technical specs and clear version-controlled discourse.", "span": "md:col-span-5", "bg": "bg-surface-container-lowest border border-outline-variant/20", "iconbg": "" }
  ]
}', 4),
('about', 'leadership', '{
  "title": "Core Leadership",
  "label": "XYN / NODES"
}', 5),
('about', 'cta', '{
  "headline": "Join the Synaptic Revolution.",
  "description": "We are always looking for pioneers in cryptography, quantum computing, and distributed systems.",
  "buttonText": "View Positions"
}', 6),
('about', 'contact', '{
  "title": "Global Presence",
  "label": "XYN / CONTACT",
  "hq": {
    "city": "Zürich, CH",
    "address": "Löwenstrasse 12, 8001 Zürich\nSwitzerland"
  },
  "map": {
    "label": "DISTRIBUTED BY DESIGN",
    "text": "Operating across 14 zones"
  },
  "channels": [
    { "id": "ch1", "icon": "alternate_email", "text": "protocols@xyn.eth" },
    { "id": "ch2", "icon": "forum", "text": "t.me/xyn_official" },
    { "id": "ch3", "icon": "terminal", "text": "github.com/xyn-nodes" }
  ]
}', 7);

-- ============================================================
-- SERVICES PAGE CONTENT (hero + CTA only, services from table)
-- ============================================================
INSERT INTO page_contents (page_slug, section_key, content, sort_order) VALUES
('services', 'hero', '{
  "label": "Core Proficiencies",
  "headline": "Functional\nStack.",
  "status": { "text": "System Status: Optimal" }
}', 1),
('services', 'cta', '{
  "title": "Initialize Your Project",
  "description": "Ready to deploy a high-performance digital ecosystem? Connect with our engineering team to audit your current stack.",
  "buttons": [
    { "text": "Start Build", "url": "/services", "variant": "primary" },
    { "text": "View Specs", "url": "/about", "variant": "secondary" }
  ]
}', 2);

-- ============================================================
-- PROCESS PAGE CONTENT
-- ============================================================
INSERT INTO page_contents (page_slug, section_key, content, sort_order) VALUES
('process', 'hero', '{
  "label": "Operations Framework",
  "headline": "The Strategic \nFlow.",
  "description": "A monolithic approach to engineering excellence. We''ve compressed the traditional lifecycle into five synaptic phases."
}', 1),
('process', 'phases', '{
  "items": [
    {
      "id": "p1",
      "span": "md:col-span-3",
      "bg": "",
      "padding": "p-10",
      "minH": "min-h-[400px]",
      "phase": "Phase 01",
      "title": "Strategic Inquiry",
      "icon": "search_check",
      "description": "Deep-dive alignment sessions where we dissect your business logic, technical debt, and scaling ambitions. No vague requirements; only concrete architectural mandates.",
      "metric": { "label": "Standard Velocity", "value": "48h Response Window" }
    },
    {
      "id": "s1",
      "isSideCard": true,
      "span": "md:col-span-1",
      "bg": "bg-surface-container-high",
      "padding": "p-8",
      "icon": "hub",
      "title": "Alignment",
      "description": "Zero-friction onboarding through automated stakeholder synchronization."
    },
    {
      "id": "p2",
      "span": "md:col-span-2",
      "bg": "",
      "padding": "p-10",
      "minH": "min-h-[450px]",
      "phase": "Phase 02",
      "title": "Architecture\n& Design",
      "icon": "architecture",
      "description": "The blueprinting of the digital monolith. We utilize low-latency design patterns and modular schemas.",
      "tags": ["Microservices", "Schema First", "Edge Optimized"]
    },
    {
      "id": "p3",
      "span": "md:col-span-2",
      "bg": "",
      "padding": "p-10",
      "minH": "min-h-[450px]",
      "phase": "Phase 03",
      "title": "Iterative\nDevelopment",
      "icon": "terminal",
      "description": "High-velocity execution cycles. Bi-weekly sprints that yield tangible, production-ready increments. Quality is verified through automated test suites.",
      "metric": { "label": "Build Integrity", "value": "99.9% Test Coverage" }
    }
  ]
}', 2),
('process', 'phase4', '{
  "sideCard": {
    "icon": "rocket_launch",
    "title": "Zero Downtime",
    "description": "Blue-green deployment strategies as standard."
  },
  "mainCard": {
    "phase": "Phase 04",
    "title": "Synaptic Deployment",
    "metrics": [
      { "label": "Global Latency", "value": "< 50ms" },
      { "label": "Infrastructure", "value": "Terraform" }
    ]
  }
}', 3),
('process', 'phase5', '{
  "phase": "Phase 05",
  "title": "Continuous \nOptimization",
  "description": "The journey doesn''t end at launch. We monitor, profile, and refine performance to ensure the architecture evolves with your user base.",
  "features": [
    { "icon": "monitoring", "title": "Real-time Logs" },
    { "icon": "speed", "title": "Vitals Tuning" },
    { "icon": "security", "title": "Hardening" },
    { "icon": "update", "title": "Patch Cycles" }
  ]
}', 4);

-- ============================================================
-- BLOGS PAGE CONTENT
-- ============================================================
INSERT INTO page_contents (page_slug, section_key, content, sort_order) VALUES
('blogs', 'hero', '{
  "label": "Archive // 2026",
  "title": "XYN INTEL.",
  "description": "Documentation of technical breakthroughs, theoretical frameworks, and infrastructure deployments across the XYN ecosystem."
}', 1);

-- ============================================================
-- PORTFOLIO PAGE CONTENT
-- ============================================================
INSERT INTO page_contents (page_slug, section_key, content, sort_order) VALUES
('portofolio', 'header', '{
  "label": "Engineering Portfolio v2.04",
  "titlePrefix": "XYN",
  "titleSuffix": "_SYSTEM",
  "stats": ["Latency: 14ms", "Status: Active"],
  "description": "Low-latency systems architecture and high-performance frontend engineering."
}', 1),
('portofolio', 'proficiency', '{
  "label": "Capability Matrix",
  "title": "Technical Proficiency",
  "skills": [
    { "id": "s1", "name": "Concurrency", "percentage": "98%" },
    { "id": "s2", "name": "Dist Systems", "percentage": "92%" },
    { "id": "s3", "name": "WebAssembly", "percentage": "85%" }
  ],
  "topology": { "desc": "Visualizing real-time node propagation delays across global edge clusters." },
  "footer": {
    "icon": "bolt",
    "text": "Optimizing critical paths for ",
    "highlight": "3.2M req/sec",
    "text2": " across distributed clusters. Focused on deterministic performance."
  }
}', 2),
('portofolio', 'features', '{
  "items": [
    { "id": "f1", "icon": "security", "title": "Zero-Trust", "description": "End-to-end encrypted pipelines." },
    { "id": "f2", "icon": "speed", "title": "Turbo-Boost", "description": "Hardware-accelerated rendering." },
    { "id": "f3", "icon": "cloud_done", "title": "High Availability", "description": "99.999% uptime architecture." }
  ]
}', 3),
('portofolio', 'contact', '{
  "label": "Infrastructure Ready",
  "title": "Scale your architecture to the edge.",
  "description": "We build low-latency, high-performance systems for the next generation of the web. Available for architectural consulting and senior engineering roles.",
  "actionPrimary": "Initialize Project",
  "links": ["GitHub", "LinkedIn"]
}', 4);

-- ============================================================
-- PRIVACY POLICY PAGE
-- ============================================================
INSERT INTO page_contents (page_slug, section_key, content, sort_order) VALUES
('privacy-policy', 'content', '{
  "title": "Privacy Policy",
  "body": "# Privacy Policy\n\nLast updated: March 22, 2026\n\nYour privacy is important to us. This Privacy Policy explains how XYNHub (\"we\", \"us\", or \"our\") collects, uses, and protects your information when you visit our website or use our services.\n\n## Information We Collect\n\n### Information You Provide\n- **Contact Information**: Name, email address, and messages submitted through our contact form\n- **Newsletter**: Email address when you subscribe to our newsletter\n- **Project Inquiries**: Details about your project requirements\n\n### Automatically Collected Information\n- Browser type and version\n- Pages visited and time spent\n- Referring website\n- IP address (anonymized)\n\n## How We Use Your Information\n\n- To respond to your inquiries and provide requested services\n- To send newsletters and updates (only if you have subscribed)\n- To improve our website and services\n- To comply with legal obligations\n\n## Data Protection\n\nWe implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.\n\n## Third-Party Services\n\nWe use the following third-party services:\n- **Vercel**: Website hosting and analytics\n- **Supabase**: Database and authentication\n\n## Your Rights\n\nYou have the right to:\n- Access your personal data\n- Request correction of inaccurate data\n- Request deletion of your data\n- Withdraw consent for newsletter subscriptions\n\n## Cookies\n\nWe use essential cookies only to ensure the website functions properly. We do not use tracking cookies.\n\n## Changes to This Policy\n\nWe may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.\n\n## Contact Us\n\nIf you have questions about this Privacy Policy, please contact us at hello@xynhub.com."
}', 1);

-- ============================================================
-- TERMS OF SERVICE PAGE
-- ============================================================
INSERT INTO page_contents (page_slug, section_key, content, sort_order) VALUES
('terms-of-service', 'content', '{
  "title": "Terms of Service",
  "body": "# Terms of Service\n\nLast updated: March 22, 2026\n\nBy accessing and using the XYNHub website and services, you agree to be bound by these Terms of Service.\n\n## 1. Services\n\nXYNHub provides web development, mobile application development, cloud infrastructure solutions, and related technology consulting services.\n\n## 2. Use of Website\n\nYou agree to use our website and services in compliance with all applicable laws and regulations. You may not:\n- Use our services for any unlawful purpose\n- Attempt to gain unauthorized access to our systems\n- Interfere with the proper working of the website\n- Transmit any malicious code or harmful content\n\n## 3. Intellectual Property\n\nAll content, designs, code, and materials on this website are the property of XYNHub unless otherwise stated. You may not reproduce, distribute, or create derivative works without our written permission.\n\n## 4. Project Agreements\n\nSpecific project engagements will be governed by separate service agreements that outline scope, deliverables, timelines, and payment terms.\n\n## 5. Limitation of Liability\n\nXYNHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services.\n\n## 6. Disclaimer\n\nOur website and services are provided \"as is\" without warranties of any kind, either express or implied.\n\n## 7. Indemnification\n\nYou agree to indemnify and hold harmless XYNHub from any claims, damages, or expenses arising from your use of our services or violation of these terms.\n\n## 8. Governing Law\n\nThese Terms shall be governed by and construed in accordance with applicable laws.\n\n## 9. Changes to Terms\n\nWe reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.\n\n## 10. Contact Us\n\nFor questions about these Terms of Service, please contact us at hello@xynhub.com."
}', 1);

-- ============================================================
-- SERVICES (Dynamic content from services table)
-- ============================================================
INSERT INTO services (slug, title, description, short_description, icon, image_url, number, metrics, tooling, features, is_featured, sort_order, is_active) VALUES
(
  'web-development',
  'Web & Ecosystem Development',
  'Engineering high-performance web applications with modular architecture and sub-second latency. We build for scale, ensuring your digital infrastructure remains robust under peak loads. Our approach combines type-safe development with rigorous testing to deliver production-grade systems.',
  'High-performance web applications with modular architecture and sub-second latency.',
  'terminal',
  NULL,
  '01',
  '[{"label": "Latency", "value": "<150ms"}, {"label": "Uptime", "value": "99.99%"}, {"label": "Type-Safe", "value": "Strict"}, {"label": "Testing", "value": "100%"}]',
  '["TypeScript", "React / Next.js", "Node.js / Bun", "PostgreSQL", "Redis Cache"]',
  '[{"title": "Server-Side Rendering", "description": "Optimized SSR and SSG for maximum performance and SEO."}, {"title": "Real-Time Features", "description": "WebSocket and Server-Sent Events for live data streaming."}, {"title": "API Architecture", "description": "RESTful and GraphQL APIs with OpenAPI documentation."}, {"title": "Progressive Web Apps", "description": "Offline-first PWAs with service workers and caching strategies."}]',
  true,
  1,
  true
),
(
  'mobile-development',
  'Native & Hybrid Application Design',
  'Crafting intuitive mobile experiences that bridge the gap between complex functionality and seamless interaction. We develop native and cross-platform applications that leverage device capabilities while maintaining a consistent user experience across platforms.',
  'Intuitive mobile experiences bridging complex functionality and seamless interaction.',
  'install_mobile',
  NULL,
  '02',
  '[{"label": "Platforms", "value": "3"}, {"label": "App Rating", "value": "4.9★"}, {"label": "Downloads", "value": "1M+"}]',
  '["Swift", "Kotlin", "React Native", "Flutter", "Firebase"]',
  '[{"title": "iOS Native", "description": "Swift-based iOS apps with native UI components and performance."}, {"title": "Android Native", "description": "Kotlin-first Android development with Material Design 3."}, {"title": "Cross-Platform", "description": "React Native and Flutter for shared codebases across platforms."}, {"title": "App Store Optimization", "description": "ASO strategies for maximum visibility and downloads."}]',
  true,
  2,
  true
),
(
  'cloud-infrastructure',
  'Cloud Systems & Infrastructure',
  'Automated CI/CD pipelines and Infrastructure as Code for immutable deployments. Auto-scaling Kubernetes clusters and serverless functions designed for elastic demand. We architect cloud-native solutions that optimize cost while maximizing performance and reliability.',
  'Automated infrastructure with auto-scaling clusters and serverless architecture.',
  'cloud_done',
  NULL,
  '03',
  '[{"label": "Uptime", "value": "99.999%"}, {"label": "Deploy Time", "value": "<2min"}, {"label": "Cost Saved", "value": "40%"}, {"label": "Regions", "value": "14"}]',
  '["AWS", "Google Cloud", "Docker", "Kubernetes", "Vercel", "Terraform"]',
  '[{"title": "Provisioning", "description": "Automated CI/CD pipelines and Infrastructure as Code (Terraform/Ansible) for immutable deployments."}, {"title": "Scalability", "description": "Auto-scaling Kubernetes clusters and serverless functions designed for elastic demand."}, {"title": "Monitoring", "description": "Comprehensive observability with Prometheus, Grafana, and custom alerting."}, {"title": "Security", "description": "Zero-trust architecture with encrypted communication and secret management."}]',
  true,
  3,
  true
),
(
  'ui-ux-design',
  'UI/UX Design & Branding',
  'We craft digital experiences that are not only beautiful but also functional. Our design process is rooted in user research and data-driven decision making, ensuring every pixel serves a purpose.',
  'Data-driven design that balances aesthetics with functionality.',
  'palette',
  NULL,
  '04',
  '[{"label": "NPS Score", "value": "92"}, {"label": "Conversion", "value": "+35%"}]',
  '["Figma", "Framer", "After Effects", "Principle"]',
  '[{"title": "User Research", "description": "In-depth user interviews, surveys, and usability testing."}, {"title": "Design Systems", "description": "Scalable component libraries with consistent design tokens."}, {"title": "Prototyping", "description": "Interactive prototypes for rapid validation and iteration."}, {"title": "Brand Identity", "description": "Complete brand systems from logo to comprehensive style guides."}]',
  false,
  4,
  true
);

-- ============================================================
-- BLOGS
-- ============================================================
INSERT INTO blogs (slug, title, category, tag, description, content, author_name, author_role, author_image, image_url, icon, is_featured, read_time, published_at, is_active) VALUES
(
  'architecting-the-core-distributed-systems-at-scale',
  'Architecting the Core: Distributed Systems at Scale',
  'Latest',
  'Featured',
  'A deep dive into the consensus mechanisms driving our latest infrastructure update, focusing on latency reduction in multi-regional clusters.',
  '{"body": "# Architecting the Core: Distributed Systems at Scale\n\nA deep dive into the consensus mechanisms driving our latest infrastructure update, focusing on latency reduction in multi-regional clusters.\n\n## The Challenge\n\nModern distributed systems face an inherent tension between consistency, availability, and partition tolerance. As our infrastructure grew to span 14 global regions, we needed to rethink our consensus mechanisms.\n\n## Our Approach\n\nWe implemented a hybrid consensus model that combines Raft for local cluster coordination with a custom gossip protocol for cross-regional state synchronization.\n\n## Results\n\n- **Latency reduction**: 60% improvement in cross-region queries\n- **Consistency**: Strong consistency within regions, eventual consistency across regions\n- **Availability**: 99.999% uptime maintained during the migration"}',
  'Dr. Elias Thorne',
  'Chief Systems Architect',
  NULL,
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDD9vVp-QPvvuaS97wxzsyCCetRpgnldx5ivGihfbePSKjtCOEbnqBvicuE9Zq9RSuyhKmvgW9O-3o1tAK0wjM1P3g-LJz2qND2uarGD2ynTPqs-V8r2m0UAv2c7pGMEZQmesz-6O2R31Ek6wUB3jUk3YY8VmuQ0STXGWH3gBjF1dytSPJ__wwFVU-SD3o57FhYG_nDkruNuVZ1yXlXs1CleonpTrOVIsPw_hzIDvQaBOzavRoQ0DLCMbBBLvF25ZHN8bexP__sGsA',
  NULL,
  true,
  '14 Min Read',
  '2024-06-12T00:00:00Z',
  true
),
(
  'edge-computing-bridging-the-gap',
  'Edge Computing: Bridging the Gap in Real-Time Inference',
  'Deployment Log',
  'TECHNICAL MONOGRAPH // 071',
  'As the proliferation of high-frequency data generators accelerates, the traditional centralized cloud model faces an existential latency wall.',
  '{"body": "# Edge Computing: Bridging the Gap in Real-Time Inference\n\nAs the proliferation of high-frequency data generators accelerates, the traditional centralized cloud model faces an existential latency wall. Real-time inference is no longer a luxury; it is a structural necessity for the next generation of autonomous logic.\n\n## The Latency Dilemma\n\nIn traditional architectures, data packets traverse multiple hops across backhaul networks before reaching a centralized GPU cluster for processing. While fiber-optic speeds are impressive, the physical distance introduces a deterministic floor on latency.\n\n## Architecting the Fog\n\nThe transition to edge-native inference requires a radical rethinking of model deployment. We implement tiered Fog layers where lightweight quantized models reside at the extreme edge.\n\n> The edge is not a location; it is a computational philosophy that prioritizes proximity over capacity.\n\n## Conclusion\n\nBridging the gap for real-time inference is the primary engineering challenge of the decade. By moving logic closer to the photon, we aren''t just making systems faster—we''re making them capable of behaviors that were previously impossible."}',
  'Dr. Elias Thorne',
  'Chief Systems Architect',
  NULL,
  NULL,
  'terminal',
  false,
  '10 Min Read',
  '2024-10-24T00:00:00Z',
  true
),
(
  'memory-management-high-throughput',
  'Memory Management in High-Throughput Environments',
  'System Optimization',
  NULL,
  'Techniques for managing memory efficiently in high-throughput data processing environments.',
  '{"body": "# Memory Management in High-Throughput Environments\n\nEfficient memory management is critical in high-throughput systems. This article explores techniques for optimizing memory allocation, garbage collection, and buffer management in production systems."}',
  'XYN Engineering',
  'Engineering Team',
  NULL,
  NULL,
  'memory',
  false,
  '8 Min Read',
  '2024-06-10T00:00:00Z',
  true
),
(
  'neural-topology-information-entropy',
  'Neural Topology and Information Entropy',
  'Research',
  'Paper #442',
  'Quantifying the structural efficiency of non-linear network configurations in adaptive learning models.',
  '{"body": "# Neural Topology and Information Entropy\n\nQuantifying the structural efficiency of non-linear network configurations in adaptive learning models. This paper presents our findings on optimizing network topology for maximum information throughput."}',
  'DR, KA',
  'Research Team',
  NULL,
  NULL,
  'science',
  false,
  '20 Min Read',
  '2023-06-15T00:00:00Z',
  true
),
(
  'quantum-resilient-cryptographic-standards',
  'Quantum Resilient Cryptographic Standards',
  'Research',
  'Pre-Print',
  'An evaluation of lattice-based security protocols in future-proofing decentralised ledger technology.',
  '{"body": "# Quantum Resilient Cryptographic Standards\n\nAn evaluation of lattice-based security protocols in future-proofing decentralised ledger technology. We analyze the viability of post-quantum cryptographic algorithms."}',
  'LH',
  'Research Team',
  NULL,
  NULL,
  'biotech',
  false,
  '15 Min Read',
  '2023-06-01T00:00:00Z',
  true
),
(
  'global-cdn-expansion',
  'Global CDN Expansion',
  'Infrastructure',
  NULL,
  'Status update on our South-East Asian node deployment and routing optimization.',
  '{"body": "# Global CDN Expansion\n\nWe''re excited to announce the expansion of our CDN infrastructure into South-East Asia. This deployment reduces latency for users in the region by up to 70%."}',
  'XYN Engineering',
  'Infrastructure Team',
  NULL,
  NULL,
  'dns',
  false,
  '5 Min Read',
  '2024-05-30T00:00:00Z',
  true
),
(
  'zero-trust-implementation',
  'Zero-Trust Implementation',
  'Infrastructure',
  NULL,
  'Transitioning internal authentication to a stateless, hardware-verified architecture.',
  '{"body": "# Zero-Trust Implementation\n\nTransitioning internal authentication to a stateless, hardware-verified architecture. This article details our migration to a zero-trust security model."}',
  'XYN Engineering',
  'Security Team',
  NULL,
  NULL,
  'security',
  false,
  '7 Min Read',
  '2024-05-24T00:00:00Z',
  true
),
(
  'renewable-grid-sync',
  'Renewable Grid Sync',
  'Infrastructure',
  NULL,
  'Integrating data center consumption with localized green energy harvesting systems.',
  '{"body": "# Renewable Grid Sync\n\nIntegrating data center consumption with localized green energy harvesting systems. Our approach to sustainable infrastructure management."}',
  'XYN Engineering',
  'Infrastructure Team',
  NULL,
  NULL,
  'bolt',
  false,
  '6 Min Read',
  '2024-05-12T00:00:00Z',
  true
);

-- ============================================================
-- PORTFOLIOS
-- ============================================================
INSERT INTO portfolios (slug, title, tag, description, short_description, image_url, tech_stack, metrics, sort_order, is_active, is_featured) VALUES
(
  'aether-net',
  'Aether_Net',
  'Core Protocol',
  NULL,
  'Global low-latency communication network with quantum-resistant encryption.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuADEkUUCejDZn_LCG3xSpaSatiTbs161BdmuPZnJ8fWN5M3g2UpBI0xD3X-I7znn_HC1NTLuidIKA16kf0CiZY-Kl-JRU86-nYfnOFZdQam6Y0kAMz95zN0FQpMqKG2YLHF6AeqnNNMnkERbghJBw9Z9EUVrzFz_NNpZivBksb_FXy6J_DpAKQ4-gNNkUwkhmkVtk6jRV4aV7vWIeMqaBr7uvrWHfnaLl5GbUaXJW_a0ZnUy0hs8FZkaHgwX89NUmtkwT5OuFvQip4',
  '{"tech1": {"icon": "terminal", "lang": "Rust", "role": "Engine"}, "tech2": {"icon": "dataset", "lang": "gRPC", "role": "Transport"}}',
  '{"value": "0.02ms", "label": "P99 Latency"}',
  1,
  true,
  true
),
(
  'synapse-os',
  'Synapse_OS',
  'Module: 02',
  'Microkernel architecture for edge computing devices.',
  'Ultra-lightweight microkernel for edge computing with 4.2KB memory footprint.',
  NULL,
  '{"stack": ["Zig", "ARM64"], "memory": "4.2KB Baseline"}',
  NULL,
  2,
  true,
  false
),
(
  'quantum-ui',
  'Quantum_UI',
  'Frontend Engineering',
  'High-fidelity component library designed for real-time data visualization. Built on top of Next.js 14 and WebGL for zero-lag rendering.',
  'High-fidelity component library for real-time data visualization with 60FPS rendering.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDLYA2UXE_67Hoq5WAjStXFo4fZaXX6gmnpipJDlY-t-jQxSgYnbDwDDpKEwbxm4RCjp4_NswXaGg4c6dDMe8fjqckdiJOB27K4bUl399Ewxjz_KVMkVkSkImNkFw02WpIMOLQ5Wv4ifMdeWiSmKVRhBVC5NOLKA3_q1LfVJnv37_mcvEL7_1R4BTqZ09uafMpO9aMk_tXgPECQdTgEar_FbTRAHsqcRy0Mjri0W5nZ6Y94Zk7bEJ88isJgquyzcvG8UUFT6kMPgWI',
  NULL,
  '{"items": [{"value": "60FPS", "label": "Locked"}, {"value": "0kb", "label": "Runtime CSS"}]}',
  3,
  true,
  true
);

-- ============================================================
-- PORTFOLIO DETAILS
-- ============================================================
INSERT INTO portfolio_details (portfolio_id, hero, stats, narrative, features, gallery, cta, tags)
SELECT
  p.id,
  '{
    "label": "Case Study / 2024",
    "title": "Aether_Net",
    "description": "The architectural evolution of global low-latency communication networks.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBJiTX_7Z_DgSKgEEciA124nG_d1NCau5WX1ENGugAd3idGUIQ1c3VO7dRR2kfJ5jMm4zeQtQxVguGpcwiCEGSgaHcAD1jm16vaWJxkUPVlKxpuo-Je5MmOoND-6f-aCBmztj_aJ_ys5hWIdjekUmJX_Zoe6-f0kgpYJHdOkqr6eMNfoSV8CZ3wCUGfJu535khytI8jYpJg2q2p8mkCCVluu-v99xr4qEolekZ3veZBqx59cwu4z2zXig4xvpsiezCz31j9lSXAGhg"
  }'::jsonb,
  '{
    "icon": "hub",
    "label": "Efficiency",
    "value": "0.4ms",
    "valueLabel": "Node-to-node latency",
    "tags": ["L1 STABLE", "ENCRYPTED"]
  }'::jsonb,
  '{
    "title": "The Infrastructure Problem",
    "paragraphs": [
      "Aether_Net was conceived as a response to the fragmentation of modern packet routing. As data volumes reach monolithic proportions, traditional infrastructure fails to sustain the precision required for real-time synaptic operations.",
      "By building on a \"Digital Monolith\" philosophy, we carved a singular, immutable path for data. We utilized custom obsidian-grade hardware protocols and layered monochromatic encryption to ensure that every packet moves with mechanical elegance and absolute security."
    ],
    "buttons": [
      { "text": "WHITE PAPER", "variant": "primary" },
      { "text": "ARCHITECTURE", "variant": "secondary" }
    ]
  }'::jsonb,
  '[
    { "id": "f1", "icon": "bolt", "title": "Performance", "description": "Optimized silicon routing." },
    { "id": "f2", "icon": "shield", "title": "Security", "description": "Quantum-resistant tunneling." },
    { "id": "f3", "icon": "auto_awesome_motion", "title": "Scalability", "description": "Infinite horizontal expansion." }
  ]'::jsonb,
  '[
    { "id": "g1", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAbH9EdVRf3wWKoIXyZzROEzTaBJsR5vDwZRoSIpvzjsgbMGWIiqBz47OQlKN0TsjifbKTDfQ0uBK9PoZcjv6x3H_O1OqiwCiUk43wDVPATsnxJuRdgiHaoUfLx6EOp1PcsVG8K3tQdUJVe0fapiMZItINO4iZcCkV9lHqZFNK9FLOfRigt9aaqInw_vUmwuqgoHcUir7yteuBwHZ572cKTtr2tpKSxrBdiac8Mdg2mUgVTKVlO7bBRDNcDAWB7enIAzzG7PBAK9Xs", "label": "MODULE_ALPHA" },
    { "id": "g2", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuD33fpBfCXTP2AVzrzU6FNt1VgUIgaaATCVDqErz0l6o9pYpnOQ_1AwWYKJ6tbIwPWn7C8JpbGpZQkLiQkTNmcvQGhgbpGmn0QFnT667BPh-jQDBN2ThDvtPFeXEjgyMM1eb9z4m9sPukxBgi8BRHbSnm5JcXVYB2vHbvv8mnoSSlMcqQTj6JV0HlLm9TtQ7Ce4BGSXLPVrBwqQhri3ZSRGXIHqGI9L3Apsuv5Kp4qnoasZ4Cvo1YQI05nkQ4B-5osxG0lgwu6CPTM", "label": "MODULE_BETA" },
    { "id": "g3", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAvcgIGauZphhMjBJ7kejOTimcEpfV40GcCGQ967mifKnXZF4WIWTGzX7L7JotnE-jAgSi20uTgbyklzA9yxIvVHiqgvBmVbEINEs43B1Jy-IfC2KLJHrEAzWjn1YOt3C33R0HqJwrlfa4OKPh2LHXzghzbS1LIInw-j5rRzJ7qhYms12nMy9fhL8pzuRmUFjONxG33swcXdtXa6c1qQKv8B1viB_p4QNxyf1f2B3cTjo-qDy80oy6yqwosfbC19wmT2sKmuJJ9Qx0", "label": "NETWORK_ORBIT" }
  ]'::jsonb,
  '{
    "label": "Final Protocol",
    "title": "Ready to Deploy.",
    "description": "Integrate Aether_Net into your existing stack and achieve zero-latency sovereignty today.\nAvailable for enterprise orchestration and private cluster scaling.",
    "buttons": [
      { "text": "GET STARTED", "variant": "primary" },
      { "text": "CONTACT SALES", "variant": "outline" }
    ]
  }'::jsonb,
  ARRAY['TCP/IP+', 'LUMINAL_ENCRYPTION', 'OBSIDIAN_CORE', 'ULTRA_SYNC', 'NEURAL_ROUTING', 'V3.14.0']
FROM portfolios p WHERE p.slug = 'aether-net';

-- ============================================================
-- TESTIMONIALS
-- ============================================================
INSERT INTO testimonials (quote, author_name, author_role, author_initials, author_image, span_class, sort_order, is_active) VALUES
('XYN has fundamentally transformed how we handle cross-continental data sync. Their latency reduction isn''t just a metric; it''s a competitive advantage.', 'Alexander Müller', 'CTO, Vertex Quantum', 'AM', NULL, 'col-span-12 md:col-span-7', 1, true),
('The most stable synaptic routing protocol we''ve ever integrated. Security and speed in a single package.', 'Sarah Koenig', 'Head of Infrastructure, Synapse', 'SK', NULL, 'col-span-12 md:col-span-5', 2, true),
('Sovereign control of our data was non-negotiable. XYN delivered exactly what was promised.', 'James Low', 'Lead Architect, Core.Sys', 'JL', NULL, 'col-span-12 md:col-span-4', 3, true),
('Predictive scaling has saved us countless hours of manual resource adjustment. It''s like having an automated engineering team that never sleeps.', 'Raymond Holt', 'VP Engineering, Nexus.IO', 'RH', NULL, 'col-span-12 md:col-span-8', 4, true);

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
INSERT INTO team_members (name, role, group_name, image_url, sort_order, is_active) VALUES
('Dr. Elias Vance', 'Co-Founder & Chief Scientist', 'Systems Architects', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2eRLGHRsuwvuNGAgKL83bcFDIwzPjzOvxYXIgDIasGWpJw9oyD3Q2QywLB9FCkhQNxiLhSAEdO2ZocDxzGg7GeCtLkOB91neDZdTXfJkyyfldN46jLKRcEtlMxZ0t8atYKRAjde-8XVgYIoMdwQbnpA13KZ-2sZs-VtCzzmJow4zGBXDrw3BAIEcRQpzkFUyWEcYS2-xvUb9dOfYtqUSqZ2J22z5xW-AGb-QX6Yc9yxG698NC9pIEr_YvrIXBsR-KRefUHWpkJDs', 1, true),
('Sonia Kalu', 'Chief Strategy Officer', 'Systems Architects', 'https://lh3.googleusercontent.com/aida-public/AB6AXuALdqutYjgEP9VmTJZ82dIH2bAEjqHayOUaPhM9xlMGFgfhQfmLwLcqo9Ei40bAHXRKkaooceNqC-VaZzMLDy1vTZXoZOVLRghZm9PH3Ueh0htvxjVKqdvnsdYY-7Xga3uA4hM5fOEftseVqX_5Eai0aBJReRDLVodeMyckIFt2rZuwzmMWBtXdWN4wWxjCeMUWG2X-HDY-re94co-pfc2-i44aLlfJDUMGYTKOJLLuP6PyXzUFGNf9rIiluBGLMu5t0_27FiwqqTk', 2, true),
('Marcus Thorne', 'Lead Cryptographer', 'Infrastructure Engineers', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAExOz8p_JXLzRMneFW7xX53_a0O0qk_wJP2uDoddp0VOkgk0Ra54YePVCHDdp_gKKSVb3gtWwm2qnUXg5hh4G2KLDuZ3Kkb-HCmlXKuuAgJGhQiHNjnE_yRewWnocLNJeI2axzUD90kHDqSPdkinyhVoeCFMCsFloGnVqcbi2-9V19f_X-2rMw6qCcWGEgwJLpjxw3HILya5zoqi-qU9Zcx86Nk4ufRUCEHYsbO2WOMEuSYytEQ_ERANWI5G-l4ElgOFsnohorQPc', 3, true),
('Aria Sterling', 'Distributed Systems Lead', 'Infrastructure Engineers', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY3--6BAsyUHLLUte0pu3bLKEt5bhKhb_chfo35-jKY6BebnZDS5SIF-1bJHk06nOMhpIdPsKaUVLZc8JAGncqGKsUTSCerNtdSYt3_0klDHr9mxIaqq3RF83pknx0oLJnJBWK5yhoWvRdLauXysUPAfVI8iap1P0zXhyQwkbEa2IzCf7nXZBnXt4luuoBXB7Au_afCgtW2wGmvfSjyb-MGIJWvQbwFjyy0h7ci1hEyMezzZ3uQLTNFN5_UFfR-JscBUdWWpABUyA', 4, true);

-- ============================================================
-- FAQS
-- ============================================================
INSERT INTO faqs (question, answer, page_slug, sort_order, is_active) VALUES
('What is the typical deployment timeline?', 'Standard node integration takes approximately 15 minutes. Complex multi-region mesh topologies can be fully provisioned and verified within 48 hours.', 'home', 1, true),
('How do you ensure 99.9% uptime?', 'Our infrastructure utilizes self-healing nodal protocols. If a node fails, traffic is rerouted synaptically in under 0.1ms while redundant processes initialize automatically.', 'home', 2, true),
('Do you offer custom API integrations?', 'Yes. Our framework is API-agnostic. We provide a robust SDK for C++, Rust, and Python to ensure deep integration with your existing technological stack.', 'home', 3, true),
('Is data sovereignty guaranteed?', 'Absolutely. XYN operates on a zero-trust architecture. You retain 100% ownership of your private keys and nodal data. We have no access to your encrypted payloads.', 'home', 4, true);
