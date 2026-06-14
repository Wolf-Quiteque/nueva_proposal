import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ADMIN_COOKIE_NAME, verifyAdminSessionValue } from "@/lib/admin-auth"
import { getSql } from "@/lib/db"
import { InquiryCard, type AdminInquiry } from "@/components/admin/inquiry-card"

const PAGE_SIZE = 10

type InquiriesPageProps = {
  searchParams?: Promise<{
    page?: string
  }>
}

function getPage(value?: string) {
  const page = Number(value)
  if (!Number.isInteger(page) || page < 1) {
    return 1
  }

  return page
}

async function getInquiries(page: number) {
  const sql = getSql()
  const offset = (page - 1) * PAGE_SIZE

  const [countRows, inquiryRows] = await Promise.all([
    sql`select count(*)::int as total from inquiries`,
    sql`
      select
        id::text,
        full_name,
        email,
        phone,
        event_type,
        desired_date,
        location_secured,
        location_details,
        vision,
        created_at::text
      from inquiries
      order by created_at desc
      limit ${PAGE_SIZE}
      offset ${offset}
    `,
  ])

  const total = Number(countRows[0]?.total || 0)

  return {
    inquiries: inquiryRows as AdminInquiry[],
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  }
}

function pageHref(page: number) {
  return `/admin/inquiries?page=${page}`
}

export default async function AdminInquiriesPage({ searchParams }: InquiriesPageProps) {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  if (!verifyAdminSessionValue(session)) {
    redirect("/admin/login")
  }

  const params = await searchParams
  const page = getPage(params?.page)
  const { inquiries, total, totalPages } = await getInquiries(page)
  const safePage = Math.min(page, totalPages)

  if (page !== safePage) {
    redirect(pageHref(safePage))
  }

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Nueva Proposals</p>
            <h1 className="font-serif text-4xl font-light">All Inquiries</h1>
          </div>
          <a href="/admin" className="rounded-full border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:border-neutral-950">
            Back To Dashboard
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-600">
            Showing page {safePage.toLocaleString()} of {totalPages.toLocaleString()}
          </p>
          <p className="text-sm text-neutral-600">{total.toLocaleString()} total inquiries</p>
        </div>

        <section className="grid gap-4 rounded-lg border border-neutral-200 bg-white p-6">
          {inquiries.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
          {inquiries.length === 0 && <p className="text-sm text-neutral-500">No inquiries submitted yet.</p>}
        </section>

        <nav className="flex items-center justify-between gap-4">
          {safePage > 1 ? (
            <a href={pageHref(safePage - 1)} className="rounded-full border border-neutral-300 bg-white px-5 py-2 text-sm hover:border-neutral-950">
              Previous
            </a>
          ) : (
            <span />
          )}

          {safePage < totalPages ? (
            <a href={pageHref(safePage + 1)} className="rounded-full border border-neutral-300 bg-white px-5 py-2 text-sm hover:border-neutral-950">
              Next
            </a>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </main>
  )
}
