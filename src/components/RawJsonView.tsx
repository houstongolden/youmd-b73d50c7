import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { Profile } from "@/data/sampleProfiles";

const generateYouJson = (profile: Profile) => ({
  "$schema": "you/v1",
  username: profile.username,
  name: profile.name,
  tagline: profile.tagline,
  location: profile.location,
  voice: profile.voice,
  bio: profile.bio,
  now: profile.now,
  topics: profile.topics,
  values: profile.values,
  preferences: profile.preferences,
  projects: profile.projects.map(p => ({
    name: p.name,
    role: p.role,
    status: p.status,
    description: p.description,
    ...(p.url && { url: p.url }),
    ...(p.stars && { stars: p.stars }),
    ...(p.mrr && { mrr: p.mrr }),
  })),
  links: profile.links,
  credibility: profile.credibility,
  verification: profile.verification,
  freshness: profile.freshness,
  identity_state: {
    memory_coverage: profile.identityState.memoryCoverage,
    voice_profile: profile.identityState.voiceProfile,
    context_freshness: profile.identityState.contextFreshness,
    sources_synced: profile.identityState.sourcesSynced,
  },
  agent_metrics: {
    total_reads: profile.agentMetrics.totalReads,
    recent_reads_24h: profile.agentMetrics.recentReads24h,
    connected_agents: profile.agentMetrics.connectedAgentsCount,
    verified_agents: profile.agentMetrics.verifiedAgents,
    context_score: profile.agentMetrics.contextScore,
  },
  connected_sources: profile.connectedSources,
  access: {
    public: profile.publicSections,
    private: profile.privateSections,
  },
  maintenance: {
    human_edits: profile.maintenance.humanEdits,
    agent_maintenance: profile.maintenance.agentMaintenance,
    update_mode: profile.maintenance.updateMode,
    active_maintainers: profile.maintenance.activeMaintainers,
  },
  last_updated: profile.lastUpdated,
});

const syntaxHighlight = (json: string) => {
  return json.replace(
    /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^"\\])*")\s*:/g,
    '<span class="text-accent/70">$1</span>:'
  ).replace(
    /:\s*("(?:\\u[\da-fA-F]{4}|\\[^u]|[^"\\])*")/g,
    ': <span class="text-foreground/70">$1</span>'
  ).replace(
    /:\s*(\d+)/g,
    ': <span class="text-success">$1</span>'
  ).replace(
    /:\s*(true|false)/g,
    ': <span class="text-accent">$1</span>'
  ).replace(
    /:\s*(null)/g,
    ': <span class="text-muted-foreground/50">$1</span>'
  );
};

const RawJsonView = ({ profile }: { profile: Profile }) => {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(generateYouJson(profile), null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="terminal-panel">
      <div className="terminal-panel-header justify-between">
        <div className="flex items-center gap-1.5">
          <div className="terminal-dot" />
          <div className="terminal-dot" />
          <div className="terminal-dot" />
          <span className="ml-2 text-muted-foreground/50 font-mono text-[10px]">
            you.json — {profile.username}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-muted-foreground/50 hover:text-accent font-mono text-[10px] transition-colors"
        >
          {copied ? (
            <>
              <Check size={10} className="text-success" /> copied
            </>
          ) : (
            <>
              <Copy size={10} /> copy
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto max-h-[70vh] overflow-y-auto">
        <pre
          className="font-mono text-[10px] md:text-[11px] leading-[1.8] whitespace-pre"
          dangerouslySetInnerHTML={{ __html: syntaxHighlight(json) }}
        />
      </div>
    </div>
  );
};

export default RawJsonView;
