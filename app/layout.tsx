import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { IdeaProvider } from '@/stores/ideaStore';

const inter = Inter({ subsets: ['latin'] })
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ReactQueryProvider } from './providers/ReactQueryProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminProvider } from '@/contexts/AdminContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Builder Blueprint AI - MVP Studio',
  description: 'Your AI-powered build orchestrator. Generate prompts, get tool recommendations, and build your MVP with the best AI builders in the market.',
  authors: [{ name: 'Builder Blueprint AI' }],
  keywords: ['AI', 'MVP', 'App Builder', 'No-Code', 'Prompts', 'FlutterFlow', 'Framer', 'Bubble'],
  openGraph: {
    title: 'Builder Blueprint AI - MVP Studio',
    description: 'Your AI-powered build orchestrator for MVP development',
    type: 'website',
    images: [
      {
        url: 'https://lovable.dev/opengraph-image-p98pqg.png',
        width: 1200,
        height: 630,
        alt: 'Builder Blueprint AI'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lovable_dev',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} antialiased h-full`}>
        <div id="__next" className="h-full">
          <ErrorBoundary>
            <ReactQueryProvider>
              <AuthProvider>
                <AdminProvider>
                  <TooltipProvider>
                    <IdeaProvider>
                      {children}
                    </IdeaProvider>
                    <Toaster />
                    <Sonner />
                  </TooltipProvider>
                </AdminProvider>
              </AuthProvider>
            </ReactQueryProvider>
          </ErrorBoundary>
        </div>
      </body>
    </html>
  )
}
