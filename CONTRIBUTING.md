# XYN Monolithic Interfaces - Expansion Guidelines

📋 **Standardized protocol for contributing to the XYN architecture**

---

## 1. Ecosystem Overview

The XYN platform operates as a massive monolithic ecosystem represented via an NPM workspace monorepo. The core UI sits within `apps/web`. The entire ecosystem relies on extreme static elegance and zero-movement component states.

---

## 2. Tech Architecture

| Layer | Protocol |
|-------|------------|
| Core Engine | Vite (React 18+) |
| Syntax | TypeScript |
| Architecture | NPM Workspaces |
| Formatting Layer | Tailwind CSS v4 |
| Component Modularity | React Context & Atomic Design |

---

## 3. Structural Directives

```
xynhub.com/
├── apps/
│   └── web/                      # React application
│       ├── src/
│       │   ├── components/       # Primitive interface systems
│       │   ├── data/             # Static state mockups
│       │   ├── lib/              # Core utility functions
│       │   └── App.tsx           # Entry application loop
```

---

## 4. Component Rules

All structural primitives **MUST** adhere to the standards outlined in `UI_RULES.md`.

### Naming Conventions

```typescript
// ✅ Approved
export function BentoCard() {}
export function NeuralNetworkVisualization() {}

// ❌ Rejected
export function bentoCard() {}
export function neural_visualizer() {}
```

### Dependency Logic

```typescript
// 1. External dependencies
import { cn } from "../../lib/utils";
import * as React from "react";

// 2. Syntax definitions
interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// 3. Execution logic
export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(...);
```

---

## 5. Mock Data Architecture

Until distributed nodal ledgers are finalized (Backend API), all network data is handled synthetically via JSON in `/src/data/`.

**Implementation Standards**:
1. Add JSON definitions to simulate API response payloads.
2. Maintain strict separation of states—React components should NOT house primitive data structures directly.

---

## 6. CSS & Tailwind Implementations

All CSS tokens are implemented using Tailwind v4 structural methodology.

**Global CSS implementation pattern**:
- Defined in `src/index.css` via the `@theme` primitive.
- All colors follow the "Zinc Spectrum" logic. Strict zero-tolerance for standard Tailwind colors out of bounds.

---

## 7. Submission Operations

```bash
# Verify integrity parameters
npm run build 
npm run lint

# Compile changes
git switch -c feature/nodal-expansion
git commit -m "feat: [COMPONENT_NAME] integrated into ecosystem"
git push origin feature/nodal-expansion
```
