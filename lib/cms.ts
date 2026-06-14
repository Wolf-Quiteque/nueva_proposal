import { cache } from "react"
import { cmsFields, defaultCmsContent, type CmsContent, type CmsField } from "@/lib/cms-defaults"
import { getSql } from "@/lib/db"

export type CmsEntry = CmsField & {
  value: string
}

type CmsRow = {
  key: string
  value: string
}

function cloneDefaultContent(): CmsContent {
  return JSON.parse(JSON.stringify(defaultCmsContent)) as CmsContent
}

function setByPath(target: Record<string, unknown>, path: string, value: string) {
  const parts = path.split(".")
  let current: Record<string, unknown> = target

  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index]
    const next = current[part]
    if (typeof next !== "object" || next === null) {
      return
    }
    current = next as Record<string, unknown>
  }

  const finalKey = parts[parts.length - 1]
  const existingValue = current[finalKey]

  if (Array.isArray(existingValue)) {
    try {
      const parsed = JSON.parse(value)
      current[finalKey] = Array.isArray(parsed) ? parsed : existingValue
    } catch {
      current[finalKey] = value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    }
    return
  }

  current[finalKey] = value
}

export function getDefaultValue(key: string) {
  return cmsFields.find((field) => field.key === key)?.defaultValue || ""
}

export function getCmsField(key: string) {
  return cmsFields.find((field) => field.key === key)
}

export async function ensureCmsTables() {
  const sql = getSql()

  await sql`
    create table if not exists cms_entries (
      key text primary key,
      value text not null,
      field_type text not null check (field_type in ('text', 'textarea', 'image')),
      section text not null,
      label text not null,
      updated_at timestamptz not null default now()
    )
  `

  await sql`
    create table if not exists cms_assets (
      key text primary key references cms_entries(key) on delete cascade,
      url text not null,
      pathname text,
      content_type text,
      size_bytes integer,
      updated_at timestamptz not null default now()
    )
  `

  await sql`create index if not exists cms_entries_section_idx on cms_entries(section)`
}

export async function getCmsEntries(): Promise<CmsEntry[]> {
  await ensureCmsTables()
  const sql = getSql()
  const rows = (await sql`
    select key, value
    from cms_entries
  `) as CmsRow[]
  const overrides = new Map(rows.map((row) => [row.key, row.value]))

  return cmsFields.map((field) => ({
    ...field,
    value: overrides.get(field.key) ?? field.defaultValue,
  }))
}

export const getCmsContent = cache(async () => {
  const entries = await getCmsEntries()
  const content = cloneDefaultContent() as unknown as Record<string, unknown>

  for (const entry of entries) {
    setByPath(content, entry.key, entry.value)
  }

  return content as unknown as CmsContent
})
