import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/ai/admin-dashboard"

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
      <AdminDashboard />
    </div>
  )
}
