import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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

interface SettingsPaneProps {
  username: string;
  profileId?: string;
}

const SettingsPane = ({ username, profileId }: SettingsPaneProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    if (!profileId) return;
    setDeleting(true);
    try {
      await supabase.from("profiles").delete().eq("id", profileId);
      await signOut();
      navigate("/", { replace: true });
    } catch (e) {
      console.error("Delete failed:", e);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/40">*/settings</span>
      </div>

      <h2 className="font-mono text-sm sm:text-base text-foreground mb-4 sm:mb-6">settings</h2>

      <SectionLabel>account</SectionLabel>
      <div className="terminal-panel p-3 sm:p-4 mb-2">
        <SettingRow label="username" value={`@${username}`} />
        <SettingRow label="email" value={user?.email || "—"} />
        <SettingRow label="plan" value="free" />
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

      <SectionLabel>actions</SectionLabel>
      <div className="space-y-3">
        <button
          onClick={() => signOut().then(() => navigate("/", { replace: true }))}
          className="font-mono text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          &gt; sign out
        </button>

        <div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="font-mono text-[11px] text-destructive/70 hover:text-destructive transition-colors disabled:opacity-50"
          >
            {deleting ? "deleting..." : confirmDelete ? "⚠ confirm permanent deletion" : "> delete profile"}
          </button>
          {confirmDelete && !deleting && (
            <p className="font-mono text-[9px] text-destructive/50 mt-1">
              this will permanently delete your profile, sources, tokens, and private data. click again to confirm.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 sm:mt-6 font-mono text-[10px] sm:text-[11px] text-muted-foreground/40">
        tip: update settings via terminal — <span className="text-accent">set context private</span>
      </div>
    </div>
  );
};

export default SettingsPane;
