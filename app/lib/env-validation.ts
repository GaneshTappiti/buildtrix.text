/**
 * Environment variable validation utility
 */

export function validateEnvironment() {
  // Support legacy GEMINI_API_KEY while preferring GOOGLE_GEMINI_API_KEY
  const effectiveKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const requiredEnvVars = {
    GOOGLE_GEMINI_API_KEY: effectiveKey,
  };

  const missingVars: string[] = [];

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value || value.trim() === '' || value === 'your_gemini_api_key_here') {
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing or invalid environment variables: ${missingVars.join(', ')}. ` +
      'Please check your .env.local file and ensure all required API keys are set.'
    );
  }

  return true;
}

export function getGeminiApiKey(): string {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error(
      'Gemini API key not configured. Set GOOGLE_GEMINI_API_KEY (preferred) or GEMINI_API_KEY in your .env.local file.'
    );
  }

  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY && !process.env.GOOGLE_GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
    console.warn('[env-validation] Using NEXT_PUBLIC_GEMINI_API_KEY on the server. Consider moving it to a non-public var (GOOGLE_GEMINI_API_KEY).');
  }

  return apiKey;
}
