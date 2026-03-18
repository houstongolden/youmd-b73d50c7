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
    if (line === "---") return <span className="text-muted-foreground/20">{line}</span>;
    if (line === "") return <span>&nbsp;</span>;
    if (line.startsWith("# ")) return <span className="text-accent font-medium">{line}</span>;
    if (line.startsWith("## ")) return <span className="text-accent-700">{line}</span>;
    if (line.startsWith("- **")) {
      const match = line.match(/^- \*\*(.+?)\*\*(.*)$/);
      if (match) return <><span className="text-accent/80">- <strong>{match[1]}</strong></span><span className="text-muted-foreground/60">{match[2]}</span></>;
    }
    if (line.startsWith("- ")) return <span className="text-foreground/60">{line}</span>;
    if (line.startsWith("> ")) return <span className="text-muted-foreground/30 italic">{line}</span>;
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0 && colonIdx < 20) {
      const key = line.slice(0, colonIdx);
      const val = line.slice(colonIdx);
      return <><span className="text-accent/70">{key}</span><span className="text-muted-foreground/50">{val}</span></>;
    }
    return <span className="text-foreground/60">{line}</span>;
  };

  return (
    <pre className="font-mono text-[11px] md:text-[12px] leading-[1.9] whitespace-pre-wrap">
      <code>
        {visibleLines.map((line, i) => (
          <div key={i}>{renderLine(line)}</div>
        ))}
        {visibleChars < totalChars && <span className="cursor-blink text-accent">█</span>}
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
          <p className="text-destructive text-[11px] font-mono mb-2">ERROR 404</p>
          <h1 className="text-foreground text-xl font-mono font-light mb-3">Profile not found</h1>
          <p className="text-muted-foreground text-[12px] mb-6">This you.md username doesn't exist yet.</p>
          <Link to="/profiles" className="cta-primary px-5 py-2 text-[11px] inline-block">
            &gt; ls /profiles
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[600px] beam-glow pointer-events-none" />

      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:pt-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-6 px-4 py-2 glass-nav rounded">
          <Link to="/" className="text-accent font-mono text-[13px] font-medium">
            you.md
          </Link>
          <Link to="/profiles" className="text-muted-foreground/50 text-[11px] font-mono hover:text-accent transition-colors">
            /profiles
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-20 px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/profiles"
              className="inline-flex items-center gap-1.5 text-muted-foreground/40 text-[11px] font-mono hover:text-accent transition-colors mb-10"
            >
              <ArrowLeft size={11} /> &gt; cd ../profiles
            </Link>
          </motion.div>

          <motion.div
            className="relative mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-foreground text-xl md:text-2xl font-mono font-medium tracking-tight leading-tight">
              {profile.name}
            </h1>
            <p className="text-accent/80 text-[12px] font-mono mt-1">{profile.tagline}</p>
            <div className="flex items-center gap-1 mt-2 text-muted-foreground/40 text-[11px] font-mono">
              <MapPin size={10} />
              <span>{profile.location}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6"
          >
            <button
              onClick={handleCopy}
              className="terminal-panel px-4 py-2 flex items-center gap-3 group hover:border-accent/30 transition-all rounded"
            >
              <span className="font-mono text-[11px] text-muted-foreground/50">
                <span className="text-accent">you.md</span>/{profile.username}
              </span>
              <span className="text-muted-foreground/20 group-hover:text-muted-foreground/50 transition-colors ml-auto">
                {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
              </span>
            </button>
          </motion.div>

          <motion.p
            className="text-muted-foreground text-[12px] leading-relaxed mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            {profile.bio.medium}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {profile.topics.map((topic) => (
              <span
                key={topic}
                className="text-[10px] font-mono px-2.5 py-1 rounded border border-accent/15 text-accent/60"
              >
                {topic}
              </span>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-col gap-1 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.33 }}
          >
            {profile.credibility.map((c) => (
              <p key={c} className="text-accent/50 text-[10px] font-mono">› {c}</p>
            ))}
          </motion.div>

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
              <span className="ml-2 text-muted-foreground/40 text-[10px] font-mono">{profile.username}.md</span>
            </div>
            <div className="p-5 md:p-6">
              <TypewriterBlock lines={codeLines} inView={inView} />
            </div>
          </motion.div>

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
                className="inline-flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/40 hover:text-accent transition-colors border border-border rounded px-3 py-1.5 hover:border-accent/30"
              >
                {link.label}
                <ExternalLink size={9} />
              </a>
            ))}
          </motion.div>

          <motion.div
            className="text-center pt-6 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/" className="text-muted-foreground/25 text-[10px] font-mono hover:text-accent/40 transition-colors">
              powered by <span className="text-accent/40">you.md</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
