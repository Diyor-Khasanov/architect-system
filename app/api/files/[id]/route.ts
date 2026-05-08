import { NextRequest, NextResponse } from 'next/server'
import { downloadFile } from '../../../lib/files'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const response = await downloadFile(id)

    const blob = await response.blob()
    const headers = new Headers()

    // Pass through relevant headers
    const contentType = response.headers.get('Content-Type')
    if (contentType) headers.set('Content-Type', contentType)

    const contentDisposition = response.headers.get('Content-Disposition')
    if (contentDisposition) headers.set('Content-Disposition', contentDisposition)

    return new NextResponse(blob, {
      status: 200,
      headers,
    })
  } catch (error: unknown) {
    console.error('File API Error:', error)
    const status = (error as { status?: number }).status || 500
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: errorMessage }, { status })
  }
}
