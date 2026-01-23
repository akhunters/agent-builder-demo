import { NextRequest, NextResponse } from 'next/server'
import { getOpenAIClient } from '@/lib/openai'

export async function GET(
  request: NextRequest,
  { params }: { params: { runId: string } }
) {
  try {
    const openai = getOpenAIClient()
    const searchParams = request.nextUrl.searchParams
    const threadId = searchParams.get('threadId')

    if (!threadId) {
      return NextResponse.json(
        { error: 'threadId is required' },
        { status: 400 }
      )
    }

    const run = await openai.beta.threads.runs.retrieve(threadId, params.runId)

    return NextResponse.json({ status: run.status })
  } catch (error: any) {
    console.error('Error fetching run:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch run' },
      { status: 500 }
    )
  }
}

