import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

interface FormField {
  name: string
  value: string
}

interface FechaCapacitacion {
  nombre: string
  profesor: string
  fecha: string
  hora: string
}

interface FormData {
  _type: string
  name: string
  email: string
  subject: string
  pageTitle?: string
  fields: FormField[]
  emailRecipients: string
  utmParams?: Record<string, string>
}

// Function to normalize text by removing special characters
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-zA-Z0-9\s-_.,@]/g, '') // Keep only alphanumeric, spaces, and basic punctuation
}

// Get the API key from environment variable
const RESEND_API_KEY = process.env.RESEND_API_KEY

// Initialize Resend only if API key is available
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!RESEND_API_KEY || !resend) {
    console.error('Missing Resend API key')
    // Continue without email functionality
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

    // Debug log all fields
    console.log('All form fields:', JSON.stringify(formData.fields, null, 2))

    // Check for curso and fecha fields specifically
    const cursoFields = formData.fields.filter(field => field.name.endsWith('_curso'))
    const fechaFields = formData.fields.filter(field => field.name.endsWith('_fecha'))

    console.log('Curso fields:', JSON.stringify(cursoFields, null, 2))
    console.log('Fecha fields:', JSON.stringify(fechaFields, null, 2))

    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Normalize form data
    const normalizedFormData = {
      ...formData,
      name: normalizeText(formData.name),
      subject: normalizeText(formData.subject),
      fields: formData.fields.map(field => ({
        ...field,
        name: normalizeText(field.name),
        value: field.name.endsWith('_fecha') && field.value
          ? field.value // Don't normalize JSON string
          : normalizeText(field.value)
      }))
    }

    // Save to Sanity with normalized data
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
      body: JSON.stringify({
        mutations: [{
          ...mutations[0],
          create: normalizedFormData
        }]
      })
    }

    const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`
    const sanityResponse = await fetch(url, options)

    if (!sanityResponse.ok) {
      throw new Error('Failed to save to Sanity')
    }

    const sanityData = await sanityResponse.json()

    // Only attempt to send email if Resend is initialized
    if (resend) {
      // Process fields to handle curso and fecha data
      const processedFields = normalizedFormData.fields.map((field: FormField) => {
        console.log('Processing field:', field.name, field.value)

        // Check for specific curso/fecha fields from the form submission
        const isDetalleCursoField = field.name === 'detallecapacitacion_curso'
        const isDetalleFechaField = field.name === 'detallecapacitacion_fecha'

        // Log if we find the specific fields
        if (isDetalleCursoField) console.log('Found detallecapacitacion_curso:', field.value)
        if (isDetalleFechaField) console.log('Found detallecapacitacion_fecha:', field.value)

        // If this is the fecha field with value, process it
        if (isDetalleFechaField && field.value) {
          try {
            const fechaData: FechaCapacitacion = JSON.parse(field.value)
            return {
              name: 'Detalle de capacitacion',
              value: `${new Date(fechaData.fecha).toLocaleDateString('es-CL')} - ${normalizeText(fechaData.nombre)} - ${normalizeText(fechaData.profesor)} - ${fechaData.hora}`
            } as FormField
          } catch (e) {
            console.error('Error parsing fecha data:', e)
            return null
          }
        }

        // If this is the curso field (but no fecha field with value was found), include it
        if (isDetalleCursoField) {
          // We'll handle this later to avoid duplicates
          return null
        }

        // Skip the original detallecapacitacion field
        if (field.name === 'detallecapacitacion') {
          console.log('Found detallecapacitacion field, skipping')
          return null
        }

        // Keep all other fields
        return field
      }).filter((field): field is FormField => field !== null)

      // Find the curso and fecha values
      const cursoField = normalizedFormData.fields.find(f => f.name === 'detallecapacitacion_curso')
      const fechaField = normalizedFormData.fields.find(f => f.name === 'detallecapacitacion_fecha')

      // Check if we need to add a curso field (if fecha parsing failed or no fecha was selected)
      const hasDetailField = processedFields.some(field => field.name === 'Detalle de capacitacion')

      if (!hasDetailField && cursoField && cursoField.value) {
        console.log('Adding curso field without fecha details')
        processedFields.push({
          name: 'Detalle de capacitacion',
          value: `Curso seleccionado: ${cursoField.value}`
        } as FormField)
      } else if (!hasDetailField && !cursoField?.value) {
        console.log('No curso or fecha found, adding default message')
        processedFields.push({
          name: 'Detalle de capacitacion',
          value: 'No se selecciono curso ni fecha'
        } as FormField)
      }

      // Generate HTML for fields
      const fieldsHtml = processedFields
        .map((field) => `<p><strong>${field.name}:</strong> ${field.value}</p>`)
        .join('') || ''

      // Generate HTML for UTM parameters if they exist
      const utmParamsHtml = normalizedFormData.utmParams && Object.keys(normalizedFormData.utmParams).length > 0
        ? `
          <h3>UTM Parameters</h3>
          ${Object.entries(normalizedFormData.utmParams)
          .map(([key, value]) => `<p><strong>${normalizeText(key)}:</strong> ${normalizeText(value)}</p>`)
          .join('')}
        `
        : ''

      // Parse email recipients
      console.log('Email recipients from form:', normalizedFormData.emailRecipients)

      const recipients = normalizedFormData.emailRecipients
        ? normalizedFormData.emailRecipients.split(',').map(email => email.trim()).filter(Boolean)
        : ['pablo.lobos@fenomena.cl'] // Fallback to default

      console.log('Parsed recipients:', recipients)

      try {
        const emailResponse = await resend.emails.send({
          from: 'Volvo Chile <formulario@send.volvochile.cl>',
          to: recipients,
          subject: `Nuevo formulario: ${normalizedFormData.subject}`,
          html: `
            <h2>Nuevo envio de formulario</h2>
            <p><strong>Nombre:</strong> ${normalizedFormData.name}</p>
            <p><strong>Email:</strong> ${normalizedFormData.email}</p>
            <p><strong>Asunto:</strong> ${normalizedFormData.subject}</p>
            ${normalizedFormData.pageTitle ? `<p><strong>Pagina de origen:</strong> ${normalizeText(normalizedFormData.pageTitle)}</p>` : ''}
            ${fieldsHtml}
            ${utmParamsHtml}
          `,
        })

        console.log('Email sent successfully:', emailResponse)
      } catch (emailError) {
        console.error('Error sending email:', emailError)
        // Continue execution even if email fails
      }
    } else {
      console.log('Skipping email sending - Resend not configured')
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