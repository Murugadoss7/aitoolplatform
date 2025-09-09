export interface TTSConfig {
  endpoint: string
  apiKey: string
  apiVersion: string
  deployment: string
}

export interface STTConfig {
  endpoint: string
  apiKey: string
  apiVersion: string
  deployment: string
}

export interface VideoConfig {
  endpoint: string
  apiKey: string
  apiVersion: string
  deployment: string
}

export interface OCRConfig {
  endpoint: string
}

// Legacy type for backward compatibility
export interface AzureConfig {
  endpoint: string
  apiKey: string
  apiVersion: string
  ttsDeployment: string
}

export interface SpeechConfig {
  subscriptionKey: string
  region: string
}

export interface TTSRequest {
  text: string
  voice: string
  speed: number
  format: AudioFormat
  instructions?: string
}

export interface STTRequest {
  audioFile: File
  language: string
  recognitionMode: RecognitionMode
  profanityFilter: boolean
  confidenceThreshold: number
}

export interface VideoRequest {
  prompt: string
  n_variants?: number
  n_seconds: number
  width: number
  height: number
}

export interface OCRRequest {
  pdfFile: File
  ocrType: 'azure'
}

export type AudioFormat = 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm'
export type RecognitionMode = 'interactive' | 'conversation' | 'dictation'
export type VideoResolution = '720p' | '1080p' | '4k'
export type FrameRate = 24 | 30 | 60
export type VideoStyle = 'modern' | 'classic' | 'minimal' | 'creative'

export interface TTSResponse {
  audioUrl: string
  audioBlob: Blob
  duration: number
}

export interface STTResponse {
  transcript: string
  confidence: number
  words?: WordDetail[]
}

export interface WordDetail {
  word: string
  confidence: number
  startTime: number
  endTime: number
}

export interface VideoResponse {
  videoUrl: string
  videoBlob: Blob
  thumbnailUrl?: string
  duration: number
  jobId?: string
  generationId?: string
}

export interface OCRResponse {
  id: number
  name: string
  pdf_file: string
  ocr_type: string
  status: 'p' | 'c' | 'f' // pending, completed, failed
  output_docx?: string
  output_json?: string
  html_folder?: string
  error_description?: string
  processed_on?: string
  created_at: string
  updated_at: string
}

export interface OCRJobsResponse {
  count: number
  next: string | null
  previous: string | null
  results: OCRResponse[]
}

export interface VideoJob {
  id: string
  status: 'pending' | 'running' | 'succeeded' | 'failed'
  created_at: string
  model: string
  prompt: string
  generations?: VideoGeneration[]
  error?: string
}

export interface VideoGeneration {
  id: string
  url?: string
}

export interface ApiError {
  message: string
  code: string
  details?: any
}