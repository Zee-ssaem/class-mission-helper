# 개발 환경 설정 가이드

## 필수 도구 설치

### 1. Node.js 설치

1. [Node.js 공식 웹사이트](https://nodejs.org/)에서 LTS 버전을 다운로드합니다.
2. 설치 프로그램을 실행하고 기본 설정으로 설치합니다.
3. 설치 후 터미널을 다시 시작합니다.
4. 설치 확인:
   ```bash
   node --version
   npm --version
   ```

### 2. Git 설치

1. [Git 공식 웹사이트](https://git-scm.com/download/win)에서 Windows용 Git을 다운로드합니다.
2. 설치 프로그램을 실행하고 기본 설정으로 설치합니다.
3. 설치 후 터미널을 다시 시작합니다.
4. 설치 확인:
   ```bash
   git --version
   ```

## 프로젝트 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## GitHub 푸시

### 1. Git 초기화 (처음 한 번만)

```bash
git init
```

### 2. 파일 추가 및 커밋

```bash
git add .
git commit -m "Initial commit: 교실 미션 해결사 프로젝트"
```

### 3. GitHub 레포지토리 연결

GitHub에서 새 레포지토리를 생성한 후:

```bash
git branch -M main
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

**참고**: `your-username`과 `your-repo-name`을 실제 값으로 변경하세요.

