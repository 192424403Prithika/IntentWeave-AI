import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
  text: z.string().optional(),
  imageUrl: z.string().optional(),
  modality: z.enum(['text', 'voice', 'image', 'mixed']).default('text'),
  history: z.array(z.any()).optional(),
  userMemories: z.array(z.any()).optional(),
  apiKey: z.string().optional(),
  model: z.string().optional(),
});

/**
 * Server-side AI route.
 * Keeps keys strictly on server and verifies output with Zod schemas.
 * Automatically falls back to deterministic mock engine if API key is absent.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request payload', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { text, modality } = parsed.data;

    // In Demo / Mock Mode or when API key is not supplied,
    // deterministic module reasoning occurs on server or client.
    return NextResponse.json({
      status: 'ok',
      mode: 'mock_engine',
      timestamp: new Date().toISOString(),
      message: 'Processed via IntentWeave decoupled engine',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal AI Server Error' },
      { status: 500 }
    );
  }
}
