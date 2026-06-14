"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import type { CmsEntry } from "@/lib/cms"

type SaveState = "idle" | "saving" | "saved" | "error"

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

export function CmsEditor({ entries }: { entries: CmsEntry[] }) {
  const [values, setValues] = useState(() => new Map(entries.map((entry) => [entry.key, entry.value])))
  const [states, setStates] = useState<Record<string, SaveState>>({})
  const [uploadNotes, setUploadNotes] = useState<Record<string, string>>({})
  const sections = useMemo(() => {
    const grouped = new Map<string, CmsEntry[]>()
    for (const entry of entries) {
      grouped.set(entry.section, [...(grouped.get(entry.section) || []), entry])
    }
    return Array.from(grouped.entries())
  }, [entries])

  const setState = (key: string, state: SaveState) => {
    setStates((current) => ({ ...current, [key]: state }))
  }

  const saveText = async (entry: CmsEntry) => {
    setState(entry.key, "saving")

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

      if (!response.ok) {
        throw new Error("Save failed")
      }

      setState(entry.key, "saved")
      window.setTimeout(() => setState(entry.key, "idle"), 2000)
    } catch {
      setState(entry.key, "error")
    }
  }

  const uploadImage = async (entry: CmsEntry, file: File) => {
    setState(entry.key, "saving")
    setUploadNotes((current) => ({ ...current, [entry.key]: "Compressing image..." }))

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

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = (await response.json()) as { url: string }
      setValues((current) => new Map(current).set(entry.key, result.url))
      setState(entry.key, "saved")
      window.setTimeout(() => setState(entry.key, "idle"), 2000)
    } catch {
      setUploadNotes((current) => ({ ...current, [entry.key]: "Upload failed. Try a smaller image." }))
      setState(entry.key, "error")
    }
  }

  return (
    <div className="grid gap-6">
      {sections.map(([section, sectionEntries]) => (
        <section key={section} className="rounded-lg border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-5 py-4">
            <h2 className="text-lg font-medium">{section}</h2>
            <p className="mt-1 text-sm text-neutral-500">{sectionEntries.length} editable fields</p>
          </div>
          <div className="grid gap-4 p-5">
            {sectionEntries.map((entry) => {
              const value = values.get(entry.key) || ""
              const state = states[entry.key] || "idle"

              return (
                <div key={entry.key} className="rounded-md border border-neutral-200 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <label className="text-sm font-medium text-neutral-950" htmlFor={entry.key}>
                        {entry.label}
                      </label>
                      <p className="mt-1 font-mono text-xs text-neutral-400">{entry.key}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        state === "saved"
                          ? "bg-green-50 text-green-700"
                          : state === "error"
                            ? "bg-red-50 text-red-700"
                            : state === "saving"
                              ? "bg-neutral-100 text-neutral-700"
                              : "bg-transparent text-neutral-400"
                      }`}
                    >
                      {state === "idle" ? "Default ready" : state}
                    </span>
                  </div>

                  {entry.type === "image" ? (
                    <div className="grid gap-4 md:grid-cols-[12rem_1fr]">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-neutral-100">
                        <Image src={value} alt={entry.label} fill sizes="12rem" className="object-cover" unoptimized />
                      </div>
                      <div className="space-y-3">
                        <input
                          id={entry.key}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            if (file) {
                              void uploadImage(entry, file)
                              event.currentTarget.value = ""
                            }
                          }}
                          className="block w-full rounded-md border border-neutral-200 p-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-neutral-950 file:px-4 file:py-2 file:text-sm file:text-white"
                        />
                        <p className="break-all text-xs text-neutral-500">{value}</p>
                        {uploadNotes[entry.key] && <p className="text-xs text-neutral-500">{uploadNotes[entry.key]}</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {entry.type === "textarea" ? (
                        <textarea
                          id={entry.key}
                          value={value}
                          onChange={(event) => setValues((current) => new Map(current).set(entry.key, event.target.value))}
                          rows={4}
                          className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-950"
                        />
                      ) : (
                        <input
                          id={entry.key}
                          value={value}
                          onChange={(event) => setValues((current) => new Map(current).set(entry.key, event.target.value))}
                          className="h-11 w-full rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-950"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => void saveText(entry)}
                        disabled={state === "saving"}
                        className="rounded-full bg-neutral-950 px-5 py-2 text-sm text-white transition hover:bg-neutral-800 disabled:opacity-50"
                      >
                        {state === "saving" ? "Saving..." : "Save"}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
