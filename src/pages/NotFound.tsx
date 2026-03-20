import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import TerminalHeader from "@/components/shell/TerminalHeader";

const NotFound = () => {
  const location = useLocation();
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const sequence = [
      { text: `> GET ${location.pathname}`, delay: 200 },
      { text: "", delay: 400 },
      { text: "✗ 404 — route not found", delay: 600 },
      { text: "", delay: 800 },
      { text: `the path "${location.pathname}" does not exist in the you.md system.`, delay: 1000 },
      { text: "", delay: 1200 },
      { text: "perhaps you meant:", delay: 1400 },
      { text: "  /auth        → authenticate", delay: 1600 },
      { text: "  /shell       → enter terminal", delay: 1700 },
      { text: "  /profiles    → browse identities", delay: 1800 },
      { text: "  /            → home", delay: 1900 },
    ];

    const timers = sequence.map((item, i) =>
      setTimeout(() => setLines((prev) => [...prev, item.text]), item.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl terminal-panel shadow-2xl">
        <TerminalHeader title="you.md — error" />

        <div className="p-6 min-h-[300px]">
          {lines.map((line, i) => (
            <div
              key={i}
              className={`font-mono text-[13px] leading-relaxed ${
                line.startsWith("✗") ? "text-destructive" :
                line.startsWith(">") ? "text-accent" :
                line.startsWith("  /") ? "text-accent/70" :
                line === "" ? "" :
                "text-muted-foreground/60"
              }`}
            >
              {line || "\u00A0"}
            </div>
          ))}

          <div className="mt-8 flex items-center gap-4">
            <Link
              to="/"
              className="font-mono text-[12px] text-accent hover:text-accent-light transition-colors"
            >
              &gt; go home
            </Link>
            <Link
              to="/auth"
              className="font-mono text-[12px] text-muted-foreground/50 hover:text-accent transition-colors"
            >
              &gt; authenticate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
