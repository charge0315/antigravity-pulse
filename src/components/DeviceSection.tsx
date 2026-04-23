import React from "react";
import AppCard from "./AppCard";

interface AudioDevice {
  id: string;
  name: string;
  is_default: boolean;
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

interface DeviceSectionProps {
  device: AudioDevice;
  sessions: AudioSession[];
  peaks: Record<number, number>;
  devices: AudioDevice[];
  onVolumeChange: (pid: number, vol: number) => void;
  onMuteToggle: (pid: number, mute: boolean) => void;
  onRoutingChange: (pid: number, deviceId: string) => void;
  onSetDefault: (deviceId: string) => void;
}

const DeviceSection: React.FC<DeviceSectionProps> = ({
  device,
  sessions,
  peaks,
  devices,
  onVolumeChange,
  onMuteToggle,
  onRoutingChange,
  onSetDefault,
}) => {
  const deviceSessions = sessions.filter((s) => s.device_id === device.id);
  const masterSession = sessions.find((s) => s.process_id === 0 && s.device_id === device.id);

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5 flex-1 mr-4 overflow-hidden">
            <div
              className={`w-2 h-8 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] ${
                device.is_default ? "bg-blue-500" : "bg-white/10"
              }`}
            ></div>
            <h2
              className={`text-[28px] font-black tracking-tight uppercase truncate leading-none ${
                device.is_default ? "text-white/95" : "text-white/30"
              }`}
            >
              {device.name}
            </h2>
            {device.is_default && (
              <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black px-3 py-1 rounded-full border border-blue-500/30 tracking-[.2em] uppercase">
                DEFAULT
              </span>
            )}
          </div>
          {!device.is_default && (
            <button
              onClick={() => onSetDefault(device.id)}
              className="text-[10px] font-black text-white/20 hover:text-blue-400 transition-colors uppercase tracking-[.2em] border border-white/5 hover:border-blue-500/30 px-4 py-2 rounded-xl bg-white/5 shrink-0"
            >
              Use As Default
            </button>
          )}
        </div>

        {masterSession && (
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-[32px] p-6 flex items-center gap-6">
            <div className="w-12 h-12 flex-shrink-0 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[11px] font-black text-blue-300/60 uppercase tracking-[.3em]">
                  Master Volume
                </span>
                <span className="text-[20px] font-black font-mono text-blue-400 leading-none">
                  {Math.round(masterSession.volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterSession.volume}
                onChange={(e) => onVolumeChange(masterSession.process_id, parseFloat(e.target.value))}
                className="fluent-slider master-slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 ${masterSession.volume * 100}%, rgba(255,255,255,0.02) ${masterSession.volume * 100}%)`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {deviceSessions
          .filter((s) => s.process_id !== 0)
          .map((s) => (
            <AppCard
              key={s.process_id}
              session={s}
              devices={devices}
              peak={peaks[s.process_id] || 0}
              onVolumeChange={onVolumeChange}
              onMuteToggle={onMuteToggle}
              onRoutingChange={onRoutingChange}
            />
          ))}
      </div>
    </section>
  );
};

export default DeviceSection;
