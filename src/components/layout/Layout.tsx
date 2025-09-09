import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Mic, Volume2, Video, Settings, Home, Menu, X, FileText, ChevronDown } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

interface NavigationItem {
  name: string
  href: string
  icon: any
  category?: string
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Text to Speech', href: '/text-to-speech', icon: Volume2, category: 'AI Tools' },
    { name: 'Speech to Text', href: '/speech-to-text', icon: Mic, category: 'AI Tools' },
    { name: 'Video Creation', href: '/video-creation', icon: Video, category: 'AI Tools' },
    { name: 'PDF Text Extract', href: '/pdf-text-extract', icon: FileText, category: 'Production Tools' },
  ]

  // Settings is handled separately as it goes with theme toggle
  const settingsNavigation = { name: 'Settings', href: '/settings', icon: Settings }

  // Group navigation items by category for desktop
  const groupedNavigation = navigation.reduce((acc, item) => {
    if (item.category) {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
    } else {
      if (!acc['Main']) {
        acc['Main'] = []
      }
      acc['Main'].push(item)
    }
    return acc
  }, {} as Record<string, NavigationItem[]>)

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
                <div className="h-8 w-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-bold hidden sm:block">SRM Tools Platform</h1>
                <h1 className="text-lg font-bold sm:hidden">SRM Tools</h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {Object.entries(groupedNavigation).map(([category, items]) => {
                if (category === 'Main') {
                  // Render main items (Dashboard, Settings) normally
                  return items.map((item) => {
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
                  })
                } else {
                  // Render categorized items as dropdown
                  const hasActiveItem = items.some(item => location.pathname === item.href)
                  
                  return (
                    <DropdownMenu key={category}>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant={hasActiveItem ? 'default' : 'ghost'}
                          size="sm" 
                          className="flex items-center space-x-1"
                        >
                          <span className="hidden xl:inline">{category}</span>
                          <span className="xl:hidden">Tools</span>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        {items.map((item) => {
                          const Icon = item.icon
                          const isActive = location.pathname === item.href
                          
                          return (
                            <DropdownMenuItem key={item.href} asChild>
                              <Link 
                                to={item.href} 
                                className={`flex items-center space-x-2 w-full ${
                                  isActive ? 'bg-accent' : ''
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                                <span>{item.name}</span>
                              </Link>
                            </DropdownMenuItem>
                          )
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                }
              })}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center space-x-2">
              {/* Settings - Desktop */}
              <Button
                variant={location.pathname === settingsNavigation.href ? 'default' : 'ghost'}
                size="sm"
                asChild
                className="hidden lg:flex"
              >
                <Link to={settingsNavigation.href} className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden xl:inline">{settingsNavigation.name}</span>
                </Link>
              </Button>
              
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
              <nav className="container mx-auto px-4 py-4 space-y-3">
                {Object.entries(groupedNavigation).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    {category !== 'Main' && (
                      <h3 className="text-sm font-medium text-muted-foreground px-2">
                        {category}
                      </h3>
                    )}
                    <div className="space-y-1">
                      {items.map((item) => {
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
                    </div>
                  </div>
                ))}
                
                {/* Settings for mobile */}
                <div className="pt-2 border-t">
                  <Button
                    variant={location.pathname === settingsNavigation.href ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    asChild
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link to={settingsNavigation.href} className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>{settingsNavigation.name}</span>
                    </Link>
                  </Button>
                </div>
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
              © 2025 AI SRM Media Platform. Built with Azure OpenAI.
            </p>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">
                Powered by SRM
              </p>
              {/* sixredmarbles logo */}
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-red-600">sixredmarbles</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}