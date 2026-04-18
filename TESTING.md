# 테스트 가이드

스킬을 실제로 검증하는 3가지 방법.

## 전제 조건

- Node.js 18+ (권장 20+)
- npm 9+
- Claude Code CLI 설치 (방법 1만 해당)

```bash
node -v && npm -v
```

---

## 방법 A: 최소 검증 — 검증된 결과물만 빠르게 확인

스킬 실행 없이, 이미 E2E 검증된 MDX/컴포넌트를 실제 Next.js 프로젝트에 얹어 렌더링 확인.

### 전체 스크립트

```bash
# 1) 새 프로젝트 생성
cd ~/Desktop
npx create-next-app@latest quick-test \
  --typescript --tailwind --app --src-dir \
  --import-alias "@/*" --no-eslint --turbopack --use-npm
cd quick-test

# 2) shadcn + MDX 의존성
npx shadcn@latest init -d
npx shadcn@latest add dialog checkbox card separator scroll-area
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx remark-gfm
npm install -D @tailwindcss/typography

# 3) 스킬 자산 복사 (환경변수로 스킬 경로 지정)
export SKILL=~/Desktop/skill/korean-privacy-terms
mkdir -p src/components/legal src/content/legal src/app/privacy src/app/terms

cp $SKILL/assets/config/next.config.ts.tmpl next.config.ts
cp $SKILL/assets/config/mdx-components.tsx.tmpl src/mdx-components.tsx
cp $SKILL/assets/components/ConsentModal.tsx src/components/legal/
cp $SKILL/assets/components/CookieBanner.tsx src/components/legal/
cp $SKILL/assets/components/LabelingCard.tsx src/components/legal/
cp $SKILL/assets/components/PrivacyPage.tsx src/app/privacy/page.tsx
cp $SKILL/assets/components/TermsPage.tsx src/app/terms/page.tsx
cp $SKILL/examples/ecommerce/output-privacy-policy.mdx src/content/legal/privacy-policy.mdx

# 4) Tailwind v4 typography 플러그인 등록
# globals.css 첫 줄 아래에 plugin 지시어 추가
sed -i '' 's|@import "tailwindcss";|@import "tailwindcss";\n@plugin "@tailwindcss/typography";|' src/app/globals.css

# 5) 이용약관은 최소본만 (terms 예시는 아직 없으니 placeholder)
cat > src/content/legal/terms-of-service.mdx <<'EOF'
# 이용약관 (테스트용)

이 파일은 스킬이 정식 생성한 파일이 아니라 렌더 테스트용입니다.
실제로는 스킬이 인터뷰 후 치환하여 생성합니다.
EOF

# 6) 빌드 검증
npx tsc --noEmit  # 에러 없이 통과해야 함
npm run build     # 4개 라우트 정적 생성 확인

# 7) dev 서버 기동
npm run dev
```

### 확인 포인트

브라우저에서 직접 확인:

- http://localhost:3000/privacy — 라벨링 6개 카드 + 10개 조문
- http://localhost:3000/terms — 약관 본문
- 카드 클릭 시 상세 펼침 동작
- 모바일 화면 폭에서도 레이아웃 정상

성공 기준:
- `npm run build` 에러 없음
- `/privacy` 200, 크기 ≥ 40KB
- `/terms` 200
- 콘솔에 React 경고 없음

---

## 방법 B: 실제 스킬 E2E — 인터뷰부터 파일 생성까지

Claude Code에 스킬을 등록하고 실제 호출해본다.

### 설치

```bash
mkdir -p ~/.claude/skills
cp -r ~/Desktop/skill/korean-privacy-terms ~/.claude/skills/
ls ~/.claude/skills/
```

### 테스트 프로젝트 준비

위 방법 A의 **1단계까지만** 수행 (빈 Next.js 프로젝트).

### 스킬 호출

프로젝트 루트에서 Claude Code 실행 후:

```
/privacy-terms
```

또는 자연어:
- `개인정보처리방침이랑 이용약관 만들어줘`
- `이 프로젝트에 쿠키 배너 넣어줘`
- `회원가입 동의 모달 설치해줘`

### 확인 포인트

Claude가 수행해야 할 순서:

- [ ] `package.json`을 읽고 Next.js/Tailwind/shadcn 감지
- [ ] `src/app` 구조 감지 → 컴포넌트 경로 `src/` 하위로 지정
- [ ] 처리위탁 자동 감지 (있다면)
- [ ] 인터뷰 9단계를 `AskUserQuestion`으로 순차 수행
- [ ] 필수 필드 누락 시 거부
- [ ] `scripts/render.md` 프로토콜대로 치환
- [ ] Write 직후 `{{` 패턴 검증
- [ ] 최종 11개 법정 항목 확인
- [ ] 빌드 명령 안내

