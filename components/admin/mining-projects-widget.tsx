"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button" 
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Pickaxe, 
  RefreshCw, 
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MiningProject {
  id: string
  name: string
  type: string
  location: string
  status: 'proposed' | 'approved' | 'in-progress' | 'completed' | 'suspended' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  budget: number
  spent: number
  progress: number
  startDate: string
  endDate: string
  company: string
  projectManager: string
  teamSize: number
  createdAt: string
  updatedAt: string
}

export function MiningProjectsWidget() {
  const [projects, setProjects] = useState<MiningProject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      
      // Fetch real mining projects from API
      const response = await fetch('/api/mining-projects')
      
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
        
        if (data.projects?.length === 0) {
          toast({
            title: "Notice",
            description: "Mining projects database is being configured. No projects loaded.",
            variant: "default"
          })
        }
      } else {
        console.warn('Mining projects API not available')
        setProjects([])
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      setProjects([])
      toast({
        title: "Error",
        description: "Failed to load mining projects from database",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshProjects = async () => {
    await fetchProjects()
    toast({
      title: "Refreshed",
      description: "Mining projects data has been refreshed",
      variant: "default"
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />
      case 'suspended': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'cancelled': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Pickaxe className="h-5 w-5 text-amber-600" />
            <CardTitle>Mining Projects Management</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshProjects}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Status</option>
            <option value="proposed">Proposed</option>
            <option value="approved">Approved</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="suspended">Suspended</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading mining projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-8">
            <Pickaxe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Mining Projects</h3>
            <p className="text-muted-foreground mb-4">
              {projects.length === 0 
                ? "The mining projects database is being configured. Real project data will appear here once connected."
                : "No projects match your current filters."
              }
            </p>
            <Button onClick={refreshProjects} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Again
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(project.status)}
                      <h3 className="font-semibold">{project.name}</h3>
                      <Badge variant={getPriorityColor(project.priority) as any}>
                        {project.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.type}</p>
                  </div>
                  <Badge variant="outline">{project.status}</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">R{project.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{project.teamSize} team members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                  <div className="text-sm text-muted-foreground">
                    Managed by {project.projectManager} • {project.company}
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
