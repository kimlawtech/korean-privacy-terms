# 자동 설치 스크립트

**E2E 검증 완료**: Next.js 16.2 + React 19 + Tailwind v4 + Turbopack 환경.
Next.js 13~15 + Tailwind v3도 호환 (하위 호환 유지).

## 1. 프로젝트 감지

```bash
# Next.js 확인 (13~16 지원)
cat package.json | grep '"next"'

# src/ 디렉토리 구조 확인 (매우 중요)
test -d src/app && echo "src-app-router" || (test -d app && echo "root-app-router" || echo "pages-router")

# Tailwind 버전 확인
grep -E '"tailwindcss":\s*"\^?4' package.json && echo "tw4" || echo "tw3"

# shadcn/ui 확인
test -f components.json && echo "shadcn-ok"

# MDX 지원 확인
grep -q "@next/mdx" package.json && echo "mdx-ok"

# Turbopack 사용 확인
grep -q "turbopack\|--turbo" package.json && echo "turbopack" || echo "webpack"
```

### 경로 결정 규칙

| 감지 결과 | 컴포넌트 경로 | 앱 경로 | MDX 콘텐츠 경로 | mdx-components.tsx 위치 |
|----------|-------------|--------|---------------|------------------------|
| `src-app-router` | `src/components/legal/` | `src/app/` | `src/content/legal/` | `src/mdx-components.tsx` |
| `root-app-router` | `components/legal/` | `app/` | `content/legal/` | `mdx-components.tsx` (루트) |
| `pages-router` | **중단** — App Router만 지원 | - | - | - |

`tsconfig.json`의 `paths["@/*"]`를 읽어 자동 결정. 보통 `./src/*` 또는 `./*`.

### 감지 실패 시 분기

| 미설치 | 조치 |
|--------|------|
| Next.js 없음 | 스킬 중단, 사용자에게 안내 |
| Pages Router | 스킬 중단 (App Router 마이그레이션 권장) |
| Tailwind 없음 | 스킬 중단 (프로젝트 초기화 부담 큼) |
| shadcn/ui 없음 | 2단계로 진행 |
| MDX 없음 | 3단계로 진행 |

## 2. shadcn/ui 초기화 및 컴포넌트 설치

```bash
# 초기화 (미설치 시에만)
# 주의: 2026년 기준 --base-color 등 일부 옵션 제거됨. -d가 안전.
npx shadcn@latest init -d

# 필요 컴포넌트
npx shadcn@latest add dialog button checkbox card separator scroll-area
```

Lucide는 shadcn 의존성에 자동 포함되므로 별도 설치 불필요.

## 3. MDX 설정

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx remark-gfm
npm install -D @tailwindcss/typography
```

### next.config.{ts,mjs} 업데이트

`assets/config/next.config.ts.tmpl` 파일 참조. 핵심 포인트:

```ts
import type { NextConfig } from "next"
import createMDX from "@next/mdx"

// 중요: Turbopack 호환을 위해 remarkPlugins는 문자열 형태로 전달
// 함수 참조(remarkGfm) 사용 시 "loader does not have serializable options" 에러
const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-gfm"]],
  },
})

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
}

export default withMDX(nextConfig)
```

**Webpack 전용** 프로젝트 (`next.config.mjs`)는 함수 참조도 가능:
```js
import remarkGfm from "remark-gfm"
// ...
options: { remarkPlugins: [remarkGfm] }
```

### mdx-components.tsx 생성

`assets/config/mdx-components.tsx.tmpl` 참조.

- src-app-router → `src/mdx-components.tsx`
- root-app-router → `mdx-components.tsx` (프로젝트 루트)

이 파일이 **없거나 위치가 틀리면 MDX 렌더링 런타임 에러**.

## 4. Typography 플러그인 (Tailwind v3 / v4 분기)

### Tailwind v3

`tailwind.config.ts`에 추가:
```ts
import type { Config } from "tailwindcss"

const config: Config = {
  // ...
  plugins: [require("@tailwindcss/typography")],
}
```

### Tailwind v4 (기본은 config 파일 없음)

`@plugin` 디렉티브를 `globals.css`에 추가:
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

Tailwind v4 + shadcn 프로젝트는 `src/app/globals.css`에 이미 `@import "tailwindcss"`가 있음.

## 4.5. Pretendard 폰트 + 흑백 테마 자동 적용 (기본값)

Step 9.5에서 사용자가 "이대로"를 선택했거나 명시적 거부가 없으면 **무조건** 수행.

### Pretendard 등록

`src/app/layout.tsx`의 `<html>` 내부에 Pretendard CDN 링크 삽입 (기존 코드 보존):

```tsx
<html lang="ko">
  <head>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
    />
  </head>
  {/* ... */}
</html>
```

### Tailwind v4에서 font-sans 교체

`src/app/globals.css`에 추가:

```css
@theme {
  --font-sans: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}
```

### 흑백 테마 CSS 변수 주입

`src/app/globals.css`의 `:root`와 `.dark`에 흑백 변수 덮어쓰기. 사용자가 기존 브랜드 컬러를 이미 설정했다면 **덮어쓰지 말고 확인 받음**.

구체 스니펫은 `assets/config/layout-snippets.md` 참조.

## 5. 디렉토리 생성

감지된 경로 기준:

```bash
# src-app-router 예시
mkdir -p src/app/privacy src/app/terms
mkdir -p src/components/legal
mkdir -p src/content/legal

