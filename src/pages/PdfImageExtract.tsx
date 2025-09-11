import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Image, Download, Terminal, FileSpreadsheet, Folder, CheckCircle, AlertCircle } from 'lucide-react'

export function PdfImageExtract() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Image Extract from PDF</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Extract images from PDF documents and create an Excel file with images and corresponding page numbers using our standalone local tool.
        </p>
      </div>

      {/* Tool Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Image className="h-5 w-5" />
            <span>About This Tool</span>
          </CardTitle>
          <CardDescription>
            A powerful standalone application that extracts all images from PDF documents and organizes them in an Excel spreadsheet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold">Key Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Extract all images from any PDF document</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Generate Excel file with images and page numbers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Batch process multiple PDF files</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Preserve original image quality</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Works completely offline</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold">Output Format</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Excel (.xlsx) file with organized data</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Folder className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Separate folder with extracted images</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Image className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Images embedded in Excel cells</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Download & Installation</span>
          </CardTitle>
          <CardDescription>
            Get the standalone tool and install it on your local machine.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                1
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Download the Tool</h3>
                <p className="text-sm text-muted-foreground">
                  Download the PDF Image Extractor executable for your operating system.
                </p>
                <div className="flex space-x-2">
                  <Button size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Windows (.exe)
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    macOS (.dmg)
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Linux (.deb)
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                2
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Install the Application</h3>
                <p className="text-sm text-muted-foreground">
                  Run the installer and follow the setup instructions. No additional dependencies required.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                3
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Launch the Tool</h3>
                <p className="text-sm text-muted-foreground">
                  Find the "PDF Image Extractor" in your applications folder or start menu and launch it.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Terminal className="h-5 w-5" />
            <span>How to Use</span>
          </CardTitle>
          <CardDescription>
            Step-by-step guide to extract images from your PDF documents.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-bold">
                1
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Select PDF File(s)</h3>
                <p className="text-sm text-muted-foreground">
                  Click "Browse" or drag and drop your PDF files into the application window. You can select multiple files for batch processing.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-bold">
                2
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Choose Output Folder</h3>
                <p className="text-sm text-muted-foreground">
                  Select where you want to save the extracted images and Excel file. The tool will create subfolders for organization.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-bold">
                3
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Configure Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Choose image quality, format preferences, and Excel template options. Default settings work well for most cases.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-bold">
                4
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Start Extraction</h3>
                <p className="text-sm text-muted-foreground">
                  Click "Extract Images" to begin the process. A progress bar will show the current status and estimated time remaining.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-sm font-bold">
                5
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Review Results</h3>
                <p className="text-sm text-muted-foreground">
                  Open the generated Excel file to view all extracted images with their corresponding page numbers and metadata.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>System Requirements</CardTitle>
          <CardDescription>
            Minimum system specifications for optimal performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Windows</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Windows 10 or later</li>
                <li>4 GB RAM minimum</li>
                <li>50 MB free disk space</li>
                <li>.NET Framework 4.7.2+</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">macOS</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>macOS 10.15 or later</li>
                <li>4 GB RAM minimum</li>
                <li>50 MB free disk space</li>
                <li>Intel or Apple Silicon</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Linux</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Ubuntu 18.04+ or equivalent</li>
                <li>4 GB RAM minimum</li>
                <li>50 MB free disk space</li>
                <li>X11 display server</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Troubleshooting</span>
          </CardTitle>
          <CardDescription>
            Common issues and their solutions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold text-sm">Tool won't start or crashes</h3>
              <p className="text-sm text-muted-foreground">
                Ensure you have the required system dependencies installed. Try running as administrator (Windows) or with sudo (Linux).
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-sm">No images found in PDF</h3>
              <p className="text-sm text-muted-foreground">
                Some PDFs may have embedded images that are not extractable. Try using a different PDF or check if images are actually present.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-sm">Excel file won't open</h3>
              <p className="text-sm text-muted-foreground">
                Ensure you have Microsoft Excel or a compatible spreadsheet application installed. LibreOffice Calc works as an alternative.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}