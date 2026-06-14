"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const VISITOR_KEY_STORAGE = "nueva_visitor_key"

function createVisitorKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getVisitorKey() {
  const existing = window.localStorage.getItem(VISITOR_KEY_STORAGE)
  if (existing) {
    return existing
  }

  const visitorKey = createVisitorKey()
  window.localStorage.setItem(VISITOR_KEY_STORAGE, visitorKey)
  return visitorKey
}

export function SiteAnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) {
      return
    }

    const visitorKey = getVisitorKey()
    const body = JSON.stringify({
      visitorKey,
      pathname,
      referrer: document.referrer,
    })

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track-view", new Blob([body], { type: "application/json" }))
      return
    }

    void fetch("/api/track-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      keepalive: true,
    })
  }, [pathname])

  return null
}
