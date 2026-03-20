import { useState, useEffect } from "react";
import { getSecurityLogs } from "@/lib/profiles";

const EVENT_ICONS: Record<string, string> = {
  profile_claimed: "⊕",
  token_created: "🔑",
  token_used: "◇",
  token_revoked: "✗",
  profile_updated: "△",
  source_added: "↻",
};

const EVENT_COLORS: Record<string, string> = {
  profile_claimed: "text-success",
  token_created: "text-accent",
  token_used: "text-foreground/60",
  token_revoked: "text-destructive",
  profile_updated: "text-accent",
  source_added: "text-accent",
};

interface ActivityPaneProps {
  username: string;
  profileId?: string;
}

const ActivityPane = ({ username, profileId }: ActivityPaneProps) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileId) {
      getSecurityLogs(profileId)
        .then(setLogs)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [profileId]);

  return (
    <div className="p-4 sm:p-8 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/40">*/activity</span>
      </div>

      <h2 className="font-mono text-sm sm:text-base text-foreground mb-4 sm:mb-6">security & activity log</h2>

      {loading ? (
        <p className="font-mono text-[11px] text-muted-foreground/40 animate-pulse">loading...</p>
      ) : logs.length > 0 ? (
        <div className="space-y-0">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0">
              <span className={`font-mono text-[12px] w-4 text-center shrink-0 ${EVENT_COLORS[log.event_type] || "text-muted-foreground/50"}`}>
                {EVENT_ICONS[log.event_type] || "·"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[11px] text-foreground/80 truncate">
                  {log.event_type.replace(/_/g, " ")}
                  {log.details?.username && ` — @${log.details.username}`}
                  {log.details?.token_name && ` — "${log.details.token_name}"`}
                </p>
              </div>
              <span className="font-mono text-[9px] text-muted-foreground/40 shrink-0">
                {new Date(log.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="terminal-panel p-4">
          <p className="font-mono text-[11px] text-muted-foreground/40">
            no activity recorded yet — events will appear here as you use your profile.
          </p>
          <div className="mt-3 space-y-1 font-mono text-[10px] text-muted-foreground/30">
            <p>tracked events:</p>
            <p>· profile claimed</p>
            <p>· token created / used / revoked</p>
            <p>· profile updated</p>
            <p>· source added</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityPane;
