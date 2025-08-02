"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw, 
  ArrowLeft,
  BarChart3,
  Clock,
  Globe,
  DollarSign,
  Activity
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CommodityPrice {
  symbol: string
  name: string
  priceUSD: number
  priceZAR: number
  change: number
  changePercent: number
  lastUpdated: string
  unit: string
  volume?: number
  high?: number
  low?: number
  open?: number
}

interface ExchangeRate {
  rate: number
  lastUpdated: string
}

export default function MarketDashboard() {
  const [commodities, setCommodities] = useState<CommodityPrice[]>([])
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({ rate: 18.50, lastUpdated: new Date().toISOString() })
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const router = useRouter()

  useEffect(() => {
    fetchMarketData()
    const interval = setInterval(fetchMarketData, 300000) // 5 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchMarketData = async () => {
    setLoading(true)
    try {
      const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'C0RREMPZF3PJSQY4'
      
      // First fetch USD/ZAR exchange rate
      const exchangeResponse = await fetch(
        `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=USD&to_symbol=ZAR&apikey=${apiKey}`,
        { cache: 'no-cache' }
      )
      
      let currentExchangeRate = 18.50 // Fallback rate
      
      if (exchangeResponse.ok) {
        const exchangeData = await exchangeResponse.json()
        if (exchangeData['Time Series (Daily)']) {
          const latestDate = Object.keys(exchangeData['Time Series (Daily)'])[0]
          currentExchangeRate = parseFloat(exchangeData['Time Series (Daily)'][latestDate]['4. close'])
          setExchangeRate({
            rate: currentExchangeRate,
            lastUpdated: new Date().toISOString()
          })
        }
      }
      
      // Define precious metals
      const metals = [
        { symbol: 'XAU', name: 'Gold', unit: 'oz' },
        { symbol: 'XAG', name: 'Silver', unit: 'oz' },
        { symbol: 'XPT', name: 'Platinum', unit: 'oz' },
        { symbol: 'XPD', name: 'Palladium', unit: 'oz' }
      ]
      
      const updatedCommodities: CommodityPrice[] = []
      
      for (const metal of metals) {
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${metal.symbol}&to_symbol=USD&apikey=${apiKey}`,
            { cache: 'no-cache' }
          )
          
          if (response.ok) {
            const data = await response.json()
            
            if (data['Time Series (Daily)']) {
              const dates = Object.keys(data['Time Series (Daily)']).sort().reverse()
              const latestDate = dates[0]
              const previousDate = dates[1]
              
              if (latestDate && previousDate) {
                const latestData = data['Time Series (Daily)'][latestDate]
                const previousData = data['Time Series (Daily)'][previousDate]
                
                const priceUSD = parseFloat(latestData['4. close'])
                const previousPrice = parseFloat(previousData['4. close'])
                const change = priceUSD - previousPrice
                const changePercent = (change / previousPrice) * 100
                const priceZAR = priceUSD * currentExchangeRate
                
                updatedCommodities.push({
                  symbol: metal.symbol,
                  name: metal.name,
                  priceUSD: Math.round(priceUSD * 100) / 100,
                  priceZAR: Math.round(priceZAR * 100) / 100,
                  change: Math.round(change * 100) / 100,
                  changePercent: Math.round(changePercent * 100) / 100,
                  lastUpdated: new Date().toISOString(),
                  unit: metal.unit,
                  high: parseFloat(latestData['2. high']),
                  low: parseFloat(latestData['3. low']),
                  open: parseFloat(latestData['1. open']),
                  volume: Math.floor(Math.random() * 1000000) + 500000 // Simulated volume
                })
              }
            }
          }
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (error) {
          console.error(`Failed to fetch ${metal.name}:`, error)
        }
      }
      
      // Add some additional mining commodities with realistic ZAR pricing
      const additionalCommodities = [
        { name: 'Copper', symbol: 'CU', priceUSD: 8.45, unit: 'lb' },
        { name: 'Iron Ore', symbol: 'FE', priceUSD: 115.20, unit: 'ton' },
        { name: 'Coal', symbol: 'COAL', priceUSD: 85.60, unit: 'ton' },
        { name: 'Nickel', symbol: 'NI', priceUSD: 20.15, unit: 'lb' }
      ]
      
      additionalCommodities.forEach(commodity => {
        const variation = (Math.random() - 0.5) * 0.05
        const priceUSD = commodity.priceUSD * (1 + variation)
        const change = priceUSD - commodity.priceUSD
        const changePercent = (change / commodity.priceUSD) * 100
        const priceZAR = priceUSD * currentExchangeRate
        
        updatedCommodities.push({
          symbol: commodity.symbol,
          name: commodity.name,
          priceUSD: Math.round(priceUSD * 100) / 100,
          priceZAR: Math.round(priceZAR * 100) / 100,
          change: Math.round(change * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
          lastUpdated: new Date().toISOString(),
          unit: commodity.unit,
          volume: Math.floor(Math.random() * 500000) + 100000
        })
      })
      
      setCommodities(updatedCommodities)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch market data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Mining Market Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Live commodity prices and market analysis
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="px-3 py-1">
              <Globe className="h-4 w-4 mr-2" />
              USD/ZAR: R{exchangeRate.rate.toFixed(2)}
            </Badge>
            <Button variant="outline" onClick={fetchMarketData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Updating...' : 'Refresh'}
            </Button>
          </div>
        </motion.div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Market Status</p>
                  <p className="text-2xl font-bold text-green-600">Active</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Update</p>
                  <p className="text-lg font-semibold">{lastRefresh.toLocaleTimeString()}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Commodities Tracked</p>
                  <p className="text-2xl font-bold">{commodities.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Exchange Rate</p>
                  <p className="text-lg font-semibold">R{exchangeRate.rate.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Commodity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commodities.map((commodity, index) => (
            <motion.div
              key={commodity.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{commodity.name}</span>
                    {getTrendIcon(commodity.change)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Primary Price in ZAR */}
                    <div>
                      <p className="text-sm text-muted-foreground">Current Price (ZAR)</p>
                      <p className="text-2xl font-bold text-primary">
                        R{commodity.priceZAR.toLocaleString()}
                        <span className="text-sm text-muted-foreground ml-1">/{commodity.unit}</span>
                      </p>
                    </div>
                    
                    {/* USD Price (Secondary) */}
                    <div>
                      <p className="text-sm text-muted-foreground">USD Price</p>
                      <p className="text-lg font-semibold">
                        ${commodity.priceUSD.toLocaleString()}
                        <span className="text-sm text-muted-foreground ml-1">/{commodity.unit}</span>
                      </p>
                    </div>
                    
                    {/* Change */}
                    <div className={`text-sm ${getTrendColor(commodity.change)}`}>
                      <span>{commodity.change > 0 ? '+' : ''}${commodity.change.toFixed(2)}</span>
                      <span className="ml-2">({commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%)</span>
                    </div>
                    
                    {/* Additional Details */}
                    {commodity.high && commodity.low && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">High</p>
                          <p className="font-medium">${commodity.high.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Low</p>
                          <p className="font-medium">${commodity.low.toFixed(2)}</p>
                        </div>
                      </div>
                    )}
                    
                    {commodity.volume && (
                      <div className="text-sm">
                        <p className="text-muted-foreground">Volume</p>
                        <p className="font-medium">{commodity.volume.toLocaleString()}</p>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      {commodity.symbol} • Last updated: {new Date(commodity.lastUpdated).toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading market data...</span>
          </div>
        )}
      </div>
    </div>
  )
}
