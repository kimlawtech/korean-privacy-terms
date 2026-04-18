# Changelog

본 프로젝트의 모든 주요 변경사항을 기록합니다.

형식: [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)
버전 관리: [Semantic Versioning](https://semver.org/lang/ko/)

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
