import { NextRequest, NextResponse } from 'next/server'
import { getOpenAIClient } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAIClient()
    const { threadId, content } = await request.json()

    const message = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: content,
    })

    return NextResponse.json({ id: message.id })
  } catch (error: any) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create message' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const threadId = searchParams.get('threadId')

    if (!threadId) {
      return NextResponse.json(
        { error: 'threadId is required' },
        { status: 400 }
      )
    }

    const openai = getOpenAIClient()
    const messages = await openai.beta.threads.messages.list(threadId)

    return NextResponse.json({ messages: messages.data })
  } catch (error: any) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

