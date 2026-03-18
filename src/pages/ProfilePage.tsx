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
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return <span className="text-foreground/35">{line}</span>;
    const key = line.slice(0, colonIdx);
    const rest = line.slice(colonIdx);
    const isIndented = key.startsWith("  ");
    const quoteMatch = rest.match(/: "(.*)"$/);
    return (
      <>
        <span className={isIndented ? "text-foreground/30" : "text-foreground/55"}>{key}</span>
        {quoteMatch ? (
          <>
            <span className="text-foreground/15">: </span>
            <span className="text-teal/90">"{quoteMatch[1]}"</span>
          </>
        ) : (
          <span className="text-foreground/15">{rest}</span>
        )}
      </>
    );
  };

  return (
    <pre className="font-mono text-[12px] md:text-[13px] leading-[2] whitespace-pre-wrap">
      <code>
        {visibleLines.map((line, i) => (
          <div key={i}>{renderLine(line)}</div>
        ))}
        {visibleChars < totalChars && <span className="cursor-blink text-teal">▌</span>}
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
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-foreground text-2xl font-display font-light mb-3">Profile not found</h1>
          <p className="text-muted-foreground text-sm mb-6">This you.md username doesn't exist yet.</p>
          <Link to="/profiles" className="cta-teal px-6 py-2.5 text-sm inline-block">
            Browse profiles
          </Link>
        </div>
      </div>
    );
  }

  const codeLines = [
    `name: "${profile.name}"`,
    `role: "${profile.role}"`,
    `location: "${profile.location}"`,
    `voice: "${profile.voice}"`,
    `goals:`,
    `  current: "${profile.goals.current}"`,
    `  next: "${profile.goals.next}"`,
    `tools:`,
    `  primary: "${profile.tools.primary}"`,
    `  infra: "${profile.tools.infra}"`,
    `preferences:`,
    `  format: "${profile.preferences.format}"`,
    `  length: "${profile.preferences.length}"`,
  ];

  const profileUrl = `you.md/${profile.username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3 md:pt-4">
        <div className="rounded-full flex items-center justify-between gap-6 px-5 py-2 w-full max-w-2xl glass-scrolled">
          <Link to="/" className="text-foreground font-display text-[15px] font-medium tracking-tight">
            You.md
          </Link>
          <Link
            to="/profiles"
            className="text-foreground/50 text-[11px] uppercase tracking-[0.08em] font-medium hover:text-foreground/80 transition-colors"
          >
            Profiles
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/profiles"
              className="inline-flex items-center gap-1.5 text-muted-foreground text-[12px] hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft size={12} /> All profiles
            </Link>
          </motion.div>

          {/* Profile header */}
          <motion.div
            className="flex items-start gap-5 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-border/50"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-foreground text-xl md:text-2xl font-display font-medium tracking-tight leading-tight">
                {profile.name}
              </h1>
              <p className="text-muted-foreground text-[13px] mt-0.5">{profile.role}</p>
              <div className="flex items-center gap-1 mt-1.5 text-muted-foreground/70 text-[12px]">
                <MapPin size={11} />
                <span>{profile.location}</span>
              </div>
            </div>
          </motion.div>

          {/* URL bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <button
              onClick={handleCopy}
              className="glass-card rounded-full px-5 py-2.5 flex items-center gap-3 w-full md:w-auto group hover:border-teal/30 transition-all"
            >
              <span className="font-mono text-[12px] text-foreground/40">
                <span className="text-teal">you.md</span>/{profile.username}
              </span>
              <span className="text-foreground/25 group-hover:text-foreground/50 transition-colors ml-auto md:ml-2">
                {copied ? <Check size={13} className="text-teal" /> : <Copy size={13} />}
              </span>
            </button>
          </motion.div>

          {/* Bio */}
          <motion.p
            className="text-foreground/60 text-[14px] leading-relaxed mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {profile.bio}
          </motion.p>

          {/* Tags */}
          <motion.div
            className="flex flex-wrap gap-2 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-3 py-1 rounded-full bg-teal/10 text-teal border border-teal/15"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Code block */}
          <motion.div
            ref={codeRef}
            className="glass-card rounded-2xl p-6 md:p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <div className="flex items-center gap-1.5 mb-5 pb-4 border-b border-border/30">
              <div className="w-[7px] h-[7px] rounded-full bg-foreground/8" />
              <div className="w-[7px] h-[7px] rounded-full bg-foreground/8" />
              <div className="w-[7px] h-[7px] rounded-full bg-foreground/8" />
              <span className="ml-3 text-foreground/20 text-[11px] font-mono">{profile.username}.md</span>
            </div>
            <TypewriterBlock lines={codeLines} inView={inView} />
          </motion.div>

          {/* Links */}
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            {profile.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                className="inline-flex items-center gap-1.5 text-[12px] text-foreground/40 hover:text-foreground/70 transition-colors border border-border/40 rounded-full px-4 py-1.5"
              >
                {link.label}
                <ExternalLink size={10} />
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
