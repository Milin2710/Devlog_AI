'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin-sidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Allow access to login page without authentication
    if (pathname === '/admin/login') {
      return
    }
  }, [router, pathname])

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return children
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 md:ml-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
