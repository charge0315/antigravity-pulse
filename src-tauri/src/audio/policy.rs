#![allow(non_snake_case)]
#![allow(non_camel_case_types)]

use windows::core::{Interface, GUID, HRESULT, HSTRING, IUnknown};
use windows::Win32::System::WinRT::RoGetActivationFactory;

// --- IAudioPolicyConfigFactory インターフェースの定義 ---
#[windows_core::interface("ab3d4648-e242-459f-b02f-541c70306324")]
pub unsafe trait IAudioPolicyConfigFactoryWin11 {
    fn GetIids(&self, count: *mut u32, iids: *mut *mut GUID) -> HRESULT;
    fn GetRuntimeClassName(&self, class_name: *mut *mut std::ffi::c_void) -> HRESULT;
    fn GetTrustLevel(&self, trust_level: *mut i32) -> HRESULT;

    // Dummy (3..23)
    fn d3(&self) -> HRESULT; fn d4(&self) -> HRESULT; fn d5(&self) -> HRESULT; fn d6(&self) -> HRESULT;
    fn d7(&self) -> HRESULT; fn d8(&self) -> HRESULT; fn d9(&self) -> HRESULT; fn d10(&self) -> HRESULT;
    fn d11(&self) -> HRESULT; fn d12(&self) -> HRESULT; fn d13(&self) -> HRESULT; fn d14(&self) -> HRESULT;
    fn d15(&self) -> HRESULT; fn d16(&self) -> HRESULT; fn d17(&self) -> HRESULT; fn d18(&self) -> HRESULT;
    fn d19(&self) -> HRESULT; fn d20(&self) -> HRESULT; fn d21(&self) -> HRESULT; fn d22(&self) -> HRESULT;
    fn d23(&self) -> HRESULT;

    // Index 24: SetAppDefaultEndpoint (Older Win11)
    pub unsafe fn SetAppDefaultEndpoint(
        &self,
        process_id: u32,
        flow: i32,
        role: i32,
        device_id: *const std::ffi::c_void,
    ) -> HRESULT;

    // Index 25: SetPersistedDefaultAudioEndpoint (Newer Win11)
    pub unsafe fn SetPersistedDefaultAudioEndpoint(
        &self,
        process_id: u32,
        flow: i32,
        role: i32,
        device_id: *const std::ffi::c_void,
    ) -> HRESULT;
}

// --- IPolicyConfig インターフェースの定義 ---
#[windows_core::interface("f8679f50-ad44-41f2-998c-6b1106972846")]
pub unsafe trait IPolicyConfig {
    fn GetControlPanelProperty(&self) -> HRESULT;
    fn SetControlPanelProperty(&self) -> HRESULT;
    fn GetEndpointVisibility(&self) -> HRESULT;
    fn SetEndpointVisibility(&self) -> HRESULT;
    fn GetPropertyValue(&self) -> HRESULT;
    fn SetPropertyValue(&self) -> HRESULT;
    fn SetDefaultEndpoint(&self, device_id: &windows::core::PCWSTR, role: i32) -> HRESULT;
    fn SetEndpointFriendlyName(&self) -> HRESULT;
}

pub struct AudioPolicyConfigFactory {
    inner: IUnknown,
}

impl AudioPolicyConfigFactory {
    pub fn new() -> windows::core::Result<Self> {
        let class_id = HSTRING::from("Windows.Media.Internal.AudioPolicyConfig");
        let inner: IUnknown = unsafe { RoGetActivationFactory(&class_id)? };
        Ok(Self { inner })
    }

    pub fn set_default_device(&self, device_id: &str) -> windows::core::Result<()> {
        if device_id.is_empty() { return Ok(()); }
        unsafe {
            use windows::Win32::System::Com::{CoCreateInstance, CLSCTX_ALL};
            let policy_config: IPolicyConfig = CoCreateInstance(
                &windows::core::GUID::from_u128(0x870af99c_1d1d_4f50_be21_8336755716d2), 
                None,
                CLSCTX_ALL
            )?;
            let id_hstring = HSTRING::from(device_id);
            let pcwstr = windows::core::PCWSTR(id_hstring.as_ptr());
            let _ = policy_config.SetDefaultEndpoint(&pcwstr, 1);
        }
        Ok(())
    }

    pub fn set_persisted_default_audio_endpoint(
        &self,
        process_id: u32,
        device_id: &str,
    ) -> windows::core::Result<()> {
        if device_id.is_empty() || process_id == 0 {
            return Ok(());
        }

        let device_id_hstring = HSTRING::from(device_id);
        let flow_render = 0; // eRender
        let role_multimedia = 1; // eMultimedia

        unsafe {
            if let Ok(factory) = self.inner.cast::<IAudioPolicyConfigFactoryWin11>() {
                // Windows ABI において HSTRING はポインタ一個分のサイズ。
                let hstring_handle: *const std::ffi::c_void = std::mem::transmute_copy(&device_id_hstring);
                
                // まず Index 25 を試行
                let hr = factory.SetPersistedDefaultAudioEndpoint(
                    process_id, 
                    flow_render, 
                    role_multimedia, 
                    hstring_handle
                );

                // 失敗した場合は Index 24 を試行 (フォールバック)
                if hr.is_err() {
                    let _ = factory.SetAppDefaultEndpoint(
                        process_id, 
                        flow_render, 
                        role_multimedia, 
                        hstring_handle
                    );
                }
            }
        }
        Ok(())
    }
}
