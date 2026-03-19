import { useEffect, useRef } from "react";

/*
 * Bold blocky "YOU" — inspired by Skills.sh / Claude Code style.
 * Large solid rectangles, not tiny pixels. Each letter is hand-designed
 * as a set of filled rectangles on a coarse grid.
 */

type Rect = [x: number, y: number, w: number, h: number];

// Letters on a 10×12 unit grid using thick solid blocks
const LETTERS: Record<string, Rect[]> = {
  Y: [
    // Left arm
    [0, 0, 3, 4],
    // Right arm
    [7, 0, 3, 4],
    // Diagonal meeting
    [2, 3, 3, 3],
    [5, 3, 3, 3],
    // Stem
    [3, 5, 4, 7],
  ],
  O: [
    // Top bar
    [2, 0, 6, 3],
    // Bottom bar
    [2, 9, 6, 3],
    // Left wall
    [0, 2, 3, 8],
    // Right wall
    [7, 2, 3, 8],
  ],
  U: [
    // Left wall
    [0, 0, 3, 10],
    // Right wall
    [7, 0, 3, 10],
    // Bottom bar
    [2, 9, 6, 3],
  ],
};

const GRID = 12; // rows tall
const LETTER_W = 10;
const LETTER_GAP = 3;

function drawYOU(canvas: HTMLCanvasElement, dpr: number) {
  const unit = 10; // px per grid unit
  const depth = 5; // 3D shadow depth
  const totalW = LETTER_W * 3 + LETTER_GAP * 2;

  const w = totalW * unit + depth;
  const h = GRID * unit + depth;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  // Collect all rects with absolute positions
  const allRects: Rect[] = [];
  let ox = 0;
  for (const ch of "YOU") {
    const rects = LETTERS[ch];
    if (!rects) continue;
    for (const [rx, ry, rw, rh] of rects) {
      allRects.push([
        ox + rx * unit,
        ry * unit,
        rw * unit,
        rh * unit,
      ]);
    }
    ox += (LETTER_W + LETTER_GAP) * unit;
  }

  // Shadow layer
  for (const [x, y, w, h] of allRects) {
    ctx.fillStyle = "hsl(20 35% 14%)";
    ctx.fillRect(x + depth, y + depth, w, h);
  }

  // Outline / border layer
  const border = 2;
  for (const [x, y, w, h] of allRects) {
    ctx.fillStyle = "hsl(20 45% 28%)";
    ctx.fillRect(x - border, y - border, w + border * 2, h + border * 2);
  }

  // Main face
  for (const [x, y, w, h] of allRects) {
    ctx.fillStyle = "hsl(20 58% 50%)";
    ctx.fillRect(x, y, w, h);

    // Top highlight
    ctx.fillStyle = "hsl(20 52% 60%)";
    ctx.fillRect(x, y, w, 3);

    // Left highlight
    ctx.fillStyle = "hsl(20 50% 56%)";
    ctx.fillRect(x, y, 3, h);

    // Bottom edge
    ctx.fillStyle = "hsl(20 55% 36%)";
    ctx.fillRect(x, y + h - 3, w, 3);

    // Right edge
    ctx.fillStyle = "hsl(20 55% 38%)";
    ctx.fillRect(x + w - 3, y, 3, h);
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
