"use client"

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CommodityPrice {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  currency: string
}

export function CommodityPriceBar() {
  const [prices, setPrices] = useState<CommodityPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetchCommodityPrices()
    
    // Auto-refresh every 5 minutes
    const refreshInterval = setInterval(fetchCommodityPrices, 300000)
    
    // Rotate through prices every 3 seconds if multiple commodities
    const rotateInterval = setInterval(() => {
      setPrices(prev => {
        if (prev.length > 1) {
          setCurrentIndex(current => (current + 1) % prev.length)
        }
        return prev
      })
    }, 3000)
    
    return () => {
      clearInterval(refreshInterval)
      clearInterval(rotateInterval)
    }
  }, [])

  const fetchCommodityPrices = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/commodity-prices')
      
      if (response.ok) {
        const data = await response.json()
        setPrices(data.prices || [])
      } else {
        // Fallback prices for development/demo
        const fallbackPrices: CommodityPrice[] = [
          {
            symbol: 'GOLD',
            name: 'Gold',
            price: 1985.50,
            change: +12.30,
            changePercent: +0.62,
            currency: 'USD'
          },
          {
            symbol: 'PLAT',
            name: 'Platinum',
            price: 925.40,
            change: -8.75,
            changePercent: -0.94,
            currency: 'USD'
          },
          {
            symbol: 'COAL',
            name: 'Coal',
            price: 142.85,
            change: +2.15,
            changePercent: +1.53,
            currency: 'USD'
          },
          {
            symbol: 'IRON',
            name: 'Iron Ore',
            price: 118.60,
            change: +0.95,
            changePercent: +0.81,
            currency: 'USD'
          }
        ]
        setPrices(fallbackPrices)
      }
    } catch (error) {
      console.error('Error fetching commodity prices:', error)
      setError('Failed to load prices')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading prices...</span>
      </div>
    )
  }

  if (error || prices.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Prices unavailable
        </Badge>
        <Button variant="ghost" size="sm" onClick={fetchCommodityPrices}>
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  const currentPrice = prices[currentIndex]

  return (
    <div className="flex items-center gap-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentPrice.symbol}-${currentIndex}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {currentPrice.name}
          </Badge>
          
          <div className="flex items-center gap-1 text-sm">
            <span className="font-semibold">
              ${currentPrice.price.toFixed(2)}
            </span>
            
            <div className={`flex items-center gap-1 ${
              currentPrice.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentPrice.change >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className="text-xs">
                {currentPrice.change >= 0 ? '+' : ''}
                {currentPrice.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicator dots */}
      {prices.length > 1 && (
        <div className="flex gap-1">
          {prices.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      )}

      <Button variant="ghost" size="sm" onClick={fetchCommodityPrices}>
        <RefreshCw className="h-3 w-3" />
      </Button>
    </div>
  )
}

export default CommodityPriceBar
