import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import arcjet, { detectBot, shield } from "@arcjet/next";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize ArcJet (Node.js – safe for Vercel)
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "GO_HTTP",
      ],
    }),
  ],
});


// Fallback extraction (if AI fails)
const extractReceiptFallback = async () => {
  return {
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    description: "Receipt (manual extraction)",
    category: "other-expense",
    merchantName: "Unknown",
    fromFallback: true,
  };
};

export async function POST(request) {
  try {
    // 🔐 ArcJet protection
    const decision = await aj.protect(request);
    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Request blocked by security policy" },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Server not configured: GEMINI_API_KEY missing" },
        { status: 500 }
      );
    }

    // Convert image to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
Analyze this receipt image and extract the following information in JSON format:
- Total amount (number only)
- Date (YYYY-MM-DD, or today if unreadable)
- Description (max 50 chars)
- Merchant name
- Category (one of: housing, transportation, groceries, utilities, entertainment, food, shopping, healthcare, education, personal, travel, insurance, gifts, bills, other-expense)

Return ONLY valid JSON in this format:
{
  "amount": number,
  "date": "YYYY-MM-DD",
  "description": "string",
  "merchantName": "string",
  "category": "string"
}
`;

    const models = ["gemini-1.5-pro", "gemini-pro"];
    let result = null;

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent([
          {
            inlineData: {
              data: base64String,
              mimeType: file.type,
            },
          },
          prompt,
        ]);
        break;
      } catch {
        result = null;
      }
    }

    // Fallback if AI fails
    if (!result) {
      const fallback = await extractReceiptFallback();
      return NextResponse.json({
        ...fallback,
        warning: "AI unavailable. Manual extraction used.",
      });
    }

    const text = (await result.response.text())
      .replace(/```(?:json)?/g, "")
      .trim();

    const data = JSON.parse(text);

    return NextResponse.json({
      amount: Number(data.amount) || 0,
      date: data.date || new Date().toISOString().split("T")[0],
      description: data.description || "",
      merchantName: data.merchantName || "",
      category: data.category || "other-expense",
    });
  } catch (error) {
    console.error("Receipt scan error:", error);
    return NextResponse.json(
      { error: "Failed to process receipt" },
      { status: 500 }
    );
  }
}
