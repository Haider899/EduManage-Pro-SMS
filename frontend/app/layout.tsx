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

        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.2),transparent_25%),radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.16),transparent_22%),radial-gradient(circle_at_80%_30%,rgba(217,70,239,0.12),transparent_25%),linear-gradient(180deg,#050816_0%,#07101d_45%,#030712_100%)]" />
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:140px_140px]" />
          <div className="absolute -top-[20%] left-[5%] h-[36rem] w-[36rem] rounded-full bg-cyan-500/15 blur-[140px] animate-pulse" />
          <div className="absolute top-[20%] right-[0%] h-[28rem] w-[28rem] rounded-full bg-orange-500/10 blur-[130px]" />
          <div className="absolute bottom-[-10%] left-[30%] h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/10 blur-[120px]" />
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



