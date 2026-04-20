---
name: privacy-eu
description: EU 사용자 대상 서비스용 Privacy Notice·Terms of Service·Consent Modal·Cookie Banner 자동 생성. GDPR (Regulation 2016/679) + ePrivacy Directive + Consumer Rights Directive 2011/83 + Digital Services Act + Digital Content Directive + Unfair Terms Directive 반영. 영문 인터뷰로 진행.
license: Apache-2.0
version: 3.0.0
---

# privacy-eu — EU GDPR 전용 스킬

## 호출 즉시 출력 (영문 인터뷰 시작 안내)

```
Starting EU GDPR Privacy Notice & Terms generator.

인터뷰는 영문·GDPR 용어로 진행합니다. (사용자 답은 한국어로 하셔도 됩니다)
법령: GDPR Art. 13-14, Art. 6, Art. 9, Chapter V, DSA, CRD 14-day withdrawal

몇 가지만 여쭤볼게요.
```

## 법령 근거 (MUST READ)

1. `./jurisdictions/eu-gdpr/gdpr-checklist.md` — GDPR Art. 13-14 공개 21종·8대 권리·Art. 6 근거·Art. 83 과태료
2. `./jurisdictions/eu-gdpr/terms-checklist.md` — CRD·DSA·DCD·Unfair Terms
3. `./references/glossary.md` — 용어 풀이 (DPO·Data Controller·SCCs 등)
4. `./references/design-system-detection.md` — UI variant

## 인터뷰 범위

`./scripts/interview.md` 중 다음만 수행:

**유지**
- Step 1 서비스 소개 (serviceName·serviceDescription·operatorName·serviceType)
- Step 2 수집 항목 (자동 수집·민감·고유식별)
- Step 6 처리위탁 (→ Art. 28 Processors + 국제 이전 자동 추론)
- Step 9 시행일·개정 여부
- **Step 9-EU 전부 (Q9E-1~11)**
- Step 10 디자인 스타일
- Step 11 최종 확인

**생략 (한국 전용)**
- Step 3 수집 방법 (EU는 Art. 14 출처 개념으로 Q9E-6에 통합)
- Step 4 한국식 처리 목적 (Q9E-4 Legal Basis로 대체)
- Step 5 한국식 제3자 제공 (Q9E-8 Recipients로 대체)
- Step 7 한국 CPO (Q9E-2 DPO로 대체)
- Step 8 한국 특수 상황
  - 14세 미만 → Q9E-11 (16세 기본)
  - AI 자동화·행태광고·전송요구권·국내대리인은 EU는 다르게 처리

## 사용 템플릿

- `./jurisdictions/eu-gdpr/privacy-notice.en.mdx.tmpl` → `src/app/privacy/page.tsx`
- `./jurisdictions/eu-gdpr/terms-of-service.en.mdx.tmpl` → `src/app/terms/page.tsx`

## 치환 프로토콜

`./scripts/render.md`의 **EU GDPR 치환 규칙** 섹션 필독. 조건부 블록 13종 해석·검증 키워드 지정됨.

## UI 컴포넌트 locale

모든 컴포넌트에 `locale="en"` prop 박기:

```tsx
<ConsentModal locale="en" />
<CookieBanner locale="en" variant="center-modal" blocking={true} />
<LabelingCard /* 영문 라벨로 텍스트 대체 */ />
```

CookieBanner는 **GDPR 옵트인 모드**:
- `variant="center-modal"` 또는 `variant="bottom-bar"` + 옵트인 UX
- Reject all 버튼을 Accept all과 동등 노출 (CNIL·EDPB)

## 생성 대상 파일 (src-app 기준)

```
src/mdx-components.tsx
src/content/legal/privacy-policy.mdx         (GDPR Privacy Notice)
src/content/legal/terms-of-service.mdx       (EU Terms)
src/app/privacy/page.tsx                     (locale="en")
src/app/terms/page.tsx                       (locale="en")
src/components/legal/ConsentModal.tsx
src/components/legal/CookieBanner.tsx
src/components/legal/LabelingCard.tsx
```

## 검증 (Write 후 필수)

- [ ] Data Controller 정보
- [ ] 8대 권리 (Access·Rectification·Erasure·Restriction·Portability·Object·Art. 22·Withdraw)
- [ ] Art. 6 Legal basis 명시
- [ ] Supervisory authority·EDPB 링크
- [ ] 72h breach notification (해당 시)
- [ ] DPO·EU Representative (해당 시)
- [ ] International transfer·SCCs (해당 시)
- [ ] CRD 14-day withdrawal + model form
- [ ] DSA Art. 17 Statement of Reasons (platform 시)
- [ ] ODR 링크 https://ec.europa.eu/consumers/odr

## 완료 출력

```
[Generated]
- src/content/legal/privacy-policy.mdx (GDPR)
- src/content/legal/terms-of-service.mdx (CRD + DSA)
- src/app/privacy/page.tsx, src/app/terms/page.tsx
- src/components/legal/*.tsx (locale="en")

[Checks]
- GDPR Art. 13-14 disclosures complete
- 8 data subject rights covered
- CRD 14-day withdrawal included
- ODR link inserted

[Next steps]
1. Add <CookieBanner locale="en" variant="center-modal" /> to layout
2. Connect <ConsentModal locale="en" /> to signup form
3. Footer links to /privacy and /terms

[Reminder]
Legal review by EU counsel required before production.
GDPR Art. 83 fines: up to €20M or 4% global turnover.
```
