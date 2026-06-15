import { del, put } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, verifyAdminSessionValue } from "@/lib/admin-auth"
import { ensureCmsTables, getCmsField, getDefaultValue } from "@/lib/cms"
import { getSql } from "@/lib/db"

const isBlobUrl = (value: string) => value.includes(".blob.vercel-storage.com/")

async function isAuthorized() {
  const cookieStore = await cookies()
  return verifyAdminSessionValue(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

export async function POST(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.VERCEL_OIDC_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Image uploads are not configured. Add BLOB_READ_WRITE_TOKEN from Vercel Blob to your environment variables.",
      },
      { status: 500 },
    )
  }

  try {
    const formData = await request.formData()
    const key = String(formData.get("key") || "")
    const file = formData.get("file")
    const field = getCmsField(key)

    if (!field || field.type !== "image" || !(file instanceof File)) {
      return NextResponse.json({ error: "Invalid image upload." }, { status: 400 })
    }

    await ensureCmsTables()
    const sql = getSql()
    const currentRows = (await sql`
      select value
      from cms_entries
      where key = ${key}
      limit 1
    `) as { value: string }[]
    const oldUrl = currentRows[0]?.value || field.defaultValue

    const safeKey = key.replaceAll(".", "-")
    const blob = await put(`cms/${safeKey}-${Date.now()}.webp`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type || "image/webp",
    })

    await sql`
      insert into cms_entries (key, value, field_type, section, label, updated_at)
      values (${field.key}, ${blob.url}, ${field.type}, ${field.section}, ${field.label}, now())
      on conflict (key)
      do update set
        value = excluded.value,
        field_type = excluded.field_type,
        section = excluded.section,
        label = excluded.label,
        updated_at = now()
    `

    await sql`
      insert into cms_assets (key, url, pathname, content_type, size_bytes, updated_at)
      values (${field.key}, ${blob.url}, ${blob.pathname}, ${file.type || "image/webp"}, ${file.size}, now())
      on conflict (key)
      do update set
        url = excluded.url,
        pathname = excluded.pathname,
        content_type = excluded.content_type,
        size_bytes = excluded.size_bytes,
        updated_at = now()
    `

    if (oldUrl && oldUrl !== getDefaultValue(key) && isBlobUrl(oldUrl)) {
      await del(oldUrl).catch((error) => console.error("[cms:image:delete]", error))
    }

    revalidatePath("/")
    revalidatePath("/admin/cms")

    return NextResponse.json({ ok: true, url: blob.url })
  } catch (error) {
    console.error("[cms:image:upload]", error)
    const message = error instanceof Error ? error.message : "Image upload failed."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
