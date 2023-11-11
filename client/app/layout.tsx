import { Toaster } from '@/components/ui/Toaster'
import { Providers } from './providers'
import './globals.css'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>

        <Toaster />
      </body>
    </html>
  )
}
