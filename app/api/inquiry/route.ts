import { neon } from "@neondatabase/serverless"
import nodemailer from "nodemailer"
import { NextResponse } from "next/server"

type InquiryPayload = {
  fullName: string
  email: string
  phone: string
  bestTimeToCall: string
  contactMethods: string[]
  socialHandle: string
  eventType: string
  desiredDate: string
  preferredTime: string
  dateFlexible: boolean
  locationSecured: string
  locationDetails: string
  backdrop: string
  addOns: string[]
  vision: string
}

const requiredSmtpEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"] as const

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")

const listValue = (values: string[]) => (values.length > 0 ? values.join(", ") : "Not provided")
const textValue = (value: string) => value.trim() || "Not provided"

const emailRows = (payload: InquiryPayload) => [
  ["Full Name", payload.fullName],
  ["Email", payload.email],
  ["Phone", payload.phone],
  ["Best Time To Call", payload.bestTimeToCall],
  ["Preferred Communication", listValue(payload.contactMethods)],
  ["Social Media Handle", payload.socialHandle],
  ["Event Type", payload.eventType],
  ["Desired Date", payload.desiredDate],
  ["Preferred Time", payload.preferredTime],
  ["Date Flexible / TBD", payload.dateFlexible ? "Yes" : "No"],
  ["Location Secured", payload.locationSecured],
  ["Location Name Or Address", payload.locationDetails],
  ["Inspiration Backdrop", payload.backdrop],
  ["Add-Ons", listValue(payload.addOns)],
  ["Vision", payload.vision],
]

const buildPlainTextEmail = (payload: InquiryPayload) =>
  [
    "New Nueva Proposals inquiry",
    "",
    ...emailRows(payload).map(([label, value]) => `${label}: ${textValue(value)}`),
  ].join("\n")

const buildHtmlEmail = (payload: InquiryPayload) => `
  <div style="font-family: Arial, sans-serif; color: #171717; line-height: 1.5;">
    <h1 style="font-size: 22px; margin: 0 0 16px;">New Nueva Proposals inquiry</h1>
    <table style="width: 100%; border-collapse: collapse;">
      <tbody>
        ${emailRows(payload)
          .map(
            ([label, value]) => `
              <tr>
                <th style="width: 220px; text-align: left; vertical-align: top; padding: 10px; border-bottom: 1px solid #e5e5e5; color: #737373;">
                  ${escapeHtml(label)}
                </th>
                <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; white-space: pre-wrap;">
                  ${escapeHtml(textValue(value))}
                </td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  </div>
`

const parsePayload = async (request: Request): Promise<InquiryPayload> => {
  const body = await request.json()

  return {
    fullName: String(body.fullName ?? "").trim(),
    email: String(body.email ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    bestTimeToCall: String(body.bestTimeToCall ?? "").trim(),
    contactMethods: Array.isArray(body.contactMethods) ? body.contactMethods.map(String) : [],
    socialHandle: String(body.socialHandle ?? "").trim(),
    eventType: String(body.eventType ?? "").trim(),
    desiredDate: String(body.desiredDate ?? "").trim(),
    preferredTime: String(body.preferredTime ?? "").trim(),
    dateFlexible: body.dateFlexible === true,
    locationSecured: String(body.locationSecured ?? "").trim(),
    locationDetails: String(body.locationDetails ?? "").trim(),
    backdrop: String(body.backdrop ?? "").trim(),
    addOns: Array.isArray(body.addOns) ? body.addOns.map(String) : [],
    vision: String(body.vision ?? "").trim(),
  }
}

const saveInquiry = async (payload: InquiryPayload) => {
  if (!process.env.DATABASE_URL) {
    return
  }

  const sql = neon(process.env.DATABASE_URL)
  await sql`
    insert into inquiries (
      full_name,
      email,
      phone,
      best_time_to_call,
      contact_methods,
      social_handle,
      event_type,
      desired_date,
      preferred_time,
      date_flexible,
      location_secured,
      location_details,
      backdrop,
      add_ons,
      vision
    )
    values (
      ${payload.fullName},
      ${payload.email},
      ${payload.phone || null},
      ${payload.bestTimeToCall || null},
      ${payload.contactMethods},
      ${payload.socialHandle || null},
      ${payload.eventType || null},
      ${payload.desiredDate || null},
      ${payload.preferredTime || null},
      ${payload.dateFlexible},
      ${payload.locationSecured || null},
      ${payload.locationDetails || null},
      ${payload.backdrop || null},
      ${payload.addOns},
      ${payload.vision || null}
    )
  `
}

const sendInquiryEmail = async (payload: InquiryPayload) => {
  const missingEnv = requiredSmtpEnv.filter((key) => !process.env[key])
  if (missingEnv.length > 0) {
    throw new Error(`Missing SMTP environment variables: ${missingEnv.join(", ")}`)
  }

  const port = Number(process.env.SMTP_PORT)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const fromEmail = process.env.INQUIRY_FROM_EMAIL || process.env.SMTP_USER
  const toEmail = process.env.INQUIRY_TO_EMAIL || process.env.SMTP_USER

  await transporter.sendMail({
    from: fromEmail,
    to: toEmail,
    replyTo: payload.email,
    subject: `New inquiry from ${payload.fullName || "Nueva Proposals website"}`,
    text: buildPlainTextEmail(payload),
    html: buildHtmlEmail(payload),
  })
}

export async function POST(request: Request) {
  try {
    const payload = await parsePayload(request)

    if (!payload.fullName || !payload.email || !payload.phone) {
      return NextResponse.json({ error: "Name, email, and phone are required." }, { status: 400 })
    }

    await sendInquiryEmail(payload)
    try {
      await saveInquiry(payload)
    } catch (error) {
      console.error("[inquiry:save]", error)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[inquiry]", error)
    return NextResponse.json({ error: "Unable to send inquiry right now." }, { status: 500 })
  }
}
