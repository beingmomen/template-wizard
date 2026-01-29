---
description: Test the project or latest feature using Playwright MCP
---

You are testing the Project Template Wizard application using the Playwright MCP server.

## Steps

### 1. Read the latest changelog
Read `app/data/changelog.js` to identify:
- The latest version number
- The list of changes in that version
- This tells you what the "latest feature" is

### 2. Ensure dev server is running
Run `pnpm dev` in the background if not already running. Wait for the server to be ready at http://localhost:3000.

### 3. Test core pages
Use Playwright MCP (`browser_navigate`, `browser_snapshot`, `browser_click`) to test:

**Home Page (http://localhost:3000)**
- Page loads correctly
- Hero section is visible
- "بدء مشروع جديد" (Start New Project) button exists and is clickable
- Navigation links work (Changelog, Methodology)

**Wizard Page (http://localhost:3000/wizard)**
- Wizard creates a new project and redirects to `/wizard/[id]`
- First step (Quick Reference) loads
- Form fields are visible and fillable
- "التالي" (Next) button navigates to the next step
- Navigate through at least 3 steps to verify step navigation works

**Changelog Page (http://localhost:3000/changelog)**
- Page loads correctly
- Latest version is displayed
- Changes list is visible

### 4. Test the latest feature
Based on the changelog you read in step 1, specifically test the latest changes:
- Navigate to the relevant page/step that the feature affects
- Interact with the new/modified UI elements
- Verify the feature works as described in the changelog

### 5. Report results
After testing, provide a summary:
```
## Test Results

**Version Tested:** [version from changelog]
**Server:** http://localhost:3000
**Date:** [current date]

### Core Pages
- [ ] Home page loads ✅/❌
- [ ] Wizard creates project ✅/❌
- [ ] Step navigation works ✅/❌
- [ ] Changelog page loads ✅/❌

### Latest Feature: [feature name]
- [ ] [specific test result] ✅/❌

### Issues Found
- [list any issues or "None"]
```

## Important Notes
- Use `browser_snapshot` (not screenshots) for checking page state
- If a page takes time to load, use `browser_wait_for` with appropriate text
- The app is RTL (Arabic interface) - text direction is right-to-left
- The wizard auto-creates a project and redirects, so wait for navigation to complete
