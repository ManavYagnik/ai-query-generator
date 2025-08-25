import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Test API route is working!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      message: 'POST request received',
      data: body,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Invalid JSON body',
      status: 'error'
    }, { status: 400 });
  }
}
