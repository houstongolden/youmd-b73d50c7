# ASCII Portrait Generator — Full Replication Guide

> Copy-paste this entire document into another Lovable project (or any AI coding assistant) to replicate the ASCII portrait system, profile fetching pipeline, and terminal-inspired design system.

---

## Table of Contents

1. [Quick Start Prompt](#1-quick-start-prompt)
2. [Core Algorithm](#2-core-algorithm)
3. [AsciiAvatar Component (Thumbnails)](#3-asciiavatar-component)
4. [AsciiPortraitGenerator Component (Full Interactive Widget)](#4-asciiportraitgenerator-component)
5. [ProfileAsciiHeader Component (Responsive Page Header)](#5-profileasciiheader-component)
6. [Edge Function — fetch-x-profile](#6-edge-function--fetch-x-profile)
7. [CSS & Tailwind Design Tokens](#7-css--tailwind-design-tokens)
8. [Default Example — x.com/houstongolden](#8-default-example)

---

## 1. Quick Start Prompt

Paste this into your other Lovable project to get started:

```
Build an ASCII portrait generator with a terminal/CLI aesthetic. The system should:

1. Convert any photo into ASCII art using a luminance-based character ramp, rendered onto an HTML canvas with a burnt-orange monochrome color palette.

2. Include three component variants:
   - AsciiAvatar: small thumbnail (e.g. 200px wide, configurable columns)
   - AsciiPortraitGenerator: full interactive widget with drag-and-drop upload, URL fetch (GitHub/X/LinkedIn profile photo scraping via allorigins.win proxy), detail slider, generate button, hover-to-reveal-photo toggle, and PNG download
   - ProfileAsciiHeader: responsive full-width header that fills its parent container

3. Use this exact character ramp (densest → lightest):
   $@B%8&#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}?-_+~<>i!lI;:,". 

4. Color mapping: map luminance values to an 8-step burnt-orange HSL palette (see design tokens below). Pixels with luminance < 25 should be transparent.

5. Design system: dark-first terminal aesthetic with JetBrains Mono + Inter fonts, burnt orange accent (#c45a2d-ish), dark backgrounds (hsl 0 0% 5%), terminal-panel borders, and monospaced UI elements.

6. Default demo: fetch the profile photo from x.com/houstongolden and generate an ASCII portrait as the initial example.

Here are all the code files and design tokens needed — implement them exactly:

[paste sections 2-7 below]
```

---

## 2. Core Algorithm

These functions are shared across all three components. The pipeline is:

1. Draw the source image onto a tiny offscreen canvas (e.g. 120 columns wide)
2. Read each pixel's luminance using the ITU-R BT.601 formula
3. Map luminance to a character from the ASCII ramp
4. Render each character back onto a visible canvas with HSL colors

### Types & Constants

```typescript
// Character density ramp — 67 characters from densest ($) to lightest (space)
const RAMP = `$@B%8&#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}?-_+~<>i!lI;:,". `;

type AsciiCell = { ch: string; lum: number };
```

### Luminance → Color Mapping

Maps a 0-255 luminance value to one of 8 burnt-orange HSL steps. Very dark pixels become transparent (background bleed-through).

```typescript
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
```

### Image → ASCII Grid

Downsamples the image to `cols` width, computes luminance per pixel, maps to ramp character. The `0.46` aspect ratio correction accounts for monospace characters being ~2x taller than wide.

```typescript
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
```

### Render ASCII Grid → Canvas

Draws each character at the correct position with the mapped color. `cellW * 2.1` gives the vertical stretch that makes characters look square.

```typescript
function renderToCanvas(canvas: HTMLCanvasElement, data: AsciiCell[][], width: number) {
  const rows = data.length;
  const cols = data[0].length;
  canvas.width = width;
  const cellW = width / cols;
  const cellH = cellW * 2.1;
  canvas.height = Math.ceil(rows * cellH);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const fs = Math.max(4, Math.floor(cellH * 1.05));
  ctx.font = `${fs}px "Courier New",monospace`;
  ctx.textBaseline = "top";
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const { ch, lum } = data[y][x];
      ctx.fillStyle = lumToColor(lum);
      ctx.fillText(ch, x * cellW, y * cellH);
    }
}
```

---

## 3. AsciiAvatar Component

Small, self-contained thumbnail component. Pass an image URL and get an ASCII portrait canvas.

**File: `src/components/AsciiAvatar.tsx`**

```tsx
import { useRef, useEffect, useState } from "react";

const RAMP = `$@B%8&#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}?-_+~<>i!lI;:,". `;

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

type AsciiCell = { ch: string; lum: number };

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

function renderToCanvas(canvas: HTMLCanvasElement, data: AsciiCell[][], width: number) {
  const rows = data.length;
  const cols = data[0].length;
  canvas.width = width;
  const cellW = width / cols;
  const cellH = cellW * 2.1;
  canvas.height = Math.ceil(rows * cellH);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const fs = Math.max(4, Math.floor(cellH * 1.05));
  ctx.font = `${fs}px "Courier New",monospace`;
  ctx.textBaseline = "top";
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const { ch, lum } = data[y][x];
      ctx.fillStyle = lumToColor(lum);
      ctx.fillText(ch, x * cellW, y * cellH);
    }
}

interface AsciiAvatarProps {
  src: string;
  cols?: number;
  canvasWidth?: number;
  className?: string;
}

const AsciiAvatar = ({ src, cols = 120, canvasWidth = 200, className = "" }: AsciiAvatarProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const data = imgToAscii(img, cols);
      if (data.length && canvasRef.current) {
        renderToCanvas(canvasRef.current, data, canvasWidth);
        setReady(true);
      }
    };
    img.src = src;
  }, [src, cols, canvasWidth]);

  return (
    <canvas
      ref={canvasRef}
      className={`${className} ${ready ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
      style={{ imageRendering: "auto" }}
    />
  );
};

export default AsciiAvatar;
```

**Usage:**
```tsx
<AsciiAvatar src="https://pbs.twimg.com/profile_images/.../photo.jpg" cols={80} canvasWidth={160} />
```

---

## 4. AsciiPortraitGenerator Component

Full interactive widget with:
- Drag-and-drop / click-to-upload photo input
- URL fetch from GitHub/X/LinkedIn via allorigins.win CORS proxy
- Detail slider (40–120 columns)
- Generate button with animated loading bar
- Hover-to-reveal original photo
- Download as PNG
- "About" tab explaining the pipeline

**File: `src/components/AsciiPortraitGenerator.tsx`**

```tsx
import { useState, useRef, useCallback, useEffect } from "react";

/* ── ASCII ramp & color mapping ── */
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

function renderPortrait(canvas: HTMLCanvasElement, data: AsciiCell[][]) {
  if (!data?.length) return;
  const rows = data.length;
  const cols = data[0].length;
  const W = canvas.width;
  const cellW = W / cols;
  const cellH = cellW * 2.1;
  canvas.height = Math.ceil(rows * cellH);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  // Use a dark background — adjust to your theme's --bg value
  ctx.fillStyle = "#0d0d0d";
  ctx.fillRect(0, 0, W, canvas.height);
  const fs = Math.max(6, Math.floor(cellH * 1.05));
  ctx.font = `${fs}px "Courier New",monospace`;
  ctx.textBaseline = "top";
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const { ch, lum } = data[y][x];
      ctx.fillStyle = lumToColor(lum);
      ctx.fillText(ch, x * cellW, y * cellH);
    }
}

const LOAD_FRAMES = [
  "▰▱▱▱▱▱▱▱",
  "▰▰▱▱▱▱▱▱",
  "▰▰▰▱▱▱▱▱",
  "▰▰▰▰▱▱▱▱",
  "▰▰▰▰▰▱▱▱",
  "▰▰▰▰▰▰▱▱",
  "▰▰▰▰▰▰▰▱",
  "▰▰▰▰▰▰▰▰",
];

const AsciiPortraitGenerator = () => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [asciiData, setAsciiData] = useState<AsciiCell[][] | null>(null);
  const [cols, setCols] = useState(120);
  const [showPhoto, setShowPhoto] = useState(false);
  const [tab, setTab] = useState<"portrait" | "about">("portrait");
  const [urlInput, setUrlInput] = useState("");
  const [urlStatus, setUrlStatus] = useState("");
  const [generating, setGenerating] = useState(false);
  const [loadFrame, setLoadFrame] = useState(0);

  const fileRef = useRef<HTMLInputElement>(null);
  const portraitRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!generating) return;
    const t = setInterval(() => setLoadFrame((f) => (f + 1) % LOAD_FRAMES.length), 120);
    return () => clearInterval(t);
  }, [generating]);

  useEffect(() => {
    if (asciiData && portraitRef.current) renderPortrait(portraitRef.current, asciiData);
  }, [asciiData]);

  const handleGenerate = useCallback(() => {
    if (!imgUrl) return;
    setGenerating(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () =>
      setTimeout(() => {
        setAsciiData(imgToAscii(img, cols));
        setGenerating(false);
      }, 20);
    img.src = imgUrl;
  }, [cols, imgUrl]);

  const loadFile = useCallback((file: File | undefined) => {
    if (!file?.type.startsWith("image/")) return;
    setAsciiData(null);
    setImgLoaded(false);
    setUrlStatus("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setImgUrl(url);
      const img = new Image();
      img.onload = () => setImgLoaded(true);
      img.src = url;
    };
    reader.readAsDataURL(file);
  }, []);

  // ── URL FETCH via allorigins.win CORS proxy ──
  // This scrapes the og:image or GitHub avatar from any public profile URL
  const handleUrlFetch = useCallback(async () => {
    const url = urlInput.trim();
    if (!url) return;
    setUrlStatus("fetching...");
    try {
      const res = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
      );
      const html = ((await res.json()) as { contents?: string }).contents || "";
      const og =
        html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
        html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i)?.[1];
      const gh = html.match(
        /https:\/\/avatars\.githubusercontent\.com\/[^\s"'?]+/i
      )?.[0];
      const found = og || gh;
      if (found) {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(found)}`;
        setImgUrl(proxyUrl);
        setAsciiData(null);
        setImgLoaded(false);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => setImgLoaded(true);
        img.src = proxyUrl;
        setUrlStatus("ready — click generate");
      } else {
        setUrlStatus("no image found — upload directly");
      }
    } catch {
      setUrlStatus("fetch failed — upload directly");
    }
  }, [urlInput]);

  return (
    <div className="w-full">
      {/* Portrait display area */}
      <div className="relative w-full aspect-square max-w-md mx-auto mb-6 overflow-hidden rounded border border-border bg-background flex items-center justify-center">
        {asciiData && !showPhoto && (
          <canvas ref={portraitRef} width={500} className="w-full" />
        )}
        {asciiData && showPhoto && imgUrl && (
          <img src={imgUrl} alt="Original" className="w-full h-full object-cover" />
        )}
        {!asciiData && (
          <div className="text-center p-8">
            {imgLoaded ? (
              <>
                <p className="text-accent font-mono text-xs mb-2">PHOTO READY</p>
                <div className="w-12 h-px bg-accent/30 mx-auto mb-2" />
                <p className="text-muted-foreground font-mono text-[10px]">click generate below</p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground/40 font-mono text-2xl mb-3">[ ]</p>
                <p className="text-muted-foreground/60 font-mono text-[10px] leading-relaxed">
                  UPLOAD PHOTO<br />TO GENERATE ASCII PORTRAIT
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 mb-0">
        {(["portrait", "about"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-mono text-[10px] px-4 py-1 border border-b-0 rounded-t transition-colors ${
              tab === t
                ? "bg-primary text-primary-foreground font-bold border-primary"
                : "bg-transparent text-muted-foreground/50 border-border hover:text-muted-foreground"
            }`}
          >
            {tab === t ? "▶ " : ""}{t}.sh
          </button>
        ))}
      </div>

      {tab === "portrait" && (
        <div className="terminal-panel rounded-tl-none p-5 space-y-4">
          <p className="text-accent font-mono text-[10px]">
            $ you portrait --generate --cols={cols}
          </p>

          {/* Upload area */}
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={(e) => { e.preventDefault(); loadFile(e.dataTransfer.files[0]); }}
            onDragOver={(e) => e.preventDefault()}
            className={`border border-dashed px-4 py-3 cursor-pointer inline-flex items-center gap-2 font-mono text-[10px] transition-colors ${
              imgLoaded
                ? "border-success/30 text-success/70 bg-background"
                : "border-border text-muted-foreground/50 bg-background hover:border-accent/30"
            }`}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => loadFile(e.target.files?.[0])} />
            {imgLoaded ? "✓ photo loaded · click to replace" : "drag & drop · or click to upload"}
          </div>

          {/* URL input */}
          <div className="space-y-2">
            <p className="text-muted-foreground/50 font-mono text-[9px]">
              or paste github / linkedin / x profile url:
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlFetch()}
                placeholder="https://x.com/houstongolden"
                className="font-mono text-[10px] bg-background border border-border text-foreground/60 px-2 py-1.5 w-64 outline-none focus:border-accent/40 transition-colors"
              />
              <button onClick={handleUrlFetch}
                className="font-mono text-[10px] text-accent hover:text-accent/80 transition-colors">
                fetch →
              </button>
              {urlStatus && (
                <span className="text-muted-foreground/50 font-mono text-[9px]">{urlStatus}</span>
              )}
            </div>
          </div>

          {/* Detail slider */}
          {imgLoaded && (
            <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground/60">
              <span>detail</span>
              <input type="range" min={40} max={120} value={cols}
                onChange={(e) => setCols(+e.target.value)} className="w-24 accent-primary" />
              <span className="text-accent">{cols}</span>
            </div>
          )}

          {/* Generate + action buttons */}
          {imgLoaded && (
            <div className="flex gap-3 items-center flex-wrap">
              <button onClick={handleGenerate} disabled={generating}
                className="cta-primary px-4 py-2.5 font-mono text-[10px] disabled:opacity-50">
                {generating ? `${LOAD_FRAMES[loadFrame]}  GENERATING` : "▶  GENERATE PORTRAIT"}
              </button>
              {asciiData && (
                <>
                  <button
                    onMouseEnter={() => setShowPhoto(true)}
                    onMouseLeave={() => setShowPhoto(false)}
                    className="cta-outline px-3 py-2.5 font-mono text-[10px]">
                    hold: reveal photo
                  </button>
                  <button
                    onClick={() => {
                      if (!portraitRef.current) return;
                      const link = document.createElement("a");
                      link.download = "you-portrait.png";
                      link.href = portraitRef.current.toDataURL("image/png");
                      link.click();
                    }}
                    className="cta-outline px-3 py-2.5 font-mono text-[10px]">
                    ↓ download .png
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {tab === "about" && (
        <div className="terminal-panel rounded-tl-none p-5 font-mono text-[10px] leading-[1.9] space-y-4">
          <p className="text-accent">// PORTRAIT PIPELINE</p>
          <p className="text-muted-foreground">
            1. share a profile url (github / linkedin / x)<br />
            2. scrape + download your avatar<br />
            3. pixel→ascii algorithm maps brightness to chars<br />
            4. chars colored via orange luminance palette<br />
            5. portrait rendered to canvas + downloadable as PNG
          </p>
        </div>
      )}
    </div>
  );
};

export default AsciiPortraitGenerator;
```

---

## 5. ProfileAsciiHeader Component

Responsive header that fills its parent width. Uses framer-motion for fade-in. Useful as a profile page hero.

**File: `src/components/ProfileAsciiHeader.tsx`**

```tsx
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  avatarUrl: string;
}

const ProfileAsciiHeader = ({ avatarUrl }: ProfileAsciiHeaderProps) => {
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
    img.src = avatarUrl;
  }, [avatarUrl]);

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
```

**Usage:**
```tsx
<ProfileAsciiHeader avatarUrl="https://pbs.twimg.com/profile_images/.../photo_400x400.jpg" />
```

**Dependencies:** `framer-motion` (for the fade-in animation). Remove the `motion.div` wrapper if you don't want the dependency.

---

## 6. Edge Function — fetch-x-profile

Server-side profile scraping for X/Twitter, GitHub, and LinkedIn. Runs as a Supabase Edge Function (Deno). Bypasses CORS restrictions that prevent browser-side fetching.

**File: `supabase/functions/fetch-x-profile/index.ts`**

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProfileResult {
  profileImageUrl: string | null;
  displayName: string | null;
  bio: string | null;
  platform: string;
  location: string | null;
  website: string | null;
  followers: number | null;
  following: number | null;
  posts: number | null;
  joinedDate: string | null;
  headline: string | null;
  company: string | null;
  links: string[];
  extras: Record<string, string | number | null>;
}

function emptyResult(platform: string): ProfileResult {
  return {
    profileImageUrl: null, displayName: null, bio: null, platform,
    location: null, website: null, followers: null, following: null,
    posts: null, joinedDate: null, headline: null, company: null,
    links: [], extras: {},
  };
}

// ── X / TWITTER ──
// Uses the Twitter syndication API (no auth required) to scrape profile data
async function fetchXProfile(username: string): Promise<ProfileResult> {
  const result = emptyResult('x');

  try {
    const res = await fetch(
      `https://syndication.twitter.com/srv/timeline-profile/screen-name/${username}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'text/html',
        },
        redirect: 'follow',
      }
    );
    if (res.ok) {
      const html = await res.text();

      // Profile image — upgrade to 400x400
      const imgMatch = html.match(/https:\/\/pbs\.twimg\.com\/profile_images\/[^"'\s]+/);
      if (imgMatch?.[0]) {
        result.profileImageUrl = imgMatch[0]
          .replace(/_normal\.(jpg|jpeg|png|gif|webp)/i, '_400x400.$1')
          .replace(/_bigger\.(jpg|jpeg|png|gif|webp)/i, '_400x400.$1')
          .replace(/_mini\.(jpg|jpeg|png|gif|webp)/i, '_400x400.$1');
      }

      const nameMatch = html.match(/"name"\s*:\s*"([^"]+)"/);
      if (nameMatch?.[1]) result.displayName = nameMatch[1];

      const bioMatch = html.match(/"description"\s*:\s*"([^"]*?)"/);
      if (bioMatch?.[1] && bioMatch[1].length > 0) {
        result.bio = bioMatch[1].replace(/\\n/g, ' ').replace(/\\u[\dA-Fa-f]{4}/g, (m) => {
          try { return JSON.parse(`"${m}"`); } catch { return m; }
        });
      }

      const locMatch = html.match(/"location"\s*:\s*"([^"]+)"/);
      if (locMatch?.[1]) result.location = locMatch[1];

      const followersMatch = html.match(/"followers_count"\s*:\s*(\d+)/);
      if (followersMatch?.[1]) result.followers = parseInt(followersMatch[1]);

      const followingMatch = html.match(/"friends_count"\s*:\s*(\d+)/) || html.match(/"following_count"\s*:\s*(\d+)/);
      if (followingMatch?.[1]) result.following = parseInt(followingMatch[1]);

      const tweetsMatch = html.match(/"statuses_count"\s*:\s*(\d+)/);
      if (tweetsMatch?.[1]) result.posts = parseInt(tweetsMatch[1]);

      const urlMatch = html.match(/"expanded_url"\s*:\s*"(https?:\/\/[^"]+)"/);
      if (urlMatch?.[1] && !urlMatch[1].includes('twitter.com') && !urlMatch[1].includes('x.com')) {
        result.website = urlMatch[1];
        result.links.push(urlMatch[1]);
      }

      const allUrls = html.matchAll(/"expanded_url"\s*:\s*"(https?:\/\/[^"]+)"/g);
      for (const m of allUrls) {
        if (m[1] && !m[1].includes('twitter.com') && !m[1].includes('x.com') && !result.links.includes(m[1])) {
          result.links.push(m[1]);
        }
      }

      const createdMatch = html.match(/"created_at"\s*:\s*"([^"]+)"/);
      if (createdMatch?.[1]) result.joinedDate = createdMatch[1];

      const verifiedMatch = html.match(/"verified"\s*:\s*(true|false)/);
      if (verifiedMatch?.[1]) result.extras.verified = verifiedMatch[1];

      const bannerMatch = html.match(/https:\/\/pbs\.twimg\.com\/profile_banners\/[^"'\s]+/);
      if (bannerMatch?.[0]) result.extras.bannerUrl = bannerMatch[0];
    } else {
      await res.text();
    }
  } catch (e) {
    console.log('X syndication failed:', e);
  }

  if (!result.profileImageUrl) {
    result.profileImageUrl = `https://unavatar.io/x/${username}`;
  }

  return result;
}

// ── GITHUB ──
// Uses the public GitHub API (no auth, 60 req/hr rate limit)
async function fetchGitHubProfile(username: string): Promise<ProfileResult> {
  const result = emptyResult('github');

  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'you-md-agent/1.0',
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    if (res.ok) {
      const data = await res.json();
      result.profileImageUrl = data.avatar_url;
      result.displayName = data.name || null;
      result.bio = data.bio || null;
      result.location = data.location || null;
      result.website = data.blog || null;
      result.followers = data.followers ?? null;
      result.following = data.following ?? null;
      result.posts = data.public_repos ?? null;
      result.company = data.company || null;
      result.joinedDate = data.created_at || null;
      result.extras.publicRepos = data.public_repos ?? null;
      result.extras.publicGists = data.public_gists ?? null;
      result.extras.hireable = data.hireable;
      result.extras.twitterUsername = data.twitter_username || null;

      if (data.blog) result.links.push(data.blog.startsWith('http') ? data.blog : `https://${data.blog}`);
      if (data.twitter_username) result.links.push(`https://x.com/${data.twitter_username}`);
      if (data.html_url) result.links.push(data.html_url);
    } else {
      await res.text();
    }
  } catch (e) {
    console.log('GitHub API failed:', e);
  }

  // Fetch top repos for extra context
  if (result.profileImageUrl) {
    try {
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=5`, {
        headers: { 'User-Agent': 'you-md-agent/1.0', 'Accept': 'application/vnd.github.v3+json' },
      });
      if (reposRes.ok) {
        const repos = await reposRes.json();
        const topRepos = repos
          .filter((r: any) => !r.fork)
          .slice(0, 5)
          .map((r: any) => ({ name: r.name, description: r.description, stars: r.stargazers_count, language: r.language }));
        if (topRepos.length > 0) {
          result.extras.topRepos = JSON.stringify(topRepos);
          const langs = [...new Set(topRepos.map((r: any) => r.language).filter(Boolean))];
          if (langs.length > 0) result.extras.languages = langs.join(', ');
        }
      }
    } catch (e) {
      console.log('GitHub repos fetch failed:', e);
    }
  }

  if (!result.profileImageUrl) {
    result.profileImageUrl = `https://github.com/${username}.png?size=400`;
  }

  return result;
}

// ── LINKEDIN ──
// Scrapes public LinkedIn profile pages for og:image and metadata
async function fetchLinkedInProfile(slug: string): Promise<ProfileResult> {
  const result = emptyResult('linkedin');

  try {
    const res = await fetch(`https://www.linkedin.com/in/${slug}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    if (res.ok) {
      const html = await res.text();

      const ogMatch = html.match(/<meta\s+(?:property|name)="og:image"\s+content="([^"]+)"/i)
        || html.match(/content="([^"]+)"\s+(?:property|name)="og:image"/i);
      if (ogMatch?.[1] && !ogMatch[1].includes('static.licdn.com/sc/h/') && !ogMatch[1].includes('default')) {
        result.profileImageUrl = ogMatch[1];
      }

      const titleMatch = html.match(/<meta\s+(?:property|name)="og:title"\s+content="([^"]+)"/i)
        || html.match(/content="([^"]+)"\s+(?:property|name)="og:title"/i);
      if (titleMatch?.[1]) {
        const parts = titleMatch[1].split(/\s*[-–|]\s*/);
        result.displayName = parts[0]?.trim() || null;
        if (parts.length > 1 && !parts[parts.length - 1].includes('LinkedIn')) {
          result.headline = parts.slice(1).filter(p => !p.includes('LinkedIn')).join(' — ').trim() || null;
        }
      }

      const descMatch = html.match(/<meta\s+(?:property|name)="og:description"\s+content="([^"]+)"/i)
        || html.match(/content="([^"]+)"\s+(?:property|name)="og:description"/i);
      if (descMatch?.[1]) result.bio = descMatch[1];

      const locMatch = html.match(/<span[^>]*class="[^"]*top-card--bullet[^"]*"[^>]*>([^<]+)</i)
        || html.match(/<span[^>]*class="[^"]*top-card-layout__first-subline[^"]*"[^>]*>([^<]+)</i);
      if (locMatch?.[1]) result.location = locMatch[1].trim();

      const followersMatch = html.match(/(\d+)\+?\s*followers/i);
      if (followersMatch?.[1]) result.followers = parseInt(followersMatch[1]);
    } else {
      await res.text();
    }
  } catch (e) {
    console.log('LinkedIn fetch failed:', e);
  }

  if (!result.profileImageUrl) {
    result.profileImageUrl = `https://unavatar.io/linkedin/${slug}`;
  }

  return result;
}

// ── URL DETECTION ──
function detectPlatform(url: string): { platform: string; identifier: string } | null {
  const lower = url.toLowerCase().trim();

  const xMatch = lower.match(/(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]+)/i);
  if (xMatch) return { platform: 'x', identifier: xMatch[1] };

  const ghMatch = lower.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  if (ghMatch && !['orgs', 'topics', 'settings', 'marketplace', 'explore'].includes(ghMatch[1]))
    return { platform: 'github', identifier: ghMatch[1] };

  const liMatch = lower.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (liMatch) return { platform: 'linkedin', identifier: liMatch[1] };

  return null;
}

// ── HANDLER ──
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const url: string | undefined = body.url;
    const username: string | undefined = body.username;
    const platform: string | undefined = body.platform;

    let detected: { platform: string; identifier: string } | null = null;

    if (url) {
      detected = detectPlatform(url);
    } else if (username && platform) {
      detected = { platform, identifier: username.replace(/^@/, '').trim() };
    } else if (username) {
      detected = { platform: 'x', identifier: username.replace(/^@/, '').trim() };
    }

    if (!detected) {
      return new Response(
        JSON.stringify({ success: false, error: 'Could not detect platform. Supported: x.com, github.com, linkedin.com/in/' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result: ProfileResult;
    switch (detected.platform) {
      case 'x': result = await fetchXProfile(detected.identifier); break;
      case 'github': result = await fetchGitHubProfile(detected.identifier); break;
      case 'linkedin': result = await fetchLinkedInProfile(detected.identifier); break;
      default:
        return new Response(
          JSON.stringify({ success: false, error: `Unsupported platform: ${detected.platform}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify({ success: true, data: { username: detected.identifier, ...result } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

**Calling from client-side:**
```typescript
import { supabase } from "@/integrations/supabase/client";

const { data } = await supabase.functions.invoke("fetch-x-profile", {
  body: { url: "https://x.com/houstongolden" },
});
// data.data.profileImageUrl → feed into AsciiAvatar or AsciiPortraitGenerator
```

---

## 7. CSS & Tailwind Design Tokens

### Font Imports

Add to your `index.html` `<head>` or top of `index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500;600&display=swap');
```

### index.css — Full Design System

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Dark mode is default */
    --bg: 0 0% 5%;
    --bg-raised: 0 0% 9%;
    --text-primary: 30 10% 92%;
    --text-secondary: 30 8% 65%;
    --border-color: 0 0% 18%;

    /* Burnt orange accent system */
    --accent: 20 60% 52%;
    --accent-dark: 20 60% 42%;
    --accent-mid: 20 50% 62%;
    --accent-light: 24 45% 75%;
    --accent-wash: 20 30% 12%;

    /* Semantic tokens */
    --background: var(--bg);
    --foreground: var(--text-primary);
    --card: var(--bg-raised);
    --card-foreground: var(--text-primary);
    --popover: var(--bg-raised);
    --popover-foreground: var(--text-primary);
    --primary: var(--accent);
    --primary-foreground: 0 0% 100%;
    --secondary: 0 0% 12%;
    --secondary-foreground: var(--text-primary);
    --muted-val: 0 0% 14%;
    --muted-foreground: var(--text-secondary);
    --accent-color: var(--accent);
    --accent-foreground: 0 0% 100%;
    --destructive: 0 60% 50%;
    --destructive-foreground: 0 0% 100%;
    --success: 130 40% 45%;
    --border: var(--border-color);
    --input: 0 0% 12%;
    --ring: var(--accent);
    --radius: 0.25rem;

    --font-mono: "JetBrains Mono", "SF Mono", "Consolas", monospace;
    --font-body: "Inter", -apple-system, system-ui, sans-serif;
  }

  /* Light mode override */
  .light {
    --bg: 36 20% 96%;
    --bg-raised: 0 0% 100%;
    --text-primary: 0 0% 8%;
    --text-secondary: 30 8% 32%;
    --border-color: 30 10% 84%;
    --accent: 20 60% 45%;
    --accent-dark: 20 65% 35%;
    --accent-mid: 20 50% 55%;
    --accent-light: 24 45% 70%;
    --accent-wash: 30 25% 92%;
    --secondary: 36 15% 89%;
    --muted-val: 36 12% 86%;
    --input: 36 15% 89%;
  }
}

html { scroll-behavior: smooth; }

@layer base {
  * { @apply border-border; }
  body {
    @apply bg-background text-foreground antialiased;
    font-family: var(--font-body);
    line-height: 1.65;
    font-size: 15px;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-mono);
    line-height: 1.2;
  }
  code, pre, .font-mono {
    font-family: var(--font-mono);
  }
}

/* Terminal panel — bordered card with raised background */
.terminal-panel {
  background: hsl(var(--bg-raised));
  border: 1px solid hsl(var(--border));
  border-radius: 4px;
}

.terminal-panel-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-bottom: 1px solid hsl(var(--border));
}

.terminal-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: hsl(var(--muted-foreground) / 0.15);
}

/* CTA buttons */
.cta-primary {
  background: hsl(var(--accent));
  color: hsl(0 0% 100%);
  font-family: var(--font-mono);
  @apply font-medium rounded transition-all duration-300;
}
.cta-primary:hover {
  background: hsl(var(--accent-dark));
}

.cta-outline {
  border: 1px solid hsl(var(--border));
  color: hsl(var(--muted-foreground));
  font-family: var(--font-mono);
  @apply font-medium rounded transition-all duration-300;
}
.cta-outline:hover {
  border-color: hsl(var(--accent) / 0.4);
  color: hsl(var(--accent));
}

/* Blinking cursor */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.cursor-blink { animation: blink 1s step-end infinite; }

/* ASCII art color utility classes */
.ascii-strong { color: hsl(var(--accent)); }
.ascii-mid { color: hsl(var(--accent-mid)); }
.ascii-soft { color: hsl(var(--accent-light)); }
.ascii-glow { color: hsl(var(--accent) / 0.25); }
.ascii-beam { color: hsl(var(--accent) / 0.4); text-shadow: 0 0 8px hsl(var(--accent) / 0.15); }
.ascii-dim { color: hsl(var(--muted-foreground) / 0.3); }

/* Selection */
::selection { background: hsl(var(--accent) / 0.2); }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: hsl(var(--muted-foreground) / 0.15); border-radius: 3px; }
```

### tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "SF Mono", "Consolas", "monospace"],
        body: ["Inter", "-apple-system", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          dark: "hsl(var(--accent-dark))",
          mid: "hsl(var(--accent-mid))",
          light: "hsl(var(--accent-light))",
          wash: "hsl(var(--accent-wash))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted-val))",
          foreground: "hsl(var(--muted-foreground))",
        },
        success: "hsl(var(--success))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

---

## 8. Default Example — x.com/houstongolden

To use Houston Golden's X profile as the default seed portrait:

### Client-side (browser, via allorigins.win proxy):

```typescript
// Fetch Houston's profile photo from X and generate ASCII portrait
const url = "https://x.com/houstongolden";
const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
const html = ((await res.json()) as { contents?: string }).contents || "";

// Extract profile image from the page HTML
const imgMatch = html.match(/https:\/\/pbs\.twimg\.com\/profile_images\/[^\s"']+/);
if (imgMatch?.[0]) {
  const hiRes = imgMatch[0].replace(/_normal\./i, '_400x400.');
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(hiRes)}`;

  // Feed into AsciiAvatar
  // <AsciiAvatar src={proxyUrl} cols={120} canvasWidth={400} />
}
```

### Server-side (Edge Function):

```typescript
// Call the fetch-x-profile edge function
const { data } = await supabase.functions.invoke("fetch-x-profile", {
  body: { url: "https://x.com/houstongolden" },
});

if (data?.success) {
  const profile = data.data;
  // profile.profileImageUrl → high-res avatar URL
  // profile.displayName → "Houston Golden"
  // profile.bio → bio text
  // profile.followers → follower count
  // profile.links → array of linked URLs
}
```

### Pre-populating the generator:

In `AsciiPortraitGenerator`, set the default URL input to Houston's profile:

```tsx
const [urlInput, setUrlInput] = useState("https://x.com/houstongolden");
```

Then auto-fetch on mount:

```tsx
useEffect(() => {
  if (urlInput === "https://x.com/houstongolden") {
    handleUrlFetch();
  }
}, []); // runs once on mount
```

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `react` | UI framework |
| `framer-motion` | Fade-in animations (ProfileAsciiHeader) |
| `tailwindcss` | Utility CSS |
| `tailwindcss-animate` | Animation utilities |
| `@supabase/supabase-js` | Edge function invocation (server-side fetching) |

---

## Architecture Notes

- **CORS**: Browser-side image fetching uses `allorigins.win` as a CORS proxy. For production, consider self-hosting a proxy or using the Edge Function exclusively.
- **Rate limits**: GitHub API allows 60 requests/hour without auth. X syndication API is undocumented and may change. LinkedIn scraping is fragile and may require authentication for consistent results.
- **Canvas rendering**: The ASCII art is rendered to `<canvas>` (not DOM spans) for performance. A 120-column portrait generates ~6,600 characters — canvas handles this smoothly.
- **Aspect ratio**: The `0.46` multiplier in `imgToAscii` corrects for monospace characters being roughly 2.17x taller than wide. Adjust if using a different font.
- **Color palette**: The 8-step burnt-orange palette creates a monochrome warmth effect. To change the hue, adjust the first value in each `hsl()` call in `lumToColor()` (currently 20-24°).
