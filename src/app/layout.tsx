import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; // Keep Geist for sans-serif
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/context/user-context';
import { ThemeProvider } from '@/components/theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  // Removed weight specification to use all available weights
});

export const metadata: Metadata = {
  title: 'Founder Feedback',
  description: 'Validate your startup ideas and get community feedback.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light" 
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <footer className="py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Founder Feedback. All rights reserved.
              </footer>
            </div>
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
