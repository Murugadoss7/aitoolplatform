import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FileUpload } from '@/components/common/FileUpload'
import { Loader2, FileText, Download, Clock, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react'
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
  const [ocrJobsData, setOCRJobsData] = useState<{
    count: number
    next: string | null
    previous: string | null
    results: OCRJobWithStatus[]
  } | null>(null)
  
  // Search and pagination state
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<{
    count: number
    next: string | null
    previous: string | null
    results: OCRJobWithStatus[]
  } | null>(null)
  const [isSearchMode, setIsSearchMode] = useState(false)
  
  const { addTask, updateTask, getTasksByType } = useTaskManager()
  const ocrTasks = getTasksByType('pdf-ocr')
  const activeTasks = ocrTasks.filter(task => 
    task.status === 'processing' || task.status === 'pending'
  )

  const loadOCRJobs = async (pageUrl?: string) => {
    if (!azureService.isOCRConfigured()) {
      setError('OCR API not configured. Please check your settings.')
      return
    }

    try {
      setIsLoadingJobs(true)
      setError(null)
      const response: OCRJobsResponse = await azureService.getOCRJobs(pageUrl)
      
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
      setOCRJobsData({
        count: response.count,
        next: response.next,
        previous: response.previous,
        results: jobsWithStatus
      })
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

  // Auto-load documents when component mounts
  useEffect(() => {
    if (azureService.isOCRConfigured()) {
      loadOCRJobs()
    }
  }, [])

  // Auto-refresh jobs every 30 seconds to update status of in-progress jobs
  useEffect(() => {
    if (!azureService.isOCRConfigured()) return

    const interval = setInterval(() => {
      // Only refresh if there are jobs in progress
      const hasInProgressJobs = ocrJobs.some(job => job.status === 'p')
      if (hasInProgressJobs) {
        loadOCRJobs()
      }
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [ocrJobs])

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

      // Create new job object for immediate display
      const newJob: OCRJobWithStatus = {
        ...result,
        statusText: 'In Progress',
        statusIcon: Clock,
        canDownload: false,
        name: selectedFile.name,
        created_at: new Date().toISOString(),
        processed_on: undefined
      }

      // Add new job to the top of the list for immediate visibility
      setOCRJobs(prevJobs => [newJob, ...prevJobs])

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

      // Clear selected file
      setSelectedFile(null)

      // Refresh jobs list to get updated status
      setTimeout(() => {
        loadOCRJobs()
      }, 1000)

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

  const handleSearch = async (query: string = searchQuery, pageUrl?: string) => {
    if (!query.trim()) {
      // Clear search and return to normal mode
      setIsSearchMode(false)
      setSearchResults(null)
      setSearchQuery('')
      return
    }

    try {
      setIsSearching(true)
      setError(null)
      
      const results = await azureService.searchOCRJobs(query, pageUrl)
      
      // Process search results with status
      const resultsWithStatus: OCRJobWithStatus[] = results.results.map(job => {
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

      setSearchResults({
        ...results,
        results: resultsWithStatus
      })
      setIsSearchMode(true)
    } catch (err: any) {
      console.error('Search failed:', err)
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    // Auto-search after 3 characters
    if (query.length >= 3) {
      handleSearch(query)
    } else if (query.length === 0) {
      // Clear search when input is empty
      handleSearch('')
    }
  }

  const handlePagination = (pageUrl: string) => {
    if (isSearchMode) {
      handleSearch(searchQuery, pageUrl)
    } else {
      // Handle pagination for regular jobs list
      loadOCRJobs(pageUrl)
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
              compact={true}
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
            size="sm"
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

      {/* Search Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 w-full max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search documents by filename..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={() => handleSearch(searchQuery)}
                disabled={isSearching || !searchQuery.trim()}
                size="default"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
              {isSearchMode && (
                <Button 
                  variant="outline"
                  onClick={() => handleSearch('')}
                  size="default"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
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
              onClick={() => loadOCRJobs()}
              disabled={isLoadingJobs}
              size="sm"
            >
              {isLoadingJobs ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                ocrJobs.length === 0 ? 'Load Documents' : 'Refresh'
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Show loading state */}
          {(isLoadingJobs || isSearching) && (isSearchMode ? !searchResults : ocrJobs.length === 0) ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">
                {isSearching ? 'Searching documents...' : 'Loading your documents...'}
              </p>
            </div>
          ) : /* Show search results or regular jobs */ 
          (() => {
            const currentJobs: OCRJobWithStatus[] = isSearchMode && searchResults ? searchResults.results : ocrJobs
            const currentData = isSearchMode && searchResults ? searchResults : ocrJobsData
            
            return currentJobs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {isSearchMode ? `No documents found matching "${searchQuery}"` : 'No documents uploaded yet.'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isSearchMode ? 'Try a different search term.' : 'Upload your first PDF to get started.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Results info */}
                {isSearchMode && searchResults && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground border-b pb-2">
                    <span>Found {searchResults.count} documents matching "{searchQuery}"</span>
                  </div>
                )}
                
                {/* Jobs list */}
                {currentJobs.map((job) => {
                  const StatusIcon = job.statusIcon
                  return (
                    <div key={job.id} className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                      job.status === 'p' ? 'border-yellow-200 bg-yellow-50/50' : 
                      job.status === 'c' ? 'border-green-200 bg-green-50/50' : 
                      job.status === 'f' ? 'border-red-200 bg-red-50/50' : 'border-gray-200'
                    }`}>
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
                          <StatusIcon className={`h-4 w-4 ${
                            job.status === 'p' ? 'text-yellow-500 animate-pulse' : 
                            job.status === 'c' ? 'text-green-500' : 
                            job.status === 'f' ? 'text-red-500' : 'text-gray-400'
                          }`} />
                          <span className={`text-sm font-medium ${
                            job.status === 'p' ? 'text-yellow-600' : 
                            job.status === 'c' ? 'text-green-600' : 
                            job.status === 'f' ? 'text-red-600' : 'text-gray-500'
                          }`}>{job.statusText}</span>
                        </div>
                        {job.canDownload ? (
                          <Button
                            size="sm"
                            onClick={() => handleDownload(job)}
                            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </Button>
                        ) : job.status === 'p' ? (
                          <Button size="sm" disabled className="bg-yellow-100 text-yellow-600">
                            <Clock className="h-4 w-4 animate-pulse mr-1" />
                            Processing...
                          </Button>
                        ) : job.status === 'f' ? (
                          <Button size="sm" disabled className="bg-red-100 text-red-600">
                            <XCircle className="h-4 w-4" />
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
                
                {/* Pagination */}
                {currentData && (currentData.next || currentData.previous) && (
                  <div className="flex items-center justify-center space-x-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => currentData.previous && handlePagination(currentData.previous)}
                      disabled={!currentData.previous}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    <div className="text-sm text-muted-foreground px-4">
                      {currentData && currentData.count > 0 && (
                        <span>
                          {currentData.results.length} of {currentData.count} {isSearchMode ? 'results' : 'documents'}
                        </span>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => currentData.next && handlePagination(currentData.next)}
                      disabled={!currentData.next}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })()}
        </CardContent>
      </Card>
    </div>
  )
}