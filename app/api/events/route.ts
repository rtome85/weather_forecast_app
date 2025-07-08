import { type NextRequest, NextResponse } from "next/server"

// Mock events data - In production, this would integrate with APIs like Eventbrite, Ticketmaster, etc.
const mockEvents = [
  {
    id: "1",
    title: "Summer Jazz Festival",
    type: "Music",
    venue: "Central Park",
    date: "2024-07-15",
    time: "7:00 PM",
    description: "Annual outdoor jazz festival featuring local and international artists",
    isOutdoor: true,
    weatherDependent: true,
    category: "Cultural",
    priceRange: "$$",
    duration: "3 hours",
    tags: ["music", "outdoor", "festival", "jazz"],
  },
  {
    id: "2",
    title: "Modern Art Exhibition",
    type: "Art",
    venue: "City Museum",
    date: "2024-07-15",
    time: "10:00 AM - 6:00 PM",
    description: "Contemporary art showcase featuring emerging local artists",
    isOutdoor: false,
    weatherDependent: false,
    category: "Cultural",
    priceRange: "$",
    duration: "2 hours",
    tags: ["art", "indoor", "exhibition", "culture"],
  },
  {
    id: "3",
    title: "Food Truck Festival",
    type: "Food",
    venue: "Downtown Square",
    date: "2024-07-15",
    time: "11:00 AM - 8:00 PM",
    description: "Local food trucks serving diverse cuisines",
    isOutdoor: true,
    weatherDependent: true,
    category: "Food & Drink",
    priceRange: "$$",
    duration: "1-2 hours",
    tags: ["food", "outdoor", "festival", "local"],
  },
  {
    id: "4",
    title: "Indoor Rock Climbing",
    type: "Sports",
    venue: "Adventure Center",
    date: "2024-07-15",
    time: "9:00 AM - 10:00 PM",
    description: "Indoor climbing walls for all skill levels",
    isOutdoor: false,
    weatherDependent: false,
    category: "Recreation",
    priceRange: "$$",
    duration: "2-3 hours",
    tags: ["sports", "indoor", "climbing", "fitness"],
  },
  {
    id: "5",
    title: "Botanical Garden Tour",
    type: "Nature",
    venue: "City Botanical Gardens",
    date: "2024-07-15",
    time: "9:00 AM - 5:00 PM",
    description: "Guided tours through beautiful botanical collections",
    isOutdoor: true,
    weatherDependent: true,
    category: "Nature",
    priceRange: "$",
    duration: "1-2 hours",
    tags: ["nature", "outdoor", "educational", "peaceful"],
  },
  {
    id: "6",
    title: "Cooking Workshop",
    type: "Workshop",
    venue: "Culinary Institute",
    date: "2024-07-15",
    time: "2:00 PM - 5:00 PM",
    description: "Learn to cook seasonal dishes with local ingredients",
    isOutdoor: false,
    weatherDependent: false,
    category: "Educational",
    priceRange: "$$$",
    duration: "3 hours",
    tags: ["cooking", "indoor", "workshop", "food"],
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const city = searchParams.get("city")

  try {
    // In production, you would filter events based on location
    // For now, we'll return all mock events
    const events = mockEvents.map((event) => ({
      ...event,
      // Add some location-based filtering logic here
      distance: Math.random() * 10, // Mock distance in miles
    }))

    return NextResponse.json({ events })
  } catch (error) {
    console.error("Events API error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
