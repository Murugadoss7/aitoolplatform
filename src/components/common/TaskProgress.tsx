import { useTaskManager } from '@/context/TaskManagerContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Volume2, Mic, Video, X, FileText } from 'lucide-react'
import { Task } from '@/types/taskManager'

export function TaskProgress() {
  const { activeTasks, removeTask } = useTaskManager()

  if (activeTasks.length === 0) {
    return null
  }

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'text-to-speech':
        return Volume2
      case 'speech-to-text':
        return Mic
      case 'video-creation':
        return Video
      case 'pdf-ocr':
        return FileText
      default:
        return FileText
    }
  }

  const getTaskTitle = (task: Task) => {
    switch (task.type) {
      case 'text-to-speech':
        return 'Converting Text to Speech'
      case 'speech-to-text':
        return 'Transcribing Audio'
      case 'video-creation':
        return 'Generating Video'
      case 'pdf-ocr':
        return 'Extracting PDF Text'
      default:
        return 'Processing'
    }
  }

  const getTaskDescription = (task: Task) => {
    switch (task.type) {
      case 'text-to-speech':
        return `Voice: ${(task as any).request.voice}`
      case 'speech-to-text':
        return `File: ${(task as any).request.fileName}`
      case 'video-creation':
        return `Duration: ${(task as any).request.duration}s`
      case 'pdf-ocr':
        return `File: ${(task as any).request.fileName}`
      default:
        return 'Processing...'
    }
  }

  const handleCancelTask = (taskId: string) => {
    removeTask(taskId)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Active Tasks ({activeTasks.length})
        </CardTitle>
        <CardDescription>
          Tasks currently processing in the background
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeTasks.map((task) => {
            const Icon = getTaskIcon(task.type)
            return (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{getTaskTitle(task)}</p>
                    <p className="text-xs text-muted-foreground">
                      {getTaskDescription(task)} • {task.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancelTask(task.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}