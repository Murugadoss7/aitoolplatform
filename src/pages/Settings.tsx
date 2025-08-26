import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings as SettingsIcon, Shield, Info, CheckCircle, AlertCircle } from 'lucide-react'
import { azureService } from '@/services/azureService'

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Configuration status and application information
        </p>
      </div>

      <Tabs defaultValue="status" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="status">Configuration Status</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        {/* Configuration Status */}
        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Configuration Status</CardTitle>
              <CardDescription>
                Current status of Azure service configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Text-to-Speech (Azure OpenAI)</span>
                  <div className="flex items-center gap-2">
                    {azureService.isTTSConfigured() ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Configured</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">Not configured</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Speech-to-Text (Azure OpenAI Whisper)</span>
                  <div className="flex items-center gap-2">
                    {azureService.isSTTConfigured() ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Configured</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">Not configured</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Video Generation (Azure OpenAI)</span>
                  <div className="flex items-center gap-2">
                    {azureService.isVideoConfigured() ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Configured</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">Not configured</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration Instructions</CardTitle>
              <CardDescription>
                How to configure your Azure services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Environment Variables</h3>
                <p className="text-sm text-muted-foreground">
                  Update the <code className="bg-muted px-1 py-0.5 rounded">.env</code> file in your project root with your Azure credentials:
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm">
{`# Text-to-Speech Configuration
VITE_AZURE_TTS_ENDPOINT=https://your-instance.openai.azure.com/
VITE_AZURE_TTS_API_KEY=your_tts_api_key
VITE_AZURE_TTS_DEPLOYMENT=gpt-4o-mini-tts

# Speech-to-Text Configuration  
VITE_AZURE_STT_ENDPOINT=https://your-instance.openai.azure.com
VITE_AZURE_STT_API_KEY=your_stt_api_key
VITE_AZURE_STT_API_VERSION=2024-06-01
VITE_AZURE_STT_DEPLOYMENT=whisper

# Video Generation Configuration
VITE_AZURE_VIDEO_ENDPOINT=https://your-video-instance.openai.azure.com/
VITE_AZURE_VIDEO_API_KEY=your_video_api_key
VITE_AZURE_VIDEO_DEPLOYMENT=your_video_deployment`}
                </pre>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">After updating:</h3>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                  <li>Save the <code className="bg-muted px-1 py-0.5 rounded">.env</code> file</li>
                  <li>Restart the development server</li>
                  <li>Refresh this page to see updated status</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                About AI Media Platform
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Built with:</strong> React, TypeScript, Tailwind CSS, shadcn/ui</p>
                <p><strong>Azure Services:</strong> OpenAI TTS, Speech Services, Video Generation</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Features:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Text-to-Speech with Azure OpenAI TTS (6 voice options)</li>
                  <li>Speech-to-Text with Azure Speech Services</li>
                  <li>AI-powered video generation (placeholder)</li>
                  <li>Responsive design with dark/light mode</li>
                  <li>File upload and download capabilities</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  Your API keys are configured through environment variables and are never 
                  transmitted to any third-party services except Azure for authentication.
                </p>
                <p className="text-sm">
                  Audio and video files are processed through Azure services according to 
                  Microsoft's privacy and security policies.
                </p>
                <p className="text-sm">
                  All configurations are loaded at application startup from environment variables.
                  No sensitive data is stored in the browser.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}