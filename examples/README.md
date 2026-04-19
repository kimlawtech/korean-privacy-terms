# 예시 (Examples)

Claude가 인터뷰 → 치환 과정을 학습하기 위한 입력·출력 페어.

## 디렉토리

```
examples/
└── ecommerce/
    ├── input.yaml                    # 인터뷰로 수집한 변수
    └── output-privacy-policy.mdx     # 치환 완료된 MDX (E2E 검증 PASS)
```

## 쇼핑몰 예시 (모카샵)

- **서비스 유형**: 쇼핑몰 (전자상거래)
- **처리위탁**: Stripe/AWS/SendGrid 3개사 (자동 감지)
- **14세 미만·AI·해외·전송요구권**: 모두 false → 해당 섹션 제거
- **검증**: Next.js 16 + Tailwind v4 + Turbopack 환경에서 HTTP 200 응답, 법정 11개 항목 전부 포함

## 사용법

Claude는 스킬 실행 시:
1. `input.yaml`을 참고해 변수 수집 흐름과 구조 이해
2. `output-privacy-policy.mdx`를 참고해 최종 치환 품질 기준 확인
3. `{{#if hasProcessors}}`이 어떻게 평면 텍스트로 변환되었는지 학습

## 추가 예시 (향후)

- `saas/` — B2B SaaS (자동화된 결정 포함)
- `community/` — 커뮤니티 (14세 미만 허용)
- `fintech/` — 핀테크 (다중 법령 근거)
- `overseas/` — 해외사업자 (국내대리인 필수)
