# AI Media Platform

A modern React application that provides text-to-speech, speech-to-text, and video creation features using Azure OpenAI models.

## Features

### 🎯 Core Features
- **Text-to-Speech (TTS)**: Convert written text into natural-sounding speech using Azure OpenAI TTS with 6 high-quality voices and customizable parameters
- **Speech-to-Text (STT)**: Transform audio recordings into accurate text transcriptions
- **Video Creation**: Generate engaging videos from text prompts with AI-powered tools

### 🎨 User Interface
- Clean, modern UI with shadcn/ui components
- Responsive design that works on mobile, tablet, and desktop
- Dark/Light mode toggle with system preference detection
- Professional design system with consistent styling

### ⚙️ Technical Features
- Built with React 18+ and TypeScript for type safety
- Vite for fast development and optimized builds
- Tailwind CSS for utility-first styling
- Azure OpenAI and Speech Services integration
- File upload with drag-and-drop support
- Audio and video players with full controls

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Azure OpenAI account with API access
- Azure Speech Services account

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd ai-media-platform
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Azure credentials:
   ```env
   VITE_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   VITE_AZURE_OPENAI_API_KEY=your_azure_openai_api_key
   VITE_AZURE_OPENAI_API_VERSION=2025-03-01-preview
   VITE_AZURE_OPENAI_TTS_DEPLOYMENT=gpt-4o-mini-tts
   VITE_AZURE_SPEECH_KEY=your_azure_speech_key
   VITE_AZURE_SPEECH_REGION=your_azure_speech_region
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview  # Preview the production build
```

## Usage Guide

### 1. Initial Setup
- Navigate to **Settings** page
- Enter your Azure OpenAI endpoint and API key
- Enter your Azure Speech Services subscription key and region
- Click "Save Settings" and "Test Connection"

### 2. Text-to-Speech
- Go to **Text to Speech** page
- Enter your text in the input area
- Customize voice parameters (voice, speed, pitch, volume, format)
- Click "Convert to Speech"
- Use the audio player to preview and download

### 3. Speech-to-Text
- Go to **Speech to Text** page
- Upload an audio file (MP3, WAV, M4A, OGG)
- Configure recognition settings (language, mode, filters)
- Click "Transcribe Audio"
- Edit the transcript and download as text file

### 4. Video Creation
- Go to **Video Creation** page
- Enter a descriptive prompt for your video
- Optionally upload background image and audio
- Configure video settings (resolution, duration, frame rate, style)
- Add text overlays if needed
- Click "Generate Video"
- Preview and download the generated video

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components (Button, Card, Input, etc.)
│   ├── features/     # Feature-specific components (FeatureCard)
│   ├── common/       # Shared components (FileUpload, AudioPlayer, VideoPlayer)
│   └── layout/       # Layout components (Layout, ThemeProvider)
├── pages/            # Main page components (Dashboard, TextToSpeech, etc.)
├── hooks/            # Custom React hooks
├── services/         # API service functions (azureService)
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── constants/        # App constants (voices, languages, formats)
└── lib/              # Library utilities (utils.ts)
```

## Key Components

### Services
- **azureService.ts**: Handles all Azure API integrations
- **ThemeProvider**: Manages dark/light mode state
- **Layout**: Main application layout with navigation

### Pages
- **Dashboard**: Feature overview and quick actions
- **TextToSpeech**: TTS interface with parameter controls
- **SpeechToText**: STT interface with file upload
- **VideoCreation**: Video generation with advanced options
- **Settings**: API configuration and app settings

### Common Components
- **FileUpload**: Drag-and-drop file upload with validation
- **AudioPlayer**: Full-featured audio player with controls
- **VideoPlayer**: Video player with playback controls
- **ThemeToggle**: Dark/light mode toggle button

## Azure Integration

### Required Azure Services
1. **Azure OpenAI Service**
   - Used for video content generation
   - Requires GPT-4 or similar model deployment

2. **Azure Speech Services**
   - Text-to-Speech (TTS) for audio generation
   - Speech-to-Text (STT) for transcription

### API Configuration
The app uses environment variables for Azure configuration:
- Endpoint URLs and API keys are stored in `.env`
- Settings page allows runtime configuration
- Local storage persists user settings

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Technology Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Axios** for HTTP requests
- **Lucide React** for icons

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Responsive design principles
- Accessibility considerations
- Error boundaries for graceful error handling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Considerations

- API keys are stored locally and never transmitted to third parties
- All Azure communications use HTTPS
- File uploads are validated for size and type
- No sensitive data is logged or stored

## Troubleshooting

### Common Issues

1. **Azure API Connection Failed**
   - Verify your API keys and endpoints
   - Check Azure service quotas and limits
   - Ensure proper CORS configuration

2. **File Upload Issues**
   - Check file size limits (25MB for audio, 10MB for images)
   - Verify supported file formats
   - Ensure stable internet connection

3. **Audio/Video Playback Issues**
   - Check browser compatibility
   - Verify file format support
   - Clear browser cache

### Getting Help
- Check the Settings page for configuration status
- Use browser developer tools to debug issues
- Verify Azure service status

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Acknowledgments

- Built with [Azure OpenAI Service](https://azure.microsoft.com/en-us/products/ai-services/openai-service)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)