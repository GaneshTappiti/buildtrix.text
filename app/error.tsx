"use client"

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-glass p-4">
      <Card className="w-full max-w-md workspace-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-600/20 rounded-full w-fit border border-red-500/30">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <CardTitle className="text-2xl text-white">Something went wrong!</CardTitle>
          <CardDescription className="text-gray-400">
            An unexpected error occurred. Please try again or return to the home page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button onClick={reset} className="w-full workspace-button">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" asChild className="w-full workspace-button-secondary">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Link>
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-3 bg-black/20 rounded-lg border border-white/10">
              <summary className="cursor-pointer text-sm font-medium text-white">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs text-gray-400 overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
