import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';
import { generateQuery } from '@/lib/groqService';

export async function POST(request) {
  try {
    console.log('Generate query API called');
    await dbConnect();
    const body = await request.json();
    console.log('Request body:', { schema: !!body.schema, prompt: !!body.prompt, database: body.database });
    
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
    console.log('Token verified for user:', decoded.userId);
    
    const { schema, prompt, database, previousMessages } = body;

    if (!schema || !prompt || !database) {
      return NextResponse.json({
        error: 'Schema, prompt, and database are required.'
      }, { status: 400 });
    }

    const supportedDatabases = ['MongoDB', 'PostgreSQL', 'MySQL'];
    if (!supportedDatabases.includes(database)) {
      return NextResponse.json({
        error: `Unsupported database: ${database}. Supported databases are: ${supportedDatabases.join(', ')}.`
      }, { status: 400 });
    }

    try {
      console.log('Generating query with:', { database, schema: schema.substring(0, 100) + '...', prompt: prompt.substring(0, 100) + '...' });
      const query = await generateQuery(database, schema, prompt, previousMessages);
      console.log('Query generated successfully, length:', query.length);
      return NextResponse.json({ query: query }); // Match frontend expectation
    } catch (error) {
      console.error('Query Generation Error:', error.message);
      console.error('Error stack:', error.stack);
      return NextResponse.json({
        error: 'Failed to generate query.',
        details: error.message
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Generate query API error:', error);
    
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

