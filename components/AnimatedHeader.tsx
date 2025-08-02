'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedHeaderProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function AnimatedHeader({ children, className = '', delay = 0 }: AnimatedHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Subtle sparkle effect for professional use
export function MiningSparkle({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`absolute w-1 h-1 bg-primary/30 rounded-full ${className}`}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 0.5, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay: Math.random() * 4
      }}
    />
  )
}

// Mining section wrapper with entrance animation
export function MiningSection({ 
  children, 
  className = '',
  id 
}: { 
  children: ReactNode
  className?: string
  id?: string 
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`relative mining-gradient-bg ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <MiningSparkle className="top-10 left-10" />
        <MiningSparkle className="top-20 right-20" />
        <MiningSparkle className="bottom-10 left-1/4" />
      </div>
      {children}
    </motion.section>
  )
}
