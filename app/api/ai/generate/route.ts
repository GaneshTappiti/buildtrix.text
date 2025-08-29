import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/services/geminiService';
import { getGeminiApiKey } from '@/lib/env-validation';

export async function POST(request: NextRequest) {
  try {
    // Check if Gemini API key is configured
    // Centralized key validation (supports multiple env var names)
    try { getGeminiApiKey(); } catch (e) {
      console.error('Gemini API key not set:', e instanceof Error ? e.message : e);
      return NextResponse.json(
        { error: 'AI service not configured. Please set GOOGLE_GEMINI_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    const { prompt, type, options } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let result: any;

    // Helper function to safely parse JSON
    const safeJsonParse = (jsonString: string) => {
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        throw new Error(`Invalid JSON format in prompt: ${error instanceof Error ? error.message : 'Unknown parsing error'}`);
      }
    };

    switch (type) {
      case 'text':
        result = await geminiService.generateText(prompt, options);
        break;
      case 'validate':
        result = await geminiService.validateIdea(prompt);
        break;
      case 'brief':
        result = await geminiService.generateStartupBrief(prompt);
        break;
      case 'market':
        result = await geminiService.analyzeMarket(prompt);
        break;
      case 'roadmap':
        result = await geminiService.generateRoadmap(prompt, options?.timeframe);
        break;
      case 'tasks':
        result = await geminiService.breakdownTasks(prompt, options?.complexity);
        break;
      case 'investors':
        result = await geminiService.findInvestorMatches(safeJsonParse(prompt));
        break;
      case 'optimize-prompt':
        result = await geminiService.optimizePrompt(prompt, options?.purpose);
        break;
      case 'insights':
        result = await geminiService.generateInsights(safeJsonParse(prompt));
        break;
      case 'recommendations':
        result = await geminiService.generateRecommendations(safeJsonParse(prompt));
        break;
      case 'improve-writing':
        result = await geminiService.improveWriting(prompt, options?.purpose);
        break;
      case 'business-model-canvas':
        result = await geminiService.generateBusinessModelCanvas(safeJsonParse(prompt));
        break;
      case 'bmc-block':
        const parsedData = safeJsonParse(prompt);
        const { blockId, appIdea, existingCanvas } = parsedData;
        result = await geminiService.generateBMCBlock(blockId, appIdea, existingCanvas);
        break;
      case 'app-blueprint':
        result = await geminiService.generateAppBlueprint(safeJsonParse(prompt));
        break;
      default:
        result = await geminiService.generateText(prompt, options);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('AI API Error:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to process AI request';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('Invalid JSON format')) {
        errorMessage = 'Invalid request format. Please check your request data.';
        statusCode = 400;
      } else if (error.message.includes('API_KEY')) {
        errorMessage = 'Invalid API key. Please check your Gemini API configuration.';
        statusCode = 401;
      } else if (error.message.includes('quota')) {
        errorMessage = 'API quota exceeded. Please try again later.';
        statusCode = 429;
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
        statusCode = 503;
      } else {
        errorMessage = `AI service error: ${error.message}`;
      }
    }

    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.message : 'Unknown error' },
      { status: statusCode }
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
