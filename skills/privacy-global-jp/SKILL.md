---
name: privacy-global-jp
description: 한국+일본 병기 처리방침·이용약관 자동 생성. 한국 본사가 일본 사용자까지 대상으로 서비스할 때 사용. 한국어(PIPA)·일본어(APPI) 두 세트 문서를 동시 생성하고, Footer에 언어·관할 전환 링크 자동 삽입.
license: Apache-2.0
version: 1.0.0
---

# privacy-global-jp — 한국+일본 병기 전용 스킬

## 호출 즉시 출력

```
한국+일본 병기 모드로 시작합니다.

생성될 문서
  /privacy, /terms          — 한국어 (PIPA + 약관규제법 + 전자상거래법)
  /jp/privacy, /jp/terms    — 일본어 (APPI + 消費者契約法 + 特定商取引法)

공통 질문은 한 번만, 관할별 고유 질문은 각각 묻습니다.
시작해볼게요.
```

## 법령 근거 (MUST READ)

한국·일본 양쪽 레퍼런스 전부 필독:

- `./references/law-checklist-2026.md` (한국 법령)
- `./references/guideline-2025-04.md`
- `./references/automated-decision.md`
- `./references/data-portability.md`
- `./references/ftc-standard-terms.md`
- `./references/behavioral-info.md`
- `./references/service-type-matrix.md`
- `./references/glossary.md`
- `./references/design-system-detection.md`
- `./references/appi-jp.md` (일본 APPI)
- `./jurisdictions/jp-appi/appi-checklist.md`

## 인터뷰 범위

`./scripts/interview.md`에서 다음 수행:

**공통 1회 (한국+일본 함께 쓰임)**
- Step 1 서비스 소개
- Step 2 수집 항목
- Step 6 처리위탁 (처리위탁 + 해외 제3자 제공 양쪽 반영)
- Step 9 시행일

**한국 전용**
- Step 3 수집 방법
- Step 4 처리 목적 (한국식)
- Step 5 제3자 제공 (한국식)
- Step 7 CPO

**일본 전용 (Step 9-JP 전부)**
- Q9JP-1~11

**통합 (둘 다 영향)**
- Step 8 특수 상황 — **아동 기준: 한국 14세, 일본 15세 → 더 엄격한 15세 기준으로 통일 권장**
- Step 10 디자인 (CookieBanner 일본어 locale 추가)
- Step 11 최종 확인

## 사용 템플릿 (4종 전부)

```
한국 세트
  ./jurisdictions/kr-pipa/privacy-policy.ko.mdx.tmpl → /privacy
  ./jurisdictions/kr-pipa/terms-of-service.ko.mdx.tmpl → /terms

일본 세트
  ./jurisdictions/jp-appi/privacy-policy.ja.mdx.tmpl → /jp/privacy
  ./jurisdictions/jp-appi/terms-of-service.ja.mdx.tmpl → /jp/terms
```

## 생성 대상 파일 (src-app 기준)

```
src/mdx-components.tsx

src/content/legal/privacy-policy.mdx          (한국어)
src/content/legal/terms-of-service.mdx        (한국어)
src/content/legal/jp/privacy-policy.mdx       (일본어)
src/content/legal/jp/terms-of-service.mdx     (일본어)

src/app/privacy/page.tsx                      locale="ko"
src/app/terms/page.tsx                        locale="ko"
src/app/jp/privacy/page.tsx                   locale="ja"
src/app/jp/terms/page.tsx                     locale="ja"

src/components/legal/ConsentModal.tsx         locale="ko"|"ja" 지원
src/components/legal/CookieBanner.tsx         locale="ko"|"ja" 지원
src/components/legal/LabelingCard.tsx
src/components/legal/LocaleSwitch.tsx         한국어·日本語 전환 링크
```

## LocaleSwitch 컴포넌트

Footer에 넣는 언어·관할 전환 링크:

```tsx
<LocaleSwitch
  currentLocale="ko"
  options={[
    { locale: "ko", label: "한국어", href: "/privacy" },
    { locale: "ja", label: "日本語", href: "/jp/privacy" },
  ]}
/>
```

## 치환 프로토콜

`./scripts/render.md`의 **"병기 관할 치환 (kr-pipa + jp-appi)"** 섹션에 따라 두 세트 동시 생성.

아동 기준: Step 8 + Q9JP-7 두 질문으로 한국(14세)·일본(15세)을 각각 확인. 통일 기준을 사용자에게 제시.

해외 제3자 제공:
- 한국 PIPA: 정보주체 동의 + 해외 이전 계약 체결
- 일본 APPI 第28条: 동의·동등성·충분한 체제 세 경로 중 선택

## 검증 (양쪽 각각)

한국 세트:
- 법 §30 11개 항목 포함
- 2025.4 지침·2026.9 신규 조항

일본 세트:
- APPI 第32条 보유개인데이터 필수 공표 항목
- 第27조 제3자 제공 관련 사항
- 第28条 해외 제3자 제공 (해당 시)
- 第33~39条 정보 주체 5대 권리
- 苦情申出先 (고충처리 창구) 명기

## 완료 출력

```
[생성 완료]

한국어 (PIPA)
- src/content/legal/privacy-policy.mdx
- src/content/legal/terms-of-service.mdx
- src/app/privacy/page.tsx, src/app/terms/page.tsx

일본어 (APPI + 消費者契約法 + 特定商取引法)
- src/content/legal/jp/privacy-policy.mdx
- src/content/legal/jp/terms-of-service.mdx
- src/app/jp/privacy/page.tsx, src/app/jp/terms/page.tsx

공통 컴포넌트
- ConsentModal (ko/ja), CookieBanner (ko/ja), LabelingCard, LocaleSwitch

[검증]
- 한국 §30 11개 항목 ✓
- 일본 APPI 第32条 공표 사항 ✓
- 特定商取引法 표기 ✓ (전자상거래 시)
- 해외 제3자 제공 조치 ✓

[다음 단계]
1. app/layout.tsx에 <CookieBanner /> 단일 배치 (locale은 사용자 브라우저 기반)
2. Footer에 <LocaleSwitch /> 배치
3. 회원가입 폼에 <ConsentModal locale={userLocale} /> 연결
4. 한국·일본 양쪽 변호사 검토 필수
5. 일본 전자상거래 서비스: 特定商取引法 표기 별도 페이지(/tokutei) 작성 권장

[중요]
과태료: 한국 최대 매출 3%(2026.9~), 일본 最大 1億円.
배포 전 양 관할 법률 전문가 검수 필수.

──────────────────────────────────────────

생성된 문서 써보시면서 불편한 점·추가 기능·법령 업데이트 제보는
한국 법률 AI 허브 SpeciAI 디스코드에서 받고 있어요.

→ https://discord.gg/wQWpEpnBfE
```
