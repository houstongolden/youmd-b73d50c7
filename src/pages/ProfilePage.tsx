import { useParams, Link } from "react-router-dom";
import { MapPin, ExternalLink, Copy, Check, Star, ArrowUpRight, Shield } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { sampleProfiles, type ActivityItem, type Project, type AgentConnection } from "@/data/sampleProfiles";

const statusColor = (status: string) => {
  switch (status) {
    case "active": return "text-success";
    case "building": return "text-accent";
    case "publishing": return "text-accent-mid";
    case "launching": return "text-accent-light";
    case "shipped": return "text-success";
    default: return "text-muted-foreground";
  }
};

const stateColor = (state: string) => {
  switch (state) {
    case "high": case "trained": case "current": return "text-success";
    case "medium": case "partial": case "stale": return "text-accent";
    case "low": case "untrained": case "outdated": return "text-destructive";
    default: return "text-muted-foreground";
  }
};

const actionIcon = (action: string) => {
  switch (action) {
    case "published": return "↑";
    case "connected": return "⊕";
    case "updated": return "△";
    case "initialized": return "●";
    case "agent_read": return "◇";
    default: return "·";
  }
};

const SectionHeader = ({ children }: { children: string }) => (
  <h2 className="text-accent font-mono text-[11px] uppercase tracking-wider mb-4">&gt; {children}</h2>
);

const Divider = () => <div className="section-divider my-8" />;

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
        <span className="text-muted-foreground/50 font-mono text-[10px]">{project.role}</span>
      </div>
      {project.url && (
        <a href={project.url} className="text-muted-foreground/20 group-hover:text-accent transition-colors">
          <ArrowUpRight size={14} />
        </a>
      )}
    </div>
    <p className="text-muted-foreground font-body text-[12px] leading-relaxed mb-3">{project.description}</p>
    <div className="flex items-center gap-4">
      {project.stars && (
        <span className="flex items-center gap-1 text-muted-foreground/50 font-mono text-[10px]">
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
        <span className="text-foreground/70 font-mono text-[11px]">- {agent.name}</span>
        <span className="text-muted-foreground/30 font-mono text-[9px]">{agent.lastAccess}</span>
      </div>
    ))}
  </div>
);

