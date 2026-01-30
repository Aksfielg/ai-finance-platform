import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fallback: Simple text extraction from image
const extractReceiptFallback = async (base64String) => {
  try {
    // Simple heuristic-based extraction (placeholder)
    return {
      amount: 0,
      date: new Date().toISOString(),
      description: "Receipt (manual extraction)",
      category: "other-expense",
      merchantName: "Unknown",
      fromFallback: true,
    };
  } catch (e) {
    return null;
  }
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "Server not configured: GEMINI_API_KEY is missing" },
        { status: 500 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    // Try using only gemini-1.5-pro which is more reliably available
    const preferredModels = ["gemini-1.5-pro", "gemini-pro"];
    
    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number, e.g., 12.99)
      - Date (in ISO format YYYY-MM-DD, or today if not readable)
      - Description or items purchased (brief summary, max 50 chars)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a receipt, return: {"amount": 0, "date": "", "description": "Not a receipt", "merchantName": "", "category": ""}
    `;

    const tryGenerate = async (modelName) => {
      try {
        console.log(`Attempting model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([
          {
            inlineData: {
              data: base64String,
              mimeType: file.type,
            },
          },
          prompt,
        ]);
        console.log(`✓ Model ${modelName} succeeded`);
        return result;
      } catch (e) {
        const errorMsg = e?.message || String(e);
        console.warn(`✗ Model ${modelName} failed: ${errorMsg.substring(0, 100)}`);
        return null;
      }
    };

    let result = null;
    
    // Try preferred models
    for (const modelName of preferredModels) {
      result = await tryGenerate(modelName);
      if (result) {
        console.log(`Using model: ${modelName}`);
        break;
      }
    }

    // If all models fail, use fallback
    if (!result) {
      console.warn("All models failed. Using fallback extraction.");
      const fallback = await extractReceiptFallback(base64String);
      if (fallback) {
        return NextResponse.json({
          ...fallback,
          warning: "Could not access AI. Manual extraction attempted. Please review the extracted data.",
        });
      }
      
      return NextResponse.json(
        {
          error: "Gemini API quota exceeded or models unavailable. Please try again later or contact support.",
          hint: "Your free tier quota has been exceeded. Consider upgrading your Gemini API plan.",
        },
        { status: 429 }
      );
    }

    const response = await result.response;
    const text = await response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);

      return NextResponse.json({
        amount: data.amount ? parseFloat(data.amount) : 0,
        date: data.date || new Date().toISOString().split('T')[0],
        description: data.description || "",
        category: data.category || "other-expense",
        merchantName: data.merchantName || "",
      });
    } catch (parseError) {
      console.error("Error parsing JSON response. Raw text:", cleanedText.substring(0, 200));
      return NextResponse.json(
        { error: "Could not parse receipt. Please try another image or try again later." },
        { status: 400 }
      );
    }
  } catch (error) {
    const errorMsg = error?.message || String(error);
    console.error("Error scanning receipt:", errorMsg.substring(0, 200));
    return NextResponse.json(
      { 
        error: "Failed to process receipt. Please try again.",
        detail: process.env.NODE_ENV === 'development' ? errorMsg : undefined,
      },
      { status: 500 }
    );
  }
}
