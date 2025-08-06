import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import AdminDashboardV2 from '@/components/admin/v2/admin-dashboard-v2'
import { Loader2 } from 'lucide-react'

interface AdminV2PageProps {
  searchParams: { key?: string }
}

export default function AdminV2Page({ searchParams }: AdminV2PageProps) {
  const { key } = searchParams

  // Check for admin access key
  const requiredKey = process.env.DASHBOARD_KEY || 'hublio-admin-2024'
  
  if (!key || key !== requiredKey) {
    redirect('/?error=unauthorized')
  }

  return (
    <div className="min-h-screen">
      <Suspense 
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading Admin Dashboard V2...</span>
            </div>
          </div>
        }
      >
        <AdminDashboardV2 initialKey={key} />
      </Suspense>
    </div>
  )
}

export const metadata = {
  title: 'Admin Dashboard V2 | Hublio',
  description: 'Enterprise-grade admin dashboard for Hublio mining platform',
}
