"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Database,
  Target,
  Share2,
  Handshake,
  UserCheck,
  Headset,
  type LucideIcon,
} from "lucide-react"

type Label = {
  icon: LucideIcon
  title: string
  summary: string
  detail: string[]
}

type Layout = "grid" | "list"
type Density = "compact" | "comfortable"
type IconSet = "lucide" | "none"

type Props = {
  labels?: Label[]
  layout?: Layout
  density?: Density
  iconSet?: IconSet
  className?: string
}

const DEFAULT_LABELS: Label[] = [
  {
    icon: Database,
    title: "처리 항목",
    summary: "수집하는 개인정보",
    detail: [
      "필수: 이메일, 비밀번호",
      "선택: 프로필 이미지, 닉네임",
      "자동: IP, 쿠키, 서비스 이용 기록",
    ],
  },
  {
    icon: Target,
    title: "처리 목적",
    summary: "이용하는 목적",
    detail: [
      "회원 식별 및 서비스 제공",
      "고객 문의 응대",
      "서비스 개선 및 통계",
    ],
  },
  {
    icon: Share2,
    title: "제3자 제공",
    summary: "외부에 제공하지 않음",
    detail: ["법령에 따른 요청을 제외하고는 제3자에게 제공하지 않습니다."],
  },
  {
    icon: Handshake,
    title: "처리위탁",
    summary: "신뢰할 수 있는 업체",
    detail: [
      "AWS — 호스팅 (미국)",
      "Stripe — 결제 (미국)",
      "SendGrid — 이메일 발송 (미국)",
    ],
  },
  {
    icon: UserCheck,
    title: "정보주체 권리",
    summary: "열람·정정·삭제·처리정지·전송요구",
    detail: [
      "마이페이지에서 즉시 행사 가능",
      "법정대리인 대리 행사 가능 (14세 미만)",
      "처리 결과 지체 없이 통지",
    ],
  },
  {
    icon: Headset,
    title: "고충처리",
    summary: "개인정보 보호책임자",
    detail: [
      "이메일: privacy@example.com",
      "전화: 02-0000-0000",
      "분쟁조정: 1833-6972 (개인정보분쟁조정위원회)",
    ],
  },
]

export function LabelingCard({
  labels = DEFAULT_LABELS,
  layout = "grid",
  density = "comfortable",
  iconSet = "none",
  className,
}: Props) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)
  const showIcons = iconSet !== "none"

  const containerClass =
    layout === "grid"
      ? "grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 rounded-lg overflow-hidden border"
      : "flex flex-col divide-y border rounded-lg overflow-hidden"

  const cellPad = density === "compact" ? "p-4" : "p-5"

  return (
    <div className={`${containerClass} ${className ?? ""}`}>
      {labels.map((label, i) => {
        const Icon = label.icon
        const isOpen = openIndex === i
        return (
          <button
            type="button"
            key={label.title}
            onClick={() => setOpenIndex(isOpen ? null : i)}
            className={`bg-background text-left transition-colors hover:bg-muted/40 ${cellPad}`}
          >
            <div className="flex items-center gap-2">
              {showIcons && <Icon className="h-4 w-4 text-muted-foreground" />}
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {label.title}
              </span>
            </div>
            <p className="mt-2 text-sm text-foreground">{label.summary}</p>
            {isOpen && (
              <ul className="mt-3 space-y-1 border-t pt-3 text-xs text-muted-foreground">
                {label.detail.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            )}
          </button>
        )
      })}
    </div>
  )
}
