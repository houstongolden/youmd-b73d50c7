import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useYouAgent, type ScrapedContext } from "@/hooks/useYouAgent";
import AsciiAvatar from "@/components/AsciiAvatar";
import { supabase } from "@/integrations/supabase/client";
import TerminalHeader from "@/components/shell/TerminalHeader";
import TerminalInput from "@/components/shell/TerminalInput";
import ShellPreviewPane from "@/components/shell/ShellPreviewPane";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { getProfileByUsername, getProfileById, getProfileSources, updateProfile, upsertProfileSource } from "@/lib/profiles";
import { computeFreshnessScore } from "@/lib/freshness";
import type { ProfileData, ScrapedSource } from "@/components/shell/panes/ProfilePreview";

interface Line {
  id: string;
  content: React.ReactNode;
  className?: string;
}

const SLASH_COMMANDS: Record<string, string> = {
  "/profile": "profile",
  "/settings": "settings",
  "/billing": "billing",
  "/tokens": "tokens",
  "/activity": "activity",
  "/sources": "sources",
  "/portrait": "portrait",
  "/publish": "publish",
  "/agents": "agents",
  "/help": "help",
};

const ShellPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const passedUsername = (location.state as any)?.username;
  const [username, setUsername] = useState(passedUsername || "");
  const [profileId, setProfileId] = useState<string | undefined>(undefined);
  const [dbLoaded, setDbLoaded] = useState(false);
  const agent = useYouAgent(username || "you");
  const isMobile = useIsMobile();
  const [lines, setLines] = useState<Line[]>([]);
  const [activePane, setActivePane] = useState<string>("profile");
  const [previewMode, setPreviewMode] = useState<"public" | "private">("public");
  const [mobileView, setMobileView] = useState<"terminal" | "preview">("terminal");
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: null,
    bio: null,
    profileImageUrl: null,
    location: null,
    website: null,
    headline: null,
    company: null,
    followers: null,
    allLinks: [],
    sources: [],
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineCounter = useRef(0);

  const addLine = useCallback((content: React.ReactNode, className?: string) => {
    const id = `l${lineCounter.current++}`;
    setLines((prev) => [...prev, { id, content, className }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  // Load user's owned profile from DB when authenticated
  useEffect(() => {
    if (authLoading) return;
    if (dbLoaded) return;

    const loadProfile = async () => {
      let profile = null;

      // If user is logged in, find their owned profile first
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("owner_id", user.id)
          .limit(1)
          .maybeSingle();
        if (data) profile = data;
      }

      // Fallback: load by passed username
      if (!profile && passedUsername) {
        profile = await getProfileByUsername(passedUsername);
      }

      if (profile) {
        setUsername(profile.username);
        setProfileId(profile.id);

        // Load sources
        const sources = await getProfileSources(profile.id);
        const scrapedSources: ScrapedSource[] = sources.map((s) => ({
          platform: s.platform,
          username: s.platform_username || "",
          displayName: s.display_name,
          bio: s.bio,
          profileImageUrl: s.profile_image_url,
          location: s.location,
          website: s.website,
          followers: s.followers,
          following: s.following,
          posts: s.posts,
          headline: s.headline,
          company: s.company,
          links: s.links || [],
          extras: (s.extras as Record<string, any>) || {},
          status: s.status as any,
        }));

        setProfileData({
          displayName: profile.name,
          bio: profile.bio_medium || profile.bio_short,
          profileImageUrl: profile.avatar_url,
          location: profile.location,
          website: profile.website,
          headline: null,
          company: null,
          followers: null,
          allLinks: Array.isArray(profile.links) ? (profile.links as any[]).map((l: any) => l.url).filter(Boolean) : [],
          sources: scrapedSources,
        });
      } else if (!passedUsername) {
        // No profile found and no username — redirect to create
        navigate("/create", { replace: true });
        return;
      }

      setDbLoaded(true);
    };

    loadProfile().catch(console.error);
  }, [user, authLoading, passedUsername, dbLoaded, navigate]);

  // Initial shell boot
  useEffect(() => {
    if (!dbLoaded || !username) return;
    const question = agent.getNextQuestion();
    const timers = [
      setTimeout(() => addLine(<span className="text-accent">you.md shell v0.1.0</span>), 200),
      setTimeout(() => addLine(<span className="text-muted-foreground/50">logged in as <span className="text-foreground">@{username}</span></span>), 500),
      setTimeout(() => addLine("\u00A0"), 700),
      setTimeout(() => addLine(<span className="text-foreground/80">welcome back. let's keep building your context.</span>), 1000),
      setTimeout(() => addLine("\u00A0"), 1300),
      setTimeout(() => addLine(<span className="text-foreground/80">{question}</span>), 1600),
      setTimeout(() => addLine("\u00A0"), 1900),
      setTimeout(() => addLine(<span className="text-muted-foreground/40">you can also paste links, use <span className="text-accent">/help</span> for commands, or just talk to me.</span>), 2100),
      setTimeout(() => addLine("\u00A0"), 2300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [dbLoaded, username]);

  const showHelp = useCallback(() => {
    addLine("\u00A0");
    addLine(<span className="text-accent">available commands:</span>);
    addLine("\u00A0");
    const cmds = [
      ["/profile", "view and edit your identity profile"],
      ["/settings", "account and preference settings"],
      ["/billing", "plan and usage details"],
      ["/tokens", "api keys and access tokens"],
      ["/activity", "agent reads and sync history"],
      ["/sources", "manage connected data sources"],
      ["/portrait", "view and regenerate ascii portrait"],
      ["/publish", "deploy status and version history"],
      ["/agents", "agent network and access policies"],
      ["/public", "switch preview to public mode"],
      ["/private", "switch preview to private mode"],
      ["/sync", "trigger source re-sync"],
      ["/help", "show this help"],
    ];
    cmds.forEach(([cmd, desc]) => {
      addLine(
        <span>
          <span className="text-accent w-20 inline-block">{cmd.padEnd(14)}</span>
          <span className="text-muted-foreground/60">{desc}</span>
        </span>
      );
    });
    addLine("\u00A0");
  }, [addLine]);

  const handleCommand = useCallback((val: string) => {
    addLine(<span><span className="text-accent">&gt;</span> <span className="text-foreground">{val}</span></span>);

    const cmd = val.toLowerCase().trim();

    if (cmd === "/help") {
      showHelp();
      return;
    }

    if (cmd === "/public") {
      setPreviewMode("public");
      addLine(<span className="text-success">✓ preview switched to public mode</span>);
      addLine("\u00A0");
      return;
    }

    if (cmd === "/private") {
      setPreviewMode("private");
      setActivePane("private");
      addLine(<span className="text-success">✓ preview switched to private mode</span>);
      if (isMobile) setTimeout(() => setMobileView("preview"), 300);
      addLine("\u00A0");
      return;
    }

    if (cmd === "/sync") {
      const syncPhrase = agent.getThinkingPhrase("sync");
      addLine(<span className="text-muted-foreground/50">{syncPhrase}</span>);
      addLine(<span className="text-muted-foreground/50">→ re-fetching all connected sources...</span>);

      (async () => {
        if (!profileId) {
          addLine(<span className="text-destructive">✗ no profile loaded</span>);
          addLine("\u00A0");
          return;
        }
        try {
          const sources = await getProfileSources(profileId);
          let synced = 0;
          for (const source of sources) {
            if (!source.platform_username && !source.website) continue;
            // Build URL from source platform
            let url = "";
            if (source.platform === "x" || source.platform === "twitter") url = `https://x.com/${source.platform_username}`;
            else if (source.platform === "github") url = `https://github.com/${source.platform_username}`;
            else if (source.platform === "linkedin") url = `https://linkedin.com/in/${source.platform_username}`;
            else continue;

            addLine(<span className="text-muted-foreground/50">→ syncing {source.platform} @{source.platform_username}...</span>);
            const { data, error } = await supabase.functions.invoke('fetch-x-profile', { body: { url } });
            if (!error && data?.success && data?.data) {
              const d = data.data;
              await upsertProfileSource(profileId, {
                platform: source.platform,
                platform_username: d.username || source.platform_username,
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
              synced++;
              addLine(<span className="text-success">  ✓ {source.platform} synced</span>);
            } else {
              addLine(<span className="text-destructive">  ✗ {source.platform} failed</span>);
            }
          }
          // Recalculate freshness
          const updatedSources = await getProfileSources(profileId);
          const freshness = computeFreshnessScore(updatedSources.map(s => s.last_synced_at));
          addLine("\u00A0");
          addLine(<span><span className="text-success">✓</span> <span className="text-muted-foreground/50">{synced} source{synced !== 1 ? "s" : ""} synced — freshness score: {freshness}</span></span>);
          addLine("\u00A0");
        } catch (e: any) {
          addLine(<span className="text-destructive">✗ sync failed: {e.message}</span>);
          addLine("\u00A0");
        }
      })();
      return;
    }

    if (SLASH_COMMANDS[cmd]) {
      setActivePane(SLASH_COMMANDS[cmd]);
      addLine(<span className="text-muted-foreground/50">→ loading {SLASH_COMMANDS[cmd]}...</span>);
      if (isMobile) {
        setTimeout(() => setMobileView("preview"), 300);
      }
      setTimeout(() => {
        addLine(<span><span className="text-success">✓</span> <span className="text-muted-foreground/50">{SLASH_COMMANDS[cmd]} loaded in preview</span></span>);
        addLine("\u00A0");
      }, 300);
      return;
    }

    // Detect profile URLs
    const isProfileUrl = /(?:x\.com|twitter\.com|github\.com|linkedin\.com\/in)\/[a-zA-Z0-9_-]+/i.test(cmd);
    if (isProfileUrl) {
      const platformLabel = /x\.com|twitter\.com/i.test(cmd) ? "x.com" : /github\.com/i.test(cmd) ? "github" : "linkedin";
      const thinkPhrase = agent.getThinkingPhrase("discovery");
      addLine(<span className="text-muted-foreground/50">→ {thinkPhrase}</span>);
      addLine(<span className="text-muted-foreground/50">→ fetching profile from {platformLabel}...</span>);

      supabase.functions.invoke('fetch-x-profile', {
        body: { url: val },
      }).then(async ({ data, error }) => {
        if (error || !data?.success || !data?.data?.profileImageUrl) {
          addLine(<span className="text-muted-foreground/50">→ couldn't grab the profile photo — adding as text source instead</span>);
          const newSource: ScrapedSource = {
            platform: platformLabel === "x.com" ? "x" : platformLabel,
            username: val.match(/\/([a-zA-Z0-9_-]+)\/?$/)?.[1] || "unknown",
            displayName: null, bio: null, profileImageUrl: null,
            location: null, website: null, followers: null, following: null,
            posts: null, headline: null, company: null, links: [], extras: {},
            status: "failed",
          };
          setProfileData((prev) => ({
            ...prev,
            sources: [...prev.sources.filter((s) => s.platform !== newSource.platform || s.username !== newSource.username), newSource],
          }));
        } else {
          const d = data.data;
          const imgUrl = d.profileImageUrl;
          const name = d.displayName;
          const fetchedUsername = d.username;
          const fetchedBio = d.bio;
          const fetchedPlatform = d.platform || (platformLabel === "x.com" ? "x" : platformLabel);

          if (name) addLine(<span className="text-foreground/80">found — {name} (@{fetchedUsername})</span>);
          if (fetchedBio) addLine(<span className="text-muted-foreground/50">bio: "{fetchedBio}"</span>);
          if (d.location) addLine(<span className="text-muted-foreground/50">location: {d.location}</span>);
          if (d.company) addLine(<span className="text-muted-foreground/50">company: {d.company}</span>);
          if (d.headline) addLine(<span className="text-muted-foreground/50">headline: {d.headline}</span>);
          if (d.followers != null) {
            const stats = [`${d.followers.toLocaleString()} followers`];
            if (d.following != null) stats.push(`${d.following.toLocaleString()} following`);
            if (d.posts != null) stats.push(`${d.posts.toLocaleString()} ${fetchedPlatform === 'github' ? 'repos' : 'posts'}`);
            addLine(<span className="text-muted-foreground/50">{stats.join(" · ")}</span>);
          }
          if (d.website) addLine(<span className="text-muted-foreground/50">website: {d.website}</span>);

          addLine(<span className="text-muted-foreground/50">→ generating ascii portrait...</span>);
          addLine(
            <div className="my-2">
              <AsciiAvatar src={imgUrl} cols={80} canvasWidth={400} className="max-w-full" />
            </div>
          );

          addLine(<span className="text-foreground/80">updated your profile with {name ? `${name}'s` : "your"} {fetchedPlatform} data.</span>);

          const newSource: ScrapedSource = {
            platform: fetchedPlatform,
            username: fetchedUsername,
            displayName: name,
            bio: fetchedBio,
            profileImageUrl: imgUrl,
            location: d.location || null,
            website: d.website || null,
            followers: d.followers ?? null,
            following: d.following ?? null,
            posts: d.posts ?? null,
            headline: d.headline || null,
            company: d.company || null,
            links: d.links || [],
            extras: d.extras || {},
            status: "synced",
          };

          setProfileData((prev) => {
            const updatedSources = [...prev.sources.filter((s) => s.platform !== newSource.platform || s.username !== newSource.username), newSource];
            const newLinks = [...prev.allLinks, ...(d.links || []).filter((l: string) => !prev.allLinks.includes(l))];
            return {
              ...prev,
              displayName: prev.displayName || name,
              bio: prev.bio || fetchedBio,
              profileImageUrl: prev.profileImageUrl || imgUrl,
              location: prev.location || d.location || null,
              website: prev.website || d.website || null,
              headline: prev.headline || d.headline || null,
              company: prev.company || d.company || null,
              followers: prev.followers ?? d.followers ?? null,
              allLinks: newLinks,
              sources: updatedSources,
            };
          });

          // Persist to DB if we have a profileId
          if (profileId) {
            try {
              await upsertProfileSource(profileId, {
                platform: fetchedPlatform,
                platform_username: fetchedUsername,
                display_name: name,
                bio: fetchedBio,
                profile_image_url: imgUrl,
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
              await updateProfile(profileId, {
                name: name || undefined,
                bio_short: fetchedBio || undefined,
                location: d.location || undefined,
                website: d.website || undefined,
                avatar_url: imgUrl || undefined,
              } as any);
            } catch (e) {
              console.error("Failed to persist source:", e);
            }
          }
        }

        // AI agent reaction
        setTimeout(async () => {
          try {
            const { data: aiData } = await supabase.functions.invoke('you-agent-chat', {
              body: {
                messages: [{ role: 'user', content: `i just added my ${platformLabel} profile: ${val}` }],
                profileContext: {
                  displayName: profileData.displayName || data?.data?.displayName,
                  bio: profileData.bio || data?.data?.bio,
                  sources: profileData.sources.map((s) => ({
                    platform: s.platform, username: s.username, displayName: s.displayName, bio: s.bio, status: s.status,
                  })),
                },
              },
            });
            if (aiData?.reply) addLine(<span className="text-foreground/80">{aiData.reply}</span>);
          } catch {
            const scrapedCtx: ScrapedContext = {
              platform: data?.data?.platform || (platformLabel === "x.com" ? "x" : platformLabel),
              username: data?.data?.username || "unknown",
              displayName: data?.data?.displayName || null,
              bio: data?.data?.bio || null,
            };
            const reaction = agent.getSourceReaction(scrapedCtx, profileData.sources.map((s) => ({
              platform: s.platform, username: s.username, displayName: s.displayName, bio: s.bio,
            })));
            reaction.split("\n\n").forEach((line) => {
              if (line.trim()) addLine(<span className="text-foreground/80">{line}</span>);
            });
          }
          addLine("\u00A0");
          addLine(<span><span className="text-success">✓</span> <span className="text-muted-foreground/50">source added — profile updated</span></span>);
          addLine("\u00A0");
        }, 600);
      });
      return;
    }

    // Natural language
    const thinkPhrase = agent.getThinkingPhrase("analysis");
    addLine(<span className="text-muted-foreground/50">{thinkPhrase}</span>);

    (async () => {
      try {
        const { data: aiData } = await supabase.functions.invoke('you-agent-chat', {
          body: {
            messages: [{ role: 'user', content: val }],
            profileContext: {
              displayName: profileData.displayName,
              bio: profileData.bio,
              sources: profileData.sources.map((s) => ({
                platform: s.platform, username: s.username, displayName: s.displayName, bio: s.bio, status: s.status,
              })),
            },
          },
        });
        if (aiData?.reply) {
          aiData.reply.split('\n').forEach((line: string) => {
            if (line.trim()) addLine(<span className="text-foreground/80">{line}</span>);
            else addLine("\u00A0");
          });
        } else {
          throw new Error('No AI reply');
        }
      } catch {
        const reaction = agent.getConversationalResponse(val, profileData.sources.map((s) => ({
          platform: s.platform, username: s.username, displayName: s.displayName, bio: s.bio,
        })));
        addLine(<span className="text-foreground/80">{reaction}</span>);
      }
      addLine("\u00A0");
    })();
  }, [addLine, showHelp, isMobile, agent, profileData, profileId]);

  // Show loading while DB loads
  if (!dbLoaded) {
    return (
      <div className="h-screen bg-card flex items-center justify-center">
        <span className="font-mono text-[12px] text-muted-foreground/50 animate-pulse">loading shell...</span>
      </div>
    );
  }

  const terminalContent = (
    <div className="flex flex-col min-h-0 h-full">
      <TerminalHeader title={`@${username} — shell`} />
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4">
        {lines.map((line) => (
          <div key={line.id} className={`font-mono text-[11px] sm:text-[12px] leading-relaxed ${line.className || ""}`}>
            {line.content || "\u00A0"}
          </div>
        ))}
      </div>
      <div className="shrink-0 border-t border-border px-3 sm:px-4 py-2.5 bg-card">
        <TerminalInput prompt=">" placeholder="/help" onSubmit={handleCommand} />
        <div className="h-16 sm:h-20" />
      </div>
    </div>
  );

  const previewContent = (
    <div className="overflow-y-auto h-full bg-card">
      <ShellPreviewPane
        activePane={activePane}
        username={username}
        mode={previewMode}
        profileData={profileData}
        profileId={profileId}
      />
    </div>
  );

  return (
    <div className="h-screen bg-card flex flex-col">
      <div className="border-b border-border bg-card flex items-center justify-between px-3 sm:px-4 py-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-mono text-accent text-xs sm:text-sm font-semibold">YOU</span>
          <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/50">v0.1.0</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {isMobile && (
            <div className="flex items-center border border-border rounded overflow-hidden">
              <button
                onClick={() => setMobileView("terminal")}
                className={`px-2 py-1 text-[10px] font-mono transition-colors ${mobileView === "terminal" ? "bg-accent text-accent-foreground" : "text-muted-foreground/60 hover:text-foreground"}`}
              >
                terminal
              </button>
              <button
                onClick={() => setMobileView("preview")}
                className={`px-2 py-1 text-[10px] font-mono transition-colors ${mobileView === "preview" ? "bg-accent text-accent-foreground" : "text-muted-foreground/60 hover:text-foreground"}`}
              >
                preview
              </button>
            </div>
          )}
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${user ? "bg-success" : "bg-muted-foreground/30"}`} />
          <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/60">@{username}</span>
        </div>
      </div>

      {isMobile ? (
        <div className="flex-1 min-h-0">
          {mobileView === "terminal" ? terminalContent : previewContent}
        </div>
      ) : (
        <div className="flex-1 flex min-h-0">
          <div className="w-1/2 border-r border-border min-h-0">{terminalContent}</div>
          <div className="w-1/2 min-h-0">{previewContent}</div>
        </div>
      )}
    </div>
  );
};

export default ShellPage;
