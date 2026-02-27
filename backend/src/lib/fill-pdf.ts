import { PDFDocument, PDFSignature, PDFName, PDFArray } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

interface SignatureRect {
  x: number
  y: number
  width: number
  height: number
}

function getSignatureRects(pdfDoc: PDFDocument): Map<string, SignatureRect> {
  const form = pdfDoc.getForm()
  const rects = new Map<string, SignatureRect>()

  for (const field of form.getFields()) {
    if (field instanceof PDFSignature) {
      const widgets = field.acroField.getWidgets()
      if (widgets.length > 0) {
        const rect = widgets[0].getRectangle()
        rects.set(field.getName(), {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        })
      }
    }
  }

  return rects
}

function removeSignatureFields(pdfDoc: PDFDocument) {
  const form = pdfDoc.getForm()
  const sigFields = form.getFields().filter(f => f instanceof PDFSignature)

  for (const field of sigFields) {
    const widgets = field.acroField.getWidgets()
    for (const widget of widgets) {
      const pages = pdfDoc.getPages()
      for (const page of pages) {
        const annots = page.node.lookup(PDFName.of('Annots'), PDFArray)
        if (!annots) continue
        for (let i = annots.size() - 1; i >= 0; i--) {
          if (annots.get(i) === (widget as any).ref || annots.lookup(i) === widget.dict) {
            annots.remove(i)
          }
        }
      }
    }
    const acroForm = pdfDoc.catalog.lookup(PDFName.of('AcroForm'))
    if (acroForm && 'lookup' in acroForm) {
      const fieldsArray = (acroForm as any).lookup(PDFName.of('Fields'), PDFArray)
      if (fieldsArray) {
        for (let i = fieldsArray.size() - 1; i >= 0; i--) {
          if (fieldsArray.get(i) === (field.acroField as any).ref) {
            fieldsArray.remove(i)
          }
        }
      }
    }
  }
}

async function embedSignature(
  pdfDoc: PDFDocument,
  pageIndex: number,
  rect: SignatureRect,
  signatureDataUrl: string
) {
  const base64Data = signatureDataUrl.replace(/^data:image\/png;base64,/, '')
  const imageBytes = Buffer.from(base64Data, 'base64')
  const image = await pdfDoc.embedPng(imageBytes)

  const page = pdfDoc.getPage(pageIndex)
  const padding = 4
  const availWidth = rect.width - padding * 2
  const availHeight = rect.height - padding * 2
  const imgAspect = image.width / image.height
  const boxAspect = availWidth / availHeight

  let drawWidth: number
  let drawHeight: number
  if (imgAspect > boxAspect) {
    drawWidth = availWidth
    drawHeight = availWidth / imgAspect
  } else {
    drawHeight = availHeight
    drawWidth = availHeight * imgAspect
  }

  page.drawImage(image, {
    x: rect.x + padding + (availWidth - drawWidth) / 2,
    y: rect.y + padding + (availHeight - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  })
}

interface EnrollmentData {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  address?: {
    street?: string
    houseNumber?: string
    postalCode?: string
    city?: string
  }
  paymentMethod?: 'regular' | 'ooievaarspas'
  ooievaarspasNumber?: string
  bankAccount?: {
    accountHolder?: string
    iban?: string
  }
  signature?: string
}

function formatDate(): string {
  const now = new Date()
  return `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`
}

export async function fillInschrijfformulier(data: EnrollmentData): Promise<Uint8Array> {
  const pdfPath = path.resolve(process.cwd(), 'assets/Formulieren/Inschrijfformulier.pdf')
  const existingPdfBytes = fs.readFileSync(pdfPath)
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const form = pdfDoc.getForm()

  form.getTextField('Voornaam').setText(data.firstName)
  form.getTextField('Achternaam').setText(
    [data.middleName, data.lastName].filter(Boolean).join(' ')
  )
  form.getTextField('Geboortedatum').setText(data.dateOfBirth || '')
  form.getTextField('Straatnaam + huisnummer').setText(
    `${data.address?.street || ''} ${data.address?.houseNumber || ''}`.trim()
  )
  form.getTextField('Postcode + stad').setText(
    `${data.address?.postalCode || ''} ${data.address?.city || ''}`.trim()
  )
  form.getTextField('Telefoonnummer').setText(data.phone || '')
  form.getTextField('Emailadress').setText(data.email || '')
  form.getTextField('Datum Inschrijving').setText(formatDate())

  if (data.paymentMethod === 'ooievaarspas') {
    form.getTextField('Nummer ooievaarspas').setText(data.ooievaarspasNumber || '')
  }

  const sigRects = getSignatureRects(pdfDoc)
  const sigRect = sigRects.get('Handtekening')

  removeSignatureFields(pdfDoc)
  pdfDoc.getForm().flatten()

  if (data.signature && sigRect) {
    await embedSignature(pdfDoc, 0, sigRect, data.signature)
  }

  return pdfDoc.save()
}

export async function fillMachtigingIncasso(data: EnrollmentData): Promise<Uint8Array> {
  const pdfPath = path.resolve(process.cwd(), 'assets/Formulieren/machtiging incasso.pdf')
  const existingPdfBytes = fs.readFileSync(pdfPath)
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const form = pdfDoc.getForm()

  form.getTextField('IBAN').setText(data.bankAccount?.iban || '')
  form.getTextField('Getekend te (plaats)').setText(data.address?.city || '')
  form.getTextField('Datum').setText(formatDate())
  form.getTextField('Naam en voorletters').setText(
    data.bankAccount?.accountHolder || [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ')
  )

  const sigRects = getSignatureRects(pdfDoc)
  const sigRect = sigRects.get('Handtekening')

  removeSignatureFields(pdfDoc)
  pdfDoc.getForm().flatten()

  if (data.signature && sigRect) {
    await embedSignature(pdfDoc, 0, sigRect, data.signature)
  }

  return pdfDoc.save()
}
