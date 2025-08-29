import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI server-side
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, options = {} } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GOOGLE_GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ 
      model: options.model || 'gemini-1.5-flash' 
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      text,
      confidence: 0.9, // Default confidence score
      metadata: {
        model: options.model || 'gemini-1.5-flash',
        timestamp: new Date().toISOString(),
        promptLength: prompt.length,
        responseLength: text.length
      }
    });

  } catch (error) {
    console.error('RAG Generate API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
