export type TaskType = 'text-to-speech' | 'speech-to-text' | 'video-creation' | 'pdf-ocr'

export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface BaseTask {
  id: string
  type: TaskType
  status: TaskStatus
  createdAt: Date
  completedAt?: Date
  error?: string
}

export interface TTSTask extends BaseTask {
  type: 'text-to-speech'
  request: {
    text: string
    voice: string
    speed: number
    format: string
    instructions?: string
  }
  result?: {
    audioUrl: string
    audioBlob: Blob
    duration: number
  }
}

export interface STTTask extends BaseTask {
  type: 'speech-to-text'
  request: {
    fileName: string
    language: string
    recognitionMode: string
  }
  result?: {
    transcript: string
    confidence: number
    words?: Array<{word: string, confidence: number, startTime: number, endTime: number}>
  }
}

export interface VideoTask extends BaseTask {
  type: 'video-creation'
  request: {
    prompt: string
    width: number
    height: number
    duration: number
    nVariants: number
  }
  result?: {
    videoUrl: string
    videoBlob: Blob
    duration: number
    jobId?: string
    generationId?: string
    thumbnailUrl?: string
  }
  jobId?: string
}

export interface OCRTask extends BaseTask {
  type: 'pdf-ocr'
  request: {
    fileName: string
    fileSize: number
    ocrType: 'azure'
  }
  result?: {
    ocrJobId: number
    outputDocxUrl?: string
    outputJsonUrl?: string
  }
  ocrJobId?: number
}

export type Task = TTSTask | STTTask | VideoTask | OCRTask

export interface TaskManagerState {
  tasks: Task[]
  activeTasks: Task[]
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  getTask: (id: string) => Task | undefined
  getTasksByType: (type: TaskType) => Task[]
  getActiveTasks: () => Task[]
}