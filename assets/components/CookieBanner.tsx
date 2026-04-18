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

type Props = {
  policyHref?: string
  variant?: Variant
  iconSet?: IconSet
  /** 첫 방문 모달 차단형에서 사용. true면 동의 전 사이트 이용 불가 암시 */
  blocking?: boolean
}

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
}: Props) {
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
          <h3 className="font-semibold">쿠키 사용 안내</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            본 사이트는 이용자 경험 향상을 위해 쿠키를 사용합니다. 필수 쿠키는 서비스 제공에 필요하며, 그 외 쿠키는 선택 사항입니다.{" "}
            <Link href={policyHref} className="text-primary hover:underline">
              자세히 보기
            </Link>
          </p>
        </div>
        {!blocking && (
          <button
            onClick={() => setVisible(false)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="닫기"
          >
            {showIcons ? <X className="h-4 w-4" /> : <span>닫기</span>}
          </button>
        )}
      </div>

      {showSettings && (
        <div className="mt-4 space-y-3 rounded-lg border bg-muted/30 p-4">
          <CookieRow
            label="필수 쿠키"
            description="로그인, 보안 등 서비스 운영에 필수적입니다."
            checked
            disabled
          />
          <CookieRow
            label="기능 쿠키"
            description="언어 설정, 최근 본 항목 등 이용 편의를 제공합니다."
            checked={functional}
            onChange={setFunctional}
          />
          <CookieRow
            label="분석 쿠키"
            description="서비스 개선을 위한 방문 통계를 수집합니다."
            checked={analytics}
            onChange={setAnalytics}
          />
          <CookieRow
            label="광고 쿠키"
            description="관심사 기반 맞춤 광고에 활용됩니다."
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
          {showSettings ? "설정 숨기기" : "쿠키 설정"}
        </Button>
        <Button variant="outline" onClick={rejectAll}>
          모두 거부
        </Button>
        {showSettings ? (
          <Button onClick={acceptSelected}>선택 동의</Button>
        ) : (
          <Button onClick={acceptAll}>모두 동의</Button>
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
              쿠키 사용 동의
            </DialogTitle>
            <DialogDescription>
              서비스 제공 및 맞춤 경험을 위해 쿠키 사용을 허락해주세요.
            </DialogDescription>
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
}: {
  label: string
  description: string
  checked: boolean
  onChange?: (v: boolean) => void
  disabled?: boolean
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
              필수
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
