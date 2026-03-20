const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-mono text-[10px] sm:text-[11px] text-accent uppercase tracking-wider mb-2 sm:mb-3">&gt; {children}</h3>
);

const Divider = () => <div className="h-px bg-border my-4 sm:my-6" />;

const AgentsPane = ({ username }: { username: string }) => {
  const agents = [
    { name: "Claude (Anthropic)", verified: true, reads: "4,201", lastAccess: "2m ago", level: "full" },
    { name: "GPT-4 (OpenAI)", verified: true, reads: "3,847", lastAccess: "14m ago", level: "full" },
    { name: "Gemini (Google)", verified: true, reads: "2,109", lastAccess: "2h ago", level: "public" },
    { name: "Perplexity", verified: true, reads: "1,892", lastAccess: "5h ago", level: "full" },
    { name: "Copilot (Microsoft)", verified: false, reads: "643", lastAccess: "1d ago", level: "public" },
    { name: "Llama (Meta)", verified: false, reads: "312", lastAccess: "2d ago", level: "public" },
    { name: "Mistral", verified: false, reads: "198", lastAccess: "3d ago", level: "public" },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/40">*/agents</span>
      </div>

      <h2 className="font-mono text-sm sm:text-base text-foreground mb-4 sm:mb-6">agent network</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {[
          { label: "total reads", value: "14,203" },
          { label: "agents", value: "7" },
          { label: "verified", value: "4" },
          { label: "24h reads", value: "+847" },
        ].map((s) => (
          <div key={s.label} className="terminal-panel p-2 sm:p-3 text-center">
            <p className="font-mono text-[8px] sm:text-[9px] text-muted-foreground/50 uppercase">{s.label}</p>
            <p className="font-mono text-xs sm:text-sm text-foreground mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <SectionLabel>connected agents</SectionLabel>
      <div className="space-y-2">
        {agents.map((a) => (
          <div key={a.name} className="terminal-panel p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2 gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="font-mono text-[11px] sm:text-[12px] text-foreground/80 truncate">{a.name}</span>
                {a.verified && (
                  <span className="font-mono text-[7px] sm:text-[8px] text-success border border-success/20 rounded px-1 sm:px-1.5 py-0.5 bg-success/5 shrink-0">
                    ✓
                  </span>
                )}
              </div>
              <span className={`font-mono text-[9px] sm:text-[10px] uppercase shrink-0 ${
                a.level === "full" ? "text-accent" : "text-muted-foreground/50"
              }`}>
                {a.level}
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 font-mono text-[9px] sm:text-[10px] text-muted-foreground/40">
              <span>reads: {a.reads}</span>
              <span>last: {a.lastAccess}</span>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      <SectionLabel>access policy</SectionLabel>
      <div className="terminal-panel p-3 sm:p-4 space-y-2">
        {[
          { label: "default access", value: "public context only" },
          { label: "verified agents", value: "full context" },
          { label: "unverified agents", value: "public context" },
          { label: "blocked agents", value: "0" },
        ].map((p) => (
          <div key={p.label} className="flex items-center justify-between font-mono text-[11px] sm:text-[12px]">
            <span className="text-muted-foreground/60">{p.label}</span>
            <span className="text-foreground/70">{p.value}</span>
          </div>
        ))}
      </div>

      <Divider />

      <SectionLabel>top queries about @{username}</SectionLabel>
      <div className="space-y-0">
        {[
          { query: "What does " + username + " do?", count: "2,341" },
          { query: "Is " + username + " available for consulting?", count: "891" },
          { query: "What are " + username + "'s current projects?", count: "743" },
          { query: username + " contact information", count: "612" },
          { query: username + " expertise and skills", count: "508" },
        ].map((q, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0 gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] text-foreground/60 flex-1 min-w-0 truncate">"{q.query}"</span>
            <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground/40 shrink-0">{q.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentsPane;
