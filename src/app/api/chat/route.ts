import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { CHAT_SYSTEM_PROMPT } from "@/lib/ai-context";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "API Key missing. Please check server configuration." },
                { status: 500 }
            );
        }

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Invalid message format" },
                { status: 400 }
            );
        }

        // Get the latest user message
        const latestMessage = messages[messages.length - 1].content;

        // Construct the model and chat
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // History: Map previous messages to Gemini format (limiting context window for efficiency)
        const history = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));

        // Start chat with history
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "System Instruction: " + CHAT_SYSTEM_PROMPT }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am Eterna Concierge, ready to assist." }]
                },
                ...history,
            ],
            generationConfig: {
                maxOutputTokens: 200, // Keep responses concise
            },
        });

        const result = await chat.sendMessage(latestMessage);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ role: "assistant", content: text });

    } catch (error: any) {
        console.error("Gemini Chat Error:", error);
        return NextResponse.json(
            {
                error: "Failed to generate response.",
                details: error instanceof Error ? error.message : "Unknown error",
                env_check: process.env.GOOGLE_GEMINI_API_KEY ? "Key Present" : "Key Missing"
            },
            { status: 500 }
        );
    }
}
