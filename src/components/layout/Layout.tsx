import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Mic, Volume2, Video, Settings, Home, Menu, X } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Text to Speech', href: '/text-to-speech', icon: Volume2 },
    { name: 'Speech to Text', href: '/speech-to-text', icon: Mic },
    { name: 'Video Creation', href: '/video-creation', icon: Video },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-bold hidden sm:block">AI Media Platform</h1>
                <h1 className="text-lg font-bold sm:hidden">AI Media</h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    asChild
                  >
                    <Link to={item.href} className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden xl:inline">{item.name}</span>
                    </Link>
                  </Button>
                )
              })}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              
              {/* Mobile menu button */}
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t bg-card">
              <nav className="container mx-auto px-4 py-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  
                  return (
                    <Button
                      key={item.href}
                      variant={isActive ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link to={item.href} className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </Button>
                  )
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 AI Media Platform. Built with Azure OpenAI.
            </p>
            <p className="text-sm text-muted-foreground">
              Powered by SRM
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}