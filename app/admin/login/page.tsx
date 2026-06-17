import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ADMIN_COOKIE_NAME, adminSessionMaxAge, createAdminSessionValue, isAdminConfigured } from "@/lib/admin-auth"

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string
  }>
}

async function login(formData: FormData) {
  "use server"

  const password = String(formData.get("password") || "")
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login?error=1")
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/admin",
  })
  cookieStore.set(ADMIN_COOKIE_NAME, createAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: adminSessionMaxAge(),
    path: "/",
  })

  redirect("/admin")
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="w-full space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Nueva Proposals</p>
            <h1 className="mt-4 font-serif text-5xl font-light">Admin</h1>
          </div>

          {!isAdminConfigured() ? (
            <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-5 text-sm leading-relaxed text-amber-100">
              Add an <code className="font-mono">ADMIN_PASSWORD</code> environment variable before using the dashboard.
            </div>
          ) : (
            <form action={login} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="h-14 w-full rounded-md border border-neutral-700 bg-neutral-900 px-4 text-white outline-none transition focus:border-white"
                />
              </div>
              {params?.error && <p className="text-sm text-red-300">That password did not match.</p>}
              <button
                type="submit"
                className="h-14 w-full rounded-full bg-white text-sm font-medium uppercase tracking-[0.2em] text-neutral-950 transition hover:bg-neutral-200"
              >
                Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
