import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/common/ThemeProvider'
import { TaskManagerProvider } from './context/TaskManagerContext'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { TextToSpeech } from './pages/TextToSpeech'
import { SpeechToText } from './pages/SpeechToText'
import { VideoCreation } from './pages/VideoCreation'
import { PdfTextExtract } from './pages/PdfTextExtract'
import { PdfImageExtract } from './pages/PdfImageExtract'
import { Settings } from './pages/Settings'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ai-media-platform-theme">
      <TaskManagerProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/text-to-speech" element={<TextToSpeech />} />
            <Route path="/speech-to-text" element={<SpeechToText />} />
            <Route path="/video-creation" element={<VideoCreation />} />
            <Route path="/pdf-text-extract" element={<PdfTextExtract />} />
            <Route path="/pdf-image-extract" element={<PdfImageExtract />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </TaskManagerProvider>
    </ThemeProvider>
  )
}

export default App