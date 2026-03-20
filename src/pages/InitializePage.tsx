import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TerminalHeader from "@/components/shell/TerminalHeader";
import TerminalInput from "@/components/shell/TerminalInput";

interface Line {
  id: string;
  content: React.ReactNode;
  className?: string;
}

const BOOT_SEQUENCE: { text: string; className?: string; delay: number }[] = [
  { text: "you.md v0.1.0 — initialize", className: "text-accent", delay: 0 },
  { text: "", delay: 200 },
  { text: "loading session...", className: "text-muted-foreground/50", delay: 400 },
  { text: "✓ session verified", className: "text-success", delay: 900 },
  { text: "", delay: 1000 },
];

const InitializePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = (location.state as any)?.username || "houston";
  const [lines, setLines] = useState<Line[]>([]);
  const [phase, setPhase] = useState<"boot" | "claim" | "portrait" | "greet" | "gather" | "ready">("boot");
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineCounter = useRef(0);

  const addLine = useCallback((content: React.ReactNode, className?: string) => {
    const id = `l${lineCounter.current++}`;
    setLines((prev) => [...prev, { id, content, className }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, phase]);

  useEffect(() => {
    const timers = BOOT_SEQUENCE.map((item, i) =>
      setTimeout(() => {
        addLine(item.text || "\u00A0", item.className);
        if (i === BOOT_SEQUENCE.length - 1) {
          setTimeout(() => setPhase("claim"), 300);
        }
      }, item.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [addLine]);

  useEffect(() => {
    if (phase !== "claim") return;
    const timers = [
      setTimeout(() => addLine(<span className="text-muted-foreground/50">claiming @{username}...</span>), 0),
      setTimeout(() => {
        addLine(<span><span className="text-success">✓</span> <span className="text-foreground">@{username}</span> <span className="text-muted-foreground/50">— claimed and registered</span></span>);
        addLine("\u00A0");
      }, 800),
      setTimeout(() => setPhase("portrait"), 1200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase, username, addLine]);

  useEffect(() => {
    if (phase !== "portrait") return;
    const timers = [
      setTimeout(() => addLine("generating ascii portrait...", "text-muted-foreground/50"), 0),
      setTimeout(() => {
        const art = [
          "    ░░▒▒▓▓██▓▓▒▒░░    ",
          "  ░▒▓██████████████▓▒░  ",
          "  ▒███    ████    ███▒  ",
          "  ▓██  ●  ████  ●  ██▓  ",
          "  ▒███    ████    ███▒  ",
          "  ░▒▓██████████████▓▒░  ",
          "    ░░▒▒▓▓████▓▓▒▒░░    ",
        ];
        art.forEach((line) => addLine(<span className="text-accent/70">{line}</span>));
        addLine("\u00A0");
      }, 600),
      setTimeout(() => {
        addLine(<span><span className="text-success">✓</span> <span className="text-muted-foreground/50">portrait generated — 120 col detail</span></span>);
        addLine("\u00A0");
      }, 1400),
      setTimeout(() => setPhase("greet"), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase, addLine]);

  useEffect(() => {
    if (phase !== "greet") return;
    const timers = [
      setTimeout(() => addLine(<span className="text-accent">hey {username}.</span>), 0),
      setTimeout(() => addLine(<span className="text-foreground/80">welcome to you.md — your identity context layer for the agent internet.</span>), 400),
      setTimeout(() => addLine("\u00A0"), 600),
      setTimeout(() => addLine(<span className="text-foreground/80">i'm your identity agent. i'll help you build your context profile</span>), 800),
      setTimeout(() => addLine(<span className="text-foreground/80">so agents can understand who you are and what you do.</span>), 1000),
      setTimeout(() => addLine("\u00A0"), 1200),
      setTimeout(() => addLine(<span className="text-foreground/70">let's start with your links — drop a few and i'll pull context from them.</span>), 1400),
      setTimeout(() => addLine("\u00A0"), 1600),
      setTimeout(() => setPhase("gather"), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase, username, addLine]);

  const handleLink = useCallback((val: string) => {
    addLine(<span><span className="text-accent">&gt;</span> <span className="text-foreground">{val}</span></span>);
    setTimeout(() => {
      addLine(<span className="text-muted-foreground/50">→ indexing {val}...</span>);
      setTimeout(() => {
        addLine(<span><span className="text-success">✓</span> <span className="text-muted-foreground/50">source added — context extracted</span></span>);
        addLine("\u00A0");
        addLine(<span className="text-foreground/70">nice. drop another link, or type <span className="text-accent">/done</span> to continue.</span>);
        addLine("\u00A0");
      }, 800);
    }, 300);
  }, [addLine]);

  const handleGatherInput = useCallback((val: string) => {
    if (val === "/done") {
      addLine(<span><span className="text-accent">&gt;</span> <span className="text-foreground">/done</span></span>);
      addLine("\u00A0");
      setTimeout(() => {
        addLine(<span className="text-muted-foreground/50">building identity context from sources...</span>);
        setTimeout(() => {
          addLine(<span><span className="text-success">✓</span> <span className="text-foreground">identity context initialized</span></span>);
          addLine("\u00A0");
          addLine(<span className="text-foreground/80">your profile is live at <span className="text-accent">you.md/{username}</span></span>);
          addLine(<span className="text-foreground/70">entering shell environment...</span>);
          addLine("\u00A0");
          setPhase("ready");
          setTimeout(() => navigate("/shell", { state: { username } }), 2000);
        }, 1200);
      }, 400);
    } else {
      handleLink(val);
    }
  }, [addLine, handleLink, navigate, username]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl terminal-panel shadow-2xl">
        <TerminalHeader title="you.md — initialize" />

        <div ref={scrollRef} className="p-4 sm:p-6 min-h-[350px] sm:min-h-[500px] max-h-[80vh] overflow-y-auto">
          {lines.map((line) => (
            <div key={line.id} className={`font-mono text-[12px] sm:text-[13px] leading-relaxed ${line.className || ""}`}>
              {line.content || "\u00A0"}
            </div>
          ))}

          {phase === "gather" && (
            <TerminalInput
              prompt=">"
              placeholder="https://linkedin.com/in/you"
              onSubmit={handleGatherInput}
            />
          )}

          {phase === "ready" && (
            <div className="font-mono text-[12px] sm:text-[13px] text-muted-foreground/50 flex items-center gap-2">
              <span className="animate-pulse">◌</span> loading shell...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitializePage;
