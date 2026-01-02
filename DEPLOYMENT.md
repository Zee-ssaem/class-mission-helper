# Vercel 배포 가이드

이 문서는 교실 미션 해결사를 Vercel에 배포하는 방법을 안내합니다.

## 사전 준비

1. GitHub 계정 및 레포지토리
2. Supabase 프로젝트
3. Vercel 계정

## 1. GitHub 레포지토리 설정

### 1.1 레포지토리 생성

1. GitHub에 새 레포지토리를 생성합니다.
2. 로컬 프로젝트를 초기화하고 푸시합니다:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

### 1.2 .gitignore 확인

`.gitignore` 파일에 다음이 포함되어 있는지 확인하세요:
- `.env.local`
- `.env`
- `node_modules/`
- `.next/`

## 2. Supabase 설정

### 2.1 프로젝트 생성

1. [Supabase](https://supabase.com)에 로그인합니다.
2. 새 프로젝트를 생성합니다.
3. 프로젝트가 준비될 때까지 기다립니다 (약 2분).

### 2.2 데이터베이스 스키마 적용

1. Supabase 대시보드에서 **SQL Editor**로 이동합니다.
2. `supabase/schema.sql` 파일의 내용을 복사하여 실행합니다.
3. 실행이 성공했는지 확인합니다.

### 2.3 Realtime 활성화

1. **Database** > **Replication** 메뉴로 이동합니다.
2. `missions` 테이블을 찾아 **Realtime** 토글을 활성화합니다.

### 2.4 API 키 확인

1. **Settings** > **API** 메뉴로 이동합니다.
2. 다음 정보를 복사해 둡니다:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** 키 (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 3. Vercel 배포

### 3.1 프로젝트 연결

1. [Vercel](https://vercel.com)에 로그인합니다.
2. **Add New Project**를 클릭합니다.
3. GitHub 레포지토리를 선택합니다.
4. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)

### 3.2 환경 변수 설정

**Environment Variables** 섹션에서 다음 변수를 추가합니다:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Supabase Anon 공개 키 |
| `ADMIN_PASSWORD` | 원하는 비밀번호 | 교사 로그인 비밀번호 |

**중요**: 
- 모든 환경(Production, Preview, Development)에 변수를 추가하세요.
- `ADMIN_PASSWORD`는 안전한 비밀번호로 설정하세요.

### 3.3 배포 실행

1. **Deploy** 버튼을 클릭합니다.
2. 배포가 완료될 때까지 기다립니다 (약 2-3분).
3. 배포가 성공하면 Vercel이 제공하는 URL을 확인할 수 있습니다.

## 4. 배포 후 확인

### 4.1 기본 동작 확인

1. 배포된 URL로 접속합니다.
2. 홈 페이지가 정상적으로 표시되는지 확인합니다.
3. 학생 로그인 페이지가 작동하는지 확인합니다.
4. 교사 로그인 페이지가 작동하는지 확인합니다.

### 4.2 데이터베이스 연결 확인

1. 학생 로그인을 시도합니다 (profile 테이블에 데이터가 있어야 함).
2. Supabase 대시보드에서 데이터가 정상적으로 저장되는지 확인합니다.

### 4.3 Realtime 기능 확인

1. 한 학생이 미션을 신청합니다.
2. 다른 학생의 대시보드에서 실시간으로 대기 명단이 업데이트되는지 확인합니다.

## 5. 문제 해결

### 5.1 환경 변수 오류

**증상**: "Environment variable is not defined" 오류

**해결 방법**:
1. Vercel 대시보드에서 환경 변수가 올바르게 설정되었는지 확인합니다.
2. 변수명에 오타가 없는지 확인합니다.
3. 배포를 다시 실행합니다.

### 5.2 Supabase 연결 오류

**증상**: "Failed to fetch" 또는 연결 오류

**해결 방법**:
1. Supabase 프로젝트 URL과 키가 올바른지 확인합니다.
2. Supabase 프로젝트가 활성 상태인지 확인합니다.
3. Supabase 대시보드에서 API 설정을 확인합니다.

### 5.3 Realtime이 작동하지 않음

**증상**: 대기 명단이 실시간으로 업데이트되지 않음

**해결 방법**:
1. Supabase 대시보드에서 Realtime이 활성화되었는지 확인합니다.
2. `missions` 테이블의 Replication 설정을 확인합니다.
3. 브라우저 콘솔에서 오류 메시지를 확인합니다.

## 6. 커스텀 도메인 설정 (선택사항)

1. Vercel 프로젝트 설정에서 **Domains** 메뉴로 이동합니다.
2. 원하는 도메인을 입력합니다.
3. DNS 설정을 따라 도메인을 연결합니다.

## 7. 지속적인 배포

GitHub 레포지토리에 푸시하면 Vercel이 자동으로 배포합니다:
- `main` 브랜치에 푸시 → Production 배포
- 다른 브랜치에 푸시 → Preview 배포

## 추가 리소스

- [Vercel 문서](https://vercel.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Next.js 문서](https://nextjs.org/docs)

