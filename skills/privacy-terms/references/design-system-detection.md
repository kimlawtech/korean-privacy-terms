# 디자인 시스템 감지 규칙

프로젝트를 분석해 사용자의 UI 라이브러리·아이콘·테마·레이아웃 패턴을 파악하고, 생성될 컴포넌트의 variant를 자동 결정한다.

## 감지 우선순위 (위에서 먼저 확인)

### 1. UI 라이브러리 (package.json 스캔)

| 감지 단서 | 판정 | variant 기본값 |
|----------|------|---------------|
| `components.json` + shadcn config | **shadcn/ui** | `default` |
| `@chakra-ui/react` | **Chakra UI** | `chakra` (경고 후 Tailwind 변환) |
| `@mantine/core` | **Mantine** | `mantine` (경고 후 Tailwind 변환) |
| `@mui/material` | **MUI** | `mui` (경고 후 Tailwind 변환) |
| `daisyui` | **daisyUI** | `daisyui` |
| `@headlessui/react` + Tailwind | **Headless UI** | `headless` |
| `@radix-ui/*` (shadcn 없이) | **Radix 순정** | `radix` |
| Tailwind만 | **Tailwind 단독** | `plain-tailwind` |
| 아무것도 없음 | 감지 실패 | 사용자 확인 |

**중요**: shadcn/ui가 아닌 경우, 스킬 기본 컴포넌트(Dialog·Checkbox·Card)는 shadcn이므로 **2가지 선택**:
- (A) 사용자에게 "shadcn/ui를 설치해서 추가 사용할까요?" 제안
- (B) 프로젝트 기존 라이브러리에 맞게 컴포넌트 재작성 (복잡도 ↑)

기본은 (A). 사용자가 거절하면 (B)로 이동하거나 스킬 중단.

### 2. 아이콘 라이브러리

| 감지 | 사용 |
|------|-----|
| `lucide-react` | Lucide (기본) |
| `@heroicons/react` | Heroicons |
| `react-icons` | react-icons (프로바이더 추론) |
| `@tabler/icons-react` | Tabler |
| `@phosphor-icons/react` | Phosphor |
| 여러 개 공존 | 가장 많이 쓰인 것 우선, 없으면 Lucide |
| 감지 실패 | Lucide 자동 설치 |

**아이콘 매핑 테이블** (`components/icons/mapping.ts`로 외부화):

```ts
export const iconMap = {
  lucide: {
    shield: "ShieldCheck", file: "FileText", cookie: "Cookie",
    settings: "Settings2", close: "X", chevronUp: "ChevronUp",
    chevronDown: "ChevronDown", megaphone: "Megaphone",
    database: "Database", target: "Target", share: "Share2",
    handshake: "Handshake", userCheck: "UserCheck", headset: "Headset"
  },
  heroicons: {
    shield: "ShieldCheckIcon", file: "DocumentTextIcon",
    cookie: "BeakerIcon" /* 대체 */, settings: "Cog6ToothIcon",
    // ... (전체 매핑)
  },
  tabler: { /* ... */ },
  phosphor: { /* ... */ },
}
```

스킬은 감지된 아이콘 세트의 매핑을 적용.

### 3. CSS 변수 (globals.css 파싱)

다음 CSS 변수를 읽어 **모서리·색상·폰트**를 상속:

```css
:root {
  --radius: 0.5rem;              /* 0 / 0.25 / 0.5 / 1 → none / sm / md / lg */
  --primary: oklch(...) / hsl(); /* 브랜드 컬러 */
  --background: ...;
  --foreground: ...;
  --muted: ...;
  --border: ...;
  /* font-sans / font-display */
}
```

컴포넌트에서 사용:
- `rounded-[var(--radius)]` 대신 shadcn 기본 `rounded-lg`를 유지하면 자동 상속
- `text-primary`, `bg-primary`, `border-border` 전부 CSS 변수 경유

