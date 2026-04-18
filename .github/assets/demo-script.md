# 데모 녹화 대본

30~60초 GIF / 영상용. 터미널 + 브라우저 교차 녹화 권장.

## 권장 녹화 도구 (macOS)

1. **Kap** (무료, gif 내보내기) — https://getkap.co — 제일 쉬움
2. **CleanShot X** (유료, 깔끔) — 고품질 GIF
3. **asciinema** (터미널만) — https://asciinema.org — 용량 작고 재생 공유 링크도 제공
4. **QuickTime + ffmpeg** — macOS 기본

## 준비물

- 깨끗한 화면 (Dock 숨김, 메뉴바 숨김 추천)
- 터미널 폰트 크게 (Pretendard 또는 SF Mono 20pt+)
- 테마: 흑백 미니멀 (터미널 색상을 흰 배경 → 검정 글씨 또는 반대)
- 브라우저 북마크바·탭 숨김
- 해상도: 1920×1080 또는 1440×900

## 15초 숏폼 (X용)

```
[0-3s]  터미널에서 명령어 타이핑
        $ cd my-startup
        $ claude

[3-8s]  Claude 대화창
        > 개인정보처리방침이랑 이용약관 만들어줘
        (스킬 인사 문구 나타남)

[8-13s] 인터뷰 첫 3개 질문 빠른 타이핑
        서비스명: 모카샵
        유형: 쇼핑몰
        ...

[13-15s] 완성된 /privacy 페이지 브라우저 장면
         "10분 만에 완성." 자막
```

## 30초 표준

```
[0-4s]  문제 제기 텍스트 오버레이
        "개인정보처리방침, 어디서부터?"
        "과태료 5천만원 · 과징금 매출 10%"

[4-10s] 설치
        $ cd ~/.claude/skills
        $ git clone https://github.com/kimlawtech/korean-privacy-terms.git

[10-16s] 호출
        프로젝트로 이동 → claude 실행 → "/privacy-terms"
        (인사 문구 슥 지나가기)

[16-22s] 인터뷰 5~6개 키워드만 빠르게
        쇼핑몰 · Stripe 감지 · CPO 입력 · 14세 미만 아니오

[22-28s] 브라우저 전환
        localhost:3000/privacy — 스크롤로 전체 보여주기
        라벨링 카드 클릭 → 펼침 애니메이션

[28-30s] 로고 + CTA
        github.com/kimlawtech/korean-privacy-terms
        discord.gg/qmCbMaER
```

## 60초 풀 데모

위 30초 + 다음 추가:

```
[30-40s] /terms 페이지 보여주기, 25개 조항 스크롤
[40-50s] 회원가입 페이지로 이동 → ConsentModal 동작
[50-58s] 쿠키 배너 등장·설정·동의
[58-60s] 엔딩 카드 (URL + 디스코드)
```

## 타이핑 스피드 팁

- 타이핑은 실시간 → 그대로 녹화
- **지루한 구간은 2~4배속**으로 편집 (Kap에서 지원)
- 화면 전환은 1초 크로스페이드

## asciinema로 터미널만 녹화할 경우

```bash
# 설치
brew install asciinema

# 녹화 시작
asciinema rec demo.cast

# 명령어 실행 후 종료
exit

# 재생
asciinema play demo.cast

# 업로드 (공유 링크)
asciinema upload demo.cast
```

`.cast` 파일은 README에 바로 임베드 가능:

```markdown
[![asciicast](https://asciinema.org/a/ID.svg)](https://asciinema.org/a/ID)
```

## Kap 추천 설정

- 화면 영역: 터미널 + 브라우저 창 포함하는 영역
- FPS: 15~20 (GIF는 낮게, MP4는 30)
- 포맷: GIF (5MB 이하 목표), MP4 (트위터 2분 이내)
- 내보내기 후 https://ezgif.com에서 최적화

## 자막·오버레이 텍스트 후편집

Kap·CleanShot에서 기본 지원. 또는 Descript·CapCut 무료 버전.

권장 자막:
- "Claude Code 스킬로 10분 완성"
- "2025.4 작성지침 반영"
- "처리방침 과태료 5천만원"
- "✨ github.com/kimlawtech/korean-privacy-terms"

## 업로드 위치 및 포맷

| 플랫폼 | 포맷 | 길이 | 비율 |
|--------|------|------|------|
| X/Twitter | MP4 | 2분 이내 | 16:9 또는 1:1 |
| LinkedIn | MP4 | 10분 이내 | 16:9 |
| GitHub README | GIF | 15~30초 | 16:9 |
| YouTube Shorts | MP4 | 60초 | 9:16 (세로) |
| asciinema | .cast | 제한 없음 | 터미널만 |

GIF 파일은 `.github/assets/demo.gif`로 저장 후 README에 임베드.

```markdown
![데모](.github/assets/demo.gif)
```
