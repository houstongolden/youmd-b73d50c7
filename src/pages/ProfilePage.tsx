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
    }, 12);
    return () => clearInterval(interval);
  }, [inView, totalChars]);

  const fullText = lines.join("\n");
  const visibleText = fullText.slice(0, visibleChars);
  const visibleLines = visibleText.split("\n");

  const renderLine = (line: string) => {
    if (line === "---") return <span className="text-mist/20">{line}</span>;
    if (line === "") return <span>&nbsp;</span>;
    if (line.startsWith("# ")) return <span className="text-green font-medium">{line}</span>;
    if (line.startsWith("## ")) return <span className="text-cyan/70">{line}</span>;
    if (line.startsWith("- **")) {
      const match = line.match(/^- \*\*(.+?)\*\*(.*)$/);
      if (match) return <><span className="text-amber/80">- <strong>{match[1]}</strong></span><span className="text-mist/60">{match[2]}</span></>;
    }
    if (line.startsWith("- ")) return <span className="text-foreground/60">{line}</span>;
    if (line.startsWith("> ")) return <span className="text-mist/30 italic">{line}</span>;
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0 && colonIdx < 20) {
      const key = line.slice(0, colonIdx);
      const val = line.slice(colonIdx);
      return <><span className="text-amber/70">{key}</span><span className="text-mist/50">{val}</span></>;
    }
    return <span className="text-foreground/60">{line}</span>;
  };

  return (
    <pre className="font-mono text-[11px] md:text-[12px] leading-[1.9] whitespace-pre-wrap">
      <code>
        {visibleLines.map((line, i) => (
          <div key={i}>{renderLine(line)}</div>
        ))}
        {visibleChars < totalChars && <span className="cursor-blink text-green">▌</span>}
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
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-red text-[11px] font-mono mb-2">ERROR 404</p>
          <h1 className="text-foreground text-xl font-mono font-light mb-3">Profile not found</h1>
          <p className="text-mist text-[12px] mb-6">This you.md username doesn't exist yet.</p>
          <Link to="/profiles" className="cta-green px-5 py-2 text-[11px] inline-block">
            $ ls /profiles
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen relative">
      {/* Beam glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[600px] beam-glow pointer-events-none" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:pt-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-6 px-4 py-2 glass-scrolled rounded-lg">
          <Link to="/" className="text-green font-mono text-[13px] font-medium">
            <span className="text-mist/30">~/</span>you.md
          </Link>
          <Link to="/profiles" className="text-mist/50 text-[11px] font-mono hover:text-mist transition-colors">
            /profiles
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-20 px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Back */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/profiles"
              className="inline-flex items-center gap-1.5 text-mist/40 text-[11px] font-mono hover:text-mist transition-colors mb-10"
            >
              <ArrowLeft size={11} /> cd ../profiles
            </Link>
          </motion.div>

          {/* Identity */}
          <motion.div
            className="relative mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-foreground text-xl md:text-2xl font-mono font-medium tracking-tight leading-tight">
              {profile.name}
            </h1>
            <p className="text-green/80 text-[12px] font-mono mt-1">{profile.tagline}</p>
            <div className="flex items-center gap-1 mt-2 text-mist/40 text-[11px] font-mono">
              <MapPin size={10} />
              <span>{profile.location}</span>
            </div>
          </motion.div>

          {/* URL */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6"
          >
            <button
              onClick={handleCopy}
              className="terminal-panel px-4 py-2 flex items-center gap-3 group hover:border-green/30 transition-all rounded-lg"
            >
              <span className="font-mono text-[11px] text-mist/50">
                <span className="text-green">you.md</span>/{profile.username}
              </span>
              <span className="text-mist/20 group-hover:text-mist/50 transition-colors ml-auto">
                {copied ? <Check size={12} className="text-green" /> : <Copy size={12} />}
              </span>
            </button>
          </motion.div>

          {/* Bio */}
          <motion.p
            className="text-mist text-[12px] leading-relaxed mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            {profile.bio.medium}
          </motion.p>

          {/* Topics */}
          <motion.div
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {profile.topics.map((topic) => (
              <span
                key={topic}
                className="text-[10px] font-mono px-2.5 py-1 rounded border border-cyan/15 text-cyan/60 bg-cyan/5"
              >
                {topic}
              </span>
            ))}
          </motion.div>

          {/* Credibility */}
          <motion.div
            className="flex flex-col gap-1 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.33 }}
          >
            {profile.credibility.map((c) => (
              <p key={c} className="text-amber/50 text-[10px] font-mono">↗ {c}</p>
            ))}
          </motion.div>

          {/* Code block */}
          <motion.div
            ref={codeRef}
            className="terminal-panel mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <div className="terminal-panel-header">
              <div className="terminal-dot" />
              <div className="terminal-dot" />
              <div className="terminal-dot" />
              <span className="ml-2 text-mist/30 text-[10px] font-mono">{profile.username}.md</span>
            </div>
            <div className="p-5 md:p-6">
              <TypewriterBlock lines={codeLines} inView={inView} />
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            className="flex flex-wrap gap-2 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            {profile.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                className="inline-flex items-center gap-1.5 text-[10px] font-mono text-mist/40 hover:text-green transition-colors border border-border rounded px-3 py-1.5 hover:border-green/30"
              >
                {link.label}
                <ExternalLink size={9} />
              </a>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center pt-6 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/" className="text-mist/20 text-[10px] font-mono hover:text-mist/40 transition-colors">
              powered by <span className="text-green/40">you.md</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
