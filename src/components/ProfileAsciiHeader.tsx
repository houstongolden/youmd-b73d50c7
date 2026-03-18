import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Profile } from "@/data/sampleProfiles";

const RAMP = `$@B%8&#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}?-_+~<>i!lI;:,". `;

type AsciiCell = { ch: string; lum: number };

function lumToColor(l: number): string {
  if (l < 25) return "transparent";
  if (l < 55) return "hsl(20 50% 10%)";
  if (l < 85) return "hsl(20 55% 16%)";
  if (l < 115) return "hsl(20 58% 24%)";
  if (l < 145) return "hsl(20 60% 34%)";
  if (l < 175) return "hsl(20 60% 42%)";
  if (l < 205) return "hsl(20 60% 52%)";
  if (l < 230) return "hsl(22 55% 60%)";
  return "hsl(24 50% 72%)";
}

function imgToAscii(imgEl: HTMLImageElement, cols: number): AsciiCell[][] {
  const c = document.createElement("canvas");
  const rows = Math.floor(cols * (imgEl.naturalHeight / imgEl.naturalWidth) * 0.46);
  c.width = cols;
  c.height = rows;
  const ctx = c.getContext("2d");
  if (!ctx) return [];
  ctx.filter = "contrast(1.35) brightness(1.05)";
  ctx.drawImage(imgEl, 0, 0, cols, rows);
  const px = ctx.getImageData(0, 0, cols, rows).data;
  return Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => {
      const i = (y * cols + x) * 4;
      const lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
      return { ch: RAMP[Math.floor((lum / 255) * (RAMP.length - 1))], lum };
    })
  );
}

interface ProfileAsciiHeaderProps {
  profile: Profile;
}

const ProfileAsciiHeader = ({ profile }: ProfileAsciiHeaderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const cols = 120;
      const data = imgToAscii(img, cols);
      if (!data.length || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const W = canvas.parentElement?.clientWidth || 680;
      canvas.width = W;
      const cellW = W / cols;
      const cellH = cellW * 2.1;
      canvas.height = Math.ceil(data.length * cellH);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, W, canvas.height);
      const fs = Math.max(4, Math.floor(cellH * 1.05));
      ctx.font = `${fs}px "Courier New",monospace`;
      ctx.textBaseline = "top";

      for (let y = 0; y < data.length; y++)
        for (let x = 0; x < cols; x++) {
          const { ch, lum } = data[y][x];
          ctx.fillStyle = lumToColor(lum);
          ctx.fillText(ch, x * cellW, y * cellH);
        }

      setReady(true);
    };
    img.src = profile.avatarUrl;
  }, [profile.avatarUrl]);

  return (
    <div className="w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: ready ? 1 : 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="py-6 md:py-8 max-w-[680px] mx-auto px-6"
      >
        <canvas ref={canvasRef} className="w-full" />
      </motion.div>
    </div>
  );
};

export default ProfileAsciiHeader;
