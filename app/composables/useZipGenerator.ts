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

  const generateReadme = (state: WizardState): string => {
    const projectName = state.projectName || state.projectNameTechnical || 'Project'
    const pm = state.packageManager

    return `# ${projectName}

${state.solutionDescription || 'Project description here.'}

## Tech Stack

| Category | Technology |
|----------|------------|
${state.techStack.frontend ? `| Frontend | ${state.techStack.frontend} |` : ''}
${state.techStack.backend ? `| Backend | ${state.techStack.backend} |` : ''}
${state.techStack.database ? `| Database | ${state.techStack.database} |` : ''}
${state.techStack.uiLibrary && state.techStack.uiLibrary !== 'None' ? `| UI Library | ${state.techStack.uiLibrary} |` : ''}

## Prerequisites

- Node.js 18+ (or specified runtime)
- ${pm} package manager

## Setup

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd ${state.projectNameTechnical || 'project'}
\`\`\`

2. Install dependencies
\`\`\`bash
${pm} install
\`\`\`

3. Copy environment variables
\`\`\`bash
cp .env.example .env
\`\`\`

4. Configure your .env file with appropriate values

5. Start development server
\`\`\`bash
${pm} dev
\`\`\`

## Available Scripts

| Command | Description |
|---------|-------------|
| \`${pm} dev\` | Start development server |
| \`${pm} build\` | Build for production |
| \`${pm} preview\` | Preview production build |
| \`${pm} lint\` | Run linter |
| \`${pm} typecheck\` | Run type checking |

## Project Structure

\`\`\`
├── app/                 # Application source
├── server/              # Server-side code
├── public/              # Static assets
├── .env.example         # Environment variables template
├── CLAUDE.md            # AI assistant guidelines
├── fix.md               # Issue tracking log
└── README.md            # This file
\`\`\`

## Environment Variables

See \`.env.example\` for required environment variables.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

[License Type]
`
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

  const downloadZip = async (state: WizardState) => {
    const zip = new JSZip()
    const projectName = state.projectNameTechnical || 'project'

    zip.file('.mcp.json', generateMcpJson(state))
    zip.file('CLAUDE.md', generateClaudeMd(state))
    zip.file('README.md', generateReadme(state))
    zip.file('project-spec.md', generateMarkdown(state))
    zip.file('fix.md', generateFixMd())
    zip.file('.env.example', generateEnvExample(state))

    const claudeFolder = zip.folder('.claude')
    const commandsFolder = claudeFolder?.folder('commands')
    commandsFolder?.file('project.md', generateClaudeCommand(state))

    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, `${projectName}.zip`)
  }

  return {
    generateMcpJson,
    generateReadme,
    generateFixMd,
    generateEnvExample,
    generatePrompt,
    downloadZip
  }
}
