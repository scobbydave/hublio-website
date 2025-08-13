import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, RefreshCw, Plus, Lightbulb, Calendar, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface SafetyTip {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  isAIGenerated: boolean
}

export function AITipsManagementWidget() {
  const [tips, setTips] = useState<SafetyTip[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchTips()
  }, [])

  const fetchTips = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ai/safety-tips')
      if (response.ok) {
        const data = await response.json()
        setTips(data)
      } else {
        throw new Error('Failed to fetch tips')
      }
    } catch (error) {
      console.error('Error fetching safety tips:', error)
      toast.error('Failed to load safety tips')
    } finally {
      setLoading(false)
    }
  }

  const generateNewTips = async () => {
    try {
      setGenerating(true)
      const response = await fetch('/api/ai/safety-tips', {
        method: 'POST',
      })
      
      if (response.ok) {
        const result = await response.json()
        toast.success(result.message)
        fetchTips() // Refresh the list
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to generate tips')
      }
    } catch (error) {
      console.error('Error generating tips:', error)
      toast.error('Failed to generate new safety tips')
    } finally {
      setGenerating(false)
    }
  }

  const deleteTip = async (tipId: string) => {
    try {
      const response = await fetch(`/api/ai/safety-tips?id=${tipId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setTips(tips.filter(tip => tip.id !== tipId))
        toast.success('Safety tip deleted successfully')
      } else {
        throw new Error('Failed to delete tip')
      }
    } catch (error) {
      console.error('Error deleting tip:', error)
      toast.error('Failed to delete safety tip')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Safety Tips Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI Safety Tips Management
          <Badge variant="outline" className="ml-2">
            {tips.length} Tips
          </Badge>
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            onClick={fetchTips} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button 
            onClick={generateNewTips} 
            size="sm"
            disabled={generating}
          >
            {generating ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-1" />
            )}
            Generate New Tips
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {tips.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No AI-generated safety tips yet.</p>
            <Button onClick={generateNewTips} className="mt-4" disabled={generating}>
              {generating ? 'Generating...' : 'Generate First Tips'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {tips.map((tip) => (
              <div 
                key={tip.id} 
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm line-clamp-1">{tip.title}</h4>
                  <Button
                    onClick={() => deleteTip(tip.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {tip.content}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(tip.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(tip.createdAt).toLocaleTimeString()}
                  </div>
                  {tip.isAIGenerated && (
                    <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">
                      AI Generated
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
