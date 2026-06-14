import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ADMIN_COOKIE_NAME, verifyAdminSessionValue } from "@/lib/admin-auth"
import { getSql } from "@/lib/db"
import { InquiryCard, type AdminInquiry } from "@/components/admin/inquiry-card"

type SummaryRow = {
  total_views: number
  unique_visitors: number
  views_today: number
  new_visitors_today: number
  inquiries_total: number
  inquiries_today: number
}

type TimeSeriesRow = {
  label: string
  views: number
  unique_visitors: number
}

type CountryRow = {
  country: string
  views: number
  unique_visitors: number
}

async function logout() {
  "use server"

  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
  redirect("/admin/login")
}

function maxViews(rows: TimeSeriesRow[]) {
  return Math.max(1, ...rows.map((row) => row.views))
}

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{label}</p>
      <p className="mt-3 text-3xl font-medium text-neutral-950">{value.toLocaleString()}</p>
    </div>
  )
}

function TimeSeriesList({ rows }: { rows: TimeSeriesRow[] }) {
  const max = maxViews(rows)

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[5.5rem_1fr_5rem] items-center gap-3 text-sm">
          <span className="text-neutral-500">{row.label}</span>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full rounded-full bg-neutral-950" style={{ width: `${Math.max(4, (row.views / max) * 100)}%` }} />
          </div>
          <span className="text-right text-neutral-700">
            {row.views.toLocaleString()} / {row.unique_visitors.toLocaleString()}
          </span>
        </div>
      ))}
      {rows.length === 0 && <p className="text-sm text-neutral-500">No views recorded yet.</p>}
    </div>
  )
}

async function getDashboardData() {
  const sql = getSql()

  const [summaryRows, dailyRows, monthlyRows, countryRows, inquiryRows] = await Promise.all([
    sql`
      select
        (select count(*)::int from page_views) as total_views,
        (select count(distinct visitor_key)::int from page_views) as unique_visitors,
        (select count(*)::int from page_views where created_at >= current_date) as views_today,
        (select count(*)::int from visitors where first_seen_at >= current_date) as new_visitors_today,
        (select count(*)::int from inquiries) as inquiries_total,
        (select count(*)::int from inquiries where created_at >= current_date) as inquiries_today
    `,
    sql`
      select
        to_char(date_trunc('day', created_at), 'Mon DD') as label,
        count(*)::int as views,
        count(distinct visitor_key)::int as unique_visitors
      from page_views
      where created_at >= now() - interval '14 days'
      group by date_trunc('day', created_at)
      order by date_trunc('day', created_at) desc
    `,
    sql`
      select
        to_char(date_trunc('month', created_at), 'Mon YYYY') as label,
        count(*)::int as views,
        count(distinct visitor_key)::int as unique_visitors
      from page_views
      where created_at >= now() - interval '12 months'
      group by date_trunc('month', created_at)
      order by date_trunc('month', created_at) desc
    `,
    sql`
      select
        coalesce(country, 'Unknown') as country,
        count(*)::int as views,
        count(distinct visitor_key)::int as unique_visitors
      from page_views
      group by country
      order by views desc
      limit 10
    `,
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
      limit 2
    `,
  ])

  return {
    summary: summaryRows[0] as SummaryRow,
    dailyRows: dailyRows as TimeSeriesRow[],
    monthlyRows: monthlyRows as TimeSeriesRow[],
    countryRows: countryRows as CountryRow[],
    inquiryRows: inquiryRows as AdminInquiry[],
  }
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  if (!verifyAdminSessionValue(session)) {
    redirect("/admin/login")
  }

  const { summary, dailyRows, monthlyRows, countryRows, inquiryRows } = await getDashboardData()

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Nueva Proposals</p>
            <h1 className="font-serif text-4xl font-light">Admin Dashboard</h1>
          </div>
          <form action={logout}>
            <button type="submit" className="rounded-full border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:border-neutral-950">
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <section className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatBlock label="Total Views" value={summary.total_views} />
          <StatBlock label="Unique Visitors" value={summary.unique_visitors} />
          <StatBlock label="Views Today" value={summary.views_today} />
          <StatBlock label="New Today" value={summary.new_visitors_today} />
          <StatBlock label="Inquiries" value={summary.inquiries_total} />
          <StatBlock label="Inquiries Today" value={summary.inquiries_today} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-medium">Daily Views</h2>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Views / Unique</p>
            </div>
            <TimeSeriesList rows={dailyRows} />
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-medium">Monthly Views</h2>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Views / Unique</p>
            </div>
            <TimeSeriesList rows={monthlyRows} />
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-medium">Top Countries</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="border-b border-neutral-200 text-xs uppercase tracking-[0.18em] text-neutral-400">
                <tr>
                  <th className="py-3 font-medium">Country</th>
                  <th className="py-3 font-medium">Views</th>
                  <th className="py-3 font-medium">Unique Visitors</th>
                </tr>
              </thead>
              <tbody>
                {countryRows.map((row) => (
                  <tr key={row.country} className="border-b border-neutral-100">
                    <td className="py-3">{row.country}</td>
                    <td className="py-3">{row.views.toLocaleString()}</td>
                    <td className="py-3">{row.unique_visitors.toLocaleString()}</td>
                  </tr>
                ))}
                {countryRows.length === 0 && (
                  <tr>
                    <td className="py-4 text-neutral-500" colSpan={3}>
                      No location data recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-medium">Recent Inquiries</h2>
            <a
              href="/admin/inquiries"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-950 hover:text-neutral-950"
            >
              See All
            </a>
          </div>
          <div className="grid gap-4">
            {inquiryRows.map((inquiry) => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} />
            ))}
            {inquiryRows.length === 0 && <p className="text-sm text-neutral-500">No inquiries submitted yet.</p>}
          </div>
        </section>
      </div>
    </main>
  )
}
