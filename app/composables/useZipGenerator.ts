import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type { WizardState } from '~/types/wizard.types'
import { AVAILABLE_MCP_SERVERS } from '~/types/wizard.types'

export function useZipGenerator() {
  const { generateMarkdown } = useMarkdownGenerator()
  const { generateClaudeMd } = useClaudeMdGenerator()
  const { generatePrompt, generateClaudeCommand } = usePromptGenerator()

  const generateMcpJson = (state: WizardState): string => {
    const mcpServers: Record<string, unknown> = {}

    state.selectedMcpServers.forEach(serverId => {
      const server = AVAILABLE_MCP_SERVERS.find(s => s.id === serverId)
      if (server) {
        if (server.type === 'http') {
          mcpServers[server.id] = {
            type: 'http',
            url: server.url
          }
        } else {
          mcpServers[server.id] = {
            type: 'stdio',
            command: server.command,
            args: server.args || [],
            env: {}
          }
        }
      }
    })

    return JSON.stringify({ mcpServers }, null, 2)
  }

  const generateFixMd = (): string => {
    return `# Fix Log

This file documents issues encountered during development and their solutions.
Use this to track problems and prevent them in future projects.

## Format

Each entry should follow this structure:

\`\`\`markdown
### [YYYY-MM-DD] - Issue Title
**Problem**: Clear description of the issue
**Root Cause**: Why it happened
**Solution**: How it was fixed
**Files Modified**: List of affected files
**Prevention**: How to avoid this in future
\`\`\`

---

<!-- Add your issues below this line -->

`
  }

  const generateEnvExample = (state: WizardState): string => {
    let content = `# Environment Variables
# Copy this file to .env and fill in the values

`
    const addedVars = new Set<string>()

    state.environmentVariables.forEach(env => {
      if (!addedVars.has(env.name)) {
        content += `# ${env.description}${env.required ? ' (required)' : ' (optional)'}\n`
        content += `${env.name}=${env.example}\n\n`
        addedVars.add(env.name)
      }
    })

    return content
  }

  const generateTestPlaywrightCommand = (state: WizardState): string => {
    const projectName = state.projectName || state.projectNameTechnical || 'Project'
    const pm = state.packageManager || 'pnpm'

    return `---
description: Test ${projectName} using Playwright MCP
---

You are testing the "${projectName}" application using the Playwright MCP server.

## Steps

### 1. Ensure dev server is running
Run \`${pm} dev\` in the background if not already running. Wait for the server to be ready at http://localhost:3000.

### 2. Test core pages
Use Playwright MCP (\`browser_navigate\`, \`browser_snapshot\`, \`browser_click\`) to test:

**Home Page (http://localhost:3000)**
- Page loads correctly
- Main content is visible
- Navigation links work

**Key Pages**
- Navigate to all main routes defined in the project
- Verify each page loads without errors
- Check that interactive elements (buttons, forms, links) are functional

### 3. Test the latest feature
Read the project's recent git commits or changelog to identify the latest changes, then:
- Navigate to the relevant page/section that the feature affects
- Interact with the new/modified UI elements
- Verify the feature works as expected

### 4. Report results
After testing, provide a summary:
\`\`\`
## Test Results

**Project:** ${projectName}
**Server:** http://localhost:3000
**Date:** [current date]

### Pages Tested
- [ ] Home page loads
- [ ] [page name] works
- [ ] [page name] works

### Latest Feature: [feature name]
- [ ] [specific test result]

### Issues Found
- [list any issues or "None"]
\`\`\`

## Important Notes
- Use \`browser_snapshot\` (not screenshots) for checking page state
- If a page takes time to load, use \`browser_wait_for\` with appropriate text
- The wizard auto-creates a project and redirects, so wait for navigation to complete
`
  }

  const downloadZip = async (state: WizardState) => {
    const zip = new JSZip()
    const projectName = state.projectNameTechnical || 'project'

    zip.file('.mcp.json', generateMcpJson(state))
    zip.file('CLAUDE.md', generateClaudeMd(state))
    zip.file('project-spec.md', generateMarkdown(state))
    zip.file('fix.md', generateFixMd())
    zip.file('.env.example', generateEnvExample(state))

    const claudeFolder = zip.folder('.claude')
    const commandsFolder = claudeFolder?.folder('commands')
    commandsFolder?.file('project.md', generateClaudeCommand(state))
    commandsFolder?.file('test-playwright.md', generateTestPlaywrightCommand(state))

    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, `${projectName}.zip`)
  }

  return {
    generateMcpJson,
    generateFixMd,
    generateEnvExample,
    generatePrompt,
    downloadZip
  }
}
