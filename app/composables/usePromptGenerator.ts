import type { WizardState } from '~/types/wizard.types'
import { NUXT_UI_TEMPLATES } from '~/types/wizard.types'

export function usePromptGenerator() {
  const isNuxtUiProject = (state: WizardState): boolean => {
    return (state.techStack.uiLibrary && state.techStack.uiLibrary.includes('Nuxt UI'))
      || state.selectedMcpServers.includes('nuxt-ui-remote')
  }

  const generatePrompt = (state: WizardState): string => {
    const projectName = state.projectName || state.projectNameTechnical || 'Project'
    const hasNuxtUi = isNuxtUiProject(state)

    const hasMcpJson = state.includeMcpJson

    let prompt = `I'm starting a new project called "${projectName}". Please read the attached project files:

📁 Files to read (in order):
1. CLAUDE.md - Contains MANDATORY instructions you MUST follow
2. project-spec.md - Full project specification${hasMcpJson ? '\n3. .mcp.json - Available MCP servers for this project' : ''}

⚠️ CRITICAL REQUIREMENTS:
- Follow ALL instructions in CLAUDE.md exactly
- Use ONLY the specified versions (check the version table carefully)
- **MCP FIRST**: ${!hasMcpJson ? 'Use ALL available MCP servers and plugins in your Claude Code environment — query them' : 'Follow the MCP FIRST checklist above — query MCP servers'} before creating ANY file, do NOT rely on training data for framework APIs
- Create fix.md to log any issues you encounter and solve
- After project setup is complete, create README.md with setup and run instructions
- Never duplicate ENV variables between files
- NO COMMENTS in code files
- **Project Nature**: ${state.projectNature}
- **Runtime Targets**: ${state.runtimeTargets?.join(', ') || 'web'}
- **Intelligence Level**: ${state.intelligenceLevel}`

    if (state.architecture === 'monorepo') {
      prompt += `
- MONOREPO: Create apps in apps/ directory and shared packages in packages/ - DO NOT put project files in root`
    }

    if (hasNuxtUi) {
      const templateName = state.frontendMode === 'template' && state.selectedTemplate
        ? NUXT_UI_TEMPLATES.find(t => t.id === state.selectedTemplate)?.name
        : null

      prompt += `

⭐ IMPORTANT - PROJECT SETUP:
This project uses Nuxt UI. You MUST use /nuxt-ui-remote:setup_project_with_template as the FIRST step.`

      if (templateName) {
        prompt += `
Select the **${templateName}** template when prompted.`
      }

      prompt += `
DO NOT manually create nuxt.config.ts or install Nuxt UI - the MCP template handles everything.`
    }

    prompt += `

📋 First Steps:
1. Read and understand all files completely
2. Confirm version requirements are clear
3. Verify MCP servers are available in your environment`

    if (hasNuxtUi) {
      const setupTemplateName = state.frontendMode === 'template' && state.selectedTemplate
        ? NUXT_UI_TEMPLATES.find(t => t.id === state.selectedTemplate)?.name
        : null

      prompt += `
4. Run /nuxt-ui-remote:setup_project_with_template${setupTemplateName ? ` and select the **${setupTemplateName}** template` : ''} to create the project
5. Reply "Ready to implement ${projectName}" when setup is complete`
    } else {
      prompt += `
4. Reply "Ready to implement ${projectName}" when ready`
    }

    prompt += `

⚡ Do NOT start coding until you confirm you've read everything.`

    return prompt
  }

  const generateClaudeCommand = (state: WizardState): string => {
    const projectName = state.projectName || state.projectNameTechnical || 'Project'
    const hasNuxtUi = isNuxtUiProject(state)
    const hasMcpJson = state.includeMcpJson

    let command = `---
description: Initialize and implement ${projectName} from specification
---

Read the following files in order:
1. CLAUDE.md - Contains MANDATORY instructions you MUST follow
2. project-spec.md - Full project specification

## Before Starting
${hasMcpJson ? '- Verify .mcp.json contains required MCP servers' : '- Use the MCP servers and plugins already available in your Claude Code environment for documentation lookups'}
- Confirm you understand version requirements in CLAUDE.md
- Create fix.md file for logging issues

## Implementation Steps
`

    if (hasNuxtUi) {
      const templateName = state.frontendMode === 'template' && state.selectedTemplate
        ? NUXT_UI_TEMPLATES.find(t => t.id === state.selectedTemplate)?.name
        : null

      command += `1. **FIRST**: Run /nuxt-ui-remote:setup_project_with_template${templateName ? ` and select the **${templateName}** template` : ' and select the appropriate template'}
2. Copy CLAUDE.md, ${hasMcpJson ? '.mcp.json, ' : ''}fix.md, .env.example to the new project root
3. Implement features phase by phase as defined in project-spec.md
4. After implementation, create README.md with complete setup and run instructions
5. Log any issues encountered in fix.md`
    } else {
      command += `1. Set up project structure following the specification
2. Install dependencies with the specified package manager (${state.packageManager})
3. Implement features phase by phase as defined in project-spec.md
4. After implementation, create README.md with complete setup and run instructions
5. Log any issues encountered in fix.md`
    }

    command += `

## Critical Rules
- **MCP FIRST**: ${!hasMcpJson ? 'Use ALL available MCP servers and plugins in your environment — query them' : 'Follow the MCP FIRST checklist above — query MCP servers'} before creating ANY file, do NOT rely on training data for framework APIs
- NEVER use versions different from specification
- ALWAYS create README.md with setup and run instructions after project is ready
- ALWAYS log issues in fix.md with date, problem, and solution
- NO COMMENTS in code files`

    if (state.architecture === 'monorepo') {
      command += `
- MONOREPO: All applications go in apps/ directory, shared packages in packages/ directory. Root folder is for workspace config only.`
    }

    if (hasNuxtUi) {
      command += `
- DO NOT manually create nuxt.config.ts or install Nuxt UI - use /nuxt-ui-remote:setup_project_with_template`
    }

    command += `

## Version Requirements
${state.techStack.frontend ? `- Frontend: ${formatTechWithVersion(state.techVersions, state.techStack.frontend)}` : ''}
${state.techStack.uiLibrary && state.techStack.uiLibrary !== 'None' ? `- UI Library: ${formatTechWithVersion(state.techVersions, state.techStack.uiLibrary)}` : ''}
${state.techStack.backend ? `- Backend: ${formatTechWithVersion(state.techVersions, state.techStack.backend)}` : ''}
${state.techStack.database ? `- Database: ${formatTechWithVersion(state.techVersions, state.techStack.database)}` : ''}

Reply "Ready to implement ${projectName}" when you've read all files.`

    return command
  }

  return {
    generatePrompt,
    generateClaudeCommand
  }
}
