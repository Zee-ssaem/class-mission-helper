# 한글 인코딩 설정 가이드

이 프로젝트는 한글 커밋 메시지와 파일 내용이 깨지지 않도록 UTF-8 인코딩을 사용합니다.

## 자동 설정

프로젝트를 클론한 후 자동 설정 스크립트를 실행하면 Git 인코딩이 자동으로 설정됩니다:

- **Windows**: `.\setup.ps1`
- **macOS/Linux**: `./setup.sh`

## 수동 설정

자동 설정 스크립트를 사용하지 않는 경우, 다음 명령어를 실행하세요:

### Windows (PowerShell)

```powershell
git config --local core.quotepath false
git config --local i18n.commitencoding utf-8
git config --local i18n.logoutputencoding utf-8
```

### macOS/Linux

```bash
git config --local core.quotepath false
git config --local i18n.commitencoding utf-8
git config --local i18n.logoutputencoding utf-8
```

## 커밋 메시지 작성 방법

### 권장 방법: Git 에디터 사용

```bash
git commit
```

에디터가 열리면 한글이 정상적으로 표시되고 입력할 수 있습니다.

### 대안: 파일로 커밋 메시지 작성

1. UTF-8 인코딩으로 텍스트 파일 생성:
   ```bash
   # commit-msg.txt 파일에 커밋 메시지 작성 (UTF-8)
   git commit -F commit-msg.txt
   ```

### 주의: PowerShell에서 직접 입력

Windows PowerShell에서 `git commit -m "한글 메시지"`를 사용하면 인코딩 문제가 발생할 수 있습니다. 가능하면 Git 에디터를 사용하거나 파일로 작성하는 방법을 권장합니다.

## 포함된 설정 파일

이 프로젝트에는 다음 파일들이 포함되어 있어 다른 컴퓨터에서도 인코딩이 올바르게 처리됩니다:

- **`.gitattributes`**: Git이 모든 텍스트 파일을 UTF-8로 처리하도록 설정
- **`.editorconfig`**: 에디터가 UTF-8 인코딩을 사용하도록 설정
- **`.gitmessage`**: 커밋 메시지 템플릿 (선택사항)

## 문제 해결

### 커밋 메시지가 깨져 보이는 경우

1. Git 인코딩 설정 확인:
   ```bash
   git config --get i18n.commitencoding
   git config --get i18n.logoutputencoding
   ```
   둘 다 `utf-8`이어야 합니다.

2. PowerShell 인코딩 설정 (Windows):
   ```powershell
   chcp 65001
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
   ```

3. 이미 커밋된 메시지 수정:
   ```bash
   # 최근 커밋 메시지 수정
   git commit --amend
   # 또는 파일로 작성
   git commit --amend -F commit-msg.txt
   ```

### 파일 내용이 깨져 보이는 경우

1. 에디터의 인코딩 설정을 UTF-8로 변경
2. `.editorconfig` 파일이 에디터에서 인식되는지 확인
3. VS Code 사용 시: "Reopen with Encoding" → "UTF-8" 선택

## 추가 정보

- [Git 인코딩 설정 문서](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration)
- [EditorConfig 공식 사이트](https://editorconfig.org/)

