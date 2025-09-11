import { useState, useMemo } from 'react'
import { FeatureCard } from '@/components/features/FeatureCard'
import { TaskProgress } from '@/components/common/TaskProgress'
import { Input } from '@/components/ui/input'
import { Mic, Volume2, Video, MessageSquare, FileSearch, Search, Image } from 'lucide-react'

interface Tool {
  title: string
  description: string
  icon: any
  href: string
  external?: boolean
  features?: string[]
}

type ToolCategories = Record<string, Tool[]>

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')

  // Organized tools by category
  const toolCategories: ToolCategories = {
    'AI Tools': [
      {
        title: 'Text to Speech',
        description: 'Convert written text into natural-sounding speech with customizable voice parameters.',
        icon: Volume2,
        href: '/text-to-speech',
        features: [
          '6 high-quality Azure voices',
          'Customizable speed, pitch, volume',
          'Multiple output formats (MP3, WAV)',
          'Real-time audio preview'
        ]
      },
      {
        title: 'Speech to Text',
        description: 'Transform audio recordings into accurate text transcriptions with confidence scores.',
        icon: Mic,
        href: '/speech-to-text',
        features: [
          'High-accuracy Azure Whisper',
          'Multiple audio formats supported',
          'Language auto-detection',
          'Editable transcript output'
        ]
      },
      {
        title: 'Video Creation',
        description: 'Generate engaging videos from text prompts with customizable parameters and effects.',
        icon: Video,
        href: '/video-creation',
        features: [
          'AI-powered video generation',
          'Custom background images',
          'Text overlay support',
          'Multiple resolutions & formats'
        ]
      },
      {
        title: 'AI Chat',
        description: 'Interactive AI chat with image upload capabilities. Content is secure and private.',
        icon: MessageSquare,
        href: 'https://srmmultichat.azurewebsites.net/',
        external: true,
        features: [
          'Multi-modal AI conversations',
          'Image upload & analysis',
          'Secure & private chats',
          'Real-time responses'
        ]
      }
    ],
    'Production Tools': [
      {
        title: 'PDF Text Extract',
        description: 'Extract text from PDF documents using Azure Document Intelligence with high accuracy.',
        icon: FileSearch,
        href: '/pdf-text-extract',
        features: [
          'Azure Document Intelligence',
          'High-accuracy OCR processing',
          'Word document output',
          'Batch processing support'
        ]
      },
      {
        title: 'Image Extract from PDF',
        description: 'Extract images from PDF documents and create an Excel file with images and corresponding page numbers.',
        icon: Image,
        href: '/pdf-image-extract',
        features: [
          'Standalone local tool',
          'Extract all images from PDFs',
          'Excel output with page numbers',
          'Batch processing support'
        ]
      }
    ],
    'HR Tools': [
      // Empty for now, ready for future tools
    ]
  }

  // Filter tools based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return toolCategories

    const filtered: ToolCategories = {}
    Object.entries(toolCategories).forEach(([category, tools]) => {
      const matchingTools = tools.filter(tool =>
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (matchingTools.length > 0) {
        filtered[category] = matchingTools
      }
    })
    return filtered
  }, [searchQuery, toolCategories])

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

      {/* Search Box */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Active Tasks */}
      <TaskProgress />

      {/* Tool Categories */}
      {Object.entries(filteredCategories).map(([category, tools]) => (
        tools.length > 0 && (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-center">{category}</h2>
            <div className="flex justify-center">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl">
                {tools.map((tool) => (
                  <FeatureCard key={tool.title} {...tool} compact />
                ))}
              </div>
            </div>
          </div>
        )
      ))}

      {/* No results message */}
      {searchQuery && Object.values(filteredCategories).every(tools => tools.length === 0) && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tools found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}