import { type NextRequest, NextResponse } from "next/server"

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const city = searchParams.get("city")

  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json({ error: "OpenWeather API key not configured" }, { status: 500 })
  }

  try {
    let url = `${BASE_URL}/weather?appid=${OPENWEATHER_API_KEY}&units=metric`

    if (lat && lon) {
      url += `&lat=${lat}&lon=${lon}`
    } else if (city) {
      url += `&q=${city}`
    } else {
      // Default to San Francisco if no location provided
      url += `&q=San Francisco,US`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform the data to match our component structure
    const transformedData = {
      location: `${data.name}, ${data.sys.country}`,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 2.237), // Convert m/s to mph
      visibility: data.visibility ? Math.round(data.visibility / 1609) : 10, // Convert m to miles
      pressure: (data.main.pressure * 0.02953).toFixed(2), // Convert hPa to inHg
      feelsLike: Math.round(data.main.feels_like),
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
