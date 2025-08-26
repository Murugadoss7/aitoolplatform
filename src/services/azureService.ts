import axios from 'axios'
import {
  TTSConfig,
  STTConfig,
  VideoConfig,
  TTSRequest,
  STTRequest,
  VideoRequest,
  TTSResponse,
  STTResponse,
  VideoResponse,
  VideoJob,
  ApiError
} from '../types/azure'

class AzureService {
  private ttsConfig: TTSConfig
  private sttConfig: STTConfig
  private videoConfig: VideoConfig

  constructor() {
    this.ttsConfig = {
      endpoint: import.meta.env.VITE_AZURE_TTS_ENDPOINT || '',
      apiKey: import.meta.env.VITE_AZURE_TTS_API_KEY || '',
      apiVersion: import.meta.env.VITE_AZURE_TTS_API_VERSION || '2025-03-01-preview',
      deployment: import.meta.env.VITE_AZURE_TTS_DEPLOYMENT || 'gpt-4o-mini-tts'
    }
    
    this.sttConfig = {
      endpoint: import.meta.env.VITE_AZURE_STT_ENDPOINT || '',
      apiKey: import.meta.env.VITE_AZURE_STT_API_KEY || '',
      apiVersion: import.meta.env.VITE_AZURE_STT_API_VERSION || '2024-06-01',
      deployment: import.meta.env.VITE_AZURE_STT_DEPLOYMENT || 'whisper'
    }

    this.videoConfig = {
      endpoint: import.meta.env.VITE_AZURE_VIDEO_ENDPOINT || '',
      apiKey: import.meta.env.VITE_AZURE_VIDEO_API_KEY || '',
      apiVersion: import.meta.env.VITE_AZURE_VIDEO_API_VERSION || 'preview',
      deployment: import.meta.env.VITE_AZURE_VIDEO_DEPLOYMENT || ''
    }

    // Debug logging
    console.log('Azure Service Configurations:', {
      tts: {
        endpoint: this.ttsConfig.endpoint ? 'SET' : 'NOT SET',
        apiKey: this.ttsConfig.apiKey ? 'SET' : 'NOT SET',
        deployment: this.ttsConfig.deployment,
        apiVersion: this.ttsConfig.apiVersion,
        isConfigured: this.isTTSConfigured()
      },
      stt: {
        endpoint: this.sttConfig.endpoint ? 'SET' : 'NOT SET',
        apiKey: this.sttConfig.apiKey ? 'SET' : 'NOT SET',
        deployment: this.sttConfig.deployment,
        apiVersion: this.sttConfig.apiVersion,
        isConfigured: this.isSTTConfigured()
      },
      video: {
        endpoint: this.videoConfig.endpoint ? 'SET' : 'NOT SET',
        apiKey: this.videoConfig.apiKey ? 'SET' : 'NOT SET',
        deployment: this.videoConfig.deployment || 'NOT SET',
        isConfigured: this.isVideoConfigured()
      }
    })
  }

  async textToSpeech(request: TTSRequest): Promise<TTSResponse> {
    try {
      const requestBody = {
        model: this.ttsConfig.deployment,
        input: request.text,
        voice: request.voice,
        response_format: request.format,
        speed: request.speed
      }

      // Add instructions if provided
      if (request.instructions) {
        (requestBody as any).instructions = request.instructions
      }

      const url = `${this.ttsConfig.endpoint}/openai/deployments/${this.ttsConfig.deployment}/audio/speech?api-version=${this.ttsConfig.apiVersion}`
      
      // Debug logging
      console.log('TTS Request URL:', url)
      console.log('TTS Request Body:', requestBody)
      console.log('Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.ttsConfig.apiKey.substring(0, 10)}...`
      })

      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.ttsConfig.apiKey}`
        },
        responseType: 'blob'
      })

      const audioBlob = response.data
      const audioUrl = URL.createObjectURL(audioBlob)
      
      return {
        audioUrl,
        audioBlob,
        duration: await this.getAudioDuration(audioBlob)
      }
    } catch (error) {
      throw this.handleError(error, 'Text-to-Speech failed')
    }
  }

  async speechToText(request: STTRequest): Promise<STTResponse> {
    if (!this.isSTTConfigured()) {
      throw new Error('Azure OpenAI Whisper not configured. Please check your settings.')
    }

    try {
      const formData = new FormData()
      formData.append('file', request.audioFile)
      
      // Add language parameter if specified
      if (request.language && request.language !== 'auto') {
        formData.append('language', request.language)
      }
      
      const url = `${this.sttConfig.endpoint}/openai/deployments/${this.sttConfig.deployment}/audio/transcriptions?api-version=${this.sttConfig.apiVersion}`
      
      // Debug logging
      console.log('STT Request URL:', url)
      console.log('STT Request Headers:', {
        'Authorization': `Bearer ${this.sttConfig.apiKey.substring(0, 10)}...`,
        'Content-Type': 'multipart/form-data'
      })
      
      const response = await axios.post(
        url,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.sttConfig.apiKey}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const result = response.data
      return {
        transcript: result.text || '',
        confidence: 0.95, // Whisper doesn't provide confidence scores
        words: [] // Whisper doesn't provide word-level details in basic response
      }
    } catch (error) {
      throw this.handleError(error, 'Speech-to-Text failed')
    }
  }

  async createVideo(request: VideoRequest): Promise<VideoResponse> {
    if (!this.isVideoConfigured()) {
      throw new Error('Azure OpenAI Video Generation not configured. Please check your settings.')
    }

    try {
      // Step 1: Submit video generation job
      const jobResponse = await this.submitVideoJob(request)
      const jobId = jobResponse.id

      // Step 2: Poll for completion
      const completedJob = await this.pollVideoJob(jobId)

      if (completedJob.status === 'failed') {
        throw new Error(completedJob.error || 'Video generation failed')
      }

      if (!completedJob.generations || completedJob.generations.length === 0) {
        throw new Error('No video generated')
      }

      // Step 3: Download the generated video
      const generation = completedJob.generations[0]
      const videoBlob = await this.downloadVideo(generation.id)
      const videoUrl = URL.createObjectURL(videoBlob)

      return {
        videoUrl,
        videoBlob,
        duration: request.n_seconds,
        jobId,
        generationId: generation.id
      }
    } catch (error) {
      throw this.handleError(error, 'Video creation failed')
    }
  }

  private async submitVideoJob(request: VideoRequest): Promise<VideoJob> {
    const url = `${this.videoConfig.endpoint}/openai/v1/video/generations/jobs?api-version=preview`
    
    
    const body = {
      prompt: request.prompt,
      n_variants: request.n_variants || 1,
      n_seconds: request.n_seconds.toString(),
      height: request.height.toString(),
      width: request.width.toString(),
      model: this.videoConfig.deployment
    }

    console.log('Video Job Submit URL:', url)
    console.log('Video Job Request Body:', body)

    const response = await axios.post(url, body, {
      headers: {
        'Authorization': `Bearer ${this.videoConfig.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  }

