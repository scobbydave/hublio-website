'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
}

export default function MiningParticles() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Generate fewer, more subtle particles
    const generateParticles = () => {
      const newParticles: Particle[] = []
      for (let i = 0; i < 8; i++) { // Reduced from 20 to 8
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1, // Smaller particles
          speed: Math.random() * 1 + 0.5, // Slower movement
          opacity: Math.random() * 0.2 + 0.05 // Much more subtle opacity
        })
      }
      setParticles(newParticles)
    }

    generateParticles()

    // Animate particles
    const animateParticles = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          y: particle.y <= -5 ? 105 : particle.y - particle.speed * 0.1,
          x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.1
        }))
      )
    }

    const interval = setInterval(animateParticles, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mining-particles">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="mining-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${particle.id * 0.2}s`
          }}
        />
      ))}
    </div>
  )
}
