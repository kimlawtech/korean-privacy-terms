"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Cookie, Settings2, X } from "lucide-react"

export type CookieConsent = {
  essential: true
  analytics: boolean
  marketing: boolean
  functional: boolean
}

type Variant = "bottom-bar" | "floating" | "top-bar" | "center-modal"
type IconSet = "lucide" | "none"
type Locale = "ko" | "en"

type Props = {
  policyHref?: string
  variant?: Variant
  iconSet?: IconSet
  /** 첫 방문 모달 차단형에서 사용. true면 동의 전 사이트 이용 불가 암시 */
  blocking?: boolean
  locale?: Locale
}

const LABELS = {
  ko: {
    heading: "쿠키 사용 안내",
    description:
      "본 사이트는 이용자 경험 향상을 위해 쿠키를 사용합니다. 필수 쿠키는 서비스 제공에 필요하며, 그 외 쿠키는 선택 사항입니다.",
    learnMore: "자세히 보기",
    close: "닫기",
    modalTitle: "쿠키 사용 동의",
    modalDescription: "서비스 제공 및 맞춤 경험을 위해 쿠키 사용을 허락해주세요.",
    hideSettings: "설정 숨기기",
    openSettings: "쿠키 설정",
    rejectAll: "모두 거부",
    acceptSelected: "선택 동의",
    acceptAll: "모두 동의",
    essentialLabel: "필수 쿠키",
    essentialDesc: "로그인, 보안 등 서비스 운영에 필수적입니다.",
    functionalLabel: "기능 쿠키",
    functionalDesc: "언어 설정, 최근 본 항목 등 이용 편의를 제공합니다.",
    analyticsLabel: "분석 쿠키",
    analyticsDesc: "서비스 개선을 위한 방문 통계를 수집합니다.",
    marketingLabel: "광고 쿠키",
    marketingDesc: "관심사 기반 맞춤 광고에 활용됩니다.",
    requiredBadge: "필수",
  },
  en: {
    heading: "Cookie Notice",
    description:
      "This site uses cookies to improve your experience. Essential cookies are required to operate the site; others are optional.",
    learnMore: "Learn more",
    close: "Close",
    modalTitle: "Cookie Consent",
    modalDescription: "Please allow cookies to enable service delivery and personalized experience.",
    hideSettings: "Hide settings",
    openSettings: "Cookie settings",
    rejectAll: "Reject all",
    acceptSelected: "Accept selected",
    acceptAll: "Accept all",
    essentialLabel: "Essential",
    essentialDesc: "Required for login, security, and core service operations.",
    functionalLabel: "Functional",
    functionalDesc: "Language, recently viewed items, and other convenience features.",
    analyticsLabel: "Analytics",
    analyticsDesc: "Collects visit statistics to improve the service.",
    marketingLabel: "Advertising",
    marketingDesc: "Used for interest-based personalized advertising.",
    requiredBadge: "Required",
  },
} as const

const STORAGE_KEY = "cookie-consent"

function loadConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CookieConsent
  } catch {
    return null
  }
}

function saveConsent(consent: CookieConsent) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
  window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: consent }))
}

export function useCookieConsent() {
  const [consent, setConsent] = React.useState<CookieConsent | null>(null)

  React.useEffect(() => {
    setConsent(loadConsent())
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<CookieConsent>).detail
      setConsent(detail)
    }
    window.addEventListener("cookie-consent-changed", handler)
    return () => window.removeEventListener("cookie-consent-changed", handler)
  }, [])

  return consent
}

const POSITION_CLASS: Record<Variant, string> = {
  "bottom-bar": "fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6",
  "floating": "fixed bottom-4 right-4 z-50 max-w-sm sm:bottom-6 sm:right-6",
  "top-bar": "fixed inset-x-0 top-0 z-50 p-4 sm:p-6",
  "center-modal": "",
}

const WRAPPER_CLASS: Record<Variant, string> = {
  "bottom-bar": "mx-auto max-w-3xl rounded-xl border bg-background/95 p-5 shadow-xl backdrop-blur",
  "floating": "rounded-xl border bg-background/95 p-5 shadow-xl backdrop-blur",
  "top-bar": "mx-auto max-w-3xl rounded-xl border bg-background/95 p-5 shadow-xl backdrop-blur",
  "center-modal": "",
}

