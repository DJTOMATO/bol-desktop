# BOL OF MONATIUM Desktop Client

[**한국어 설명서 (Korean Documentation)**](README.ko.md)

A high-performance, standalone desktop client for **[BOL OF MONATIUM](https://bol.monatium.com/)** (볼 오브 모나티엄) — the fast-paced 3D Tactical Web FPS combining the world and characters of *Trickcal Re:VIVE* with *Call of Duty*-style military first-person shooter action.

Built with Electron and hardware-accelerated Chromium, this client delivers an uncapped, ultra-low latency experience tailored for competitive FPS gaming.

---

## 🎮 Why Use the Desktop Client?

While BOL OF MONATIUM runs in modern web browsers, web browsers enforce strict security sandboxes, aggressive background throttling, and frame rate caps that degrade first-person shooter gameplay.

The desktop client removes these limitations:

- **🚀 Uncapped Frame Rate:** Runs with `--disable-frame-rate-limit`, delivering smooth 144Hz, 240Hz, and 360Hz+ gameplay on high-refresh-rate gaming monitors.
- **⚡ Ultra-Low Mouse & Pointer Lock Latency:** Direct native mouse capture and pointer locking without browser address bar or UI interference.
- **🛡️ Zero Background Throttling:** Background throttling is completely disabled (`backgroundThrottling: false`, `--disable-renderer-backgrounding`, `--disable-background-timer-throttling`), allowing you to Alt-Tab freely without losing connection or dropping frame rates.
- **💾 3 GB Local Disk Cache:** Generous local storage keeps all 3D weapon models (`.glb`), vehicles (M1A1 Abrams), sound effects, and textures cached on disk for instant load times without repeat downloads.
- **🎯 Discord Rich Presence (RPC):** Automatically broadcasts your live game status on Discord (whether in intense tactical combat or customizing loadouts in the menu).
- **🔄 Dynamic Over-The-Air Updates (`bolmod.js`):** Automatically syncs client-side fixes and features on startup directly from GitHub without needing to re-download installers.
- **🖥️ Display Sleep Blocker:** Prevents screens from turning off or going to sleep during active gameplay sessions.
- **🐧 Linux & Wayland Native Compatibility:** Configured out of the box to prevent Wayland surface conflicts and Vulkan crashes on modern distributions (Arch, CachyOS, Fedora, Ubuntu).

---

## 📥 Downloads

Get the latest installer or portable binary for your operating system from the [**Releases**](https://github.com/DJTOMATO/bol-desktop/releases) page:

| Platform | Type | File |
| :--- | :--- | :--- |
| **Windows (x64)** | Setup Installer | `BOL OF MONATIUM-Setup-1.0.0-x64.exe` |
| **Windows (x64)** | Portable Archive | `BOL OF MONATIUM-1.0.0-win-x64.zip` |
| **Windows (ARM64)** | Setup Installer | `BOL OF MONATIUM-Setup-1.0.0-arm64.exe` |
| **Windows (ARM64)** | Portable Archive | `BOL OF MONATIUM-1.0.0-win-arm64.zip` |
| **Linux (x86_64)** | Universal AppImage | `BOL OF MONATIUM-1.0.0-linux-x86_64.AppImage` |
| **Linux (Debian/Ubuntu)** | DEB Package | `BOL OF MONATIUM-1.0.0-linux-amd64.deb` |
| **macOS (Apple Silicon)** | Disk Image (DMG) | `BOL OF MONATIUM-1.0.0-mac-arm64.dmg` |
| **macOS (Apple Silicon)** | Portable Archive | `BOL OF MONATIUM-1.0.0-mac-arm64.zip` |

---

## ⌨️ Controls & Shortcuts

### Game Controls
| Action | Key / Input |
| :--- | :--- |
| **Move** | `W`, `A`, `S`, `D` |
| **Look / Aim** | `Mouse Movement` |
| **Fire Weapon** | `Left Mouse Button` |
| **Aim Down Sights (ADS)** | `Right Mouse Button` |
| **Jump** | `Space` |
| **Sprint** | `Left Shift` |
| **Crouch** | `C` / `Left Ctrl` |
| **Reload** | `R` |
| **Switch Weapons** | `1`, `2`, `3` / `Scroll Wheel` |
| **Menu / Pause** | `Escape` |

### Desktop Client Shortcuts
| Action | Shortcut |
| :--- | :--- |
| **Toggle Fullscreen** | `F11` |
| **Reload Game** | `F5` or `Ctrl + R` (`Cmd + R` on macOS) |
| **Toggle Developer Tools** | `Ctrl + Shift + I` (`Cmd + Option + I` on macOS) |

---

## 🛠️ Building from Source

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or higher
- Git

### Build Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DJTOMATO/bol-desktop.git
   cd bol-desktop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in development mode:**
   ```bash
   npm start
   ```

4. **Package for distribution:**
   ```bash
   # Windows x64
   npm run build:win

   # Windows ARM64
   npm run build:win:arm64

   # Linux (AppImage & deb)
   npm run build:linux

   # macOS (Apple Silicon DMG & zip)
   npm run build:mac
   ```

---

## 📜 Credits & Disclaimer

- **BOL OF MONATIUM (볼 오브 모나티엄):** Developed by Monatium community creators. Playable online at [bol.monatium.com](https://bol.monatium.com/).
- **Original Universe:** Inspired by *Trickcal Re:VIVE (트릭컬 RE:VIVE)* by Epid Games.
- **Desktop Client:** Maintained by [Glas / DJTOMATO](https://github.com/DJTOMATO). Licensed under GPL-3.0.
