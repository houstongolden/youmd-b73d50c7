import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { sampleProfiles } from "@/data/sampleProfiles";
import FadeUp from "@/components/FadeUp";

const ProfileCard = ({ profile, index }: { profile: typeof sampleProfiles[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 + index * 0.06 }}
  >
    <Link
      to={`/profile/${profile.username}`}
      className="glass-card-dark rounded-2xl p-5 md:p-6 block group hover:border-coral/20 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Initials circle instead of photo — PRD says no profile photos */}
        <div className="w-12 h-12 rounded-full bg-ink border border-mist/15 flex items-center justify-center text-coral font-mono text-[14px] font-medium shrink-0 group-hover:border-coral/30 transition-colors">
          {profile.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-light text-[14px] font-medium tracking-tight truncate">
              {profile.name}
            </h3>
            <ArrowRight
              size={13}
              className="text-mist/20 group-hover:text-coral group-hover:translate-x-0.5 transition-all shrink-0"
            />
          </div>
          <p className="text-mist text-[12px] mt-0.5 truncate">{profile.tagline}</p>
          <div className="flex items-center gap-1 mt-1 text-mist/40 text-[11px]">
            <MapPin size={10} />
            <span>{profile.location}</span>
          </div>
          <p className="text-ether/50 text-[12px] mt-3 leading-relaxed line-clamp-2">
            {profile.bio.medium}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {profile.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky/8 text-sky/60 border border-sky/10"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const ProfilesDirectory = () => (
  <div className="min-h-screen bg-void relative overflow-hidden">
    {/* Beam motif */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[600px] beam-glow pointer-events-none" />

    {/* Nav */}
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3 md:pt-4">
      <div className="rounded-full flex items-center justify-between gap-6 px-5 py-2 w-full max-w-2xl glass-card-dark">
        <Link to="/" className="text-light font-mono text-[14px] font-medium tracking-tight">
          you.md
        </Link>
        <span className="text-mist/40 text-[11px] uppercase tracking-[0.08em] font-medium">
          Directory
        </span>
      </div>
    </nav>

    <div className="pt-24 pb-20 px-6 relative z-10">
      <div className="max-w-2xl mx-auto">
        <FadeUp>
          <div className="mb-10">
            <p className="text-mist/40 text-[10px] font-mono uppercase tracking-[0.25em] mb-2">
              Community
            </p>
            <h1 className="text-light text-2xl md:text-3xl font-display font-light tracking-tight mb-3">
              Identity directory
            </h1>
            <p className="text-ether/50 text-[13px] leading-relaxed max-w-md">
              See how people use you.md to make themselves legible to agents. Each profile is a structured identity bundle — readable by any AI on earth.
            </p>
          </div>
        </FadeUp>

        <div className="grid gap-4">
          {sampleProfiles.map((profile, i) => (
            <ProfileCard key={profile.username} profile={profile} index={i} />
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/" className="text-mist/30 text-[13px] font-mono hover:text-mist/50 transition-colors">
            ← back to <span className="text-coral/50">you.md</span>
          </Link>
        </motion.div>
      </div>
    </div>
  </div>
);

export default ProfilesDirectory;
