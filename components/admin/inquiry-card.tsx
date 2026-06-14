export type AdminInquiry = {
  id: string
  full_name: string
  email: string
  phone: string | null
  event_type: string | null
  desired_date: string | null
  location_secured: string | null
  location_details: string | null
  vision: string | null
  created_at: string
}

export function formatInquiryDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function InquiryCard({ inquiry }: { inquiry: AdminInquiry }) {
  return (
    <article className="rounded-md border border-neutral-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">{inquiry.full_name}</h3>
          <p className="text-sm text-neutral-500">
            {inquiry.email}
            {inquiry.phone ? ` | ${inquiry.phone}` : ""}
          </p>
        </div>
        <time className="text-sm text-neutral-500">{formatInquiryDate(inquiry.created_at)}</time>
      </div>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
        <p>
          <span className="text-neutral-500">Event:</span> {inquiry.event_type || "Not provided"}
        </p>
        <p>
          <span className="text-neutral-500">Date:</span> {inquiry.desired_date || "Not provided"}
        </p>
        <p>
          <span className="text-neutral-500">Location:</span>{" "}
          {inquiry.location_details || inquiry.location_secured || "Not provided"}
        </p>
      </div>
      {inquiry.vision && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-600">{inquiry.vision}</p>}
    </article>
  )
}
