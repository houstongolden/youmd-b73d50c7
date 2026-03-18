import { useParams, Link } from "react-router-dom";
import { MapPin, ExternalLink, Copy, Check, Star, ArrowUpRight, Shield, Zap, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { sampleProfiles, type ActivityItem, type Project, type AgentConnection, type ConnectedSource } from "@/data/sampleProfiles";
import ProfileAsciiHeader from "@/components/ProfileAsciiHeader";
import { useCountUp } from "@/hooks/useCountUp";

/* ── Helpers ─────────────────────────────────── */

const statusColor = (s: string) => {
  switch (s) {
    case "active": return "text-success";
    case "building": return "text-accent";
    case "publishing": return "text-accent-mid";
    case "launching": return "text-accent-light";
    case "shipped": return "text-success";
    default: return "text-muted-foreground";
  }
};

const stateColor = (s: string) => {
  switch (s) {
    case "high": case "trained": case "current": return "text-success";
    case "medium": case "partial": case "syncing": case "stale": return "text-accent";
    case "low": case "untrained": case "outdated": return "text-destructive";
    default: return "text-muted-foreground";
  }
};

const actionIcon = (a: string) => {
  switch (a) {
    case "published": return "↑";
    case "connected": return "⊕";
    case "updated": return "△";
    case "initialized": return "●";
    case "agent_read": return "◇";
    default: return "·";
  }
};

const sourceIcon = (status: string) => {
  switch (status) {
    case "verified": return "✓";
    case "synced": return "↻";
    case "pending": return "…";
    default: return "·";
  }
};

/* ── Micro Components ─────────────────────────── */

const SectionHeader = ({ children }: { children: string }) => (
  <h2 className="text-accent font-mono text-[11px] uppercase tracking-wider mb-4">&gt; {children}</h2>
);

const Divider = () => <div className="section-divider my-8" />;

const StatusLine = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <p className="font-mono text-[11px]">
    <span className="text-muted-foreground/70">{label}:</span>{" "}
    <span className={color || "text-foreground/80"}>{value}</span>
  </p>
);

/* ── Count-up Components ──────────────────────── */

const CountUpValue = ({ target, prefix = "", suffix = "", className = "" }: { target: number; prefix?: string; suffix?: string; className?: string }) => {
  const { value, ref } = useCountUp(target);
  return (
    <span ref={ref} className={className}>
      {prefix}{value.toLocaleString()}{suffix}
    </span>
  );
};

const AgentMetricsInline = ({ profile }: { profile: typeof sampleProfiles[0] }) => (
  <div className="flex items-center gap-4 pt-1">
    <span className="font-mono text-[10px] text-muted-foreground/60">
      agent reads: <CountUpValue target={profile.agentMetrics.totalReads} className="text-foreground/80" />
    </span>
    <span className="font-mono text-[10px] text-muted-foreground/60">
      integrations: <CountUpValue target={profile.agentMetrics.activeIntegrations} className="text-foreground/80" />
    </span>
  </div>
);

const FreshnessScore = ({ score }: { score: number }) => {
  const { value, ref } = useCountUp(score);
  return (
    <div ref={ref} className="flex items-center gap-2">
      <span className="font-mono text-[10px] text-muted-foreground/60">freshness score:</span>
      <span className="font-mono text-[14px] text-accent font-medium">{value}/100</span>
    </div>
  );
};

const AgentNetworkMetrics = ({ profile }: { profile: typeof sampleProfiles[0] }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
    <div>
      <p className="text-foreground font-mono text-[18px] font-medium">
        <CountUpValue target={profile.agentMetrics.totalReads} />
      </p>
      <p className="text-muted-foreground/60 font-mono text-[9px]">total reads</p>
    </div>
    <div>
      <p className="text-accent font-mono text-[18px] font-medium">
        <CountUpValue target={profile.agentMetrics.recentReads24h} prefix="+" />
      </p>
      <p className="text-muted-foreground/60 font-mono text-[9px]">reads (24h)</p>
    </div>
    <div>
      <p className="text-foreground font-mono text-[18px] font-medium">
        <CountUpValue target={profile.agentMetrics.connectedAgentsCount} />
      </p>
      <p className="text-muted-foreground/60 font-mono text-[9px]">connected agents</p>
    </div>
    <div>
      <p className="text-success font-mono text-[18px] font-medium">
        <CountUpValue target={profile.agentMetrics.verifiedAgents} />
      </p>
      <p className="text-muted-foreground/60 font-mono text-[9px]">verified agents</p>
    </div>
  </div>
);

/* ── Section Components ───────────────────────── */

