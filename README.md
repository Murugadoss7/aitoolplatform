# AI Media Platform

A modern React application that provides text-to-speech, speech-to-text, and video creation features using Azure OpenAI models.

## Features

### 🎯 Core Features
- **Text-to-Speech (TTS)**: Convert written text into natural-sounding speech using Azure OpenAI TTS with 6 high-quality voices and customizable parameters
- **Speech-to-Text (STT)**: Transform audio recordings into accurate text transcriptions
- **Video Creation**: Generate engaging videos from text prompts with AI-powered tools
- **PDF Text Extract**: Extract text from PDF documents using Azure Document Intelligence and convert to Word format

### 🎨 User Interface
- Clean, modern UI with shadcn/ui components and red brand theme
- Responsive design that works on mobile, tablet, and desktop
- Dark/Light mode toggle with system preference detection
- Professional design system with sixredmarbles brand integration
- Categorized navigation with dropdown menus for organized tool access
- Centered dashboard layout with compact feature cards
- Brand-consistent red color scheme throughout the application

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
   VITE_OCR_API_ENDPOINT=http://192.168.100.182/api/ocr
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

### 5. PDF Text Extract
- Go to **PDF Text Extract** page
- Upload a PDF file (up to 100MB)
- Monitor the extraction progress in the status list
- Download the extracted text in Word (.docx) format when complete
- View processing history and re-download previous extractions

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components (Button, Card, Input, DropdownMenu, etc.)
│   ├── features/     # Feature-specific components (FeatureCard with compact mode)
│   ├── common/       # Shared components (FileUpload, AudioPlayer, VideoPlayer)
│   └── layout/       # Layout components (Layout with categorized navigation, ThemeProvider)
├── pages/            # Main page components (Dashboard, TextToSpeech, etc.)
├── hooks/            # Custom React hooks
├── services/         # API service functions (azureService)
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── constants/        # App constants (voices, languages, formats)
├── context/          # Task management and theme contexts
└── lib/              # Library utilities (utils.ts)
```

## Key Components

### Services
- **azureService.ts**: Handles all Azure API integrations
- **ThemeProvider**: Manages dark/light mode state
- **Layout**: Main application layout with navigation

### Pages
- **Dashboard**: Categorized tool overview with search functionality and centered layout
- **TextToSpeech**: TTS interface with parameter controls
- **SpeechToText**: STT interface with file upload
- **VideoCreation**: Video generation with advanced options
- **PdfTextExtract**: PDF text extraction with document intelligence (streamlined UI)
- **Settings**: API configuration and app settings

### Common Components
- **FileUpload**: Drag-and-drop file upload with validation
- **AudioPlayer**: Full-featured audio player with controls
- **VideoPlayer**: Video player with playback controls
- **ThemeToggle**: Dark/light mode toggle button
- **FeatureCard**: Compact and full-size cards with feature listings
- **TaskProgress**: Real-time task tracking component
- **Layout**: Responsive layout with categorized dropdown navigation

## Azure Integration

### Required Azure Services
1. **Azure OpenAI Service**
   - Used for video content generation
   - Requires GPT-4 or similar model deployment

2. **Azure Speech Services**
   - Text-to-Speech (TTS) for audio generation
   - Speech-to-Text (STT) for transcription

3. **Document Intelligence API**
   - PDF text extraction and processing
   - Converts PDF documents to Word format

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
   - Check file size limits (25MB for audio, 100MB for PDF files)
   - Verify supported file formats
   - Ensure stable internet connection

3. **PDF Text Extract Issues**
   - CORS errors: Ensure OCR API server allows requests from your domain
   - Network connection errors: Verify OCR API server is running and accessible
   - Check OCR API endpoint configuration in environment variables

4. **Audio/Video Playback Issues**
   - Check browser compatibility
   - Verify file format support
   - Clear browser cache

### Getting Help
- Check the Settings page for configuration status
- Use browser developer tools to debug issues
- Verify Azure service status

## Recent Updates

### UI/UX Improvements
- **Categorized Navigation**: Tools organized into dropdown menus (AI Tools, Production Tools, HR Tools)
- **Centered Dashboard**: Tool cards now center-aligned with compact design showing key features
- **Brand Integration**: Implemented sixredmarbles brand colors throughout the application
- **Settings Repositioning**: Moved Settings next to theme toggle for better UX
- **Streamlined PDF Extract**: Cleaned up UI to match other tool pages
- **Enhanced Feature Cards**: Added feature listings in compact mode for better tool discovery

### Brand Identity
- **Color Scheme**: Red-based primary colors matching sixredmarbles branding
- **Logo Integration**: Sixredmarbles logo displayed in footer with brand elements
- **Consistent Theming**: Both light and dark modes use red accent colors
- **Header Branding**: AI logo updated with red gradient to match brand identity

### Navigation Enhancements
- **Dropdown Menus**: AI Tools and Production Tools grouped in organized dropdowns
- **Responsive Design**: Navigation adapts properly across all screen sizes
- **Active States**: Improved visual feedback for current page/section
- **Mobile Optimization**: Categorized mobile menu with proper grouping

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
- Brand identity by [sixredmarbles](https://sixredmarbles.com)