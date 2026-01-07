# 교실 미션 해결사 (Class Mission Solver)

초등학교 교사 및 학생을 위한 미션 관리 시스템입니다. 복잡한 미션 부여 과정을 자동화하고 학생의 활동 이력을 데이터로 관리합니다.

## 기술 스택

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 주요 기능

### 학생 기능
- 비밀번호 기반 로그인
- 하루 1회 미션 신청
- 완료한 미션 목록 조회
- 실시간 대기 명단 확인

### 교사 기능
- 관리자 비밀번호 기반 로그인
- 대기 중인 학생 다중 선택
- 카테고리별 미션 부여 (학습/생활/봉사)
- 실시간 대기 명단 관리

## 설치 및 실행

### 1. 프로젝트 클론

```bash
git clone <your-repository-url>
cd class-mission-helper
```

### 2. Git 인코딩 설정 (한글 커밋 메시지 지원)

다른 컴퓨터에서도 한글 커밋 메시지가 깨지지 않도록 Git 인코딩을 설정합니다:

**Windows (PowerShell):**
```powershell
git config --local core.quotepath false
git config --local i18n.commitencoding utf-8
git config --local i18n.logoutputencoding utf-8
```

**macOS/Linux:**
```bash
git config --local core.quotepath false
git config --local i18n.commitencoding utf-8
git config --local i18n.logoutputencoding utf-8
```

또는 자동 설정 스크립트를 실행하세요:
- Windows: `.\setup.ps1`
- macOS/Linux: `./setup.sh`

> **참고**: 이 프로젝트는 `.gitattributes`와 `.editorconfig` 파일을 포함하여 모든 텍스트 파일이 UTF-8로 처리되도록 설정되어 있습니다.

### 3. 의존성 설치

```bash
npm install
```

### 4. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_admin_password
```

### 5. Supabase 데이터베이스 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트를 생성합니다.
2. Supabase 대시보드의 SQL Editor에서 `supabase/schema.sql` 파일의 내용을 실행합니다.
3. Realtime 기능을 활성화합니다:
   - Database > Replication 메뉴로 이동
   - `missions` 테이블의 Realtime을 활성화

### 6. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
class-mission-helper/
├── app/                    # Next.js App Router
│   ├── admin/             # 교사 관리 페이지
│   ├── api/               # API 라우트
│   ├── login/             # 학생 로그인
│   ├── student/           # 학생 대시보드
│   └── page.tsx           # 홈 페이지
├── components/            # React 컴포넌트
│   ├── admin/            # 교사용 컴포넌트
│   ├── student/          # 학생용 컴포넌트
│   └── ErrorBoundary.tsx # 에러 바운더리
├── lib/                  # 유틸리티 함수
│   ├── auth/            # 인증 관련
│   └── supabase/        # Supabase 클라이언트
├── supabase/            # 데이터베이스 스키마
│   └── schema.sql       # SQL 스키마
└── public/              # 정적 파일
```

## 데이터베이스 스키마

### profile 테이블
- 학생 프로필 정보 (이름, 비밀번호)

### students 테이블
- 학생 추가 정보

### missions 테이블
- 미션 정보 (학생 이름, 카테고리, 내용, 상태)

### mission_applications 테이블
- 하루 1회 신청 제한을 위한 신청 기록

## 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
npm start
```

### Vercel 배포

1. GitHub 레포지토리에 코드를 푸시합니다.
2. [Vercel](https://vercel.com)에 로그인하고 새 프로젝트를 생성합니다.
3. GitHub 레포지토리를 연결합니다.
4. 환경 변수를 설정합니다 (아래 참조).
5. 배포를 시작합니다.

## 환경 변수 설정 (Vercel)

Vercel 대시보드의 프로젝트 설정 > Environment Variables에서 다음 변수를 추가하세요:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anon Key
- `ADMIN_PASSWORD`: 교사 로그인 비밀번호

## 한글 인코딩 설정

다른 컴퓨터에서 프로젝트를 클론한 후 한글 커밋 메시지가 깨지지 않도록 Git 인코딩을 설정해야 합니다. 자세한 내용은 [ENCODING.md](./ENCODING.md)를 참조하세요.

## 라이선스

MIT

