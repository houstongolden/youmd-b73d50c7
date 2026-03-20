import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Shield } from "lucide-react";
import { sampleProfiles } from "@/data/sampleProfiles";
import FadeUp from "@/components/FadeUp";
import AsciiAvatar from "@/components/AsciiAvatar";
import { getAllProfiles, type DbProfile } from "@/lib/profiles";

const ProfileCard = ({ profile, index }: { profile: typeof sampleProfiles[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
  >
    <Link
      to={`/profile/${profile.username}`}
      className="block py-4 border-b border-border group hover:bg-accent-wash/30 transition-all duration-200 px-3 -mx-3 rounded"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded overflow-hidden border border-border group-hover:border-accent/30 transition-colors shrink-0 bg-background relative">
          <AsciiAvatar
            src={profile.avatarUrl}
            cols={120}
            canvasWidth={80}
            className="w-full h-full object-cover"
          />
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-foreground font-mono text-[13px] font-medium tracking-tight truncate">
                {profile.name}
              </h3>
              {profile.verification.verified && <Shield size={10} className="text-success shrink-0" />}
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-success/60 shrink-0" />
            </div>
            <ArrowRight
              size={12}
              className="text-muted-foreground/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0"
            />
          </div>
          <p className="text-muted-foreground font-body text-[12px] mt-0.5 truncate">{profile.tagline}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-muted-foreground/60 font-mono text-[10px]">
              <MapPin size={9} />
              {profile.location}
            </span>
            <span className="text-accent/60 font-mono text-[9px]">
              {profile.agentMetrics.totalReads.toLocaleString()} reads
            </span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const DbProfileCard = ({ profile, index }: { profile: DbProfile; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
  >
    <Link
      to={`/profile/${profile.username}`}
      className="block py-4 border-b border-border group hover:bg-accent-wash/30 transition-all duration-200 px-3 -mx-3 rounded"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded overflow-hidden border border-border group-hover:border-accent/30 transition-colors shrink-0 bg-background flex items-center justify-center">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.name || profile.username} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <span className="font-mono text-[14px] text-accent/60">
              {(profile.name || profile.username).charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-foreground font-mono text-[13px] font-medium tracking-tight truncate">
                {profile.name || `@${profile.username}`}
              </h3>
              {!profile.is_claimed && (
                <span className="font-mono text-[8px] text-muted-foreground/40 border border-border rounded px-1">unclaimed</span>
              )}
            </div>
            <ArrowRight size={12} className="text-muted-foreground/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
          {profile.tagline && <p className="text-muted-foreground font-body text-[12px] mt-0.5 truncate">{profile.tagline}</p>}
          {profile.location && (
            <div className="flex items-center gap-1 mt-1.5 text-muted-foreground/60 font-mono text-[10px]">
              <MapPin size={9} /> {profile.location}
            </div>
          )}
        </div>
      </div>
    </Link>
  </motion.div>
);

const ProfilesDirectory = () => {
  const [dbProfiles, setDbProfiles] = useState<DbProfile[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getAllProfiles().then(setDbProfiles).catch(console.error);
  }, []);

  // Filter out DB profiles that overlap with sample profiles
  const sampleUsernames = new Set(sampleProfiles.map((p) => p.username));
  const uniqueDbProfiles = dbProfiles.filter((p) => !sampleUsernames.has(p.username));
  const totalCount = sampleProfiles.length + uniqueDbProfiles.length;

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:pt-4">
        <div className="max-w-[680px] mx-auto flex items-center justify-between px-4 py-2 glass-nav rounded">
          <Link to="/" className="text-accent font-mono text-[12px]">you.md</Link>
          <div className="flex items-center gap-3">
            <Link to="/create" className="text-accent font-mono text-[10px] hover:text-accent-light transition-colors">+ create</Link>
            <span className="text-muted-foreground/60 font-mono text-[10px]">/profiles</span>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-20 px-6">
        <div className="max-w-[680px] mx-auto">
          <FadeUp>
            <div className="mb-10">
              <p className="text-muted-foreground/60 font-mono text-[10px] uppercase tracking-widest mb-2">
                directory
              </p>
              <h1 className="text-foreground font-mono text-xl md:text-2xl font-light tracking-tight mb-3">
                &gt; ls /profiles
              </h1>
              <p className="text-muted-foreground font-body text-[13px] leading-relaxed max-w-md">
                Identity surfaces published to the network. Each readable by any agent.
              </p>
              <p className="text-muted-foreground/50 font-mono text-[10px] mt-3">
                {totalCount} profiles · {sampleProfiles.filter(p => p.verification.verified).length} verified
              </p>
            </div>
          </FadeUp>

          <div>
            {sampleProfiles.map((profile, i) => (
              <ProfileCard key={profile.username} profile={profile} index={i} />
            ))}
            {uniqueDbProfiles.map((profile, i) => (
              <DbProfileCard key={profile.id} profile={profile} index={sampleProfiles.length + i} />
            ))}
          </div>

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/create" className="text-accent font-mono text-[11px] hover:text-accent-light transition-colors mr-4">
              &gt; create your profile
            </Link>
            <Link to="/" className="text-muted-foreground/50 font-mono text-[11px] hover:text-accent transition-colors">
              &gt; cd ~/you.md
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilesDirectory;
