import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TerminalInput from "@/components/shell/TerminalInput";
import TerminalHeader from "@/components/shell/TerminalHeader";
import AsciiAvatar from "@/components/AsciiAvatar";
import { useYouAgent } from "@/hooks/useYouAgent";
import { supabase } from "@/integrations/supabase/client";
import { createProfile, findSimilarProfiles, upsertProfileSource, updateProfile } from "@/lib/profiles";

interface Line {
  id: string;
  content: React.ReactNode;
  className?: string;
}

type Phase = "boot" | "username" | "creating" | "portrait" | "greet" | "gather" | "ready";

const CreateProfilePage = () => {
  const navigate = useNavigate();
  const [lines, setLines] = useState<Line[]>([]);
  const [phase, setPhase] = useState<Phase>("boot");
  const [username, setUsername] = useState("");
  const [profileId, setProfileId] = useState<string | null>(null);
  const agent = useYouAgent(username || "you");
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineCounter = useRef(0);

  const addLine = useCallback((content: React.ReactNode, className?: string) => {
    const id = `l${lineCounter.current++}`;
    setLines((prev) => [...prev, { id, content, className }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, phase]);

  // Boot
  useEffect(() => {
    const timers = [
      setTimeout(() => addLine("you.md v0.1.0 — create your identity", "text-accent"), 0),
      setTimeout(() => addLine("\u00A0"), 200),
      setTimeout(() => addLine("no account needed — just pick a username to start.", "text-muted-foreground/50"), 400),
      setTimeout(() => addLine("\u00A0"), 600),
      setTimeout(() => setPhase("username"), 800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [addLine]);

  const handleUsername = useCallback(async (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 30);
    if (!clean) return;

    addLine(<span><span className="text-accent">&gt;</span> {clean}</span>);
    setUsername(clean);

    // Check for duplicates
    const matches = await findSimilarProfiles(clean);
    if (matches.length > 0) {
      const exact = matches.find((m) => m.username === clean);
      if (exact) {
        addLine(<span className="text-muted-foreground/50">→ @{clean} already exists</span>);
        if (!exact.is_claimed) {
          addLine(<span className="text-foreground/70">that profile is unclaimed — you can claim it at <span className="text-accent">you.md/{clean}</span></span>);
          addLine("\u00A0");
          addLine(<span className="text-muted-foreground/50">try a different username, or visit the profile to claim it</span>);
        } else {
          addLine(<span className="text-foreground/70">that profile is already claimed. try a different username.</span>);
        }
        addLine("\u00A0");
        setPhase("username");
        return;
      }
    }

    setPhase("creating");
    addLine(<span className="text-muted-foreground/50">→ creating @{clean}...</span>);

    try {
      const profile = await createProfile(clean);
      setProfileId(profile.id);
      addLine(<span><span className="text-success">✓</span> @{clean} — created</span>);
      addLine("\u00A0");
      setTimeout(() => setPhase("portrait"), 400);
    } catch (e: any) {
      addLine(<span className="text-destructive">✗ {e.message}</span>);
      addLine("\u00A0");
      setPhase("username");
    }
  }, [addLine]);

  // Portrait phase
  useEffect(() => {
    if (phase !== "portrait") return;
    const timers = [
      setTimeout(() => addLine(agent.getThinkingPhrase("portrait"), "text-muted-foreground/50"), 0),
      setTimeout(() => {
        const art = [
          "    ░░▒▒▓▓██▓▓▒▒░░    ",
          "  ░▒▓██████████████▓▒░  ",
          "  ▒███    ████    ███▒  ",
          "  ▓██  ●  ████  ●  ██▓  ",
          "  ▒███    ████    ███▒  ",
          "  ░▒▓██████████████▓▒░  ",
          "    ░░▒▒▓▓████▓▓▒▒░░    ",
        ];
        art.forEach((line) => addLine(<span className="text-accent/70">{line}</span>));
        addLine("\u00A0");
        addLine(<span><span className="text-success">✓</span> <span className="text-muted-foreground/50">default portrait generated</span></span>);
        addLine("\u00A0");
      }, 600),
      setTimeout(() => setPhase("greet"), 1200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase, addLine, agent]);

  // Greet
  useEffect(() => {
    if (phase !== "greet") return;
    const greeting = agent.getGreeting();
    const timers = greeting.map((text, i) =>
      setTimeout(() => {
        if (text === "") addLine("\u00A0");
        else if (i === 0) addLine(<span className="text-accent">{text}</span>);
        else addLine(<span className="text-foreground/80">{text}</span>);
      }, i * 300)
    );
    timers.push(setTimeout(() => {
      addLine("\u00A0");
      setPhase("gather");
    }, greeting.length * 300 + 200));
    return () => timers.forEach(clearTimeout);
  }, [phase, addLine, agent]);

  // Handle link input during gather phase
  const handleGatherInput = useCallback(async (val: string) => {
    if (val === "/done") {
      addLine(<span><span className="text-accent">&gt;</span> /done</span>);
      addLine("\u00A0");
      addLine(<span className="text-muted-foreground/50">building your identity context...</span>);

      setTimeout(() => {
        addLine(<span><span className="text-success">✓</span> <span className="text-foreground">identity context initialized</span></span>);
        addLine("\u00A0");
        addLine(<span className="text-foreground/70">your profile is live at <span className="text-accent">you.md/{username}</span></span>);
        addLine(<span className="text-foreground/70">sign in anytime to claim ownership and unlock private features</span>);
        addLine("\u00A0");
        setPhase("ready");
        setTimeout(() => navigate(`/profile/${username}`), 2500);
      }, 1000);
      return;
    }

    addLine(<span><span className="text-accent">&gt;</span> {val}</span>);
    const thinkPhrase = agent.getThinkingPhrase("discovery");
    addLine(<span className="text-muted-foreground/50">→ {thinkPhrase}</span>);

    // Detect profile URLs
    const isX = /(?:x\.com|twitter\.com)\/[a-zA-Z0-9_]+/i.test(val);
    const isGH = /github\.com\/[a-zA-Z0-9_-]+/i.test(val);
    const isLI = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i.test(val);

    if (isX || isGH || isLI) {
      const platformLabel = isX ? "x.com" : isGH ? "github" : "linkedin";
      addLine(<span className="text-muted-foreground/50">→ fetching profile from {platformLabel}...</span>);

      const { data, error } = await supabase.functions.invoke("fetch-x-profile", {
        body: { url: val },
      });

      if (error || !data?.success || !data?.data?.profileImageUrl) {
        addLine(<span className="text-muted-foreground/50">→ couldn't grab details — added as text source</span>);
      } else {
        const d = data.data;
        if (d.displayName) addLine(<span className="text-foreground/80">found — {d.displayName} (@{d.username})</span>);
        if (d.bio) addLine(<span className="text-muted-foreground/50">bio: "{d.bio}"</span>);
        if (d.location) addLine(<span className="text-muted-foreground/50">location: {d.location}</span>);
        if (d.followers != null) addLine(<span className="text-muted-foreground/50">{d.followers.toLocaleString()} followers</span>);

        // Generate ASCII portrait from real photo
        addLine(<span className="text-muted-foreground/50">→ generating ascii portrait...</span>);
        addLine(
          <div className="my-2">
            <AsciiAvatar src={d.profileImageUrl} cols={80} canvasWidth={400} className="max-w-full" />
          </div>
        );
        addLine(<span className="text-foreground/80">your ascii portrait has been regenerated — this is your identity in code.</span>);

        // Persist to DB
        if (profileId) {
          try {
            await upsertProfileSource(profileId, {
              platform: isX ? "x" : isGH ? "github" : "linkedin",
              platform_username: d.username,
              display_name: d.displayName,
              bio: d.bio,
              profile_image_url: d.profileImageUrl,
              location: d.location,
              website: d.website,
              headline: d.headline,
              company: d.company,
              followers: d.followers,
              following: d.following,
              posts: d.posts,
              links: d.links || [],
              extras: d.extras || {},
              status: "synced",
            });

            // Update profile with first source data
            await updateProfile(profileId, {
              name: d.displayName || undefined,
              bio_short: d.bio || undefined,
              location: d.location || undefined,
              website: d.website || undefined,
              avatar_url: d.profileImageUrl || undefined,
            } as any);
          } catch (e) {
            console.error("Failed to persist source:", e);
          }
        }
      }

      addLine("\u00A0");
      addLine(<span><span className="text-success">✓</span> <span className="text-muted-foreground/50">source added — context extracted</span></span>);
      addLine("\u00A0");
      addLine(<span className="text-foreground/70">{agent.getSourceFollowUp()}</span>);
      addLine("\u00A0");
    } else {
      // Non-URL text input — treat as context
      setTimeout(() => {
        addLine(<span className="text-foreground/80">noted — adding that to your context layer.</span>);
        addLine("\u00A0");
        addLine(<span className="text-foreground/70">{agent.getSourceFollowUp()}</span>);
        addLine("\u00A0");
      }, 600);
    }
  }, [addLine, agent, profileId, username, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl terminal-panel shadow-2xl">
        <TerminalHeader title="you.md — create profile" />
        <div ref={scrollRef} className="p-4 sm:p-6 min-h-[350px] sm:min-h-[500px] max-h-[80vh] overflow-y-auto">
          {lines.map((line) => (
            <div key={line.id} className={`font-mono text-[12px] sm:text-[13px] leading-relaxed ${line.className || ""}`}>
              {line.content || "\u00A0"}
            </div>
          ))}

          {phase === "username" && (
            <div className="mt-1">
              <span className="font-mono text-[12px] sm:text-[13px] text-muted-foreground/70 block mb-1">
                choose a username
              </span>
              <TerminalInput prompt="@" placeholder="yourname" onSubmit={handleUsername} />
            </div>
          )}

          {phase === "gather" && (
            <TerminalInput prompt=">" placeholder="https://linkedin.com/in/you" onSubmit={handleGatherInput} />
          )}

          {phase === "ready" && (
            <div className="font-mono text-[12px] sm:text-[13px] text-muted-foreground/50 flex items-center gap-2">
              <span className="animate-pulse">◌</span> loading your profile...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePage;
