#!/bin/bash

# 교실 미션 해결사 - 자동 설정 스크립트

echo "교실 미션 해결사 프로젝트 설정을 시작합니다..."

# Node.js 확인
echo ""
echo "Node.js 확인 중..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js 설치됨: $NODE_VERSION"
else
    echo "✗ Node.js가 설치되어 있지 않습니다."
    echo "  https://nodejs.org/ 에서 Node.js를 설치해주세요."
    exit 1
fi

# npm 확인
echo ""
echo "npm 확인 중..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✓ npm 설치됨: $NPM_VERSION"
else
    echo "✗ npm이 설치되어 있지 않습니다."
    exit 1
fi

# Git 확인
echo ""
echo "Git 확인 중..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "✓ Git 설치됨: $GIT_VERSION"
else
    echo "✗ Git이 설치되어 있지 않습니다."
    echo "  https://git-scm.com/download 에서 Git을 설치해주세요."
    exit 1
fi

# 의존성 설치
echo ""
echo "의존성 설치 중..."
npm install
if [ $? -ne 0 ]; then
    echo "✗ 의존성 설치 실패"
    exit 1
fi
echo "✓ 의존성 설치 완료"

# Git 초기화 확인
echo ""
echo "Git 저장소 확인 중..."
if [ -d .git ]; then
    echo "✓ Git 저장소가 이미 초기화되어 있습니다."
else
    echo "Git 저장소 초기화 중..."
    git init
    echo "✓ Git 저장소 초기화 완료"
fi

# Git 인코딩 설정 (한글 커밋 메시지 지원)
echo ""
echo "Git 인코딩 설정 중..."
git config --local core.quotepath false
git config --local i18n.commitencoding utf-8
git config --local i18n.logoutputencoding utf-8
echo "✓ Git 인코딩 설정 완료 (UTF-8)"

echo ""
echo "설정이 완료되었습니다!"
echo ""
echo "다음 단계:"
echo "1. 개발 서버 실행: npm run dev"
echo "2. GitHub 푸시: git add . && git commit -m 'Initial commit' && git push"

