const SectionLabel = ({ children }: { children: string }) => (
  <h3 className="font-mono text-[10px] sm:text-[11px] text-accent uppercase tracking-wider mb-2 sm:mb-3">&gt; {children}</h3>
);

const Divider = () => <div className="h-px bg-border my-4 sm:my-6" />;

const SettingRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between font-mono text-[11px] sm:text-[12px] py-2 border-b border-border/50 last:border-0">
    <span className="text-muted-foreground/60">{label}</span>
    <span className="text-foreground/80">{value}</span>
  </div>
);

const SettingsPane = ({ username }: { username: string }) => (
  <div className="p-4 sm:p-8 max-w-xl mx-auto">
    <div className="flex items-center gap-2 mb-4 sm:mb-6">
      <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/40">*/settings</span>
    </div>

    <h2 className="font-mono text-sm sm:text-base text-foreground mb-4 sm:mb-6">settings</h2>

    <SectionLabel>account</SectionLabel>
    <div className="terminal-panel p-3 sm:p-4 mb-2">
      <SettingRow label="username" value={`@${username}`} />
      <SettingRow label="email" value={`${username}@email.com`} />
      <SettingRow label="plan" value="pro" />
      <SettingRow label="member since" value="2025-03-15" />
    </div>

    <Divider />

    <SectionLabel>identity preferences</SectionLabel>
    <div className="terminal-panel p-3 sm:p-4 mb-2">
      <SettingRow label="default context" value="public" />
      <SettingRow label="agent access" value="verified agents only" />
      <SettingRow label="update mode" value="auto-publish" />
      <SettingRow label="portrait style" value="ascii 120-col" />
    </div>

    <Divider />

    <SectionLabel>connected sources</SectionLabel>
    <div className="terminal-panel p-3 sm:p-4">
      {[
        { name: "LinkedIn", connected: true },
        { name: "GitHub", connected: true },
        { name: "X / Twitter", connected: true },
        { name: "Notion", connected: false },
        { name: "Google Calendar", connected: false },
      ].map((s) => (
        <div key={s.name} className="flex items-center justify-between font-mono text-[11px] sm:text-[12px] py-2 border-b border-border/50 last:border-0">
          <span className="text-foreground/70">{s.name}</span>
          <span className={s.connected ? "text-success" : "text-muted-foreground/40"}>
            {s.connected ? "connected" : "not connected"}
          </span>
        </div>
      ))}
    </div>

    <div className="mt-4 sm:mt-6 font-mono text-[10px] sm:text-[11px] text-muted-foreground/40">
      tip: update settings via terminal — <span className="text-accent">set context private</span>
    </div>
  </div>
);

export default SettingsPane;
