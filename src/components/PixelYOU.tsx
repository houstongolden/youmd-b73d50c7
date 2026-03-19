import { useEffect, useRef } from "react";

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

const CELL_COLS = 5;
const CELL_ROWS = 7;
const CELL_SIZE = 20;
const CELL_GAP = 2;
const LETTER_GAP = 18;

const getCssHsl = (styles: CSSStyleDeclaration, variable: string, alpha?: number) => {
  const value = styles.getPropertyValue(variable).trim();
  if (!value) return alpha === undefined ? "transparent" : `hsl(0 0% 0% / ${alpha})`;
  return alpha === undefined ? `hsl(${value})` : `hsl(${value} / ${alpha})`;
};

function drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, colors: {
  face: string;
  stroke: string;
  shadowNear: string;
  shadowFar: string;
}) {
  const farOffset = 6;
  const nearOffset = 3;
  const lineInset = 0.5;

  ctx.lineWidth = 1;
  ctx.strokeStyle = colors.shadowFar;
  ctx.strokeRect(x + farOffset + lineInset, y + farOffset + lineInset, w - 1, h - 1);

  ctx.strokeStyle = colors.shadowNear;
  ctx.strokeRect(x + nearOffset + lineInset, y + nearOffset + lineInset, w - 1, h - 1);

  ctx.fillStyle = colors.face;
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = colors.stroke;
  ctx.strokeRect(x + lineInset, y + lineInset, w - 1, h - 1);
}

function drawYOU(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const totalWidth = CELL_COLS * CELL_SIZE * 3 + CELL_GAP * (CELL_COLS - 1) * 3 + LETTER_GAP * 2 + 8;
  const totalHeight = CELL_ROWS * CELL_SIZE + CELL_GAP * (CELL_ROWS - 1) + 8;

  canvas.width = totalWidth * dpr;
  canvas.height = totalHeight * dpr;
  canvas.style.width = `${totalWidth}px`;
  canvas.style.height = `${totalHeight}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const styles = getComputedStyle(document.documentElement);
  const colors = {
    face: getCssHsl(styles, "--foreground"),
    stroke: getCssHsl(styles, "--accent-dark"),
    shadowNear: getCssHsl(styles, "--accent", 0.85),
    shadowFar: getCssHsl(styles, "--muted-foreground", 0.55),
  };

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, totalWidth, totalHeight);
  ctx.imageSmoothingEnabled = false;

  let cursorX = 0;

  for (const char of "YOU") {
    const glyph = FONT[char];
    if (!glyph) continue;

    for (let row = 0; row < CELL_ROWS; row++) {
      for (let col = 0; col < CELL_COLS; col++) {
        if (!glyph[row][col]) continue;

        const x = cursorX + col * (CELL_SIZE + CELL_GAP);
        const y = row * (CELL_SIZE + CELL_GAP);
        drawCell(ctx, x, y, CELL_SIZE, colors);
      }
    }

    cursorX += CELL_COLS * (CELL_SIZE + CELL_GAP) - CELL_GAP + LETTER_GAP;
  }
}

const PixelYOU = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => drawYOU(canvas);
    render();

    window.addEventListener("resize", render);

    const observer = new MutationObserver(render);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => {
      window.removeEventListener("resize", render);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="block" style={{ imageRendering: "pixelated" }} />;
};

export default PixelYOU;
