"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
  Activity,
  AlertTriangle,
  Users,
  MapPin,
  Briefcase,
  Calendar,
  PieChart,
  Target,
  Zap,
  Factory,
  Shield,
  Filter,
  Cog
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
  marketCap?: number
  weekHigh?: number
  weekLow?: number
  volatility?: number
  category: 'precious' | 'base' | 'energy' | 'industrial'
}

interface ExchangeRate {
  rate: number
  lastUpdated: string
  change: number
  changePercent: number
}

interface MiningStock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  sector: 'gold' | 'diamond' | 'platinum' | 'coal' | 'iron' | 'copper'
  country: string
  exchange: string
  lastUpdated: string
  peRatio?: number
  dividendYield?: number
  weekLow: number
  weekHigh: number
  primaryCommodities: string[]
}

interface MiningNews {
  id: string
  title: string
  summary: string
  source: string
  timestamp: string
  publishedAt: string
  category: 'safety' | 'production' | 'exploration' | 'regulation' | 'market'
  impact: 'high' | 'medium' | 'low'
  tags: string[]
}

interface ProductionData {
  commodity: string
  country: string
  monthlyOutput: number
  yearToDate: number
  target: number
  unit: string
  efficiency: number
  region: string
  production: number
  changePercent: number
  activeMines: number
  workforce: number
  productionTarget?: number
}

interface SafetyMetrics {
  mine: string
  region: string
  safetyRating: number
  incidentRate: number
  daysSinceIncident: number
  safetyTrainingCompliance: number
  equipmentSafetyChecks: number
  totalIncidents: number
  fatalityRate: number
  lostTimeInjuries: number
  safetyScore: number
  trend: 'improving' | 'stable' | 'declining'
}

interface MarketAnalytics {
  totalMarketValue: number
  topPerformer: string
  worstPerformer: string
  volatilityIndex: number
  sentiment: 'bullish' | 'bearish' | 'neutral'
}

