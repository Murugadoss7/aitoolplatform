---
description: Complete development workflow for AI Media Platform
---

# Workflow

Complete development workflow combining feature development, bug fixes, testing, and documentation.

## Quick Reference Commands
- `@add-feature.md` - Add new feature
- `@fix-bug.md` - Fix existing bug  
- `@test.md` - Run comprehensive tests
- `@update-readme.md` - Update documentation
- `@prime.md` - Understand codebase

## Standard Workflow

### For New Features
1. Execute `@add-feature.md` 
2. Execute `@test.md`
3. Execute `@update-readme.md`

### For Bug Fixes
1. Execute `@fix-bug.md`
2. Execute `@test.md` 
3. Execute `@update-readme.md` (if user-facing)

### For Code Understanding
1. Execute `@prime.md` first
2. Then proceed with relevant workflow

## Key Patterns to Follow

### Code Architecture
- Services in `src/services/azureService.ts`
- Types in `src/types/`
- Pages in `src/pages/`
- Reusable components in `src/components/`
- Task management via `TaskManagerContext`

### Development Standards
- TypeScript strict mode
- shadcn/ui components
- Tailwind CSS styling
- Error boundaries for graceful failures
- Environment variable configuration

### Testing Requirements
- `npm run dev` must start successfully
- `npm run build` must complete without errors
- `npm run lint` must pass
- Manual testing of affected features
- No console errors

### Documentation Requirements
- README.md updated for user-facing changes
- Environment variables documented
- Usage instructions clear and complete
- Troubleshooting section updated as needed

## Context Efficiency
Always read CLAUDE.md first for codebase understanding. Use targeted file reading rather than broad exploration to preserve context window.