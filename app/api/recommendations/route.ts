import { generateObject } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"
import { type NextRequest, NextResponse } from "next/server"

const RecommendationSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string(),
      category: z.enum([
        "Outdoor Adventure",
        "Indoor Activity",
        "Cultural Event",
        "Food & Dining",
        "Wellness",
        "Entertainment",
      ]),
      description: z.string(),
      reasoning: z.string(),
      suitabilityScore: z.number().min(1).max(10),
      weatherCompatibility: z.enum(["Perfect", "Good", "Fair", "Poor"]),
      timeOfDay: z.enum(["Morning", "Afternoon", "Evening", "All Day"]),
      duration: z.string(),
      priceRange: z.enum(["Free", "$", "$$", "$$$"]),
      tags: z.array(z.string()),
      isEventBased: z.boolean(),
      eventId: z.string().optional(),
    }),
  ),
  weatherSummary: z.string(),
  locationInsights: z.string(),
  overallRecommendation: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { weather, location, events, userPreferences } = body

    const prompt = `You are an expert activity recommendation system powered by Anthropic's Claude. Your role is to analyze weather conditions, location data, and local events to provide personalized, intelligent activity suggestions.

CURRENT WEATHER CONDITIONS:
- Location: ${location}
- Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)
- Weather Condition: ${weather.condition} - ${weather.description}
- Humidity: ${weather.humidity}%
- Wind Speed: ${weather.windSpeed} mph
- Visibility: ${weather.visibility} miles
- Atmospheric Pressure: ${weather.pressure} inHg
- Sunrise: ${weather.sunrise} | Sunset: ${weather.sunset}

LOCAL EVENTS & ACTIVITIES AVAILABLE TODAY:
${events
  .map(
    (event: any) => `
🎯 ${event.title} (${event.type})
   📍 Venue: ${event.venue}
   ⏰ Time: ${event.time}
   📝 Description: ${event.description}
   🌤️ Weather Dependent: ${event.weatherDependent ? "Yes" : "No"}
   🏠 Indoor/Outdoor: ${event.isOutdoor ? "Outdoor" : "Indoor"}
   💰 Price Range: ${event.priceRange}
   🏷️ Tags: ${event.tags.join(", ")}
`,
  )
  .join("\n")}

USER PREFERENCES & INTERESTS:
${
  userPreferences
    ? `
- Interests: ${userPreferences.interests?.join(", ") || "Not specified"}
- Budget Preference: ${userPreferences.budgetRange || "Not specified"}
- Preferred Duration: ${userPreferences.preferredDuration || "Not specified"}
- Activity Level: ${userPreferences.activityLevel || "5"}/10 (1=Relaxed, 10=High Energy)
- Indoor/Outdoor Preference: ${userPreferences.indoorOutdoorPreference || "No preference"}
- Preferred Times: ${userPreferences.timePreferences?.join(", ") || "Any time"}
`
    : "No specific user preferences provided"
}

ANALYSIS REQUIREMENTS:
Please provide a comprehensive analysis and 6-8 diverse activity recommendations that:

1. **Weather Optimization**: Consider how current weather conditions affect each activity's enjoyability and safety
2. **Local Event Integration**: Incorporate relevant local events when they align with weather and user preferences
3. **Personalization**: Tailor suggestions based on user interests, budget, and activity preferences
4. **Diversity**: Include a balanced mix of indoor/outdoor, cultural/recreational, active/relaxed options
5. **Timing Consideration**: Factor in current time of day and optimal activity timing
6. **Practical Feasibility**: Ensure recommendations are realistic and accessible

For each recommendation, provide:
- Clear title and category classification
- Detailed description of the activity
- Reasoning for why it's suitable given current conditions
- Suitability score (1-10) based on weather, preferences, and timing
- Weather compatibility rating
- Estimated duration and price range
- Relevant tags for easy categorization

Additionally, provide:
- A weather summary explaining how conditions affect activity choices
- Location-specific insights about opportunities and considerations
- An overall recommendation strategy for making the most of the day

Focus on creating actionable, engaging suggestions that enhance the user's experience while considering safety, comfort, and personal preferences.`

    const result = await generateObject({
      model: anthropic("claude-3-5-sonnet-20241022"),
      schema: RecommendationSchema,
      prompt,
      temperature: 0.7, // Add some creativity while maintaining consistency
    })

    return NextResponse.json(result.object)
  } catch (error) {
    console.error("Anthropic AI Recommendations error:", error)
    return NextResponse.json({ error: "Failed to generate recommendations using Anthropic AI" }, { status: 500 })
  }
}
