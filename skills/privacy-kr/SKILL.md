---
name: privacy-kr
description: 한국 서비스용 처리방침·이용약관·회원가입 동의 모달·쿠키 배너 자동 생성. 개인정보보호법 §30, 2025.4.21 작성지침, 2026.3 개정법, 공정위 전자상거래 표준약관 10023호 반영. Next.js 13~16 프로젝트 대상.
license: Apache-2.0
version: 3.0.0
---

# privacy-kr — 한국 PIPA 전용 스킬

## 호출 즉시 출력 (짧게)

```
한국 PIPA·약관규제법·전자상거래법 기반 처리방침·이용약관을 만들어드릴게요.
몇 가지만 여쭤볼게요.
```

SpeciAI 홍보 문구는 여기서 출력하지 않는다 (진입점 privacy-terms에서 이미 출력).

## 법령 근거 (MUST READ)

작업 시작 전 반드시 읽는다. 파일 경로는 이 스킬 폴더 기준:

1. `../../references/law-checklist-2026.md`
2. `../../references/guideline-2025-04.md`
3. `../../references/automated-decision.md`
4. `../../references/data-portability.md`
5. `../../references/ftc-standard-terms.md`
6. `../../references/behavioral-info.md`
7. `../../references/benchmarks.md`
8. `../../references/service-type-matrix.md`
9. `../../references/glossary.md`
10. `../../references/design-system-detection.md`

## 인터뷰 범위

`../../scripts/interview.md` 중 다음만 수행:
- Step 1 서비스 소개
- Step 2 수집 항목
- Step 3 수집 방법
- Step 4 처리 목적
- Step 5 제3자 제공
- Step 6 처리위탁
- Step 7 책임자(CPO)
- Step 8 특수 상황 (14세 미만·AI 자동화·해외사업자·마케팅·행태광고·전송요구권)
- Step 9 시행 정보
- Step 10 디자인 스타일
- Step 11 최종 확인

**Step 0 (성격 스크리닝)·Step 9-EU 건너뜀**. 이미 한국 모드로 진입한 상태.

## 사용 템플릿

- `../../jurisdictions/kr-pipa/privacy-policy.ko.mdx.tmpl` (한국어 처리방침)
- `../../jurisdictions/kr-pipa/terms-of-service.ko.mdx.tmpl` (한국어 이용약관)

영문 병기 요청 시 (Step 10에서 묻거나 사용자가 요청):
- `../../jurisdictions/kr-pipa/privacy-policy.en.mdx.tmpl`
- `../../jurisdictions/kr-pipa/terms-of-service.en.mdx.tmpl`

## 치환·설치 절차

`../../scripts/render.md` 프로토콜 그대로 수행. 한국 11개 법정 항목 검증 필수.
`../../scripts/install.md`에 따라 Next.js 프로젝트에 파일 배포.

## 생성 대상 파일 (src-app 기준)

```
src/mdx-components.tsx
src/content/legal/privacy-policy.mdx
src/content/legal/terms-of-service.mdx
src/app/privacy/page.tsx
src/app/terms/page.tsx
src/components/legal/ConsentModal.tsx
src/components/legal/CookieBanner.tsx
src/components/legal/LabelingCard.tsx
```

## 완료 출력

```
[생성 완료]
- src/content/legal/privacy-policy.mdx
- src/content/legal/terms-of-service.mdx
- src/app/privacy/page.tsx
- src/app/terms/page.tsx
- src/components/legal/*.tsx

[검증]
- 법정 11개 항목 포함
- 2025.4 지침 반영
- 2026.9 신규 조항 반영

[다음 단계]
1. app/layout.tsx에 <CookieBanner /> 삽입
2. 회원가입 폼에 <ConsentModal /> 연결
3. Footer에 /privacy, /terms 링크 추가

배포 전 변호사 검토 권장. 처리방침 미공개는 과태료 5천만원.
```
