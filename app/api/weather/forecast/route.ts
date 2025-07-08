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
    let url = `${BASE_URL}/forecast?appid=${OPENWEATHER_API_KEY}&units=metric`

    if (lat && lon) {
      url += `&lat=${lat}&lon=${lon}`
    } else if (city) {
      url += `&q=${city}`
    } else {
      url += `&q=San Francisco,US`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform hourly data (next 24 hours)
    const hourlyForecast = data.list.slice(0, 8).map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      }),
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      precipitation: Math.round(item.pop * 100),
      description: item.weather[0].description,
    }))

    // Transform daily data (group by day)
    const dailyData = new Map()

    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000)
      const dayKey = date.toDateString()

      if (!dailyData.has(dayKey)) {
        dailyData.set(dayKey, {
          date: date,
          temps: [],
          conditions: [],
          precipitation: [],
          icons: [],
        })
      }

      const dayData = dailyData.get(dayKey)
      dayData.temps.push(item.main.temp)
      dayData.conditions.push(item.weather[0].main)
      dayData.precipitation.push(item.pop * 100)
      dayData.icons.push(item.weather[0].icon)
    })

    // Create 7-day forecast
    const weeklyForecast = Array.from(dailyData.entries())
      .slice(0, 7)
      .map(([dayKey, dayData]: [string, any], index) => {
        const temps = dayData.temps
        const high = Math.round(Math.max(...temps))
        const low = Math.round(Math.min(...temps))
        const avgPrecipitation = Math.round(
          dayData.precipitation.reduce((a: number, b: number) => a + b, 0) / dayData.precipitation.length,
        )

        // Get most common condition
        const conditionCounts = dayData.conditions.reduce((acc: any, condition: string) => {
          acc[condition] = (acc[condition] || 0) + 1
          return acc
        }, {})
        const mostCommonCondition = Object.keys(conditionCounts).reduce((a, b) =>
          conditionCounts[a] > conditionCounts[b] ? a : b,
        )

        // Get most common icon
        const iconCounts = dayData.icons.reduce((acc: any, icon: string) => {
          acc[icon] = (acc[icon] || 0) + 1
          return acc
        }, {})
        const mostCommonIcon = Object.keys(iconCounts).reduce((a, b) => (iconCounts[a] > iconCounts[b] ? a : b))

        const dayName =
          index === 0
            ? "Today"
            : index === 1
              ? "Tomorrow"
              : dayData.date.toLocaleDateString("en-US", { weekday: "long" })

        return {
          day: dayName,
          high,
          low,
          condition: mostCommonCondition,
          icon: mostCommonIcon,
          precipitation: avgPrecipitation,
        }
      })

    return NextResponse.json({
      hourly: hourlyForecast,
      weekly: weeklyForecast,
    })
  } catch (error) {
    console.error("Forecast API error:", error)
    return NextResponse.json({ error: "Failed to fetch forecast data" }, { status: 500 })
  }
}
