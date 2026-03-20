import AsciiAvatar from "@/components/AsciiAvatar";

export interface ScrapedSource {
  platform: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  location: string | null;
  website: string | null;
  followers: number | null;
  following: number | null;
  posts: number | null;
  headline: string | null;
  company: string | null;
  links: string[];
  extras: Record<string, string | number | null>;
  status: "synced" | "verified" | "pending" | "failed";
}

export interface ProfileData {
  displayName: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  location: string | null;
  website: string | null;
  headline: string | null;
  company: string | null;
  followers: number | null;
  allLinks: string[];
  sources: ScrapedSource[];
}

const SectionLabel = ({ children }: { children: string }) => (
  <h3 className="font-mono text-[10px] sm:text-[11px] text-accent uppercase tracking-wider mb-2 sm:mb-3">&gt; {children}</h3>
);

const Divider = () => <div className="h-px bg-border my-4 sm:my-6" />;

const PLATFORM_LABELS: Record<string, string> = {
  x: "X / Twitter",
  github: "GitHub",
  linkedin: "LinkedIn",
};

const ProfilePreview = ({
  username,
  mode,
  profileData,
}: {
  username: string;
  mode: "public" | "private";
  profileData?: ProfileData;
}) => {
  const name = profileData?.displayName;
  const bio = profileData?.bio;
  const imgUrl = profileData?.profileImageUrl;
  const sources = profileData?.sources || [];
  const sourceCount = sources.length;
  const location = profileData?.location;
  const website = profileData?.website;
  const headline = profileData?.headline;
  const company = profileData?.company;
  const totalFollowers = profileData?.followers ?? (sources.reduce((sum, s) => sum + (s.followers ?? 0), 0) || null);

  return (
    <div className="p-4 sm:p-8 max-w-xl mx-auto">
      {/* Status bar */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success status-dot-pulse" />
          <span className="font-mono text-[10px] sm:text-[11px] text-success">ACTIVE</span>
        </div>
        <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground/40">
          {mode === "public" ? "public view" : "private view — full context"}
        </span>
      </div>

      {/* ASCII portrait — real or placeholder */}
      <div className="terminal-panel mb-4 sm:mb-6">
        <div className="p-3 sm:p-4 text-center overflow-x-auto">
          {imgUrl ? (
            <AsciiAvatar src={imgUrl} cols={100} canvasWidth={460} className="max-w-full mx-auto" />
          ) : (
            <pre className="font-mono text-[6px] sm:text-[8px] leading-[1.1] text-accent/60 inline-block text-left">
{`    ░░▒▒▓▓██▓▓▒▒░░    
  ░▒▓██████████████▓▒░  
  ▒███    ████    ███▒  
  ▓██  ●  ████  ●  ██▓  
  ▒███    ████    ███▒  
  ░▒▓██████████████▓▒░  
    ░░▒▒▓▓████▓▓▒▒░░    `}
            </pre>
          )}
        </div>
      </div>

      {/* Identity */}
      <div className="flex items-start gap-3 mb-1">
        {imgUrl && (
          <img
            src={imgUrl}
            alt={name || username}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm border border-border object-cover shrink-0 mt-0.5"
            crossOrigin="anonymous"
          />
        )}
        <div className="min-w-0">
          <h1 className="font-mono text-base sm:text-lg text-foreground">
            {name ? `${name}` : `@${username}`}
          </h1>
          {name && (
            <p className="font-mono text-[11px] sm:text-[12px] text-muted-foreground/50 mt-0.5">
              @{username}
            </p>
          )}
          {(headline || company) && (
            <p className="font-mono text-[12px] sm:text-[13px] text-muted-foreground/70 mt-0.5">
              {headline || company}
            </p>
          )}
          {location && (
            <p className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/50 mt-0.5">
              📍 {location}
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <>
          <Divider />
          <SectionLabel>bio</SectionLabel>
          <p className="font-mono text-[11px] sm:text-[12px] text-foreground/70 leading-relaxed">
            {bio}
          </p>
        </>
      )}

      <Divider />

      {/* Agent Metrics */}
      <SectionLabel>agent metrics</SectionLabel>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-2">
        {[
          { label: "followers", value: totalFollowers ? totalFollowers.toLocaleString() : "—" },
          { label: "freshness", value: sourceCount > 0 ? "94" : "—" },
          { label: "sources", value: String(sourceCount) },
        ].map((m) => (
          <div key={m.label} className="terminal-panel p-2 sm:p-3">
            <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground/50 uppercase">{m.label}</p>
            <p className="font-mono text-base sm:text-lg text-foreground mt-1">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Website */}
      {website && (
        <>
          <div className="mt-2">
            <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer"
              className="font-mono text-[11px] sm:text-[12px] text-accent hover:text-accent/80 transition-colors">
              {website}
            </a>
          </div>
        </>
      )}

      <Divider />

      {/* Connected Sources — real data */}
      <SectionLabel>connected sources</SectionLabel>
      {sources.length > 0 ? (
        <div className="space-y-2">
          {sources.map((s) => (
            <div key={`${s.platform}-${s.username}`} className="flex items-center justify-between font-mono text-[11px] sm:text-[12px]">
              <div className="flex flex-col">
                <span className="text-foreground/70">{PLATFORM_LABELS[s.platform] || s.platform}</span>
                <span className="text-muted-foreground/40 text-[9px] sm:text-[10px]">@{s.username}</span>
              </div>
              <span className={
                s.status === "verified" ? "text-success" :
                s.status === "synced" ? "text-accent" :
                s.status === "failed" ? "text-destructive" :
                "text-muted-foreground/50"
              }>
                {s.status === "verified" ? "✓ verified" : s.status === "synced" ? "↻ synced" : s.status === "failed" ? "✗ failed" : "… pending"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-mono text-[11px] sm:text-[12px] text-muted-foreground/40">
          no sources connected yet — paste a profile URL in the terminal
        </p>
      )}

      {/* Profile links */}
      {sources.length > 0 && (
        <>
          <Divider />
          <SectionLabel>profile links</SectionLabel>
          <div className="space-y-1.5">
            {sources.map((s) => {
              const url =
                s.platform === "x" ? `https://x.com/${s.username}` :
                s.platform === "github" ? `https://github.com/${s.username}` :
                s.platform === "linkedin" ? `https://linkedin.com/in/${s.username}` :
                "#";
              return (
                <a
                  key={`link-${s.platform}-${s.username}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-mono text-[11px] sm:text-[12px] text-accent hover:text-accent/80 transition-colors"
                >
                  {url}
                </a>
              );
            })}
          </div>
        </>
      )}

      {mode === "private" && (
        <>
          <Divider />
          <SectionLabel>private context</SectionLabel>
          <div className="terminal-panel p-3 sm:p-4">
            <p className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/50">
              private identity layers visible only to authorized agents and you.
            </p>
          </div>
        </>
      )}

      <Divider />

      <SectionLabel>freshness state</SectionLabel>
      <div className="space-y-1.5">
        {[
          { key: "identity", state: sources.length > 0 ? "current" : "empty" },
          { key: "projects", state: "empty" },
          { key: "voice", state: "empty" },
          { key: "sources", state: sources.length > 0 ? "syncing" : "empty" },
        ].map((f) => (
          <div key={f.key} className="flex items-center justify-between font-mono text-[11px] sm:text-[12px]">
            <span className="text-muted-foreground/60">{f.key}</span>
            <span className={
              f.state === "current" ? "text-success" :
              f.state === "syncing" ? "text-accent" :
              "text-muted-foreground/40"
            }>
              {f.state}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePreview;
