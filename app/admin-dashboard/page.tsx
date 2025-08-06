import { redirect } from "next/navigation"
import { AdminDashboardV2 } from "@/components/admin/v2/admin-dashboard-v2"

interface PageProps {
  searchParams: { key?: string }
}

export default function AdminDashboardPage({ searchParams }: PageProps) {
  const { key } = searchParams

  // Simple key-based authentication
  if (key !== process.env.DASHBOARD_KEY) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminDashboardV2 initialKey={key} />
    </div>
  )
}
