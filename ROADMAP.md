# Roadmap

Korean-privacy-terms의 장기 확장 계획. 실사용자 피드백에 따라 순서는 조정될 수 있습니다.

## ✅ v1.0.0 (2026-04-18, 공개 완료)

- 한국 PIPA 2025.4 작성지침·2026.3 개정법 완전 반영
- 공정위 전자상거래 표준약관 제10023호
- Next.js 13~16, Tailwind v3/v4, shadcn/ui 자동 감지
- 서비스 유형 6종 분기 (SaaS·쇼핑몰·커뮤니티·블로그·핀테크·AI)
- 조건부 섹션 (14세 미만·AI 자동화·해외사업자·전송요구·행태정보·민감정보)
- Pretendard + 흑백 모노크롬 기본 디자인

## ✅ v1.1.0 (2026-04-19)

### 영문 출력 병기

- 한국법 기반 **영문 처리방침·약관 템플릿** 추가
- ConsentModal·CookieBanner에 `locale="ko" | "en"` prop
- 인터뷰 Step 0에서 출력 언어 선택 (한국어 / 영문 / 병기)
- `both` 선택 시 `/en/privacy`, `/en/terms` 라우트 자동 생성

**법령 내용은 여전히 한국법 기준**. 영문판은 한국법 조문을 영어로 번역한 것이지 GDPR 대응 문서가 아닙니다.

## ✅ v2.0.0 (2026-04-19)

### EU GDPR 대응 + 관할법 분기 구조

- `jurisdictions/kr-pipa/` 로 기존 한국법 자산 재구성
- `jurisdictions/eu-gdpr/` 신규 — GDPR 체크리스트, Privacy Notice 템플릿
- 인터뷰 Step -1에서 타겟 관할법 선택
- 한국+EU 병기 서비스의 경우 두 세트 문서 동시 생성

커버:
- GDPR 8대 이용자 권리 (Access·Rectification·Erasure·Restriction·Portability·Object·Automated decisions·Withdraw consent)
- 법적 근거 6종 (Art. 6)
- 특수 카테고리 (Art. 9)
- 국제 이전 메커니즘 (SCCs·BCRs·Adequacy)
- ePrivacy 쿠키 옵트인 요구
- 과태료 4% / €20M (Art. 83)

## 🚧 v2.1.0 (계획, ~2026년 하반기)

### v1.1·v2.0 안정화 + 개선

- 사용자 피드백 반영
- GDPR 영문 Terms of Service 템플릿 추가 (현재는 Privacy만 있음)
- Cookie Policy 분리 템플릿 (EU 관할 시)
- DSAR (Data Subject Access Request) 접수 폼 컴포넌트
- 한/영 언어 전환 토글 컴포넌트
- examples에 GDPR 케이스 (독일 SaaS) 추가

## 🔮 v3.0.0 (계획, 2026년 말~2027년 초)

### 미국 CCPA/CPRA 대응

`jurisdictions/us-ccpa/` 추가:

- CCPA (California Consumer Privacy Act) 2018
- CPRA (California Privacy Rights Act) 2023 개정 반영
- 캘리포니아 주민 대상 필수 공개 사항
- "Do Not Sell or Share My Personal Information" 링크
- Sensitive Personal Information (SPI) 처리 제한
- Right to Know / Delete / Correct / Opt-out / Limit Use
- 12개월 내 요청 처리
- CPPA (California Privacy Protection Agency) 신고

### 주별 미국법 확장 (수요 보고 결정)

- `us-virginia-vcdpa/` — 버지니아 VCDPA
- `us-colorado-cpa/` — 콜로라도 CPA
- `us-connecticut-ctdpa/` — 코네티컷 CTDPA

## 🔮 v4.0.0 (계획, 2027)

### 아시아 확장

#### 🇯🇵 일본 APPI (`jurisdictions/jp-appi/`)
- 개인정보보호법(APPI) 2022 개정 반영
- 제3자 제공 동의 (옵트아웃 등록제)
- 국외 이전 상세 공개
- 일본 PPC 신고 절차

#### 🇨🇳 중국 PIPL (`jurisdictions/cn-pipl/`)
- Personal Information Protection Law 2021
- 중요 데이터 해외 이전 사전 승인
- 별도 동의 (separate consent)
- 중국 국내 처리 요구

#### 🇸🇬 싱가포르 PDPA
- Personal Data Protection Act

## 🔮 v5.0.0 (장기, 2027+)

### 글로벌 엔터프라이즈급

- 🇬🇧 UK GDPR + DPA 2018
- 🇧🇷 LGPD
- 🇨🇦 PIPEDA
- 🇦🇺 Privacy Act
- 🇮🇳 DPDP Act 2023

### 자동 탐지·추천

- 타겟 사용자 지역 입력 → 필요 관할법 자동 제안
- Data Transfer Impact Assessment (DTIA) 생성
- Cross-border data flow 매트릭스 자동 작성

### 관할법 간 통합 처리방침

여러 관할법 동시 적용되는 글로벌 서비스를 위해:
- 단일 Privacy Notice에서 관할별 조항 조건부 표시
- 국가별 사용자에게 해당 관할법 조항만 노출 (geolocation 기반)

## 🔮 부가 기능 (버전 무관)

### DPIA (Data Protection Impact Assessment) 생성기
- GDPR Art. 35 필요 시 DPIA 자동 작성
- 체크리스트 기반 리스크 평가

### 계약서 자동화 시리즈 (별도 스킬)
- NDA (영문/한국어)
- 개인정보 처리위탁 계약서
- DPA (Data Processing Agreement, GDPR Art. 28)
- Cross-border Data Transfer Agreement

### Compliance Dashboard
- 처리방침 최신성 검증 (법령 업데이트 추적)
- 데이터 수집 실태 vs 공개 조항 일치 여부 자동 점검

## 개발 우선순위 기준

다음 순서로 결정:

1. **사용자 요청 (GitHub Issues 기준)** — 가장 큰 가중치
2. **법령 변경의 시급성** — 2026.9 PIPA 시행 같은 이벤트
3. **경쟁 스킬의 부재** — 시장 공백이 있는 영역
4. **번역·법령 리서치 비용** — 변호사 검수 부담 큰 관할은 후순위

## 기여 환영

- 새 관할법 템플릿 PR (해당 관할 변호사 검수 동반 필수)
- 기존 템플릿의 조문 개선
- 영문·일본어·중국어 번역
- 예시 케이스 추가

이슈로 토론 → PR 가이드는 `CONTRIBUTING.md` 참조.

## 리포지토리 이름에 관하여

v3.0부터 여러 관할법을 다루게 되면 `korean-privacy-terms` 이름이 적절하지 않을 수 있습니다.

옵션:
- (A) 이름 유지 — 한국발 프로젝트 정체성 강조
- (B) `global-privacy-terms`로 리네임 — 레포 URL 변경, 기존 스타·포크 리다이렉트
- (C) 별도 `global-privacy-terms` 레포 신규 생성 — 이 레포는 한국 특화로 유지, v3부터는 글로벌 레포로 분리

v3 접근 시 결정.

## 커뮤니티

스킬 로드맵에 대한 논의는 GitHub Discussions 또는 SpeciAI 디스코드에서.
https://discord.gg/qmCbMaER
