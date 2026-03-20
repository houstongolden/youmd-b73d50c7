import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ClaimBannerProps {
  profileId: string;
  username: string;
}

export default function ClaimBanner({ profileId, username }: ClaimBannerProps) {
  const navigate = useNavigate();
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");

  const handleClaim = async () => {
    setClaiming(true);
    setError("");

    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      // Redirect to auth with return info
      navigate("/auth", { state: { returnTo: `/profile/${username}`, claimProfileId: profileId } });
      return;
    }

    try {
      const { data, error: fnErr } = await supabase.functions.invoke("claim-profile", {
        body: { profile_id: profileId },
      });
      if (fnErr) throw fnErr;
      if (data?.error) throw new Error(data.error);
      // Reload to show claimed state
      window.location.reload();
    } catch (e: any) {
      setError(e.message || "Failed to claim profile");
      setClaiming(false);
    }
  };

  return (
    <div className="terminal-panel p-3 sm:p-4 mb-4 border-accent/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[12px] text-foreground/80">
            this profile is unclaimed
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/50 mt-0.5">
            sign in to claim ownership and unlock private context
          </p>
        </div>
        <button
          onClick={handleClaim}
          disabled={claiming}
          className="shrink-0 font-mono text-[11px] px-3 py-1.5 rounded bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 transition-colors"
        >
          {claiming ? "claiming..." : "claim profile"}
        </button>
      </div>
      {error && (
        <p className="font-mono text-[10px] text-destructive mt-2">{error}</p>
      )}
    </div>
  );
}