export function CookieBanner({
  policyHref = "/privacy",
  variant = "bottom-bar",
  iconSet = "lucide",
  blocking = false,
  locale = "ko",
}: Props) {
  const t = LABELS[locale]
  const [mounted, setMounted] = React.useState(false)
  const [visible, setVisible] = React.useState(false)
  const [showSettings, setShowSettings] = React.useState(false)
  const [analytics, setAnalytics] = React.useState(true)
  const [marketing, setMarketing] = React.useState(false)
  const [functional, setFunctional] = React.useState(true)

  React.useEffect(() => {
    setMounted(true)
    const existing = loadConsent()
    if (!existing) setVisible(true)
  }, [])

  if (!mounted || !visible) return null

  const acceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true, functional: true })
    setVisible(false)
  }

  const acceptSelected = () => {
    saveConsent({ essential: true, analytics, marketing, functional })
    setVisible(false)
  }

  const rejectAll = () => {
    saveConsent({ essential: true, analytics: false, marketing: false, functional: false })
    setVisible(false)
  }

  const showIcons = iconSet !== "none"

  const body = (
    <>
      <div className="flex items-start gap-3">
        {showIcons && (
          <div className="rounded-full bg-primary/10 p-2">
            <Cookie className="h-5 w-5 text-primary" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold">{t.heading}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.description}{" "}
            <Link href={policyHref} className="text-primary hover:underline">
              {t.learnMore}
            </Link>
          </p>
        </div>
        {!blocking && (
          <button
            onClick={() => setVisible(false)}
            className="text-muted-foreground hover:text-foreground"
            aria-label={t.close}
          >
            {showIcons ? <X className="h-4 w-4" /> : <span>{t.close}</span>}
          </button>
        )}
      </div>

      {showSettings && (
        <div className="mt-4 space-y-3 rounded-lg border bg-muted/30 p-4">
          <CookieRow
            label={t.essentialLabel}
            description={t.essentialDesc}
            checked
            disabled
            requiredBadge={t.requiredBadge}
          />
          <CookieRow
            label={t.functionalLabel}
            description={t.functionalDesc}
            checked={functional}
            onChange={setFunctional}
          />
          <CookieRow
            label={t.analyticsLabel}
            description={t.analyticsDesc}
            checked={analytics}
            onChange={setAnalytics}
          />
          <CookieRow
            label={t.marketingLabel}
            description={t.marketingDesc}
            checked={marketing}
            onChange={setMarketing}
          />
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="ghost"
          onClick={() => setShowSettings((s) => !s)}
          className="gap-2"
        >
          {showIcons && <Settings2 className="h-4 w-4" />}
          {showSettings ? t.hideSettings : t.openSettings}
        </Button>
        <Button variant="outline" onClick={rejectAll}>
          {t.rejectAll}
        </Button>
        {showSettings ? (
          <Button onClick={acceptSelected}>{t.acceptSelected}</Button>
        ) : (
          <Button onClick={acceptAll}>{t.acceptAll}</Button>
        )}
      </div>
    </>
  )

  if (variant === "center-modal") {
    return (
      <Dialog open={visible} onOpenChange={blocking ? undefined : setVisible}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {showIcons && <Cookie className="h-5 w-5 text-primary" />}
              {t.modalTitle}
            </DialogTitle>
            <DialogDescription>{t.modalDescription}</DialogDescription>
          </DialogHeader>
          <div className="mt-2">{body}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className={POSITION_CLASS[variant]}>
      <div className={WRAPPER_CLASS[variant]}>{body}</div>
    </div>
  )
}

function CookieRow({
  label,
  description,
  checked,
  onChange,
  disabled,
  requiredBadge = "필수",
}: {
  label: string
  description: string
  checked: boolean
  onChange?: (v: boolean) => void
  disabled?: boolean
  requiredBadge?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={(v) => onChange?.(Boolean(v))}
        className="mt-0.5"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{label}</span>
          {disabled && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {requiredBadge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
