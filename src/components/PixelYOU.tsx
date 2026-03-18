import { useEffect, useRef } from "react";

/* ── Pixel font 5×7 glyphs ── */
const FONT: Record<string, number[][]> = {
  Y: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  O: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  U: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
};

function drawYOU(canvas: HTMLCanvasElement) {
  const bs = 13;
  canvas.width = (5 + 1 + 5 + 1 + 5 + 1) * bs + 8;
  canvas.height = 7 * bs;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let cx = 0;
  for (const ch of "YOU") {
    const g = FONT[ch];
    if (!g) continue;
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 5; c++) {
        if (!g[r][c]) continue;
        const x = cx + c * bs;
        const y = r * bs;
        ctx.fillStyle = "hsl(20 60% 52%)";
        ctx.fillRect(x, y, bs - 1, bs - 1);
        ctx.fillStyle = "hsl(20 60% 30%)";
        ctx.fillRect(x + bs - 3, y, 2, bs - 1);
        ctx.fillStyle = "hsl(20 60% 30%)";
        ctx.fillRect(x, y + bs - 3, bs - 1, 2);
        ctx.fillStyle = "hsl(20 60% 18%)";
        ctx.fillRect(x + bs - 3, y + bs - 3, 2, 2);
      }
    }
    cx += (5 + 1) * bs;
  }
}

const PixelYOU = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) drawYOU(canvasRef.current);
  }, []);

  return <canvas ref={canvasRef} className="block" style={{ imageRendering: "pixelated" }} />;
};

export default PixelYOU;
