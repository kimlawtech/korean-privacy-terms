"use client"

import * as React from "react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FileText, ShieldCheck, Megaphone, ChevronDown, ChevronUp } from "lucide-react"

type ConsentItem = {
  key: string
  label: string
  required: boolean
  href?: string
  description?: string
}

export type ConsentResult = Record<string, boolean>

type Variant = "default" | "compact" | "large" | "minimal"
type Size = "sm" | "md" | "lg" | "xl"
type IconSet = "lucide" | "none"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (result: ConsentResult) => void
  serviceName?: string
  items?: ConsentItem[]
  variant?: Variant
  size?: Size
  iconSet?: IconSet
}

const DEFAULT_ITEMS: ConsentItem[] = [
  {
    key: "terms",
    label: "이용약관 동의",
    required: true,
    href: "/terms",
    description: "서비스 이용에 필요한 기본 약관입니다.",
  },
  {
    key: "privacy",
    label: "개인정보 수집·이용 동의",
    required: true,
    href: "/privacy",
    description: "서비스 제공에 필요한 개인정보 처리에 동의합니다.",
  },
  {
    key: "age",
    label: "만 14세 이상입니다",
    required: true,
    description: "14세 미만인 경우 법정대리인 동의가 필요합니다.",
  },
  {
    key: "marketing",
    label: "마케팅 정보 수신 동의",
    required: false,
    description: "이벤트·혜택 정보를 이메일/SMS로 받습니다. 언제든지 수신거부 가능합니다.",
  },
]

const SIZE_MAP: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
}

const VARIANT_STYLES: Record<Variant, {
  container: string
  allBlock: string
  itemBlock: string
  itemPadding: string
  scrollHeight: string
  showIcons: boolean
  showSeparator: boolean
}> = {
  default: {
    container: "",
    allBlock: "rounded-lg border bg-muted/40 p-3",
    itemBlock: "rounded-lg border transition-colors hover:bg-muted/30",
    itemPadding: "p-3",
    scrollHeight: "h-[320px]",
    showIcons: true,
    showSeparator: true,
  },
  compact: {
    container: "",
    allBlock: "rounded-md border bg-muted/40 p-2",
    itemBlock: "rounded-md border-b transition-colors hover:bg-muted/20",
    itemPadding: "px-2 py-1.5",
    scrollHeight: "h-[240px]",
    showIcons: false,
    showSeparator: false,
  },
  large: {
    container: "",
    allBlock: "rounded-xl border-2 bg-muted/40 p-4",
    itemBlock: "rounded-xl border transition-colors hover:bg-muted/30",
    itemPadding: "p-4",
    scrollHeight: "h-[420px]",
    showIcons: true,
    showSeparator: true,
  },
  minimal: {
    container: "",
    allBlock: "py-2",
    itemBlock: "transition-colors",
    itemPadding: "py-2",
    scrollHeight: "h-[300px]",
    showIcons: false,
    showSeparator: true,
  },
}

export function ConsentModal({
  open,
  onOpenChange,
  onConfirm,
  serviceName = "서비스",
  items = DEFAULT_ITEMS,
  variant = "default",
  size = "md",
  iconSet = "lucide",
}: Props) {
  const [checked, setChecked] = React.useState<ConsentResult>({})
  const [expanded, setExpanded] = React.useState<string | null>(null)
  const v = VARIANT_STYLES[variant]
  const showIcons = iconSet !== "none" && v.showIcons

  const allRequiredChecked = items
    .filter((i) => i.required)
    .every((i) => checked[i.key])

  const allChecked = items.every((i) => checked[i.key])

  const toggleAll = (value: boolean) => {
    const next: ConsentResult = {}
    items.forEach((i) => (next[i.key] = value))
    setChecked(next)
  }

  const toggle = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleConfirm = () => {
    if (!allRequiredChecked) return
    onConfirm(checked)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={SIZE_MAP[size]}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {showIcons && <ShieldCheck className="h-5 w-5 text-primary" />}
            {serviceName} 이용 동의
          </DialogTitle>
          <DialogDescription>
            서비스 이용을 위해 아래 내용을 확인하고 동의해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className={`flex items-center gap-3 ${v.allBlock}`}>
          <Checkbox
            id="consent-all"
            checked={allChecked}
            onCheckedChange={(b) => toggleAll(Boolean(b))}
          />
          <label htmlFor="consent-all" className="flex-1 cursor-pointer font-medium">
            전체 동의
          </label>
        </div>

        {v.showSeparator && <Separator />}

        <ScrollArea className={`${v.scrollHeight} pr-2`}>
          <div className="space-y-2">
            {items.map((item) => {
              const isOpen = expanded === item.key
              return (
                <div key={item.key} className={`${v.itemBlock} ${v.itemPadding}`}>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`consent-${item.key}`}
                      checked={!!checked[item.key]}
                      onCheckedChange={() => toggle(item.key)}
                    />
                    <label
                      htmlFor={`consent-${item.key}`}
                      className="flex flex-1 cursor-pointer items-center gap-2"
                    >
                      {showIcons && item.key === "marketing" && (
                        <Megaphone className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>
                        <span
                          className={
                            item.required
                              ? "font-medium text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          [{item.required ? "필수" : "선택"}]
                        </span>{" "}
                        {item.label}
                      </span>
                    </label>
                    {item.href && (
                      <Link
                        href={item.href}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-primary hover:underline"
                      >
                        보기
                      </Link>
                    )}
                    {item.description && (
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : item.key)}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="상세 보기"
                      >
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                  {isOpen && item.description && (
                    <p className="mt-2 pl-8 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!allRequiredChecked}
            className="gap-2"
          >
            {showIcons && <FileText className="h-4 w-4" />}
            동의하고 계속
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
