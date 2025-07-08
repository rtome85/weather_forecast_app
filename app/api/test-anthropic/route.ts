import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      prompt: "Generate a brief test message to confirm Anthropic API integration is working correctly.",
      temperature: 0.3,
    })

    return NextResponse.json({
      success: true,
      message: result.text,
      model: "claude-3-5-sonnet-20241022",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Anthropic API test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to Anthropic API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
