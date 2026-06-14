import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, verifyAdminSessionValue } from "@/lib/admin-auth"
import { ensureCmsTables, getCmsEntries, getCmsField } from "@/lib/cms"
import { getSql } from "@/lib/db"

async function isAuthorized() {
  const cookieStore = await cookies()
  return verifyAdminSessionValue(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const entries = await getCmsEntries()
  return NextResponse.json({ entries })
}

export async function PATCH(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const key = String(body.key || "")
  const value = String(body.value ?? "")
  const field = getCmsField(key)

  if (!field || field.type === "image") {
    return NextResponse.json({ error: "Invalid CMS field." }, { status: 400 })
  }

  await ensureCmsTables()
  const sql = getSql()
  const fieldType = field.type === "list" ? "textarea" : field.type

  await sql`
    insert into cms_entries (key, value, field_type, section, label, updated_at)
    values (${field.key}, ${value}, ${fieldType}, ${field.section}, ${field.label}, now())
    on conflict (key)
    do update set
      value = excluded.value,
      field_type = excluded.field_type,
      section = excluded.section,
      label = excluded.label,
      updated_at = now()
  `

  revalidatePath("/")
  revalidatePath("/admin/cms")

  return NextResponse.json({ ok: true })
}
