# Changelog

본 프로젝트의 모든 주요 변경사항을 기록합니다.

형식: [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)
버전 관리: [Semantic Versioning](https://semver.org/lang/ko/)

## [4.0.0] - 2026-04-22

### 추가
- **미국 CCPA/CPRA 관할 신설** (`jurisdictions/us-ccpa/`)
  - ccpa-checklist.md: CCPA/CPRA 15개 공개 의무, 7대 권리, SPI 11종, 주요 주법(VCDPA·CPA·CTDPA·UCPA·ICDPA·KCDPA·RIDPA) 비교
  - privacy-policy.en.mdx.tmpl: 2026.1.1 CPPA 갱신 규정 반영
- **privacy-us 하위 스킬** (영문 CCPA/CPRA 전용)
  - Step 9-US 10문항 (Q9US-1~10)
  - Sensitive Personal Information 처리·Limit 링크
  - Do Not Sell/Share 링크 자동 삽입
  - GPC(Global Privacy Control) 브라우저 신호 준수
  - ADMT(Automated Decision-Making) 2026 공개 의무
- 진입점 메뉴에 "3. 미국 서비스" 옵션 추가 (기존 3번 글로벌 → 4번으로 이동)

### 변경
- privacy-terms 메뉴 3→4 옵션으로 확장
- 버전 3.0.0 → 4.0.0

## [3.0.0] - 2026-04-20

### 추가
- **하위 스킬 3종 + 진입점 체계** (`skills/` 폴더)
  - `privacy-terms` 진입점: 호출 즉시 번호 메뉴(1·2·3) 제시, 번호 입력으로 직행
  - `privacy-kr` 한국 PIPA 전용: Step 1~11만 수행, Step 0·9-EU 생략
  - `privacy-eu` EU GDPR 전용: Step 9-EU 중심, 영문 인터뷰
  - `privacy-global` 병기: 한국+EU 두 세트 동시 생성
- LocaleSwitch 컴포넌트 생성 안내 (privacy-global)

### 변경
- 루트 SKILL.md에 하위 스킬 안내 섹션 추가 (v2.x 설명은 레거시로 이동)
- README 디렉토리 구조 v3.0 반영

### 유지
- 기존 `jurisdictions/`·`references/`·`assets/`·`scripts/` 모두 공유 자산으로 유지
- v2.x 단일 스킬 호출 흐름도 여전히 동작 (하위 호환)

## [2.2.0] - 2026-04-19

### 추가
- **EU Terms of Service 영문 전용 템플릿** (`jurisdictions/eu-gdpr/terms-of-service.en.mdx.tmpl`)
  - Consumer Rights Directive 2011/83/EU 14일 철회권
  - Digital Services Act (DSA) Art. 14, 16, 17, 20-22 — 콘텐츠 조정, Statement of Reasons, 이의신청
  - Digital Content Directive (EU) 2019/770 — 적합성 보증, 업데이트 의무
  - Unfair Terms Directive 93/13/EEC 준수
  - Brussels I bis Regulation — 소비자 관할 특례
  - Rome I Regulation — 준거법 특례
  - ODR 플랫폼 링크 (ec.europa.eu/consumers/odr)
- `jurisdictions/eu-gdpr/terms-checklist.md` — EU 약관 필수 체크리스트·금지 조항·한국 약관규제법 비교

### 변경
- SKILL.md 관할법 지원 섹션 — EU 적용 법령 4종 추가 명시

### 보안 (메타)
- main 브랜치 보호 설정 (force push·삭제 차단)
- 커밋 메시지에서 Co-Author 자동 삽입 중단
- README 하단에 "Built with Claude Code" 크레딧 정식 명시

## [2.1.0] - 2026-04-19

### 추가
- **인터뷰 흐름 재설계** — 첫 단계에서 서비스 성격 3문항 스크리닝
  - Step 0-A: 대상 사용자 (한국/해외/글로벌)
  - Step 0-B: 해외 주력 지역 (EU/US/Asia/전세계)
  - Step 0-C: 운영 주체 소재지
- 자동 결정: `jurisdictions`, `outputLocale`, 후속 질문 범위
- 요약 확인 단계 추가 (진행 전 사용자 검증)

### 변경
- 기존 Step -1 (관할 선택) + Step 0 (언어 선택) 분리 구조 → 통합 Step 0 (서비스 성격)
- 이후 질문 관할법별 동적 축소 (EU 단독이면 CPO·전자상거래법 생략)

## [2.0.0] - 2026-04-19

### 추가
- **EU GDPR 관할법 지원** (`jurisdictions/eu-gdpr/`)
  - GDPR 법령 체크리스트 (Art. 13·14 의무 공개, 8대 이용자 권리, 법적 근거 6종, 특수 카테고리, 과태료)
  - GDPR Privacy Notice 영문 템플릿
- `jurisdictions/` 폴더 구조 도입 — 관할법별 모듈화
- 인터뷰 Step -1: 타겟 관할법 선택 (KR / EU / KR+EU / US 로드맵)
- `ROADMAP.md` — CCPA·APPI·PIPL 등 장기 확장 계획

### 변경
- SKILL.md에 관할법 지원 섹션 추가

## [1.1.0] - 2026-04-19

### 추가
- **영문 출력 병기 지원**
  - `templates/privacy-policy.en.mdx.tmpl` — 한국 PIPA 기반 영문 처리방침
  - `templates/terms-of-service.en.mdx.tmpl` — KFTC 표준약관 영문판
- ConsentModal·CookieBanner에 `locale="ko" | "en"` prop 추가
- 인터뷰 Step 0: 출력 언어 선택 (한국어 / 영문 / 병기)
- 병기 선택 시 `/en/privacy`, `/en/terms` 라우트 자동 생성

### 변경
- 모든 UI 컴포넌트 텍스트를 `LABELS` 사전으로 분리
- SKILL.md 4단계 파일 생성에 locale별 분기 추가

## [1.0.0] - 2026-04-18

### 첫 공개 릴리스

#### 법령 반영
- 개인정보보호법 §30 필수 11항목
- 2025.4.21 개인정보 처리방침 작성지침 (6대 변경)
- 2026.3.10 공포 / 2026.9.11 시행 개정법 (§30조의3, §31, §34, §64조의2, §32조의2)
- 2025.3.13 시행 전송요구권 (§35조의2)
- 2024.3.15 시행 자동화된 결정 대응권 (§37조의2)
- 2025.8 생성형 AI 개인정보 처리 안내서
- 공정거래위원회 전자상거래 표준약관 제10023호 (2025.12 개정 반영)

#### 기능
- 인터뷰 기반 처리방침·이용약관 자동 생성
- 서비스 6유형별 분기 (SaaS/쇼핑몰/커뮤니티/블로그/핀테크/AI)
- 조건부 섹션 (14세 미만·AI 자동화·해외사업자·전송요구·민감정보·맞춤형 광고)
- 프로젝트 디자인 시스템 자동 감지 (UI 라이브러리·아이콘·CSS 변수)
- Next.js 13~16 지원 (App Router, Tailwind v3/v4, Turbopack/Webpack)

#### 컴포넌트
- ConsentModal: 4 variant × 4 size × 2 iconSet = 32가지 조합
- CookieBanner: 4 position × 2 iconSet × 2 blocking = 16가지
- LabelingCard: 2 layout × 2 density × 2 iconSet = 8가지
- PrivacyPage, TermsPage: MDX 기반 페이지 템플릿

#### 기본 디자인
- Pretendard Variable 폰트 자동 적용
- 흑백 모노크롬 테마
- 이모지·과도 마크다운 장식 제거
- 법률 문서에 걸맞는 정제된 타이포그래피

#### 문서
- SKILL.md: 진입점 및 동작 규칙
- 10개 레퍼런스 (법령·지침·벤치마크·용어집·디자인)
- 3개 스크립트 (인터뷰·치환·설치)
- 예시: 쇼핑몰(모카샵) input·output 페어
- TESTING.md: 3가지 테스트 방법
