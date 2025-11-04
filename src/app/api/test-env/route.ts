import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasApiKey: !!process.env.LLM_API_KEY,
    apiKeyLength: process.env.LLM_API_KEY?.length || 0,
    model: process.env.LLM_MODEL,
    temperature: process.env.LLM_TEMPERATURE,
    nodeEnv: process.env.NODE_ENV,
  });
}
