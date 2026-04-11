# Terminal / CLI / TUI Aesthetic — Full Replication Guide

> A comprehensive reference for replicating the terminal-native UI/UX system used in you.md.
> Covers design tokens, layout patterns, responsive strategies, components, animations, and
> the interaction model that makes it feel like a real CLI/TUI on both desktop and mobile.

---

## Table of Contents

1. [Quick-Start Prompt (paste into another Lovable project)](#1-quick-start-prompt)
2. [Design Philosophy](#2-design-philosophy)
3. [Color System & CSS Variables](#3-color-system--css-variables)
4. [Typography](#4-typography)
5. [Tailwind Config](#5-tailwind-config)
6. [Core CSS Utilities](#6-core-css-utilities)
7. [Reusable Terminal Components](#7-reusable-terminal-components)
8. [Split-Screen Shell Layout](#8-split-screen-shell-layout)
9. [Terminal Auth Flow](#9-terminal-auth-flow)
10. [Landing Page Patterns](#10-landing-page-patterns)
11. [Navigation (Glass Nav + Mobile Overlay)](#11-navigation)
12. [Animation & Motion](#12-animation--motion)
13. [Mobile Responsiveness Best Practices](#13-mobile-responsiveness)
14. [Interaction Model: Command-Driven UX](#14-interaction-model)
15. [Pixel Art Branding Component](#15-pixel-art-branding)
16. [Accessibility Notes](#16-accessibility)

---

## 1. Quick-Start Prompt

Paste this into another Lovable project to bootstrap the full terminal aesthetic:

```
I want to build a terminal/CLI-inspired web app with these exact design principles:

AESTHETIC:
- Dark-mode default with a "living terminal" feel
- Monochrome palette with a single burnt-orange accent color
- JetBrains Mono for all headings, commands, labels; Inter for body text
- No cards, no gradients, no rounded corners > 4px — everything feels like a TUI
- Vertical rhythm and generous whitespace instead of traditional UI chrome

INTERACTION MODEL:
- Command-driven navigation using slash commands (e.g. /help, /settings, /profile)
- CLI-style selectable options replace buttons (e.g. "> enter system", "> view docs")
- Blinking cursor on input areas
- Boot sequence on page load (typed system logs, status updates)
- Terminal input pinned to bottom with scrolling history above

LAYOUT:
- Split-screen shell: 50/50 on desktop (terminal left, preview right)
- On mobile (<768px): single pane with terminal/preview toggle buttons
- Slash commands auto-switch to preview pane on mobile
- Fixed terminal header bar with app name, version, and status dot

COMPONENTS NEEDED:
1. TerminalHeader — minimal header with title, no window dots
2. TerminalInput — styled HTML input with prompt character, monospace, CLI feel
3. TerminalLine — renders lines with optional typing animation and delay
4. Glass navbar — blurred background on scroll, monospace links with -- prefix
5. Mobile full-screen menu overlay
6. Boot sequence animation (typed text with cursor)
7. CLI pill (copyable command with blinking cursor)
8. FadeUp wrapper for scroll-triggered animations

CSS TOKENS (use HSL, define in :root):
- --bg: 0 0% 5%
- --bg-raised: 0 0% 9%
- --text-primary: 30 10% 92%
- --text-secondary: 30 8% 65%
- --border-color: 0 0% 18%
- --accent: 20 60% 52% (burnt orange)
- --accent-dark: 20 60% 42%
- --accent-mid: 20 50% 62%
- --accent-light: 24 45% 75%
- --accent-wash: 20 30% 12%
- --success: 130 40% 45%

Light mode override:
- --bg: 36 20% 96%
- --bg-raised: 0 0% 100%
- --accent: 20 60% 45%

Please set up the full index.css with these tokens, configure tailwind.config.ts
with the semantic color mappings, and create the core terminal components.
Use framer-motion for animations. Font import:
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500;600&display=swap');
```

---

## 2. Design Philosophy

### Core Tenets

1. **Terminal is the interface** — The entire app looks and feels like a modern TUI. No traditional web UI patterns (cards with shadows, colorful gradients, rounded avatars). Every element earns its place.

2. **Monospace is the identity anchor** — JetBrains Mono isn't decorative; it's structural. Headings, labels, commands, navigation — all mono. The subordinate sans-serif (Inter) only appears in body/paragraph text.

3. **Command-driven, not click-driven** — Users type slash commands instead of clicking buttons. Menu items are prefixed with `>` or `--`. The cursor blinks. Everything suggests "type here."

4. **Vertical rhythm over visual noise** — Hierarchy comes from spacing and alignment, not weight, color variety, or font size. Generous whitespace. Minimal borders (1px, low-opacity).

5. **One accent color, used surgically** — Burnt orange appears only on: the prompt character, active states, success indicators, and interactive highlights. Everything else is grayscale with opacity variations.

6. **No window chrome** — Terminal headers omit the red/yellow/green dots. The aesthetic is protocol-first, not OS-metaphor.

---

## 3. Color System & CSS Variables

### Dark Mode (Default)

```css
:root {
  /* Base surfaces */
  --bg: 0 0% 5%;           /* near-black background */
  --bg-raised: 0 0% 9%;    /* panels, terminal bodies */

  /* Text hierarchy */
  --text-primary: 30 10% 92%;    /* main text — warm off-white */
  --text-secondary: 30 8% 65%;   /* secondary/muted text */

  /* Borders */
  --border-color: 0 0% 18%;      /* subtle panel borders */

  /* Accent system — burnt orange */
  --accent: 20 60% 52%;           /* primary interactive color */
  --accent-dark: 20 60% 42%;      /* hover/pressed states */
  --accent-mid: 20 50% 62%;       /* softer accent for secondary elements */
  --accent-light: 24 45% 75%;     /* very soft, for decorative use */
  --accent-wash: 20 30% 12%;      /* background tint, barely visible */

  /* Semantic mappings */
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
  --radius: 0.25rem;    /* 4px — very subtle rounding */

  /* Font stacks */
  --font-mono: "JetBrains Mono", "SF Mono", "Consolas", monospace;
  --font-body: "Inter", -apple-system, system-ui, sans-serif;
}
```

### Light Mode Override

```css
.light {
  --bg: 36 20% 96%;           /* warm paper */
  --bg-raised: 0 0% 100%;     /* pure white panels */
  --text-primary: 0 0% 8%;
  --text-secondary: 30 8% 32%;
  --border-color: 30 10% 84%;
  --accent: 20 60% 45%;        /* slightly deeper orange for contrast */
  --accent-dark: 20 65% 35%;
  --accent-mid: 20 50% 55%;
  --accent-light: 24 45% 70%;
  --accent-wash: 30 25% 92%;
  --secondary: 36 15% 89%;
  --muted-val: 36 12% 86%;
  --input: 36 15% 89%;
}
```

### Why This Works

- **Warm neutrals** (hue 30) instead of pure gray prevent the "cold terminal" fatigue
- **Single-hue accent** (hue 20, burnt orange) creates instant brand recognition
- **Opacity as hierarchy** — `text-muted-foreground/60`, `/40`, `/30` create depth without new colors
- **4px border-radius** keeps everything feeling rectangular/terminal without being harsh

---

## 4. Typography

### Font Import

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500;600&display=swap');
```

### Assignment Rules

```css
body {
  font-family: var(--font-body);  /* Inter */
  line-height: 1.65;
  font-size: 15px;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-mono);  /* JetBrains Mono */
  line-height: 1.2;
}

code, pre, .font-mono {
  font-family: var(--font-mono);
}
```

### Size Scale (Terminal Context)

| Element | Size | Usage |
|---------|------|-------|
| Shell output lines | `text-[11px]` mobile, `text-[12px]` desktop | Terminal history |
| Terminal input | `text-[12px]` mobile, `text-sm` (14px) desktop | Command input |
| Panel headers | `text-[10px]` to `text-[11px]` | Section labels |
| Boot sequence | `text-[11px]` | System messages |
| Navbar links | `text-[10px]` desktop, `text-[14px]` mobile overlay | Navigation |
| Status badges | `text-[8px]` to `text-[10px]` uppercase tracking-widest | Metadata |
| Hero title | Canvas-rendered or `text-4xl`/`text-6xl` | Branding |

### Key Principle

> Never use large font sizes for hierarchy. Use spacing, opacity, and the mono/sans distinction instead. The largest text in the terminal UI is typically 14px.

---

## 5. Tailwind Config

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
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
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

---

## 6. Core CSS Utilities

These go in your `index.css` after the Tailwind directives:

```css
/* ═══════════════════════════════════════════
   TERMINAL PANEL
   Base container for any terminal-style box
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   CLI PILL
   Copyable command badge (e.g. "npx youmd init")
   ═══════════════════════════════════════════ */
.cli-pill {
  font-family: var(--font-mono);
  @apply text-sm rounded transition-all duration-300 cursor-pointer select-none;
  background: hsl(var(--bg-raised));
  border: 1px solid hsl(var(--border));
}
.cli-pill:hover {
  border-color: hsl(var(--accent) / 0.5);
}

/* ═══════════════════════════════════════════
   CTA BUTTONS
   Primary (filled accent) and Outline variants
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   BLINKING CURSOR
   ═══════════════════════════════════════════ */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.cursor-blink {
  animation: blink 1s step-end infinite;
}

/* ═══════════════════════════════════════════
   STATUS PULSE
   For live-status dots (green = connected)
   ═══════════════════════════════════════════ */
@keyframes status-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 hsl(var(--success) / 0.4); }
  50% { opacity: 0.7; box-shadow: 0 0 0 4px hsl(var(--success) / 0); }
}
.status-dot-pulse {
  animation: status-pulse 2s ease-in-out infinite;
}

/* ═══════════════════════════════════════════
   BEAM GLOW
   Subtle radial gradient for hero atmosphere
   ═══════════════════════════════════════════ */
@keyframes beam-pulse {
  0%, 100% { opacity: 0.08; }
  50% { opacity: 0.18; }
}
.beam-glow {
  background: radial-gradient(
    ellipse 60px 400px at center,
    hsl(var(--accent) / 0.12),
    hsl(var(--accent-mid) / 0.04) 40%,
    transparent 70%
  );
  animation: beam-pulse 5s ease-in-out infinite;
}

/* ═══════════════════════════════════════════
   GLASS NAV
   Frosted-glass navbar on scroll
   ═══════════════════════════════════════════ */
.glass-nav {
  background: hsl(var(--bg) / 0.9);
  border: 1px solid hsl(var(--border));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* ═══════════════════════════════════════════
   SECTION DIVIDER
   ═══════════════════════════════════════════ */
.section-divider {
  height: 1px;
  background: hsl(var(--border));
}

/* ═══════════════════════════════════════════
   SELECTION & SCROLLBAR
   ═══════════════════════════════════════════ */
::selection {
  background: hsl(var(--accent) / 0.2);
}
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.15);
  border-radius: 3px;
}
```

---

## 7. Reusable Terminal Components

### 7a. TerminalHeader

Minimal header for any terminal panel. No window dots — just a title label.

```tsx
const TerminalHeader = ({ title = "terminal" }: { title?: string }) => (
  <div className="terminal-panel-header border-b border-border">
    <span className="font-mono text-[11px] text-muted-foreground/60">{title}</span>
  </div>
);

export default TerminalHeader;
```

### 7b. TerminalInput

A styled HTML input that looks like a CLI prompt. Supports text and password types.
Uses native input for cursor positioning, text selection, and arrow-key navigation.

```tsx
import { useState, useRef, useEffect } from "react";

interface TerminalInputProps {
  prompt?: string;
  placeholder?: string;
  type?: "text" | "password";
  onSubmit: (value: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
}

const TerminalInput = ({
  prompt = ">",
  placeholder = "",
  type = "text",
  onSubmit,
  autoFocus = true,
  disabled = false,
}: TerminalInputProps) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      onSubmit(value.trim());
      setValue("");
    }
  };

  return (
    <div
      className="flex items-start gap-1.5 sm:gap-2 font-mono text-[12px] sm:text-sm cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <span className="text-accent shrink-0 leading-relaxed pt-[1px]">
        {prompt}
      </span>
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-0 bg-transparent border-none outline-none
                   text-foreground font-mono text-[12px] sm:text-sm
                   leading-relaxed p-0 m-0 caret-accent
                   placeholder:text-muted-foreground/40"
        autoFocus={autoFocus}
        disabled={disabled}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TerminalInput;
```

**Key decisions:**
- `caret-accent` — the text cursor matches the brand color
- `min-w-0` — prevents flex overflow on mobile
- `bg-transparent border-none outline-none p-0 m-0` — strips all browser chrome
- Responsive sizes: `text-[12px]` on mobile, `text-sm` on desktop

### 7c. TerminalLine

Renders a single terminal output line with optional appear-delay and typing animation.

```tsx
import { useEffect, useState } from "react";

interface TerminalLineProps {
  children: React.ReactNode;
  delay?: number;
  typing?: boolean;
  className?: string;
  onComplete?: () => void;
}

const TerminalLine = ({
  children,
  delay = 0,
  typing = false,
  className = "",
  onComplete,
}: TerminalLineProps) => {
  const [visible, setVisible] = useState(delay === 0);
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(!typing);
  const text = typeof children === "string" ? children : "";

  useEffect(() => {
    if (delay > 0) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    }
  }, [delay]);

  useEffect(() => {
    if (!visible || !typing || !text) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setTypingDone(true);
        onComplete?.();
      }
    }, 18); // ~55 chars/sec — fast but readable
    return () => clearInterval(interval);
  }, [visible, typing, text, onComplete]);

  useEffect(() => {
    if (visible && !typing) onComplete?.();
  }, [visible, typing, onComplete]);

  if (!visible) return null;

  return (
    <div className={`font-mono text-[13px] leading-relaxed ${className}`}>
      {typing ? (
        <span>
          {typedText}
          {!typingDone && <span className="cursor-blink text-accent">█</span>}
        </span>
      ) : (
        children
      )}
    </div>
  );
};

export default TerminalLine;
```

### 7d. BlinkingCursor (Standalone)

```tsx
const BlinkingCursor = () => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      className="inline-block w-3 h-5 bg-primary align-middle"
      style={{ opacity: visible ? 1 : 0 }}
    />
  );
};
```

---

## 8. Split-Screen Shell Layout

The primary app interface uses a 50/50 split with terminal on the left and a dynamic preview pane on the right. On mobile, it collapses to a single pane with a toggle.

### Desktop Layout

```tsx
{/* Full-height shell */}
<div className="h-screen bg-card flex flex-col">
  {/* Top bar */}
  <div className="border-b border-border bg-card flex items-center justify-between px-3 sm:px-4 py-2">
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="font-mono text-accent text-xs sm:text-sm font-semibold">APP</span>
      <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/50">v0.1.0</span>
    </div>
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Mobile toggle — shown only on mobile */}
      {isMobile && (
        <div className="flex items-center border border-border rounded overflow-hidden">
          <button
            onClick={() => setMobileView("terminal")}
            className={`px-2 py-1 text-[10px] font-mono transition-colors ${
              mobileView === "terminal"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground/60 hover:text-foreground"
            }`}
          >
            terminal
          </button>
          <button
            onClick={() => setMobileView("preview")}
            className={`px-2 py-1 text-[10px] font-mono transition-colors ${
              mobileView === "preview"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground/60 hover:text-foreground"
            }`}
          >
            preview
          </button>
        </div>
      )}
      {/* Status dot */}
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${
        isConnected ? "bg-success" : "bg-muted-foreground/30"
      }`} />
      <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/60">
        @username
      </span>
    </div>
  </div>

  {/* Split panes */}
  {isMobile ? (
    <div className="flex-1 min-h-0">
      {mobileView === "terminal" ? terminalContent : previewContent}
    </div>
  ) : (
    <div className="flex-1 flex min-h-0">
      <div className="w-1/2 border-r border-border min-h-0">{terminalContent}</div>
      <div className="w-1/2 min-h-0">{previewContent}</div>
    </div>
  )}
</div>
```

### Terminal Content Structure

```tsx
const terminalContent = (
  <div className="flex flex-col min-h-0 h-full">
    <TerminalHeader title="@user — shell" />

    {/* Scrollable history */}
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4">
      {lines.map((line) => (
        <div
          key={line.id}
          className={`font-mono text-[11px] sm:text-[12px] leading-relaxed ${line.className || ""}`}
        >
          {line.content || "\u00A0"}
        </div>
      ))}
    </div>

    {/* Fixed input at bottom */}
    <div className="shrink-0 border-t border-border px-3 sm:px-4 py-2.5 bg-card">
      <TerminalInput prompt=">" placeholder="/help" onSubmit={handleCommand} />
      {/* Visual buffer below input */}
      <div className="h-16 sm:h-20" />
    </div>
  </div>
);
```

### Key Layout Patterns

- `h-screen flex flex-col` — full viewport, no document scroll
- `flex-1 min-h-0` — critical for making flex children scrollable
- `overflow-y-auto` on the history container only
- `shrink-0` on the input bar to prevent it from collapsing
- Visual buffer (`h-16 sm:h-20`) below input keeps it anchored mid-screen

### Auto-Scroll to Bottom

```tsx
const scrollRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  scrollRef.current?.scrollTo({
    top: scrollRef.current.scrollHeight,
    behavior: "smooth",
  });
}, [lines]);
```

### Mobile Auto-Switch on Command

When a user types a slash command on mobile, automatically switch to the preview pane:

```tsx
if (isMobile) {
  setTimeout(() => setMobileView("preview"), 300);
}
```

---

## 9. Terminal Auth Flow

Authentication rendered entirely as a terminal conversation:

### Boot → Choice → Email → Password → Verify/Done

```tsx
type Step = "boot" | "choice" | "email" | "password" | "verify_email" | "authenticating" | "done";

// Boot sequence with staggered timeouts
useEffect(() => {
  const timers = [
    setTimeout(() => addLine("app v0.1.0", "text-accent"), 200),
    setTimeout(() => addLine("identity system", "text-muted-foreground/60"), 600),
    setTimeout(() => addLine("\u00A0"), 900),
    setTimeout(() => addLine("authentication required", "text-muted-foreground/50"), 1100),
    setTimeout(() => setStep("choice"), 1600),
  ];
  return () => timers.forEach(clearTimeout);
}, []);

// Choice step
{step === "choice" && (
  <div className="mt-1">
    <span className="font-mono text-[12px] sm:text-[13px] text-muted-foreground/70 block mb-1">
      type <span className="text-accent">signin</span> or <span className="text-accent">signup</span>
    </span>
    <TerminalInput prompt=">" placeholder="signin" onSubmit={handleChoice} />
  </div>
)}

// Password masking in output
addLine(
  <span>
    <span className="text-accent">&gt;</span>
    <span className="text-muted-foreground"> password:</span>
    {"•".repeat(val.length)}
  </span>
);

// Success/error states
addLine(<span className="text-success">✓ authenticated</span>);
addLine(<span className="text-destructive">✗ invalid credentials</span>);

// Loading state
<div className="font-mono text-[12px] text-muted-foreground/50 flex items-center gap-2">
  <span className="animate-pulse">◌</span> authenticating...
</div>
```

### Auth Container

```tsx
<div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4">
  <div className="w-full max-w-2xl terminal-panel shadow-2xl">
    <TerminalHeader title="app — authenticate" />
    <div ref={scrollRef} className="p-4 sm:p-6 min-h-[300px] sm:min-h-[400px] max-h-[80vh] overflow-y-auto">
      {/* Lines render here */}
    </div>
  </div>
</div>
```

---

## 10. Landing Page Patterns

### Boot Sequence Hero

```tsx
const BootSequence = () => {
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "tagline" | "done">("typing");

  useEffect(() => {
    const word = "initializing system...";
    let i = 0;
    const timer = setInterval(() => {
      setTyped(word.slice(0, ++i));
      if (i >= word.length) {
        clearInterval(timer);
        setTimeout(() => setPhase("tagline"), 300);
        setTimeout(() => setPhase("done"), 1200);
      }
    }, 55);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-left inline-block">
      {phase === "typing" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="font-mono text-[11px] text-muted-foreground">
          {typed}<span className="cursor-blink text-accent">█</span>
        </motion.div>
      )}
      {(phase === "tagline" || phase === "done") && (
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="font-mono text-[11px] text-accent">
            system online
          </motion.div>
          {phase === "done" && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-mono text-[10px] text-muted-foreground mt-1">
              ready for input
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
```

### CLI Pill (Copyable Command)

```tsx
const CliPill = () => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText("npx myapp init");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button onClick={handleCopy} className="cli-pill flex items-center gap-3 px-5 py-3 group">
      <span className="text-muted-foreground">$</span>
      <span className="text-accent font-medium">npx myapp init</span>
      <span className="cursor-blink text-accent">█</span>
      <span className="ml-2 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors">
        {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
      </span>
    </button>
  );
};
```

### Command Links (Navigation as CLI)

```tsx
<div className="flex items-center justify-center gap-8 font-mono text-[12px]">
  <Link to="/app" className="text-muted-foreground/50 hover:text-accent transition-colors">
    &gt; enter app
  </Link>
  <a href="#docs" className="text-muted-foreground/50 hover:text-accent transition-colors">
    &gt; view docs
  </a>
</div>
```

### Minimal Landing Page (Full Example)

```tsx
const Landing = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    { label: "enter app", to: "/app" },
    { label: "view docs", to: "/docs" },
    { label: "github", to: "https://github.com/..." },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Top command line */}
      <div className="absolute top-6 left-6 md:top-8 md:left-10 font-mono text-primary text-sm md:text-base">
        <span className="text-primary/60">&gt;</span> npx myapp init
      </div>

      {/* Dotted separator */}
      <div className="absolute top-12 md:top-14 left-6 right-6 md:left-10 md:right-10
                      border-t border-dotted border-primary/30" />

      {/* Hero illustration area */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        {/* Your illustration/art here */}
      </div>

      {/* Title */}
      <h1 className="font-mono text-primary text-4xl md:text-6xl font-black tracking-wider">
        APP.NAME
      </h1>

      {/* Subtitle */}
      <p className="font-mono text-primary/70 text-sm md:text-base mt-1">
        your tagline here
      </p>

      {/* CLI Menu */}
      <nav className="mt-10 flex flex-col gap-3 font-mono text-primary text-lg md:text-xl">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="group flex items-center gap-2 hover:text-primary/80 transition-colors"
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span className="text-primary/60">&gt;</span>
            <span className={hoveredItem === item.label ? "underline underline-offset-4" : ""}>
              {item.label}
            </span>
          </Link>
        ))}

        {/* Cursor line */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-primary/60">&gt;</span>
          <BlinkingCursor />
        </div>
      </nav>
    </div>
  );
};
```

---

## 11. Navigation

### Glass Navbar

Transparent by default, frosted glass on scroll. Links use `--` prefix convention.

```tsx
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:pt-4">
        <div className={`max-w-xl mx-auto flex items-center justify-between gap-6
                        px-4 py-2 transition-all duration-500 rounded
                        ${scrolled ? "glass-nav" : "bg-transparent"}`}>
          <a href="/" className="text-accent font-mono text-[12px] tracking-tight">
            brand
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-5">
            <a href="#section" className="font-mono text-[10px] text-muted-foreground/60
                                         hover:text-foreground transition-colors">
              --section
            </a>
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link to="/auth" className="hidden md:inline-block cta-primary px-3 py-1 text-[10px]">
              &gt; enter system
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-muted-foreground p-1"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl
                        flex flex-col items-center justify-center gap-6">
          <a href="#section" onClick={() => setMobileOpen(false)}
             className="font-mono text-[14px] text-muted-foreground/70 hover:text-foreground">
            --section
          </a>
          <Link to="/auth" onClick={() => setMobileOpen(false)}
                className="cta-primary px-6 py-2.5 text-[12px] mt-4">
            &gt; enter system
          </Link>
        </div>
      )}
    </>
  );
};
```

**Key patterns:**
- `glass-nav` CSS class for blur effect on scroll
- `bg-background/98 backdrop-blur-xl` for mobile overlay (near-opaque)
- `font-mono text-[10px]` for nav links — extremely small, confident typography
- Lock `document.body.style.overflow` when mobile menu is open

---

## 12. Animation & Motion

### FadeUp Wrapper (Scroll-triggered)

```tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};
```

### Staggered Reveal (Boot Sequence Pattern)

Use `setTimeout` chains for sequential terminal line reveals:

```tsx
useEffect(() => {
  const timers = [
    setTimeout(() => addLine("line 1", "text-accent"), 200),
    setTimeout(() => addLine("line 2", "text-muted-foreground/60"), 500),
    setTimeout(() => addLine("\u00A0"), 700),      // blank line spacer
    setTimeout(() => addLine("line 3"), 1000),
    setTimeout(() => setReady(true), 1300),         // enable input
  ];
  return () => timers.forEach(clearTimeout);
}, []);
```

**Timing guidelines:**
- 200-300ms between related lines
- 500-700ms for section breaks
- 18ms per character for typing animation (~55 chars/sec)
- 530ms for cursor blink interval

### Hero Parallax (Scroll-driven opacity)

```tsx
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start start", "end start"],
});
const contentOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 0.8, 0]);

<motion.div style={{ opacity: contentOpacity }}>
  {/* hero content fades as you scroll */}
</motion.div>
```

---

## 13. Mobile Responsiveness

### Breakpoint Strategy

| Width | Behavior |
|-------|----------|
| < 768px (mobile) | Single-pane view, terminal/preview toggle, larger touch targets |
| ≥ 768px (desktop) | Split-screen shell, glass navbar, smaller text sizes |

### The `useIsMobile` Hook

```tsx
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
```

### Mobile-Specific Rules

1. **Padding scales down:** `p-3 sm:p-4` or `p-4 sm:p-8`
2. **Text scales down:** `text-[11px] sm:text-[12px]` or `text-[12px] sm:text-[13px]`
3. **Touch targets:** Minimum `py-2.5 px-6` for tappable elements
4. **ASCII/monospace content:** Use `overflow-x-auto` and `whitespace-pre-wrap sm:whitespace-pre`
5. **Split-screen collapses:** Single pane with toggle buttons
6. **Auto-switch on command:** Slash commands trigger preview pane on mobile
7. **No horizontal scroll:** `min-w-0` on flex children, `max-w-full` on wide content
8. **Full-screen mobile menu:** `fixed inset-0` with `backdrop-blur-xl`

### Responsive Class Patterns

```tsx
// Text sizing
className="font-mono text-[10px] sm:text-[11px]"
className="font-mono text-[11px] sm:text-[12px]"
className="font-mono text-[12px] sm:text-[13px]"
className="font-mono text-[12px] sm:text-sm"

// Padding
className="p-3 sm:p-4"
className="p-4 sm:p-6"
className="p-4 sm:p-8"
className="px-3 sm:px-4"

// Gaps
className="gap-1.5 sm:gap-2"
className="gap-2 sm:gap-3"

// Min heights
className="min-h-[300px] sm:min-h-[400px]"

// Container widths
className="max-w-xl mx-auto"  // terminal panels
className="max-w-2xl"          // auth modal
className="max-w-5xl"          // hero section
```

### Mobile Terminal Input

The input area needs special attention on mobile:
- `shrink-0` prevents it from collapsing
- Visual buffer (`h-16`) keeps it off the bottom edge
- `autoComplete="off" spellCheck={false}` prevents mobile keyboard suggestions
- The container `onClick` focuses the input (large tap target)

---

## 14. Interaction Model

### Slash Commands

Replace traditional navigation with typed commands:

```tsx
const SLASH_COMMANDS: Record<string, string> = {
  "/profile": "profile",
  "/settings": "settings",
  "/billing": "billing",
  "/help": "help",
  // ...
};

const handleCommand = (val: string) => {
  const cmd = val.toLowerCase().trim();

  // Echo the command
  addLine(
    <span>
      <span className="text-accent">&gt;</span>{" "}
      <span className="text-foreground">{val}</span>
    </span>
  );

  // Route to pane
  if (SLASH_COMMANDS[cmd]) {
    setActivePane(SLASH_COMMANDS[cmd]);
    addLine(<span className="text-muted-foreground/50">→ loading {SLASH_COMMANDS[cmd]}...</span>);

    // Mobile: auto-switch to preview
    if (isMobile) setTimeout(() => setMobileView("preview"), 300);

    setTimeout(() => {
      addLine(
        <span>
          <span className="text-success">✓</span>{" "}
          <span className="text-muted-foreground/50">{SLASH_COMMANDS[cmd]} loaded</span>
        </span>
      );
      addLine("\u00A0");
    }, 300);
    return;
  }

  // Natural language fallback
  // ... handle with AI or local logic
};
```

### Terminal Output Conventions

| Pattern | Usage |
|---------|-------|
| `→ action...` | System processing indicator |
| `✓ success` | Completed action (text-success) |
| `✗ error message` | Failed action (text-destructive) |
| `\u00A0` (nbsp) | Blank line spacer between blocks |
| `> user input` | Echoed user command |
| `◌ loading...` | Animated loading with `animate-pulse` |

### Help Command

```tsx
const showHelp = () => {
  addLine("\u00A0");
  addLine(<span className="text-accent">available commands:</span>);
  addLine("\u00A0");
  const cmds = [
    ["/profile", "view your profile"],
    ["/settings", "preferences"],
    ["/help", "show this help"],
  ];
  cmds.forEach(([cmd, desc]) => {
    addLine(
      <span>
        <span className="text-accent w-20 inline-block">{cmd.padEnd(14)}</span>
        <span className="text-muted-foreground/60">{desc}</span>
      </span>
    );
  });
  addLine("\u00A0");
};
```

---

## 15. Pixel Art Branding

Canvas-rendered pixel text for the app title. Reads CSS variables at runtime for theming.

```tsx
const FONT: Record<string, number[][]> = {
  Y: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  // ... define each letter as a 5×7 bitmap grid
};

const CELL_SIZE = 20;
const CELL_GAP = 2;
const LETTER_GAP = 18;

// Read CSS variables for theming
const getCssHsl = (styles: CSSStyleDeclaration, variable: string, alpha?: number) => {
  const value = styles.getPropertyValue(variable).trim();
  if (!value) return "transparent";
  return alpha === undefined ? `hsl(${value})` : `hsl(${value} / ${alpha})`;
};

function drawLetter(ctx, glyph, offsetX, colors) {
  // Merge horizontal/vertical runs into rectangles for clean rendering
  // Draw with face color + stroke + shadow layers for depth
}

// Render on <canvas> with DPR scaling
const canvas = canvasRef.current;
const dpr = window.devicePixelRatio || 1;
canvas.width = totalWidth * dpr;
canvas.height = totalHeight * dpr;
canvas.style.width = `${totalWidth}px`;
canvas.style.height = `${totalHeight}px`;
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
ctx.imageSmoothingEnabled = false;  // crisp pixels

// Re-render on theme change
const observer = new MutationObserver(render);
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["class", "style"],
});
```

Key: `style={{ imageRendering: "pixelated" }}` on the canvas element.

---

## 16. Accessibility Notes

Despite the terminal aesthetic, maintain accessibility:

1. **Semantic HTML** — Use `<nav>`, `<main>`, `<button>`, `<input>` elements
2. **aria-label** on icon-only buttons (hamburger menu, close, etc.)
3. **Color contrast** — The warm off-white on near-black passes WCAG AA
4. **Keyboard navigation** — All inputs accept Enter to submit, Tab to navigate
5. **Screen readers** — `aria-hidden="true"` on decorative elements (pixel art canvas, beam glow)
6. **Focus indicators** — `focus-visible:ring-2 focus-visible:ring-ring` on interactive elements
7. **Reduced motion** — Consider `prefers-reduced-motion` for boot sequences and typing animations

```css
@media (prefers-reduced-motion: reduce) {
  .cursor-blink { animation: none; opacity: 1; }
  .beam-glow { animation: none; }
  .status-dot-pulse { animation: none; }
}
```

---

## Summary: What Makes It Feel Real

1. **Consistent monospace** — Everything that could be in a terminal IS in monospace
2. **Tiny text sizes** — 10-13px range. Confident, not loud
3. **Opacity as hierarchy** — `/60`, `/50`, `/40`, `/30` create depth
4. **Single accent color** — Burnt orange on grayscale. No color palette noise
5. **Typed output** — Lines appear sequentially, some with typing animation
6. **Command echo** — User input is echoed back with `>` prefix in accent color
7. **Status symbols** — `✓` (success), `✗` (error), `→` (processing), `◌` (loading)
8. **Blank line spacing** — `\u00A0` between logical blocks
9. **No decorative chrome** — No window dots, no shadows on panels, no rounded corners > 4px
10. **Mobile-first collapse** — Single pane with toggle, not a cramped split
