"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  CheckCircle, 
  XCircle,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Building,
  Users,
  Calendar,
  Eye,
  MessageSquare
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Supplier {
  id: string
  name: string
  category: string
  specialties: string[]
  location: string
  country: string
  website?: string
  email: string
  phone: string
  description: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  rating: number
  reviewCount: number
  yearsInBusiness: number
  employeeCount: string
  certifications: string[]
  inquiries: number
  lastContact?: string
  registeredAt: string
  verifiedAt?: string
  contactPerson: string
  contactRole: string
}

export function SupplierDirectoryWidget() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      
      // Fetch real suppliers from API
      const response = await fetch('/api/suppliers')
      
      if (response.ok) {
        const data = await response.json()
        setSuppliers(data.suppliers || [])
      } else {
        // If API doesn't exist yet, show empty state instead of dummy data
        console.warn('Suppliers API not available')
        setSuppliers([])
        toast({
          title: "Notice",
          description: "Supplier directory is being configured. No suppliers loaded.",
          variant: "default"
        })
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
      setSuppliers([])
      toast({
        title: "Error",
        description: "Failed to load suppliers from database",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApproveSupplier = async (supplierId: string) => {
    try {
      setSuppliers(prev => 
        prev.map(supplier => 
          supplier.id === supplierId 
            ? { ...supplier, status: 'approved', verifiedAt: new Date().toISOString() }
            : supplier
        )
      )
      
      toast({
        title: "Success",
        description: "Supplier approved and verified successfully"
      })
    } catch (error) {
      console.error('Failed to approve supplier:', error)
      toast({
        title: "Error",
        description: "Failed to approve supplier",
        variant: "destructive"
      })
    }
  }

  const handleRejectSupplier = async (supplierId: string) => {
    try {
      setSuppliers(prev => 
        prev.map(supplier => 
          supplier.id === supplierId 
            ? { ...supplier, status: 'rejected' }
            : supplier
        )
      )
      
      toast({
        title: "Success",
        description: "Supplier rejected"
      })
    } catch (error) {
      console.error('Failed to reject supplier:', error)
      toast({
        title: "Error",
        description: "Failed to reject supplier",
        variant: "destructive"
      })
    }
  }

  const handleSendInquiry = async (supplierId: string) => {
    try {
      // Mock sending inquiry
      toast({
        title: "Success",
        description: "Inquiry sent to supplier successfully"
      })
    } catch (error) {
      console.error('Failed to send inquiry:', error)
      toast({
        title: "Error",
        description: "Failed to send inquiry",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "outline" as const, label: "Pending Review", className: "text-yellow-600 border-yellow-600" },
      approved: { variant: "default" as const, label: "Approved", className: "bg-green-600 text-white" },
      rejected: { variant: "destructive" as const, label: "Rejected", className: "" },
      suspended: { variant: "secondary" as const, label: "Suspended", className: "" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <Badge variant={config.variant} className={`text-xs ${config.className}`}>
        {config.label}
      </Badge>
    )
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? "text-yellow-400 fill-yellow-400" 
            : i < rating 
            ? "text-yellow-400 fill-yellow-400/50" 
            : "text-gray-300"
        }`}
      />
    ))
  }

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter
    const matchesCategory = categoryFilter === "all" || supplier.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Supplier Directory</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={fetchSuppliers}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Safety & PPE">Safety & PPE</SelectItem>
                <SelectItem value="Environmental">Environmental</SelectItem>
                <SelectItem value="Logistics">Logistics</SelectItem>
                <SelectItem value="Consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Suppliers List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Suppliers Found</h3>
                <p>No suppliers match your current filters.</p>
              </div>
            ) : (
              filteredSuppliers.map((supplier) => (
                <motion.div
                  key={supplier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-6 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{supplier.name}</h3>
                        {getStatusBadge(supplier.status)}
                        <Badge variant="outline" className="text-xs">
                          {supplier.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-1">
                          {getRatingStars(supplier.rating)}
                          <span className="text-sm text-muted-foreground ml-1">
                            {supplier.rating} ({supplier.reviewCount} reviews)
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{supplier.location}, {supplier.country}</span>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm mb-3">{supplier.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {supplier.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Building className="h-4 w-4" />
                          <span>{supplier.yearsInBusiness} years</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{supplier.employeeCount} employees</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{supplier.inquiries} inquiries</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined {new Date(supplier.registeredAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {supplier.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproveSupplier(supplier.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectSupplier(supplier.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {supplier.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendInquiry(supplier.id)}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingSupplier(supplier)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
