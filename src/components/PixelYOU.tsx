import { useEffect, useRef } from "react";

/* ── Bold pixel font 7×9 glyphs — 2-wide strokes for chunky feel ── */
const FONT: Record<string, number[][]> = {
  Y: [
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
  ],
  O: [
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
  ],
  U: [
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
  ],
};

const COLS = 7;
const ROWS = 9;
const GAP = 1; // columns between letters

function drawYOU(canvas: HTMLCanvasElement, dpr: number) {
  const bs = 14; // block size
  const shadow = 4; // 3D depth offset
  const totalCols = COLS * 3 + GAP * 2;

  canvas.width = (totalCols * bs + shadow) * dpr;
  canvas.height = (ROWS * bs + shadow) * dpr;
  canvas.style.width = `${totalCols * bs + shadow}px`;
  canvas.style.height = `${ROWS * bs + shadow}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Collect all active cells first for shadow pass
  const cells: { x: number; y: number }[] = [];
  let cx = 0;
  for (const ch of "YOU") {
    const g = FONT[ch];
    if (!g) continue;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!g[r][c]) continue;
        cells.push({ x: cx + c * bs, y: r * bs });
      }
    }
    cx += (COLS + GAP) * bs;
  }

  // Pass 1: Deep shadow layer
  for (const { x, y } of cells) {
    ctx.fillStyle = "hsl(20 40% 12%)";
    ctx.fillRect(x + shadow, y + shadow, bs - 1, bs - 1);
  }

  // Pass 2: Mid shadow / outline
  for (const { x, y } of cells) {
    ctx.fillStyle = "hsl(20 50% 22%)";
    ctx.fillRect(x + 2, y + 2, bs - 1, bs - 1);
  }

  // Pass 3: Main face with highlights
  for (const { x, y } of cells) {
    // Main block face
    ctx.fillStyle = "hsl(20 60% 52%)";
    ctx.fillRect(x, y, bs - 1, bs - 1);

    // Top highlight edge
    ctx.fillStyle = "hsl(20 55% 62%)";
    ctx.fillRect(x, y, bs - 1, 2);

    // Left highlight edge
    ctx.fillStyle = "hsl(20 55% 58%)";
    ctx.fillRect(x, y, 2, bs - 1);

    // Bottom dark edge
    ctx.fillStyle = "hsl(20 55% 36%)";
    ctx.fillRect(x, y + bs - 3, bs - 1, 2);

    // Right dark edge
    ctx.fillStyle = "hsl(20 55% 38%)";
    ctx.fillRect(x + bs - 3, y, 2, bs - 1);

    // Corner shadow
    ctx.fillStyle = "hsl(20 50% 28%)";
    ctx.fillRect(x + bs - 3, y + bs - 3, 2, 2);

    // Corner highlight
    ctx.fillStyle = "hsl(20 50% 68%)";
    ctx.fillRect(x, y, 2, 2);
  }
}

const PixelYOU = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const dpr = window.devicePixelRatio || 1;
      drawYOU(canvasRef.current, dpr);
    }
  }, []);

  return <canvas ref={canvasRef} className="block" style={{ imageRendering: "pixelated" }} />;
};

export default PixelYOU;
