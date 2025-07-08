export const anthropicConfig = {
  model: "claude-3-5-sonnet-20241022",
  temperature: 0.7,
  maxTokens: 4000,
  systemPrompt: `You are an expert activity recommendation assistant powered by Anthropic's Claude. 
Your role is to analyze weather conditions, local events, and user preferences to provide intelligent, 
personalized activity suggestions. You excel at understanding context, considering safety factors, 
and providing detailed reasoning for your recommendations.

Key capabilities:
- Weather impact analysis
- Local event integration
- Personalization based on user preferences
- Safety and comfort considerations
- Diverse activity suggestions
- Clear, actionable recommendations`,
}

export const getAnthropicPromptTemplate = (weather: any, location: string, events: any[], userPreferences: any) => {
  return `${anthropicConfig.systemPrompt}

ANALYSIS REQUEST:
Please analyze the following information and provide personalized activity recommendations:

WEATHER CONDITIONS:
- Location: ${location}
- Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)
- Condition: ${weather.condition} - ${weather.description}
- Humidity: ${weather.humidity}%
- Wind Speed: ${weather.windSpeed} mph
- Visibility: ${weather.visibility} miles
- Pressure: ${weather.pressure} inHg
- Sunrise: ${weather.sunrise} | Sunset: ${weather.sunset}

LOCAL EVENTS:
${events
  .map(
    (event) => `
- ${event.title} (${event.type}) at ${event.venue}
  Time: ${event.time}
  Description: ${event.description}
  Weather Dependent: ${event.weatherDependent ? "Yes" : "No"}
  Indoor/Outdoor: ${event.isOutdoor ? "Outdoor" : "Indoor"}
  Price: ${event.priceRange}
`,
  )
  .join("\n")}

USER PREFERENCES:
${
  userPreferences
    ? `
- Interests: ${userPreferences.interests?.join(", ") || "Not specified"}
- Budget: ${userPreferences.budgetRange || "Not specified"}
- Duration: ${userPreferences.preferredDuration || "Not specified"}
- Activity Level: ${userPreferences.activityLevel || 5}/10
- Indoor/Outdoor: ${userPreferences.indoorOutdoorPreference || "No preference"}
- Time Preferences: ${userPreferences.timePreferences?.join(", ") || "Any time"}
`
    : "No specific preferences provided"
}

Please provide 6-8 diverse, well-reasoned activity recommendations with detailed analysis.`
}
