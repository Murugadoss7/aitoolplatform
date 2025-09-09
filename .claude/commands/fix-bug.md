---
description: Fix bug in AI Media Platform
---

# Fix Bug

Execute sections to identify, fix, and validate bug fixes with proper testing.

## Context
Read CLAUDE.md and understand the issue scope.

## Investigation
1. **Reproduce**: Understand the bug scenario
2. **Locate**: Search codebase using Grep/Glob to find relevant code
3. **Analyze**: 
   - Check `src/services/azureService.ts` for API-related issues
   - Review component state management
   - Check error handling patterns
   - Examine type definitions in `src/types/`

## Root Cause Analysis
1. Identify the exact cause
2. Check for similar issues in codebase
3. Determine if it affects other components
4. Review error logs/console output

## Fix Implementation
1. **Implement Fix**: Follow existing code patterns
2. **Error Handling**: Ensure proper error boundaries
3. **Type Safety**: Update types if needed
4. **Side Effects**: Check impact on other features

## Testing
1. **Manual Testing**: 
   - Test the specific bug scenario
   - Test related functionality
   - Test edge cases
2. **Build Testing**:
   - Run `npm run dev` - Verify no development issues
   - Run `npm run build` - Ensure production build works
   - Run `npm run lint` - Fix any linting issues

## Validation
- [ ] Bug is fixed
- [ ] No regressions introduced
- [ ] Related functionality still works
- [ ] Build passes
- [ ] Lint passes
- [ ] No new console errors
- [ ] Error handling is appropriate

## Documentation (if needed)
Update README.md if:
- Bug fix changes user-facing behavior
- New troubleshooting steps added
- Configuration changes required