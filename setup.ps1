# 교실 미션 해결사 - 자동 설정 스크립트

Write-Host "교실 미션 해결사 프로젝트 설정을 시작합니다..." -ForegroundColor Green

# Node.js 확인
Write-Host "`nNode.js 확인 중..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js 설치됨: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js가 설치되어 있지 않습니다." -ForegroundColor Red
    Write-Host "  https://nodejs.org/ 에서 Node.js를 설치해주세요." -ForegroundColor Yellow
    exit 1
}

# npm 확인
Write-Host "`nnpm 확인 중..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm 설치됨: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm이 설치되어 있지 않습니다." -ForegroundColor Red
    exit 1
}

# Git 확인
Write-Host "`nGit 확인 중..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git 설치됨: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git이 설치되어 있지 않습니다." -ForegroundColor Red
    Write-Host "  https://git-scm.com/download/win 에서 Git을 설치해주세요." -ForegroundColor Yellow
    exit 1
}

# 의존성 설치
Write-Host "`n의존성 설치 중..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 의존성 설치 실패" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 의존성 설치 완료" -ForegroundColor Green

# Git 초기화 확인
Write-Host "`nGit 저장소 확인 중..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "✓ Git 저장소가 이미 초기화되어 있습니다." -ForegroundColor Green
} else {
    Write-Host "Git 저장소 초기화 중..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git 저장소 초기화 완료" -ForegroundColor Green
}

# Git 인코딩 설정 (한글 커밋 메시지 지원)
Write-Host "`nGit 인코딩 설정 중..." -ForegroundColor Yellow
git config --local core.quotepath false
git config --local i18n.commitencoding utf-8
git config --local i18n.logoutputencoding utf-8
Write-Host "✓ Git 인코딩 설정 완료 (UTF-8)" -ForegroundColor Green

Write-Host "`n설정이 완료되었습니다!" -ForegroundColor Green
Write-Host "`n다음 단계:" -ForegroundColor Cyan
Write-Host "1. 개발 서버 실행: npm run dev" -ForegroundColor White
Write-Host "2. GitHub 푸시: git add . && git commit -m 'Initial commit' && git push" -ForegroundColor White

