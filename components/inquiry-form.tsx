"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { CalendarIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { CmsContent } from "@/lib/cms-defaults"

const backdropIds = ["glass-house", "rooftop", "skyline", "beach", "white-cyc-wall", "custom"]

const eventTypes = ["Proposal", "Micro Wedding", "Birthday", "Bridal Shower", "Elopement", "Other"]
const LOCATION_YES = "Yes"
const LOCATION_NEEDS_RECOMMENDATIONS = "No - need recommendations"
const locationOptions = [LOCATION_YES, LOCATION_NEEDS_RECOMMENDATIONS]
const contactMethods = ["Text", "Phone Call", "Email", "Instagram DM", "TikTok DM"]
const addOnOptions = [
  "Sparkler Machines",
  "Violinist",
  "Mariachi",
  "Photographer",
  "Rose Bouquet",
  "Champagne",
  "Videographer",
]

const inputClasses =
  "bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 rounded-lg h-14"
const labelClasses = "text-neutral-500 text-sm tracking-wider uppercase"

const formatEventDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-4 pt-6">
      <span className="font-serif text-2xl italic text-neutral-900">{index}</span>
      <span className="text-sm tracking-[0.3em] uppercase text-neutral-500">{title}</span>
      <span className="flex-1 h-px bg-neutral-200" />
    </div>
  )
}

