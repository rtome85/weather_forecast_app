import { Sun, Cloud, CloudRain, CloudSnow, Zap, CloudDrizzle, Eye } from "lucide-react"

export function getWeatherIcon(iconCode: string | undefined, condition: string) {
  if (!iconCode && !condition) return Cloud

  // OpenWeatherMap icon codes
  const iconMap: { [key: string]: any } = {
    "01d": Sun, // clear sky day
    "01n": Sun, // clear sky night
    "02d": Cloud, // few clouds day
    "02n": Cloud, // few clouds night
    "03d": Cloud, // scattered clouds day
    "03n": Cloud, // scattered clouds night
    "04d": Cloud, // broken clouds day
    "04n": Cloud, // broken clouds night
    "09d": CloudDrizzle, // shower rain day
    "09n": CloudDrizzle, // shower rain night
    "10d": CloudRain, // rain day
    "10n": CloudRain, // rain night
    "11d": Zap, // thunderstorm day
    "11n": Zap, // thunderstorm night
    "13d": CloudSnow, // snow day
    "13n": CloudSnow, // snow night
    "50d": Eye, // mist day
    "50n": Eye, // mist night
  }

  if (iconCode && iconMap[iconCode]) {
    return iconMap[iconCode]
  }

  // Fallback based on condition
  const conditionMap: { [key: string]: any } = {
    Clear: Sun,
    Clouds: Cloud,
    Rain: CloudRain,
    Drizzle: CloudDrizzle,
    Thunderstorm: Zap,
    Snow: CloudSnow,
    Mist: Eye,
    Fog: Eye,
    Haze: Eye,
  }

  return conditionMap[condition] || Cloud
}

export function getActivitySuggestions(temperature: number, condition: string, windSpeed: number) {
  const activities = []

  // Temperature-based suggestions
  if (temperature >= 20 && temperature <= 28 && !["Rain", "Thunderstorm"].includes(condition)) {
    activities.push({
      category: "Outdoor",
      title: "Perfect for Photography",
      description: "Great lighting and comfortable temperature",
      icon: "Camera",
      suitable: true,
    })
  }

  if (temperature >= 15 && temperature <= 25 && windSpeed < 20) {
    activities.push({
      category: "Outdoor",
      title: "Hiking",
      description: "Ideal weather for trail hiking",
      icon: "Mountain",
      suitable: !["Rain", "Thunderstorm", "Snow"].includes(condition),
    })
  }

  if (temperature >= 22 && ["Clear", "Clouds"].includes(condition)) {
    activities.push({
      category: "Outdoor",
      title: "Beach Day",
      description: "Perfect temperature for beach activities",
      icon: "Waves",
      suitable: true,
    })
  }

  // Weather condition-based suggestions
  if (["Rain", "Thunderstorm", "Snow"].includes(condition) || temperature < 10 || temperature > 35) {
    activities.push({
      category: "Indoor",
      title: "Visit a Museum",
      description: "Great indoor activity with climate control",
      icon: "Coffee",
      suitable: true,
    })
  }

  // Always include some indoor options
  activities.push({
    category: "Indoor",
    title: "Cozy Café Time",
    description: "Perfect for reading or working indoors",
    icon: "Coffee",
    suitable: true,
  })

  return activities.slice(0, 4) // Return max 4 activities
}
