const TerminalHeader = ({ title = "you.md" }: { title?: string }) => (
  <div className="terminal-panel-header border-b border-border">
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
      <div className="w-2.5 h-2.5 rounded-full bg-accent/40" />
      <div className="w-2.5 h-2.5 rounded-full bg-success/40" />
    </div>
    <span className="font-mono text-[11px] text-muted-foreground/60 ml-3">{title}</span>
  </div>
);

export default TerminalHeader;
