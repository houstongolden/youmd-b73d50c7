import { useState } from "react";

const SectionLabel = ({ children }: { children: string }) => (
  <h3 className="font-mono text-[10px] sm:text-[11px] text-accent uppercase tracking-wider mb-2 sm:mb-3">&gt; {children}</h3>
);

const Divider = () => <div className="h-px bg-border my-4 sm:my-6" />;

const TokensPane = () => {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const tokens = [
    { name: "Default API Key", key: "you_live_k1a2b3c4d5e6f7g8h9i0", created: "2025-03-15", lastUsed: "2h ago" },
    { name: "CI/CD Pipeline", key: "you_live_m1n2o3p4q5r6s7t8u9v0", created: "2025-03-18", lastUsed: "12h ago" },
    { name: "Development", key: "you_test_x1y2z3a4b5c6d7e8f9g0", created: "2025-03-19", lastUsed: "never" },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/40">*/tokens</span>
      </div>

      <h2 className="font-mono text-sm sm:text-base text-foreground mb-4 sm:mb-6">api keys & tokens</h2>

      <SectionLabel>active tokens</SectionLabel>
      <div className="space-y-3">
        {tokens.map((t) => (
          <div key={t.name} className="terminal-panel p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] sm:text-[12px] text-foreground/80">{t.name}</span>
              <button
                onClick={() => setRevealed((r) => ({ ...r, [t.name]: !r[t.name] }))}
                className="font-mono text-[9px] sm:text-[10px] text-accent hover:text-accent-light transition-colors"
              >
                {revealed[t.name] ? "hide" : "reveal"}
              </button>
            </div>
            <div className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/50 bg-background rounded px-2 py-1.5 mb-2 overflow-x-auto">
              {revealed[t.name] ? t.key : "•".repeat(32)}
            </div>
            <div className="flex items-center gap-3 sm:gap-4 font-mono text-[9px] sm:text-[10px] text-muted-foreground/40">
              <span>created: {t.created}</span>
              <span>last used: {t.lastUsed}</span>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      <SectionLabel>create new token</SectionLabel>
      <div className="terminal-panel p-3 sm:p-4">
        <p className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/50">
          use the terminal to create tokens:
        </p>
        <div className="mt-2 font-mono text-[11px] sm:text-[12px] text-accent bg-background rounded px-2 sm:px-3 py-2 overflow-x-auto">
          &gt; create token "My New Key" --scope read,write
        </div>
      </div>

      <Divider />

      <SectionLabel>rate limits</SectionLabel>
      <div className="terminal-panel p-3 sm:p-4 space-y-2">
        {[
          { label: "reads / min", value: "100" },
          { label: "writes / min", value: "20" },
          { label: "daily quota", value: "50,000" },
        ].map((r) => (
          <div key={r.label} className="flex items-center justify-between font-mono text-[11px] sm:text-[12px]">
            <span className="text-muted-foreground/60">{r.label}</span>
            <span className="text-foreground/70">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokensPane;
