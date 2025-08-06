"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Construction } from 'lucide-react'

export function SupplierV2Widget() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Supplier Directory</h2>
        <p className="text-muted-foreground">
          Manage supplier profiles and AI-generated email responses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Suppliers
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Construction className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">Supplier Management Coming Soon</p>
          <p className="text-sm">AI-powered supplier communication and directory management</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SupplierV2Widget
