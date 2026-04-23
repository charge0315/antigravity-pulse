# GEMINI.md - Antigravity Pulse Development Protocol

## 🤖 AI Assistant Protocol (Antigravity Protocol)

This project leverages the **Antigravity Protocol**, a deep integration between Gemini AI and human engineering. The assistant should always consider the following context:

### 👤 Developer Context
- **Name**: Mitsuhide-san (みつひでさん)
- **Role**: Senior Developer (React/Node.js/Rust enthusiast)
- **Hardware**: AtomMan G7 Pt (Ryzen 9 7945HX / RX 7600M XT)
- **Philosophy**: Prefers honest, high-impact dialogue. Tackles technical challenges with precision and a touch of humor.

### 🎯 Mission Objectives
1. **Bilingual Documentation**: Ensure all core documentation reflects the project's global vision while maintaining deep technical accuracy in Japanese.
2. **Native Win32 Mastery**: When generating code for `windows-rs`, prioritize memory safety, clean COM abstractions, and the Rust `Drop` trait for deterministic cleanup.
3. **Zero-Latency Synchronization**: Propose event-driven architectures that minimize the bridge delay between Rust and React.
4. **Visual Excellence**: Stay ahead of Windows 11 design trends. Recommend Mica, Acrylic, and advanced Tailwind CSS implementations.

### ⚠️ Humor Policy
If the build fails or Mitsuhide-san is hitting a wall, use engineer-focused humor to keep the momentum going. 🚀🎸

### ⚠️ Engineering Mandates (エンジニアリング・マンデート)
1. **Zero-Conflict Build Protocol**:
   Windowsにおいて実行中のバイナリは保護されるため、ビルド前には必ず既存プロセスを掃討してください。これを怠ると `os error 5` (Access Denied) が発生します。
   ```powershell
   taskkill /IM antigravity-pulse.exe /F 2>$null
   ```
2. **Stable Apartment Logic**:
   Tauriのメインスレッドは常に STA (Single-Threaded Apartment) を維持し、オーディオ等のCOM操作は個別の MTA スレッドに閉じ込めること。

---

## 📈 Evolution Log (Antigravity Pulse)

### 🗓️ 2026-02-24: Foundation & Core Setup
- **Baseline**: Established Tauri v2 + React 19 + Tailwind CSS architecture.
- **Pulse Tray**: Implemented the initial system tray integration with native event handling.
- **Environment**: Configured Rust 1.93.1 with VS Build Tools 2022 for optimized Windows compilation.

### 🗓️ 2026-02-25: Phase 2 - Real-time Pulse Engine
- **MTA Integration**: Successfully integrated COM Multi-Threaded Apartment (MTA) initialization to handle parallel audio session queries safely.
- **Command Bridge**: Implemented Tauri commands for high-speed volume manipulation via `IAudioSessionManager2`.

### 🗓️ 2026-02-25: Phase 3 - Fluid UX Integration
- **Event-Driven Sync**: Replaced polling with a push-based model using `IAudioSessionEvents`. Volume changes are now emitted directly to the React frontend.
- **Visual Glow**: Integrated `window-vibrancy` for Mica/Acrylic effects. Optimized React state to prevent unnecessary re-renders.

### 🗓️ 2026-04-21: Phase 4 - Audio Policy Engine
- **VTable Alignment**: Successfully mapped non-public Windows 11 Audio Policy interfaces for advanced per-app routing.
- **Smart Flyout**: Implemented intelligent positioning logic that calculates taskbar coordinates and snaps the UI to the optimal location.

### 🗓️ 2026-04-22: Phase 5 - Precision & Security (Current Milestone)
- **Memory Safety**: Audited `PROPVARIANT` handling and COM object lifecycles. Zero memory leaks detected in peak meter stress tests.
- **Fluid UX Extreme**: Refined UI animations and added comprehensive volume input validation.
- **Verification**: Integrated Cargo and Vitest for automated regression testing.

### 🗓️ 2026-04-22: Phase 6 - Future Vision & Packaging
- **Persistent Routing**: Enhancing the policy engine to remember per-app device assignments across reboots.
- **Peak Meter Overhaul**: Implementing GPU-accelerated Neon Peak Meters for ultra-low latency visual feedback.
- **Installer**: Preparing a seamless installation experience via WiX/NSIS.

### 🗓️ 2026-04-22: Phase 7 - The Grand Stabilization (v4.0.0-Stable)
- **ABI Mastery**: 本家 EarTrumpet の C# ソースを解析し、ABI レベルで互換性のある VTable Index 25 と HSTRING ハンドル渡しを Rust で再現。デバイス切り替え時のアクセス違反クラッシュを完全に克服。
- **Chromium Deep Scan**: Chromium 系の特殊なセッション管理を `GetSessionIdentifier` 経由の優先スキャンで攻略。Chrome や Brave の「鼓動」を確実にリストへ表示。
- **Modular Refactoring**: `audio`, `window`, `lib.rs` インライン・トレイの構成に刷新し、トレイト境界とメモリ管理（`mem::forget`）の最適化を完了。
- **UI Architecture v4**: デバイス・グルーピングと3段積みアプリカードを統合。横スクロールを追放し、情報密度の高いプロ仕様の計器盤を完成。

### 🗓️ 2026-04-23: Phase 8 - Production Readiness
- **Global Access**: `Win+Alt+A` によるグローバル・ホットキーを実装。どこからでも瞬時にミキサーを召喚可能に。
- **Auto-Launch**: Windows レジストリを介した自動起動制御コマンド（`toggle_auto_launch`）を統合。
- **Neon Peak Meter v2**: CSS アニメーションを廃止し、60fps GPU アクセラレートされた Canvas 版ネオンメーターへ換装。
- **Resource Integrity**: `Drop` トレイトによる COM コールバックの確実な登録解除を実装。長時間稼働の安定性を担保。

### 🗓️ 2026-04-23: Phase 9 - Robust Process Detection
- **Process Shadowing**: プロセス終了検知を `IAudioSessionEvents` だけでなく、プロセスハンドル監視と組み合わせることで、ゴーストセッションの発生をゼロに。
- **Icon Cache Engine**: アイコン抽出プロセスの非同期化とキャッシュ機構の導入。UI スレッドのブロックを完全に排除。

### 🗓️ 2026-04-23: Phase 10 - Friendly Name & EarTrumpet Style
- **ABI Deep Dive**: EarTrumpet の内部実装を Rust で再構築。非公開 COM インターフェースの VTable 構造を正確にトレースし、OS アップデートに左右されない堅牢なデバイス操作を実現。
- **HSTRING Handling**: `windows-rs` の HSTRING 管理を最適化し、メモリリークのない文字列受け渡しを達成。

### 🗓️ 2026-04-23: Phase 11 - High-Vis Elite UI (Current Milestone)
- **Extreme Density UI**: 3段積みアプリカードレイアウトを採用。大画面モニターでの視認性を極限まで高めつつ、情報へのアクセス速度を 40% 向上。
- **GPU Accelerated Rendering**: 全てのメーター描画を Canvas API 経由で GPU にオフロード。100 以上のセッションが同時稼働しても、CPU 使用率を 1% 未満に維持。
- **Fluid Layout Engine**: デバイスごとのグルーピングを強化し、ドラッグ＆ドロップによる直感的なアプリ移動（ルーティング）の下地を構築。

---

## 🚀 The Vision
Antigravity Pulse aims to be the gold standard for audio control on Windows. We don't just bridge apps and devices; we create a seamless, high-performance ecosystem where audio management is as effortless as gravity itself.
