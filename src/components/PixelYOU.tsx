import { useEffect, useRef } from "react";

/*
 * Bold blocky "YOU" — clean geometric style inspired by Skills.sh / Claude Code.
 * Each letter drawn as filled cells on a coarse grid with 3D depth.
 */

// 6 wide × 8 tall grid, 1 = filled block
const FONT: Record<string, number[][]> = {
  Y: [
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [0,1,1,1,1,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
  ],
  O: [
    [0,1,1,1,1,0],
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [0,1,1,1,1,0],
  ],
  U: [
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [0,1,1,1,1,0],
  ],
};

const COLS = 6;
const ROWS = 8;
const GAP = 1; // grid cells between letters

function drawYOU(canvas: HTMLCanvasElement, dpr: number) {
  const bs = 16; // block size in px
  const depth = 4;
  const totalCols = COLS * 3 + GAP * 2;

  const w = totalCols * bs + depth;
  const h = ROWS * bs + depth;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  // Collect cells
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

  const gap = 2; // pixel gap between blocks
  const size = bs - gap;

  // Pass 1: shadow
  for (const { x, y } of cells) {
    ctx.fillStyle = "hsl(20 30% 15%)";
    ctx.fillRect(x + depth, y + depth, size, size);
  }

  // Pass 2: dark outline border
  for (const { x, y } of cells) {
    ctx.fillStyle = "hsl(20 40% 25%)";
    ctx.fillRect(x - 1, y - 1, size + 2, size + 2);
  }

  // Pass 3: main face
  for (const { x, y } of cells) {
    // Base color
    ctx.fillStyle = "hsl(20 55% 48%)";
    ctx.fillRect(x, y, size, size);

    // Top highlight
    ctx.fillStyle = "hsl(20 50% 58%)";
    ctx.fillRect(x, y, size, 3);

    // Left highlight
    ctx.fillStyle = "hsl(20 48% 54%)";
    ctx.fillRect(x, y + 3, 3, size - 6);

    // Bottom shadow edge
    ctx.fillStyle = "hsl(20 50% 34%)";
    ctx.fillRect(x, y + size - 3, size, 3);

    // Right shadow edge
    ctx.fillStyle = "hsl(20 50% 36%)";
    ctx.fillRect(x + size - 3, y + 3, 3, size - 6);
  }
}

const PixelYOU = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) drawYOU(canvasRef.current, window.devicePixelRatio || 1);
  }, []);

  return <canvas ref={canvasRef} className="block" style={{ imageRendering: "auto" }} />;
};

export default PixelYOU;
