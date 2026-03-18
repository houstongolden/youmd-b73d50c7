import { useParams, Link } from "react-router-dom";
import { MapPin, ExternalLink, Copy, Check, Star, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { sampleProfiles, type ActivityItem, type Project } from "@/data/sampleProfiles";

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

const actionIcon = (action: string) => {
  switch (action) {
    case "published": return "↑";
    case "connected": return "⊕";
    case "updated": return "△";
    case "initialized": return "●";
    default: return "·";
  }
};

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
        <span className="text-success font-mono text-[10px]">
          {project.mrr} MRR
        </span>
      )}
    </div>
  </div>
);

const ActivityTimeline = ({ items }: { items: ActivityItem[] }) => (
  <div className="space-y-0">
    {items.map((item, i) => (
      <div key={i} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
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

      {/* Cover image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-[180px] md:h-[220px] overflow-hidden"
      >
        <img
          src={profile.coverUrl}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
      </motion.div>

      {/* Profile content */}
      <div className="px-6 pb-20 relative z-10">
        <div className="max-w-[680px] mx-auto">

          {/* Avatar + name block */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="-mt-12 mb-8"
          >
            <div className="flex items-end gap-4 mb-4">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded border-2 border-background object-cover shadow-lg"
                loading="lazy"
              />
              <div className="pb-1">
                <h1 className="text-foreground font-mono text-xl md:text-2xl font-medium tracking-tight leading-tight">
                  {profile.name}
                </h1>
                <p className="text-muted-foreground font-body text-[13px] mt-0.5">{profile.tagline}</p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
              <span className="flex items-center gap-1 text-muted-foreground/50 font-mono text-[11px]">
                <MapPin size={10} />
                {profile.location}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-accent/60 hover:text-accent font-mono text-[11px] transition-colors"
              >
                you.md/{profile.username}
                {copied ? <Check size={10} className="text-success" /> : <Copy size={10} />}
              </button>
            </div>
          </motion.div>

          {/* Social proof metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex gap-6 mb-8 pb-8 border-b border-border"
          >
            {profile.socialProof.map((sp) => (
              <div key={sp.metric}>
                <p className="text-foreground font-mono text-[16px] font-medium">{sp.value}</p>
                <p className="text-muted-foreground/50 font-mono text-[10px]">{sp.metric}</p>
              </div>
            ))}
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <p className="text-foreground/80 font-body text-[14px] leading-[1.7]">
              {profile.bio.medium}
            </p>
          </motion.div>

          {/* NOW */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-accent font-mono text-[11px] uppercase tracking-wider mb-3">## Now</h2>
            <div className="space-y-1.5">
              {profile.now.map((item) => (
                <p key={item} className="text-foreground/70 font-mono text-[12px]">- {item}</p>
              ))}
            </div>
          </motion.div>

          {/* PROJECTS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <h2 className="text-accent font-mono text-[11px] uppercase tracking-wider mb-3">## Projects</h2>
            <div className="grid gap-3">
              {profile.projects.map((p) => (
                <ProjectCard key={p.name} project={p} />
              ))}
            </div>
          </motion.div>

          {/* VALUES */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-accent font-mono text-[11px] uppercase tracking-wider mb-3">## Values</h2>
            <div className="space-y-1.5">
              {profile.values.map((v) => (
                <p key={v} className="text-foreground/70 font-mono text-[12px]">- {v}</p>
              ))}
            </div>
          </motion.div>

          {/* AGENT PREFERENCES */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mb-8"
          >
            <h2 className="text-accent font-mono text-[11px] uppercase tracking-wider mb-3">## Agent Preferences</h2>
            <div className="space-y-1">
              <p className="font-mono text-[12px]">
                <span className="text-accent/60">Tone:</span>{" "}
                <span className="text-muted-foreground">{profile.preferences.tone}</span>
              </p>
              <p className="font-mono text-[12px]">
                <span className="text-accent/60">Avoid:</span>{" "}
                <span className="text-muted-foreground">{profile.preferences.avoid.join(", ")}</span>
              </p>
              <p className="font-mono text-[12px]">
                <span className="text-accent/60">Format:</span>{" "}
                <span className="text-muted-foreground">{profile.preferences.format}</span>
              </p>
            </div>
          </motion.div>

          {/* CREDIBILITY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.37 }}
            className="mb-8"
          >
            <h2 className="text-accent font-mono text-[11px] uppercase tracking-wider mb-3">## Credibility</h2>
            <div className="space-y-1">
              {profile.credibility.map((c) => (
                <p key={c} className="text-foreground/60 font-mono text-[12px]">› {c}</p>
              ))}
            </div>
          </motion.div>

          <div className="section-divider mb-8" />

          {/* ACTIVITY TIMELINE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-accent font-mono text-[11px] uppercase tracking-wider mb-3">## Activity</h2>
            <ActivityTimeline items={profile.activity} />
          </motion.div>

          <div className="section-divider mb-8" />

          {/* LINKS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-3">
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

          {/* TOPICS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.47 }}
            className="mb-16"
          >
            <div className="flex flex-wrap gap-2">
              {profile.topics.map((topic) => (
                <span
                  key={topic}
                  className="font-mono text-[10px] px-2.5 py-1 rounded border border-accent/10 text-accent/40"
                >
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
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
