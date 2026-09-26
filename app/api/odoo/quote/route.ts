import { NextResponse } from 'next/server'
import { createQuoteRequest } from '@/lib/odoo'

export async function POST(request: Request) {
  try {
    const payload = await request.json()

    const result = await createQuoteRequest({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      notes: payload.notes,
      projectType: payload.projectType,
      services: payload.services,
      area: payload.area,
      finish: payload.finish,
      estimate: payload.estimate,
    })

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    )
  }
}
