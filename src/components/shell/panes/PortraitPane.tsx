const SectionLabel = ({ children }: { children: string }) => (
  <h3 className="font-mono text-[11px] text-accent uppercase tracking-wider mb-3">&gt; {children}</h3>
);

const Divider = () => <div className="h-px bg-border my-6" />;

const PortraitPane = ({ username }: { username: string }) => (
  <div className="p-8 max-w-xl mx-auto">
    <div className="flex items-center gap-2 mb-6">
      <span className="font-mono text-[11px] text-muted-foreground/40">*/portrait</span>
    </div>

    <h2 className="font-mono text-base text-foreground mb-6">ascii portrait</h2>

    {/* Current portrait */}
    <SectionLabel>current portrait — @{username}</SectionLabel>
    <div className="terminal-panel p-6 mb-2">
      <pre className="font-mono text-[6px] leading-[1.05] text-accent/80 whitespace-pre select-all">
{`                    ░░░░░░▒▒▒▒▒▒▓▓▓▓▓▓▓▓▒▒▒▒▒▒░░░░░░                    
                ░░▒▒▒▓▓▓▓████████████████████▓▓▓▓▒▒▒░░                
            ░░▒▓▓████████████████████████████████████▓▓▒░░            
          ░▒▓████████████████████████████████████████████▓▒░          
        ░▒▓██████████████████████████████████████████████████▒░        
      ░▒████████████████████████████████████████████████████████▒░      
      ▒██████████████████████████████████████████████████████████▒      
    ░▓████████████      ████████████████████      ████████████████▓░    
    ▒█████████████  ●●  ████████████████████  ●●  █████████████████▒    
    ▓█████████████      ████████████████████      █████████████████▓    
    ▓██████████████████████████████████████████████████████████████▓    
    ▒██████████████████████████████████████████████████████████████▒    
    ░▓████████████████████████████████████████████████████████████▓░    
      ▒████████████████████    ████████    ████████████████████████▒      
      ░▒██████████████████████████████████████████████████████████▒░      
        ░▒████████████████████████████████████████████████████▒░        
          ░▒▓████████████████████████████████████████████▓▒░          
            ░░▒▓▓████████████████████████████████████▓▓▒░░            
                ░░▒▒▒▓▓▓▓████████████████████▓▓▓▓▒▒▒░░                
                    ░░░░░░▒▒▒▒▒▒▓▓▓▓▓▓▒▒▒▒▒▒░░░░░░                    `}
      </pre>
    </div>

    <Divider />

    {/* Portrait settings */}
    <SectionLabel>settings</SectionLabel>
    <div className="terminal-panel p-4 space-y-2">
      {[
        { label: "style", value: "block · 120 col" },
        { label: "detail level", value: "high" },
        { label: "characters", value: "░▒▓█ ●" },
        { label: "source image", value: "linkedin avatar" },
        { label: "last generated", value: "2025-03-19 14:22" },
      ].map((s) => (
        <div key={s.label} className="flex items-center justify-between font-mono text-[12px]">
          <span className="text-muted-foreground/60">{s.label}</span>
          <span className="text-foreground/70">{s.value}</span>
        </div>
      ))}
    </div>

    <Divider />

    {/* Regenerate */}
    <SectionLabel>regenerate</SectionLabel>
    <div className="terminal-panel p-4">
      <p className="font-mono text-[11px] text-muted-foreground/50">
        regenerate your portrait via terminal:
      </p>
      <div className="mt-2 space-y-1">
        <div className="font-mono text-[12px] text-accent bg-background rounded px-3 py-2">
          &gt; /portrait --regenerate
        </div>
        <div className="font-mono text-[12px] text-muted-foreground/40 bg-background rounded px-3 py-2">
          &gt; /portrait --style braille --cols 160
        </div>
      </div>
    </div>

    <Divider />

    <SectionLabel>available styles</SectionLabel>
    <div className="space-y-2">
      {[
        { name: "block", sample: "░▒▓█", desc: "default — high density block characters" },
        { name: "braille", sample: "⠁⠃⠇⡇⣇⣧⣷⣿", desc: "unicode braille — ultra fine detail" },
        { name: "ascii", sample: ".:-=+*#%@", desc: "classic ascii ramp — retro terminal" },
        { name: "minimal", sample: "·∘○●", desc: "dot matrix — clean and sparse" },
      ].map((style) => (
        <div key={style.name} className="terminal-panel p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[12px] text-foreground/80">{style.name}</span>
            <span className="font-mono text-[11px] text-accent/60 tracking-widest">{style.sample}</span>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground/40">{style.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default PortraitPane;