const ActivityTimeline = ({ items }: { items: ActivityItem[] }) => (
  <div className="space-y-0">
    {items.map((item, i) => (
      <div key={i} className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0">
        <span className="text-accent/50 font-mono text-[11px] mt-0.5 w-4 text-center shrink-0">
          {actionIcon(item.action)}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-foreground/70 font-mono text-[11px] truncate">{item.detail}</p>
        </div>
        <span className="text-muted-foreground/30 font-mono text-[9px] shrink-0">
          {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
    ))}
  </div>
);

const ProfilePage = () => {
  const { username } = useParams();
  const profile = sampleProfiles.find((p) => p.username === username);
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:pt-4">
        <div className="max-w-[680px] mx-auto flex items-center justify-between px-4 py-2 glass-nav rounded">
          <Link to="/" className="text-accent font-mono text-[12px]">you.md</Link>
          <Link to="/profiles" className="text-muted-foreground/40 font-mono text-[10px] hover:text-accent transition-colors">/profiles</Link>
        </div>
      </nav>

      {/* Cover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-[160px] md:h-[200px] overflow-hidden"
      >
        <img src={profile.coverUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
      </motion.div>

      {/* Content */}
      <div className="px-6 pb-20 relative z-10">
        <div className="max-w-[680px] mx-auto">

          {/* ═══ SYSTEM HEADER ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="-mt-10 mb-6"
          >
            <div className="flex items-end gap-4 mb-4">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded border-2 border-background object-cover"
                loading="lazy"
              />
              <div className="pb-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-foreground font-mono text-lg md:text-xl font-medium tracking-tight truncate">
                    {profile.name}
                  </h1>
                  {profile.verification.verified && (
                    <Shield size={14} className="text-success shrink-0" />
                  )}
                </div>
                <p className="text-muted-foreground font-body text-[12px] mt-0.5 truncate">{profile.tagline}</p>
              </div>
            </div>

            {/* System status block */}
            <div className="terminal-panel p-4 space-y-1">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-accent font-mono text-[12px] hover:text-accent-light transition-colors"
                >
                  you.md/{profile.username}
                  {copied ? <Check size={10} className="text-success" /> : <Copy size={10} />}
                </button>
                <span className="font-mono text-[10px] text-success uppercase tracking-wider">● active</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground/40 font-mono text-[10px]">
                <MapPin size={9} />
                <span>{profile.location}</span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground/40">
                last updated: {profile.lastUpdated}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground/40">
                maintained by: {profile.maintainedBy.join(" + ")}
              </p>
              {profile.verification.verified && (
                <p className="font-mono text-[10px] text-muted-foreground/40">
                  verification: <span className="text-success">VERIFIED</span> ({profile.verification.methods.join(" + ")})
                </p>
              )}
            </div>
          </motion.div>

          <Divider />

          {/* ═══ AGENT ACTIVITY ═══ */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <SectionHeader>agent activity</SectionHeader>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div>
                <p className="text-foreground font-mono text-[18px] font-medium">
                  {profile.agentMetrics.totalReads.toLocaleString()}
                </p>
                <p className="text-muted-foreground/40 font-mono text-[9px]">agent reads</p>
              </div>
              <div>
                <p className="text-foreground font-mono text-[18px] font-medium">
                  {profile.agentMetrics.activeIntegrations}
                </p>
                <p className="text-muted-foreground/40 font-mono text-[9px]">integrations</p>
              </div>
              <div>
                <p className="text-accent font-mono text-[18px] font-medium">
                  +{profile.agentMetrics.recentReads24h}
                </p>
                <p className="text-muted-foreground/40 font-mono text-[9px]">reads (24h)</p>
              </div>
            </div>

            <p className="text-muted-foreground/30 font-mono text-[10px] mb-2">active connections:</p>
            <AgentConnectionsList connections={profile.agentConnections} />
          </motion.div>

          <Divider />

          {/* ═══ IDENTITY STATE ═══ */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <SectionHeader>identity state</SectionHeader>
            <div className="space-y-1.5">
              <p className="font-mono text-[11px]">
                <span className="text-muted-foreground/50">memory coverage:</span>{" "}
                <span className={stateColor(profile.identityState.memoryCoverage)}>{profile.identityState.memoryCoverage}</span>
              </p>
              <p className="font-mono text-[11px]">
                <span className="text-muted-foreground/50">voice profile:</span>{" "}
                <span className={stateColor(profile.identityState.voiceProfile)}>{profile.identityState.voiceProfile}</span>
              </p>
              <p className="font-mono text-[11px]">
                <span className="text-muted-foreground/50">context freshness:</span>{" "}
                <span className={stateColor(profile.identityState.contextFreshness)}>{profile.identityState.contextFreshness}</span>
              </p>
              <p className="font-mono text-[11px]">
                <span className="text-muted-foreground/50">last pipeline run:</span>{" "}
                <span className="text-foreground/60">{profile.identityState.lastPipelineRun}</span>
              </p>
              <p className="font-mono text-[11px]">
                <span className="text-muted-foreground/50">sources synced:</span>{" "}
                <span className="text-foreground/60">{profile.identityState.sourcesSynced}</span>
              </p>
              <p className="font-mono text-[11px]">
                <span className="text-muted-foreground/50">context score:</span>{" "}
                <span className="text-accent font-medium">{profile.agentMetrics.contextScore}/100</span>
              </p>
            </div>
          </motion.div>

          <Divider />

          {/* ═══ IDENTITY ═══ */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <SectionHeader>identity</SectionHeader>
            <p className="text-foreground/80 font-body text-[14px] leading-[1.7] mb-4">
              {profile.bio.medium}
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.topics.map((topic) => (
                <span key={topic} className="font-mono text-[10px] px-2 py-0.5 rounded border border-accent/10 text-accent/40">
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>

          <Divider />

          {/* ═══ CURRENT ACTIVITY ═══ */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <SectionHeader>current activity</SectionHeader>
            <div className="mb-4">
              <p className="text-muted-foreground/40 font-mono text-[10px] mb-2">building:</p>
              {profile.now.map((item) => (
                <p key={item} className="text-foreground/70 font-mono text-[12px]">- {item}</p>
              ))}
            </div>
            <div>
              <p className="text-muted-foreground/40 font-mono text-[10px] mb-2">recent updates:</p>
              <ActivityTimeline items={profile.activity} />
            </div>
          </motion.div>

          <Divider />

          {/* ═══ PROJECTS ═══ */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <SectionHeader>projects</SectionHeader>
            <div className="grid gap-3">
              {profile.projects.map((p) => (
                <ProjectCard key={p.name} project={p} />
              ))}
            </div>
          </motion.div>

          <Divider />

          {/* ═══ ACCESS LAYERS ═══ */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <SectionHeader>access</SectionHeader>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground/40 font-mono text-[10px] mb-2">public:</p>
                {profile.publicSections.map((s) => (
                  <p key={s} className="text-foreground/60 font-mono text-[11px]">- {s}</p>
                ))}
              </div>
              <div>
                <p className="text-muted-foreground/40 font-mono text-[10px] mb-2">private (scoped access):</p>
                {profile.privateSections.map((s) => (
                  <p key={s} className="text-muted-foreground/30 font-mono text-[11px]">- {s}</p>
                ))}
              </div>
            </div>
          </motion.div>

          <Divider />

          {/* ═══ FOR AGENTS ═══ */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <SectionHeader>for agents</SectionHeader>
            <div className="terminal-panel p-4 space-y-2">
              <p className="font-mono text-[11px]">
                <span className="text-muted-foreground/40">start here:</span>
              </p>
              <p className="font-mono text-[11px] text-accent">
                GET /api/v1/profiles/{profile.username}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground/40 mt-3">preferred:</p>
              <p className="font-mono text-[11px] text-foreground/60">- use you.json for structured context</p>
              <p className="font-mono text-[11px] text-foreground/60">- use analysis/ for deeper understanding</p>
              <p className="font-mono text-[10px] text-muted-foreground/40 mt-3">notes:</p>
              <p className="font-mono text-[11px] text-foreground/60">- tone: {profile.preferences.tone}</p>
              <p className="font-mono text-[11px] text-foreground/60">- avoid: {profile.preferences.avoid.join(", ")}</p>
            </div>
          </motion.div>

          <Divider />

          {/* ═══ TOP QUERIES ═══ */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.43 }}>
            <SectionHeader>common queries</SectionHeader>
            <div className="space-y-1">
              {profile.topQueries.map((q) => (
                <p key={q} className="font-mono text-[11px] text-muted-foreground/50">"{q}"</p>
              ))}
            </div>
          </motion.div>

          <Divider />

          {/* ═══ SHARE CONTEXT ═══ */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.46 }}>
            <SectionHeader>share context</SectionHeader>
            <div className="space-y-2">
              <p className="font-mono text-[11px] text-muted-foreground/50">generate a context link:</p>
              <p className="font-mono text-[12px] text-accent">$ youmd link create</p>
              <p className="font-mono text-[11px] text-muted-foreground/50 mt-2">or use:</p>
              <p className="font-mono text-[11px] text-foreground/60">https://you.md/ctx/{profile.username}/abc123</p>
            </div>
          </motion.div>

          <Divider />

          {/* ═══ LINKS ═══ */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.48 }}>
            <div className="flex flex-wrap gap-3 mb-6">
              {profile.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  className="inline-flex items-center gap-1.5 text-accent/60 hover:text-accent font-mono text-[11px] transition-colors border border-border rounded px-3 py-1.5 hover:border-accent/30"
                >
                  {link.label}
                  <ExternalLink size={9} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* ═══ VALUES ═══ */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <div className="space-y-1 mb-16">
              {profile.values.map((v) => (
                <p key={v} className="text-muted-foreground/40 font-mono text-[11px]">› {v}</p>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="text-center">
            <p className="text-muted-foreground/30 font-mono text-[10px] mb-2">
              Powered by <Link to="/" className="text-accent/40 hover:text-accent transition-colors">you.md</Link>
            </p>
            <Link
              to="/#get-started"
              className="text-muted-foreground/20 font-mono text-[10px] hover:text-accent/60 transition-colors"
            >
              &gt; claim yours
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
