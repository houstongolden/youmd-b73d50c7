import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, ExternalLink, Copy, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { sampleProfiles } from "@/data/sampleProfiles";

const TypewriterBlock = ({ lines, inView }: { lines: string[]; inView: boolean }) => {
  const [visibleChars, setVisibleChars] = useState(0);
  const totalChars = lines.join("\n").length;

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const interval = setInterval(() => {
      current += 3;
      if (current >= totalChars) {
        setVisibleChars(totalChars);
        clearInterval(interval);
      } else {
        setVisibleChars(current);
      }
    }, 14);
    return () => clearInterval(interval);
  }, [inView, totalChars]);

  const fullText = lines.join("\n");
  const visibleText = fullText.slice(0, visibleChars);
  const visibleLines = visibleText.split("\n");

  const renderLine = (line: string) => {
    if (line.startsWith("# ")) return <span className="text-coral font-medium">{line}</span>;
    if (line.startsWith("## ")) return <span className="text-light/60 font-medium">{line}</span>;
    if (line.startsWith("- **")) {
      const match = line.match(/^- \*\*(.+?)\*\*(.*)$/);
      if (match) return <><span className="text-gold">- <strong>{match[1]}</strong></span><span className="text-mist">{match[2]}</span></>;
    }
    if (line.startsWith("- ")) return <span className="text-mist">{line}</span>;
    if (line.startsWith("> ")) return <span className="text-mist/50 italic">{line}</span>;
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0 && colonIdx < 20) {
      const key = line.slice(0, colonIdx);
      const val = line.slice(colonIdx);
      return <><span className="text-sky">{key}</span><span className="text-mist/40">{val}</span></>;
    }
    return <span className="text-light/80">{line}</span>;
  };

  return (
    <pre className="font-mono text-[12px] md:text-[13px] leading-[1.9] whitespace-pre-wrap">
      <code>
        {visibleLines.map((line, i) => (
          <div key={i}>{renderLine(line)}</div>
        ))}
        {visibleChars < totalChars && <span className="cursor-blink text-coral">▌</span>}
      </code>
    </pre>
  );
};

