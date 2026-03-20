import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TerminalHeader from "@/components/shell/TerminalHeader";
import TerminalInput from "@/components/shell/TerminalInput";
import ShellPreviewPane from "@/components/shell/ShellPreviewPane";

interface Line {
  id: string;
  content: React.ReactNode;
  className?: string;
}

const SLASH_COMMANDS: Record<string, string> = {
  "/profile": "profile",
  "/settings": "settings",
  "/billing": "billing",
  "/tokens": "tokens",
  "/activity": "activity",
  "/sources": "sources",
  "/portrait": "portrait",
  "/publish": "publish",
  "/agents": "agents",
  "/help": "help",
};

const ShellPage = () => {
  const location = useLocation();
  const username = (location.state as any)?.username || "houston";
  const [lines, setLines] = useState<Line[]>([]);
  const [activePane, setActivePane] = useState<string>("profile");
  const [previewMode, setPreviewMode] = useState<"public" | "private">("public");
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineCounter = useRef(0);

  const addLine = useCallback((content: React.ReactNode, className?: string) => {
    const id = `l${lineCounter.current++}`;
    setLines((prev) => [...prev, { id, content, className }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  // Initial shell boot
  useEffect(() => {
    const timers = [
      setTimeout(() => addLine(<span className="text-accent">you.md shell v0.1.0</span>), 200),
      setTimeout(() => addLine(<span className="text-muted-foreground/50">logged in as <span className="text-foreground">@{username}</span></span>), 500),
      setTimeout(() => addLine("\u00A0"), 700),
      setTimeout(() => addLine(<span className="text-muted-foreground/50">type <span className="text-accent">/help</span> for available commands</span>), 900),
      setTimeout(() => addLine("\u00A0"), 1100),
    ];
    return () => timers.forEach(clearTimeout);
  }, [addLine, username]);

  const showHelp = useCallback(() => {
    addLine("\u00A0");
    addLine(<span className="text-accent">available commands:</span>);
    addLine("\u00A0");
    const cmds = [
      ["/profile", "view and edit your identity profile"],
      ["/settings", "account and preference settings"],
      ["/billing", "plan and usage details"],
      ["/tokens", "api keys and access tokens"],
      ["/activity", "agent reads and sync history"],
      ["/public", "switch preview to public mode"],
      ["/private", "switch preview to private mode"],
      ["/sync", "trigger source re-sync"],
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
  }, [addLine]);

  const handleCommand = useCallback((val: string) => {
    addLine(<span><span className="text-accent">&gt;</span> <span className="text-foreground">{val}</span></span>);

    const cmd = val.toLowerCase().trim();

    if (cmd === "/help") {
      showHelp();
      return;
    }

    if (cmd === "/public") {
      setPreviewMode("public");
      addLine(<span className="text-success">✓ preview switched to public mode</span>);
      addLine("\u00A0");
      return;
    }

    if (cmd === "/private") {
      setPreviewMode("private");
      addLine(<span className="text-success">✓ preview switched to private mode</span>);
      addLine("\u00A0");
      return;
    }

    if (cmd === "/sync") {
      addLine(<span className="text-muted-foreground/50">syncing connected sources...</span>);
      setTimeout(() => {
        addLine(<span><span className="text-success">✓</span> <span className="text-muted-foreground/50">4 sources synced — freshness score: 94</span></span>);
        addLine("\u00A0");
      }, 1200);
      return;
    }

    if (SLASH_COMMANDS[cmd]) {
      setActivePane(SLASH_COMMANDS[cmd]);
      addLine(<span className="text-muted-foreground/50">→ loading {SLASH_COMMANDS[cmd]}...</span>);
      setTimeout(() => {
        addLine(<span><span className="text-success">✓</span> <span className="text-muted-foreground/50">{SLASH_COMMANDS[cmd]} loaded in preview</span></span>);
        addLine("\u00A0");
      }, 300);
      return;
    }

    // Treat as natural language / agent chat
    addLine(<span className="text-muted-foreground/50">thinking...</span>);
    setTimeout(() => {
      addLine(<span className="text-foreground/80">i can help with that. try a slash command like <span className="text-accent">/profile</span> to navigate, or just tell me what you'd like to update.</span>);
      addLine("\u00A0");
    }, 800);
  }, [addLine, showHelp]);

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border bg-card flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-accent text-sm font-semibold">YOU</span>
          <span className="font-mono text-[11px] text-muted-foreground/50">v0.1.0</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(previewMode === "public" ? "private" : "public")}
            className="font-mono text-[11px] text-muted-foreground/60 hover:text-accent transition-colors"
          >
            {previewMode === "public" ? "◉ public" : "◎ private"}
          </button>
          <div className="w-6 h-6 rounded-sm bg-accent/20 border border-accent/30 flex items-center justify-center">
            <span className="font-mono text-[9px] text-accent font-bold">
              {username[0]?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Terminal — 35% */}
        <div className="w-[35%] border-r border-border flex flex-col min-h-0">
          <TerminalHeader title={`@${username} — shell`} />
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
            {lines.map((line) => (
              <div key={line.id} className={`font-mono text-[12px] leading-relaxed ${line.className || ""}`}>
                {line.content || "\u00A0"}
              </div>
            ))}
            <div className="mt-1">
              <TerminalInput prompt=">" placeholder="/help" onSubmit={handleCommand} />
            </div>
          </div>
        </div>

        {/* Right: Preview — 65% */}
        <div className="w-[65%] overflow-y-auto bg-background">
          <ShellPreviewPane
            activePane={activePane}
            username={username}
            mode={previewMode}
          />
        </div>
      </div>
    </div>
  );
};

export default ShellPage;