const VerifiedBadge = ({ methods, level }: { methods: string[]; level?: string }) => (
  <div className="flex items-center gap-2">
    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-success border border-success/20 rounded px-2 py-0.5 bg-success/5">
      <Shield size={9} />
      VERIFIED {level ? `· ${level.toUpperCase()}` : ""}
    </span>
    <span className="text-muted-foreground/60 font-mono text-[9px]">
      {methods.join(" · ")}
    </span>
  </div>
);

const ProjectCard = ({ project }: { project: Project }) => (
  <div className="border border-border rounded p-4 hover:border-accent/20 transition-colors group">
    <div className="flex items-start justify-between gap-2 mb-2">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-foreground font-mono text-[13px] font-medium">{project.name}</span>
          <span className={`font-mono text-[9px] uppercase tracking-wider ${statusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
        <span className="text-muted-foreground/70 font-mono text-[10px]">{project.role}</span>
      </div>
      {project.url && (
        <a href={project.url} className="text-muted-foreground/40 group-hover:text-accent transition-colors">
          <ArrowUpRight size={14} />
        </a>
      )}
    </div>
    <p className="text-muted-foreground font-body text-[12px] leading-relaxed mb-3">{project.description}</p>
    <div className="flex items-center gap-4">
      {project.stars && (
        <span className="flex items-center gap-1 text-muted-foreground/60 font-mono text-[10px]">
          <Star size={10} /> {project.stars.toLocaleString()}
        </span>
      )}
      {project.mrr && (
        <span className="text-success font-mono text-[10px]">{project.mrr} MRR</span>
      )}
    </div>
  </div>
);

const AgentConnectionsList = ({ connections }: { connections: AgentConnection[] }) => (
  <div className="space-y-0">
    {connections.map((agent) => (
      <div key={agent.name} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
        <span className="text-foreground/80 font-mono text-[11px] flex items-center gap-1.5">
          - {agent.name}
          {agent.isVerified && (
            <span className="text-success font-mono text-[8px]">✓</span>
          )}
        </span>
        <span className="text-muted-foreground/50 font-mono text-[9px]">{agent.lastAccess}</span>
      </div>
    ))}
  </div>
);

const ConnectedSourcesList = ({ sources }: { sources: ConnectedSource[] }) => {
  const verified = sources.filter((s) => s.status === "verified");
  const synced = sources.filter((s) => s.status === "synced");
  const pending = sources.filter((s) => s.status === "pending");

  return (
    <div className="space-y-3">
      {verified.length > 0 && (
        <div>
          <p className="text-muted-foreground/60 font-mono text-[10px] mb-1.5">verified:</p>
          {verified.map((s) => (
            <div key={s.name} className="flex items-center justify-between py-1">
              <span className="text-success/80 font-mono text-[11px]">
                {sourceIcon(s.status)} {s.name}
              </span>
              {s.lastSync && <span className="text-muted-foreground/50 font-mono text-[9px]">{s.lastSync}</span>}
            </div>
          ))}
        </div>
      )}
      {synced.length > 0 && (
        <div>
          <p className="text-muted-foreground/60 font-mono text-[10px] mb-1.5">synced:</p>
          {synced.map((s) => (
            <div key={s.name} className="flex items-center justify-between py-1">
              <span className="text-accent/80 font-mono text-[11px]">
                {sourceIcon(s.status)} {s.name}
              </span>
              {s.lastSync && <span className="text-muted-foreground/50 font-mono text-[9px]">{s.lastSync}</span>}
            </div>
          ))}
        </div>
      )}
      {pending.length > 0 && (
        <div>
          <p className="text-muted-foreground/60 font-mono text-[10px] mb-1.5">pending:</p>
          {pending.map((s) => (
            <div key={s.name} className="flex items-center justify-between py-1">
              <span className="text-muted-foreground/70 font-mono text-[11px]">
                {sourceIcon(s.status)} {s.name}
              </span>
              {s.lastSync && <span className="text-muted-foreground/50 font-mono text-[9px]">{s.lastSync}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ActivityTimeline = ({ items }: { items: ActivityItem[] }) => (
  <div className="space-y-0">
    {items.slice(0, 8).map((item, i) => (
      <div key={i} className="flex items-center gap-3 py-1.5 border-b border-border/20 last:border-0">
        <span className="text-accent/70 font-mono text-[11px] w-4 text-center shrink-0">
          {actionIcon(item.action)}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-foreground/80 font-mono text-[11px] truncate">{item.detail}</p>
        </div>
        <span className="text-muted-foreground/50 font-mono text-[9px] shrink-0">
          {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
    ))}
  </div>
);

/* ── Main Page ────────────────────────────────── */

const ProfilePage = () => {
  const { username } = useParams();
  const profile = sampleProfiles.find((p) => p.username === username);
  const [copied, setCopied] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [username]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-destructive font-mono text-[11px] mb-2">✗ ERROR 404</p>
          <h1 className="text-foreground font-mono text-xl font-light mb-3">Profile not found</h1>
          <p className="text-muted-foreground font-body text-[13px] mb-6">This you.md username doesn't exist yet.</p>
          <Link to="/profiles" className="cta-primary px-5 py-2 text-[11px] inline-block">
            &gt; ls /profiles
          </Link>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`you.md/${profile.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const delay = (i: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: i * 0.04 } });

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:pt-4">
        <div className="max-w-[680px] mx-auto flex items-center justify-between px-4 py-2 glass-nav rounded">
          <Link to="/" className="text-accent font-mono text-[12px]">you.md</Link>
          <Link to="/profiles" className="text-muted-foreground/60 font-mono text-[10px] hover:text-accent transition-colors">/profiles</Link>
        </div>
      </nav>

      {/* ASCII Art Header — personalized */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        className="relative w-full pt-16">
        <ProfileAsciiHeader profile={profile} />
      </motion.div>

      {/* Content */}
      <div className="px-6 pb-20 relative z-10">
        <div className="max-w-[680px] mx-auto">

          {/* ═══ SYSTEM HEADER ═══ */}
          <motion.div {...delay(0)} className="mt-4 mb-6">
            <div className="flex items-end gap-4 mb-4">
              <img src={profile.avatarUrl} alt={profile.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded border-2 border-background object-cover" loading="lazy" />
              <div className="pb-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-foreground font-mono text-lg md:text-xl font-medium tracking-tight truncate">
                    {profile.name}
                  </h1>
                </div>
                <p className="text-muted-foreground font-body text-[12px] mt-0.5 truncate">{profile.tagline}</p>
              </div>
            </div>

            {/* System status block */}
            <div className="terminal-panel p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <button onClick={handleCopy}
                  className="flex items-center gap-1.5 text-accent font-mono text-[12px] hover:text-accent-light transition-colors">
                  you.md/{profile.username}
                  {copied ? <Check size={10} className="text-success" /> : <Copy size={10} />}
                </button>
                <span className="font-mono text-[10px] text-success uppercase tracking-wider flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-success status-dot-pulse" />
                  active
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground/60 font-mono text-[10px]">
                <MapPin size={9} />
                <span>{profile.location}</span>
              </div>
              <StatusLine label="last updated" value={profile.lastUpdated} />
              <StatusLine label="maintained by" value={profile.maintainedBy.join(" + ")} />
              <StatusLine label="connected sources" value={String(profile.connectedSources.length)} color="text-accent" />
              {profile.verification.verified && (
                <div className="pt-1">
                  <VerifiedBadge methods={profile.verification.methods} level={profile.verification.level} />
                </div>
              )}
              <AgentMetricsInline profile={profile} />
            </div>
          </motion.div>

          <Divider />

          {/* ═══ IDENTITY ═══ */}
          <motion.div {...delay(1)}>
            <SectionHeader>identity</SectionHeader>
            <p className="text-foreground/90 font-body text-[14px] leading-[1.7] mb-4">
              {profile.bio.medium}
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.topics.map((t) => (
                <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded border border-accent/20 text-accent/70">
                  {t}
                </span>
              ))}
            </div>
            {profile.credibility.length > 0 && (
              <div className="mt-3 space-y-0.5">
                {profile.credibility.map((c) => (
                  <p key={c} className="text-muted-foreground/70 font-mono text-[10px]">› {c}</p>
                ))}
              </div>
            )}
          </motion.div>

          <Divider />

          {/* ═══ CURRENT ACTIVITY ═══ */}
          <motion.div {...delay(2)}>
            <SectionHeader>current activity</SectionHeader>
            <div className="mb-4">
              <p className="text-muted-foreground/60 font-mono text-[10px] mb-2">now:</p>
              {profile.now.map((item) => (
                <p key={item} className="text-foreground/80 font-mono text-[12px]">- {item}</p>
              ))}
            </div>
            <div className="mb-4">
              <p className="text-muted-foreground/60 font-mono text-[10px] mb-2">recent changes:</p>
              {profile.recentChanges.map((c) => (
                <p key={c} className="text-foreground/75 font-mono text-[11px]">- {c}</p>
              ))}
            </div>
            <div>
              <p className="text-muted-foreground/60 font-mono text-[10px] mb-2">timeline:</p>
              <ActivityTimeline items={profile.activity} />
            </div>
          </motion.div>

          <Divider />

          {/* ═══ CONNECTED SOURCES ═══ */}
          <motion.div {...delay(3)}>
            <SectionHeader>connected sources</SectionHeader>
            <ConnectedSourcesList sources={profile.connectedSources} />
          </motion.div>

          <Divider />

          {/* ═══ FRESHNESS ═══ */}
          <motion.div {...delay(4)}>
            <SectionHeader>freshness</SectionHeader>
            <div className="space-y-1.5 mb-3">
              <StatusLine label="identity" value={profile.freshness.identity} color={stateColor(profile.freshness.identity)} />
              <StatusLine label="projects" value={profile.freshness.projects} color={stateColor(profile.freshness.projects)} />
              <StatusLine label="voice" value={profile.freshness.voice} color={stateColor(profile.freshness.voice)} />
              <StatusLine label="sources" value={profile.freshness.sources} color={stateColor(profile.freshness.sources)} />
            </div>
            <FreshnessScore score={profile.freshness.score} />
          </motion.div>

          <Divider />

          {/* ═══ MAINTENANCE ═══ */}
          <motion.div {...delay(5)}>
            <SectionHeader>maintenance</SectionHeader>
            <div className="space-y-1.5">
              <StatusLine label="human edits" value={profile.maintenance.humanEdits ? "enabled" : "disabled"}
                color={profile.maintenance.humanEdits ? "text-success" : "text-muted-foreground/60"} />
              <StatusLine label="agent maintenance" value={profile.maintenance.agentMaintenance ? "active" : "inactive"}
                color={profile.maintenance.agentMaintenance ? "text-success" : "text-muted-foreground/60"} />
              <StatusLine label="update mode" value={profile.maintenance.updateMode} />
            </div>
            <div className="mt-3">
              <p className="text-muted-foreground/60 font-mono text-[10px] mb-1.5">active maintainers:</p>
              {profile.maintenance.activeMaintainers.map((m) => (
                <p key={m} className="text-foreground/75 font-mono text-[11px]">- {m}</p>
              ))}
            </div>
          </motion.div>

          <Divider />

          {/* ═══ AGENT NETWORK ═══ */}
          <motion.div {...delay(6)}>
            <SectionHeader>agent network</SectionHeader>
            <AgentNetworkMetrics profile={profile} />
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-foreground font-mono text-[14px] font-medium">
                  {profile.agentMetrics.activeIntegrations}
                </p>
                <p className="text-muted-foreground/60 font-mono text-[9px]">active integrations</p>
              </div>
              <div>
                <p className="text-foreground font-mono text-[14px] font-medium">
                  {profile.agentMetrics.contextSessions}
                </p>
                <p className="text-muted-foreground/60 font-mono text-[9px]">context sessions</p>
              </div>
            </div>

            <p className="text-muted-foreground/50 font-mono text-[10px] mb-2">recent connections:</p>
            <AgentConnectionsList connections={profile.agentConnections} />
          </motion.div>

          <Divider />

          {/* ═══ IDENTITY STATE ═══ */}
          <motion.div {...delay(7)}>
            <SectionHeader>identity state</SectionHeader>
            <div className="space-y-1.5">
              <StatusLine label="memory coverage" value={profile.identityState.memoryCoverage}
                color={stateColor(profile.identityState.memoryCoverage)} />
              <StatusLine label="voice profile" value={profile.identityState.voiceProfile}
                color={stateColor(profile.identityState.voiceProfile)} />
              <StatusLine label="context freshness" value={profile.identityState.contextFreshness}
                color={stateColor(profile.identityState.contextFreshness)} />
              <StatusLine label="last pipeline run" value={profile.identityState.lastPipelineRun} />
              <StatusLine label="sources synced" value={String(profile.identityState.sourcesSynced)} />
              <StatusLine label="context score" value={`${profile.agentMetrics.contextScore}/100`} color="text-accent font-medium" />
            </div>
          </motion.div>

          <Divider />

          {/* ═══ PROJECTS ═══ */}
          <motion.div {...delay(8)}>
            <SectionHeader>projects</SectionHeader>
            <div className="grid gap-3">
              {profile.projects.map((p) => (
                <ProjectCard key={p.name} project={p} />
              ))}
            </div>
          </motion.div>

          <Divider />

          {/* ═══ ACCESS LAYERS ═══ */}
          <motion.div {...delay(9)}>
            <SectionHeader>access layers</SectionHeader>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground/60 font-mono text-[10px] mb-2">public:</p>
                {profile.publicSections.map((s) => (
                  <p key={s} className="text-foreground/75 font-mono text-[11px]">- {s}</p>
                ))}
              </div>
              <div>
                <p className="text-muted-foreground/60 font-mono text-[10px] mb-2">private (scoped access):</p>
                {profile.privateSections.map((s) => (
                  <p key={s} className="text-muted-foreground/50 font-mono text-[11px]">- {s}</p>
                ))}
              </div>
            </div>
          </motion.div>

          <Divider />

          {/* ═══ FOR AGENTS ═══ */}
          <motion.div {...delay(10)}>
            <SectionHeader>for agents</SectionHeader>
            <div className="terminal-panel p-4 space-y-2">
              <p className="font-mono text-[11px] text-muted-foreground/60">start here:</p>
              <p className="font-mono text-[11px] text-accent">GET /api/v1/profiles/{profile.username}</p>

              <p className="font-mono text-[10px] text-muted-foreground/60 mt-3">preferred retrieval order:</p>
              <p className="font-mono text-[11px] text-foreground/75">1. you.json</p>
              <p className="font-mono text-[11px] text-foreground/75">2. manifest.json</p>
              <p className="font-mono text-[11px] text-foreground/75">3. you.md</p>
              <p className="font-mono text-[11px] text-foreground/75">4. analysis/*</p>

              <p className="font-mono text-[10px] text-muted-foreground/60 mt-3">notes:</p>
              <p className="font-mono text-[11px] text-foreground/75">- use structured fields first</p>
              <p className="font-mono text-[11px] text-foreground/75">- prefer most recent timestamps</p>
              <p className="font-mono text-[11px] text-foreground/75">- respect public/private boundaries</p>
              <p className="font-mono text-[11px] text-foreground/75">- check verification status before citing</p>
              <p className="font-mono text-[11px] text-foreground/75">- tone: {profile.preferences.tone}</p>
              <p className="font-mono text-[11px] text-foreground/75">- avoid: {profile.preferences.avoid.join(", ")}</p>
            </div>
          </motion.div>

          <Divider />

          {/* ═══ TOP QUERIES ═══ */}
          <motion.div {...delay(11)}>
            <SectionHeader>common queries</SectionHeader>
            <div className="space-y-1">
              {profile.topQueries.map((q) => (
                <p key={q} className="font-mono text-[11px] text-muted-foreground/70">"{q}"</p>
              ))}
            </div>
          </motion.div>

          <Divider />

          {/* ═══ CONNECT / SHARE CONTEXT ═══ */}
          <motion.div {...delay(12)}>
            <SectionHeader>connect</SectionHeader>
            <div className="space-y-3">
              <div>
                <p className="font-mono text-[11px] text-muted-foreground/70">share public context:</p>
                <p className="font-mono text-[12px] text-accent">$ youmd link create</p>
              </div>
              <div>
                <p className="font-mono text-[11px] text-muted-foreground/70">scoped private context:</p>
                <p className="font-mono text-[12px] text-accent">$ youmd link create --scope=full</p>
              </div>
              <div>
                <p className="font-mono text-[11px] text-muted-foreground/70">api:</p>
                <p className="font-mono text-[11px] text-foreground/75">GET /api/v1/profiles/{profile.username}</p>
              </div>
            </div>
          </motion.div>

          <Divider />

          {/* ═══ LINKS ═══ */}
          <motion.div {...delay(13)}>
            <div className="flex flex-wrap gap-3 mb-6">
              {profile.links.map((link) => (
                <a key={link.label} href={link.url}
                  className="inline-flex items-center gap-1.5 text-accent/80 hover:text-accent font-mono text-[11px] transition-colors border border-border rounded px-3 py-1.5 hover:border-accent/30">
                  {link.label}
                  <ExternalLink size={9} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* ═══ VALUES ═══ */}
          <motion.div {...delay(14)}>
            <div className="space-y-1 mb-16">
              {profile.values.map((v) => (
                <p key={v} className="text-muted-foreground/60 font-mono text-[11px]">› {v}</p>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div {...delay(15)} className="text-center space-y-2">
            <p className="text-muted-foreground/50 font-mono text-[9px] italic">
              Updated by the human. Maintained by the system. Verified by connected systems.
            </p>
            <p className="text-muted-foreground/50 font-mono text-[10px]">
              Powered by <Link to="/" className="text-accent/60 hover:text-accent transition-colors">you.md</Link>
            </p>
            <Link to="/#get-started"
              className="text-muted-foreground/40 font-mono text-[10px] hover:text-accent/70 transition-colors">
              &gt; claim yours
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
