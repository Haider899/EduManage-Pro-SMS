import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import LayoutWrapper from '@/components/Common/LayoutWrapper';

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
      <body className="relative min-h-screen bg-[#f8fafc] text-slate-900 font-inter antialiased overflow-x-hidden dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_40%)]" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:100px_100px] dark:bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]" />
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
