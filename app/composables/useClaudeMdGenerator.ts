import type { WizardState } from '~/types/wizard.types'
import { AVAILABLE_MCP_SERVERS, NUXT_UI_TEMPLATES } from '~/types/wizard.types'

export function useClaudeMdGenerator() {
  const generateClaudeMd = (state: WizardState): string => {
    const selectedServers = AVAILABLE_MCP_SERVERS.filter(s =>
      state.selectedMcpServers.includes(s.id)
    )

    let content = `# CLAUDE.md

This file provides MANDATORY guidance for AI assistants working on this project.

## Project Overview

- **Project Name**: ${state.projectName}
- **Technical Name**: ${state.projectNameTechnical}
- **Type**: ${state.projectType}
- **Size**: ${state.projectSize}

`

    content += generateMcpFirstChecklist(selectedServers)
    content += generateProjectSetup(state)
    content += generateMonorepoWarning(state)
    content += generateVersionRequirements(state)
    content += generateMcpRequirements(selectedServers)
    content += generateCodeGuidelines(state)
    content += generateFixMdUsage()
    content += generateCommands(state)
    content += generateTechStackTable(state)

    return content
  }

  const isNuxtUiProject = (state: WizardState): boolean => {
    return (state.techStack.uiLibrary && state.techStack.uiLibrary.includes('Nuxt UI'))
      || state.selectedMcpServers.includes('nuxt-ui-remote')
  }

  const generateProjectSetup = (state: WizardState): string => {
    if (!isNuxtUiProject(state)) return ''

    const templateName = state.frontendMode === 'template' && state.selectedTemplate
      ? NUXT_UI_TEMPLATES.find(t => t.id === state.selectedTemplate)?.name
      : null

    let content = `## 🚀 PROJECT SETUP (MANDATORY FIRST STEP)

This project uses **Nuxt UI**. You MUST use the MCP template setup to create the project:

1. Run: \`/nuxt-ui-remote:setup_project_with_template\`
`

    if (templateName) {
      content += `2. Select the **${templateName}** template
`
    } else {
      content += `2. Select the appropriate template based on project type
`
    }

    content += `3. After setup completes, copy the downloaded files (CLAUDE.md, .mcp.json, fix.md, .env.example) to the project root
4. Then proceed with implementing the specification in project-spec.md

> **WARNING**: DO NOT manually create nuxt.config.ts, package.json, or install Nuxt/Nuxt UI manually.
> The MCP template handles all of this automatically with the correct versions and configuration.

`
    return content
  }

  const generateMonorepoWarning = (state: WizardState): string => {
    if (state.architecture !== 'monorepo') return ''

    return `## ⚠️ MONOREPO STRUCTURE

This project uses a **monorepo** architecture. You MUST:

- Create all applications inside \`apps/\` directory (e.g., \`apps/web\`, \`apps/api\`)
- Create shared packages inside \`packages/\` directory (e.g., \`packages/shared\`)
- **DO NOT** create project files directly in the root folder
- Root should only contain: workspace config, CLAUDE.md, .mcp.json, fix.md, package.json (workspace root)

\`\`\`
project-root/
├── apps/
│   ├── web/          # Frontend application
│   └── api/          # Backend application
├── packages/
│   └── shared/       # Shared utilities/types
├── CLAUDE.md
├── .mcp.json
├── fix.md
├── package.json      # Workspace root
└── ...
\`\`\`

`
  }

  const generateVersionRequirements = (state: WizardState): string => {
    let content = `## ⚠️ VERSION REQUIREMENTS

Always use the **Latest** version of each technology unless a specific version is noted below.

| Technology | Version |
|------------|---------|
`

    if (state.techStack.frontend) {
      content += `| Frontend | ${formatTechWithVersion(state.techVersions, state.techStack.frontend)} |\n`
    }

    if (state.techStack.uiLibrary && state.techStack.uiLibrary !== 'None') {
      content += `| UI Library | ${formatTechWithVersion(state.techVersions, state.techStack.uiLibrary)} |\n`
    }

    if (state.techStack.backend) {
      content += `| Backend | ${formatTechWithVersion(state.techVersions, state.techStack.backend)} |\n`
    }

    if (state.techStack.database) {
      content += `| Database | ${formatTechWithVersion(state.techVersions, state.techStack.database)} |\n`
    }

    if (state.techStack.runtime) {
      content += `| Runtime | ${formatTechWithVersion(state.techVersions, state.techStack.runtime)} |\n`
    }

    content += '\n'
    return content
  }

  const generateMcpFirstChecklist = (selectedServers: typeof AVAILABLE_MCP_SERVERS): string => {
    if (selectedServers.length === 0) return ''

    return `## 🛑 MCP FIRST — NON-NEGOTIABLE

> **This is the #1 rule of this project. Break this rule and ALL your code is invalid.**

For EVERY file you create or modify:
1. IDENTIFY which frameworks/libraries the file uses
2. CALL the MCP tool for each one BEFORE writing code
3. USE the exact syntax from MCP responses
4. NEVER write framework code from memory

This applies to: components, pages, layouts, composables, middleware, plugins, config files.
No exceptions. No shortcuts. No "I already know this component."

`
  }

  const generateMcpRequirements = (selectedServers: typeof AVAILABLE_MCP_SERVERS): string => {
    if (selectedServers.length === 0) return ''

    let content = `## 🔴 BLOCKING REQUIREMENT: MCP SERVERS

### ⛔ STOP — READ THIS BEFORE WRITING ANY CODE

You MUST call the relevant MCP tool BEFORE writing ANY code that uses a framework component.
Code written WITHOUT first querying MCP is INVALID and must be rewritten.

### Pre-Code Checklist (MANDATORY for every file)

Before creating or modifying ANY file, verify:

- [ ] Did I call the MCP tool for EVERY framework component I'm about to use?
- [ ] Am I using the EXACT syntax returned by MCP (not from memory/training data)?
- [ ] Did I verify the component props and slots match the MCP response?

### MCP Tools Reference

| When you write... | You MUST first call... |
|---|---|
| Any \`<U...>\` component (UButton, USelect, UModal, UTable, etc.) | \`mcp__nuxt-ui-remote__get-component\` |
| Any Nuxt file (page, component, composable, middleware) | \`mcp__nuxt-remote__get-documentation-page\` |
| Any Nuxt module or plugin | \`mcp__nuxt-remote__list-modules\` or \`mcp__nuxt-remote__get-module\` |

### Per-Server Instructions

`

    selectedServers.forEach((server) => {
      content += `#### ${server.name}
${server.checkInstructions}

`
    })

    content += `### ❌ EXAMPLES OF INVALID BEHAVIOR
- Writing \`<USelect :items="..." />\` without calling get-component for USelect first
- Creating a Nuxt page without checking the pages documentation
- Using component props from memory instead of MCP response
- Assuming component API hasn't changed between versions

### ✅ CORRECT WORKFLOW
1. Identify which components/APIs you need
2. Call the relevant MCP tool for EACH one
3. Read the MCP response carefully
4. Write code using ONLY the syntax from MCP responses
5. If unsure about any prop or slot, call MCP again

`

    return content
  }

  const generateCodeGuidelines = (state: WizardState): string => {
    let content = `## 📋 CODE GUIDELINES

### MUST Follow
- **NO COMMENTS**: Do not add any comments to code files
- **VERSION CHECK**: Always verify you're using the correct versions specified above
- **MCP FIRST**: Follow the MCP FIRST checklist above — query MCP servers before creating ANY file, do NOT rely on training data for framework APIs
- **README**: After project setup is complete, create README.md with setup and run instructions
- **ENV VARIABLES**: Never duplicate environment variables between global and local .env files
- **FIX LOG**: Document all issues and their solutions in fix.md

### TypeScript Mode
`

    if (state.useTypeScript === 'config-only') {
      content += `- Use JavaScript in Vue components
- TypeScript only in *.config.ts files
- Use JSDoc for type hints when needed
`
    } else {
      content += `- Use TypeScript everywhere
- Define proper types for all functions and components
- Avoid using 'any' type
`
    }

    if (state.developmentWarnings.length > 0) {
      const enabledWarnings = state.developmentWarnings.filter(w => w.enabled)
      if (enabledWarnings.length > 0) {
        content += `\n### Development Warnings\n`
        enabledWarnings.forEach((w) => {
          content += `- ${w.warning}\n`
        })
      }
    }

    content += '\n'
    return content
  }

  const generateFixMdUsage = (): string => {
    return `## 📝 fix.md Usage

When solving ANY issue during development, log it immediately in fix.md:

\`\`\`markdown
### [YYYY-MM-DD] - Issue Title
**Problem**: Clear description of the issue
**Root Cause**: Why it happened
**Solution**: How it was fixed
**Files Modified**: List of affected files
**Prevention**: How to avoid this in future
\`\`\`

This helps track issues and improve future project planning.

`
  }

  const generateCommands = (state: WizardState): string => {
    const pm = state.packageManager

    return `## 🚀 Commands

\`\`\`bash
${pm} install          # Install dependencies
${pm} dev              # Start development server
${pm} build            # Build for production
${pm} preview          # Preview production build
${pm} lint             # Run linter
${pm} typecheck        # Run type checking
\`\`\`

`
  }

  const generateTechStackTable = (state: WizardState): string => {
    let content = `## 📦 Tech Stack

| Category | Technology |
|----------|------------|
`

    if (state.techStack.frontend) content += `| Frontend | ${formatTechWithVersion(state.techVersions, state.techStack.frontend)} |\n`
    if (state.techStack.backend) content += `| Backend | ${formatTechWithVersion(state.techVersions, state.techStack.backend)} |\n`
    if (state.techStack.database) content += `| Database | ${formatTechWithVersion(state.techVersions, state.techStack.database)} |\n`
    if (state.techStack.auth) content += `| Authentication | ${state.techStack.auth} |\n`
    if (state.techStack.runtime) content += `| Runtime | ${formatTechWithVersion(state.techVersions, state.techStack.runtime)} |\n`
    if (state.techStack.uiLibrary && state.techStack.uiLibrary !== 'None') {
      content += `| UI Library | ${formatTechWithVersion(state.techVersions, state.techStack.uiLibrary)} |\n`
    }
    if (state.techStack.orm) content += `| ORM | ${state.techStack.orm} |\n`
    if (state.techStack.frontendPort) content += `| Frontend Port | ${state.techStack.frontendPort} |\n`
    if (state.techStack.port) content += `| Backend Port | ${state.techStack.port} |\n`
    content += `| Package Manager | ${state.packageManager} |\n`

    return content
  }

  return {
    generateClaudeMd
  }
}
