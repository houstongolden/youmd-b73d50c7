import { useParams, Link } from "react-router-dom";
import { MapPin, ExternalLink, Copy, Check, Star, ArrowUpRight, Shield, Code, Eye, Flag, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sampleProfiles, type Profile as SampleProfile, type ActivityItem, type Project, type AgentConnection, type ConnectedSource } from "@/data/sampleProfiles";
import ProfileAsciiHeader from "@/components/ProfileAsciiHeader";
import RawJsonView from "@/components/RawJsonView";
import { useCountUp } from "@/hooks/useCountUp";
import { getProfileByUsername, getProfileSources, getProfileVerifications, type DbProfile, type DbProfileSource } from "@/lib/profiles";
import { useAuth } from "@/hooks/useAuth";
import ClaimBanner from "@/components/ClaimBanner";
import ReportDialog from "@/components/ReportDialog";
import { computeDimensionFreshness, freshnessLabel } from "@/lib/freshness";
import { generateYouJson, generateYouMd, downloadFile } from "@/lib/exportProfile";

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

const FreshnessScore = ({ score }: { score: number }) => {
  const { value, ref } = useCountUp(score);
  return (
    <div ref={ref} className="flex items-center gap-2">
      <span className="font-mono text-[10px] text-muted-foreground/60">freshness score:</span>
      <span className="font-mono text-[14px] text-accent font-medium">{value}/100</span>
    </div>
  );
};

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
          {agent.isVerified && <span className="text-success font-mono text-[8px]">✓</span>}
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
              <span className="text-success/80 font-mono text-[11px]">{sourceIcon(s.status)} {s.name}</span>
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
              <span className="text-accent/80 font-mono text-[11px]">{sourceIcon(s.status)} {s.name}</span>
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
              <span className="text-muted-foreground/70 font-mono text-[11px]">{sourceIcon(s.status)} {s.name}</span>
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
        <span className="text-accent/70 font-mono text-[11px] w-4 text-center shrink-0">{actionIcon(item.action)}</span>
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

