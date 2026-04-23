import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, Event } from "@tauri-apps/api/event";

import PulseLogo from "./components/PulseLogo";
import DeviceSection from "./components/DeviceSection";

interface AudioSession {
  process_id: number;
  process_name: string;
  volume: number;
  is_muted: boolean;
  peak_level: number;
  icon_base64?: string | null;
  device_id: string;
}

interface AudioDevice {
  id: string;
  name: string;
  is_default: boolean;
}

interface AudioEventPayload {
  process_id: number;
  volume: number | null;
  mute: boolean | null;
  state: string | null;
  icon_base64?: string | null;
}

function App() {
  const [sessions, setSessions] = useState<AudioSession[]>([]);
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [peaks, setPeaks] = useState<Record<number, number>>({});
  const [totalPeak, setTotalPeak] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    refreshData();

    // 1. 高頻度ピークデータ (30fps)
    const unlistenPulse = listen<any[]>("audio-pulse", (event) => {
      let maxP = 0;
      setPeaks((prev) => {
        const next = { ...prev };
        event.payload.forEach((d: any) => {
          next[d.pid] = d.peak;
          if (d.peak > maxP) maxP = d.peak;
        });
        return next;
      });
      setTotalPeak(maxP);
    });

    // 2. 音量・ミュート変更通知
    const unlistenAudio = listen<AudioEventPayload>("audio-session-event", (event: Event<AudioEventPayload>) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.process_id === event.payload.process_id) {
            return {
              ...s,
              volume: event.payload.volume !== null ? event.payload.volume : s.volume,
              is_muted: event.payload.mute !== null ? event.payload.mute : s.is_muted,
            };
          }
          return s;
        })
      );
    });

    // 3. デバイス変更 or ウィンドウ表示時の強制リフレッシュ
    const unlistenRefresh = listen("refresh-trigger", refreshData);
    const unlistenVisible = listen("window-visible", () => {
      refreshData();
    });

    // 4. 定期的な監視
    const interval = setInterval(refreshData, 5000);

    return () => {
      unlistenPulse.then((f) => f());
      unlistenAudio.then((f) => f());
      unlistenRefresh.then((f) => f());
      unlistenVisible.then((f) => f());
      clearInterval(interval);
    };
  }, []);

  async function refreshData() {
    try {
      const [s, d] = await Promise.all([
        invoke<AudioSession[]>("get_audio_sessions"),
        invoke<AudioDevice[]>("get_audio_devices")
      ]);
      setSessions(s);
      setDevices(d);
    } catch (e: any) {
      setErrorMsg(e.toString());
    }
  }

  async function setVolume(pid: number, vol: number) {
    setSessions((prev) => prev.map((s) => (s.process_id === pid ? { ...s, volume: vol } : s)));
    await invoke("set_session_volume", { processId: pid, volume: vol }).catch(setErrorMsg);
  }

  async function setMute(pid: number, mute: boolean) {
    setSessions((prev) => prev.map((s) => (s.process_id === pid ? { ...s, is_muted: mute } : s)));
    await invoke("set_session_mute", { processId: pid, mute }).catch(setErrorMsg);
  }

  async function setRouting(pid: number, deviceId: string) {
    if (pid === 0) return;
    await invoke("set_audio_routing", { processId: pid, deviceId }).catch(setErrorMsg);
    setTimeout(refreshData, 500);
  }

  async function setDefaultDevice(deviceId: string) {
    await invoke("set_default_device", { deviceId }).catch(setErrorMsg);
    refreshData();
  }

  async function handleClose() {
    setIsEntering(false);
    setTimeout(() => {
      invoke("hide_window");
    }, 200);
  }

  return (
    <main
      className={`flex flex-col h-screen overflow-hidden text-white select-none transition-all duration-300 ${
        isEntering ? "window-enter-active" : "window-enter"
      }`}
      style={{ background: "transparent" }}
    >
      <div 
        className="absolute inset-0 bg-blue-500/10 pointer-events-none z-[-1] transition-opacity duration-150"
        style={{ opacity: totalPeak * 0.6 }}
      ></div>
      <div className="absolute inset-0 bg-[#0a0a0a]/95 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] pointer-events-none z-[-2] rounded-2xl"></div>

      <div data-tauri-drag-region className="h-12 flex items-center justify-between px-5 shrink-0">
        <PulseLogo />
        <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all active:scale-90">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-6 custom-scrollbar space-y-12">
        {errorMsg && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-xl border border-red-500/20 mb-4 text-[10px] font-mono break-all">
            {errorMsg}
          </div>
        )}

        {devices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-20">
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
             <p className="text-[10px] font-black uppercase tracking-widest">No audio devices detected</p>
          </div>
        ) : (
          devices.map((device) => (
            <DeviceSection
              key={device.id}
              device={device}
              sessions={sessions}
              peaks={peaks}
              devices={devices}
              onVolumeChange={setVolume}
              onMuteToggle={setMute}
              onRoutingChange={setRouting}
              onSetDefault={setDefaultDevice}
            />
          ))
        )}
      </div>

      <div className="h-10 px-6 flex items-center justify-between border-t border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-2">
           <div className={`w-1.5 h-1.5 rounded-full ${totalPeak > 0.01 ? 'bg-green-500 animate-pulse' : 'bg-white/10'}`}></div>
           <span className="text-[9px] font-black tracking-widest text-white/30 uppercase italic tracking-widest">Pulse Protocol Stable // Optimized</span>
        </div>
        <div className="text-[8px] font-mono text-white/10 uppercase tracking-[.2em]">AtomMan G7 Pt // X-Pulse Engine</div>
      </div>
    </main>
  );
}

export default App;
