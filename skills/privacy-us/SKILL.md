---
name: privacy-us
description: 미국 CCPA/CPRA + 주요 주법(VCDPA·CPA·CTDPA·UCPA·ICDPA·KCDPA·RIDPA) 기반 Privacy Policy 자동 생성. 2026.1.1 CPPA 갱신 규정, Sensitive Personal Information, Do Not Sell/Share, ADMT 공개, GPC 브라우저 신호 대응. 캘리포니아 거주자 서비스·100K records 초과 서비스 대상.
license: Apache-2.0
version: 4.0.0
---

# privacy-us — 미국 CCPA/CPRA 전용 스킬

## 호출 즉시 출력

```
Starting US (CCPA/CPRA) Privacy Policy generator.

Covers: CCPA/CPRA (California) + major state laws
  VCDPA (Virginia), CPA (Colorado), CTDPA (Connecticut), UCPA (Utah),
  ICDPA (Indiana 2026), KCDPA (Kentucky 2026), RIDPA (Rhode Island 2026)

인터뷰는 영문·CCPA 용어로 진행합니다. (사용자 답변은 한국어로 해도 됩니다)
몇 가지만 여쭤볼게요.
```

## 법령 근거 (MUST READ)

1. `./jurisdictions/us-ccpa/ccpa-checklist.md` — CCPA/CPRA 15개 공개 의무·7대 권리·SPI 11종·주법 비교
2. `./references/glossary.md` — 용어 풀이
3. `./references/design-system-detection.md`

## 인터뷰 범위

`./scripts/interview.md` 중 다음만 수행:

**유지 (공통)**
- Step 1 서비스 소개
- Step 2 수집 항목 (CCPA 카테고리로 재분류)
- Step 6 처리위탁 (→ Service Providers)
- Step 9 시행일·개정
- **Step 9-US 전부 (Q9US-1~10, 아래 참조)**
- Step 10 디자인 스타일
- Step 11 최종 확인

**생략 (한국 전용)**
- Step 3·4·5·7·8 (CCPA에서는 Q9US로 대체)

## Step 9-US 질문 (10문항)

### Q9US-1. CCPA 적용 여부 확인

```
미국 CCPA는 다음 중 하나 해당 시 적용됩니다.
  1) 연 매출 USD 25M 이상
  2) 연간 100,000명 이상 CA 거주자·가구·기기 정보 처리
  3) 연 매출 50% 이상이 개인정보 판매·공유에서 발생

이 중 해당되는 것이 있나요? 서비스가 캘리포니아 거주자를 대상으로 하기만 해도 주의가 필요합니다.
```

### Q9US-2. 사업자 기본 정보

```
CCPA Privacy Policy에 반드시 포함되어야 할 정보입니다.

- 법인명
- 주소
- 연락 이메일
- 전화번호 (toll-free 권장)
- Privacy Officer 이름·이메일 (있는 경우)
```

### Q9US-3. PI 카테고리·출처·목적·보유기간 매트릭스

```
CCPA는 수집한 개인정보를 "카테고리"별로 정리해 공개합니다.

예: Identifiers — 이름, 이메일, IP → 출처: Consumer / Device → 목적: 계정 관리, 분석 → 보유: 회원 탈퇴 후 1년

카테고리 기준 (§1798.140(v) 11종):
  1. Identifiers (이름·이메일·IP·Customer ID)
  2. Customer records (주소·전화·금융정보)
  3. Protected class characteristics (성별·인종 등 민감)
  4. Commercial information (구매·구독 기록)
  5. Biometric information
  6. Internet or network activity (브라우징·앱 이용)
  7. Geolocation data
  8. Sensory data (오디오·비디오)
  9. Professional or employment-related information
 10. Education information
 11. Inferences (프로필 분석 결과)
```

수집 변수: `piCategories[]` = `[{ category, examples, sources, purposes, retention }]`

### Q9US-4. Sensitive Personal Information (SPI)

```
CPRA가 추가로 보호하는 "민감 개인정보" 11종 중 처리하는 게 있나요?

  [ ] Social Security Number, 운전면허, 여권
  [ ] 금융 계정 + 보안코드 (카드 결제 정보)
  [ ] 정확한 위치 (1,850피트 이내)
  [ ] 인종·종교·노조 가입
  [ ] 이메일·SMS·우편 내용
  [ ] Genetic data
  [ ] Biometric (인증 목적)
  [ ] 건강 정보
  [ ] 성생활·성적 지향
  [ ] 16세 미만 미성년자 정보 (2026 추가)
  [ ] 해당 없음

SPI 수집 시 "Limit the Use of My SPI" 링크 의무 + 별도 공개 섹션 필요.
```

수집 변수: `collectsSensitivePI`, `spiCategories[]`

### Q9US-5. Sale or Share (매우 중요)

```
다음 중 하나라도 하시나요?

  1) 개인정보를 금전적 대가로 타사에 판매 → "Sale"
  2) 크로스컨텍스트 행태광고 목적으로 타사에 공유 (금전 대가 없어도) → "Share"
     예: Google Analytics, Meta Pixel, Google Ads, Facebook Ads, 리타겟팅 광고

대부분 웹사이트는 분석·광고 도구를 쓰므로 "Share" 해당됩니다. 정직하게 답해주세요.
```

수집 변수: `sellsOrShares` (boolean), `salesAndShares[]`

### Q9US-6. 서비스 제공자·수신자

