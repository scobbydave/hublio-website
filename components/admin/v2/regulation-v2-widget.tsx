"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Construction } from 'lucide-react'

export function RegulationV2Widget() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Regulation Hub Management</h2>
        <p className="text-muted-foreground">
          Manage compliance tips, FAQs, and regulation content
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Regulation Content
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Construction className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">Regulation Management Coming Soon</p>
          <p className="text-sm">AI-powered compliance content and approval workflow</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegulationV2Widget
