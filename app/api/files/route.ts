import { NextRequest, NextResponse } from 'next/server'
import { getOpenAIClient } from '@/lib/openai'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAIClient()
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      
      // Create a File-like object for OpenAI SDK
      const fileForUpload = new File([buffer], file.name, { type: file.type })
      
      const uploadedFile = await openai.files.create({
        file: fileForUpload,
        purpose: 'assistants',
      })

      return { id: uploadedFile.id, name: file.name }
    })

    const uploadedFiles = await Promise.all(uploadPromises)

    return NextResponse.json(uploadedFiles)
  } catch (error: any) {
    console.error('Error uploading files:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload files' },
      { status: 500 }
    )
  }
}

