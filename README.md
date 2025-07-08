# Weather Forecast App with Anthropic AI

A modern, responsive weather application built with Next.js that provides real-time weather data, forecasts, and AI-powered activity recommendations using Anthropic's Claude.

## Features

- **Real-time Weather Data**: Current conditions including temperature, humidity, wind speed, and more
- **Hourly Forecast**: 24-hour weather predictions
- **7-Day Forecast**: Weekly weather outlook
- **AI-Powered Recommendations**: Intelligent activity suggestions powered by Anthropic Claude
- **Local Event Integration**: Incorporates local cultural events and activities
- **Personalized Suggestions**: Tailored recommendations based on user preferences
- **Location Services**: Automatic location detection with manual search capability
- **Responsive Design**: Works seamlessly across all devices

## AI-Powered Features

### Anthropic Claude Integration
- **Advanced Analysis**: Claude analyzes weather conditions, local events, and user preferences
- **Context-Aware Suggestions**: Intelligent recommendations that consider multiple factors
- **Personalized Experience**: Tailored activity suggestions based on individual preferences
- **Real-time Adaptation**: Dynamic recommendations that update with changing conditions

### Smart Recommendations Include:
- Outdoor adventures optimized for weather conditions
- Indoor activities for adverse weather
- Cultural events and local happenings
- Food & dining suggestions
- Wellness and entertainment options
- Budget-conscious and premium options

## Setup

### Environment Variables

Create a `.env.local` file in the root directory and add your API keys:

\`\`\`
OPENWEATHER_API_KEY=your_openweather_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
\`\`\`

### Getting API Keys

#### OpenWeatherMap API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to the API keys section
4. Generate a new API key

#### Anthropic API Key
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up for an account
3. Navigate to the API keys section
4. Generate a new API key
5. Add credits to your account for API usage

### Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## API Endpoints

- `/api/weather/current` - Current weather conditions
- `/api/weather/forecast` - Hourly and daily forecasts
- `/api/events` - Local events and activities
- `/api/recommendations` - AI-powered activity recommendations using Anthropic Claude
- `/api/test-anthropic` - Test endpoint to verify Anthropic API integration

## Technologies Used

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui components
- **Weather API**: OpenWeatherMap API
- **AI Integration**: Anthropic Claude via AI SDK
- **Location Services**: Geolocation API
- **Styling**: Responsive design with Tailwind CSS

## Anthropic Claude Models

The application uses Anthropic's Claude 3.5 Sonnet model for:
- Weather condition analysis
- Activity recommendation generation
- Local event integration
- Personalized suggestion creation
- Context-aware reasoning

## User Experience Features

- **Intelligent Insights**: Claude provides detailed reasoning for each recommendation
- **Weather Compatibility**: Each suggestion includes weather suitability ratings
- **Personalization**: User preferences shape all recommendations
- **Local Integration**: Incorporates real local events and activities
- **Visual Feedback**: Clear, engaging presentation of AI insights
- **Real-time Updates**: Fresh recommendations based on changing conditions

## Performance & Reliability

- **Efficient API Usage**: Optimized calls to both weather and AI APIs
- **Error Handling**: Comprehensive error handling with fallback options
- **Loading States**: Smooth user experience during data fetching
- **Caching**: Intelligent caching to reduce API calls and improve performance
\`\`\`

Let's also create a configuration file to manage the Anthropic integration:
