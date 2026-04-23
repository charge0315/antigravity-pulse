use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use tauri::Manager;
use window_vibrancy::apply_acrylic;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::{TrayIconBuilder, TrayIconEvent};

mod audio;
mod window;

use audio::{AudioManager, AudioSessionInfo};
use window::WindowManager;

pub struct AudioState(Mutex<Option<AudioManager>>);

impl AudioState {
    fn with_manager<F, R>(&self, app_handle: &tauri::AppHandle, f: F) -> Result<R, String>
    where
        F: FnOnce(&mut AudioManager) -> Result<R, String>,
    {
        let mut guard = self.0.lock().map_err(|_| "AudioState Mutex Lock Failed".to_string())?;
        if guard.is_none() {
            let mut manager = AudioManager::new().map_err(|e| e.to_string())?;
            manager.set_app_handle(app_handle.clone());
            *guard = Some(manager);
        }
        if let Some(manager) = guard.as_mut() {
            f(manager)
        } else {
            Err("AudioManager is missing after init".to_string())
        }
    }
}

// --- Tauri Commands ---

#[tauri::command]
fn get_audio_sessions(
    app: tauri::AppHandle,
    state: tauri::State<'_, AudioState>,
) -> Result<Vec<AudioSessionInfo>, String> {
    state.with_manager(&app, |manager: &mut AudioManager| {
        manager.get_sessions().map_err(|e: windows::core::Error| e.to_string())
    })
}

#[tauri::command]
fn set_session_volume(
    app: tauri::AppHandle,
    process_id: u32,
    volume: f32,
    state: tauri::State<'_, AudioState>,
) -> Result<(), String> {
    if !(0.0..=1.0).contains(&volume) {
        return Err("Volume must be 0.0-1.0".to_string());
    }
    state.with_manager(&app, |manager: &mut AudioManager| {
        manager.set_session_volume(process_id, volume).map_err(|e: windows::core::Error| e.to_string())
    })
}

#[tauri::command]
fn set_session_mute(
    app: tauri::AppHandle,
    process_id: u32,
    mute: bool,
    state: tauri::State<'_, AudioState>,
) -> Result<(), String> {
    state.with_manager(&app, |manager: &mut AudioManager| {
        manager.set_session_mute(process_id, mute).map_err(|e: windows::core::Error| e.to_string())
    })
}

#[tauri::command]
fn set_audio_routing(
    app: tauri::AppHandle,
    process_id: u32,
    device_id: String,
    state: tauri::State<'_, AudioState>,
) -> Result<(), String> {
    state.with_manager(&app, |manager: &mut AudioManager| {
        manager.set_audio_routing(process_id, &device_id).map_err(|e: windows::core::Error| e.to_string())
    })
}

#[tauri::command]
fn set_default_device(
    app: tauri::AppHandle,
    device_id: String,
    state: tauri::State<'_, AudioState>,
) -> Result<(), String> {
    state.with_manager(&app, |manager: &mut AudioManager| {
        manager.set_default_device(&device_id).map_err(|e: windows::core::Error| e.to_string())
    })
}

#[tauri::command]
fn get_audio_devices(
    app: tauri::AppHandle,
    state: tauri::State<'_, AudioState>,
) -> Result<Vec<audio::AudioDeviceInfo>, String> {
    state.with_manager(&app, |manager: &mut AudioManager| {
        manager.get_audio_devices().map_err(|e: windows::core::Error| e.to_string())
    })
}

#[tauri::command]
fn hide_window(
    app: tauri::AppHandle,
    window_state: tauri::State<'_, Mutex<WindowManager>>,
) -> Result<(), String> {
    if let Ok(mut guard) = window_state.lock() {
        guard.hide(&app);
        Ok(())
    } else {
        Err("Failed to lock WindowState".to_string())
    }
}

#[tauri::command]
fn set_window_position(window: tauri::Window, x: i32, y: i32) -> Result<(), String> {
    window
        .set_position(tauri::PhysicalPosition::new(x, y))
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn is_auto_launch_enabled() -> Result<bool, String> {
    use winreg::enums::*;
    use winreg::RegKey;
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let key = hkcu.open_subkey("Software\\Microsoft\\Windows\\CurrentVersion\\Run").map_err(|e: std::io::Error| e.to_string())?;
    let val: String = key.get_value("AntigravityPulse").unwrap_or_default();
    Ok(!val.is_empty())
}

#[tauri::command]
fn toggle_auto_launch(enable: bool) -> Result<(), String> {
    use winreg::enums::*;
    use winreg::RegKey;
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let (key, _) = hkcu.create_subkey("Software\\Microsoft\\Windows\\CurrentVersion\\Run").map_err(|e: std::io::Error| e.to_string())?;

    if enable {
        let exe_path = std::env::current_exe().map_err(|e: std::io::Error| e.to_string())?;
        let exe_str = exe_path.to_str().ok_or("Invalid EXE path")?;
        key.set_value("AntigravityPulse", &exe_str).map_err(|e: std::io::Error| e.to_string())?;
    } else {
        let _ = key.delete_value("AntigravityPulse");
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 終了フラグの作成 (Arc<AtomicBool>)
    let is_running = Arc::new(AtomicBool::new(true));
    let is_running_for_thread = Arc::clone(&is_running);

    // ホットキーの定義
    let shortcut_str = "Super+Alt+A";

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new()
            .with_handler(move |app, _shortcut, event| {
                if event.state() == tauri_plugin_global_shortcut::ShortcutState::Pressed {
                    let window_state = app.state::<Mutex<WindowManager>>();
                    let mut guard = window_state.lock().unwrap();

                    // マウス位置を取得してそこにポップアップさせる
                    let mut point = windows::Win32::Foundation::POINT { x: 0, y: 0 };
                    let (icon_x, icon_y) = unsafe {
                        if windows::Win32::UI::WindowsAndMessaging::GetCursorPos(&mut point).is_ok() {
                            (point.x, point.y)
                        } else {
                            (0, 0)
                        }
                    };
                    guard.toggle(app, (icon_x, icon_y));
                }
            })
            .build()
        )
        .manage(AudioState(Mutex::new(None)))
        .manage(Mutex::new(WindowManager::default()))
        .setup(move |app| {
            // ホットキーの登録
            use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut};
            use std::str::FromStr;

            if let Ok(ctrl_alt_a) = Shortcut::from_str(shortcut_str) {
                if let Err(e) = app.global_shortcut().register(ctrl_alt_a) {
                    eprintln!("PULSE: Failed to register shortcut: {}", e);
                }
            } else {
                eprintln!("PULSE: Invalid shortcut string: {}", shortcut_str);
            }

            // トレイのインライン初期化
            let quit_i = MenuItem::with_id(app, "quit", "Exit", true, None::<&str>)?;
            let show_i = MenuItem::with_id(app, "show", "Show", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &quit_i])?;

            let is_running_for_menu = Arc::clone(&is_running);
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(move |app, event| {
                    let window_state = app.state::<Mutex<WindowManager>>();
                    let mut guard = window_state.lock().unwrap();
                    
                    match event.id.as_ref() {
                        "quit" => {
                            // 終了フラグを倒す
                            is_running_for_menu.store(false, Ordering::SeqCst);
                            // 強制終了プロトコル (道連れ終了)
                            std::process::exit(0);
                        }
                        "show" => {
                            guard.toggle(app, (0, 0));
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: tauri::tray::MouseButton::Left,
                        button_state: tauri::tray::MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        let window_state = app.state::<Mutex<WindowManager>>();
                        let mut guard = window_state.lock().unwrap();

                        let mut point = windows::Win32::Foundation::POINT { x: 0, y: 0 };
                        let (icon_x, icon_y) = unsafe {
                            if windows::Win32::UI::WindowsAndMessaging::GetCursorPos(&mut point).is_ok() {
                                (point.x, point.y)
                            } else {
                                (0, 0)
                            }
                        };

                        guard.toggle(app, (icon_x, icon_y));
                    }
                })
                .build(app)?;

            std::mem::forget(_tray);

            // ウィンドウの初期設定
            if let Some(window) = app.get_webview_window("main") {
                #[cfg(target_os = "windows")]
                {
                    let _ = apply_acrylic(&window, Some((10, 10, 10, 180)));
                }
            }

            // Peak Pulse 配信ループ (60fps)
            let handle = app.handle().clone();
            std::thread::spawn(move || {
                use tauri::Emitter;
                while is_running_for_thread.load(Ordering::SeqCst) {
                    std::thread::sleep(std::time::Duration::from_millis(16));
                    let state = handle.state::<AudioState>();
                    let peaks: Result<Vec<(u32, f32)>, String> = state.with_manager(&handle, |manager: &mut AudioManager| {
                        manager.get_peak_levels().map_err(|e: windows::core::Error| e.to_string())
                    });

                    if let Ok(peak_data) = peaks {
                        if !peak_data.is_empty() {
                            let payload: Vec<serde_json::Value> = peak_data
                                .into_iter()
                                .map(|(pid, peak)| serde_json::json!({ "pid": pid, "peak": peak }))
                                .collect();
                            let _ = handle.emit("audio-pulse", payload);
                        }
                    }
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_audio_sessions,
            set_session_volume,
            set_session_mute,
            set_audio_routing,
            get_audio_devices,
            set_default_device,
            hide_window,
            set_window_position,
            is_auto_launch_enabled,
            toggle_auto_launch
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| {
            if let tauri::RunEvent::ExitRequested { api, .. } = event {
                api.prevent_exit();
            }
        });
}
