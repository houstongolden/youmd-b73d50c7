import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { sampleProfiles } from "@/data/sampleProfiles";
import FadeUp from "@/components/FadeUp";

const ProfileCard = ({ profile, index }: { profile: typeof sampleProfiles[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
  >
    <Link
      to={`/profile/${profile.username}`}
      className="terminal-panel p-4 md:p-5 block group hover:border-green/25 transition-all duration-300 rounded-lg"
    >
      <div className="flex items-start gap-4">
        {/* Monogram */}
        <div className="w-10 h-10 rounded border border-border flex items-center justify-center text-green/60 font-mono text-[12px] font-medium shrink-0 group-hover:border-green/30 transition-colors bg-panel">
          {profile.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-foreground text-[13px] font-mono font-medium tracking-tight truncate">
              {profile.name}
            </h3>
            <ArrowRight
              size={12}
              className="text-mist/15 group-hover:text-green group-hover:translate-x-0.5 transition-all shrink-0"
            />
          </div>
          <p className="text-mist text-[11px] font-mono mt-0.5 truncate">{profile.tagline}</p>
          <div className="flex items-center gap-1 mt-1 text-mist/30 text-[10px] font-mono">
            <MapPin size={9} />
            <span>{profile.location}</span>
          </div>
          <p className="text-mist/50 text-[11px] mt-2.5 leading-relaxed line-clamp-2 font-mono">
            {profile.bio.short}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {profile.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="text-[9px] font-mono px-2 py-0.5 rounded border border-cyan/10 text-cyan/40"
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
  <div className="min-h-screen relative">
    {/* Beam */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[500px] beam-glow pointer-events-none" />

    {/* Nav */}
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:pt-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-6 px-4 py-2 glass-scrolled rounded-lg">
        <Link to="/" className="text-green font-mono text-[13px] font-medium">
          <span className="text-mist/30">~/</span>you.md
        </Link>
        <span className="text-mist/30 text-[11px] font-mono">
          /profiles
        </span>
      </div>
    </nav>

    <div className="pt-24 pb-20 px-6 relative z-10">
      <div className="max-w-2xl mx-auto">
        <FadeUp>
          <div className="mb-10">
            <p className="text-mist/30 text-[10px] font-mono uppercase tracking-widest mb-2">
              directory
            </p>
            <h1 className="text-foreground text-xl md:text-2xl font-mono font-light tracking-tight mb-3">
              $ ls /profiles
            </h1>
            <p className="text-mist text-[11px] leading-relaxed max-w-md font-mono">
              Identity bundles published to the network. Each readable by any agent on earth.
            </p>
          </div>
        </FadeUp>

        <div className="grid gap-3">
          {sampleProfiles.map((profile, i) => (
            <ProfileCard key={profile.username} profile={profile} index={i} />
          ))}
        </div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/" className="text-mist/25 text-[11px] font-mono hover:text-mist/50 transition-colors">
            cd ~/you.md
          </Link>
        </motion.div>
      </div>
    </div>
  </div>
);

export default ProfilesDirectory;
