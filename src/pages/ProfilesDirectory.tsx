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
      className="block py-4 border-b border-border group hover:bg-accent-wash/30 transition-colors px-2 -mx-2 rounded"
    >
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded border border-border flex items-center justify-center text-accent/50 font-mono text-[11px] font-medium shrink-0 group-hover:border-accent/30 transition-colors">
          {profile.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-foreground font-mono text-[13px] font-medium tracking-tight truncate">
              {profile.name}
            </h3>
            <ArrowRight
              size={12}
              className="text-muted-foreground/15 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0"
            />
          </div>
          <p className="text-muted-foreground font-body text-[12px] mt-0.5 truncate">{profile.tagline}</p>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground/40 font-mono text-[10px]">
            <MapPin size={9} />
            <span>{profile.location}</span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const ProfilesDirectory = () => (
  <div className="min-h-screen">
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:pt-4">
      <div className="max-w-[640px] mx-auto flex items-center justify-between px-4 py-2 glass-nav rounded">
        <Link to="/" className="text-accent font-mono text-[12px]">you.md</Link>
        <span className="text-muted-foreground/40 font-mono text-[10px]">/profiles</span>
      </div>
    </nav>

    <div className="pt-20 pb-20 px-6">
      <div className="max-w-[640px] mx-auto">
        <FadeUp>
          <div className="mb-10">
            <p className="text-muted-foreground/40 font-mono text-[10px] uppercase tracking-widest mb-2">
              directory
            </p>
            <h1 className="text-foreground font-mono text-xl md:text-2xl font-light tracking-tight mb-3">
              &gt; ls /profiles
            </h1>
            <p className="text-muted-foreground font-body text-[13px] leading-relaxed max-w-md">
              Identity bundles published to the network. Each readable by any agent.
            </p>
          </div>
        </FadeUp>

        <div>
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
          <Link to="/" className="text-muted-foreground/30 font-mono text-[11px] hover:text-accent transition-colors">
            &gt; cd ~/you.md
          </Link>
        </motion.div>
      </div>
    </div>
  </div>
);

export default ProfilesDirectory;
