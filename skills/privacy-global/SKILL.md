---
name: privacy-global
description: 한국+EU 병기 처리방침·이용약관 자동 생성. 한국 본사가 EU 사용자까지 대상으로 서비스할 때 사용. 한국어(PIPA)·영문(GDPR) 두 세트 문서를 동시 생성하고, Footer에 언어·관할 전환 링크 자동 삽입.
license: Apache-2.0
version: 3.0.0
---

# privacy-global — 한국+EU 병기 전용 스킬

## 호출 즉시 출력

```
한국+EU 병기 모드로 시작합니다.

생성될 문서
  /privacy, /terms          — 한국어 (PIPA + 약관규제법 + 전자상거래법)
  /eu/privacy, /eu/terms    — 영문 (GDPR + CRD + DSA)

공통 질문은 한 번만, 관할별 고유 질문은 각각 묻습니다.
시작해볼게요.
```

## 법령 근거 (MUST READ)

한국·EU 양쪽 레퍼런스 전부 필독:
- `../../references/*.md` (한국 10종)
- `../../jurisdictions/eu-gdpr/gdpr-checklist.md`
- `../../jurisdictions/eu-gdpr/terms-checklist.md`

## 인터뷰 범위

`../../scripts/interview.md`에서 다음 수행:

**공통 1회 (한국+EU 함께 쓰임)**
- Step 1 서비스 소개
- Step 2 수집 항목
- Step 6 처리위탁 (처리위탁 + 국제 이전 양쪽 반영)
- Step 9 시행일

**한국 전용**
- Step 4 처리 목적 (한국식)
- Step 5 제3자 제공 (한국식)
- Step 7 CPO

**EU 전용 (Step 9-EU 전부)**
- Q9E-1~11

**통합 (둘 다 영향)**
- Step 8 특수 상황 — **14세 미만 기준 묻고 16세로 통일 권장**
- Step 10 디자인 (CookieBanner는 EU 기준 옵트인 자동 적용)
- Step 11 최종 확인

## 사용 템플릿 (4종 전부)

```
한국 세트
  ../../jurisdictions/kr-pipa/privacy-policy.ko.mdx.tmpl → /privacy
  ../../jurisdictions/kr-pipa/terms-of-service.ko.mdx.tmpl → /terms

EU 세트
  ../../jurisdictions/eu-gdpr/privacy-notice.en.mdx.tmpl → /eu/privacy
  ../../jurisdictions/eu-gdpr/terms-of-service.en.mdx.tmpl → /eu/terms
```

## 생성 대상 파일 (src-app 기준)

```
src/mdx-components.tsx

src/content/legal/privacy-policy.mdx          (한국어)
src/content/legal/terms-of-service.mdx        (한국어)
src/content/legal/eu/privacy-notice.mdx       (영문)
src/content/legal/eu/terms-of-service.mdx     (영문)

src/app/privacy/page.tsx                      locale="ko"
src/app/terms/page.tsx                        locale="ko"
src/app/eu/privacy/page.tsx                   locale="en"
src/app/eu/terms/page.tsx                     locale="en"

src/components/legal/ConsentModal.tsx
src/components/legal/CookieBanner.tsx         variant="center-modal" (EU 옵트인)
src/components/legal/LabelingCard.tsx
src/components/legal/LocaleSwitch.tsx         (신규, 언어 전환 링크)
```

## LocaleSwitch 컴포넌트

Footer에 넣는 언어·관할 전환 링크. 사용자 요청 기반 또는 geolocation 기반 선택:

```tsx
<LocaleSwitch
  currentLocale="ko"
  options={[
    { locale: "ko", label: "한국어", href: "/privacy" },
    { locale: "en", label: "English", href: "/eu/privacy" },
  ]}
/>
```

(기본 뼈대 컴포넌트는 `../../assets/components/` 자산을 참고해 Claude가 간단히 생성)

## UI 컴포넌트 locale 이중화

- `/privacy`·`/terms` 페이지: 한국 컴포넌트 (locale="ko")
- `/eu/privacy`·`/eu/terms` 페이지: 영문 컴포넌트 (locale="en")
- CookieBanner는 **앱 전역 단 하나**만 쓰고 locale은 사용자 브라우저 언어 기반 또는 명시 지정

## 치환 프로토콜

`../../scripts/render.md`의 **"병기 관할 치환"** 섹션에 따라 두 세트 동시 생성.

Step 8에서 사용자가 14세(한국)·16세(EU) 기준 양쪽 답했으면 **16세로 통일**해 두 문서 모두에 반영 (더 엄격한 기준). 명시 요청 시에만 분리.

## 검증 (양쪽 각각)

한국 세트:
- 법 §30 11개 항목 포함
- 2025.4 지침·2026.9 신규 조항

EU 세트:
- Art. 13-14 공개 항목
- 8대 권리
- CRD 14-day · DSA Art. 17 · ODR 링크

## 완료 출력

```
[생성 완료]

한국어 (PIPA)
- src/content/legal/privacy-policy.mdx
- src/content/legal/terms-of-service.mdx
- src/app/privacy/page.tsx, src/app/terms/page.tsx

영문 (GDPR + CRD + DSA)
- src/content/legal/eu/privacy-notice.mdx
- src/content/legal/eu/terms-of-service.mdx
- src/app/eu/privacy/page.tsx, src/app/eu/terms/page.tsx

공통 컴포넌트
- ConsentModal, CookieBanner, LabelingCard, LocaleSwitch

[검증]
- 한국 11개 항목 ✓
- GDPR Art. 13-14 ✓
- CRD 14-day ✓
- ODR 링크 ✓

[다음 단계]
1. app/layout.tsx에 <CookieBanner /> 단일 배치
2. Footer에 <LocaleSwitch /> 배치
3. 회원가입 폼에 <ConsentModal /> 연결 (사용자 locale 감지)
4. 한국·EU 양쪽 변호사 검토 필수

[중요]
과태료: 한국 5천만원, EU €20M 또는 매출 4%까지.
배포 전 양 관할 로펌 검수 권장.
```
