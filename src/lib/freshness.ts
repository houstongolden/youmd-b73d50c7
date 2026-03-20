/**
 * Freshness scoring — calculates how up-to-date a profile is
 * based on source sync timestamps.
 */

/** Compute a 0-100 freshness score from an array of sync timestamps */
export function computeFreshnessScore(syncDates: (string | null)[]): number {
  const now = Date.now();
  const valid = syncDates.filter(Boolean).map(d => new Date(d!).getTime());
  if (valid.length === 0) return 0;

  // Score each source: 100 if synced within 1 day, decaying to 0 over 30 days
  const scores = valid.map(ts => {
    const ageMs = now - ts;
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    if (ageDays <= 1) return 100;
    if (ageDays >= 30) return 0;
    return Math.round(100 * (1 - (ageDays - 1) / 29));
  });

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/** Get a freshness label from a score */
export function freshnessLabel(score: number): { text: string; color: string } {
  if (score >= 80) return { text: "current", color: "text-success" };
  if (score >= 50) return { text: "stale", color: "text-accent" };
  if (score >= 20) return { text: "outdated", color: "text-destructive" };
  return { text: "unknown", color: "text-muted-foreground" };
}

/** Per-dimension freshness from source data */
export function computeDimensionFreshness(sources: { platform: string; last_synced_at: string | null }[]) {
  const now = Date.now();
  const freshness = (ts: string | null) => {
    if (!ts) return "unknown";
    const days = (now - new Date(ts).getTime()) / (1000 * 60 * 60 * 24);
    if (days <= 1) return "current";
    if (days <= 7) return "recent";
    if (days <= 30) return "stale";
    return "outdated";
  };

  // Aggregate: pick the most recent source for each dimension
  const identitySource = sources.find(s => s.platform === "linkedin" || s.platform === "x" || s.platform === "twitter");
  const projectsSource = sources.find(s => s.platform === "github");
  const allDates = sources.map(s => s.last_synced_at).filter(Boolean);
  const mostRecent = allDates.length > 0 ? allDates.sort().reverse()[0] : null;

  return {
    identity: freshness(identitySource?.last_synced_at || mostRecent),
    projects: freshness(projectsSource?.last_synced_at || null),
    voice: freshness(mostRecent),
    sources: freshness(mostRecent),
    score: computeFreshnessScore(sources.map(s => s.last_synced_at)),
  };
}
