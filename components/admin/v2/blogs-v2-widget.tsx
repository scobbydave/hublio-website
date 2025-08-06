"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Construction } from 'lucide-react'

export function BlogsV2Widget() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <p className="text-muted-foreground">
          Manage AI-generated blog posts and approval workflow
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Blog Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Construction className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">Blog Management Coming Soon</p>
          <p className="text-sm">AI-powered blog creation and approval workflow</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogsV2Widget
