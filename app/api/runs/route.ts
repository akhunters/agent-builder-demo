import { NextRequest, NextResponse } from 'next/server'
import { getOpenAIClient } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAIClient()
    const { threadId, assistantId } = await request.json()

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    })

    return NextResponse.json({ id: run.id, status: run.status })
  } catch (error: any) {
    console.error('Error creating run:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create run' },
      { status: 500 }
    )
  }
}