const DbSourcesList = ({ sources }: { sources: DbProfileSource[] }) => {
  if (!sources.length) return null;
  return (
    <div className="space-y-1">
      {sources.map((s) => (
        <div key={s.id} className="flex items-center justify-between py-1">
          <span className={`font-mono text-[11px] ${s.status === "synced" ? "text-accent/80" : "text-muted-foreground/70"}`}>
            {s.status === "synced" ? "↻" : "…"} {s.platform}{s.platform_username ? ` — @${s.platform_username}` : ""}
          </span>
          {s.last_synced_at && (
            <span className="text-muted-foreground/50 font-mono text-[9px]">
              {new Date(s.last_synced_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

/* ── Main Page ────────────────────────────────── */

const ProfilePage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const sampleProfile = sampleProfiles.find((p) => p.username === username);
  const [dbProfile, setDbProfile] = useState<DbProfile | null>(null);
  const [dbSources, setDbSources] = useState<DbProfileSource[]>([]);
  const [dbVerifications, setDbVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [rawView, setRawView] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [username]);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    getProfileByUsername(username).then(async (p) => {
      setDbProfile(p);
      if (p) {
        const [sources, verifications] = await Promise.all([
          getProfileSources(p.id),
          getProfileVerifications(p.id),
        ]);
        setDbSources(sources);
        setDbVerifications(verifications);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [username]);

  const isOwner = user && dbProfile?.owner_id === user.id;
  const showClaimBanner = dbProfile && !dbProfile.is_claimed;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-[12px] text-muted-foreground/50 animate-pulse">loading profile...</span>
      </div>
    );
  }

  if (!sampleProfile && !dbProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-destructive font-mono text-[11px] mb-2">✗ ERROR 404</p>
          <h1 className="text-foreground font-mono text-xl font-light mb-3">Profile not found</h1>
          <p className="text-muted-foreground font-body text-[13px] mb-6">This you.md username doesn't exist yet.</p>
          <Link to="/create" className="cta-primary px-5 py-2 text-[11px] inline-block mr-3">&gt; create profile</Link>
          <Link to="/profiles" className="cta-primary px-5 py-2 text-[11px] inline-block">&gt; ls /profiles</Link>
        </div>
      </div>
    );
  }

  // Build a unified profile view merging DB data (primary) with sample data (enrichment)
  const name = dbProfile?.name || sampleProfile?.name || username || "";
  const tagline = dbProfile?.tagline || sampleProfile?.tagline || "";
  const bio = dbProfile?.bio_medium || sampleProfile?.bio?.medium || dbProfile?.bio_short || sampleProfile?.bio?.short || "";
  const location = dbProfile?.location || sampleProfile?.location || "";
  const avatarUrl = dbProfile?.avatar_url || sampleProfile?.avatarUrl || "";
  const topics = dbProfile?.topics || sampleProfile?.topics || [];
  const credibility = dbProfile?.credibility || sampleProfile?.credibility || [];
  const nowItems = dbProfile?.now_items || sampleProfile?.now || [];
  const valuesList = dbProfile?.values_list || sampleProfile?.values || [];
  const voice = dbProfile?.voice || sampleProfile?.voice || "";
  const dbLinks = Array.isArray(dbProfile?.links) ? (dbProfile.links as any[]) : [];
  const links = dbLinks.length > 0 ? dbLinks : (sampleProfile?.links || []);
  const preferences = (dbProfile?.preferences as any) || sampleProfile?.preferences || {};

  const handleCopy = () => {
    navigator.clipboard.writeText(`you.md/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const delay = (i: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: i * 0.04 } });

  // Use sample data for rich sections that aren't in DB yet
  const hasSampleEnrichment = !!sampleProfile;

  return (
    <div className="min-h-screen">
      {/* Claim banner */}
      {showClaimBanner && dbProfile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-3">
          <div className="max-w-[680px] mx-auto">
            <ClaimBanner profileId={dbProfile.id} username={dbProfile.username} />
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:pt-4">
        <div className="max-w-[680px] mx-auto flex items-center justify-between px-4 py-2 glass-nav rounded">
          <Link to="/" className="text-accent font-mono text-[12px]">you.md</Link>
          <div className="flex items-center gap-3">
            {hasSampleEnrichment && (
              <button
                onClick={() => setRawView(!rawView)}
                className={`flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 rounded border transition-all duration-200 ${
                  rawView
                    ? "text-accent border-accent/30 bg-accent-wash/40"
                    : "text-muted-foreground/60 border-border hover:text-accent hover:border-accent/20"
                }`}
              >
                {rawView ? <Eye size={10} /> : <Code size={10} />}
                {rawView ? "rendered" : "raw"}
              </button>
            )}
            <Link to="/profiles" className="text-muted-foreground/60 font-mono text-[10px] hover:text-accent transition-colors">/profiles</Link>
          </div>
        </div>
      </nav>

      {/* ASCII Art Header */}
      {hasSampleEnrichment && sampleProfile && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative w-full pt-16">
          <ProfileAsciiHeader profile={sampleProfile} />
        </motion.div>
      )}

      {!hasSampleEnrichment && <div className="pt-20" />}

      {/* Content */}
      <div className="px-6 pb-20 relative z-10">
        <div className="max-w-[680px] mx-auto">
          <AnimatePresence mode="wait">
            {rawView && sampleProfile ? (
              <motion.div key="raw" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="mt-4">
                <RawJsonView profile={sampleProfile} />
              </motion.div>
            ) : (
              <motion.div key="rendered" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

                {/* ═══ SYSTEM HEADER ═══ */}
                <motion.div {...delay(0)} className="mt-4 mb-6">
                  <div className="flex items-end gap-4 mb-4">
                    {avatarUrl && (
                      <img src={avatarUrl} alt={name} className="w-16 h-16 md:w-20 md:h-20 rounded border-2 border-background object-cover" loading="lazy" />
                    )}
                    <div className="pb-1 flex-1 min-w-0">
                      <h1 className="text-foreground font-mono text-lg md:text-xl font-medium tracking-tight truncate">{name}</h1>
                      {tagline && <p className="text-muted-foreground font-body text-[12px] mt-0.5 truncate">{tagline}</p>}
                    </div>
                  </div>
                  <div className="terminal-panel p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <button onClick={handleCopy} className="flex items-center gap-1.5 text-accent font-mono text-[12px] hover:text-accent-light transition-colors">
                        you.md/{username}
                        {copied ? <Check size={10} className="text-success" /> : <Copy size={10} />}
                      </button>
                      <span className="font-mono text-[10px] text-success uppercase tracking-wider flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-success status-dot-pulse" />
                        active
                      </span>
                    </div>
                    {location && (
                      <div className="flex items-center gap-1 text-muted-foreground/60 font-mono text-[10px]">
                        <MapPin size={9} /> <span>{location}</span>
                      </div>
                    )}
                    {hasSampleEnrichment && sampleProfile && (
                      <>
                        <StatusLine label="last updated" value={sampleProfile.lastUpdated} />
                        <StatusLine label="maintained by" value={sampleProfile.maintainedBy.join(" + ")} />
                        <StatusLine label="connected sources" value={String(sampleProfile.connectedSources.length)} color="text-accent" />
                        {sampleProfile.verification.verified && (
                          <div className="pt-1">
                            <VerifiedBadge methods={sampleProfile.verification.methods} level={sampleProfile.verification.level} />
                          </div>
                        )}
                        <div className="flex items-center gap-4 pt-1">
                          <span className="font-mono text-[10px] text-muted-foreground/60">
                            agent reads: <CountUpValue target={sampleProfile.agentMetrics.totalReads} className="text-foreground/80" />
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground/60">
                            integrations: <CountUpValue target={sampleProfile.agentMetrics.activeIntegrations} className="text-foreground/80" />
                          </span>
                        </div>
                      </>
                    )}
                    {!hasSampleEnrichment && dbSources.length > 0 && (
                      <StatusLine label="connected sources" value={String(dbSources.length)} color="text-accent" />
                    )}
                    {!hasSampleEnrichment && dbVerifications.length > 0 && (
                      <div className="pt-1">
                        <VerifiedBadge
                          methods={dbVerifications.map((v: any) => v.signal_type)}
                          level={dbVerifications.length >= 3 ? "high" : dbVerifications.length >= 2 ? "medium" : "basic"}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>

                <Divider />

                {/* ═══ IDENTITY ═══ */}
                <motion.div {...delay(1)}>
                  <SectionHeader>identity</SectionHeader>
                  {bio && <p className="text-foreground/90 font-body text-[14px] leading-[1.7] mb-4">{bio}</p>}
                  {topics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {topics.map((t) => (
                        <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded border border-accent/20 text-accent/70">{t}</span>
                      ))}
                    </div>
                  )}
                  {credibility.length > 0 && (
                    <div className="mt-3 space-y-0.5">
                      {credibility.map((c) => (
                        <p key={c} className="text-muted-foreground/70 font-mono text-[10px]">› {c}</p>
                      ))}
                    </div>
                  )}
                </motion.div>

                {nowItems.length > 0 && (
                  <>
                    <Divider />
                    <motion.div {...delay(2)}>
                      <SectionHeader>current activity</SectionHeader>
                      <div className="mb-4">
                        <p className="text-muted-foreground/60 font-mono text-[10px] mb-2">now:</p>
                        {nowItems.map((item) => (
                          <p key={item} className="text-foreground/80 font-mono text-[12px]">- {item}</p>
                        ))}
                      </div>
                      {hasSampleEnrichment && sampleProfile && (
                        <>
                          <div className="mb-4">
                            <p className="text-muted-foreground/60 font-mono text-[10px] mb-2">recent changes:</p>
                            {sampleProfile.recentChanges.map((c) => (
                              <p key={c} className="text-foreground/75 font-mono text-[11px]">- {c}</p>
                            ))}
                          </div>
                          <div>
                            <p className="text-muted-foreground/60 font-mono text-[10px] mb-2">timeline:</p>
                            <ActivityTimeline items={sampleProfile.activity} />
                          </div>
                        </>
                      )}
                    </motion.div>
                  </>
                )}

                {/* ═══ CONNECTED SOURCES ═══ */}
                <Divider />
                <motion.div {...delay(3)}>
                  <SectionHeader>connected sources</SectionHeader>
                  {hasSampleEnrichment && sampleProfile ? (
                    <ConnectedSourcesList sources={sampleProfile.connectedSources} />
                  ) : (
                    <DbSourcesList sources={dbSources} />
                  )}
                </motion.div>

                {/* ═══ DB FRESHNESS (for non-sample profiles) ═══ */}
                {!hasSampleEnrichment && dbSources.length > 0 && (() => {
                  const dim = computeDimensionFreshness(dbSources);
                  const fl = freshnessLabel(dim.score);
                  return (
                    <>
                      <Divider />
                      <motion.div {...delay(4)}>
                        <SectionHeader>freshness</SectionHeader>
                        <div className="space-y-1.5 mb-3">
                          <StatusLine label="identity" value={dim.identity} color={stateColor(dim.identity)} />
                          <StatusLine label="projects" value={dim.projects} color={stateColor(dim.projects)} />
                          <StatusLine label="voice" value={dim.voice} color={stateColor(dim.voice)} />
                          <StatusLine label="sources" value={dim.sources} color={stateColor(dim.sources)} />
                        </div>
                        <FreshnessScore score={dim.score} />
                      </motion.div>
                    </>
                  );
                })()}

                {/* ═══ DB VERIFICATION SIGNALS ═══ */}
                {!hasSampleEnrichment && dbVerifications.length > 0 && (
                  <>
                    <Divider />
                    <motion.div {...delay(4.5)}>
                      <SectionHeader>verification signals</SectionHeader>
                      <div className="space-y-1.5">
                        {dbVerifications.map((v: any) => (
                          <div key={v.id} className="flex items-center gap-2 py-1">
                            <span className="text-success font-mono text-[11px]">✓</span>
                            <span className="text-foreground/80 font-mono text-[11px]">{v.signal_type}</span>
                            {v.signal_value && <span className="text-muted-foreground/50 font-mono text-[9px]">{v.signal_value}</span>}
                            {v.verified_at && (
                              <span className="text-muted-foreground/40 font-mono text-[9px] ml-auto">
                                {new Date(v.verified_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}


                {hasSampleEnrichment && sampleProfile && (
                  <>
                    <Divider />
                    <motion.div {...delay(4)}>
                      <SectionHeader>freshness</SectionHeader>
                      <div className="space-y-1.5 mb-3">
                        <StatusLine label="identity" value={sampleProfile.freshness.identity} color={stateColor(sampleProfile.freshness.identity)} />
                        <StatusLine label="projects" value={sampleProfile.freshness.projects} color={stateColor(sampleProfile.freshness.projects)} />
                        <StatusLine label="voice" value={sampleProfile.freshness.voice} color={stateColor(sampleProfile.freshness.voice)} />
                        <StatusLine label="sources" value={sampleProfile.freshness.sources} color={stateColor(sampleProfile.freshness.sources)} />
                      </div>
                      <FreshnessScore score={sampleProfile.freshness.score} />
                    </motion.div>

                    <Divider />
                    <motion.div {...delay(5)}>
                      <SectionHeader>maintenance</SectionHeader>
                      <div className="space-y-1.5">
                        <StatusLine label="human edits" value={sampleProfile.maintenance.humanEdits ? "enabled" : "disabled"} color={sampleProfile.maintenance.humanEdits ? "text-success" : "text-muted-foreground/60"} />
                        <StatusLine label="agent maintenance" value={sampleProfile.maintenance.agentMaintenance ? "active" : "inactive"} color={sampleProfile.maintenance.agentMaintenance ? "text-success" : "text-muted-foreground/60"} />
                        <StatusLine label="update mode" value={sampleProfile.maintenance.updateMode} />
                      </div>
                      <div className="mt-3">
                        <p className="text-muted-foreground/60 font-mono text-[10px] mb-1.5">active maintainers:</p>
                        {sampleProfile.maintenance.activeMaintainers.map((m) => (
                          <p key={m} className="text-foreground/75 font-mono text-[11px]">- {m}</p>
                        ))}
                      </div>
                    </motion.div>

                    <Divider />
                    <motion.div {...delay(6)}>
                      <SectionHeader>agent network</SectionHeader>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                        <div>
                          <p className="text-foreground font-mono text-[18px] font-medium"><CountUpValue target={sampleProfile.agentMetrics.totalReads} /></p>
                          <p className="text-muted-foreground/60 font-mono text-[9px]">total reads</p>
                        </div>
                        <div>
                          <p className="text-accent font-mono text-[18px] font-medium"><CountUpValue target={sampleProfile.agentMetrics.recentReads24h} prefix="+" /></p>
                          <p className="text-muted-foreground/60 font-mono text-[9px]">reads (24h)</p>
                        </div>
                        <div>
                          <p className="text-foreground font-mono text-[18px] font-medium"><CountUpValue target={sampleProfile.agentMetrics.connectedAgentsCount} /></p>
                          <p className="text-muted-foreground/60 font-mono text-[9px]">connected agents</p>
                        </div>
                        <div>
                          <p className="text-success font-mono text-[18px] font-medium"><CountUpValue target={sampleProfile.agentMetrics.verifiedAgents} /></p>
                          <p className="text-muted-foreground/60 font-mono text-[9px]">verified agents</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground/50 font-mono text-[10px] mb-2">recent connections:</p>
                      <AgentConnectionsList connections={sampleProfile.agentConnections} />
                    </motion.div>

                    <Divider />
                    <motion.div {...delay(7)}>
                      <SectionHeader>identity state</SectionHeader>
                      <div className="space-y-1.5">
                        <StatusLine label="memory coverage" value={sampleProfile.identityState.memoryCoverage} color={stateColor(sampleProfile.identityState.memoryCoverage)} />
                        <StatusLine label="voice profile" value={sampleProfile.identityState.voiceProfile} color={stateColor(sampleProfile.identityState.voiceProfile)} />
                        <StatusLine label="context freshness" value={sampleProfile.identityState.contextFreshness} color={stateColor(sampleProfile.identityState.contextFreshness)} />
                        <StatusLine label="last pipeline run" value={sampleProfile.identityState.lastPipelineRun} />
                        <StatusLine label="sources synced" value={String(sampleProfile.identityState.sourcesSynced)} />
                        <StatusLine label="context score" value={`${sampleProfile.agentMetrics.contextScore}/100`} color="text-accent font-medium" />
                      </div>
                    </motion.div>

                    <Divider />
                    <motion.div {...delay(8)}>
                      <SectionHeader>projects</SectionHeader>
                      <div className="grid gap-3">
                        {sampleProfile.projects.map((p) => (
                          <ProjectCard key={p.name} project={p} />
                        ))}
                      </div>
                    </motion.div>

                    <Divider />
                    <motion.div {...delay(9)}>
                      <SectionHeader>access layers</SectionHeader>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-muted-foreground/60 font-mono text-[10px] mb-2">public:</p>
                          {sampleProfile.publicSections.map((s) => (
                            <p key={s} className="text-foreground/75 font-mono text-[11px]">- {s}</p>
                          ))}
                        </div>
                        <div>
                          <p className="text-muted-foreground/60 font-mono text-[10px] mb-2">private (scoped access):</p>
                          {sampleProfile.privateSections.map((s) => (
                            <p key={s} className="text-muted-foreground/50 font-mono text-[11px]">- {s}</p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}

                {/* ═══ FOR AGENTS ═══ */}
                <Divider />
                <motion.div {...delay(10)}>
                  <SectionHeader>for agents</SectionHeader>
                  <div className="terminal-panel p-4 space-y-2">
                    <p className="font-mono text-[11px] text-muted-foreground/60">start here:</p>
                    <p className="font-mono text-[11px] text-accent">GET /api/v1/profiles/{username}</p>
                    <p className="font-mono text-[10px] text-muted-foreground/60 mt-3">preferred retrieval order:</p>
                    <p className="font-mono text-[11px] text-foreground/75">1. you.json</p>
                    <p className="font-mono text-[11px] text-foreground/75">2. manifest.json</p>
                    <p className="font-mono text-[11px] text-foreground/75">3. you.md</p>
                    <p className="font-mono text-[11px] text-foreground/75">4. analysis/*</p>
                    {voice && (
                      <>
                        <p className="font-mono text-[10px] text-muted-foreground/60 mt-3">voice:</p>
                        <p className="font-mono text-[11px] text-foreground/75">{voice}</p>
                      </>
                    )}
                    {preferences.tone && (
                      <>
                        <p className="font-mono text-[10px] text-muted-foreground/60 mt-3">tone:</p>
                        <p className="font-mono text-[11px] text-foreground/75">{preferences.tone}</p>
                      </>
                    )}
                    {preferences.avoid?.length > 0 && (
                      <>
                        <p className="font-mono text-[10px] text-muted-foreground/60 mt-3">avoid:</p>
                        <p className="font-mono text-[11px] text-foreground/75">{Array.isArray(preferences.avoid) ? preferences.avoid.join(", ") : preferences.avoid}</p>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* ═══ LINKS ═══ */}
                {links.length > 0 && (
                  <>
                    <Divider />
                    <motion.div {...delay(11)}>
                      <div className="flex flex-wrap gap-3 mb-6">
                        {links.map((link: any) => (
                          <a key={link.label || link.url} href={link.url}
                            className="inline-flex items-center gap-1.5 text-accent/80 hover:text-accent font-mono text-[11px] transition-colors border border-border rounded px-3 py-1.5 hover:border-accent/30">
                            {link.label || link.url}
                            <ExternalLink size={9} />
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}

                {/* ═══ VALUES ═══ */}
                {valuesList.length > 0 && (
                  <motion.div {...delay(12)}>
                    <div className="space-y-1 mb-16">
                      {valuesList.map((v) => (
                        <p key={v} className="text-muted-foreground/60 font-mono text-[11px]">› {v}</p>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Footer */}
                <motion.div {...delay(13)} className="text-center space-y-2">
                  <p className="text-muted-foreground/50 font-mono text-[9px] italic">
                    Updated by the human. Maintained by the system. Verified by connected systems.
                  </p>
                  <p className="text-muted-foreground/50 font-mono text-[10px]">
                    Powered by <Link to="/" className="text-accent/60 hover:text-accent transition-colors">you.md</Link>
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <Link to="/create" className="text-muted-foreground/40 font-mono text-[10px] hover:text-accent/70 transition-colors">&gt; create yours</Link>
                    {dbProfile && (
                      <ReportDialog profileId={dbProfile.id}>
                        <button className="font-mono text-[10px] text-muted-foreground/30 hover:text-destructive transition-colors flex items-center gap-1">
                          <Flag size={9} /> report
                        </button>
                      </ReportDialog>
                    )}
                  </div>
                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
