import React from "react";
import NeonPeakMeter from "./NeonPeakMeter";

interface AudioDevice {
  id: string;
  name: string;
}

interface AudioSession {
  process_id: number;
  process_name: string;
  volume: number;
  is_muted: boolean;
  peak_level: number;
  icon_base64?: string | null;
  device_id: string;
}

interface AppCardProps {
  session: AudioSession;
  devices: AudioDevice[];
  peak: number;
  onVolumeChange: (pid: number, vol: number) => void;
  onMuteToggle: (pid: number, mute: boolean) => void;
  onRoutingChange: (pid: number, deviceId: string) => void;
}

const AppCard: React.FC<AppCardProps> = ({
  session,
  devices,
  peak,
  onVolumeChange,
  onMuteToggle,
  onRoutingChange,
}) => {
  return (
    <div className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-[28px] p-5 transition-all duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col flex-1 mr-6 overflow-hidden">
            <h3 className="font-black text-[18px] text-white/90 truncate leading-tight">
              {session.process_name}
            </h3>
            <span className="text-[10px] font-black font-mono text-white/10 uppercase tracking-[.1em]">
              PID:{session.process_id} // Pulse Elite
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[16px] font-black font-mono text-white/40">
              {Math.round(session.volume * 100)}%
            </span>
            <div className="relative group/select">
              <select
                className="appearance-none bg-white/5 border border-white/5 hover:border-white/20 rounded-xl px-5 py-2 text-[14px] font-black text-white/40 hover:text-white/80 transition-all cursor-pointer outline-none text-right pr-10 min-w-[240px] max-w-[320px] truncate"
                onChange={(e) => onRoutingChange(session.process_id, e.target.value)}
                value={session.device_id}
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#0a0a0a] text-white py-3">
                    {d.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/10">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="w-12 h-12 flex-shrink-0 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden group-hover:border-blue-500/30 transition-colors">
            {session.icon_base64 ? (
              <img src={`data:image/png;base64,${session.icon_base64}`} className="w-8 h-8 object-contain drop-shadow-lg" alt="" />
            ) : (
              <div className="text-[10px] font-black text-white/10 uppercase">
                {session.process_name.substring(0, 2)}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent"></div>
          </div>

          <div className="flex-1 relative flex flex-col justify-center h-12">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={session.volume}
              onChange={(e) => onVolumeChange(session.process_id, parseFloat(e.target.value))}
              className="fluent-slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 ${session.volume * 100}%, rgba(255,255,255,0.05) ${session.volume * 100}%)`,
              }}
            />
            <div className="absolute left-0 bottom-2.5 w-full h-[4px] pointer-events-none opacity-60">
              <NeonPeakMeter peak={peak} />
            </div>
          </div>

          <button
            onClick={() => onMuteToggle(session.process_id, !session.is_muted)}
            className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-xl transition-all active:scale-90 border ${
              session.is_muted
                ? "bg-red-500/10 border-red-500/40 text-red-500"
                : "bg-white/5 border-white/5 text-white/20 hover:text-white/60"
            }`}
          >
            {session.is_muted ? (
              <svg width="20" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
              </svg>
            ) : (
              <svg width="20" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
