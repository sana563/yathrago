import { Groq } from "groq-sdk";

// Initialize Groq client with API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Chatbot service is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse the request body
    const body = await request.json();
    console.log('Request body:', body);
    
    const { message } = body;

    if (!message || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log('Sending message to GROQ:', message);
    
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are YathraGo Travel Assistant, a helpful and friendly travel guide. Answer questions about travel destinations, activities, accommodations, food, culture, and travel tips. Be informative, concise, and provide practical advice for travelers."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    const response = chatCompletion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
    
    console.log('Response received from GROQ:', response);

    return new Response(
      JSON.stringify({ response }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in chatbot API:", error);
    
    let errorMessage = "Failed to get response from chatbot";
    let statusCode = 500;
    
    if (error.status === 401) {
      errorMessage = "Invalid API key";
      statusCode = 401;
    } else if (error.status === 429) {
      errorMessage = "Rate limited. Please try again later.";
      statusCode = 429;
    } else if (error.status === 503) {
      errorMessage = "Service unavailable.";
      statusCode = 503;
    } else if (error.message?.includes("GROQ") || error.message?.includes("API")) {
      errorMessage = error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.error("Returning error response:", { errorMessage, statusCode });
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error.toString() : undefined
      }),
      { 
        status: statusCode, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}