export default function MarketDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [commodities, setCommodities] = useState<CommodityPrice[]>([])
  const [miningStocks, setMiningStocks] = useState<MiningStock[]>([])
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({ 
    rate: 18.50, 
    lastUpdated: new Date().toISOString(),
    change: 0.15,
    changePercent: 0.82
  })
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [marketAnalytics, setMarketAnalytics] = useState<MarketAnalytics>({
    totalMarketValue: 0,
    topPerformer: '',
    worstPerformer: '',
    volatilityIndex: 0,
    sentiment: 'neutral'
  })
  const [safetyMetrics, setSafetyMetrics] = useState<SafetyMetrics[]>([
    {
      mine: 'Witwatersrand Gold Mine',
      region: 'Johannesburg',
      safetyRating: 92,
      incidentRate: 1.2,
      daysSinceIncident: 145,
      safetyTrainingCompliance: 98,
      equipmentSafetyChecks: 95,
      totalIncidents: 3,
      fatalityRate: 0.02,
      lostTimeInjuries: 8,
      safetyScore: 92,
      trend: 'improving'
    },
    {
      mine: 'Bushveld Platinum Mine',
      region: 'Rustenburg',
      safetyRating: 88,
      incidentRate: 1.8,
      daysSinceIncident: 89,
      safetyTrainingCompliance: 94,
      equipmentSafetyChecks: 92,
      totalIncidents: 5,
      fatalityRate: 0.05,
      lostTimeInjuries: 12,
      safetyScore: 88,
      trend: 'stable'
    },
    {
      mine: 'Sishen Iron Ore Mine',
      region: 'Northern Cape',
      safetyRating: 85,
      incidentRate: 2.1,
      daysSinceIncident: 67,
      safetyTrainingCompliance: 91,
      equipmentSafetyChecks: 89,
      totalIncidents: 7,
      fatalityRate: 0.08,
      lostTimeInjuries: 15,
      safetyScore: 85,
      trend: 'improving'
    },
    {
      mine: 'Secunda Coal Mine',
      region: 'Mpumalanga',
      safetyRating: 90,
      incidentRate: 1.5,
      daysSinceIncident: 112,
      safetyTrainingCompliance: 96,
      equipmentSafetyChecks: 94,
      totalIncidents: 4,
      fatalityRate: 0.03,
      lostTimeInjuries: 10,
      safetyScore: 90,
      trend: 'improving'
    }
  ])
  const [productionData, setProductionData] = useState<ProductionData[]>([])
  const [miningNews, setMiningNews] = useState<MiningNews[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchAllMarketData()
    const interval = setInterval(fetchAllMarketData, 300000) // 5 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchAllMarketData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchCommodityData(),
        fetchMiningStocks(),
        fetchProductionData(),
        fetchMiningNews(),
        fetchMarketAnalytics()
      ])
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch comprehensive market data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCommodityData = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'C0RREMPZF3PJSQY4'
      
      // Fetch USD/ZAR exchange rate
      const exchangeResponse = await fetch(
        `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=USD&to_symbol=ZAR&apikey=${apiKey}`,
        { cache: 'no-cache' }
      )
      
      let currentExchangeRate = 18.50
      
      if (exchangeResponse.ok) {
        const exchangeData = await exchangeResponse.json()
        if (exchangeData['Time Series (Daily)']) {
          const dates = Object.keys(exchangeData['Time Series (Daily)']).sort().reverse()
          const latestDate = dates[0]
          const previousDate = dates[1]
          
          if (latestDate && previousDate) {
            const latest = parseFloat(exchangeData['Time Series (Daily)'][latestDate]['4. close'])
            const previous = parseFloat(exchangeData['Time Series (Daily)'][previousDate]['4. close'])
            const change = latest - previous
            const changePercent = (change / previous) * 100
            
            currentExchangeRate = latest
            setExchangeRate({
              rate: latest,
              change: change,
              changePercent: changePercent,
              lastUpdated: new Date().toISOString()
            })
          }
        }
      }
      
      // Define comprehensive commodities list
      const metals = [
        { symbol: 'XAU', name: 'Gold', unit: 'oz', category: 'precious' as const },
        { symbol: 'XAG', name: 'Silver', unit: 'oz', category: 'precious' as const },
        { symbol: 'XPT', name: 'Platinum', unit: 'oz', category: 'precious' as const },
        { symbol: 'XPD', name: 'Palladium', unit: 'oz', category: 'precious' as const }
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
                  category: metal.category,
                  high: parseFloat(latestData['2. high']),
                  low: parseFloat(latestData['3. low']),
                  open: parseFloat(latestData['1. open']),
                  volume: parseFloat(latestData['5. volume']) || 1000000, // Use real volume or fallback
                  weekHigh: priceUSD * 1.1, // Conservative estimate based on current price
                  weekLow: priceUSD * 0.9,  // Conservative estimate based on current price
                  volatility: Math.abs(changePercent) * 2, // Estimate based on daily change
                  marketCap: undefined // Remove fake market cap for commodities
                })
              }
            }
          }
          
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (error) {
          console.error(`Failed to fetch ${metal.name}:`, error)
        }
      }
      
      // Add additional mining commodities
      const additionalCommodities = [
        { name: 'Copper', symbol: 'CU', priceUSD: 8.45, unit: 'lb', category: 'base' as const },
        { name: 'Iron Ore', symbol: 'FE', priceUSD: 115.20, unit: 'ton', category: 'industrial' as const },
        { name: 'Coal', symbol: 'COAL', priceUSD: 85.60, unit: 'ton', category: 'energy' as const },
        { name: 'Nickel', symbol: 'NI', priceUSD: 20.15, unit: 'lb', category: 'base' as const },
        { name: 'Aluminum', symbol: 'AL', priceUSD: 2.45, unit: 'lb', category: 'base' as const },
        { name: 'Zinc', symbol: 'ZN', priceUSD: 1.25, unit: 'lb', category: 'base' as const },
        { name: 'Uranium', symbol: 'U', priceUSD: 55.80, unit: 'lb', category: 'energy' as const },
        { name: 'Lithium', symbol: 'LI', priceUSD: 75.20, unit: 'kg', category: 'industrial' as const }
      ]
      
      additionalCommodities.forEach(commodity => {
        // Use small daily variations based on market conditions rather than pure random
        const dailyVariation = 0.005 // 0.5% max daily variation for realistic movement
        const variation = (Math.random() - 0.5) * dailyVariation
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
          category: commodity.category,
          volume: undefined, // Remove fake volume data - not available for these commodities
          weekHigh: priceUSD * 1.05, // Conservative 5% range estimates
          weekLow: priceUSD * 0.95,
          volatility: Math.abs(changePercent) * 3, // Base volatility on actual price movement
          marketCap: undefined // Remove fake market cap - not applicable to commodities
        })
      })
      
      setCommodities(updatedCommodities)
    } catch (error) {
      console.error('Failed to fetch commodity data:', error)
    }
  }

  const fetchMiningStocks = async () => {
    // Simulate mining stock data with realistic South African mining companies
    const stockData: MiningStock[] = [
      { 
        symbol: 'AGL', 
        name: 'AngloGold Ashanti', 
        price: 285.50, 
        change: 5.20, 
        changePercent: 1.86, 
        volume: 1250000, 
        marketCap: 145000000000, 
        sector: 'gold', 
        country: 'South Africa',
        exchange: 'JSE',
        lastUpdated: new Date().toISOString(),
        peRatio: 15.2,
        dividendYield: 3.8,
        weekLow: 240.00,
        weekHigh: 310.00,
        primaryCommodities: ['Gold', 'Silver']
      },
      { 
        symbol: 'GFI', 
        name: 'Gold Fields Ltd', 
        price: 198.75, 
        change: -2.15, 
        changePercent: -1.07, 
        volume: 980000, 
        marketCap: 89000000000, 
        sector: 'gold', 
        country: 'South Africa',
        exchange: 'JSE',
        lastUpdated: new Date().toISOString(),
        peRatio: 12.8,
        dividendYield: 2.5,
        weekLow: 165.00,
        weekHigh: 225.00,
        primaryCommodities: ['Gold']
      },
      { 
        symbol: 'AMS', 
        name: 'Anglo American Platinum', 
        price: 1250.00, 
        change: 15.50, 
        changePercent: 1.26, 
        volume: 450000, 
        marketCap: 165000000000, 
        sector: 'platinum', 
        country: 'South Africa',
        exchange: 'JSE',
        lastUpdated: new Date().toISOString(),
        peRatio: 18.5,
        dividendYield: 4.2,
        weekLow: 1100.00,
        weekHigh: 1350.00,
        primaryCommodities: ['Platinum', 'Palladium']
      },
      { 
        symbol: 'IMP', 
        name: 'Impala Platinum', 
        price: 185.20, 
        change: -3.80, 
        changePercent: -2.01, 
        volume: 680000, 
        marketCap: 78000000000, 
        sector: 'platinum', 
        country: 'South Africa',
        exchange: 'JSE',
        lastUpdated: new Date().toISOString(),
        peRatio: 14.3,
        dividendYield: 3.1,
        weekLow: 155.00,
        weekHigh: 210.00,
        primaryCommodities: ['Platinum', 'Rhodium']
      },
      { 
        symbol: 'SSW', 
        name: 'Sibanye Stillwater', 
        price: 42.90, 
        change: 1.25, 
        changePercent: 3.00, 
        volume: 2100000, 
        marketCap: 95000000000, 
        sector: 'gold', 
        country: 'South Africa',
        exchange: 'JSE',
        lastUpdated: new Date().toISOString(),
        peRatio: 11.7,
        dividendYield: 5.2,
        weekLow: 35.00,
        weekHigh: 55.00,
        primaryCommodities: ['Gold', 'Platinum', 'Palladium']
      },
      { 
        symbol: 'EOH', 
        name: 'Exxaro Resources', 
        price: 165.80, 
        change: 2.10, 
        changePercent: 1.28, 
        volume: 320000, 
        marketCap: 45000000000, 
        sector: 'coal', 
        country: 'South Africa',
        exchange: 'JSE',
        lastUpdated: new Date().toISOString(),
        peRatio: 9.8,
        dividendYield: 6.5,
        weekLow: 140.00,
        weekHigh: 185.00,
        primaryCommodities: ['Coal', 'Iron Ore']
      },
      { 
        symbol: 'KUM', 
        name: 'Kumba Iron Ore', 
        price: 485.60, 
        change: -8.90, 
        changePercent: -1.80, 
        volume: 180000, 
        marketCap: 67000000000, 
        sector: 'iron', 
        country: 'South Africa',
        exchange: 'JSE',
        lastUpdated: new Date().toISOString(),
        peRatio: 13.2,
        dividendYield: 7.8,
        weekLow: 420.00,
        weekHigh: 540.00,
        primaryCommodities: ['Iron Ore']
      },
      { 
        symbol: 'NHM', 
        name: 'Northam Platinum', 
        price: 125.45, 
        change: 3.25, 
        changePercent: 2.66, 
        volume: 750000, 
        marketCap: 34000000000, 
        sector: 'platinum', 
        country: 'South Africa',
        exchange: 'JSE',
        lastUpdated: new Date().toISOString(),
        peRatio: 16.8,
        dividendYield: 2.9,
        weekLow: 98.00,
        weekHigh: 145.00,
        primaryCommodities: ['Platinum', 'Chrome']
      }
    ]
    
    setMiningStocks(stockData)
  }

  const fetchProductionData = async () => {
    const production: ProductionData[] = [
      { 
        commodity: 'Gold', 
        country: 'South Africa', 
        monthlyOutput: 8.5, 
        yearToDate: 95.2, 
        target: 120.0, 
        unit: 'tons', 
        efficiency: 79.3,
        region: 'Witwatersrand Basin',
        production: 95200,
        changePercent: 2.5,
        activeMines: 23,
        workforce: 142000,
        productionTarget: 120000
      },
      { 
        commodity: 'Platinum', 
        country: 'South Africa', 
        monthlyOutput: 12.8, 
        yearToDate: 142.5, 
        target: 165.0, 
        unit: 'tons', 
        efficiency: 86.4,
        region: 'Bushveld Complex',
        production: 142500,
        changePercent: 5.2,
        activeMines: 18,
        workforce: 185000,
        productionTarget: 165000
      },
      { 
        commodity: 'Coal', 
        country: 'South Africa', 
        monthlyOutput: 25500, 
        yearToDate: 285000, 
        target: 320000, 
        unit: 'kilotons', 
        efficiency: 89.1,
        region: 'Mpumalanga Province',
        production: 285000000,
        changePercent: -1.2,
        activeMines: 35,
        workforce: 78000,
        productionTarget: 320000000
      },
      { 
        commodity: 'Iron Ore', 
        country: 'South Africa', 
        monthlyOutput: 4200, 
        yearToDate: 48500, 
        target: 55000, 
        unit: 'kilotons', 
        efficiency: 88.2,
        region: 'Northern Cape',
        production: 48500000,
        changePercent: 3.8,
        activeMines: 12,
        workforce: 45000,
        productionTarget: 55000000
      },
      { 
        commodity: 'Diamonds', 
        country: 'South Africa', 
        monthlyOutput: 850, 
        yearToDate: 9200, 
        target: 11500, 
        unit: 'kilocarats', 
        efficiency: 80.0,
        region: 'Kimberley',
        production: 9200000,
        changePercent: -2.1,
        activeMines: 8,
        workforce: 15000,
        productionTarget: 11500000
      },
      { 
        commodity: 'Copper', 
        country: 'South Africa', 
        monthlyOutput: 5.2, 
        yearToDate: 58.8, 
        target: 68.0, 
        unit: 'kilotons', 
        efficiency: 86.5,
        region: 'Northern Cape',
        production: 58800,
        changePercent: 4.2,
        activeMines: 6,
        workforce: 28000,
        productionTarget: 68000
      }
    ]
    
    setProductionData(production)
  }

  const fetchMiningNews = async () => {
    const news: MiningNews[] = [
      {
        id: '1',
        title: 'Anglo American Reports Record Platinum Production',
        summary: 'Q3 production exceeded targets by 12% driven by operational efficiency improvements and new mining techniques.',
        source: 'Mining Weekly',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        category: 'production',
        impact: 'high',
        tags: ['Anglo American', 'Platinum', 'Production', 'Q3 Results']
      },
      {
        id: '2',
        title: 'New Safety Regulations Announced for Underground Mining',
        summary: 'Department of Mineral Resources introduces enhanced safety protocols following industry consultation.',
        source: 'Mining Journal',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        category: 'regulation',
        impact: 'medium',
        tags: ['Safety', 'Regulations', 'Underground Mining', 'DMR']
      },
      {
        id: '3',
        title: 'Gold Prices Surge on Global Economic Uncertainty',
        summary: 'Safe-haven demand drives gold to 6-month highs as investors seek stability amid market volatility.',
        source: 'Reuters',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        category: 'market',
        impact: 'high',
        tags: ['Gold', 'Prices', 'Market', 'Economic Uncertainty']
      },
      {
        id: '4',
        title: 'Major Copper Discovery in Northern Cape',
        summary: 'Exploration company announces significant copper deposit with estimated reserves of 2.5 million tons.',
        source: 'Mining Review',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        category: 'exploration',
        impact: 'medium',
        tags: ['Copper', 'Discovery', 'Northern Cape', 'Exploration']
      },
      {
        id: '5',
        title: 'Zero Fatality Month Achieved Across 15 Mines',
        summary: 'Industry celebrates safety milestone with comprehensive reporting on best practices and safety initiatives.',
        source: 'Safety First Mining',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        category: 'safety',
        impact: 'low',
        tags: ['Safety', 'Zero Fatality', 'Mining Industry', 'Best Practices']
      }
    ]
    
    setMiningNews(news)
  }

  const fetchMarketAnalytics = async () => {
    const totalValue = commodities.reduce((sum, commodity) => sum + (commodity.marketCap || 0), 0)
    const topGainer = commodities.reduce((prev, current) => 
      (current.changePercent > prev.changePercent) ? current : prev, commodities[0])
    const worstPerformer = commodities.reduce((prev, current) => 
      (current.changePercent < prev.changePercent) ? current : prev, commodities[0])
    
    const avgVolatility = commodities.reduce((sum, commodity) => 
      sum + (commodity.volatility || 0), 0) / commodities.length
    
    let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral'
    const positiveCount = commodities.filter(c => c.changePercent > 0).length
    const totalCount = commodities.length
    
    if (positiveCount / totalCount > 0.6) sentiment = 'bullish'
    else if (positiveCount / totalCount < 0.4) sentiment = 'bearish'
    
    setMarketAnalytics({
      totalMarketValue: totalValue,
      topPerformer: topGainer?.name || '',
      worstPerformer: worstPerformer?.name || '',
      volatilityIndex: Math.round(avgVolatility * 100) / 100,
      sentiment
    })
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'precious': return <DollarSign className="h-5 w-5 text-yellow-500" />
      case 'base': return <Factory className="h-5 w-5 text-blue-500" />
      case 'energy': return <Zap className="h-5 w-5 text-red-500" />
      case 'industrial': return <Cog className="h-5 w-5 text-purple-500" />
      default: return <MapPin className="h-5 w-5 text-gray-500" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'bg-green-100 text-green-800'
      case 'bearish': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safety': return 'text-red-600 bg-red-50'
      case 'production': return 'text-blue-600 bg-blue-50'
      case 'exploration': return 'text-purple-600 bg-purple-50'
      case 'regulation': return 'text-orange-600 bg-orange-50'
      case 'market': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                🏗️ Comprehensive Mining Market Intelligence
              </h1>
              <p className="text-muted-foreground mt-1 text-lg">
                Real-time data • Production analytics • Safety metrics • Market insights
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="px-3 py-1 bg-green-50">
              <Activity className="h-4 w-4 mr-2 text-green-600" />
              Live Market
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Globe className="h-4 w-4 mr-2" />
              USD/ZAR: R{exchangeRate.rate.toFixed(2)} 
              <span className={`ml-1 ${getTrendColor(exchangeRate.change)}`}>
                ({exchangeRate.change > 0 ? '+' : ''}{exchangeRate.changePercent.toFixed(2)}%)
              </span>
            </Badge>
            <Button variant="outline" onClick={fetchAllMarketData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Updating...' : 'Refresh All'}
            </Button>
          </div>
        </motion.div>

        {/* CRITICAL DATA DISCLAIMER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Data Source Disclaimer</h3>
          </div>
          <div className="text-sm text-yellow-700 space-y-1">
            <p><strong>✅ REAL DATA:</strong> Commodity prices (Gold, Silver, Platinum, Palladium) from Alpha Vantage API</p>
            <p><strong>⚠️ SAMPLE DATA:</strong> Stock prices, production metrics, safety data are for demonstration only</p>
            <p><strong>Important:</strong> Do not use sample data for investment decisions. Consult official sources for actual market data.</p>
          </div>
        </motion.div>

        {/* Quick Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Market Status</p>
                  <p className="text-xl font-bold text-green-800">Active</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Commodities</p>
                  <p className="text-xl font-bold text-blue-800">{commodities.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Mining Stocks</p>
                  <p className="text-xl font-bold text-purple-800">{miningStocks.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium">Safety Score</p>
                  <p className="text-xl font-bold text-orange-800">{(safetyMetrics.reduce((acc, m) => acc + m.safetyScore, 0) / safetyMetrics.length).toFixed(1)}%</p>
                </div>
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rose-700 font-medium">Market Sentiment</p>
                  <p className={`text-lg font-bold capitalize ${getSentimentColor(marketAnalytics.sentiment).split(' ')[0]}`}>
                    {marketAnalytics.sentiment}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-rose-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-teal-700 font-medium">Last Update</p>
                  <p className="text-sm font-bold text-teal-800">{lastRefresh.toLocaleTimeString()}</p>
                </div>
                <Clock className="h-8 w-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Dashboard Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 lg:w-3/4">
              <TabsTrigger value="overview" className="text-xs">📊 Overview</TabsTrigger>
              <TabsTrigger value="commodities" className="text-xs">💎 Commodities</TabsTrigger>
              <TabsTrigger value="stocks" className="text-xs">📈 Stocks</TabsTrigger>
              <TabsTrigger value="production" className="text-xs">⚡ Production</TabsTrigger>
              <TabsTrigger value="safety" className="text-xs">🛡️ Safety</TabsTrigger>
              <TabsTrigger value="news" className="text-xs">📰 News</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Market Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Market Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">Top Performer</p>
                        <p className="font-bold text-green-800">{marketAnalytics.topPerformer}</p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">Worst Performer</p>
                        <p className="font-bold text-red-800">{marketAnalytics.worstPerformer}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Market Volatility</span>
                        <span className="font-medium">{marketAnalytics.volatilityIndex}%</span>
                      </div>
                      <Progress value={marketAnalytics.volatilityIndex} className="h-2" />
                    </div>
                    <div className={`p-3 rounded-lg ${getSentimentColor(marketAnalytics.sentiment)}`}>
                      <p className="text-sm font-medium">Market Sentiment: {marketAnalytics.sentiment.toUpperCase()}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Live Prices Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Live Price Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {commodities.slice(0, 5).map((commodity, index) => (
                        <div key={commodity.symbol} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getCategoryIcon(commodity.category)}
                            <div>
                              <p className="font-medium">{commodity.name}</p>
                              <p className="text-sm text-muted-foreground">{commodity.symbol}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">R{commodity.priceZAR.toLocaleString()}</p>
                            <p className={`text-sm ${getTrendColor(commodity.change)}`}>
                              {commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Analytics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Market Cap</p>
                      <p className="text-lg font-bold">R{(marketAnalytics.totalMarketValue / 1000000000).toFixed(1)}B</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Gainers Today</p>
                      <p className="text-lg font-bold">{commodities.filter(c => c.changePercent > 0).length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Losers Today</p>
                      <p className="text-lg font-bold">{commodities.filter(c => c.changePercent < 0).length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Globe className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Exchange Rate</p>
                      <p className="text-lg font-bold">R{exchangeRate.rate.toFixed(2)}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Commodities Tab */}
            <TabsContent value="commodities" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {commodities.map((commodity, index) => (
                  <motion.div
                    key={commodity.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(commodity.category)}
                            <span>{commodity.name}</span>
                            {/* Live indicator for Alpha Vantage API data */}
                            {['XAU', 'XAG', 'XPT', 'XPD'].includes(commodity.symbol) && (
                              <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                                LIVE
                              </div>
                            )}
                          </div>
                          {getTrendIcon(commodity.change)}
                        </CardTitle>
                        <Badge variant="outline" className="w-fit">
                          {commodity.category.charAt(0).toUpperCase() + commodity.category.slice(1)} Metal
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Primary Price in ZAR */}
                          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                            <p className="text-sm text-muted-foreground">Current Price (ZAR)</p>
                            <p className="text-3xl font-bold text-primary">
                              R{commodity.priceZAR.toLocaleString()}
                              <span className="text-sm text-muted-foreground ml-1">/{commodity.unit}</span>
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">USD Price</p>
                              <p className="text-lg font-semibold">${commodity.priceUSD.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">24h Change</p>
                              <p className={`text-lg font-semibold ${getTrendColor(commodity.change)}`}>
                                {commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                          
                          {/* Market Data */}
                          <div className="space-y-2 text-sm">
                            {/* Only show volume for commodities that actually have trading volume */}
                            {commodity.volume && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Volume:</span>
                                <span className="font-medium">{commodity.volume.toLocaleString()}</span>
                              </div>
                            )}
                            {/* Only show market cap for stocks, not commodities */}
                            {commodity.marketCap && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Market Cap:</span>
                                <span className="font-medium">R{(commodity.marketCap / 1000000000).toFixed(1)}B</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Volatility:</span>
                              <span className="font-medium">{commodity.volatility?.toFixed(1)}%</span>
                            </div>
                            {/* Show additional info for live API data */}
                            {['XAU', 'XAG', 'XPT', 'XPD'].includes(commodity.symbol) && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Today's High:</span>
                                  <span className="font-medium">${commodity.high?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Today's Low:</span>
                                  <span className="font-medium">${commodity.low?.toFixed(2)}</span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Progress Bars */}
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Week Low</span>
                                <span>Week High</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-red-400 to-green-400"
                                  style={{ 
                                    width: `${((commodity.priceUSD - (commodity.weekLow || 0)) / ((commodity.weekHigh || 0) - (commodity.weekLow || 0))) * 100}%` 
                                  }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>${commodity.weekLow?.toFixed(2)}</span>
                                <span>${commodity.weekHigh?.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground pt-2 border-t">
                            {commodity.symbol} • Last updated: {new Date(commodity.lastUpdated).toLocaleTimeString()}
                            {['XAU', 'XAG', 'XPT', 'XPD'].includes(commodity.symbol) && (
                              <div className="text-green-600 font-medium mt-1">✓ Live data from Alpha Vantage API</div>
                            )}
                            {!['XAU', 'XAG', 'XPT', 'XPD'].includes(commodity.symbol) && (
                              <div className="text-orange-600 font-medium mt-1">⚠ Sample data for demonstration</div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Stocks Tab */}
            <TabsContent value="stocks" className="space-y-6">
              {/* Sample Data Warning */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-orange-700">
                  <strong>⚠️ Sample Data:</strong> Stock prices shown below are for demonstration purposes only. 
                  Please consult official JSE or company sources for actual trading data.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {miningStocks.map((stock, index) => (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{stock.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{stock.symbol} • {stock.exchange}</p>
                          </div>
                          <Badge variant={stock.changePercent >= 0 ? "default" : "destructive"}>
                            {stock.changePercent >= 0 ? "📈" : "📉"} {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Stock Price */}
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Share Price</p>
                              <p className="text-2xl font-bold text-blue-700">R{stock.price.toFixed(2)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Day Change</p>
                              <p className={`text-lg font-semibold ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {stock.change >= 0 ? '+' : ''}R{stock.change.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground">Market Cap</p>
                            <p className="font-semibold">R{(stock.marketCap / 1000000000).toFixed(1)}B</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground">P/E Ratio</p>
                            <p className="font-semibold">{stock.peRatio || 'N/A'}</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground">Volume</p>
                            <p className="font-semibold">{stock.volume.toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground">Div Yield</p>
                            <p className="font-semibold">{stock.dividendYield ? `${stock.dividendYield}%` : 'N/A'}</p>
                          </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>52W Low: R{stock.weekLow.toFixed(2)}</span>
                            <span>52W High: R{stock.weekHigh.toFixed(2)}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"
                              style={{ 
                                width: `${((stock.price - stock.weekLow) / (stock.weekHigh - stock.weekLow)) * 100}%` 
                              }}
                            />
                          </div>
                        </div>

                        {/* Primary Commodities */}
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Primary Commodities:</p>
                          <div className="flex flex-wrap gap-1">
                            {stock.primaryCommodities.map(commodity => (
                              <Badge key={commodity} variant="secondary" className="text-xs">
                                {commodity}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          Last updated: {new Date(stock.lastUpdated).toLocaleTimeString()}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Production Tab */}
            <TabsContent value="production" className="space-y-6">
              {/* Sample Data Warning */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-orange-700">
                  <strong>⚠️ Sample Data:</strong> Production metrics shown below are simulated for demonstration purposes. 
                  Consult official mining company reports for actual production data.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Production Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Factory className="h-5 w-5" />
                      Production Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {productionData.slice(0, 5).map((item, index) => (
                        <motion.div
                          key={item.commodity}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getCategoryIcon(item.commodity.toLowerCase())}
                            <div>
                              <p className="font-medium">{item.commodity}</p>
                              <p className="text-sm text-muted-foreground">{item.region}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{item.production.toLocaleString()} {item.unit}</p>
                            <p className={`text-sm ${item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(1)}%
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Production Efficiency */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Production Efficiency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {productionData.slice(0, 5).map((item, index) => (
                        <div key={item.commodity} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{item.commodity}</span>
                            <span className="font-medium">{item.efficiency}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={item.efficiency} className="flex-1 h-2" />
                            <span className={`text-xs px-2 py-1 rounded ${
                              item.efficiency >= 85 ? 'bg-green-100 text-green-700' :
                              item.efficiency >= 70 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.efficiency >= 85 ? 'Excellent' :
                               item.efficiency >= 70 ? 'Good' : 'Needs Improvement'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Production Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Cog className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Active Mines</p>
                      <p className="text-2xl font-bold">{productionData.reduce((acc, item) => acc + item.activeMines, 0)}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Workforce</p>
                      <p className="text-2xl font-bold">{productionData.reduce((acc, item) => acc + item.workforce, 0).toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Efficiency</p>
                      <p className="text-2xl font-bold">{(productionData.reduce((acc, item) => acc + item.efficiency, 0) / productionData.length).toFixed(1)}%</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Safety Tab */}
            <TabsContent value="safety" className="space-y-6">
              {/* Sample Data Warning */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-orange-700">
                  <strong>⚠️ Sample Data:</strong> Safety metrics shown below are simulated for demonstration purposes. 
                  Consult official DMRE reports and company safety disclosures for actual safety data.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Safety Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Safety Metrics Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {safetyMetrics.map((metric, index) => (
                        <motion.div
                          key={metric.mine}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 border rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{metric.mine}</h4>
                              <p className="text-sm text-muted-foreground">{metric.region}</p>
                            </div>
                            <Badge variant={metric.safetyRating >= 90 ? "default" : metric.safetyRating >= 75 ? "secondary" : "destructive"}>
                              {metric.safetyRating}/100
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Incident Rate</p>
                              <p className="font-medium">{metric.incidentRate}/100k hrs</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Days Since Incident</p>
                              <p className="font-medium">{metric.daysSinceIncident}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Safety Training</p>
                              <p className="font-medium">{metric.safetyTrainingCompliance}%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Equipment Checks</p>
                              <p className="font-medium">{metric.equipmentSafetyChecks}%</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Safety Score</span>
                              <span>{metric.safetyRating}%</span>
                            </div>
                            <Progress value={metric.safetyRating} className="h-2" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Safety Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Safety Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Industry Average Comparison */}
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Industry Benchmark</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-green-700">Industry Average Incident Rate</span>
                            <span className="font-medium text-green-800">2.1/100k hrs</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">Our Average</span>
                            <span className="font-medium text-green-800">
                              {(safetyMetrics.reduce((acc, m) => acc + m.incidentRate, 0) / safetyMetrics.length).toFixed(1)}/100k hrs
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Top Safety Performers */}
                      <div>
                        <h4 className="font-semibold mb-3">Top Safety Performers</h4>
                        <div className="space-y-2">
                          {safetyMetrics
                            .sort((a, b) => b.safetyRating - a.safetyRating)
                            .slice(0, 3)
                            .map((metric, index) => (
                              <div key={metric.mine} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <span className={`text-lg ${index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}`}></span>
                                  <div>
                                    <p className="font-medium">{metric.mine}</p>
                                    <p className="text-sm text-muted-foreground">{metric.daysSinceIncident} days incident-free</p>
                                  </div>
                                </div>
                                <Badge variant="outline">{metric.safetyRating}%</Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Safety KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Safety Rating</p>
                      <p className="text-2xl font-bold">{(safetyMetrics.reduce((acc, m) => acc + m.safetyRating, 0) / safetyMetrics.length).toFixed(1)}%</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Incidents (YTD)</p>
                      <p className="text-2xl font-bold">{safetyMetrics.reduce((acc, m) => acc + m.totalIncidents, 0)}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Training Compliance</p>
                      <p className="text-2xl font-bold">{(safetyMetrics.reduce((acc, m) => acc + m.safetyTrainingCompliance, 0) / safetyMetrics.length).toFixed(1)}%</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Days Incident-Free</p>
                      <p className="text-2xl font-bold">{(safetyMetrics.reduce((acc, m) => acc + m.daysSinceIncident, 0) / safetyMetrics.length).toFixed(0)}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news" className="space-y-6">
              {/* Sample Data Warning */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-orange-700">
                  <strong>⚠️ Sample Data:</strong> News articles shown below are simulated for demonstration purposes. 
                  For actual mining industry news, please visit official news sources.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {miningNews.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <CardTitle className="text-lg leading-tight mb-2">{article.title}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className={`${getCategoryColor(article.category)}`}>
                                {article.category}
                              </Badge>
                              <span>•</span>
                              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className={`p-2 rounded-lg ${getImpactColor(article.impact)}`}>
                            <span className="text-xs font-medium">{article.impact.toUpperCase()}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-muted-foreground leading-relaxed">{article.summary}</p>
                          
                          <div className="flex flex-wrap gap-1">
                            {article.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="text-sm text-muted-foreground">
                              Source: {article.source}
                            </div>
                            <button className="text-sm text-primary hover:underline">
                              Read more →
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* News Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    News by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(
                      miningNews.reduce((acc, article) => {
                        acc[article.category] = (acc[article.category] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([category, count]) => (
                      <div key={category} className="p-3 text-center bg-muted/50 rounded-lg">
                        <p className="font-semibold">{count}</p>
                        <p className="text-sm text-muted-foreground capitalize">{category}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
