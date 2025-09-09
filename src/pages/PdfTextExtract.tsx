import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { FileUpload } from '@/components/common/FileUpload'
import { Loader2, FileText, Download, Clock, CheckCircle, XCircle } from 'lucide-react'
import { azureService } from '@/services/azureService'
import { useTaskManager } from '@/context/TaskManagerContext'
import { TaskProgress } from '@/components/common/TaskProgress'
import type { OCRRequest, OCRResponse, OCRJobsResponse } from '@/types/azure'
import type { OCRTask } from '@/types/taskManager'

interface OCRJobWithStatus extends OCRResponse {
  statusText: string
  statusIcon: React.ElementType
  canDownload: boolean
}

export function PdfTextExtract() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [ocrJobs, setOCRJobs] = useState<OCRJobWithStatus[]>([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { addTask, updateTask, getTasksByType } = useTaskManager()
  const ocrTasks = getTasksByType('pdf-ocr')
  const activeTasks = ocrTasks.filter(task => 
    task.status === 'processing' || task.status === 'pending'
  )

  const loadOCRJobs = async () => {
    if (!azureService.isOCRConfigured()) {
      setError('OCR API not configured. Please check your settings.')
      return
    }

    try {
      setIsLoadingJobs(true)
      setError(null)
      const response: OCRJobsResponse = await azureService.getOCRJobs()
      
      const jobsWithStatus: OCRJobWithStatus[] = response.results.map(job => {
        let statusText = ''
        let statusIcon = Clock
        let canDownload = false

        switch (job.status) {
          case 'p':
            statusText = 'In Progress'
            statusIcon = Clock
            break
          case 'c':
            statusText = 'Completed'
            statusIcon = CheckCircle
            canDownload = true
            break
          case 'f':
            statusText = 'Failed'
            statusIcon = XCircle
            break
          default:
            statusText = 'Unknown'
        }

        return {
          ...job,
          statusText,
          statusIcon,
          canDownload
        }
      })

      setOCRJobs(jobsWithStatus)
    } catch (err: any) {
      console.error('Failed to load OCR jobs:', err)
      let errorMessage = 'Failed to load OCR jobs'
      
      if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
        errorMessage = 'Network connection error. Please check if the OCR API server is running and accessible.'
      } else if (err.message?.includes('CORS')) {
        errorMessage = 'CORS error: The OCR API server needs to allow requests from this domain.'
      } else if (err.response?.status === 404) {
        errorMessage = 'OCR API endpoint not found. Please check the API URL configuration.'
      } else if (err.response?.status >= 500) {
        errorMessage = 'OCR API server error. Please try again later.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setIsLoadingJobs(false)
    }
  }

  useEffect(() => {
    loadOCRJobs()
    // Only load jobs on component mount, no automatic polling
  }, [])

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setError(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
      setError('File size must be less than 100MB')
      return
    }

    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are supported')
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      const request: OCRRequest = {
        pdfFile: selectedFile,
        ocrType: 'azure'
      }

      // Create task for tracking
      const taskId = Math.random().toString(36).substring(2, 15)
      const task: OCRTask = {
        id: taskId,
        type: 'pdf-ocr',
        status: 'processing',
        createdAt: new Date(),
        request: {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          ocrType: 'azure'
        }
      }

      addTask(task)

      // Upload the file
      const result = await azureService.uploadPDFForOCR(request)

      // Update task with result
      updateTask(taskId, {
        status: 'completed',
        completedAt: new Date(),
        result: {
          ocrJobId: result.id,
          outputDocxUrl: result.output_docx,
          outputJsonUrl: result.output_json
        },
        ocrJobId: result.id
      })

      // Clear selected file and refresh jobs list
      setSelectedFile(null)
      await loadOCRJobs()

    } catch (err) {
      console.error('Upload failed:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
      
      // Update task status to failed if it exists
      const failedTask = activeTasks.find(task => {
        if (task.type === 'pdf-ocr') {
          return (task as OCRTask).request.fileName === selectedFile.name
        }
        return false
      })
      if (failedTask) {
        updateTask(failedTask.id, {
          status: 'failed',
          error: err instanceof Error ? err.message : 'Upload failed'
        })
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async (job: OCRJobWithStatus) => {
    if (!job.output_docx) return

    try {
      const blob = await azureService.downloadOCRResult(job.output_docx)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${job.name.replace('.pdf', '')}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
      setError(err instanceof Error ? err.message : 'Download failed')
    }
  }


  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">PDF Text Extract</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload PDF files to extract text content using Azure Document Intelligence.
        </p>
      </div>

      {/* Active Tasks */}
      <TaskProgress />

      {/* Upload Section */}
      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <FileUpload
              accept=".pdf,application/pdf"
              maxSizeMB={100}
              onFileSelect={handleFileSelect}
              onFileRemove={() => setSelectedFile(null)}
              selectedFile={selectedFile}
              placeholder="Drop your PDF file here"
              supportedFormats="Supported format: PDF"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading || !azureService.isOCRConfigured()}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Upload & Extract Text
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Jobs List Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Your Documents</span>
              </CardTitle>
              <CardDescription>
                Track the status of your PDF text extraction jobs.
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={loadOCRJobs}
              disabled={isLoadingJobs}
              size="sm"
            >
              {isLoadingJobs ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingJobs && ocrJobs.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Loading your documents...</p>
            </div>
          ) : ocrJobs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No documents uploaded yet.</p>
              <p className="text-sm text-muted-foreground">Upload your first PDF to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ocrJobs.map((job) => {
                const StatusIcon = job.statusIcon
                return (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{job.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Uploaded: {formatDate(job.created_at)}</span>
                          {job.processed_on && (
                            <span>Processed: {formatDate(job.processed_on)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-sm">{job.statusText}</span>
                      </div>
                      {job.canDownload ? (
                        <Button
                          size="sm"
                          onClick={() => handleDownload(job)}
                          className="flex items-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </Button>
                      ) : (
                        <Button size="sm" disabled>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}