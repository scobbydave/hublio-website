'use client'

import React from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function VacanciesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-4">Mining Vacancies</h1>
          <p>This is a temporary simplified version to test compilation.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
