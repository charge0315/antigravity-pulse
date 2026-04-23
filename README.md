# 🚀 Antigravity Pulse

[![Rust](https://img.shields.io/badge/rust-1.93%2B-orange.svg)](https://www.rust-lang.org/)
[![Tauri](https://img.shields.io/badge/tauri-v2-blue.svg)](https://tauri.app/)
[![React](https://img.shields.io/badge/react-19-cyan.svg)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/charge0315/antigravity-pulse.svg?style=social)](https://github.com/charge0315/antigravity-pulse/stargazers)

**Antigravity Pulse** is a next-generation audio control interface for Windows, engineered for peak performance and a fluid user experience. Powered by a high-performance Rust backend and a modern React frontend, it provides unparalleled control over your system's audio landscape.

[**English**] | [**日本語**](#-日本語)

---

## ✨ Core Features

### 💎 Fluid UX & Modern Design
Experience a native-feeling interface with **Mica and Acrylic** effects, optimized for Windows 11. Our **Fluid UX** ensures 60fps animations and instant responsiveness, making audio management feel like a core part of the OS.

### ⚡ Real-time Pulse Engine
Built on the **Antigravity Protocol**, our engine uses event-driven WASAPI (Windows Audio Session API) to synchronize volume states with zero polling. Feel the rhythm with **Neon Peak Meters v2**—GPU-accelerated Canvas rendering at **60fps** for ultra-smooth visual feedback with minimal CPU impact.

### 📍 Intelligent Positioning
Smart, taskbar-aware window placement. Whether your taskbar is top, bottom, left, or right, or you're using a multi-monitor setup, Antigravity Pulse intelligently snaps to the perfect position. Plus, use the **Global Hotkey (`Win+Alt+A`)** to summon the mixer instantly from anywhere.

### 🔀 Advanced Audio Routing
Take command of your audio flow. Assign specific applications to different output devices (speakers, headphones, virtual cables) on the fly. Our engine utilizes a custom **ABI-compatible VTable interface** (matching pro-grade tools like EarTrumpet) to ensure rock-solid stability during device handovers.

### 📊 High-Vis Elite UI
Designed for power users. The **triple-stacked app card** layout maximizes information density without clutter, perfectly optimized for large monitors and complex audio setups.

---

## 🛠️ Technical Stack

- **Backend**: Rust 1.93+ with **Tauri v2** for memory safety and native performance.
- **Frontend**: React 19 + Tailwind CSS + **GPU-Accelerated Canvas** for fluid visual components.
- **Engine**: Direct `windows-rs` integration with **ABI-level COM/Win32** mastery.
- **Visuals**: Native Win32 transparency (Mica/Acrylic) via `window-vibrancy`.

---

## 🚀 Getting Started

### Prerequisites
- **Windows 10/11**
- **Rust** (Latest stable)
- **Node.js** (v18+)
- **Visual Studio Build Tools 2022** (with C++ workload)

### Installation & Development
1. Clone the repository:
   ```bash
   git clone https://github.com/charge0315/antigravity-pulse.git
   cd antigravity-pulse
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development mode:
   ```bash
   npm run tauri dev
   ```

---

## 🤝 Contributing

We welcome contributions from the community! Check out our [CONTRIBUTING.md](./CONTRIBUTING.md) to get started. Let's build the future of audio together. 🎸

---

## ⭐ Support the Project

If you find Antigravity Pulse useful, please consider giving us a star! It helps the project grow and motivates us to keep pushing the boundaries of what's possible.

---

## 🇯🇵 日本語

**Antigravity Pulse** は、パフォーマンスと極上の操作性を追求した Windows 向け次世代オーディオコントロール・インターフェースです。Rust による高速なバックエンドと React によるモダンなフロントエンドを融合させ、システムオーディオの制御を再定義します。

### 🌟 主な機能
- **Fluid UX**: Windows 11 に最適化された Mica/Acrylic 効果と、60fps の滑らかなアニメーション。
- **Neon Peak Meter v2**: Canvas API と GPU 加速による超低負荷・高精度なビジュアルフィードバック。
- **Real-time Pulse Engine**: ポーリングを排除したイベント駆動型アーキテクチャによる、遅延のない音量同期。
- **インテリジェント配置**: `Win+Alt+A` のグローバル・ホットキー対応。タスクバー座標を自動認識し、常に最適な位置に表示。
- **高度なルーティング**: ABI レベルで最適化されたデバイス切り替えエンジンにより、アプリごとの出力を瞬時かつ安定して変更可能。
- **High-Vis Elite UI**: 3段積みアプリカードを採用した、大画面でも視認性の高いプロフェッショナルな計器盤。

### 🚀 開発の始め方
`npm install` 後、`npm run tauri dev` で開発サーバーが起動します。ビルドには Rust と Visual Studio Build Tools 2022 が必要です。

---

MIT License © 2026 Mitsuhide / charge0315
