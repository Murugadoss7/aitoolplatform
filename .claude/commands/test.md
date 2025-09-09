---
description: Comprehensive testing for AI Media Platform
---

# Test

Execute comprehensive testing workflow for features, fixes, and overall application health.

## Context
Read CLAUDE.md for understanding. Identify what needs testing (new feature, bug fix, or general health check).

## Pre-Testing Setup
1. Ensure environment is configured (`cp .env.example .env`)
2. Install dependencies: `npm install`

## Development Testing
1. **Start Dev Server**: `npm run dev`
   - Verify server starts on localhost:5173
   - Check for console errors
   - Confirm hot reload works

## Build Testing
1. **Production Build**: `npm run build`
   - Verify TypeScript compilation succeeds
   - Check for build warnings/errors
   - Confirm dist folder generated

2. **Preview Build**: `npm run preview`
   - Test production build locally
   - Verify all features work in production mode

## Code Quality Testing
1. **Linting**: `npm run lint`
   - Fix any ESLint errors
   - Ensure TypeScript strict mode compliance

## Feature Testing (Manual)
Test each core feature systematically:

### Text-to-Speech Testing
- [ ] Settings page: Configure Azure TTS credentials
- [ ] TTS page: Enter text, select voice, adjust parameters
- [ ] Generate audio and verify playback
- [ ] Download functionality works
- [ ] Error handling for invalid inputs

### Speech-to-Text Testing  
- [ ] Settings page: Configure Azure STT credentials
- [ ] STT page: Upload audio file (MP3, WAV, M4A, OGG)
- [ ] Transcription completes successfully
- [ ] Download transcript works
- [ ] Error handling for unsupported formats

### Video Creation Testing
- [ ] Settings page: Configure Azure Video credentials  
- [ ] Video page: Enter prompt, configure settings
- [ ] Video generation completes (may take time)
- [ ] Video playback and download works
- [ ] Error handling for failed generations

## Integration Testing
- [ ] Task Manager: Verify tasks are tracked correctly
- [ ] Theme Toggle: Dark/light mode switches work
- [ ] Navigation: All routes work correctly
- [ ] File Upload: Drag & drop functions properly
- [ ] Error Boundaries: Graceful error handling

## Browser Testing
Test in multiple browsers if critical:
- [ ] Chrome (primary target)
- [ ] Firefox 
- [ ] Safari (if Mac available)
- [ ] Edge

## Performance Testing
- [ ] Initial page load time acceptable
- [ ] No memory leaks during navigation
- [ ] Large file uploads handle gracefully
- [ ] Task cleanup works properly

## Security Testing
- [ ] API keys not exposed in browser dev tools
- [ ] File upload validation works
- [ ] No sensitive data in console logs
- [ ] HTTPS enforcement (production)

## Final Validation
- [ ] All tests pass
- [ ] No console errors
- [ ] Application behaves as expected
- [ ] Performance is acceptable
- [ ] Ready for deployment/use