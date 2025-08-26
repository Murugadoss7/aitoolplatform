import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { FileUpload } from '@/components/common/FileUpload'
import { Loader2, Mic, Download, Copy } from 'lucide-react'
import { azureService } from '@/services/azureService'
import { useTaskManager } from '@/context/TaskManagerContext'
import { TaskProgress } from '@/components/common/TaskProgress'
import { LANGUAGES } from '@/constants/voices'
import type { STTRequest, STTResponse, RecognitionMode } from '@/types/azure'
import type { STTTask } from '@/types/taskManager'

export function SpeechToText() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [language, setLanguage] = useState('auto')
  const [recognitionMode, setRecognitionMode] = useState<RecognitionMode>('conversation')
  const [profanityFilter, setProfanityFilter] = useState(true)
  const [confidenceThreshold, setConfidenceThreshold] = useState([0.5])
  const [isLoading, setIsLoading] = useState(false)
  const [transcriptResult, setTranscriptResult] = useState<STTResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const { addTask, updateTask, getTasksByType } = useTaskManager()
  const sttTasks = getTasksByType('speech-to-text')
  const activeTasks = sttTasks.filter(task => 
    task.status === 'processing' || task.status === 'pending'
  )
  const completedTasks = sttTasks.filter(task => task.status === 'completed')

  useEffect(() => {
    // Check for any existing STT tasks and update UI state
    const activeTask = activeTasks[0] as STTTask | undefined
    const latestCompletedTask = completedTasks
      .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())[0] as STTTask | undefined

    if (activeTask) {
      // There's an active task running
      setIsLoading(true)
      setError(null)
    } else if (latestCompletedTask && latestCompletedTask.result) {
      // Show the most recent completed task result
      setTranscriptResult(latestCompletedTask.result)
      setIsLoading(false)
      setError(null)
    } else {
      // No active or completed tasks
      setIsLoading(false)
    }
  }, [activeTasks, completedTasks])

  const handleTranscribe = async () => {
    if (!selectedFile) {
      setError('Please select an audio file to transcribe')
      return
    }

    if (!azureService.isConfigured()) {
      setError('Azure services not configured. Please check your settings.')
      return
    }

    setIsLoading(true)
    setError(null)

    // Create a task for tracking
    const taskId = `stt-${Date.now()}`
    const task: STTTask = {
      id: taskId,
      type: 'speech-to-text',
      status: 'processing',
      createdAt: new Date(),
      request: {
        fileName: selectedFile.name,
        language,
        recognitionMode
      }
    }

    addTask(task)

    try {
      const request: STTRequest = {
        audioFile: selectedFile,
        language,
        recognitionMode,
        profanityFilter,
        confidenceThreshold: confidenceThreshold[0]
      }

      const result = await azureService.speechToText(request)
      
      // Update task with result
      updateTask(taskId, {
        status: 'completed',
        completedAt: new Date(),
        result: result
      })
      
      setTranscriptResult(result)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to transcribe audio'
      setError(errorMessage)
      
      // Update task with error
      updateTask(taskId, {
        status: 'failed',
        completedAt: new Date(),
        error: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setTranscriptResult(null)
    setError(null)
  }

  const handleCopyTranscript = () => {
    if (transcriptResult?.transcript) {
      navigator.clipboard.writeText(transcriptResult.transcript)
    }
  }

  const handleDownloadTranscript = () => {
    if (!transcriptResult?.transcript) return

    const blob = new Blob([transcriptResult.transcript], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transcript.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Mic className="h-8 w-8" />
          Speech to Text
        </h1>
        <p className="text-muted-foreground">
          Transform audio recordings into accurate text transcriptions
        </p>
      </div>

      <TaskProgress />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Audio Upload</CardTitle>
              <CardDescription>
                Select an audio file to transcribe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFileSelect={setSelectedFile}
                onFileRemove={() => setSelectedFile(null)}
                selectedFile={selectedFile}
                accept=".mp3,.wav,.m4a,.ogg"
                maxSizeMB={25}
              />
              <div className="mt-4 flex gap-2">
                <Button onClick={handleTranscribe} disabled={isLoading || !selectedFile}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Transcribe Audio
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Transcript Result */}
          {transcriptResult && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transcription Result</CardTitle>
                    <CardDescription>
                      Confidence Score: 
                      <span className={`ml-1 font-medium ${getConfidenceColor(transcriptResult.confidence)}`}>
                        {Math.round(transcriptResult.confidence * 100)}%
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyTranscript}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadTranscript}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={transcriptResult.transcript}
                  onChange={(e) => setTranscriptResult({
                    ...transcriptResult,
                    transcript: e.target.value
                  })}
                  className="min-h-[200px]"
                  placeholder="Transcribed text will appear here..."
                />
                
                {/* Word-level details if available */}
                {transcriptResult.words && transcriptResult.words.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium">Word-level Confidence</Label>
                    <div className="mt-2 max-h-32 overflow-y-auto bg-muted p-2 rounded text-sm">
                      {transcriptResult.words.map((word, index) => (
                        <span
                          key={index}
                          className={`mr-1 ${getConfidenceColor(word.confidence)}`}
                          title={`Confidence: ${Math.round(word.confidence * 100)}%`}
                        >
                          {word.word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Parameters Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transcription Settings</CardTitle>
              <CardDescription>
                Configure recognition parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Recognition Mode */}
              <div className="space-y-2">
                <Label htmlFor="mode">Recognition Mode</Label>
                <Select value={recognitionMode} onValueChange={(value) => setRecognitionMode(value as RecognitionMode)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interactive">Interactive</SelectItem>
                    <SelectItem value="conversation">Conversation</SelectItem>
                    <SelectItem value="dictation">Dictation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Profanity Filter */}
              <div className="space-y-2">
                <Label htmlFor="profanity">Profanity Filter</Label>
                <Select value={profanityFilter.toString()} onValueChange={(value) => setProfanityFilter(value === 'true')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Enabled</SelectItem>
                    <SelectItem value="false">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Confidence Threshold */}
              <div className="space-y-2">
                <Label>Confidence Threshold: {Math.round(confidenceThreshold[0] * 100)}%</Label>
                <Slider
                  value={confidenceThreshold}
                  onValueChange={setConfidenceThreshold}
                  min={0}
                  max={1}
                  step={0.1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Recognition Modes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>
                <strong>Interactive:</strong> Short commands and queries
              </div>
              <div>
                <strong>Conversation:</strong> Natural dialogue and meetings
              </div>
              <div>
                <strong>Dictation:</strong> Long-form content and documents
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Use high-quality audio for better results</p>
              <p>• Clear speech improves accuracy</p>
              <p>• Background noise affects recognition</p>
              <p>• Choose the right recognition mode</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}