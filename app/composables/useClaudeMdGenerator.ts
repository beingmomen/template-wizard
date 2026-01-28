import type { WizardState } from '~/types/wizard.types'
import { AVAILABLE_MCP_SERVERS } from '~/types/wizard.types'

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

    content += generateVersionRequirements(state)
    content += generateMcpRequirements(selectedServers)
    content += generateCodeGuidelines(state)
    content += generateFixMdUsage()
    content += generateCommands(state)
    content += generateTechStackTable(state)

    return content
  }

  const generateVersionRequirements = (state: WizardState): string => {
    let content = `## ⚠️ CRITICAL VERSION REQUIREMENTS

You MUST use these EXACT versions. Using different versions is NOT acceptable:

| Technology | Required Version | DO NOT USE |
|------------|-----------------|------------|
`

    if (state.techStack.frontend) {
      const version = state.techStack.frontend
      const doNotUse = getDoNotUseVersions(version)
      content += `| Frontend | ${version} | ${doNotUse} |\n`
    }

    if (state.techStack.uiLibrary && state.techStack.uiLibrary !== 'None') {
      const version = state.techStack.uiLibrary
      const doNotUse = getDoNotUseVersions(version)
      content += `| UI Library | ${version} | ${doNotUse} |\n`
    }

    if (state.techStack.backend) {
      content += `| Backend | ${state.techStack.backend} | - |\n`
    }

    if (state.techStack.database) {
      content += `| Database | ${state.techStack.database} | - |\n`
    }

    if (state.techStack.runtime) {
      content += `| Runtime | ${state.techStack.runtime} | - |\n`
    }

    content += '\n'
    return content
  }

  const getDoNotUseVersions = (version: string): string => {
    if (version.includes('Nuxt 4')) return 'Nuxt 3, Nuxt 2'
    if (version.includes('Nuxt 3')) return 'Nuxt 2'
    if (version.includes('Nuxt UI')) return 'Nuxt UI v2, older versions'
    return '-'
  }

  const generateMcpRequirements = (selectedServers: typeof AVAILABLE_MCP_SERVERS): string => {
    if (selectedServers.length === 0) return ''

    let content = `## 🔴 MCP SERVER REQUIREMENTS (MANDATORY)

Before ANY code creation or modification, you MUST check the relevant MCP servers.

`

    selectedServers.forEach(server => {
      content += `### ${server.name}
${server.checkInstructions}

`
    })

    return content
  }

  const generateCodeGuidelines = (state: WizardState): string => {
    let content = `## 📋 CODE GUIDELINES

### MUST Follow
- **NO COMMENTS**: Do not add any comments to code files
- **VERSION CHECK**: Always verify you're using the correct versions specified above
- **MCP FIRST**: Check relevant MCP server before creating ANY framework/UI file
- **README**: Create and maintain README.md with setup and run instructions
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
      content += `\n### Development Warnings\n`
      state.developmentWarnings.forEach(w => {
        content += `- ${w.warning}\n`
      })
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

    if (state.techStack.frontend) content += `| Frontend | ${state.techStack.frontend} |\n`
    if (state.techStack.backend) content += `| Backend | ${state.techStack.backend} |\n`
    if (state.techStack.database) content += `| Database | ${state.techStack.database} |\n`
    if (state.techStack.auth) content += `| Authentication | ${state.techStack.auth} |\n`
    if (state.techStack.runtime) content += `| Runtime | ${state.techStack.runtime} |\n`
    if (state.techStack.uiLibrary && state.techStack.uiLibrary !== 'None') {
      content += `| UI Library | ${state.techStack.uiLibrary} |\n`
    }
    if (state.techStack.orm) content += `| ORM | ${state.techStack.orm} |\n`
    content += `| Package Manager | ${state.packageManager} |\n`

    return content
  }

  return {
    generateClaudeMd
  }
}
