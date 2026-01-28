import type { WizardState } from '~/types/wizard.types'

export function usePromptGenerator() {
  const generatePrompt = (state: WizardState): string => {
    const projectName = state.projectName || state.projectNameTechnical || 'Project'

    return `I'm starting a new project called "${projectName}". Please read the attached project files:

📁 Files to read (in order):
1. CLAUDE.md - Contains MANDATORY instructions you MUST follow
2. project-spec.md - Full project specification
3. .mcp.json - Available MCP servers for this project

⚠️ CRITICAL REQUIREMENTS:
- Follow ALL instructions in CLAUDE.md exactly
- Use ONLY the specified versions (check the version table carefully)
- ALWAYS check MCP servers before creating framework/UI files
- Create fix.md to log any issues you encounter and solve
- Create README.md with setup and run instructions
- Never duplicate ENV variables between files
- NO COMMENTS in code files

📋 First Steps:
1. Read and understand all files completely
2. Confirm version requirements are clear
3. Verify MCP servers are available in your environment
4. Reply "Ready to implement ${projectName}" when ready

⚡ Do NOT start coding until you confirm you've read everything.`
  }

  const generateClaudeCommand = (state: WizardState): string => {
    const projectName = state.projectName || state.projectNameTechnical || 'Project'

    return `---
description: Initialize and implement ${projectName} from specification
---

Read the following files in order:
1. CLAUDE.md - Contains MANDATORY instructions you MUST follow
2. project-spec.md - Full project specification

## Before Starting
- Verify .mcp.json contains required MCP servers
- Confirm you understand version requirements in CLAUDE.md
- Create fix.md file for logging issues

## Implementation Steps
1. Set up project structure following the specification
2. Install dependencies with the specified package manager (${state.packageManager})
3. Implement features phase by phase as defined in project-spec.md
4. Create README.md with complete setup instructions
5. Log any issues encountered in fix.md

## Critical Rules
- ALWAYS check MCP servers before creating framework/UI files
- NEVER use versions different from specification
- ALWAYS create README.md with setup and run instructions
- ALWAYS log issues in fix.md with date, problem, and solution
- NO COMMENTS in code files

## Version Requirements
${state.techStack.frontend ? `- Frontend: ${state.techStack.frontend}` : ''}
${state.techStack.uiLibrary && state.techStack.uiLibrary !== 'None' ? `- UI Library: ${state.techStack.uiLibrary}` : ''}
${state.techStack.backend ? `- Backend: ${state.techStack.backend}` : ''}
${state.techStack.database ? `- Database: ${state.techStack.database}` : ''}

Reply "Ready to implement ${projectName}" when you've read all files.`
  }

  return {
    generatePrompt,
    generateClaudeCommand
  }
}
