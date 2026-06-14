import { NextResponse } from "next/server"
import { getSql } from "@/lib/db"

type TrackViewPayload = {
  visitorKey: string
  pathname: string
  referrer: string
}

const cleanText = (value: unknown, fallback = "") => {
  if (typeof value !== "string") {
    return fallback
  }

  return value.trim().slice(0, 500) || fallback
}

const parsePayload = async (request: Request): Promise<TrackViewPayload> => {
  const body = await request.json().catch(() => ({}))

  return {
    visitorKey: cleanText(body.visitorKey),
    pathname: cleanText(body.pathname, "/"),
    referrer: cleanText(body.referrer),
  }
}

export async function POST(request: Request) {
  try {
    const payload = await parsePayload(request)
    if (!payload.visitorKey || payload.pathname.startsWith("/admin")) {
      return NextResponse.json({ ok: true })
    }

    const headers = request.headers
    const country = cleanText(headers.get("x-vercel-ip-country"))
    const region = cleanText(headers.get("x-vercel-ip-country-region"))
    const city = cleanText(headers.get("x-vercel-ip-city"))
    const userAgent = cleanText(headers.get("user-agent"), "Unknown")
    const sql = getSql()

    await sql`
      insert into visitors (
        visitor_key,
        first_country,
        first_region,
        first_city,
        first_user_agent
      )
      values (
        ${payload.visitorKey},
        ${country || null},
        ${region || null},
        ${city || null},
        ${userAgent || null}
      )
      on conflict (visitor_key)
      do update set last_seen_at = now()
    `

    await sql`
      insert into page_views (
        visitor_key,
        visitor_id,
        pathname,
        referrer,
        country,
        region,
        city,
        user_agent
      )
      select
        ${payload.visitorKey},
        visitors.id,
        ${payload.pathname},
        ${payload.referrer || null},
        ${country || null},
        ${region || null},
        ${city || null},
        ${userAgent || null}
      from visitors
      where visitors.visitor_key = ${payload.visitorKey}
    `

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[track-view]", error)
    return NextResponse.json({ ok: true })
  }
}
