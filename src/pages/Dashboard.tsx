import { FeatureCard } from '@/components/features/FeatureCard'
import { TaskProgress } from '@/components/common/TaskProgress'
import { Mic, Volume2, Video, Clock, FileText, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Dashboard() {
  const features = [
    {
      title: 'Text to Speech',
      description: 'Convert written text into natural-sounding speech with customizable voice parameters.',
      icon: Volume2,
      href: '/text-to-speech',
      features: [
        'Multiple voice options',
        'Adjustable speed and pitch',
        'Various audio formats',
        'Long text support',
        'Download capabilities'
      ]
    },
    {
      title: 'Speech to Text',
      description: 'Transform audio recordings into accurate text transcriptions with confidence scores.',
      icon: Mic,
      href: '/speech-to-text',
      features: [
        'Multiple language support',
        'File upload or live recording',
        'Confidence scoring',
        'Editable transcripts',
        'Export to text files'
      ]
    },
    {
      title: 'Video Creation',
      description: 'Generate engaging videos from text prompts with customizable parameters and effects.',
      icon: Video,
      href: '/video-creation',
      features: [
        'AI-powered generation',
        'Custom backgrounds',
        'Text overlays',
        'Multiple resolutions',
        'Various frame rates'
      ]
    },
    {
      title: 'AI Chat',
      description: 'Interactive AI chat with image upload capabilities. Content is secure and private.',
      icon: MessageSquare,
      href: 'https://srmmultichat.azurewebsites.net/',
      external: true,
      features: [
        'Interactive AI conversations',
        'Image upload support',
        'Secure content handling',
        'Multi-modal interactions',
        'Privacy-focused design'
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">AI Media Platform</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your content with powerful AI-driven speech and video generation tools. 
          Create professional media content with just a few clicks.
        </p>
      </div>

      {/* Active Tasks */}
      <TaskProgress />

      {/* Feature cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>

      {/* Recent activity section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
            <CardDescription>Your latest conversions and creations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Marketing Script TTS</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mic className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Meeting Transcription</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Product Demo Video</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Quick Actions</CardTitle>
            </div>
            <CardDescription>Common tasks to get started quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full p-3 bg-muted hover:bg-muted/80 rounded-lg text-left transition-colors">
                <div className="flex items-center space-x-3">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Convert text to speech</p>
                    <p className="text-xs text-muted-foreground">Transform written content to audio</p>
                  </div>
                </div>
              </button>
              <button className="w-full p-3 bg-muted hover:bg-muted/80 rounded-lg text-left transition-colors">
                <div className="flex items-center space-x-3">
                  <Mic className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Transcribe audio file</p>
                    <p className="text-xs text-muted-foreground">Upload audio for transcription</p>
                  </div>
                </div>
              </button>
              <button className="w-full p-3 bg-muted hover:bg-muted/80 rounded-lg text-left transition-colors">
                <div className="flex items-center space-x-3">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Create new video</p>
                    <p className="text-xs text-muted-foreground">Generate video from text prompt</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}