**감지 후 variant 결정**:
```
--radius < 0.2rem → 'sharp' (각진 스타일)
0.2rem ≤ --radius ≤ 0.6rem → 'default'
--radius > 0.6rem → 'rounded' (많이 둥근 스타일)
```

### 4. 테마 모드 (다크모드)

| 감지 단서 | 판정 |
|----------|------|
| `next-themes` 설치 + Provider 있음 | 다크모드 자동 대응 |
| `class="dark"` 토글 로직 있음 | 다크모드 수동 대응 |
| 감지 안 됨 | 라이트 전용 |

### 5. 레이아웃 패턴 분석 (기존 컴포넌트 카피)

`src/components/` 스캔해서 **가장 자주 쓰인 className 패턴** 추출:

```bash
# 예시 분석 로직
grep -rh "className=" src/components/ui/button.tsx | grep -oE "rounded-[a-z-]+" | sort | uniq -c | sort -rn | head -3
```

가장 많이 쓰인 `rounded-*` 값 → 전체 variant 기본값으로 채택.

동일하게 `shadow-*`, `border-*` 패턴도 추출.

### 6. Footer·헤더 구조

`src/app/layout.tsx`·`src/components/layout/` 확인:
- Footer에 링크 걸 위치 파악
- 네비게이션 스타일(중앙 정렬 / 좌우 분산) 파악

→ 스킬 완료 후 "Footer에 링크 추가 예시"를 **사용자 프로젝트 스타일에 맞춰** 제시.

## 판정 결과 표

감지 완료 후 내부적으로 다음 객체 구성:

```yaml
detected:
  uiLibrary: shadcn  # shadcn | chakra | mantine | mui | daisyui | headless | radix | plain-tailwind
  iconSet: lucide
  radius: default    # sharp | default | rounded
  darkMode: auto     # auto | manual | none
  patterns:
    commonRounded: rounded-lg
    commonShadow: shadow-sm
    commonBorder: border
  layout:
    footerStyle: centered  # centered | split | none
```

이 객체를 기반으로 컴포넌트 variant 자동 선택 → 인터뷰 Step 11에서 사용자 확인.

## 감지 실패 시 기본값

감지 결과가 불확실하면:
- uiLibrary: 사용자에게 물음
- iconSet: `lucide`
- radius: `default`
- darkMode: `auto`
- patterns: shadcn 기본값

## 자동 감지 후 사용자 확인 포맷

```
[프로젝트 분석 결과]
UI 라이브러리: shadcn/ui (감지됨)
아이콘: lucide-react (감지됨)
모서리: --radius 0.5rem → '기본(default)'
다크모드: next-themes 있음 → 자동 대응
기존 버튼 스타일: rounded-lg + shadow-sm

위 설정으로 생성할게요. 변경하고 싶은 게 있으시면 알려주세요.
없으면 "이대로"라고 답해주시면 넘어갑니다.
```

## 지원 매트릭스

| 라이브러리 | 지원 | 대응 |
|----------|------|------|
| shadcn/ui | ✅ 완전 | 기본 variant 그대로 |
| plain-tailwind | ✅ 완전 | shadcn 설치 후 진행 |
| Headless UI | ⚠️ 부분 | shadcn 설치 권장 |
| Radix 순정 | ⚠️ 부분 | shadcn 설치 권장 |
| daisyUI | ⚠️ 부분 | shadcn 설치 권장 |
| Chakra / Mantine / MUI | ❌ 이질적 | 사용자 명시 선택 필요 (shadcn 추가 설치 or 수동 변환) |

비-Tailwind 라이브러리(Chakra/Mantine/MUI)는 디자인 철학이 달라서 자동 변환 완벽히 어렵다. 사용자 선택:
1. shadcn을 추가로 설치하고 법률 UI만 shadcn으로 (권장)
2. 사용자가 직접 기존 컴포넌트로 감싸기 (스킬은 MDX·텍스트만 생성)
