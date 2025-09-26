import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(req: NextRequest) {
  try {
    console.log(" Chat API called")
    const { message, context } = await req.json()

    if (!message) {
      console.log("No message provided")
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.log("No API key found")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("Initializing Google GenAI client")

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    })

    // System prompt for Iris personality
    const systemPrompt = `You are Iris, a warm, professional, creativity-first assistant for content creators. 

Your personality:
- Friendly, supportive, and encouraging
- Expert in content creation across all platforms (TikTok, YouTube, Instagram, LinkedIn, Twitter/X)
- Provide actionable insights, scripts, captions, and video analysis
- Speak conversationally and helpfully
- Offer clear ideas, practical steps, and short examples
- Always suggest one gentle follow-up unless the user requests otherwise

Your expertise includes:
- Generating viral content ideas
- Writing engaging scripts and captions
- Analyzing video performance and suggesting improvements
- Creating platform-specific content strategies
- SEO optimization and hashtag research
- Thumbnail and visual suggestions
- Content calendar planning
- Brand voice development

Keep responses concise but comprehensive, and always focus on practical, actionable advice that content creators can implement immediately.`

    // Build conversation context
    let conversationText = systemPrompt + "\n\n"
    if (context && context.length > 0) {
      context.forEach((msg: any) => {
        conversationText += `${msg.role === "user" ? "User" : "Iris"}: ${msg.content}\n`
      })
    }
    conversationText += `User: ${message}\nIris:`

    console.log("Generating content with Gemini")

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: conversationText,
    })

    console.log("Gemini response received")

    const generatedText = response.text || "I'm sorry, I couldn't generate a response."

    return NextResponse.json({ response: generatedText })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