  private async pollVideoJob(jobId: string): Promise<VideoJob> {
    const statusUrl = `${this.videoConfig.endpoint}/openai/v1/video/generations/jobs/${jobId}?api-version=preview`
    const maxAttempts = 60 // 5 minutes max (5 second intervals)
    let attempts = 0

    while (attempts < maxAttempts) {
      const response = await axios.get(statusUrl, {
        headers: {
          'Authorization': `Bearer ${this.videoConfig.apiKey}`
        }
      })

      const job: VideoJob = response.data
      console.log(`Video job ${jobId} status: ${job.status}`)

      if (job.status === 'succeeded' || job.status === 'failed') {
        return job
      }

      // Wait 5 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 5000))
      attempts++
    }

    throw new Error('Video generation timed out')
  }

  private async downloadVideo(generationId: string): Promise<Blob> {
    const videoUrl = `${this.videoConfig.endpoint}/openai/v1/video/generations/${generationId}/content/video?api-version=preview`
    
    const response = await axios.get(videoUrl, {
      headers: {
        'Authorization': `Bearer ${this.videoConfig.apiKey}`
      },
      responseType: 'blob'
    })

    return response.data
  }

  private async getAudioDuration(audioBlob: Blob): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio()
      audio.onloadedmetadata = () => {
        resolve(audio.duration)
      }
      audio.src = URL.createObjectURL(audioBlob)
    })
  }

  private handleError(error: any, defaultMessage: string): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || defaultMessage,
        code: error.response.status.toString(),
        details: error.response.data
      }
    }
    
    return {
      message: error.message || defaultMessage,
      code: 'UNKNOWN_ERROR',
      details: error
    }
  }

  isTTSConfigured(): boolean {
    return !!(
      this.ttsConfig.endpoint &&
      this.ttsConfig.apiKey &&
      this.ttsConfig.deployment
    )
  }

  isSTTConfigured(): boolean {
    return !!(
      this.sttConfig.endpoint &&
      this.sttConfig.apiKey &&
      this.sttConfig.deployment
    )
  }

  isVideoConfigured(): boolean {
    return !!(
      this.videoConfig.endpoint &&
      this.videoConfig.apiKey &&
      this.videoConfig.deployment
    )
  }

  // Legacy method for backward compatibility
  isConfigured(): boolean {
    return this.isTTSConfigured()
  }

  updateTTSConfig(config: Partial<TTSConfig>) {
    if (config.endpoint) this.ttsConfig.endpoint = config.endpoint
    if (config.apiKey) this.ttsConfig.apiKey = config.apiKey
    if (config.apiVersion) this.ttsConfig.apiVersion = config.apiVersion
    if (config.deployment) this.ttsConfig.deployment = config.deployment
  }

  updateSTTConfig(config: Partial<STTConfig>) {
    if (config.endpoint) this.sttConfig.endpoint = config.endpoint
    if (config.apiKey) this.sttConfig.apiKey = config.apiKey
    if (config.apiVersion) this.sttConfig.apiVersion = config.apiVersion
    if (config.deployment) this.sttConfig.deployment = config.deployment
  }

  updateVideoConfig(config: Partial<VideoConfig>) {
    if (config.endpoint) this.videoConfig.endpoint = config.endpoint
    if (config.apiKey) this.videoConfig.apiKey = config.apiKey
    if (config.apiVersion) this.videoConfig.apiVersion = config.apiVersion
    if (config.deployment) this.videoConfig.deployment = config.deployment
  }
}

export const azureService = new AzureService()