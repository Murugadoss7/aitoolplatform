import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { VideoPlayer } from '@/components/common/VideoPlayer'
import { Loader2, Video } from 'lucide-react'
import { azureService } from '@/services/azureService'
import { useTaskManager } from '@/context/TaskManagerContext'
import { TaskProgress } from '@/components/common/TaskProgress'
import type { VideoRequest, VideoResponse } from '@/types/azure'
import type { VideoTask } from '@/types/taskManager'

export function VideoCreation() {
  const [prompt, setPrompt] = useState('')
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [duration, setDuration] = useState([5])
  const [nVariants, setNVariants] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [videoResult, setVideoResult] = useState<VideoResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const { addTask, updateTask, getTasksByType } = useTaskManager()
  const videoTasks = getTasksByType('video-creation')
  const activeTasks = videoTasks.filter(task => 
    task.status === 'processing' || task.status === 'pending'
  )
  const completedTasks = videoTasks.filter(task => task.status === 'completed')

  useEffect(() => {
    // Check for any existing video tasks and update UI state
    const activeTask = activeTasks[0] as VideoTask | undefined
    const latestCompletedTask = completedTasks
      .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())[0] as VideoTask | undefined

    if (activeTask) {
      // There's an active task running
      setIsLoading(true)
      setError(null)
    } else if (latestCompletedTask && latestCompletedTask.result) {
      // Show the most recent completed task result
      setVideoResult(latestCompletedTask.result)
      setIsLoading(false)
      setError(null)
    } else {
      // No active or completed tasks
      setIsLoading(false)
    }
  }, [activeTasks, completedTasks])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for video generation')
      return
    }

    if (!azureService.isVideoConfigured()) {
      setError('Azure OpenAI Video Generation not configured. Please check your settings.')
      return
    }

    setIsLoading(true)
    setError(null)

    // Create a task for tracking
    const taskId = `video-${Date.now()}`
    const task: VideoTask = {
      id: taskId,
      type: 'video-creation',
      status: 'processing',
      createdAt: new Date(),
      request: {
        prompt: prompt.trim(),
        width,
        height,
        duration: duration[0],
        nVariants
      }
    }

    addTask(task)

    try {
      const request: VideoRequest = {
        prompt: prompt.trim(),
        n_variants: nVariants,
        n_seconds: duration[0],
        width,
        height
      }

      const result = await azureService.createVideo(request)
      
      // Update task with result
      updateTask(taskId, {
        status: 'completed',
        completedAt: new Date(),
        result: result
      })
      
      setVideoResult(result)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate video'
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
    setPrompt('')
    setVideoResult(null)
    setError(null)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Video className="h-8 w-8" />
          Video Creation
        </h1>
        <p className="text-muted-foreground">
          Generate engaging videos from text prompts with AI-powered tools
        </p>
      </div>

      <TaskProgress />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt Input */}
          <Card>
            <CardHeader>
              <CardTitle>Video Prompt</CardTitle>
              <CardDescription>
                Describe the video you want to create
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe your video content... (e.g., 'A modern tech presentation about AI innovations with smooth transitions and professional graphics')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px]"
                />
                <Button onClick={handleGenerate} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Video
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

          {/* Video Player */}
          {videoResult && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Video</CardTitle>
                <CardDescription>
                  Your video has been generated successfully
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VideoPlayer
                  videoUrl={videoResult.videoUrl}
                  videoBlob={videoResult.videoBlob}
                  thumbnailUrl={videoResult.thumbnailUrl}
                  filename="generated-video"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Parameters Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Settings</CardTitle>
              <CardDescription>
                Configure video parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dimensions */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Width</Label>
                  <Select value={width.toString()} onValueChange={(value) => setWidth(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1280">1280px (720p Width)</SelectItem>
                      <SelectItem value="1920">1920px (1080p Width)</SelectItem>
                      <SelectItem value="3840">3840px (4K Width)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Height</Label>
                  <Select value={height.toString()} onValueChange={(value) => setHeight(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720">720px (HD)</SelectItem>
                      <SelectItem value="1080">1080px (Full HD)</SelectItem>
                      <SelectItem value="2160">2160px (4K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>Duration: {duration[0]}s</Label>
                <Slider
                  value={duration}
                  onValueChange={setDuration}
                  min={3}
                  max={30}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>3s</span>
                  <span>30s</span>
                </div>
              </div>

              {/* Number of Variants */}
              <div className="space-y-2">
                <Label>Number of Variants: {nVariants}</Label>
                <Select value={nVariants.toString()} onValueChange={(value) => setNVariants(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Video</SelectItem>
                    <SelectItem value="2">2 Videos</SelectItem>
                    <SelectItem value="3">3 Videos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" onClick={handleClear} className="w-full">
                Clear All
              </Button>
            </CardContent>
          </Card>

          {/* Generation Info */}
          <Card>
            <CardHeader>
              <CardTitle>Video Generation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div><strong>Processing:</strong> Videos are generated asynchronously</div>
              <div><strong>Duration:</strong> Longer videos take more time to process</div>
              <div><strong>Variants:</strong> Multiple versions of the same prompt</div>
              <div><strong>Quality:</strong> Higher resolution takes longer to generate</div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle>Tips for Better Results</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Be descriptive and specific in your prompts</p>
              <p>• Include visual details like lighting, colors, movement</p>
              <p>• Mention camera angles or perspectives</p>
              <p>• Higher resolution videos take longer to process</p>
              <p>• Experiment with different prompt styles for variety</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}