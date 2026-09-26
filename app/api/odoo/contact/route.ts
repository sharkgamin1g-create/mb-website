import { NextResponse } from 'next/server'
import { createLead } from '@/lib/odoo'

export async function POST(request: Request) {
  try {
    const payload = await request.json()

    const result = await createLead({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      service: payload.service,
      message: payload.message,
      source: payload.source ?? 'website_contact_form',
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
