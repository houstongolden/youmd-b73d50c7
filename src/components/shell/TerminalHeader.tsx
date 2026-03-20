const TerminalHeader = ({ title = "you.md" }: { title?: string }) => (
  <div className="terminal-panel-header border-b border-border">
    <span className="font-mono text-[11px] text-muted-foreground/60">{title}</span>
  </div>
);

export default TerminalHeader;
