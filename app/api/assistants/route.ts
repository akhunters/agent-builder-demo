import { NextRequest, NextResponse } from 'next/server'
import { getOpenAIClient } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAIClient()
    const config = await request.json()

    const tools: any[] = []
    if (config.codeInterpreter) {
      tools.push({ type: 'code_interpreter' })
    }
    if (config.fileSearch) {
      tools.push({ type: 'file_search' })
    }

    // Create vector store if files are provided and file_search is enabled
    let vectorStoreId: string | undefined
    if (config.fileSearch && config.files && config.files.length > 0) {
      const fileIds = config.files.map(f => f.id)
      const vectorStore = await openai.beta.vectorStores.create({
        name: `${config.name} - Vector Store`,
        file_ids: fileIds,
      })
      vectorStoreId = vectorStore.id
    }

    const assistant = await openai.beta.assistants.create({
      name: config.name,
      instructions: config.instructions,
      model: config.model,
      temperature: config.temperature,
      tools: tools,
      tool_resources: vectorStoreId ? {
        file_search: {
          vector_store_ids: [vectorStoreId],
        },
      } : config.files && config.files.length > 0 && config.codeInterpreter ? {
        code_interpreter: {
          file_ids: config.files.map(f => f.id),
        },
      } : undefined,
    })

    return NextResponse.json({ id: assistant.id })
  } catch (error: any) {
    console.error('Error creating assistant:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create assistant' },
      { status: 500 }
    )
  }
}

