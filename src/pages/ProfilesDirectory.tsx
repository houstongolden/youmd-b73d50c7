import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Shield } from "lucide-react";
import { sampleProfiles } from "@/data/sampleProfiles";
import FadeUp from "@/components/FadeUp";
import AsciiAvatar from "@/components/AsciiAvatar";
import { getAllProfiles, type DbProfile } from "@/lib/profiles";

const ProfileCard = ({ profile, index }: { profile: DbProfile; index: number }) => {
  // Check if there's matching sample data for enrichment
  const sampleMatch = sampleProfiles.find((s) => s.username === profile.username);
  const avatarUrl = profile.avatar_url || sampleMatch?.avatarUrl;
  const isVerified = sampleMatch?.verification?.verified || false;
  const totalReads = sampleMatch?.agentMetrics?.totalReads;

  return (
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
            {avatarUrl ? (
              <>
                <AsciiAvatar src={avatarUrl} cols={120} canvasWidth={80} className="w-full h-full object-cover" />
                <img
                  src={avatarUrl}
                  alt={profile.name || profile.username}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  loading="lazy"
                />
              </>
            ) : (
              <span className="w-full h-full flex items-center justify-center font-mono text-[14px] text-accent/60">
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
                {isVerified && <Shield size={10} className="text-success shrink-0" />}
                {!profile.is_claimed && (
                  <span className="font-mono text-[8px] text-muted-foreground/40 border border-border rounded px-1 shrink-0">unclaimed</span>
                )}
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-success/60 shrink-0" />
              </div>
              <ArrowRight size={12} className="text-muted-foreground/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
            {(profile.tagline) && (
              <p className="text-muted-foreground font-body text-[12px] mt-0.5 truncate">{profile.tagline}</p>
            )}
            <div className="flex items-center gap-3 mt-1.5">
              {profile.location && (
                <span className="flex items-center gap-1 text-muted-foreground/60 font-mono text-[10px]">
                  <MapPin size={9} /> {profile.location}
                </span>
              )}
              {totalReads != null && (
                <span className="text-accent/60 font-mono text-[9px]">
                  {totalReads.toLocaleString()} reads
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ProfilesDirectory = () => {
  const [dbProfiles, setDbProfiles] = useState<DbProfile[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getAllProfiles().then(setDbProfiles).catch(console.error);
  }, []);

  // DB profiles are the source of truth now
  const verifiedCount = sampleProfiles.filter((p) => p.verification.verified).length;

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
              <p className="text-muted-foreground/60 font-mono text-[10px] uppercase tracking-widest mb-2">directory</p>
              <h1 className="text-foreground font-mono text-xl md:text-2xl font-light tracking-tight mb-3">&gt; ls /profiles</h1>
              <p className="text-muted-foreground font-body text-[13px] leading-relaxed max-w-md">
                Identity surfaces published to the network. Each readable by any agent.
              </p>
              <p className="text-muted-foreground/50 font-mono text-[10px] mt-3">
                {dbProfiles.length} profiles · {verifiedCount} verified
              </p>
            </div>
          </FadeUp>

          <div>
            {dbProfiles.map((profile, i) => (
              <ProfileCard key={profile.id} profile={profile} index={i} />
            ))}
          </div>

          <motion.div className="text-center mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
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
