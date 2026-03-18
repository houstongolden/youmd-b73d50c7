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
      className="glass-card rounded-2xl p-5 md:p-6 block group hover:border-teal/25 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-12 h-12 rounded-full object-cover border border-border/40 group-hover:border-teal/30 transition-colors"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-foreground text-[14px] font-medium tracking-tight truncate">
              {profile.name}
            </h3>
            <ArrowRight
              size={13}
              className="text-foreground/15 group-hover:text-teal group-hover:translate-x-0.5 transition-all shrink-0"
            />
          </div>
          <p className="text-muted-foreground text-[12px] mt-0.5 truncate">{profile.role}</p>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground/50 text-[11px]">
            <MapPin size={10} />
            <span>{profile.location}</span>
          </div>
          <p className="text-foreground/35 text-[12px] mt-3 leading-relaxed line-clamp-2">
            {profile.bio}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {profile.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal/8 text-teal/70 border border-teal/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const ProfilesDirectory = () => (
  <div className="min-h-screen bg-background">
    {/* Nav */}
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3 md:pt-4">
      <div className="rounded-full flex items-center justify-between gap-6 px-5 py-2 w-full max-w-2xl glass-scrolled">
        <Link to="/" className="text-foreground font-display text-[15px] font-medium tracking-tight">
          You.md
        </Link>
        <span className="text-foreground/30 text-[11px] uppercase tracking-[0.08em] font-medium">
          Directory
        </span>
      </div>
    </nav>

    <div className="pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <FadeUp>
          <div className="mb-10">
            <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.25em] mb-2">
              Community
            </p>
            <h1 className="text-foreground text-2xl md:text-3xl font-display font-light tracking-tight mb-3">
              Sample profiles
            </h1>
            <p className="text-foreground/35 text-[13px] leading-relaxed max-w-md">
              See how people use you.md to give AI agents the context they need. Each profile is a living identity bundle.
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
          <Link to="/" className="text-foreground/25 text-[13px] hover:text-foreground/50 transition-colors">
            ← Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  </div>
);

export default ProfilesDirectory;
