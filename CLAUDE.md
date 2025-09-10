# CLAUDE.md

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run lint` - Run ESLint

## Key Architecture
**Stack**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui  
**Services**: `src/services/azureService.ts` - Azure API integration (TTS, STT, Video, OCR)  
**Context**: TaskManagerProvider, ThemeProvider  
**Routing**: React Router with pages: Dashboard, TextToSpeech, SpeechToText, VideoCreation, PdfTextExtract, Settings

## Environment Variables Required
```
VITE_AZURE_TTS_ENDPOINT=
VITE_AZURE_TTS_API_KEY=  
VITE_AZURE_STT_KEY=
VITE_AZURE_STT_REGION=
VITE_AZURE_VIDEO_ENDPOINT=
VITE_AZURE_VIDEO_API_KEY=
VITE_OCR_API_ENDPOINT=
```

## Brand & UI
- **Primary Colors**: Red theme for sixredmarbles branding
- **Navigation**: Categorized dropdowns (AI Tools, Production Tools)  
- **Components**: Compact FeatureCards with feature listings
- **Layout**: Centered dashboard, settings in top-right