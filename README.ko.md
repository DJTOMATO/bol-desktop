# 볼 오브 모나티엄 (BOL OF MONATIUM) 데스크톱 클라이언트

[**English Documentation (영어 설명서)**](README.md)

수집형 모바일 게임 《트릭컬 RE:VIVE》의 세계관과 모나티엄 엘프 설정에 《콜 오브 듀티(Call of Duty)》 스타일의 밀리터리 택티컬 FPS 요소를 결합한 3D 웹 게임, **[볼 오브 모나티엄 (bol.monatium.com)](https://bol.monatium.com/)**의 고성능 전용 데스크톱 클라이언트입니다.

Electron과 하드웨어 가속 Chromium 엔진을 바탕으로 최적화되어 웹 브라우저의 제한을 풀고, e스포츠급 반응속도와 부드러운 게임 환경을 제공합니다.

---

## 🎮 왜 데스크톱 클라이언트를 사용해야 하나요?

웹 브라우저(크롬, 웨일, 엣지 등)에서 플레이할 경우 강력한 보안 샌드박스와 백그라운드 탭 스로틀링, 주사율 제한 등으로 인해 FPS 장르 특유의 빠른 조작감과 프레임이 손실될 수 있습니다.

본 데스크톱 클라이언트는 이러한 한계를 완전히 해소합니다:

- **🚀 주사율 제한 해제 (Uncapped FPS):** `--disable-frame-rate-limit` 플래그를 적용하여 144Hz, 240Hz, 360Hz 이상의 고주사율 게이밍 모니터에서 극한의 부드러움을 지원합니다.
- **⚡ 마우스 지연 최소화 및 완벽한 포인터 락:** 브라우저 주소창이나 UI 간섭 없이 네이티브 환경에서 즉각적인 마우스 시점 전환과 조준을 지원합니다.
- **🛡️ 백그라운드 스로틀링 해제 (알트탭 끊김 방지):** `backgroundThrottling: false` 설정으로 알트탭(Alt+Tab)을 하거나 다른 창을 보더라도 프레임 저하, 오디오 끊김, 네트워크 틱 밀림 현상이 전혀 발생하지 않습니다.
- **💾 3GB 로컬 디스크 캐시 탑재:** M4A1, M870, M249, 엘피니아 라이플, 모나티엄 진압 카빈 및 M1A1 전차 등 대용량 3D 모델(`.glb`)과 사운드 파일을 디스크에 캐싱하여 재접속 시 로딩 없이 즉시 게임에 진입합니다.
- **🎯 디스코드 활동 상태 표시 (Discord Rich Presence):** 전투 중인지, 메뉴에서 무기 세팅 중인지 내 디스코드 프로필에 실시간으로 멋지게 표시됩니다.
- **🔄 무중단 자동 업데이트 (`bolmod.js`):** 앱 실행 시 GitHub로부터 최신 개선 사항과 상태 표시 기능을 자동으로 동기화하여, 매번 새 버전을 다시 설치할 필요가 없습니다.
- **🖥️ 화면 꺼짐 방지:** 게임 패드나 마우스 조작 중 윈도우 절전 모드로 인해 화면이 꺼지는 현상을 방지합니다.
- **🐧 리눅스 Wayland/Vulkan 호환성 해결:** CachyOS, 아치 리눅스(Arch), 페도라(Fedora) 등 최신 리눅스 배포판의 Wayland 충돌 및 검은 화면 현상을 자동으로 방지합니다.

---

## 📥 다운로드 (설치 파일)

[**Releases (릴리스 페이지)**](https://github.com/DJTOMATO/bol-desktop/releases)에서 운영체제에 맞는 최신 버전을 다운로드할 수 있습니다:

| 운영체제 | 패키지 유형 | 파일명 |
| :--- | :--- | :--- |
| **Windows (x64)** | 간편 설치 파일 (Setup) | `BOL OF MONATIUM-Setup-1.0.0-x64.exe` |
| **Windows (x64)** | 무설치 압축본 (Portable) | `BOL OF MONATIUM-1.0.0-win-x64.zip` |
| **Windows (ARM64)** | 간편 설치 파일 (Setup) | `BOL OF MONATIUM-Setup-1.0.0-arm64.exe` |
| **Windows (ARM64)** | 무설치 압축본 (Portable) | `BOL OF MONATIUM-1.0.0-win-arm64.zip` |
| **Linux (x86_64)** | 범용 AppImage | `BOL OF MONATIUM-1.0.0-linux-x86_64.AppImage` |
| **Linux (데비안/우분투)** | DEB 패키지 | `BOL OF MONATIUM-1.0.0-linux-amd64.deb` |
| **macOS (애플 실리콘)** | DMG 설치 이미지 | `BOL OF MONATIUM-1.0.0-mac-arm64.dmg` |
| **macOS (애플 실리콘)** | 무설치 압축본 (Portable) | `BOL OF MONATIUM-1.0.0-mac-arm64.zip` |

---

## ⌨️ 기본 조작법 및 단축키

### 인게임 조작법
| 동작 | 키 / 입력 |
| :--- | :--- |
| **이동** | `W`, `A`, `S`, `D` |
| **시점 회전 / 조준** | `마우스 이동` |
| **발사 (사격)** | `마우스 좌클릭` |
| **정밀 조준 (ADS)** | `마우스 우클릭` |
| **점프** | `Space` |
| **전력 질주 (달리기)** | `Left Shift` |
| **앉기** | `C` 또는 `Left Ctrl` |
| **재장전** | `R` |
| **무기 교체** | `1`, `2`, `3` 또는 `마우스 휠` |
| **메뉴 / 일시정지** | `Escape (ESC)` |

### 클라이언트 단축키
| 동작 | 단축키 |
| :--- | :--- |
| **전체 화면 전환** | `F11` |
| **게임 새로고침** | `F5` 또는 `Ctrl + R` (macOS: `Cmd + R`) |
| **개발자 도구 (DevTools)** | `Ctrl + Shift + I` (macOS: `Cmd + Option + I`) |

---

## 🛠️ 소스코드에서 빌드하기

### 요구 사양
- [Node.js](https://nodejs.org/) v20 이상
- Git

### 빌드 절차

1. **저장소 복제:**
   ```bash
   git clone https://github.com/DJTOMATO/bol-desktop.git
   cd bol-desktop
   ```

2. **패키지 설치:**
   ```bash
   npm install
   ```

3. **개발 모드로 실행:**
   ```bash
   npm start
   ```

4. **배포용 바이너리 패키징:**
   ```bash
   # Windows 64비트
   npm run build:win

   # Windows ARM64
   npm run build:win:arm64

   # Linux (AppImage & deb)
   npm run build:linux

   # macOS (Apple Silicon DMG & zip)
   npm run build:mac
   ```

---

## 📜 출처 및 저작권 안내

- **볼 오브 모나티엄 (BOL OF MONATIUM):** 모나티엄 커뮤니티 제작진이 개발 및 운영하는 웹 게임입니다. [bol.monatium.com](https://bol.monatium.com/)에서 직접 플레이하실 수 있습니다.
- **원작 세계관:** 에피드게임즈(Epid Games)의 《트릭컬 RE:VIVE》 세계관을 기반으로 한 2차 창작 팬 게임입니다.
- **데스크톱 클라이언트:** [Glas / DJTOMATO](https://github.com/DJTOMATO)가 유지관리하며, GPL-3.0 라이선스를 따릅니다.
