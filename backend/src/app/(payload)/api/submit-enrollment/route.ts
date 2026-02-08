import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Create form submission in database
    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        formType: 'enrollment',
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        dateOfBirth: body.dateOfBirth || null,
        address: body.address || {},
        emergencyContact: body.emergencyContact || {},
        parentGuardian: body.parentGuardian || {},
        experience: body.experience || 'beginner',
        judoGrade: body.judoGrade || '',
        medicalInfo: body.medicalInfo || '',
        preferredTrainingDays: body.preferredTrainingDays || [],
        remarks: body.remarks || '',
        paymentMethod: body.paymentMethod || 'regular',
        bankAccount: body.bankAccount || {},
        status: 'new',
      },
    })

    // Get enrollment document template if available
    let filledPdfId = null
    try {
      const documentsResponse = await payload.find({
        collection: 'documents',
        where: {
          category: {
            equals: 'enrollment',
          },
        },
        limit: 1,
        depth: 2,
      })

      if (documentsResponse.docs.length > 0 && documentsResponse.docs[0].attachment) {
        const doc = documentsResponse.docs[0]
        const attachment = typeof doc.attachment === 'object' ? doc.attachment : null

        if (attachment && attachment.url) {
          // Fetch the PDF template
          const pdfUrl = attachment.url.replace('minio:9000', 'minio:9000')
          const pdfResponse = await fetch(pdfUrl)

          if (pdfResponse.ok) {
            const pdfBytes = await pdfResponse.arrayBuffer()
            const pdfDoc = await PDFDocument.load(pdfBytes)
            const form = pdfDoc.getForm()

            // Try to fill form fields if the PDF has AcroForm fields
            try {
              // Common field names in Dutch enrollment forms
              const fieldMappings: Record<string, any> = {
                name: body.name,
                naam: body.name,
                'Naam': body.name,
                email: body.email,
                'E-mail': body.email,
                telefoon: body.phone,
                phone: body.phone,
                'Telefoon': body.phone,
                geboortedatum: body.dateOfBirth,
                'Geboortedatum': body.dateOfBirth,
                straat: body.address?.street,
                'Straat': body.address?.street,
                huisnummer: body.address?.houseNumber,
                'Huisnummer': body.address?.houseNumber,
                postcode: body.address?.postalCode,
                'Postcode': body.address?.postalCode,
                plaats: body.address?.city,
                'Plaats': body.address?.city,
                'Noodcontact Naam': body.emergencyContact?.name,
                'Noodcontact Telefoon': body.emergencyContact?.phone,
                ervaring: body.experience,
                'Ervaring': body.experience,
                graad: body.judoGrade,
                'Graad': body.judoGrade,
                opmerkingen: body.remarks,
                'Opmerkingen': body.remarks,
                rekeninghouder: body.bankAccount?.accountHolder,
                'Rekeninghouder': body.bankAccount?.accountHolder,
                iban: body.bankAccount?.iban,
                'IBAN': body.bankAccount?.iban,
                ooievaarspas: body.paymentMethod === 'ooievaarspas' ? 'Ja' : 'Nee',
                'Ooievaarspas': body.paymentMethod === 'ooievaarspas' ? 'Ja' : 'Nee',
              }

              // Fill available form fields
              const fields = form.getFields()
              fields.forEach((field) => {
                const fieldName = field.getName()
                if (fieldMappings[fieldName]) {
                  try {
                    const textField = form.getTextField(fieldName)
                    textField.setText(String(fieldMappings[fieldName]))
                  } catch (e) {
                    // Field might not be a text field, skip it
                  }
                }
              })

              form.flatten() // Make fields non-editable
            } catch (formError) {
              // PDF doesn't have form fields, we'll add text overlay instead
              console.log('PDF has no form fields, adding text overlay')

              const pages = pdfDoc.getPages()
              const firstPage = pages[0]
              const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
              const fontSize = 10

              // Add text overlay with form data
              let yPosition = firstPage.getHeight() - 100
              const xPosition = 50
              const lineHeight = 15

              const textLines = [
                `Naam: ${body.name}`,
                `E-mail: ${body.email}`,
                `Telefoon: ${body.phone || '-'}`,
                `Geboortedatum: ${body.dateOfBirth || '-'}`,
                body.address?.street ? `Adres: ${body.address.street} ${body.address.houseNumber || ''}` : '',
                body.address?.postalCode ? `${body.address.postalCode} ${body.address.city || ''}` : '',
                body.emergencyContact?.name ? `Noodcontact: ${body.emergencyContact.name} (${body.emergencyContact.phone || '-'})` : '',
                body.experience ? `Ervaring: ${body.experience}` : '',
                body.judoGrade ? `Graad: ${body.judoGrade}` : '',
              ].filter(line => line.length > 0)

              textLines.forEach((line) => {
                firstPage.drawText(line, {
                  x: xPosition,
                  y: yPosition,
                  size: fontSize,
                  font: font,
                  color: rgb(0, 0, 0),
                })
                yPosition -= lineHeight
              })
            }

            // Save the filled PDF
            const filledPdfBytes = await pdfDoc.save()
            const filledPdfBuffer = Buffer.from(filledPdfBytes)

            // Upload filled PDF to media collection
            const uploadedPdf = await payload.create({
              collection: 'media',
              data: {
                alt: `Inschrijfformulier - ${body.name}`,
                category: 'document',
              },
              file: {
                data: filledPdfBuffer,
                mimetype: 'application/pdf',
                name: `enrollment-${submission.id}-${Date.now()}.pdf`,
                size: filledPdfBuffer.length,
              },
            })

            filledPdfId = uploadedPdf.id
          }
        }
      }
    } catch (pdfError) {
      console.error('Error processing PDF:', pdfError)
      // Continue without PDF - form submission is still saved
    }

    // Update submission with filled PDF reference
    if (filledPdfId) {
      await payload.update({
        collection: 'form-submissions',
        id: submission.id,
        data: {
          filledPDF: filledPdfId,
        },
      })
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: 'Form submitted successfully',
      filledPdfAvailable: !!filledPdfId,
    })
  } catch (error) {
    console.error('Error submitting enrollment form:', error)
    return NextResponse.json(
      { error: 'Failed to submit form', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
