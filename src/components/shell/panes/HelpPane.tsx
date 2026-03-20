const HelpPane = () => (
  <div className="p-8 max-w-xl mx-auto">
    <div className="flex items-center gap-2 mb-6">
      <span className="font-mono text-[11px] text-muted-foreground/40">*/help</span>
    </div>

    <h2 className="font-mono text-base text-foreground mb-6">you.md shell reference</h2>

    <div className="terminal-panel p-5">
      <pre className="font-mono text-[12px] leading-loose text-foreground/70">
{`NAVIGATION
  /profile          view your identity profile
  /settings         account preferences
  /billing          plan & usage
  /tokens           api keys management
  /activity         agent reads & sync log
  /sources          connected data sources
  /portrait         ascii portrait settings
  /publish          deploy status & history
  /agents           agent network & access

VIEW MODES
  /public           preview as public visitors see
  /private          preview with private context

IDENTITY
  /sync             re-sync all connected sources
  /portrait         regenerate ascii portrait
  /publish          publish latest changes

CONTEXT MANAGEMENT
  set context <key> <value>
  add source <url>
  remove source <name>

AGENT COMMANDS
  set access <public|verified|private>
  set update-mode <auto|review|manual>

GENERAL
  /help             show this reference
  clear             clear terminal
  exit              leave shell`}
      </pre>
    </div>

    <div className="mt-6 font-mono text-[11px] text-muted-foreground/40">
      you can also type naturally — the agent understands free-form input.
    </div>
  </div>
);

export default HelpPane;
