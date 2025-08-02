"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  RefreshCw, 
  Plus,
  Search,
  Filter,
  Users,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TrainingCourse {
  id: string
  title: string
  description: string
  category: string
  duration: number // minutes
  level: 'beginner' | 'intermediate' | 'advanced'
  instructor: string
  enrollments: number
  completions: number
  rating: number
  status: 'active' | 'draft' | 'archived'
  startDate: string
  endDate: string
  maxEnrollments: number
  createdAt: string
  updatedAt: string
}

interface Enrollment {
  id: string
  courseId: string
  courseName: string
  studentName: string
  studentEmail: string
  enrollmentDate: string
  status: 'enrolled' | 'in-progress' | 'completed' | 'dropped'
  progress: number
  completionDate?: string
  grade: number
  certificateIssued: boolean
}

export function TrainingManagementWidget() {
  const [courses, setCourses] = useState<TrainingCourse[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'courses' | 'enrollments'>('courses')
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchTrainingData()
  }, [])

  const fetchTrainingData = async () => {
    try {
      setLoading(true)
      
      // Fetch real training data from API
      const [coursesResponse, enrollmentsResponse] = await Promise.allSettled([
        fetch('/api/training/courses'),
        fetch('/api/training/enrollments')
      ])

      if (coursesResponse.status === 'fulfilled' && coursesResponse.value.ok) {
        const coursesData = await coursesResponse.value.json()
        setCourses(coursesData.courses || [])
      } else {
        setCourses([])
      }

      if (enrollmentsResponse.status === 'fulfilled' && enrollmentsResponse.value.ok) {
        const enrollmentsData = await enrollmentsResponse.value.json()
        setEnrollments(enrollmentsData.enrollments || [])
      } else {
        setEnrollments([])
      }

      // Show notice if no data available
      if (courses.length === 0 && enrollments.length === 0) {
        toast({
          title: "Notice",
          description: "Training management database is being configured. No training data loaded.",
          variant: "default"
        })
      }
    } catch (error) {
      console.error('Failed to fetch training data:', error)
      setCourses([])
      setEnrollments([])
      toast({
        title: "Error",
        description: "Failed to load training data from database",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    await fetchTrainingData()
    toast({
      title: "Refreshed",
      description: "Training data has been refreshed",
      variant: "default"
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />
      case 'dropped': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'secondary'
      case 'intermediate': return 'default'
      case 'advanced': return 'destructive'
      default: return 'secondary'
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enrollment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enrollment.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <CardTitle>Training Management</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Course
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === 'courses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Training Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === 'enrollments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Enrollments ({enrollments.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading training data...</p>
          </div>
        ) : activeTab === 'courses' ? (
          filteredCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Training Courses</h3>
              <p className="text-muted-foreground mb-4">
                {courses.length === 0 
                  ? "The training management database is being configured. Real course data will appear here once connected."
                  : "No courses match your current search."
                }
              </p>
              <Button onClick={refreshData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Again
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant={getLevelColor(course.level) as any}>
                        {course.level}
                      </Badge>
                      <Badge variant="outline">{course.status}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{course.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{course.enrollments} enrolled</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{course.rating}/5</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      by {course.instructor}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span>{Math.round((course.completions / course.enrollments) * 100) || 0}%</span>
                    </div>
                    <Progress value={(course.completions / course.enrollments) * 100 || 0} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <div className="text-sm text-muted-foreground">
                      {course.category} • Created {new Date(course.createdAt).toLocaleDateString()}
                    </div>
                    <Button variant="ghost" size="sm">
                      Manage Course
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          filteredEnrollments.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Enrollments</h3>
              <p className="text-muted-foreground mb-4">
                {enrollments.length === 0 
                  ? "The training enrollment database is being configured. Real enrollment data will appear here once connected."
                  : "No enrollments match your current search."
                }
              </p>
              <Button onClick={refreshData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Again
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredEnrollments.map((enrollment) => (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{enrollment.studentName}</h3>
                      <p className="text-sm text-muted-foreground">{enrollment.studentEmail}</p>
                      <p className="text-sm font-medium mt-1">{enrollment.courseName}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(enrollment.status)}
                      <Badge variant="outline">{enrollment.status}</Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <Progress value={enrollment.progress} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div>
                      Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-4">
                      {enrollment.grade > 0 && (
                        <span>Grade: {enrollment.grade}%</span>
                      )}
                      {enrollment.certificateIssued && (
                        <Badge variant="secondary" className="text-xs">
                          Certificate Issued
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}
