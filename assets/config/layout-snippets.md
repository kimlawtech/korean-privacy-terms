# 레이아웃 스니펫 (폰트·테마·컴포넌트 연결)

스킬이 `src/app/layout.tsx`를 업데이트할 때 참고. 기존 layout을 **보존하면서 추가만** 한다.

## 1. Pretendard 폰트 (기본값)

### 방법 A: CDN 방식 (권장, 설치 불필요)

`src/app/layout.tsx` `<html>` 안 `<head>`에 링크 추가:

```tsx
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
/>
```

### 방법 B: next/font/local 방식 (프로덕션 권장)

1. 폰트 파일 다운로드 후 `public/fonts/pretendard/`에 배치 (사용자 안내)
2. layout.tsx:

```tsx
import localFont from "next/font/local"

const pretendard = localFont({
  src: "../../public/fonts/pretendard/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
})

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="font-pretendard antialiased">{children}</body>
    </html>
  )
}
```

## 2. globals.css에 Pretendard 등록

Tailwind v4:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --font-sans: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
    system-ui, sans-serif;
}
```

Tailwind v3 (`tailwind.config.ts`):

```ts
import type { Config } from "tailwindcss"

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Pretendard Variable"', "Pretendard", "sans-serif"],
      },
    },
  },
}
```

## 3. 흑백(모노크롬) 테마 (기본값)

`src/app/globals.css` 에 흑백 CSS 변수 추가:

```css
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --primary: #0a0a0a;
  --primary-foreground: #ffffff;
  --muted: #f5f5f5;
  --muted-foreground: #525252;
  --border: #e5e5e5;
  --input: #e5e5e5;
  --ring: #0a0a0a;
  --card: #ffffff;
  --card-foreground: #0a0a0a;
  --radius: 0.5rem;
}

.dark {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --primary: #fafafa;
  --primary-foreground: #0a0a0a;
  --muted: #262626;
  --muted-foreground: #a3a3a3;
  --border: #262626;
  --input: #262626;
  --ring: #fafafa;
  --card: #0a0a0a;
  --card-foreground: #fafafa;
}
```

## 4. 컴포넌트 연결

### CookieBanner (앱 전체)

```tsx
import { CookieBanner } from "@/components/legal/CookieBanner"

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
```

### ConsentModal (회원가입 폼)

```tsx
"use client"
import { useState } from "react"
import { ConsentModal, ConsentResult } from "@/components/legal/ConsentModal"

export default function SignupForm() {
  const [consentOpen, setConsentOpen] = useState(false)
  const [consent, setConsent] = useState<ConsentResult | null>(null)

  const handleSubmit = () => {
    setConsentOpen(true)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>{/* ... */}</form>
      <ConsentModal
        open={consentOpen}
        onOpenChange={setConsentOpen}
        serviceName="서비스명"
        onConfirm={(r) => {
          setConsent(r)
          // 실제 회원가입 API 호출
        }}
      />
    </>
  )
}
```

### Footer 링크

```tsx
<footer className="border-t py-6">
  <div className="container mx-auto flex gap-4 text-sm text-muted-foreground">
    <Link href="/privacy">개인정보처리방침</Link>
    <Link href="/terms">이용약관</Link>
  </div>
</footer>
```

## 5. 적용 순서

1. Pretendard CDN을 layout.tsx에 추가
2. globals.css에 흑백 테마 변수 + font-sans 지정
3. CookieBanner를 layout.tsx `{children}` 뒤에 삽입
4. Footer에 `/privacy`, `/terms` 링크 추가
5. 회원가입 페이지에 ConsentModal 연결 (사용자 몫)

## 참고

- Pretendard 공식 https://github.com/orioncactus/pretendard
- 흑백 모노크롬은 **법률 문서의 격에 맞는 기본값**이며, 사용자가 인터뷰 Step 9.5에서 "브랜드 컬러 사용" 선택 시 기존 `--primary` 유지
