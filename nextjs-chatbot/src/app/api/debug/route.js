import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envCheck = {
      MONGO_URI: process.env.MONGO_URI ? 'Set' : 'Not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
      GROQ_API_KEY: process.env.GROQ_API_KEY ? 'Set' : 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'Not set',
    };

    return NextResponse.json({
      message: 'Environment check',
      environment: envCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint error',
      message: error.message,
    }, { status: 500 });
  }
}

