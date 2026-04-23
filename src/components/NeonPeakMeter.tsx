import React, { useRef, useEffect } from "react";

interface NeonPeakMeterProps {
  peak: number;
}

const NeonPeakMeter: React.FC<NeonPeakMeterProps> = ({ peak }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // キャンバスをクリア
    ctx.clearRect(0, 0, width, height);

    // 背景レール
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.roundRect(0, 0, width, height, height / 2);
    ctx.fill();

    if (peak <= 0.001) return;

    // メーターの幅を計算
    const peakWidth = width * Math.min(peak, 1.0);

    // ネオングラデーションの作成
    const gradient = ctx.createLinearGradient(0, 0, peakWidth, 0);
    gradient.addColorStop(0, "#3b82f6"); // Blue 500
    gradient.addColorStop(0.5, "#22d3ee"); // Cyan 400
    gradient.addColorStop(1, "#34d399"); // Emerald 400

    // 発光効果（Bloom）
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(59, 130, 246, 0.8)";
    
    // メインバーの描画
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, peakWidth, height, height / 2);
    ctx.fill();

    // 先端の強い光（Highlight）
    if (peakWidth > 4) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#34d399";
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(peakWidth - 2, height / 2, height / 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [peak]);

  return (
    <canvas
      ref={canvasRef}
      width={400} // 高解像度向けに大きめに確保（CSSで調整）
      height={8}
      className="w-full h-[4px] pointer-events-none"
    />
  );
};

export default NeonPeakMeter;
