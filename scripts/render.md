# 템플릿 치환 프로토콜 (Claude 직접 수행)

별도 렌더 엔진 없이 Claude가 템플릿을 읽고 치환본을 Write 한다.

## 원칙

1. **직렬 처리**: 인터뷰로 전체 변수를 수집 → 변수 맵을 머릿속에 구성 → 템플릿 읽기 → 치환본을 Write
2. **무결성 우선**: 빈 `{{}}` placeholder가 최종 파일에 남으면 안 된다
3. **조건부 섹션**: `{{#if}}...{{/if}}` 는 조건 불충족 시 **블록 전체 제거**
4. **반복**: `{{#each}}...{{/each}}` 는 배열 원소 수만큼 복제

## Handlebars 문법 해석 규칙

### 1. 단순 변수
```
{{cpoName}}      → "김보호"
{{cpoEmail}}     → "privacy@mocashop.kr"
```

### 2. 중첩 경로 (반복 내에서만 사용)
```
{{this.name}}
{{this.purpose}}
```

### 3. 조건부 블록
```
{{#if hasProcessors}}
...회사는 다음과 같이 위탁...
{{else}}
...회사는 현재 위탁하고 있지 않습니다...
{{/if}}
```

해석:
- `hasProcessors`가 **truthy**면 첫 블록만 렌더, 나머지(`{{else}}~{{/if}}`) 제거
- `hasProcessors`가 **falsy**면 `{{else}}~{{/if}}` 블록만 렌더, 앞부분 제거
- `{{else}}`가 없으면 false일 때 전체 블록 삭제

### 4. 반복 블록
```
{{#each processors}}
| {{this.name}} | {{this.task}} | {{this.country}} |
{{/each}}
```

배열 `processors = [{name:"Stripe", task:"결제", country:"미국"}, {name:"AWS", ...}]` 이면:
```
| Stripe | 결제 | 미국 |
| AWS | 이미지 저장 | 미국 |
```

**빈 배열일 때**: 블록을 아예 렌더하지 말 것. 단, 표 헤더 같은 주변 텍스트도 의미 없으면 함께 제거.

### 5. 주석 (MDX 호환)
```
{/* 이것은 JSX 주석 */}
```
치환 후에도 그대로 유지 (법적 면책 고지이므로).

## 치환 순서 (Claude가 따라야 할 절차)

### Step A: 변수 맵 준비
인터뷰 완료 후 모든 값을 단일 객체로 정리:

```yaml
serviceName: "모카샵"
operatorName: "주식회사 모카"
serviceType: "쇼핑몰"
isEcommerce: true
isChildFriendly: false
hasAutomatedDecision: false
hasProcessors: true
processors:
  - { name: "Stripe", task: "결제", period: "계약 종료 시까지", country: "미국" }
  - { name: "AWS", task: "이미지 저장", period: "계약 종료 시까지", country: "미국" }
retentionPeriods:
  - { purpose: "회원 정보", period: "회원 탈퇴 시까지", legalBasis: "회원 서비스 계약" }
# ... 전체 변수
```

### Step B: 라벨링 요약 자동 계산
다음 파생 변수는 Claude가 직접 계산:

```
collectedItemsSummary = 필수+선택 항목명 상위 4~5개 + " 등"
  예: "이름, 이메일, 전화번호, 배송지 주소 등"

purposesSummary = 카테고리 join(" · ")
  예: "회원 관리 · 서비스 제공"

thirdPartySummary = providesToThirdParty ? "{count}개사 제공" : "제공하지 않음"

processorSummary = hasProcessors ? "{count}개사 위탁" : "위탁 없음"
```

### Step C: 템플릿 Read
`templates/privacy-policy.mdx.tmpl` 또는 `templates/terms-of-service.mdx.tmpl` 전체 읽기.

### Step D: 라인별 치환
위에서 아래로 스캔하며:
1. `{{단순변수}}` → 값 대입
2. `{{#if 조건}}` 만나면 조건 평가 후 해당 블록만 유지
3. `{{#each 배열}}` 만나면 배열 원소 수만큼 블록 복제
4. `{{this.xxx}}`는 반복 컨텍스트의 현재 원소 속성

### Step E: 검증 (Write 전 필수)
치환 완료 후 다음 체크:

- [ ] 빈 `{{` 패턴이 남아있지 않은가
- [ ] `{{#each}}`, `{{#if}}`, `{{/each}}`, `{{/if}}` 태그가 모두 제거됐는가
- [ ] 법정 필수 11개 항목이 모두 포함됐는가
- [ ] 면책 주석(`{/* 본 초안은... */}`)이 최상단에 있는가

### Step F: Write
검증 통과한 최종본만 파일에 기록.

## 흔한 실수

### 실수 1: 조건부 블록을 뭉쳐서 그냥 복사
```
{{#if hasProcessors}}
회사는 다음과 같이 위탁...
{{/if}}
```
→ 이걸 그대로 출력 파일에 쓰면 안 됨. `hasProcessors=true`면 **태그만 제거**하고 본문 유지.

### 실수 2: 반복 블록 헤더를 매번 반복
```
| 수탁자 | 위탁 업무 | 국가 |
{{#each processors}}
| {{this.name}} | {{this.task}} | {{this.country}} |
{{/each}}
```
→ 표 헤더(`| 수탁자 |...`)는 **1회만**, 본문 행만 배열 수만큼 반복.

### 실수 3: false 조건에서 `{{else}}` 텍스트 잔존
```
{{#if hasProcessors}} A {{else}} B {{/if}}
```
`hasProcessors=false`면 최종 출력은 `B`만. `A`와 태그는 모두 제거.

### 실수 4: 누락 변수를 빈 문자열로 대체
`cpoEmail` 값이 없다면? → **Write 금지**. 인터뷰로 돌아가서 수집. 필수 항목 누락은 법 위반.

### 실수 5: 라벨링 테이블이 고정값으로 남음
templates의 라벨링 표는 요약 변수(`collectedItemsSummary` 등)를 사용. Step B에서 계산한 파생값으로 치환해야 함.

## 치환 전후 예시

### 입력 (템플릿 조각)
```
{{#if isChildFriendly}}
## 제11조 14세 미만 아동의 개인정보 처리

14세 미만 아동의 개인정보를 수집하는 경우 법정대리인의 동의를 받아 수집합니다.

### 법정대리인 동의 확인 방법
{{legalGuardianConsentMethod}}
{{/if}}
```

### 변수
```yaml
isChildFriendly: false
```

### 출력
(이 블록은 완전히 삭제되어 아무것도 안 나옴)

---

### 입력 (반복)
```
| 수탁자 | 위탁 업무 | 국가 |
|-------|----------|------|
{{#each processors}}
| {{this.name}} | {{this.task}} | {{this.country}} |
{{/each}}
```

### 변수
```yaml
processors:
  - { name: "Stripe", task: "결제", country: "미국" }
  - { name: "AWS", task: "이미지 저장", country: "미국" }
```

### 출력
```
| 수탁자 | 위탁 업무 | 국가 |
|-------|----------|------|
| Stripe | 결제 | 미국 |
| AWS | 이미지 저장 | 미국 |
```

## 최종 체크 (자동 실행)

치환본을 Write 한 직후 Claude는 다음을 수행:

1. 생성된 MDX 파일 Read
2. `grep '{{'` 패턴 검색 — 0건이어야 함
3. 법정 11개 항목 키워드 검색 — 모두 있어야 함
4. 누락·잔존 발견 시 즉시 수정 후 재Write

이 절차가 지켜지면 별도 템플릿 엔진 없이도 결정론적 치환 달성.
