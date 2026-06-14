import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { CmsEditor } from "@/components/admin/cms-editor"
import { ADMIN_COOKIE_NAME, verifyAdminSessionValue } from "@/lib/admin-auth"
import { getCmsEntries } from "@/lib/cms"

export default async function AdminCmsPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  if (!verifyAdminSessionValue(session)) {
    redirect("/admin/login")
  }

  const entries = await getCmsEntries()

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Nueva Proposals</p>
            <h1 className="font-serif text-4xl font-light">Content Manager</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/" target="_blank" rel="noreferrer" className="rounded-full border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:border-neutral-950">
              Preview Site
            </a>
            <a href="/admin" className="rounded-full border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:border-neutral-950">
              Dashboard
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <section className="rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-medium">Editable Site Content</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-500">
            Edit visible copy, button text, form labels, image alt text, and image assets. Uploaded images are compressed
            in your browser and saved as WebP before they are sent to Vercel Blob.
          </p>
        </section>
        <CmsEditor entries={entries} />
      </div>
    </main>
  )
}
