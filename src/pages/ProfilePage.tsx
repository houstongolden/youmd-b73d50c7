import { useParams, Link } from "react-router-dom";
import { MapPin, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { sampleProfiles } from "@/data/sampleProfiles";

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
      {/* Minimal nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:pt-4">
        <div className="max-w-[640px] mx-auto flex items-center justify-between px-4 py-2 glass-nav rounded">
          <Link to="/" className="text-accent font-mono text-[12px]">you.md</Link>
          <Link to="/profiles" className="text-muted-foreground/40 font-mono text-[10px] hover:text-accent transition-colors">/profiles</Link>
        </div>
      </nav>

      {/* Profile content — narrow column, terminal output feel */}
      <div className="pt-20 pb-20 px-6">
        <div className="max-w-[640px] mx-auto">

          {/* Name + tagline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-foreground font-mono text-xl md:text-2xl font-medium tracking-tight">
              {profile.name}
            </h1>
            <p className="text-muted-foreground font-body text-[13px] mt-1">{profile.tagline}</p>
            <div className="flex items-center gap-4 mt-3">
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

          <div className="section-divider mb-8" />

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <p className="text-foreground/80 font-body text-[13px] leading-[1.7]">
              {profile.bio.medium}
            </p>
          </motion.div>

          {/* NOW */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <h2 className="text-accent font-mono text-[12px] uppercase tracking-wider mb-3">## Now</h2>
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
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-accent font-mono text-[12px] uppercase tracking-wider mb-3">## Projects</h2>
            <div className="space-y-3">
              {profile.projects.map((p) => (
                <div key={p.name}>
                  <div className="flex items-baseline gap-2">
                    <span className="text-foreground font-mono text-[12px] font-medium">{p.name}</span>
                    <span className="text-muted-foreground/40 font-mono text-[10px]">{p.role}</span>
                    <span className={`font-mono text-[9px] ${p.status === 'active' ? 'text-success' : 'text-accent/50'}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-body text-[12px] mt-0.5">{p.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* VALUES */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <h2 className="text-accent font-mono text-[12px] uppercase tracking-wider mb-3">## Values</h2>
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
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-accent font-mono text-[12px] uppercase tracking-wider mb-3">## Agent Preferences</h2>
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

          <div className="section-divider mb-8" />

          {/* LINKS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mb-16"
          >
            <div className="space-y-1.5">
              {profile.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  className="flex items-center gap-2 text-accent/70 hover:text-accent font-mono text-[12px] transition-colors group"
                >
                  {link.label}
                  <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
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
