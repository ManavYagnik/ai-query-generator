import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

let groq = null;
try {
    console.log('Loading GROQ_API_KEY from environment variables');
    console.log('GROQ_API_KEY length:', process.env.GROQ_API_KEY?.length || 0);

    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.length > 10) {
        groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        console.log('GROQ client initialized successfully');
    } else {
        console.error('GROQ_API_KEY is missing or too short');
    }
} catch (error) {
    console.log('Failed to initialize GROQ client:', error.message);
    console.error('GROQ initialization error:', error);
}

const isGroqAvailable = groq !== null;


/**
 * Generate a query based on database type, schema, prompt, and previous chat context.
 * @param {string} database - The type of database (e.g., MongoDB, PostgreSQL, MySQL).
 * @param {string} schema - The database schema or structure.
 * @param {string} prompt - The user's current query request.
 * @param {Array} previousMessages - Optional array of previous user/assistant messages for context.
 * @returns {string} - AI-generated query with explanation.
 */
export const generateQuery = async (database, schema, prompt, previousMessages = []) => {
    try {
        console.log('generateQuery called with:', {
            database,
            schemaLength: schema?.length,
            promptLength: prompt?.length,
            previousMessagesCount: previousMessages?.length,
            previousMessagesSample: previousMessages?.slice(0, 2)
        });
      

        // Step 1: Define database-specific instructions
        const databaseInstructions = {
            MongoDB: `
You are a MongoDB expert. Given the schema and user prompt, generate a valid MongoDB query using proper MongoDB syntax (e.g., find, aggregate). Then, explain step-by-step how the query addresses the user's request in the context of the provided schema.

Output format:
1. Query (MongoDB syntax only, no markdown or comments)
2. Explanation (clear, concise, and aligned with the query logic)

Schema:
${schema}

User Prompt:
${prompt}
`,
            PostgreSQL: `
You are a PostgreSQL expert. Based on the provided schema and user prompt, generate a valid SQL query in PostgreSQL syntax. Then, provide a clear explanation of how the query satisfies the prompt, referencing specific schema elements.

Output format:
1. Query (PostgreSQL SQL only, with semicolons, no markdown or comments)
2. Explanation (step-by-step breakdown of logic and SQL clauses used)

Schema:
${schema}

User Prompt:
${prompt}
`,
            MySQL: `
You are a MySQL expert. Based on the MySQL CREATE TABLE schema and user prompt, generate a valid MySQL query using proper syntax and structure. Then, explain how each part of the query corresponds to the schema and fulfills the user's request.

Output format:
1. Query (strict MySQL syntax, ending with a semicolon; no markdown, comments, or MongoDB syntax)
2. Explanation (detailed, with reference to schema fields and SQL logic)

Schema:
${schema}

User Prompt:
${prompt}
`
        };

        const instruction = databaseInstructions[database];
        if (!instruction) {
            throw new Error(`No instructions defined for database: ${database}`);
        }

        // Validate and filter previousMessages to ensure they have required structure
        const validPreviousMessages = previousMessages.filter(msg => 
            msg && typeof msg === 'object' && 
            msg.role && typeof msg.role === 'string' && 
            msg.content && typeof msg.content === 'string'
        );

        console.log('Previous messages count:', previousMessages.length);
        console.log('Valid previous messages count:', validPreviousMessages.length);

        const messages = [
            {
                role: 'system',
                content: instruction,
            },
            ...validPreviousMessages,
            {
                role: 'user',
                content: prompt,
            }
        ];

        console.log('Total messages being sent to GROQ:', messages.length);
        console.log('Message roles:', messages.map(m => m.role));

        if (!groq) {
            console.error('GROQ client is null - not initialized');
            throw new Error('GROQ client not initialized - API key may be missing or invalid');
        }

        console.log('Making GROQ API call with model: llama3-8b-8192');
        console.log('GROQ client status:', groq ? 'initialized' : 'not initialized');
        const response = await groq.chat.completions.create({
            model: 'llama3-8b-8192',
            messages,
            max_tokens: 500,
            temperature: 0.7,
        });

        console.log('GROQ API response received:', {
            choices: response.choices?.length || 0,
            usage: response.usage,
            response: JSON.stringify(response, null, 2)
        });

        // Check if response has choices
        if (!response.choices || response.choices.length === 0) {
            console.error('No choices in GROQ response');
            throw new Error('No response choices from GROQ API.');
        }

        // Check if first choice has message
        if (!response.choices[0].message) {
            console.error('No message in first choice');
            throw new Error('No message in GROQ response choice.');
        }

        // Check if message has content
        if (!response.choices[0].message.content) {
            console.error('No content in message');
            throw new Error('No content in GROQ response message.');
        }

        const query = response.choices[0].message.content.trim();
        if (!query) {
            console.error('Empty query content after trim');
            throw new Error('Empty query generated by AI.');
        }

        console.log('Query generated successfully, length:', query.length);
        return query;
    } catch (error) {
        console.error('Groq Service Error:', error.message);
        console.error('Error details:', {
            name: error.name,
            code: error.code,
            status: error.status,
            response: error.response?.data
        });

        // If it's an API key or authentication error, provide specific message
        if (error.status === 401 || error.message.includes('authentication') || error.message.includes('API key')) {
            console.log('Authentication error detected, using fallback response');
            return {
                error: "Authentication failed",
                details: "Invalid or missing GROQ API key"
            };
        }

        // Return fallback response on error
        throw error;
    }
};

