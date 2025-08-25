import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    // Test MongoDB connection
    await dbConnect();
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      message: 'MongoDB connection successful'
    });
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: 'MongoDB connection failed',
      details: error.message
    }, { status: 503 });
  }
}
