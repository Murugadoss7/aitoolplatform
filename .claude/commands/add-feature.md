---
description: Add new feature to AI Media Platform
---

# Add Feature

Execute sections sequentially to add a new feature with proper integration, testing, and documentation.

## Context
Read CLAUDE.md for codebase understanding, then analyze existing patterns.

## Analysis
1. Review `src/services/azureService.ts` - API integration patterns
2. Check `src/types/` - Type definitions structure  
3. Examine `src/pages/` - Page component patterns
4. Review `src/context/TaskManagerContext.tsx` - Task management integration

## Implementation
1. **Types**: Add new types to appropriate file in `src/types/`
2. **Service**: Extend `azureService.ts` with new API methods following existing patterns
3. **Context**: Update TaskManagerContext if async operations needed
4. **Components**: 
   - Create page component in `src/pages/`
   - Add necessary UI components in `src/components/`
   - Follow shadcn/ui patterns
5. **Routing**: Update `App.tsx` with new route
6. **Navigation**: Update `Layout.tsx` navigation if needed

## DO NOT
1. Make any random change to the UI and the flow
2. Change the positions or color or placeholder

## IMPORTANT
1. Retain the current UI always for any new features

## Testing
1. Run `npm run dev` - Verify development server starts
2. Test new feature functionality manually
3. Run `npm run build` - Ensure production build succeeds
4. Run `npm run lint` - Fix any linting errors

## Documentation
Update README.md:
1. Add feature to Core Features section
2. Add usage instructions to Usage Guide
3. Update Project Structure if new directories added
4. Add any new environment variables to Quick Start

## Validation
- [ ] Feature works as expected
- [ ] No console errors
- [ ] Build passes
- [ ] Lint passes
- [ ] README updated
- [ ] Types are properly defined
- [ ] Error handling implemented