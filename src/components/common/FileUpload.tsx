import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, File } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  accept?: string
  maxSizeMB?: number
  selectedFile?: File | null
  className?: string
  placeholder?: string
  supportedFormats?: string
  compact?: boolean
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  accept = 'audio/*',
  maxSizeMB = 50,
  selectedFile,
  className,
  placeholder = 'Drop your audio file here',
  supportedFormats = 'Supported formats: MP3, WAV, M4A, OGG',
  compact = false
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [])

  const handleFileSelect = (file: File) => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      alert(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    onFileSelect(file)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (selectedFile) {
    return (
      <Card className={cn('border-2 border-dashed', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onFileRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'border-2 border-dashed transition-colors cursor-pointer',
        isDragOver && 'border-primary bg-primary/5',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className={compact ? "p-4" : "p-6"}>
        <div className={`text-center ${compact ? "space-y-3" : "space-y-4"}`}>
          <Upload className={`mx-auto text-muted-foreground ${compact ? "h-8 w-8" : "h-12 w-12"}`} />
          <div>
            <p className={`font-medium ${compact ? "text-base" : "text-lg"}`}>{placeholder}</p>
            <p className={`text-muted-foreground ${compact ? "text-sm" : ""}`}>
              or click to browse (max {maxSizeMB}MB)
            </p>
          </div>
          <Button
            variant="outline"
            size={compact ? "sm" : "default"}
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = accept
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0]
                if (file) {
                  handleFileSelect(file)
                }
              }
              input.click()
            }}
          >
            Select File
          </Button>
          <p className="text-xs text-muted-foreground">
            {supportedFormats}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}