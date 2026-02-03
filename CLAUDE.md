# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Project Template Wizard is a Nuxt 4 application that generates project specification documents through a 14-step adaptive wizard (7 always visible, 7 conditional based on project type). Users fill out project details and export Markdown specs, AI prompts, CLAUDE.md files, and ZIP bundles for AI-assisted development.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server at http://localhost:5050
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript checks
```

## Architecture

### Frontend (`app/`)
- **Nuxt 4** with **Nuxt UI v4** components and **Tailwind CSS v4**
- State managed via composables (not Pinia)
- RTL support for Arabic interface

### Key Composables (`app/composables/`)
- `useWizardState` - Central state management using `useState` for SSR compatibility, handles localStorage persistence and MongoDB cloud sync
- `useStepValidation` - Per-step Zod validation
- `useMarkdownGenerator` - Converts wizard state to downloadable Markdown specification
- `useClaudeMdGenerator` - Generates project-specific CLAUDE.md guidance files
- `usePromptGenerator` - Creates AI assistant prompts from wizard state
- `useZipGenerator` - Creates ZIP exports with all specification files

### Utilities (`app/utils/`)
- `projectCapabilities.ts` - Visibility logic functions: `needsFrontend`, `needsBackend`, `needsDatabase`, `needsAI`, `needsDesktopSystem`, `needsAPI`
- `formatTech.ts` - Tech name + version formatting

### Step Registry (`app/config/stepRegistry.ts`)
Maps step IDs to lazy-loaded components, dynamic Zod schemas, and data extractors. Schemas can depend on state (e.g., `createTechnicalSchema(projectType)`).

### Validation (`app/schemas/`)
Each wizard step has a corresponding Zod schema (13 files). Some are static, some are factory functions that accept state:
- `quickReference.schema.ts`, `userStories.schema.ts`, `permissions.schema.ts`
- `technical.schema.ts` (factory: `createTechnicalSchema(projectType)`)
- `database.schema.ts`, `api.schema.ts`, `frontend.schema.ts`
- `features.schema.ts` (factory: extended vs small based on projectType)
- `dependencies.schema.ts`, `guidelines.schema.ts`
- `aiConfiguration.schema.ts`, `desktopSystem.schema.ts`

### Types (`app/types/wizard.types.ts`)
Central type definitions including `WizardState`, step definitions (`WIZARD_STEPS`), and initial state (`initialWizardState`).

### Server (`server/`)
- `utils/mongodb.ts` - MongoDB connection singleton (requires `MONGODB_URI` env var)
- `api/projects.post.ts` - Create/update projects
- `api/projects.get.ts` - List projects by device ID
- `api/projects/[id].get.ts` - Fetch single project
- `api/projects/[id].delete.ts` - Delete project

### Wizard Steps Flow
**Always visible:**
0. Overview (project name, type, nature, runtime targets, intelligence level)
1. User Stories (user types with stories)
3. Technical (tech stack, architecture, multi-tenancy, MCP servers)
4. Summary (pre-database discussion)
9. Features (MVP, future, edge cases, phases)
10. Dependencies (backend/frontend/AI/system/build packages, env vars)
11. Guidelines (TypeScript mode, development warnings)

**Conditional (via `visibleWhen` in WIZARD_STEPS):**
2. Permissions → when projectType includes backend
5. Database → when projectType is fullstack/backend-only/cli-tool/integration
6. Summary with DB → same as Database
7. Communication/API → when projectType needs API or runtimeTargets include desktop/cli/system
8. Frontend → when projectType needs frontend or runtimeTargets include web/mobile/desktop
12. AI Configuration → when intelligenceLevel !== 'none'
13. Desktop/System → when runtimeTargets includes 'desktop' or 'system'

## Key Patterns

- **Conditional step visibility** - `WIZARD_STEPS` array uses `visibleWhen(state)` callbacks; `projectCapabilities.ts` provides reusable check functions
- **Step registry** - `stepRegistry.ts` lazy-loads components and creates state-dependent Zod schemas
- **Auto-save** - `useWizardState` debounces saves to localStorage and optional MongoDB cloud sync
- **MCP auto-selection** - `TECH_TO_MCP_MAP` in `wizard.types.ts` maps tech choices to recommended MCP servers
- **Device-based identity** - `nanoid(16)` stored in localStorage; cloud save uses device ID, not user accounts
- **Arabic-first UI** - All labels have Arabic translations; RTL layout throughout

## Conventions

- **No comments in code** - Do not add comments to any files
- **Check Nuxt MCP server first** - Before creating any new page, component, or Nuxt file, consult the Nuxt MCP server to verify correct folder structure and file conventions
- **Check Nuxt UI MCP server first** - Before using any Nuxt UI component, consult the Nuxt UI MCP server to verify correct component syntax and props
- Use JavaScript in Vue components (TypeScript only in `*.config.ts` files unless user selects "TypeScript كامل")
- Zod schemas validate all form inputs
- Device identification via `nanoid` stored in localStorage
- Cloud save associates projects with device ID, not user accounts
