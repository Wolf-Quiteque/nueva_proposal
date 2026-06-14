"use client"

import Image from "next/image"
import { AlertCircle, CheckCircle2, ImageUp, Plus, Search, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import type { CmsEntry } from "@/lib/cms"

type SaveState = "idle" | "saving" | "saved" | "error"

const readyMadeOptions: Record<string, string[]> = {
  "inquiry.eventTypes": ["Proposal", "Micro Wedding", "Birthday", "Bridal Shower", "Elopement", "Anniversary", "Baby Shower", "Corporate Event", "Other"],
  "inquiry.contactMethods": ["Text", "Phone Call", "Email", "Instagram DM", "TikTok DM", "WhatsApp"],
  "inquiry.addOnOptions": ["Sparkler Machines", "Violinist", "Mariachi", "Photographer", "Rose Bouquet", "Champagne", "Videographer", "Marquee Letters", "Custom Florals"],
  "inquiry.locationOptions": ["Yes", "No - need recommendations"],
}

async function compressImage(file: File) {
  const bitmap = await createImageBitmap(file)
  const maxDimension = 2200
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Canvas is not supported.")
  }

  context.drawImage(bitmap, 0, 0, width, height)

  const qualities = [0.86, 0.8, 0.74, 0.68]
  let output: Blob | null = null

  for (const quality of qualities) {
    output = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality))
    if (output && output.size <= 900_000) {
      break
    }
  }

  if (!output) {
    throw new Error("Image compression failed.")
  }

  return new File([output], file.name.replace(/\.[^.]+$/, ".webp"), {
    type: "image/webp",
  })
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function parseList(value: string) {
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.map(String).filter(Boolean)
    }
  } catch {
    // Fall through to line parsing.
  }

  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
}

function stringifyList(items: string[]) {
  return JSON.stringify(items.filter((item) => item.trim()).map((item) => item.trim()))
}

function friendlyHint(entry: CmsEntry) {
  if (entry.type === "image") return "Upload a replacement image. The CMS compresses it to WebP before saving."
  if (entry.type === "list") return "Add, rename, reorder by editing, or remove choices shown on the inquiry form."
  if (entry.type === "textarea") return "Longer text area for paragraphs, notes, and helper copy."
  return "Short text field for labels, headings, and button copy."
}

function StatePill({ state }: { state: SaveState }) {
  if (state === "saved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Saved
      </span>
    )
  }

  if (state === "error") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs text-red-700">
        <AlertCircle className="h-3.5 w-3.5" />
        Needs attention
      </span>
    )
  }

  if (state === "saving") {
    return <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">Saving...</span>
  }

  return <span className="rounded-full bg-neutral-50 px-3 py-1 text-xs text-neutral-500">Ready</span>
}