# root-app-router 예시
mkdir -p app/privacy app/terms
mkdir -p components/legal
mkdir -p content/legal
```

## 6. 파일 복사 (스킬 → 프로젝트)

| 스킬 원본 | 프로젝트 타겟 (src-app-router) | 타겟 (root-app-router) |
|----------|----------------------------|----------------------|
| `assets/config/mdx-components.tsx.tmpl` | `src/mdx-components.tsx` | `mdx-components.tsx` |
| `assets/config/next.config.ts.tmpl` | `next.config.ts` (기존 파일 머지) | 동일 |
| `jurisdictions/kr-pipa/privacy-policy.ko.mdx.tmpl` (치환) | `src/content/legal/privacy-policy.mdx` | `content/legal/privacy-policy.mdx` |
| `jurisdictions/kr-pipa/terms-of-service.ko.mdx.tmpl` (치환) | `src/content/legal/terms-of-service.mdx` | `content/legal/terms-of-service.mdx` |
| `assets/components/PrivacyPage.tsx` | `src/app/privacy/page.tsx` | `app/privacy/page.tsx` |
| `assets/components/TermsPage.tsx` | `src/app/terms/page.tsx` | `app/terms/page.tsx` |
| `assets/components/ConsentModal.tsx` | `src/components/legal/ConsentModal.tsx` | `components/legal/ConsentModal.tsx` |
| `assets/components/CookieBanner.tsx` | `src/components/legal/CookieBanner.tsx` | `components/legal/CookieBanner.tsx` |
| `assets/components/LabelingCard.tsx` | `src/components/legal/LabelingCard.tsx` | `components/legal/LabelingCard.tsx` |

> **중요**: 기존 `next.config.{ts,mjs}`가 이미 있으면 **덮어쓰지 말고 머지**. `createMDX` 래퍼만 추가하고 사용자의 기존 설정은 보존.

## 7. tsconfig 경로 alias 확인

`@/*`가 올바르게 매핑되어 있어야 함:

```json
// src 구조
"paths": { "@/*": ["./src/*"] }

// root 구조
"paths": { "@/*": ["./*"] }
```

create-next-app은 기본으로 설정함. 누락 시 자동 추가.

## 8. 검증 단계

파일 복사 후 반드시 실행:

```bash
# 타입 체크
npx tsc --noEmit

# 빌드 테스트 (시간 들지만 확실)
npm run build
```

에러가 있으면 오류 복구 섹션 참조.

## 9. 사용자 가이드 출력

```
[설치 완료]

감지된 환경:
- Next.js {{version}} (App Router)
- Tailwind CSS {{v3|v4}}
- shadcn/ui: {{installed|newly-installed}}
- 소스 구조: {{src|root}}
- 번들러: {{turbopack|webpack}}

생성된 파일: (감지된 경로 기준)
- mdx-components.tsx
- content/legal/privacy-policy.mdx
- content/legal/terms-of-service.mdx
- app/privacy/page.tsx
- app/terms/page.tsx
- components/legal/ConsentModal.tsx
- components/legal/CookieBanner.tsx
- components/legal/LabelingCard.tsx

[다음 단계 — 직접 작업 필요]

1. app/layout.tsx에 CookieBanner 추가:
   import { CookieBanner } from "@/components/legal/CookieBanner"
   ...
   <body>
     {children}
     <CookieBanner />
   </body>

2. 회원가입 페이지에 ConsentModal 연결:
   import { ConsentModal } from "@/components/legal/ConsentModal"

3. Footer에 링크 추가:
   <Link href="/privacy">개인정보처리방침</Link>
   <Link href="/terms">이용약관</Link>

[경고]

본 초안은 2025.4.21 작성지침을 반영한 참고용입니다.
실제 서비스 배포 전 반드시 법률 검토를 받으세요.

- 과태료: 처리방침 미공개 시 5,000만원 이하
- 과징금: 매출액 최대 10% (2026.9.11 시행)
```

## 오류 복구

### Turbopack: "loader does not have serializable options" 에러

**원인**: `remarkPlugins: [remarkGfm]`처럼 함수 참조를 전달.

**해결**: 문자열 배열로 변경:
```ts
remarkPlugins: [["remark-gfm"]]
```

### "Module not found: @/content/legal/privacy-policy.mdx"

**원인 1**: tsconfig `paths` 설정이 실제 파일 위치와 안 맞음.
**해결**: src 구조면 `./src/*`, 루트 구조면 `./*`.

**원인 2**: `mdx-components.tsx`가 잘못된 위치에 있음.
**해결**: App Router는 **프로젝트 루트 혹은 src/ 바로 아래**에 있어야 자동 감지.

### shadcn init이 `--base-color` 옵션 거부

**원인**: shadcn CLI가 업데이트되며 옵션 제거됨 (2026년 기준).
**해결**: `npx shadcn@latest init -d`로 기본값 사용.

### Tailwind v4에서 `prose` 클래스 효과 없음

**원인**: `@tailwindcss/typography`를 CSS에 등록 안 함.
**해결**: `globals.css`에 `@plugin "@tailwindcss/typography";` 추가.

### /privacy 페이지가 404

**원인**: `pageExtensions`에 `mdx` 누락.
**해결**: `next.config.ts`에 `pageExtensions: ["ts","tsx","js","jsx","md","mdx"]` 추가.
