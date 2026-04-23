use tauri::{AppHandle, Manager, PhysicalPosition};

#[derive(Debug, Default)]
pub struct WindowManager {}

impl WindowManager {
    /// ウィンドウの表示・非表示を切り替える
    pub fn toggle(&mut self, app: &AppHandle, tray_pos: (i32, i32)) {
        let window = match app.get_webview_window("main") {
            Some(w) => w,
            None => return,
        };
        
        // ネイティブの状態を直接チェック
        let is_visible = window.is_visible().unwrap_or(false);

        if is_visible {
            let _ = window.hide();
        } else {
            // 表示前に位置を計算
            let (x, y) = self.calculate_position(&window, tray_pos);
            let _ = window.set_position(PhysicalPosition::new(x, y));
            
            // 表示シーケンスを確実に
            let _ = window.unminimize();
            let _ = window.show();
            let _ = window.set_focus();
            let _ = window.set_always_on_top(true);
            
            // 重要: 表示された瞬間にフロントエンドへデータ更新を促す
            use tauri::Emitter;
            let _ = app.emit("window-visible", ());
        }
    }

    pub fn hide(&mut self, app: &AppHandle) {
        if let Some(window) = app.get_webview_window("main") {
            let _ = window.hide();
        }
    }

    fn calculate_position(&self, window: &tauri::WebviewWindow, tray_pos: (i32, i32)) -> (i32, i32) {
        let monitor = window.current_monitor().ok().flatten().unwrap_or_else(|| {
            // モニターが取得できない場合の安全なフォールバック
            return window.primary_monitor().ok().flatten().unwrap();
        });

        let scale_factor = monitor.scale_factor();
        let (tray_x, tray_y) = tray_pos;
        
        // tauri.conf.json から設定された現在のサイズを取得
        let size = window.outer_size().unwrap_or_default();
        let width = size.width as i32;
        let height = size.height as i32;
        
        let m_size = monitor.size();
        let m_pos = monitor.position();

        // 基本はトレイ位置の中央上部
        let mut target_x = tray_x - (width / 2);
        let mut target_y = tray_y - height - (8.0 * scale_factor) as i32;

        // 画面端の補正
        if target_x < m_pos.x { target_x = m_pos.x + (8.0 * scale_factor) as i32; }
        if target_x + width > m_pos.x + m_size.width as i32 {
            target_x = m_pos.x + m_size.width as i32 - width - (8.0 * scale_factor) as i32;
        }

        // 上部トレイの場合の補正
        if tray_y < m_pos.y + (m_size.height as i32 / 5) {
            target_y = tray_y + (24.0 * scale_factor) as i32;
        }

        (target_x, target_y)
    }
}
