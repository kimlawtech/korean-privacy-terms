---
name: privacy-jp
description: 日本サービス向け（일본 서비스용） プライバシーポリシー・利用規約・同意モーダル・Cookieバナー 자동 생성. 個人情報保護法(APPI)·消費者契約法·特定商取引法 반영. Next.js 13~16 프로젝트 대상.
license: Apache-2.0
version: 1.0.0
---

# privacy-jp — 일본 APPI 전용 스킬

## 호출 즉시 출력 (짧게)

```
日本の個人情報保護法（APPI）・消費者契約法・特定商取引法に基づく
プライバシーポリシーと利用規約を作成します。
いくつか質問させていただきます。
```

SpeciAI 홍보 문구는 여기서 출력하지 않는다 (진입점 privacy-terms에서 이미 출력).

## 법령 근거 (MUST READ)

작업 시작 전 반드시 읽는다:

1. `./references/appi-jp.md` — APPI 법령 체크리스트·필수 공개 항목
2. `./references/glossary.md` — 전문용어 풀이
3. `./references/service-type-matrix.md` — 서비스 유형별 차이
4. `./references/design-system-detection.md` — UI 감지
5. `./jurisdictions/jp-appi/appi-checklist.md` — APPI 검증 체크리스트

## 인터뷰 범위

`./scripts/interview.md` 중 다음만 수행:
- Step 1 서비스 소개
- Step 2 수집 항목
- Step 3 수집 방법
- Step 4 처리 목적
- Step 5 제3자 제공
- Step 6 처리위탁
- Step 7 책임자 (管理者)
- Step 8 특수 상황 (아동·AI 자동화·해외사업자·마케팅·행태광고)
- Step 9 시행 정보
- **Step 9-JP** (일본 전용 추가 질문)
- Step 10 디자인 스타일
- Step 11 최종 확인

**Step 0 (성격 스크리닝)·Step 9-EU·Step 9-US 건너뜀**. 이미 일본 모드로 진입한 상태.

## 사용 템플릿

- `./jurisdictions/jp-appi/privacy-policy.ja.mdx.tmpl` (일본어 프라이버시 정책)
- `./jurisdictions/jp-appi/terms-of-service.ja.mdx.tmpl` (일본어 이용약관)

영문 병기 요청 시 Step 10에서 확인하고, 별도 영문 템플릿 작성 (현재는 일본어 단독 생성).

## 치환·설치 절차

`./scripts/render.md`의 **"APPI 치환 규칙"** 섹션 수행.
`./jurisdictions/jp-appi/appi-checklist.md` 검증 필수.
`./scripts/install.md`에 따라 Next.js 프로젝트에 파일 배포.

## 생성 대상 파일 (src-app 기준)

```
src/mdx-components.tsx
src/content/legal/jp/privacy-policy.mdx
src/content/legal/jp/terms-of-service.mdx
src/app/jp/privacy/page.tsx
src/app/jp/terms/page.tsx
src/components/legal/ConsentModal.tsx  (locale="ja" 추가)
src/components/legal/CookieBanner.tsx  (locale="ja" 추가)
src/components/legal/LabelingCard.tsx
```

한국 서비스와 병기하는 경우 (privacy-global-jp 사용 권장):
```
src/content/legal/privacy-policy.mdx         (한국어)
src/content/legal/jp/privacy-policy.mdx      (일본어)
```

## 완료 출력

```
[생성 완료]
- src/content/legal/jp/privacy-policy.mdx
- src/content/legal/jp/terms-of-service.mdx
- src/app/jp/privacy/page.tsx
- src/app/jp/terms/page.tsx
- src/components/legal/*.tsx

[검증]
- APPI 第32条 보유개인데이터 필수 공개 항목 포함
- 이용 목적 특정 (第15条)
- 제3자 제공 관련 사항 (第27条)
- 해외 제3자 제공 (第28条, 해당 시)
- 정보 주체 권리 5종 (第33~39条)
- 안전관리조치 개요 (第23条)
- 고충처리 창구 (苦情申出先)

[다음 단계]
1. app/layout.tsx에 <CookieBanner locale="ja" /> 삽입
2. 회원가입 폼에 <ConsentModal locale="ja" /> 연결
3. Footer에 /jp/privacy, /jp/terms 링크 추가
4. 전자상거래 서비스는 特定商取引法 표기 페이지 별도 작성 필요

配布前に弁護士（日本法）によるレビューを強く推奨します。
個人情報保護法違反は最大1億円の罰金対象です。

──────────────────────────────────────────

生成された文書についてご不明な点や機能追加のご要望は、
法律AI허브 SpeciAI 디스코드에서 받고 있어요.

→ https://discord.gg/wQWpEpnBfE
```
