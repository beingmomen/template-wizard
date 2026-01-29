---
description: Update changelog with latest changes from git history
---

You are updating the changelog for the Project Template Wizard application.

## Steps

### 1. Read current changelog
Read `app/data/changelog.js` to identify:
- The latest version number and date
- The existing changelog entries (to avoid duplicating them)

### 2. Analyze recent changes
Run `git log` and `git diff` to understand what changed since the last changelog entry:
- `git log --oneline` to see recent commits
- `git diff HEAD` to see current unstaged/staged changes
- `git status` to see modified and new files

### 3. Determine version bump
Based on the changes:
- **Patch** (x.x.+1): Bug fixes, small tweaks, typo corrections
- **Minor** (x.+1.0): New features, UI improvements, new components
- **Major** (+1.0.0): Breaking changes, major rewrites

### 4. Generate changelog entry
Create a new entry in Arabic (matching the existing style) with:
- Incremented version number
- Today's date in YYYY-MM-DD format
- Type: `feature`, `fix`, or `release`
- List of changes in Arabic, each describing a user-facing change

### 5. Update the file
Edit `app/data/changelog.js` to add the new release entry at the TOP of the `releases` array (index 0), keeping all existing entries intact.

## Important Rules
- Write all change descriptions in Arabic (matching existing entries style)
- Each change should start with a verb like: إضافة (add), تحسين (improve), إصلاح (fix), تحديث (update), حذف (remove), دعم (support)
- Do NOT duplicate changes already in the changelog
- Keep descriptions concise but descriptive
- Group related changes into single entries where appropriate
- Use today's date for the new entry

## Example Entry Format
```js
{
  version: '1.5.0',
  date: '2025-01-30',
  type: 'feature',
  changes: [
    'إضافة ميزة جديدة للتصدير',
    'تحسين أداء صفحة المعالج',
    'إصلاح مشكلة في حفظ البيانات'
  ]
}
```
