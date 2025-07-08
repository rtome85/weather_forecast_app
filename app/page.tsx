"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Cloud,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  MapPin,
  Calendar,
  Clock,
  Map,
  Search,
  Navigation,
  Sunrise,
  Sunset,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { useGeolocation } from "@/hooks/use-geolocation"
import { getWeatherIcon, getActivitySuggestions } from "@/lib/weather-utils"
import { AIActivityRecommendations } from "@/components/ai-activity-recommendations"
import { UserPreferences } from "@/components/user-preferences"

interface CurrentWeather {
  location: string
  temperature: number
  condition: string
  description: string
  icon: string
  humidity: number
  windSpeed: number
  visibility: number
  pressure: string
  feelsLike: number
  sunrise: string
  sunset: string
  coordinates: {
    lat: number
    lon: number
  }
}

interface ForecastData {
  hourly: Array<{
    time: string
    temp: number
    icon: string
    precipitation: number
    description: string
  }>
  weekly: Array<{
    day: string
    high: number
    low: number
    condition: string
    icon: string
    precipitation: number
  }>
}

export default function WeatherApp() {
  const [activeTab, setActiveTab] = useState("current")
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null)
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { latitude, longitude, error: geoError, loading: geoLoading, refetch: refetchLocation } = useGeolocation()

  const [showPreferences, setShowPreferences] = useState(false)
  const [userPreferences, setUserPreferences] = useState({
    interests: ["Art & Culture", "Food & Dining"],
    budgetRange: "$$",
    preferredDuration: "2-4 hours",
    activityLevel: 5,
    indoorOutdoorPreference: "No Preference",
    timePreferences: ["Afternoon", "Evening"],
  })

  const fetchWeatherData = async (lat?: number, lon?: number, city?: string) => {
    setLoading(true)
    setError(null)

    try {
      // Fetch current weather
      let currentUrl = "/api/weather/current"
      let forecastUrl = "/api/weather/forecast"

      if (lat && lon) {
        currentUrl += `?lat=${lat}&lon=${lon}`
        forecastUrl += `?lat=${lat}&lon=${lon}`
      } else if (city) {
        currentUrl += `?city=${encodeURIComponent(city)}`
        forecastUrl += `?city=${encodeURIComponent(city)}`
      }

      const [currentResponse, forecastResponse] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)])

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error("Failed to fetch weather data")
      }

      const currentData = await currentResponse.json()
      const forecastData = await forecastResponse.json()

      if (currentData.error || forecastData.error) {
        throw new Error(currentData.error || forecastData.error)
      }

      setCurrentWeather(currentData)
      setForecastData(forecastData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  // Fetch weather data when location is available
  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherData(latitude, longitude)
    } else if (!geoLoading && geoError) {
      // Fallback to default location if geolocation fails
      fetchWeatherData()
    }
  }, [latitude, longitude, geoLoading, geoError])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      fetchWeatherData(undefined, undefined, searchQuery.trim())
    }
  }

  const handleCurrentLocation = () => {
    refetchLocation()
  }

  const handleRefresh = () => {
    if (latitude && longitude) {
      fetchWeatherData(latitude, longitude)
    } else if (currentWeather) {
      fetchWeatherData(undefined, undefined, currentWeather.location.split(",")[0])
    } else {
      fetchWeatherData()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Weather Data</h2>
          <p className="text-gray-600">Getting the latest weather information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Weather Data Unavailable</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentWeather || !forecastData) {
    return null
  }

  const WeatherIcon = getWeatherIcon(currentWeather.icon, currentWeather.condition)
  const activities = getActivitySuggestions(
    currentWeather.temperature,
    currentWeather.condition,
    currentWeather.windSpeed,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">WeatherPro</h1>
            </div>
            <div className="flex items-center gap-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>
              <Button variant="outline" size="sm" onClick={handleCurrentLocation} disabled={geoLoading}>
                <Navigation className="h-4 w-4 mr-2" />
                {geoLoading ? "Locating..." : "Current Location"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {geoError && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Location access denied. Using default location. You can search for your city above.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="current" className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              <span className="hidden sm:inline">Current</span>
            </TabsTrigger>
            <TabsTrigger value="hourly" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Hourly</span>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">7-Day</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Map</span>
            </TabsTrigger>
          </TabsList>

          {/* Current Weather Tab */}
          <TabsContent value="current" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Weather Card */}
              <Card className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <span className="text-lg font-medium">{currentWeather.location}</span>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {currentWeather.condition}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-6xl font-bold mb-2">{currentWeather.temperature}°C</div>
                      <div className="text-lg opacity-90">Feels like {currentWeather.feelsLike}°C</div>
                      <div className="text-sm opacity-75 capitalize">{currentWeather.description}</div>
                    </div>
                    <WeatherIcon className="h-24 w-24 opacity-80" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
                    <div className="flex items-center gap-2">
                      <Sunrise className="h-5 w-5" />
                      <div>
                        <div className="text-sm opacity-80">Sunrise</div>
                        <div className="font-medium">{currentWeather.sunrise}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sunset className="h-5 w-5" />
                      <div>
                        <div className="text-sm opacity-80">Sunset</div>
                        <div className="font-medium">{currentWeather.sunset}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weather Details */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Humidity</span>
                      </div>
                      <span className="text-2xl font-bold">{currentWeather.humidity}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Wind Speed</span>
                      </div>
                      <span className="text-2xl font-bold">{currentWeather.windSpeed} mph</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-purple-500" />
                        <span className="font-medium">Visibility</span>
                      </div>
                      <span className="text-2xl font-bold">{currentWeather.visibility} mi</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-5 w-5 text-orange-500" />
                        <span className="font-medium">Pressure</span>
                      </div>
                      <span className="text-2xl font-bold">{currentWeather.pressure} inHg</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* AI-Powered Activity Recommendations */}
            <AIActivityRecommendations
              weather={currentWeather}
              location={currentWeather.location}
              userPreferences={userPreferences}
              onPreferencesClick={() => setShowPreferences(true)}
            />
          </TabsContent>

          {/* Hourly Forecast Tab */}
          <TabsContent value="hourly">
            <Card>
              <CardHeader>
                <CardTitle>24-Hour Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {forecastData.hourly.map((hour, index) => {
                    const HourIcon = getWeatherIcon(hour.icon, "")
                    return (
                      <div key={index} className="flex-shrink-0 text-center p-4 rounded-lg bg-gray-50 min-w-[100px]">
                        <div className="font-medium text-sm mb-2">{hour.time}</div>
                        <HourIcon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <div className="font-bold text-lg mb-1">{hour.temp}°C</div>
                        <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                          <Droplets className="h-3 w-3" />
                          {hour.precipitation}%
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weekly Forecast Tab */}
          <TabsContent value="weekly">
            <Card>
              <CardHeader>
                <CardTitle>7-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forecastData.weekly.map((day, index) => {
                    const DayIcon = getWeatherIcon(day.icon, day.condition)
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-20 font-medium">{day.day}</div>
                          <DayIcon className="h-6 w-6 text-blue-500" />
                          <div className="flex-1">
                            <div className="font-medium">{day.condition}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Droplets className="h-3 w-3" />
                              {day.precipitation}% chance of rain
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-bold">{day.high}°C</div>
                            <div className="text-sm text-gray-500">{day.low}°C</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Weather Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Map className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                      <h3 className="text-xl font-semibold mb-2">Interactive Weather Map</h3>
                      <p className="text-gray-600 max-w-md">
                        Weather map integration would display real-time weather patterns, precipitation, and temperature
                        data for {currentWeather.location} and surrounding areas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    Temperature
                  </Button>
                  <Button variant="outline" size="sm">
                    Precipitation
                  </Button>
                  <Button variant="outline" size="sm">
                    Wind
                  </Button>
                  <Button variant="outline" size="sm">
                    Pressure
                  </Button>
                  <Button variant="outline" size="sm">
                    Satellite
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <UserPreferences
        preferences={userPreferences}
        onPreferencesChange={setUserPreferences}
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </div>
  )
}
