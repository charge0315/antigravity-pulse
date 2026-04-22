# Antigravity Pulse Architecture

This document outlines the high-level architecture of **Antigravity Pulse**, detailing the module structure and design principles.

[**English**] | [**日本語**](#-日本語)

---

## 📁 Directory Structure

### Frontend (React + Tailwind CSS)
Focuses on UI rendering, user interaction, and seamless communication with the Rust backend.

- **`src/`**
  - **`App.tsx`**: The core of the UI. Uses Tauri `invoke` to fetch audio session and device data. Implements **Optimistic Updates** to ensure zero-latency user feedback.
  - **`main.tsx`**, **`index.css`**: Entry point and global styling via Tailwind CSS.
  - **`vite.config.ts`**: Optimized build settings for the Tauri integration.

### Backend (Rust + Tauri + windows-rs)
Handles native OS interactions, COM component management, and low-level window manipulation.

- **`src-tauri/`**
  - **`src/lib.rs`**: Manages the application lifecycle and custom **AudioState**.
    - **Tray Flyout**: Handles tray icon clicks and coordinates the intelligent window positioning logic.
    - **Mica/Acrylic Effect**: Applies native Windows 11 transparency effects via `window-vibrancy`.
  - **`src/audio/`**: Core logic for Windows Audio APIs.
    - **`mod.rs`**: Directly interacts with WASAPI to enumerate and control per-app audio sessions.
    - **`events.rs`**: Implements the **Real-time Pulse Engine** via COM callbacks, pushing volume updates to the frontend without polling.
    - **`icon.rs`**: Dynamically extracts high-quality application icons from process binaries using `SHGetFileInfoW`.
    - **`policy.rs`**: Maps advanced Audio Policy interfaces for per-app output routing.

---

## 💡 Design Principles

1. **Fluid UX (Zero Latency)**: Every interaction should feel instant. We prioritize backend performance and frontend responsiveness above all.
2. **Native Synergy**: Antigravity Pulse is designed to feel like a native extension of Windows 11, utilizing Fluent Design and Mica/Acrylic effects.
3. **Event-Driven Architecture**: By using COM callbacks instead of periodic polling, we minimize CPU overhead and maximize real-time accuracy.

---

## 🇯🇵 日本語

**Antigravity Pulse** のアーキテクチャ概要ドキュメントです。

### 📁 ディレクトリ構成
- **フロントエンド (`src/`)**: React 19 を使用。**楽観的UI更新**により、操作の「もたつき」を徹底的に排除しています。
- **バックエンド (`src-tauri/`)**: Rust と `windows-rs` を活用し、OS ネイティブの強力な API 呼び出しを担当。
  - **Real-time Pulse Engine**: `events.rs` にて COM コールバックを処理し、プッシュ型で音量状態を同期します。
  - **Mica/Acrylic**: Windows 11 の最新デザイン言語に準拠した透明エフェクトを適用。

### 💡 設計思想
1. **Fluid UX**: 全ての操作において遅延を感じさせないユーザー体験。
2. **Native Synergy**: Windows 11 の一部であるかのような、OS との高度な親和性。
3. **Event-Driven**: ポーリングを排除し、CPU 負荷を最小限に抑えつつリアルタイムな同期を実現。
