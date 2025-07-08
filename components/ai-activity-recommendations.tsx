"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Calendar,
  Loader2,
  RefreshCw,
  Settings,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Zap,
  Target,
} from "lucide-react"

interface AIRecommendation {
  title: string
  category: string
  description: string
  reasoning: string
  suitabilityScore: number
  weatherCompatibility: string
  timeOfDay: string
  duration: string
  priceRange: string
  tags: string[]
  isEventBased: boolean
  eventId?: string
}

interface AIRecommendationsResponse {
  recommendations: AIRecommendation[]
  weatherSummary: string
  locationInsights: string
  overallRecommendation: string
}

interface AIActivityRecommendationsProps {
  weather: any
  location: string
  userPreferences: any
  onPreferencesClick: () => void
}

export function AIActivityRecommendations({
  weather,
  location,
  userPreferences,
  onPreferencesClick,
}: AIActivityRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendationsResponse | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchRecommendations = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch local events first
      const eventsResponse = await fetch(`/api/events?city=${encodeURIComponent(location)}`)
      const eventsData = await eventsResponse.json()
      setEvents(eventsData.events || [])

      // Generate AI recommendations using Anthropic
      const recommendationsResponse = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weather,
          location,
          events: eventsData.events || [],
          userPreferences,
        }),
      })

      if (!recommendationsResponse.ok) {
        throw new Error("Failed to fetch recommendations from Anthropic AI")
      }

      const recommendationsData = await recommendationsResponse.json()
      setRecommendations(recommendationsData)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch AI recommendations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (weather && location) {
      fetchRecommendations()
    }
  }, [weather, location, userPreferences])

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      "Outdoor Adventure": "🏔️",
      "Indoor Activity": "🏠",
      "Cultural Event": "🎭",
      "Food & Dining": "🍽️",
      Wellness: "🧘",
      Entertainment: "🎬",
    }
    return icons[category] || "✨"
  }

  const getCompatibilityColor = (compatibility: string) => {
    const colors = {
      Perfect: "text-green-600 bg-green-50 border-green-200",
      Good: "text-blue-600 bg-blue-50 border-blue-200",
      Fair: "text-yellow-600 bg-yellow-50 border-yellow-200",
      Poor: "text-red-600 bg-red-50 border-red-200",
    }
    return colors[compatibility as keyof typeof colors] || "text-gray-600 bg-gray-50 border-gray-200"
  }

  const getSuitabilityColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-blue-600"
    if (score >= 4) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="relative">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mr-3" />
              <Brain className="absolute -top-1 -right-1 h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-800">Anthropic AI Analyzing...</h3>
              <p className="text-sm text-purple-600">
                Claude is processing weather data, local events, and your preferences
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-purple-500">
            <Zap className="h-3 w-3" />
            <span>Powered by Anthropic Claude</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
              <Button
                size="sm"
                onClick={fetchRecommendations}
                variant="outline"
                className="border-red-300 bg-transparent"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry with Claude
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!recommendations) return null

  return (
    <div className="space-y-6">
      {/* Anthropic AI Insights Header */}
      <Card className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Claude AI Recommendations
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={onPreferencesClick} className="ml-auto bg-white/50">
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </Button>
          </CardTitle>
          {lastUpdated && (
            <p className="text-xs text-purple-600 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </CardHeader>
        {/* <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/60 p-3 rounded-lg border border-purple-100">
                <h4 className="font-semibold text-purple-800 mb-1 flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  Weather Analysis
                </h4>
                <p className="text-sm text-gray-700">{recommendations.weatherSummary}</p>
              </div>
              <div className="bg-white/60 p-3 rounded-lg border border-indigo-100">
                <h4 className="font-semibold text-indigo-800 mb-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Location Insights
                </h4>
                <p className="text-sm text-gray-700">{recommendations.locationInsights}</p>
              </div>
              <div className="bg-white/60 p-3 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-1 flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  Strategy
                </h4>
                <p className="text-sm text-gray-700">{recommendations.overallRecommendation}</p>
              </div>
            </div>
          </div>
        </CardContent> */}
      </Card>

      {/* Enhanced Recommendations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.recommendations.map((rec, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
            <div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(rec.category)}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{rec.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {rec.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className={`h-4 w-4 fill-current ${getSuitabilityColor(rec.suitabilityScore)}`} />
                  <span className={`text-sm font-semibold ${getSuitabilityColor(rec.suitabilityScore)}`}>
                    {rec.suitabilityScore}/10
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700">{rec.description}</p>

              <div className="space-y-2">
                <Badge className={`text-xs border ${getCompatibilityColor(rec.weatherCompatibility)}`}>
                  {rec.weatherCompatibility} Weather Match
                </Badge>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {rec.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {rec.priceRange}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-3 w-3" />
                  Best for: {rec.timeOfDay}
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {rec.tags.slice(0, 3).map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-100">
                <h4 className="text-sm font-semibold text-purple-800 mb-1 flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  Claude's Reasoning
                </h4>
                <p className="text-xs text-purple-700">{rec.reasoning}</p>
              </div> */}

              {rec.isEventBased && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded border border-green-200">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Featured Local Event!</span>
                </div>
              )}
            </CardContent>
            </div>
            <CardContent className="space-y-4">
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <ExternalLink className="h-3 w-3 mr-2" />
                  Explore
                </Button>
                <Button size="sm" variant="outline" className="border-purple-200 hover:bg-purple-50 bg-transparent">
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" className="border-purple-200 hover:bg-purple-50 bg-transparent">
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Local Events Section */}
      {events.length > 0 && (
        <Card className="border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <span className="text-indigo-800">Local Events Today</span>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                Analyzed by Claude
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {events.slice(0, 4).map((event, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-indigo-900">{event.title}</h4>
                    <Badge variant="outline" className="text-xs border-indigo-200 text-indigo-700">
                      {event.type}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-indigo-500" />
                      {event.venue}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-indigo-500" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-indigo-500" />
                      {event.priceRange}
                    </div>
                    {event.weatherDependent && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <Zap className="h-3 w-3" />
                        Weather dependent
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{event.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button
          onClick={fetchRecommendations}
          variant="outline"
          className="border-purple-200 hover:bg-purple-50 bg-transparent"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Get Fresh Claude Recommendations
        </Button>
      </div>

      {/* Anthropic Attribution */}
      <div className="text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <Brain className="h-3 w-3" />
          Intelligent recommendations powered by Anthropic Claude
        </p>
      </div>
    </div>
  )
}
