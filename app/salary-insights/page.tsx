import React from 'react'
import { Metadata } from 'next'
import { SalaryInsightsPublic } from '@/components/salary/salary-insights-public'

export const metadata: Metadata = {
  title: 'Mining Salary Insights | Hublio',
  description: 'Get accurate salary information for South African mining jobs. Compare salaries by region, experience level, and get career advice.',
  keywords: 'mining salaries, South Africa, career advice, job market, mining jobs',
}

export default function SalaryInsightsPage() {
  return <SalaryInsightsPublic />
}
