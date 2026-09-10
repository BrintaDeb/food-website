import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    platform: 'Next.js App Router',
    service: 'CurryCraft Indian Cuisine API',
    timestamp: new Date().toISOString()
  });
}
