import { NextRequest, NextResponse } from 'next/server'
import { fetchFile } from '../../../lib/files'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const response = await fetchFile(id)

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch file from backend' }, { status: response.status })
    }

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
  } catch (error: any) {
    console.error('File API Error:', error)
    const status = error.status || 500
    const errorMessage = error.message || 'Internal Server Error'
    return NextResponse.json({ error: errorMessage }, { status })
  }
}
