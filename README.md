# 기숙사 도어 접근 로그 시스템

기숙사 도어 시스템 업데이트 중 키카드 접근 문제를 신고할 수 있는 웹 애플리케이션입니다.

## 기능

- 간단한 폼 인터페이스 (유닛 넘버, 이름)
- 자동 타임스탬프 (한국 시간대)
- 로컬 JSON 파일에 자동 저장
- 관리자에게 실시간 이메일 알림
- 웹 인터페이스로 데이터 조회 및 CSV 다운로드
- IP당 최대 3회 제출 제한
- 모바일 반응형 디자인

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- 로컬 JSON 파일 저장
- Nodemailer (Gmail SMTP)
- Vercel (배포)

## 설정 가이드

### 1. Gmail SMTP 설정

#### 1.1 앱 비밀번호 생성
1. Gmail 계정에서 2단계 인증 활성화
2. [Google 계정 설정](https://myaccount.google.com/) 이동
3. "보안" > "2단계 인증" > "앱 비밀번호" 선택
4. "메일" 앱 선택
5. 생성된 16자리 비밀번호 복사 및 저장

### 2. 환경 변수 설정

`.env.local` 파일 생성:

```bash
cp .env.example .env.local
```

`.env.local` 파일 편집:

```env
# Email (Gmail)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-16-char-app-password"
EMAIL_TO="admin@example.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 4. 데이터 확인

제출된 데이터는 다음 방법으로 확인할 수 있습니다:

#### 방법 1: 웹 인터페이스
- URL: `http://localhost:3000/api/data`
- 모든 제출 내역을 표 형식으로 확인
- CSV 파일로 다운로드 가능

#### 방법 2: 직접 파일 확인
- 파일 위치: `data/submissions.json`
- JSON 형식으로 저장됨

### 5. Vercel 배포

#### 5.1 GitHub 저장소 생성
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

#### 5.2 Vercel 배포
1. [Vercel](https://vercel.com) 접속 및 GitHub로 로그인
2. "New Project" 클릭
3. GitHub 저장소 import
4. "Environment Variables" 섹션에서 모든 환경 변수 추가
   - `.env.local`의 모든 변수를 복사
   - `NEXT_PUBLIC_APP_URL`은 Vercel URL로 업데이트
5. "Deploy" 클릭

#### 5.3 배포 후 설정
1. Vercel 대시보드에서 배포된 URL 확인
2. `.env.local`과 Vercel 환경 변수의 `NEXT_PUBLIC_APP_URL`을 배포 URL로 업데이트

**중요**: Vercel에서는 파일 시스템이 읽기 전용이므로, 프로덕션 환경에서는 데이터가 재배포 시 초기화됩니다. 영구 저장이 필요한 경우 Vercel Blob Storage나 데이터베이스 사용을 권장합니다.

#### Vercel Blob Storage 설정 (선택사항)
프로덕션에서 데이터를 영구 저장하려면:
1. Vercel 대시보드 > Storage > Create Database > Blob
2. `@vercel/blob` 패키지 설치
3. `lib/storage.ts` 수정하여 Vercel Blob 사용

## 사용 방법

### 거주자
1. 사이트 접속
2. 유닛 넘버와 이름 입력
3. "제출하기" 버튼 클릭
4. 성공 메시지 확인

### 관리자
1. **이메일 알림**: 제출 즉시 이메일로 알림 수신
2. **웹에서 확인**: `/api/data` 페이지에서 모든 제출 내역 확인
3. **CSV 다운로드**: 웹 페이지에서 "CSV 다운로드" 버튼 클릭
4. **직접 파일 확인**: `data/submissions.json` 파일 열람

## 제출 제한

- IP당 최대 3회 제출 가능
- 24시간 후 자동 리셋
- 로컬스토리지로 클라이언트 측에서도 제한

## 데이터 저장

- 로컬: `data/submissions.json` 파일
- 형식: JSON 배열
- 백업 권장: 주기적으로 CSV 다운로드

## 문제 해결

### 이메일이 발송되지 않는 경우
- Gmail 앱 비밀번호가 올바른지 확인
- 스팸 폴더 확인
- Vercel 로그에서 에러 메시지 확인

### 데이터가 저장되지 않는 경우
- 로컬: `data` 폴더 쓰기 권한 확인
- Vercel: 파일 시스템이 읽기 전용이므로 Vercel Blob Storage 사용 필요

### 로컬에서는 작동하지만 배포 후 작동하지 않는 경우
- Vercel 환경 변수가 모두 설정되었는지 확인
- 환경 변수에 특수 문자가 올바르게 escaped 되었는지 확인
- Vercel 로그 확인

## 데이터 백업

### 자동 백업 (권장)
주기적으로 `/api/data` 페이지에서 CSV를 다운로드하여 백업

### 수동 백업
```bash
# 로컬 개발 환경
cp data/submissions.json data/backup-$(date +%Y%m%d).json
```

## 보안

- 환경 변수는 절대 Git에 커밋하지 마세요
- `.gitignore`에 `.env.local`과 `data/` 폴더가 포함되어 있는지 확인
- Gmail 앱 비밀번호는 안전하게 보관하세요
- `/api/data` 엔드포인트는 공개되므로 필요시 인증 추가 권장

## 프로젝트 구조

```
/
├── app/
│   ├── api/
│   │   ├── data/route.ts       # 데이터 조회 API
│   │   └── submit/route.ts     # 폼 제출 API
│   ├── success/page.tsx        # 성공 페이지
│   ├── layout.tsx              # 루트 레이아웃
│   └── page.tsx                # 메인 페이지
├── components/
│   ├── AccessLogForm.tsx       # 메인 폼
│   ├── FormInput.tsx           # 입력 필드
│   └── LoadingSpinner.tsx      # 로딩 표시
├── lib/
│   ├── storage.ts              # 로컬 저장소
│   ├── emailNotification.ts    # 이메일 알림
│   ├── rateLimit.ts            # 제출 제한
│   ├── validation.ts           # 입력 검증
│   └── types.ts                # 타입 정의
└── data/
    └── submissions.json        # 제출 데이터 (자동 생성)
```

## 라이선스

MIT

## 지원

문제가 발생하면 GitHub Issues에 등록해 주세요.