생성되어야 할 파일:

```
src/mdx-components.tsx
src/content/legal/privacy-policy.mdx
src/content/legal/terms-of-service.mdx
src/app/privacy/page.tsx
src/app/terms/page.tsx
src/components/legal/ConsentModal.tsx
src/components/legal/CookieBanner.tsx
src/components/legal/LabelingCard.tsx
next.config.ts (업데이트)
```

### 실패 시 체크

| 증상 | 원인 | 대응 |
|------|------|------|
| 인터뷰 없이 바로 생성 시도 | 스킬 로딩 실패 | `~/.claude/skills/korean-privacy-terms/SKILL.md` 존재 확인 |
| `{{` 잔존 | 치환 프로토콜 미준수 | `scripts/render.md` 참조해 재수행 |
| 법정 항목 누락 | 인터뷰 스킵 | 해당 단계 재질문 |
| 빌드 에러 `serializable options` | `next.config` 문자열 plugin 미적용 | `[["remark-gfm"]]`로 수정 |

---

## 방법 C: 문서·법령 반영 검토만

코드 실행 없이 스킬 품질만 확인.

### 레퍼런스 검토

```bash
cd ~/Desktop/skill/korean-privacy-terms
cat SKILL.md
cat scripts/render.md
cat scripts/interview.md
cat references/law-checklist-2026.md
cat references/guideline-2025-04.md
cat examples/ecommerce/output-privacy-policy.mdx
```

### 체크리스트

- [ ] SKILL.md frontmatter에 name/description/version 있음
- [ ] 법령 필수 11항목 (§30) 전부 references에 명시
- [ ] 2025.4.21 작성지침 6대 변경 반영
- [ ] 2026.9.11 시행 신규 조항 5개 반영
- [ ] 자동화된 결정(§37조의2) 별도 레퍼런스
- [ ] 전송요구권(§35조의2) 별도 레퍼런스
- [ ] 행태정보 쿠키 단계별 안내
- [ ] 공정위 표준약관 제10023호 조항 매칭
- [ ] 면책 주석 템플릿 상단에 존재
- [ ] 과징금 매출액 10% 언급

### 법령 최신성 크로스체크

각 레퍼런스의 시행일을 공식 사이트와 비교:

- 개인정보보호위원회: https://www.pipc.go.kr/
- 국가법령정보센터: https://www.law.go.kr/
- 공정거래위원회: https://www.ftc.go.kr/

---

## 자주 묻는 질문

### Q. 방법 A에서 terms가 placeholder인 이유?

현재 `examples/`에 쇼핑몰 privacy만 있고 terms 예시는 아직 없음. 정식 스킬 실행(방법 B)에서는 인터뷰를 통해 terms도 자동 치환됨.

### Q. Next.js 15 이하 프로젝트에서도 되나?

예. App Router 사용하면 13~16 모두 호환. Pages Router는 미지원.

### Q. Tailwind v3 프로젝트는?

Typography 플러그인 등록 방식만 다름. `tailwind.config.ts`의 `plugins`에 `require("@tailwindcss/typography")` 추가.

### Q. 스킬을 다른 PC로 옮기려면?

`~/.claude/skills/korean-privacy-terms/` 폴더 전체를 복사하면 됨. 외부 의존성 없음.

### Q. 법률 검토 없이 배포해도 되나?

**절대 안 됨**. 스킬은 초안 생성기이며, 실서비스 배포 전 변호사 검토 필수. 처리방침 미공개는 과태료 5천만원, 중대 위반은 매출액 10% 과징금.

---

## 리포트 템플릿

테스트 결과를 공유할 때 사용:

```markdown
## 환경
- OS: macOS 14 / Ubuntu 22 / Windows 11 WSL
- Node: v20.x
- Next.js: 16.x
- Tailwind: v4
- Turbopack: enabled

## 결과
- [O/X] npm run build 통과
- [O/X] /privacy 200 + 렌더링
- [O/X] /terms 200 + 렌더링
- [O/X] 인터뷰 9단계 정상 동작 (방법 B만)
- [O/X] 법정 11개 항목 포함

## 이슈
(발견된 문제)

## 환경 이슈
(OS/Node 특이사항)
```
