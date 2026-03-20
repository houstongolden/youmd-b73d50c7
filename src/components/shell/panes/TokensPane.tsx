import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAccessTokens } from "@/lib/profiles";
import { useAuth } from "@/hooks/useAuth";

const SectionLabel = ({ children }: { children: string }) => (
  <h3 className="font-mono text-[10px] sm:text-[11px] text-accent uppercase tracking-wider mb-2 sm:mb-3">&gt; {children}</h3>
);

const Divider = () => <div className="h-px bg-border my-4 sm:my-6" />;

interface TokensPaneProps {
  username: string;
  profileId?: string;
}

const TokensPane = ({ username, profileId }: TokensPaneProps) => {
  const { user } = useAuth();
  const [tokens, setTokens] = useState<any[]>([]);
  const [newTokenName, setNewTokenName] = useState("");
  const [newTokenScopes, setNewTokenScopes] = useState<string[]>(["read"]);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profileId) {
      getAccessTokens(profileId).then(setTokens).catch(console.error);
    }
  }, [profileId]);

  const handleCreate = async () => {
    if (!profileId || !newTokenName.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("manage-tokens", {
        body: {
          action: "create",
          profile_id: profileId,
          name: newTokenName,
          scopes: newTokenScopes,
        },
      });
      if (error) throw error;
      if (data?.token) {
        setCreatedToken(data.token);
        setNewTokenName("");
        // Refresh
        const updated = await getAccessTokens(profileId);
        setTokens(updated);
      }
    } catch (e) {
      console.error("Create token error:", e);
    }
    setLoading(false);
  };

  const handleRevoke = async (tokenId: string) => {
    if (!profileId) return;
    try {
      await supabase.functions.invoke("manage-tokens", {
        body: { action: "revoke", profile_id: profileId, token_id: tokenId },
      });
      const updated = await getAccessTokens(profileId);
      setTokens(updated);
    } catch (e) {
      console.error("Revoke error:", e);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/40">*/tokens</span>
      </div>

      <h2 className="font-mono text-sm sm:text-base text-foreground mb-4 sm:mb-6">api keys & tokens</h2>

      {!user && (
        <div className="terminal-panel p-3 sm:p-4 mb-4">
          <p className="font-mono text-[11px] text-muted-foreground/50">
            sign in and claim this profile to create access tokens.
          </p>
        </div>
      )}

      {/* Created token alert */}
      {createdToken && (
        <div className="terminal-panel p-3 sm:p-4 mb-4 border-success/30">
          <p className="font-mono text-[11px] text-success mb-2">✓ token created — copy it now, you won't see it again</p>
          <div className="font-mono text-[10px] sm:text-[11px] text-foreground bg-background rounded px-2 py-1.5 overflow-x-auto select-all">
            {createdToken}
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(createdToken); }}
            className="font-mono text-[9px] text-accent mt-2 hover:text-accent-light transition-colors"
          >
            copy to clipboard
          </button>
        </div>
      )}

      <SectionLabel>active tokens</SectionLabel>
      {tokens.length > 0 ? (
        <div className="space-y-3">
          {tokens.map((t) => (
            <div key={t.id} className="terminal-panel p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] sm:text-[12px] text-foreground/80">{t.name}</span>
                {!t.is_revoked ? (
                  <button
                    onClick={() => handleRevoke(t.id)}
                    className="font-mono text-[9px] sm:text-[10px] text-destructive hover:text-destructive/80 transition-colors"
                  >
                    revoke
                  </button>
                ) : (
                  <span className="font-mono text-[9px] text-muted-foreground/40">revoked</span>
                )}
              </div>
              <div className="flex items-center gap-3 sm:gap-4 font-mono text-[9px] sm:text-[10px] text-muted-foreground/40">
                <span>scopes: {t.scopes?.join(", ")}</span>
                <span>created: {new Date(t.created_at).toLocaleDateString()}</span>
                {t.last_used_at && <span>last used: {new Date(t.last_used_at).toLocaleDateString()}</span>}
                {t.expires_at && <span>expires: {new Date(t.expires_at).toLocaleDateString()}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-mono text-[11px] text-muted-foreground/40">no tokens yet</p>
      )}

      {user && profileId && (
        <>
          <Divider />
          <SectionLabel>create new token</SectionLabel>
          <div className="terminal-panel p-3 sm:p-4 space-y-3">
            <input
              type="text"
              value={newTokenName}
              onChange={(e) => setNewTokenName(e.target.value)}
              placeholder="Token name (e.g. My Agent)"
              className="w-full bg-background border border-border rounded px-2 py-1.5 font-mono text-[11px] text-foreground placeholder:text-muted-foreground/40"
            />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground/60">
                <input type="checkbox" checked={newTokenScopes.includes("read")}
                  onChange={(e) => {
                    if (e.target.checked) setNewTokenScopes((s) => [...s, "read"]);
                    else setNewTokenScopes((s) => s.filter((x) => x !== "read"));
                  }}
                  className="accent-accent"
                /> read
              </label>
              <label className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground/60">
                <input type="checkbox" checked={newTokenScopes.includes("write")}
                  onChange={(e) => {
                    if (e.target.checked) setNewTokenScopes((s) => [...s, "write"]);
                    else setNewTokenScopes((s) => s.filter((x) => x !== "write"));
                  }}
                  className="accent-accent"
                /> write
              </label>
            </div>
            <button
              onClick={handleCreate}
              disabled={!newTokenName.trim() || loading}
              className="font-mono text-[11px] px-3 py-1.5 rounded bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40 transition-colors"
            >
              {loading ? "creating..." : "create token"}
            </button>
          </div>
        </>
      )}

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