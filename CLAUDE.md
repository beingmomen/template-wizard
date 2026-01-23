# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Project Template Wizard is a Nuxt 4 application that generates project specification documents through a 9-step wizard. Users fill out project details (overview, user stories, tech stack, database, API, frontend, features, dependencies, guidelines) and export a Markdown specification file for use with AI assistants.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server at http://localhost:3000
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

### Validation (`app/schemas/`)
Each wizard step has a corresponding Zod schema exported from `schemas/index.ts`:
- `quickReference.schema.ts` → `api.schema.ts` → `guidelines.schema.ts`

### Types (`app/types/wizard.types.ts`)
Central type definitions including `WizardState`, step definitions (`WIZARD_STEPS`), and initial state (`initialWizardState`).

### Server (`server/`)
- `utils/mongodb.ts` - MongoDB connection singleton (requires `MONGODB_URI` env var)
- `api/projects.post.ts` - Create/update projects
- `api/projects.get.ts` - List projects by device ID
- `api/projects/[id].get.ts` - Fetch single project

### Wizard Steps Flow
1. Overview (project name, problem, solution, target users)
2. User Stories (user types with stories)
3. Technical (tech stack, architecture, multi-tenancy)
4. Database (tables, columns, relationships)
5. API (style, endpoints)
6. Frontend (pages, shared components)
7. Features (MVP, future, edge cases, phases)
8. Dependencies (backend/frontend packages, env vars)
9. Guidelines (TypeScript mode, development warnings)

## Conventions

- **No comments in code** - Do not add comments to any files
- **Check Nuxt MCP server first** - Before creating any new page, component, or Nuxt file, consult the Nuxt MCP server to verify correct folder structure and file conventions
- **Check Nuxt UI MCP server first** - Before using any Nuxt UI component, consult the Nuxt UI MCP server to verify correct component syntax and props
- Use JavaScript in Vue components (TypeScript only in `*.config.ts` files unless user selects "TypeScript كامل")
- Zod schemas validate all form inputs
- Device identification via `nanoid` stored in localStorage
- Cloud save associates projects with device ID, not user accounts
