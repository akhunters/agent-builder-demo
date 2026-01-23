import { NextRequest, NextResponse } from 'next/server'
import { getOpenAIClient } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAIClient()
    const thread = await openai.beta.threads.create()

    return NextResponse.json({ id: thread.id })
  } catch (error: any) {
    console.error('Error creating thread:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create thread' },
      { status: 500 }
    )
  }
}

