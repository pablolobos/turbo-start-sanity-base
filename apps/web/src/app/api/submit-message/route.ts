import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

interface FormField {
  name: string
  value: string
}

interface FormData {
  _type: string
  name: string
  email: string
  subject: string
  fields: FormField[]
  emailRecipients: string
}

const resend = new Resend(process.env.RESEND_API_KEY)

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Missing Resend API key' },
      { status: 500 }
    )
  }

  try {
    const { mutations } = await req.json()
    console.log('Received mutations:', JSON.stringify(mutations, null, 2))

    if (!mutations?.[0]?.create) {
      return NextResponse.json(
        { error: 'Invalid form data structure' },
        { status: 400 }
      )
    }

    const formData: FormData = mutations[0].create

    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save to Sanity
    const API_KEY = process.env.SANITY_API_WRITE_TOKEN
    const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
    const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION

    if (!API_KEY || !PROJECT_ID || !DATASET || !API_VERSION) {
      throw new Error('Missing required environment variables for Sanity')
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ mutations })
    }

    const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`
    const sanityResponse = await fetch(url, options)

    if (!sanityResponse.ok) {
      throw new Error('Failed to save to Sanity')
    }

    const sanityData = await sanityResponse.json()

    // Send email notification
    const fieldsHtml = formData.fields
      ?.map((field: FormField) => `<p><strong>${field.name}:</strong> ${field.value}</p>`)
      .join('') || ''

    // Parse email recipients
    console.log('Email recipients from form:', formData.emailRecipients)

    const recipients = formData.emailRecipients
      ? formData.emailRecipients.split(',').map(email => email.trim()).filter(Boolean)
      : ['pablo.lobos@fenomena.cl'] // Fallback to default

    console.log('Parsed recipients:', recipients)

    try {
      const emailResponse = await resend.emails.send({
        from: 'Volvo Chile <formulario@send.volvochile.cl>',
        to: recipients,
        subject: `Nuevo formulario: ${formData.subject}`,
        html: `
          <h2>Nuevo envío de formulario</h2>
          <p><strong>Nombre:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Asunto:</strong> ${formData.subject}</p>
          ${fieldsHtml}
        `,
      })

      console.log('Email sent successfully:', emailResponse)
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Continue execution even if email fails
    }

    return NextResponse.json({ success: true, data: sanityData })
  } catch (error) {
    console.error('Error processing form:', error)
    return NextResponse.json(
      { error: 'Failed to process form submission.' },
      { status: 500 }
    )
  }
}