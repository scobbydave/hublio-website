'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface Section {
  id: string
  name: string
  emoji: string
}

const sections: Section[] = [
  { id: 'hero', name: 'Home', emoji: '' },
  { id: 'features', name: 'Services', emoji: '' },
  { id: 'blog', name: 'News', emoji: '' },
  { id: 'contact', name: 'Contact', emoji: '' }
]

export default function MiningElevator() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const pathname = usePathname()

  useEffect(() => {
    // Only show elevator on home page
    if (pathname !== '/') {
      setIsVisible(false)
      return
    }

    const handleScroll = () => {
      // Show elevator after scrolling down a bit
      setIsVisible(window.scrollY > 300)

      // Determine active section
      const currentSections = sections.map(section => {
        const element = document.getElementById(section.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          return {
            id: section.id,
            top: rect.top,
            height: rect.height,
            inView: rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2
          }
        }
        return null
      }).filter(Boolean)

      const active = currentSections.find(section => section?.inView)
      if (active) {
        setActiveSection(active.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50"
        >
          <div className="bg-gradient-to-b from-primary/20 to-primary/10 rounded-lg p-3 shadow-lg backdrop-blur-sm border border-primary/20">
            {/* Section navigation */}
            <div className="space-y-2">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                    activeSection === section.id 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'bg-background/50 text-muted-foreground hover:bg-background/80 hover:text-foreground'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={section.name}
                >
                  <span>{section.name.charAt(0)}</span>
                </motion.button>
              ))}
            </div>

            {/* Active section indicator */}
            <motion.div
              className="absolute left-1 top-3 w-1 h-10 bg-primary/60 rounded-full"
              animate={{
                y: sections.findIndex(s => s.id === activeSection) * 48
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
