import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';

export async function GET(request) {
  try {
    await dbConnect();
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const token = extractTokenFromHeader(authHeader);
    const decoded = verifyToken(token);

    // Fetch messages for the user
    const messages = await Message.find({ userId: decoded.userId }).sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Get messages API error:', error);
    
    if (error.message === 'Invalid token' || error.message === 'Invalid authorization header') {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const token = extractTokenFromHeader(authHeader);
    const decoded = verifyToken(token);
    
    const { sender, text, database, schema, timestamp } = body;
    
    if (!sender || !text || !timestamp) {
      return NextResponse.json(
        { message: 'Sender, text, and timestamp are required' },
        { status: 400 }
      );
    }

    // Create new message
    const message = new Message({
      userId: decoded.userId,
      sender,
      text,
      database: database || null,
      schema: schema || null,
      timestamp,
    });

    await message.save();

    return NextResponse.json({ message: 'Message saved successfully' });
  } catch (error) {
    console.error('Save message API error:', error);
    
    if (error.message === 'Invalid token' || error.message === 'Invalid authorization header') {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