export function CmsEditor({ entries }: { entries: CmsEntry[] }) {
  const [values, setValues] = useState(() => new Map(entries.map((entry) => [entry.key, entry.value])))
  const [states, setStates] = useState<Record<string, SaveState>>({})
  const [uploadNotes, setUploadNotes] = useState<Record<string, string>>({})
  const [newItems, setNewItems] = useState<Record<string, string>>({})
  const [query, setQuery] = useState("")

  const sections = useMemo(() => {
    const grouped = new Map<string, CmsEntry[]>()
    for (const entry of entries) {
      grouped.set(entry.section, [...(grouped.get(entry.section) || []), entry])
    }
    return Array.from(grouped.entries())
  }, [entries])

  const [activeSection, setActiveSection] = useState(sections[0]?.[0] || "")

  const visibleEntries = useMemo(() => {
    const sectionEntries = sections.find(([section]) => section === activeSection)?.[1] || []
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return sectionEntries

    return sectionEntries.filter((entry) => `${entry.section} ${entry.label}`.toLowerCase().includes(normalizedQuery))
  }, [activeSection, query, sections])

  const setFieldState = (key: string, state: SaveState) => {
    setStates((current) => ({ ...current, [key]: state }))
  }

  const updateValue = (key: string, value: string) => {
    setValues((current) => new Map(current).set(key, value))
  }

  const saveField = async (entry: CmsEntry) => {
    setFieldState(entry.key, "saving")

    try {
      const response = await fetch("/api/admin/cms", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: entry.key,
          value: values.get(entry.key) || "",
        }),
      })

      if (!response.ok) throw new Error("Save failed")

      setFieldState(entry.key, "saved")
      window.setTimeout(() => setFieldState(entry.key, "idle"), 2000)
    } catch {
      setFieldState(entry.key, "error")
    }
  }

  const uploadImage = async (entry: CmsEntry, file: File) => {
    setFieldState(entry.key, "saving")
    setUploadNotes((current) => ({ ...current, [entry.key]: "Compressing image before upload..." }))

    try {
      const compressed = await compressImage(file)
      setUploadNotes((current) => ({
        ...current,
        [entry.key]: `Compressed ${formatBytes(file.size)} to ${formatBytes(compressed.size)} as WebP.`,
      }))

      const formData = new FormData()
      formData.set("key", entry.key)
      formData.set("file", compressed)

      const response = await fetch("/api/admin/cms/image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const result = (await response.json()) as { url: string }
      updateValue(entry.key, result.url)
      setFieldState(entry.key, "saved")
      window.setTimeout(() => setFieldState(entry.key, "idle"), 2000)
    } catch {
      setUploadNotes((current) => ({ ...current, [entry.key]: "Upload failed. Check Blob setup or try a smaller image." }))
      setFieldState(entry.key, "error")
    }
  }

  const updateList = (entry: CmsEntry, items: string[]) => {
    updateValue(entry.key, stringifyList(items))
  }

  const addListItem = (entry: CmsEntry, label: string) => {
    const item = label.trim()
    if (!item) return

    const items = parseList(values.get(entry.key) || "")
    if (!items.includes(item)) {
      updateList(entry, [...items, item])
    }
    setNewItems((current) => ({ ...current, [entry.key]: "" }))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <aside className="rounded-lg border border-neutral-200 bg-white p-3 lg:sticky lg:top-6 lg:self-start">
        <div className="px-3 py-3">
          <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">Content Areas</p>
        </div>
        <div className="grid gap-1">
          {sections.map(([section, sectionEntries]) => (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={`flex items-center justify-between rounded-md px-3 py-3 text-left text-sm transition ${
                activeSection === section ? "bg-neutral-950 text-white" : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <span>{section}</span>
              <span className={activeSection === section ? "text-white/60" : "text-neutral-400"}>{sectionEntries.length}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="space-y-5">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">Editing</p>
              <h2 className="mt-2 text-2xl font-medium">{activeSection}</h2>
              <p className="mt-2 text-sm text-neutral-500">Make changes, then save each card. No technical field names are required.</p>
            </div>
            <label className="relative block md:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search this area"
                className="h-11 w-full rounded-full border border-neutral-200 pl-10 pr-4 text-sm outline-none focus:border-neutral-950"
              />
            </label>
          </div>
        </div>

        <div className="grid gap-4">
          {visibleEntries.map((entry) => {
            const value = values.get(entry.key) || ""
            const state = states[entry.key] || "idle"

            return (
              <article key={entry.key} className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-medium text-neutral-950">{entry.label}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-neutral-500">{friendlyHint(entry)}</p>
                  </div>
                  <StatePill state={state} />
                </div>

                {entry.type === "image" && (
                  <div className="grid gap-5 md:grid-cols-[14rem_1fr]">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-neutral-100">
                      <Image src={value} alt={entry.label} fill sizes="14rem" className="object-cover" unoptimized />
                    </div>
                    <div className="space-y-3">
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-5 py-8 text-center transition hover:border-neutral-950 hover:bg-white">
                        <ImageUp className="mb-3 h-6 w-6 text-neutral-500" />
                        <span className="text-sm font-medium text-neutral-950">Choose a new image</span>
                        <span className="mt-1 text-xs text-neutral-500">JPG, PNG, or WebP. The CMS compresses it before upload.</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="sr-only"
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            if (file) {
                              void uploadImage(entry, file)
                              event.currentTarget.value = ""
                            }
                          }}
                        />
                      </label>
                      {uploadNotes[entry.key] && <p className="text-sm text-neutral-500">{uploadNotes[entry.key]}</p>}
                    </div>
                  </div>
                )}

                {entry.type === "list" && (
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      {parseList(value).map((item, index, items) => (
                        <div key={`${item}-${index}`} className="flex items-center gap-2">
                          <input
                            value={item}
                            onChange={(event) => {
                              const next = [...items]
                              next[index] = event.target.value
                              updateList(entry, next)
                            }}
                            className="h-11 flex-1 rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-950"
                          />
                          <button
                            type="button"
                            onClick={() => updateList(entry, items.filter((_, itemIndex) => itemIndex !== index))}
                            className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            aria-label={`Remove ${item}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        value={newItems[entry.key] || ""}
                        onChange={(event) => setNewItems((current) => ({ ...current, [entry.key]: event.target.value }))}
                        placeholder="Add a new choice"
                        className="h-11 flex-1 rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-950"
                      />
                      <button
                        type="button"
                        onClick={() => addListItem(entry, newItems[entry.key] || "")}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 text-sm text-white hover:bg-neutral-800"
                      >
                        <Plus className="h-4 w-4" />
                        Add Choice
                      </button>
                    </div>

                    {readyMadeOptions[entry.key] && (
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-400">Ready-made choices</p>
                        <div className="flex flex-wrap gap-2">
                          {readyMadeOptions[entry.key].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => addListItem(entry, option)}
                              className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:border-neutral-950 hover:text-neutral-950"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => void saveField(entry)}
                      disabled={state === "saving"}
                      className="rounded-full bg-neutral-950 px-5 py-2 text-sm text-white transition hover:bg-neutral-800 disabled:opacity-50"
                    >
                      {state === "saving" ? "Saving..." : "Save Choices"}
                    </button>
                  </div>
                )}

                {entry.type !== "image" && entry.type !== "list" && (
                  <div className="space-y-3">
                    {entry.type === "textarea" ? (
                      <textarea
                        value={value}
                        onChange={(event) => updateValue(entry.key, event.target.value)}
                        rows={5}
                        className="w-full rounded-md border border-neutral-200 px-3 py-3 text-sm leading-relaxed outline-none focus:border-neutral-950"
                      />
                    ) : (
                      <input
                        value={value}
                        onChange={(event) => updateValue(entry.key, event.target.value)}
                        className="h-11 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-950"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => void saveField(entry)}
                      disabled={state === "saving"}
                      className="rounded-full bg-neutral-950 px-5 py-2 text-sm text-white transition hover:bg-neutral-800 disabled:opacity-50"
                    >
                      {state === "saving" ? "Saving..." : "Save Change"}
                    </button>
                  </div>
                )}
              </article>
            )
          })}

          {visibleEntries.length === 0 && (
            <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
              No editable content matched your search.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
