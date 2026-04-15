import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import LayoutWrapper from '@/components/Common/LayoutWrapper';
import Scene3D from '@/components/Common/Scene3D';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SMS Pro | Intelligent School Management',
    template: '%s | SMS Pro',
  },
  description: 'Next-generation school management system with real-time analytics, automated attendance, and premium 3D dashboard.',
  keywords: ['school management', 'education ERP', 'student portal', 'teacher dashboard'],
  authors: [{ name: 'Antigravity' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="relative min-h-screen bg-slate-950 text-slate-100 font-inter antialiased overflow-x-hidden">
        <Scene3D />
        
        {/* Cinematic Backdrop */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] h-[60%] w-[60%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse"></div>
          <div className="absolute top-[40%] -right-[10%] h-[50%] w-[50%] rounded-full bg-purple-500/10 blur-[120px]"></div>
          <div className="absolute -bottom-[10%] left-[20%] h-[40%] w-[40%] rounded-full bg-sky-500/10 blur-[100px]"></div>
        </div>

        <div className="relative z-10">
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </div>
      </body>
    </html>
  );
}



