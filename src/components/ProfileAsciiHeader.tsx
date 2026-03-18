import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Profile } from "@/data/sampleProfiles";

/* ── Generate personalized ASCII art based on profile data ── */

const generateProfileAscii = (profile: Profile): string[] => {
  const initials = profile.name
    .split(" ")
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");

  // Role-based icon motif
  const roleMotif = (() => {
    const tag = profile.tagline.toLowerCase();
    if (tag.includes("founder") || tag.includes("ceo"))
      return "◆";
    if (tag.includes("engineer") || tag.includes("developer"))
      return "⟐";
    if (tag.includes("designer") || tag.includes("creative"))
      return "◈";
    if (tag.includes("writer") || tag.includes("content"))
      return "✦";
    return "◇";
  })();

  // Freshness visual
  const freshBar = (() => {
    const score = profile.freshness.score;
    const filled = Math.round(score / 5);
    const empty = 20 - filled;
    return "█".repeat(filled) + "░".repeat(empty);
  })();

  // Project count shapes
  const projectDots = profile.projects
    .map((p) => {
      switch (p.status) {
        case "active": return "●";
        case "building": return "◐";
        case "shipped": return "✦";
        default: return "○";
      }
    })
    .join(" ");

  // Build the bust/portrait using initials
  const initial1 = initials[0] || "?";
  const initial2 = initials[1] || " ";

  const lines = [
    ``,
    `                    ╔══════════════════════════════════════════════════════╗`,
    `                    ║                                                      ║`,
    `                    ║              ▄▄▄████████████▄▄▄                      ║`,
    `                    ║           ▄██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██▄                   ║`,
    `                    ║         ▄█▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓█▄                  ║`,
    `                    ║        █▓▒▒░░░░░░░░░░░░░░░░░░▒▒▓█                  ║`,
    `                    ║       █▓▒░░░░▄▄▓▓▓▓▓▓▓▓▄▄░░░░▒▓█                  ║`,
    `                    ║      █▓▒░░▄▓████████████████▓▄░░▒▓█                ║`,
    `                    ║      █▒░░▓██▒░░░░░░░░░░░░▒██▓░░▒█                 ║`,
    `                    ║      █▒░░██░░░░░▄██▄▄██▄░░░░██░░▒█                ║`,
    `                    ║      █▒░░██░░░░████████████░░██░░▒█                ║`,
    `                    ║      █▒░░██░░░░████████████░░██░░▒█                ║`,
    `                    ║      █▒░░██░░░░░▀██▀▀██▀░░░░██░░▒█                ║`,
    `                    ║      █▒░░▓██▒░░░░░░░░░░░░▒██▓░░▒█                 ║`,
    `                    ║      █▓▒░░▀▓████████████████▓▀░░▒▓█                ║`,
    `                    ║       █▓▒░░░░░▀▀▓▓▓▓▓▓▀▀░░░░░▒▓█                  ║`,
    `                    ║       █▓▒░░░░░░░▄████▄░░░░░░░▒▓█                   ║`,
    `                    ║        █▓▒░░░░▒████████▒░░░░▒▓█                    ║`,
    `                    ║         ▀█▓▒░░░░░░░░░░░░░░▒▓█▀                     ║`,
    `                    ║          ▀██▓▒▒░░░░░░░░▒▒▓██▀                      ║`,
    `                    ║            ▀▀██▓▓▓▓▓▓▓▓██▀▀                        ║`,
    `                    ║               ████████████                           ║`,
    `                    ║              ████  ${initial1}${initial2}  ████                          ║`,
    `                    ║             ████████████████                         ║`,
    `                    ║            ██▓▒░░░░░░░░▒▓██                         ║`,
    `                    ║           ██▓░░░░░░░░░░░▓██                         ║`,
    `                    ║          ██▓░░░░░░░░░░░░░▓██                        ║`,
    `                    ║         ██▓░░░░░░░░░░░░░░░▓██                       ║`,
    `                    ║        ██▓░░░░░░░░░░░░░░░░░▓██                      ║`,
    `                    ║                                                      ║`,
    `                    ╠══════════════════════════════════════════════════════╣`,
    `                    ║  ${roleMotif} ${profile.name.padEnd(20).slice(0, 20)}                              ║`,
    `                    ║  ${profile.tagline.slice(0, 48).padEnd(48)}      ║`,
    `                    ║  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  ║`,
    `                    ║  freshness [${freshBar}] ${String(profile.freshness.score).padStart(3)}/100  ║`,
    `                    ║  projects  ${projectDots.padEnd(43).slice(0, 43)}  ║`,
    `                    ║  reads     ${String(profile.agentMetrics.totalReads.toLocaleString()).padEnd(10)} agents ${String(profile.agentMetrics.connectedAgentsCount).padEnd(4)} score ${profile.agentMetrics.contextScore}/100   ║`,
    `                    ║  status    ${profile.verification.verified ? "✓ VERIFIED" : "○ unverified"}                                     ║`,
    `                    ╚══════════════════════════════════════════════════════╝`,
  ];

  return lines;
};

/* ── Color assignment based on line content ── */
const getLineClass = (line: string, index: number, total: number): string => {
  if (line.includes("╔") || line.includes("╗") || line.includes("╠") || line.includes("╣") || line.includes("╚") || line.includes("╝"))
    return "ascii-mid";
  if (line.includes("║") && (line.includes("freshness") || line.includes("projects") || line.includes("reads") || line.includes("status")))
    return "ascii-soft";
  if (line.includes("║") && (line.includes("◆") || line.includes("◇") || line.includes("⟐") || line.includes("◈") || line.includes("✦")))
    return "ascii-strong";
  if (line.includes("████") || line.includes("▓▓") || line.includes("██"))
    return "ascii-strong";
  if (line.includes("▒▒") || line.includes("░░"))
    return "ascii-mid";
  if (line.includes("┄"))
    return "ascii-beam";
  return "ascii-mid";
};

interface ProfileAsciiHeaderProps {
  profile: Profile;
}

const ProfileAsciiHeader = ({ profile }: ProfileAsciiHeaderProps) => {
  const asciiLines = useMemo(() => generateProfileAscii(profile), [profile]);

  return (
    <div className="w-full overflow-hidden">
      <motion.pre
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-mono text-[5px] sm:text-[6px] md:text-[7px] lg:text-[8px] leading-[1.2] select-none text-center py-6 md:py-8 overflow-x-auto"
      >
        {asciiLines.map((line, i) => (
          <div key={i} className={getLineClass(line, i, asciiLines.length)}>
            {line || "\u00A0"}
          </div>
        ))}
      </motion.pre>
    </div>
  );
};

export default ProfileAsciiHeader;
