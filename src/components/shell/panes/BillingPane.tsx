const SectionLabel = ({ children }: { children: string }) => (
  <h3 className="font-mono text-[10px] sm:text-[11px] text-accent uppercase tracking-wider mb-2 sm:mb-3">&gt; {children}</h3>
);

const Divider = () => <div className="h-px bg-border my-4 sm:my-6" />;

const BillingPane = () => (
  <div className="p-4 sm:p-8 max-w-xl mx-auto">
    <div className="flex items-center gap-2 mb-4 sm:mb-6">
      <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/40">*/billing</span>
    </div>

    <h2 className="font-mono text-sm sm:text-base text-foreground mb-4 sm:mb-6">billing & usage</h2>

    <SectionLabel>current plan</SectionLabel>
    <div className="terminal-panel p-3 sm:p-5 mb-2">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[13px] sm:text-sm text-foreground">Pro</span>
        <span className="font-mono text-[13px] sm:text-sm text-accent">$29/mo</span>
      </div>
      <div className="space-y-1.5 font-mono text-[10px] sm:text-[11px] text-muted-foreground/60">
        <p>• unlimited agent reads</p>
        <p>• 10 connected sources</p>
        <p>• private identity layers</p>
        <p>• custom domain (you.md/username)</p>
        <p>• api access</p>
      </div>
    </div>

    <Divider />

    <SectionLabel>current period usage</SectionLabel>
    <div className="terminal-panel p-3 sm:p-4">
      <div className="space-y-3">
        {[
          { label: "agent reads", used: "14,203", limit: "unlimited" },
          { label: "sources connected", used: "4", limit: "10" },
          { label: "api calls", used: "2,847", limit: "50,000" },
          { label: "storage", used: "12 MB", limit: "1 GB" },
        ].map((u) => (
          <div key={u.label}>
            <div className="flex items-center justify-between font-mono text-[11px] sm:text-[12px] mb-1">
              <span className="text-muted-foreground/60">{u.label}</span>
              <span className="text-foreground/70">{u.used} <span className="text-muted-foreground/40">/ {u.limit}</span></span>
            </div>
            {u.limit !== "unlimited" && (
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-accent/60 rounded-full" style={{ width: "40%" }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    <Divider />

    <SectionLabel>billing history</SectionLabel>
    <div className="terminal-panel p-3 sm:p-4">
      {[
        { date: "2025-03-01", amount: "$29.00", status: "paid" },
        { date: "2025-02-01", amount: "$29.00", status: "paid" },
        { date: "2025-01-15", amount: "$0.00", status: "trial" },
      ].map((b, i) => (
        <div key={i} className="flex items-center justify-between font-mono text-[11px] sm:text-[12px] py-2 border-b border-border/50 last:border-0">
          <span className="text-muted-foreground/60">{b.date}</span>
          <span className="text-foreground/70">{b.amount}</span>
          <span className={b.status === "paid" ? "text-success" : "text-muted-foreground/40"}>{b.status}</span>
        </div>
      ))}
    </div>
  </div>
);

export default BillingPane;
