# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint with TypeScript support
- `npm run preview` - Preview production build locally

### Environment Setup
1. Copy `.env.example` to `.env` and configure Azure credentials
2. Required environment variables:
   - `VITE_AZURE_TTS_ENDPOINT` - Azure OpenAI TTS endpoint
   - `VITE_AZURE_TTS_API_KEY` - Azure OpenAI TTS API key
   - `VITE_AZURE_TTS_DEPLOYMENT` - TTS deployment name (e.g., gpt-4o-mini-tts)
   - `VITE_AZURE_STT_KEY` - Azure Speech Services key
   - `VITE_AZURE_STT_REGION` - Azure Speech Services region
   - `VITE_AZURE_VIDEO_ENDPOINT` - Azure OpenAI Video endpoint
   - `VITE_AZURE_VIDEO_API_KEY` - Azure OpenAI Video API key
   - `VITE_AZURE_VIDEO_DEPLOYMENT` - Video generation deployment name

## Architecture Overview

### Application Structure
This is a React 18 + TypeScript SPA built with Vite, providing AI-powered media services:
- **Text-to-Speech (TTS)** using Azure OpenAI TTS
- **Speech-to-Text (STT)** using Azure OpenAI Whisper
- **Video Creation** using Azure OpenAI Video Generation

### Key Architectural Patterns

#### Service Layer
- `src/services/azureService.ts` - Centralized Azure API service with three main configurations:
  - TTS Config: Handles text-to-speech via Azure OpenAI
  - STT Config: Handles speech-to-text via Azure OpenAI Whisper
  - Video Config: Handles video generation via Azure OpenAI Video API
- Service uses singleton pattern and provides configuration validation methods

#### Context Architecture
- `TaskManagerProvider` - Global task state management for long-running operations
- `ThemeProvider` - Dark/light mode with system preference detection
- Both providers wrap the entire app in `App.tsx`

#### Component Organization
```
src/components/
├── ui/           # shadcn/ui components (Button, Card, Input, etc.)
├── features/     # Feature-specific components (FeatureCard)
├── common/       # Shared components (FileUpload, AudioPlayer, VideoPlayer)
└── layout/       # Layout components (Layout, ThemeProvider)
```

#### Page Structure
- Uses React Router for navigation
- Each page represents a core feature: Dashboard, TextToSpeech, SpeechToText, VideoCreation, Settings
- Pages are self-contained with their own state management

### Technology Stack Integration
- **Styling**: Tailwind CSS with shadcn/ui design system
- **Path Aliases**: `@/*` maps to `src/*` (configured in vite.config.ts and tsconfig.json)
- **Icons**: Lucide React
- **HTTP**: Axios with proper error handling
- **Build**: Vite with TypeScript compilation

### Task Management System
The app includes a sophisticated task management system for handling async operations:
- Tasks are typed by `TaskType` (text-to-speech, speech-to-text, video-creation)
- Task states: pending, processing, completed, failed
- Auto-cleanup of completed tasks after 1 hour
- Persistent task tracking across page navigation

### Azure Integration Patterns
- Service methods include comprehensive error handling
- All API calls use proper authentication headers
- Video generation uses polling pattern for job completion
- Blob handling for media files with URL generation
- Configuration validation before API calls

### Component Patterns
- Use of shadcn/ui components for consistent design
- FileUpload component supports drag-and-drop with validation
- Audio/Video players with full playback controls
- Theme toggle with system preference detection

### Development Notes
- TypeScript strict mode enabled with comprehensive type checking
- ESLint configured for React and TypeScript
- CSS custom properties used for theming
- Responsive design with mobile-first approach
- Environment variables prefixed with `VITE_` for client-side access