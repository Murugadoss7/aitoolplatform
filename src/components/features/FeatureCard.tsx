import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon, ExternalLink } from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  features?: string[]
  external?: boolean
  compact?: boolean
}

export function FeatureCard({ title, description, icon: Icon, href, features, external = false, compact = false }: FeatureCardProps) {
  if (compact) {
    return (
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex flex-col items-center text-center space-y-2">
            <Icon className="h-8 w-8 text-primary" />
            <CardTitle className="text-lg flex items-center gap-2">
              {title}
              {external && <ExternalLink className="h-3 w-3" />}
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-center line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
        
        {features && features.length > 0 && (
          <CardContent className="flex-1 pt-0">
            <ul className="space-y-1">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="h-1 w-1 bg-primary rounded-full flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{feature}</span>
                </li>
              ))}
              {features.length > 3 && (
                <li className="text-xs text-muted-foreground text-center pt-1">
                  +{features.length - 3} more features
                </li>
              )}
            </ul>
          </CardContent>
        )}
        
        <CardFooter className="pt-0">
          {external ? (
            <Button asChild className="w-full" size="sm">
              <a href={href} target="_blank" rel="noopener noreferrer">
                Open
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          ) : (
            <Button asChild className="w-full" size="sm">
              <Link to={href}>Get Started</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Icon className="h-8 w-8 text-primary" />
          <CardTitle className="text-xl flex items-center gap-2">
            {title}
            {external && <ExternalLink className="h-4 w-4" />}
          </CardTitle>
        </div>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      
      {features && features.length > 0 && (
        <CardContent className="flex-1">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
      
      <CardFooter>
        {external ? (
          <Button asChild className="w-full">
            <a href={href} target="_blank" rel="noopener noreferrer">
              Open Chat
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link to={href}>Get Started</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}