# XYN Design System Strategy: The Monolithic Interface

## 1. Overview & Creative North Star
The Creative North Star for the XYN React design system is **"The Digital Monolith."** 

This system treats the interface as a singular, carved object of high-density information. We are moving away from the "webpage" mental model and toward "static elegance"—a high-end, editorial feel where the UI doesn't fight for attention through movement, but commands it through perfect proportions, intentional asymmetry, and tonal depth. 

* **Structure:** Bento Grid pattern.
* **Component Layering:** Deep nesting mapping cleanly over the Zinc color spectrum.
* **AI UI Generation Rules:** When tasked with generating new components or pages for the XYN ecosystem, strictly adhere to the constraints listed below.

---

## 2. Layout & Surface Architecture (Tailwind CSS v4)

The palette is strictly monochrome, utilizing mapped CSS `@theme` variables over the Zinc spectrum to create a sense of mechanical precision. Do **not** use standard Tailwind arbitrary colors (e.g., `bg-zinc-800` or `text-gray-400`); explicitly use the defined variables from the theme core (e.g. `bg-surface-container`, `text-on-surface-variant`).

### The "No-Line" Border Rule
* **Constraint:** 1px solid borders are strictly prohibited for sectioning.
* **Solution:** Boundaries must be defined solely through background color shifts or tonal transitions between overlapping surface tiers.
* Use `bg-surface-container-low` for primary secondary zones sitting on `bg-background`.
* Use `bg-surface-container` for `BentoCard` structural units.
* Use `bg-surface-container-high` to define active or highlighted zones.

### Surface Hierarchy Mapping
* **Tier 1 (Base):** `bg-surface` - Foundation plane.
* **Tier 2 (Bento Card):** `bg-surface-container` - The primary structural unit.
* **Tier 3 (Inner Elements):** `bg-surface-container-high` - Buttons, inputs, or nested modules.

### Glassmorphism & Elevated Elements
Floating elements (e.g., sticky Header) must utilize Glassmorphism.
* **Constraint:** Apply `bg-[rgba(9,9,11,0.7)] backdrop-blur-[20px]`. (Mapped via `glass-nav` utility class).

### Standard Constraints & Layout Grid
Never create inconsistent page boundaries. All top-level page content MUST be wrapped uniformly to ensure exact alignment and balance across the application.
* **Main Content Wrapper:** All pages (`Home`, `About`, etc.) must use `<main className="pt-48 pb-20 px-6 md:px-8 max-w-[1440px] w-full mx-auto">`.
* **Never use arbitrary `max-w-7xl` or alternate paddings** for top-level pages. The `1440px` monolithic width is sacred for this layout.

---

## 3. Typography: Editorial Authority

We use **Inter** exclusively via designated font variables (`font-headline`, `font-body`, `font-label`).
The power of this system lies in "Compact Spacing" and "Tracking Tightness."

*   **Display (H1):** `text-[3.5rem] md:text-[5.5rem] font-extrabold tracking-tighter leading-none`
*   **Headline (H2/H3):** `text-3xl font-bold tracking-tight text-primary`
*   **Body:** `text-sm` or `text-lg` with `font-medium text-on-surface-variant`.
*   **Labels (Tags/Chips):** `label-sm font-bold uppercase tracking-widest text-[0.6875rem] text-outline`. Use these to provide the "technical/data" feel required for a synaptic interface.

---

## 4. Execution & Components

### Structure Elements
*   **BentoCard (`src/components/ui/BentoCard.tsx`)**
    * Uses `bento-card` utility for perfect border radiuses (`rounded-xl` mapping to 2.5rem optionally or default radius) and hover states.
    * **Padding Rule:** The base component is *padding-agnostic* (to support full-bleed images). Whenever rendering standard text content inside a `BentoCard`, you **MUST** apply padding utilities explicitly (e.g., `p-10 flex flex-col justify-center` or `p-12`). Do not leave text crammed to the edges.
    * **No Lift on Hover:** Interaction is modeled via sublte border opacity shifts, not scaling or box-shadow lifts.

*   **PageHeader (`src/components/layout/PageHeader.tsx`)**
    * **Must** be used for the hero header of all top-level subpages (About, Process, Portfolio) to enforce consistent Title/Subtitle (`text-[5.5rem]`) formatting and unified spacing. Do not write raw `<h1>` headers manually on new pages.

*   **SectionHeader (`src/components/layout/SectionHeader.tsx`)**
    * **Must** be used for all internal page section dividers (e.g., "Core Tenets", "Core Leadership") to ensure horizontal line boundaries and `text-4xl` typography remain perfectly identical. Do not manually write divider `<div>` structural classes.

### Interactive Primitives
*   **Button (`src/components/ui/Button.tsx`)**
    * Shapes: Always `rounded-full`.
    * Animations: Limit to `150ms` opacity shift or `active:scale-95`.
    * Typography: Always `uppercase tracking-wide font-bold`.
    * Variants: Primary (`bg-primary text-on-primary`), Secondary (`bg-surface-container-highest border border-outline-variant/20`).

*   **Badge (`src/components/ui/Badge.tsx`)**
    * Structure: Small pill markers (`rounded-full px-4 py-1.5`).
    * Typography: Follows Label rules (`uppercase tracking-widest font-bold`).

### Lists & Divides
* **The No-Divider Rule:** Forbid 1px dividers between list items. Use flex gaps (`gap-3` to `gap-8`) or background color shifts on `hover` states.

---

## 5. UI AI Agent Generation Directives

When processing new UI requests:
1. **Never use standard UI kits:** Do not inject unstyled UI library primitives (like standard generic radix buttons) without mapping them completely to XYN design system variables.
2. **Never break typography scale:** Stick to the extreme contrast scaling (Massive `H1` vs tiny `label`).
3. **Never apply generic borders:** Trust padding and background shifts (`surface` to `surface-container`).
4. **Prefer pure Tailwind:** Do not write custom CSS unless strictly required. Inherit from the `apps/web/src/index.css` root theme implementation.
5. **Enforce JSON Mock Data Separation:** Keep all raw text and object structures externalized into `src/data/*.json`. Do not hardcode strings inside massive page components.
