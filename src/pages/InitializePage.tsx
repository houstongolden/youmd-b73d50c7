import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TerminalHeader from "@/components/shell/TerminalHeader";
import TerminalInput from "@/components/shell/TerminalInput";
import AsciiAvatar from "@/components/AsciiAvatar";
import { useYouAgent } from "@/hooks/useYouAgent";
import { supabase } from "@/integrations/supabase/client";

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
  const agent = useYouAgent(username);
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
    const thinkingPhrase = agent.getThinkingPhrase("portrait");
    const timers = [
      setTimeout(() => addLine(thinkingPhrase, "text-muted-foreground/50"), 0),
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
  }, [phase, addLine, agent]);

  // Use agent greeting instead of hardcoded text
  useEffect(() => {
    if (phase !== "greet") return;
    const greeting = agent.getGreeting();
    const timers = greeting.map((text, i) =>
      setTimeout(() => {
        if (text === "") {
          addLine("\u00A0");
        } else if (i === 0) {
          addLine(<span className="text-accent">{text}</span>);
        } else {
          addLine(<span className="text-foreground/80">{text}</span>);
        }
      }, i * 300)
    );
    timers.push(setTimeout(() => {
      addLine("\u00A0");
      setPhase("gather");
    }, greeting.length * 300 + 200));
    return () => timers.forEach(clearTimeout);
  }, [phase, addLine, agent]);

  const handleLink = useCallback((val: string) => {
    addLine(<span><span className="text-accent">&gt;</span> <span className="text-foreground">{val}</span></span>);
    const thinkingPhrase = agent.getThinkingPhrase("discovery");
    setTimeout(() => {
      addLine(<span className="text-muted-foreground/50">→ {thinkingPhrase}</span>);

      // Detect supported platform URLs (x.com, github.com, linkedin.com)
      const isX = /(?:x\.com|twitter\.com)\/[a-zA-Z0-9_]+/i.test(val);
      const isGH = /github\.com\/[a-zA-Z0-9_-]+/i.test(val);
      const isLI = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i.test(val);

      if (isX || isGH || isLI) {
        const platformLabel = isX ? "x.com" : isGH ? "github" : "linkedin";
        addLine(<span className="text-muted-foreground/50">→ fetching profile from {platformLabel}...</span>);

        supabase.functions.invoke('fetch-x-profile', {
          body: { url: val },
        }).then(({ data, error }) => {
          if (error || !data?.success || !data?.data?.profileImageUrl) {
            addLine(<span className="text-muted-foreground/50">→ couldn't grab the profile photo — i'll use the default portrait</span>);
          } else {
            const imgUrl = data.data.profileImageUrl;
            const name = data.data.displayName;
            const fetchedUsername = data.data.username;
            if (name) {
              addLine(<span className="text-foreground/80">found you — {name} (@{fetchedUsername})</span>);
            }
            addLine(<span className="text-muted-foreground/50">→ generating ascii portrait from your real photo...</span>);
            addLine(
              <div className="my-2">
                <AsciiAvatar src={imgUrl} cols={80} canvasWidth={400} className="max-w-full" />
              </div>
            );
          }

          // Standard source reaction
          setTimeout(() => {
            const reaction = agent.getSourceReaction(val);
            addLine(<span className="text-foreground/80">{reaction}</span>);
            addLine("\u00A0");
            addLine(<span><span className="text-success">✓</span> <span className="text-muted-foreground/50">source added — context extracted</span></span>);
            addLine("\u00A0");
            const followUp = agent.getSourceFollowUp();
            addLine(<span className="text-foreground/70">{followUp}</span>);
            addLine("\u00A0");
          }, 600);
        });
      } else {
        // Non-X link: standard flow
        setTimeout(() => {
          const reaction = agent.getSourceReaction(val);
          addLine(<span className="text-foreground/80">{reaction}</span>);
          addLine("\u00A0");
          addLine(<span><span className="text-success">✓</span> <span className="text-muted-foreground/50">source added — context extracted</span></span>);
          addLine("\u00A0");
          const followUp = agent.getSourceFollowUp();
          addLine(<span className="text-foreground/70">{followUp}</span>);
          addLine("\u00A0");
        }, 800);
      }
    }, 300);
  }, [addLine, agent]);

  const handleGatherInput = useCallback((val: string) => {
    if (val === "/done") {
      addLine(<span><span className="text-accent">&gt;</span> <span className="text-foreground">/done</span></span>);
      addLine("\u00A0");
      const doneMsg = agent.getDoneMessage();
      setTimeout(() => {
        doneMsg.forEach((text) => addLine(<span className="text-muted-foreground/50">{text}</span>));
        const synthPhrase = agent.getThinkingPhrase("identity");
        setTimeout(() => {
          addLine(<span className="text-muted-foreground/50">{synthPhrase}</span>);
        }, 500);
        setTimeout(() => {
          const result = agent.getDoneResult();
          result.forEach((text, i) => {
            if (text === "") {
              addLine("\u00A0");
            } else if (i === 0) {
              addLine(<span><span className="text-success">✓</span> <span className="text-foreground">{text}</span></span>);
            } else {
              addLine(<span className="text-foreground/70">{text}</span>);
            }
          });
          addLine("\u00A0");
          setPhase("ready");
          setTimeout(() => navigate("/shell", { state: { username } }), 2000);
        }, 1200);
      }, 400);
    } else {
      handleLink(val);
    }
  }, [addLine, handleLink, navigate, username, agent]);

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