const ProfilePage = () => {
  const { username } = useParams();
  const profile = sampleProfiles.find((p) => p.username === username);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);
  const inView = useInView(codeRef, { once: true, margin: "-50px" });

  if (!profile) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-light text-2xl font-display font-light mb-3">Profile not found</h1>
          <p className="text-mist text-sm mb-6">This you.md username doesn't exist yet.</p>
          <Link to="/profiles" className="cta-coral px-6 py-2.5 text-sm inline-block">
            Browse profiles
          </Link>
        </div>
      </div>
    );
  }

  // Build you.md content
  const codeLines = [
    "---",
    "schema: you-md/v1",
    `name: ${profile.name}`,
    `username: ${profile.username}`,
    "---",
    "",
    `# ${profile.name}`,
    "",
    profile.tagline,
    "",
    "## Now",
    "",
    ...profile.now.map((n) => `- ${n}`),
    "",
    "## Projects",
    "",
    ...profile.projects.map((p) => `- **${p.name}** — ${p.description} (${p.role}, ${p.status})`),
    "",
    "## Values",
    "",
    ...profile.values.map((v) => `- ${v}`),
    "",
    "## Agent Preferences",
    "",
    `Tone: ${profile.preferences.tone}`,
    `Avoid: ${profile.preferences.avoid.join(", ")}`,
    `Format: ${profile.preferences.format}`,
    "",
    "## Links",
    "",
    ...profile.links.map((l) => `- ${l.label}: ${l.url}`),
    "",
    "---",
    "",
    "> Full context: see manifest.json",
  ];

  const profileUrl = `you.md/${profile.username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      {/* Beam of light motif */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[800px] beam-glow pointer-events-none" />

      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3 md:pt-4">
        <div className="rounded-full flex items-center justify-between gap-6 px-5 py-2 w-full max-w-2xl glass-card-dark">
          <Link to="/" className="text-light font-mono text-[14px] font-medium tracking-tight">
            you.md
          </Link>
          <Link
            to="/profiles"
            className="text-mist text-[11px] uppercase tracking-[0.08em] font-medium hover:text-light transition-colors"
          >
            Directory
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-20 px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/profiles"
              className="inline-flex items-center gap-1.5 text-mist text-[12px] hover:text-light transition-colors mb-10"
            >
              <ArrowLeft size={12} /> All profiles
            </Link>
          </motion.div>

          {/* Identity section with subtle beam glow behind */}
          <motion.div
            className="relative mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Subtle glow behind identity */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[150px] h-[120px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

            <h1 className="text-light text-2xl md:text-3xl font-display font-medium tracking-tight leading-tight relative">
              {profile.name}
            </h1>
            <p className="text-coral text-[14px] mt-1.5 font-medium">{profile.tagline}</p>
            <div className="flex items-center gap-1 mt-2 text-mist/60 text-[12px]">
              <MapPin size={11} />
              <span>{profile.location}</span>
            </div>
          </motion.div>

          {/* URL bar — monospace, mimics terminal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <button
              onClick={handleCopy}
              className="glass-card-dark rounded-full px-5 py-2.5 flex items-center gap-3 w-full md:w-auto group hover:border-coral/30 transition-all"
            >
              <span className="font-mono text-[12px] text-mist/60">
                <span className="text-coral">you.md</span>/{profile.username}
              </span>
              <span className="text-mist/30 group-hover:text-mist/60 transition-colors ml-auto md:ml-2">
                {copied ? <Check size={13} className="text-coral" /> : <Copy size={13} />}
              </span>
            </button>
          </motion.div>

          {/* Bio */}
          <motion.p
            className="text-ether/80 text-[14px] leading-relaxed mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {profile.bio.medium}
          </motion.p>

          {/* Topics */}
          <motion.div
            className="flex flex-wrap gap-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {profile.topics.map((topic) => (
              <span
                key={topic}
                className="text-[11px] font-mono px-3 py-1 rounded-full bg-sky/10 text-sky border border-sky/15"
              >
                {topic}
              </span>
            ))}
          </motion.div>

          {/* Credibility signals */}
          <motion.div
            className="flex flex-col gap-1.5 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.33 }}
          >
            {profile.credibility.map((c) => (
              <p key={c} className="text-gold/70 text-[12px] font-mono">↗ {c}</p>
            ))}
          </motion.div>

          {/* Code block — the you.md file */}
          <motion.div
            ref={codeRef}
            className="glass-card-dark rounded-2xl p-6 md:p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <div className="flex items-center gap-1.5 mb-5 pb-4 border-b border-mist/10">
              <div className="w-[7px] h-[7px] rounded-full bg-mist/15" />
              <div className="w-[7px] h-[7px] rounded-full bg-mist/15" />
              <div className="w-[7px] h-[7px] rounded-full bg-mist/15" />
              <span className="ml-3 text-mist/30 text-[11px] font-mono">{profile.username}.md</span>
            </div>
            <TypewriterBlock lines={codeLines} inView={inView} />
          </motion.div>

          {/* Links */}
          <motion.div
            className="flex flex-wrap gap-3 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            {profile.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                className="inline-flex items-center gap-1.5 text-[12px] text-mist/50 hover:text-coral transition-colors border border-mist/15 rounded-full px-4 py-1.5 hover:border-coral/30"
              >
                {link.label}
                <ExternalLink size={10} />
              </a>
            ))}
          </motion.div>

          {/* Powered by footer */}
          <motion.div
            className="text-center pt-8 border-t border-mist/8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/" className="text-mist/30 text-[11px] font-mono hover:text-mist/50 transition-colors">
              powered by <span className="text-coral/50">you.md</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
