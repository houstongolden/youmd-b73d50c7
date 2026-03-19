import { useEffect, useRef } from "react";

/*
 * Clean bold "YOU" — flat blocks with subtle border, no faux-3D noise.
 * 5-wide × 7-tall grid per letter, 2-wide strokes for weight.
 */

const FONT: Record<string, number[][]> = {
  Y: [
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [0,1,1,0,1,1,0],
    [0,0,1,1,1,0,0],
    [0,0,1,1,0,0,0],
    [0,0,1,1,0,0,0],
    [0,0,1,1,0,0,0],
  ],
  O: [
    [0,1,1,1,1,1,0],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [0,1,1,1,1,1,0],
  ],
  U: [
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [0,1,1,1,1,1,0],
  ],
};

const CELL_COLS = 7;
const CELL_ROWS = 7;
const LETTER_GAP = 2;

function drawYOU(canvas: HTMLCanvasElement, dpr: number) {
  const bs = 18;
  const gap = 3;
  const totalCols = CELL_COLS * 3 + LETTER_GAP * 2;

  const w = totalCols * bs;
  const h = CELL_ROWS * bs;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  let cx = 0;
  for (const ch of "YOU") {
    const g = FONT[ch];
    if (!g) continue;
    for (let r = 0; r < CELL_ROWS; r++) {
      for (let c = 0; c < CELL_COLS; c++) {
        if (!g[r][c]) continue;
        const x = cx + c * bs;
        const y = r * bs;
        const s = bs - gap;

        // Border
        ctx.fillStyle = "hsl(20 40% 28%)";
        ctx.fillRect(x, y, s, s);

        // Face — inset 1px
        ctx.fillStyle = "hsl(20 55% 48%)";
        ctx.fillRect(x + 1, y + 1, s - 2, s - 2);

        // Subtle top/left highlight
        ctx.fillStyle = "hsl(20 45% 56%)";
        ctx.fillRect(x + 1, y + 1, s - 2, 2);
        ctx.fillRect(x + 1, y + 1, 2, s - 2);
      }
    }
    cx += (CELL_COLS + LETTER_GAP) * bs;
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