function ChipGroup({
  options,
  selected,
  onSelect,
  multi = false,
}: {
  options: string[]
  selected: string[]
  onSelect: (value: string) => void
  multi?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isActive = selected.includes(option)
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(option)}
            className={`px-5 py-2.5 text-sm tracking-wide border rounded-full transition-all ${
              isActive
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

export function InquiryForm({ content }: { content: CmsContent["inquiry"] }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const backdrops = content.backdrops.map((option, index) => ({
    id: backdropIds[index] || option.label.toLowerCase().replaceAll(" ", "-"),
    label: option.label,
    image: option.image,
  }))

  const [contactMethod, setContactMethod] = useState<string[]>([])
  const [eventType, setEventType] = useState<string>("")
  const [otherEventType, setOtherEventType] = useState("")
  const [desiredDate, setDesiredDate] = useState<Date | undefined>()
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [dateFlexible, setDateFlexible] = useState(false)
  const [locationSecured, setLocationSecured] = useState<string>("")
  const [locationDetails, setLocationDetails] = useState("")
  const [backdrop, setBackdrop] = useState<string>("")
  const [addOns, setAddOns] = useState<string[]>([])
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!notification) {
      return
    }

    const timeout = window.setTimeout(() => setNotification(null), 5000)
    return () => window.clearTimeout(timeout)
  }, [notification])

  const toggleMulti = (value: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const handleEventTypeSelect = (value: string) => {
    const nextEventType = eventType === value ? "" : value
    setEventType(nextEventType)
    if (nextEventType !== "Other") {
      setOtherEventType("")
    }
  }

  const handleDateFlexibleChange = (checked: boolean) => {
    setDateFlexible(checked)
    if (checked) {
      setDesiredDate(undefined)
      setDatePickerOpen(false)
    }
  }

  const handleLocationSecuredSelect = (value: string) => {
    const nextLocationSecured = locationSecured === value ? "" : value
    setLocationSecured(nextLocationSecured)

    if (nextLocationSecured !== LOCATION_YES) {
      setLocationDetails("")
    }
    if (nextLocationSecured !== LOCATION_NEEDS_RECOMMENDATIONS) {
      setBackdrop("")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const submittedEventType = eventType === "Other" ? otherEventType : eventType
    const submittedDesiredDate = dateFlexible ? "Flexible / TBD" : desiredDate ? formatEventDate(desiredDate) : ""
    const submittedBackdrop = backdrops.find((option) => option.id === backdrop)?.label || ""

    setIsSubmitting(true)
    setNotification(null)

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: String(formData.get("fullName") || ""),
          email: String(formData.get("email") || ""),
          phone: String(formData.get("phone") || ""),
          bestTimeToCall: String(formData.get("bestTimeToCall") || ""),
          contactMethods: contactMethod,
          socialHandle: String(formData.get("socialHandle") || ""),
          eventType: submittedEventType,
          desiredDate: submittedDesiredDate,
          preferredTime: String(formData.get("preferredTime") || ""),
          dateFlexible,
          locationSecured,
          locationDetails,
          backdrop: submittedBackdrop,
          addOns,
          vision: String(formData.get("vision") || ""),
        }),
      })

      if (!response.ok) {
        throw new Error("Inquiry request failed")
      }

      form.reset()
      setContactMethod([])
      setEventType("")
      setOtherEventType("")
      setDesiredDate(undefined)
      setDateFlexible(false)
      setLocationSecured("")
      setLocationDetails("")
      setBackdrop("")
      setAddOns([])
      setAgreed(false)
      setNotification({
        type: "success",
        message: content.successMessage,
      })
    } catch {
      setNotification({
        type: "error",
        message: content.errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section ref={sectionRef} id="inquiry" className="bg-white py-28 lg:py-44">
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-4 top-4 z-50 max-w-[calc(100vw-2rem)] rounded-lg border px-4 py-3 text-sm shadow-lg md:right-6 md:top-6 ${
            notification.type === "success"
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-red-200 bg-white text-red-700"
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                notification.type === "success" ? "bg-white" : "bg-red-500"
              }`}
              aria-hidden="true"
            />
            <p>{notification.message}</p>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className={`ml-2 text-xs uppercase tracking-wider ${
                notification.type === "success" ? "text-white/70 hover:text-white" : "text-red-400 hover:text-red-700"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        >
          <p className="text-xs tracking-[0.35em] uppercase text-neutral-400 mb-6">{content.eyebrow}</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900">{content.titleLine1}</h2>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 italic mt-2">
            {content.titleLine2}
          </h2>
          <p className="mt-8 text-neutral-500 leading-relaxed max-w-xl mx-auto">{content.description}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        >
          {/* Section 1 — Contact */}
          <SectionHeading index="01" title={content.contactTitle} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="name" className={labelClasses}>
                {content.fullNameLabel}
              </Label>
              <Input id="name" name="fullName" placeholder={content.fullNamePlaceholder} className={inputClasses} required />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className={labelClasses}>
                {content.emailLabel}
              </Label>
              <Input id="email" name="email" type="email" placeholder={content.emailPlaceholder} className={inputClasses} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="phone" className={labelClasses}>
                {content.phoneLabel}
              </Label>
              <Input id="phone" name="phone" type="tel" placeholder={content.phonePlaceholder} className={inputClasses} required />
            </div>
            <div className="space-y-3">
              <Label htmlFor="best-time" className={labelClasses}>
                {content.bestTimeLabel}
              </Label>
              <Input id="best-time" name="bestTimeToCall" placeholder={content.bestTimePlaceholder} className={inputClasses} />
            </div>
          </div>
          <div className="space-y-4">
            <Label className={labelClasses}>{content.communicationLabel}</Label>
            <ChipGroup
              options={contactMethods}
              selected={contactMethod}
              onSelect={(v) => toggleMulti(v, contactMethod, setContactMethod)}
              multi
            />
          </div>

          {/* Section 2 — Social */}
          <SectionHeading index="02" title={content.socialTitle} />
          <div className="space-y-3">
            <Label htmlFor="handle" className={labelClasses}>
              {content.socialHandleLabel}
            </Label>
            <Input id="handle" name="socialHandle" placeholder={content.socialHandlePlaceholder} className={inputClasses} />
            <p className="text-neutral-400 text-sm italic leading-relaxed">
              {content.socialNote}
            </p>
          </div>

          {/* Section 3 — Your Event */}
          <SectionHeading index="03" title={content.eventTitle} />
          <div className="space-y-4">
            <Label className={labelClasses}>{content.eventTypeLabel}</Label>
            <ChipGroup
              options={eventTypes}
              selected={eventType ? [eventType] : []}
              onSelect={handleEventTypeSelect}
            />
            {eventType === "Other" && (
              <div className="space-y-3 pt-2">
                <Label htmlFor="other-event-type" className={labelClasses}>
                  {content.otherEventLabel}
                </Label>
                <Input
                  id="other-event-type"
                  value={otherEventType}
                  onChange={(e) => setOtherEventType(e.target.value)}
                  placeholder={content.otherEventPlaceholder}
                  className={inputClasses}
                  required
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="date" className={labelClasses}>
                {content.desiredDateLabel}
              </Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <button
                    id="date"
                    type="button"
                    disabled={dateFlexible}
                    className={`${inputClasses} flex w-full items-center justify-between border px-4 text-left text-base font-normal disabled:opacity-40`}
                  >
                    <span className={desiredDate ? "text-neutral-900" : "text-neutral-400"}>
                      {dateFlexible ? "Flexible / TBD" : desiredDate ? formatEventDate(desiredDate) : content.datePlaceholder}
                    </span>
                    <CalendarIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto border-neutral-200 p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={desiredDate}
                    onSelect={(date) => {
                      setDesiredDate(date)
                      if (date) {
                        setDatePickerOpen(false)
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
              <label className="flex items-center gap-3 pt-1 cursor-pointer">
                <Checkbox
                  checked={dateFlexible}
                  onCheckedChange={(c) => handleDateFlexibleChange(c === true)}
                  className="border-neutral-300 data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900 rounded-sm"
                />
                <span className="text-neutral-500 text-sm">{content.flexibleDateText}</span>
              </label>
            </div>
            <div className="space-y-3">
              <Label htmlFor="time" className={labelClasses}>
                {content.preferredTimeLabel}
              </Label>
              <Input id="time" name="preferredTime" placeholder={content.preferredTimePlaceholder} className={inputClasses} />
            </div>
          </div>
          <div className="space-y-4">
            <Label className={labelClasses}>{content.locationQuestion}</Label>
            <ChipGroup
              options={locationOptions}
              selected={locationSecured ? [locationSecured] : []}
              onSelect={handleLocationSecuredSelect}
            />
            {locationSecured === LOCATION_YES && (
              <div className="space-y-3 pt-2">
                <Label htmlFor="location-details" className={labelClasses}>
                  {content.locationDetailsLabel}
                </Label>
                <Input
                  id="location-details"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder={content.locationDetailsPlaceholder}
                  className={inputClasses}
                  required
                />
              </div>
            )}
          </div>

          {locationSecured === LOCATION_NEEDS_RECOMMENDATIONS && (
            <>
              {/* Section 4 — Choose Your Inspiration */}
              <SectionHeading index="04" title={content.inspirationTitle} />
              <p className="text-neutral-500 text-sm leading-relaxed -mt-2">
                {content.inspirationDescription}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {backdrops.map((option) => {
                  const isActive = backdrop === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setBackdrop(isActive ? "" : option.id)}
                      className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/40"
                    >
                      <Image
                        src={option.image || "/placeholder.svg"}
                        alt={`${option.label} proposal backdrop`}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div
                        className={`absolute inset-0 transition-all duration-300 ${
                          isActive
                            ? "bg-neutral-900/20 ring-2 ring-inset ring-neutral-900"
                            : "bg-neutral-900/10 group-hover:bg-neutral-900/5"
                        }`}
                      />
                      {isActive && (
                        <span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                      <span className="absolute inset-x-0 bottom-0 p-3 text-left text-white text-sm tracking-wider uppercase drop-shadow-md">
                        {option.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {/* Section 5 — Vision & Add-ons */}
          <SectionHeading index="05" title={content.visionTitle} />
          <div className="space-y-4">
            <Label className={labelClasses}>{content.addOnsLabel}</Label>
            <ChipGroup
              options={addOnOptions}
              selected={addOns}
              onSelect={(v) => toggleMulti(v, addOns, setAddOns)}
              multi
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="vision" className={labelClasses}>
              {content.visionLabel}
            </Label>
            <Textarea
              id="vision"
              name="vision"
              placeholder={content.visionPlaceholder}
              rows={6}
              className="bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 rounded-lg resize-none"
            />
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 pt-4 cursor-pointer">
            <Checkbox
              checked={agreed}
              onCheckedChange={(c) => setAgreed(c === true)}
              className="mt-1 border-neutral-300 data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900 rounded-sm"
            />
            <span className="text-neutral-500 text-sm leading-relaxed">
              {content.termsText}
            </span>
          </label>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={!agreed || isSubmitting}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white h-16 text-sm tracking-widest uppercase rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? content.submittingButton : content.submitButton}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
