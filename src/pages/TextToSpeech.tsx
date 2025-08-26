import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { AudioPlayer } from '@/components/common/AudioPlayer'
import { Loader2, Volume2 } from 'lucide-react'
import { azureService } from '@/services/azureService'
import { useTaskManager } from '@/context/TaskManagerContext'
import { TaskProgress } from '@/components/common/TaskProgress'
import { VOICES, AUDIO_FORMATS } from '@/constants/voices'
import type { TTSRequest, TTSResponse, AudioFormat } from '@/types/azure'
import type { TTSTask } from '@/types/taskManager'

export function TextToSpeech() {
  const [text, setText] = useState('')
  const [voice, setVoice] = useState('alloy')
  const [speed, setSpeed] = useState([1])
  const [format, setFormat] = useState<AudioFormat>('mp3')
  const [instructions, setInstructions] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [audioResult, setAudioResult] = useState<TTSResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const { addTask, updateTask, getTasksByType } = useTaskManager()
  const ttsTasks = getTasksByType('text-to-speech')
  const activeTasks = ttsTasks.filter(task => 
    task.status === 'processing' || task.status === 'pending'
  )
  const completedTasks = ttsTasks.filter(task => task.status === 'completed')

  useEffect(() => {
    // Check for any existing TTS tasks and update UI state
    const activeTask = activeTasks[0] as TTSTask | undefined
    const latestCompletedTask = completedTasks
      .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())[0] as TTSTask | undefined

    if (activeTask) {
      // There's an active task running
      setIsLoading(true)
      setError(null)
    } else if (latestCompletedTask && latestCompletedTask.result) {
      // Show the most recent completed task result
      setAudioResult(latestCompletedTask.result)
      setIsLoading(false)
      setError(null)
    } else {
      // No active or completed tasks
      setIsLoading(false)
    }
  }, [activeTasks, completedTasks])

  const handleConvert = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert')
      return
    }

    if (!azureService.isConfigured()) {
      setError('Azure OpenAI service not configured. Please check your environment variables (.env file).')
      return
    }

    setIsLoading(true)
    setError(null)

    // Create a task for tracking
    const taskId = `tts-${Date.now()}`
    const task: TTSTask = {
      id: taskId,
      type: 'text-to-speech',
      status: 'processing',
      createdAt: new Date(),
      request: {
        text: text.trim(),
        voice,
        speed: speed[0],
        format,
        instructions: instructions.trim() || undefined
      }
    }

    addTask(task)

    try {
      const request: TTSRequest = {
        text: text.trim(),
        voice,
        speed: speed[0],
        format,
        instructions: instructions.trim() || undefined
      }

      const result = await azureService.textToSpeech(request)
      
      // Update task with result
      updateTask(taskId, {
        status: 'completed',
        completedAt: new Date(),
        result: result
      })
      
      setAudioResult(result)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to convert text to speech'
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
    setText('')
    setInstructions('')
    setAudioResult(null)
    setError(null)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Volume2 className="h-8 w-8" />
          Text to Speech
        </h1>
        <p className="text-muted-foreground">
          Convert written text into natural-sounding speech with customizable voice parameters
        </p>
      </div>

      <TaskProgress />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Text Input</CardTitle>
              <CardDescription>
                Enter the text you want to convert to speech
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px]"
                />
                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions (Optional)</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Instructions for the model to follow when generating audio (e.g., 'Speak slowly and clearly', 'Use an excited tone', etc.)"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleConvert} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Convert to Speech
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    Clear
                  </Button>
                </div>
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

          {/* Audio Player */}
          {audioResult && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Audio</CardTitle>
                <CardDescription>
                  Your text has been converted to speech
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AudioPlayer
                  audioUrl={audioResult.audioUrl}
                  audioBlob={audioResult.audioBlob}
                  filename="text-to-speech"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Parameters Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Voice Parameters</CardTitle>
              <CardDescription>
                Customize the voice output
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voice Selection */}
              <div className="space-y-2">
                <Label htmlFor="voice">Voice</Label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICES.map((v) => (
                      <SelectItem key={v.value} value={v.value}>
                        {v.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Speed Control */}
              <div className="space-y-2">
                <Label>Speed: {speed[0]}x</Label>
                <Slider
                  value={speed}
                  onValueChange={setSpeed}
                  min={0.25}
                  max={4}
                  step={0.25}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.25x</span>
                  <span>4x</span>
                </div>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <Label htmlFor="format">Audio Format</Label>
                <Select value={format} onValueChange={(value) => setFormat(value as AudioFormat)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIO_FORMATS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Voice Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Voice Descriptions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div><strong>Alloy:</strong> Balanced and versatile</div>
              <div><strong>Echo:</strong> Clear and professional</div>
              <div><strong>Fable:</strong> Expressive storytelling</div>
              <div><strong>Onyx:</strong> Deep and authoritative</div>
              <div><strong>Nova:</strong> Warm and friendly</div>
              <div><strong>Shimmer:</strong> Bright and energetic</div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Use punctuation for natural pauses</p>
              <p>• Try different voices for variety</p>
              <p>• Use instructions for tone guidance</p>
              <p>• Adjust speed for better clarity</p>
              <p>• Longer texts may take more time</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}