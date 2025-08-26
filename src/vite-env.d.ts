/// <reference types="vite/client" />

interface ImportMetaEnv {
  // TTS Configuration
  readonly VITE_AZURE_TTS_ENDPOINT: string
  readonly VITE_AZURE_TTS_API_KEY: string
  readonly VITE_AZURE_TTS_API_VERSION: string
  readonly VITE_AZURE_TTS_DEPLOYMENT: string
  
  // STT Configuration
  readonly VITE_AZURE_STT_ENDPOINT: string
  readonly VITE_AZURE_STT_API_KEY: string
  readonly VITE_AZURE_STT_API_VERSION: string
  readonly VITE_AZURE_STT_DEPLOYMENT: string
  
  // Video Configuration
  readonly VITE_AZURE_VIDEO_ENDPOINT: string
  readonly VITE_AZURE_VIDEO_API_KEY: string
  readonly VITE_AZURE_VIDEO_API_VERSION: string
  readonly VITE_AZURE_VIDEO_DEPLOYMENT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}