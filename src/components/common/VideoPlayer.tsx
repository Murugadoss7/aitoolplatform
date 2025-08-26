import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, Download, RotateCcw, Maximize } from 'lucide-react'

interface VideoPlayerProps {
  videoUrl: string
  videoBlob?: Blob
  filename?: string
  thumbnailUrl?: string
}

export function VideoPlayer({ videoUrl, videoBlob, filename = 'video', thumbnailUrl }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState([1])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const setVideoData = () => {
      setDuration(video.duration)
      setCurrentTime(video.currentTime)
    }

    const setVideoTime = () => setCurrentTime(video.currentTime)

    video.addEventListener('loadedmetadata', setVideoData)
    video.addEventListener('timeupdate', setVideoTime)

    return () => {
      video.removeEventListener('loadedmetadata', setVideoData)
      video.removeEventListener('timeupdate', setVideoTime)
    }
  }, [videoUrl])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const time = (value[0] / 100) * duration
    video.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    const video = videoRef.current
    if (video) {
      video.volume = value[0]
    }
  }

  const handleReset = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    setCurrentTime(0)
    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    }
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleDownload = () => {
    if (!videoBlob) return

    const url = URL.createObjectURL(videoBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.mp4`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div ref={containerRef} className="bg-card border rounded-lg overflow-hidden">
      {/* Video Element */}
      <div className="relative bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl}
          onEnded={() => setIsPlaying(false)}
          className="w-full h-auto max-h-96"
          preload="metadata"
        />
        
        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayPause}
            className="bg-black/50 border-white/30 text-white hover:bg-black/70"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="p-4 space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <Slider
            value={[progress]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlayPause}
              disabled={!videoUrl}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              disabled={!videoUrl}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume control */}
          <div className="flex items-center space-x-2 flex-1 max-w-32 mx-4">
            <span className="text-xs">Vol</span>
            <Slider
              value={volume}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.1}
              className="flex-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullscreen}
              disabled={!videoUrl}
            >
              <Maximize className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!videoBlob}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}