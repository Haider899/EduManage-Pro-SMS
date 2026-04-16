'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Common/Sidebar';
import Navbar from '@/components/Common/Navbar';
import AuthGuard from '@/components/Common/AuthGuard';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { AUTH_PAGES } from '@/lib/rbac';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.includes(pathname) || pathname.startsWith('/reset-password/');

  return (
    <AuthProvider>
      <AuthGuard>
        {isAuthPage ? (
          <main className="min-h-screen">
            {children}
          </main>
        ) : (
          <div className="relative flex min-h-screen overflow-hidden md:pl-80">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-auto py-6">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        )}
      </AuthGuard>
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}
