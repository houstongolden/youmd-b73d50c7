const SectionLabel = ({ children }: { children: string }) => (
  <h3 className="font-mono text-[11px] text-accent uppercase tracking-wider mb-3">&gt; {children}</h3>
);

const Divider = () => <div className="h-px bg-border my-6" />;

const PublishPane = ({ username }: { username: string }) => (
  <div className="p-8 max-w-xl mx-auto">
    <div className="flex items-center gap-2 mb-6">
      <span className="font-mono text-[11px] text-muted-foreground/40">*/publish</span>
    </div>

    <h2 className="font-mono text-base text-foreground mb-6">publish & deploy</h2>

    {/* Live status */}
    <SectionLabel>live status</SectionLabel>
    <div className="terminal-panel p-5 mb-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-success status-dot-pulse" />
        <span className="font-mono text-[12px] text-success">LIVE</span>
      </div>
      <div className="space-y-2">
        {[
          { label: "public url", value: `you.md/${username}`, accent: true },
          { label: "last published", value: "2025-03-19 14:22:08 UTC" },
          { label: "publish mode", value: "auto-publish on sync" },
          { label: "version", value: "v47" },
        ].map((r) => (
          <div key={r.label} className="flex items-center justify-between font-mono text-[12px]">
            <span className="text-muted-foreground/60">{r.label}</span>
            <span className={r.accent ? "text-accent" : "text-foreground/70"}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>

    <Divider />

    {/* Domain settings */}
    <SectionLabel>domain</SectionLabel>
    <div className="terminal-panel p-4 space-y-2">
      {[
        { label: "primary", value: `you.md/${username}`, active: true },
        { label: "custom", value: "not configured", active: false },
        { label: "api endpoint", value: `api.you.md/v1/${username}`, active: true },
      ].map((d) => (
        <div key={d.label} className="flex items-center justify-between font-mono text-[12px]">
          <span className="text-muted-foreground/60">{d.label}</span>
          <span className={d.active ? "text-foreground/70" : "text-muted-foreground/40"}>{d.value}</span>
        </div>
      ))}
    </div>

    <Divider />

    {/* Publish history */}
    <SectionLabel>recent deploys</SectionLabel>
    <div className="space-y-0">
      {[
        { version: "v47", time: "19 Mar 14:22", trigger: "auto — linkedin sync", status: "live" },
        { version: "v46", time: "19 Mar 09:15", trigger: "manual — bio update", status: "archived" },
        { version: "v45", time: "18 Mar 22:41", trigger: "auto — github sync", status: "archived" },
        { version: "v44", time: "18 Mar 16:03", trigger: "auto — x/twitter sync", status: "archived" },
        { version: "v43", time: "17 Mar 11:28", trigger: "manual — portrait regen", status: "archived" },
      ].map((d) => (
        <div key={d.version} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-accent/60 w-8">{d.version}</span>
            <span className="font-mono text-[11px] text-foreground/70">{d.trigger}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-muted-foreground/40">{d.time}</span>
            <span className={`font-mono text-[10px] ${d.status === "live" ? "text-success" : "text-muted-foreground/30"}`}>
              {d.status}
            </span>
          </div>
        </div>
      ))}
    </div>

    <Divider />

    <SectionLabel>commands</SectionLabel>
    <div className="terminal-panel p-4">
      <div className="space-y-1">
        <div className="font-mono text-[12px] text-accent bg-background rounded px-3 py-2">
          &gt; /publish
        </div>
        <div className="font-mono text-[12px] text-muted-foreground/40 bg-background rounded px-3 py-2">
          &gt; /publish --rollback v46
        </div>
        <div className="font-mono text-[12px] text-muted-foreground/40 bg-background rounded px-3 py-2">
          &gt; set domain custom.example.com
        </div>
      </div>
    </div>
  </div>
);

export default PublishPane;