```
개인정보를 받는 주요 서비스 제공자 (CCPA "Service Providers"):
  - 호스팅: AWS, Vercel, Cloudflare
  - 결제: Stripe, PayPal
  - 분석: Google Analytics, Mixpanel
  - 이메일: SendGrid, Resend
  - 고객지원: Intercom, Zendesk

각 카테고리마다 어떤 PI를 어떤 목적으로 제공하나요?
```

수집 변수: `serviceProviderDisclosures[]`

### Q9US-7. 요청 접수·응답 채널

```
권리 행사 요청을 어떻게 받으시겠어요?

필수 최소 2채널 (CCPA 요구):
  1) 온라인 페이지 (예: /privacy-request)
  2) 이메일 (예: privacy@example.com)

매출 25M+ 법인은 toll-free 전화도 권장.
```

수집 변수: `rightsRequestUrl`, `tollFreeNumber`, `hasTollFree`

### Q9US-8. 미성년자

```
16세 미만 사용자가 있나요?

  - 예 → 16세 미만은 CPRA가 자동으로 SPI로 분류. 명시적 opt-in 필요.
  - 아니오 → "16세 미만 정보를 수집하지 않는다" 선언

13세 미만 있으면 COPPA 별도 대응 필요.
```

수집 변수: `servesMinors` (boolean)

### Q9US-9. 자동화 결정 (ADMT, 2026 신규)

```
AI·알고리즘이 다음을 자동으로 결정하나요? (CPPA 2026 규정)

  - 고용·대출·보험·교육·의료·주거 접근권
  - 광범위한 프로파일링 (행태 추적)

예시가 있으면 서비스·목적·로직 간단히 알려주세요.
```

수집 변수: `hasAutomatedDecision`, `admtUses[]`

### Q9US-10. Financial Incentives

```
개인정보 수집과 연계된 "금전적 인센티브" 프로그램이 있나요?
예: 이메일 구독하면 할인, 데이터 공유 허용 시 포인트

있으면 프로그램 이름·조건 알려주세요. 없으면 "없음".
```

수집 변수: `hasFinancialIncentive`, `financialIncentives[]`

## 사용 템플릿

- `./jurisdictions/us-ccpa/privacy-policy.en.mdx.tmpl` → `src/app/privacy/page.tsx`

## 치환 프로토콜

`./scripts/render.md` 기본 규칙 + 다음 조건부 블록 추가:
- `{{#if collectsSensitivePI}}` — SPI 섹션
- `{{#if sellsOrShares}}` — Do Not Sell/Share 섹션
- `{{#if servesMinors}}` — 16세 미만 특수 처리
- `{{#if hasAutomatedDecision}}` — ADMT 공개
- `{{#if hasFinancialIncentive}}` — 인센티브 공개
- `{{#if hasTollFree}}` — Toll-free 채널
- `{{#if hasUsPrivacyOfficer}}` — Privacy Officer
- `{{#if hasThirdPartySources}}` — 3rd party 소스

## UI 컴포넌트

```tsx
<ConsentModal locale="en" />
<CookieBanner locale="en" variant="bottom-bar" iconSet="lucide" />
```

**Do Not Sell/Share 링크**: Footer에 반드시 표시. CCPA 페이지 별도 생성 `src/app/do-not-sell-share/page.tsx`.

**GPC (Global Privacy Control) 자동 준수**: CookieBanner에서 `navigator.globalPrivacyControl === true` 감지 시 자동으로 analytics·marketing 쿠키 거부.

## 생성 대상 파일

```
src/mdx-components.tsx
src/content/legal/privacy-policy.mdx               (CCPA Privacy Policy)
src/app/privacy/page.tsx                            locale="en"
src/app/do-not-sell-share/page.tsx                  (opt-out form)
src/app/limit-spi/page.tsx                          (SPI 제한 form, SPI 수집 시)
src/components/legal/ConsentModal.tsx
src/components/legal/CookieBanner.tsx
src/components/legal/LabelingCard.tsx
```

## 검증 키워드 (Write 후)

- "Categories of personal information"
- "Right to Know", "Right to Delete", "Right to Correct", "Right to Opt-Out", "Right to Limit Use", "Data Portability", "Non-Discrimination"
- "Do Not Sell or Share My Personal Information"
- "Sensitive Personal Information" (SPI 수집 시)
- "Authorized agent"
- "45 days"
- "Last Updated"
- "California Consumer Privacy Act"

## 완료 출력

```
[Generated]
- src/content/legal/privacy-policy.mdx (CCPA/CPRA)
- src/app/privacy/page.tsx
- src/app/do-not-sell-share/page.tsx
- src/app/limit-spi/page.tsx (if SPI collected)
- src/components/legal/*.tsx (locale="en")

[Checks]
- 7 consumer rights covered
- Sale/Share disclosure complete
- SPI limitation provided (if applicable)
- Authorized agent process documented
- 45-day response window noted
- GPC browser signal honored

[Next steps]
1. Add <CookieBanner locale="en" /> to layout (GPC auto-detection built-in)
2. Footer links to /privacy, /do-not-sell-share (mandatory)
3. Signup form: <ConsentModal locale="en" />
4. Every 12 months: review and update Last Updated date

[Reminder]
Legal review by US counsel required.
CCPA/CPRA penalties: USD 2,500/violation (7,500 if intentional or minor).
Data breach: USD 100-750 per consumer private action.
```
