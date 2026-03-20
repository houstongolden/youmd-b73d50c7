import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PrivateContextPaneProps {
  username: string;
  profileId?: string;
}

interface PrivateLink {
  label: string;
  url: string;
}

interface PrivateProject {
  name: string;
  description: string;
  status: string;
}

const PrivateContextPane = ({ username, profileId }: PrivateContextPaneProps) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState("");
  const [links, setLinks] = useState<PrivateLink[]>([]);
  const [projects, setProjects] = useState<PrivateProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  useEffect(() => {
    if (!profileId) { setLoading(false); return; }
    supabase
      .from("private_contexts")
      .select("*")
      .eq("profile_id", profileId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setNotes(data.notes || "");
          setLinks(Array.isArray(data.private_links) ? (data.private_links as any as PrivateLink[]) : []);
          setProjects(Array.isArray(data.private_projects) ? (data.private_projects as any as PrivateProject[]) : []);
        }
        setLoading(false);
      });
  }, [profileId]);

  const save = useCallback(async (updatedNotes?: string, updatedLinks?: PrivateLink[], updatedProjects?: PrivateProject[]) => {
    if (!profileId) return;
    setSaving(true);
    const payload = {
      notes: updatedNotes ?? notes,
      private_links: (updatedLinks ?? links) as any,
      private_projects: (updatedProjects ?? projects) as any,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("private_contexts")
      .update(payload)
      .eq("profile_id", profileId);
    if (!error) {
      setLastSaved(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    }
    setSaving(false);
  }, [profileId, notes, links, projects]);

  const addLink = () => {
    if (!newLinkUrl.trim()) return;
    const updated = [...links, { label: newLinkLabel.trim() || newLinkUrl.trim(), url: newLinkUrl.trim() }];
    setLinks(updated);
    setNewLinkLabel("");
    setNewLinkUrl("");
    save(undefined, updated, undefined);
  };

  const removeLink = (i: number) => {
    const updated = links.filter((_, idx) => idx !== i);
    setLinks(updated);
    save(undefined, updated, undefined);
  };

  const addProject = () => {
    if (!newProjectName.trim()) return;
    const updated = [...projects, { name: newProjectName.trim(), description: newProjectDesc.trim(), status: "active" }];
    setProjects(updated);
    setNewProjectName("");
    setNewProjectDesc("");
    save(undefined, undefined, updated);
  };

  const removeProject = (i: number) => {
    const updated = projects.filter((_, idx) => idx !== i);
    setProjects(updated);
    save(undefined, undefined, updated);
  };

  if (!user) {
    return (
      <div className="p-4 sm:p-8 max-w-xl mx-auto">
        <p className="font-mono text-[11px] text-muted-foreground/40">sign in to access private context.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/40">*/private</span>
        {lastSaved && <span className="font-mono text-[9px] text-success/60 ml-auto">saved {lastSaved}</span>}
      </div>

      <h2 className="font-mono text-sm sm:text-base text-foreground mb-4 sm:mb-6">private context</h2>
      <p className="font-mono text-[10px] text-muted-foreground/40 mb-6">
        this data is only visible to you and agents with scoped access tokens.
      </p>

      {loading ? (
        <p className="font-mono text-[11px] text-muted-foreground/40 animate-pulse">loading...</p>
      ) : (
        <div className="space-y-8">
          {/* Notes */}
          <div>
            <h3 className="font-mono text-[10px] sm:text-[11px] text-accent uppercase tracking-wider mb-2">&gt; notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => save()}
              rows={6}
              placeholder="private notes, goals, reminders..."
              className="w-full bg-background border border-border rounded p-3 font-mono text-[12px] text-foreground/80 placeholder:text-muted-foreground/30 resize-y focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>

          {/* Private Links */}
          <div>
            <h3 className="font-mono text-[10px] sm:text-[11px] text-accent uppercase tracking-wider mb-2">&gt; private links</h3>
            {links.length > 0 && (
              <div className="terminal-panel p-3 mb-3 space-y-1">
                {links.map((link, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-border/20 last:border-0">
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[11px] text-foreground/80 truncate block">{link.label}</span>
                      <span className="font-mono text-[9px] text-muted-foreground/40 truncate block">{link.url}</span>
                    </div>
                    <button onClick={() => removeLink(i)} className="font-mono text-[10px] text-destructive/60 hover:text-destructive ml-2 shrink-0">✗</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                placeholder="label"
                className="flex-1 bg-background border border-border rounded px-2 py-1.5 font-mono text-[11px] text-foreground/80 placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent/40"
              />
              <input
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://..."
                onKeyDown={(e) => e.key === "Enter" && addLink()}
                className="flex-[2] bg-background border border-border rounded px-2 py-1.5 font-mono text-[11px] text-foreground/80 placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent/40"
              />
              <button onClick={addLink} className="font-mono text-[10px] text-accent px-2 py-1.5 border border-accent/30 rounded hover:bg-accent/10 transition-colors">+</button>
            </div>
          </div>

          {/* Private Projects */}
          <div>
            <h3 className="font-mono text-[10px] sm:text-[11px] text-accent uppercase tracking-wider mb-2">&gt; private projects</h3>
            {projects.length > 0 && (
              <div className="terminal-panel p-3 mb-3 space-y-2">
                {projects.map((proj, i) => (
                  <div key={i} className="flex items-start justify-between py-1.5 border-b border-border/20 last:border-0">
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[12px] text-foreground/80 block">{proj.name}</span>
                      {proj.description && <span className="font-mono text-[10px] text-muted-foreground/50 block">{proj.description}</span>}
                      <span className="font-mono text-[9px] text-success/60">{proj.status}</span>
                    </div>
                    <button onClick={() => removeProject(i)} className="font-mono text-[10px] text-destructive/60 hover:text-destructive ml-2 shrink-0">✗</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="project name"
                className="flex-1 bg-background border border-border rounded px-2 py-1.5 font-mono text-[11px] text-foreground/80 placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent/40"
              />
              <input
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                placeholder="description (optional)"
                onKeyDown={(e) => e.key === "Enter" && addProject()}
                className="flex-[2] bg-background border border-border rounded px-2 py-1.5 font-mono text-[11px] text-foreground/80 placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent/40"
              />
              <button onClick={addProject} className="font-mono text-[10px] text-accent px-2 py-1.5 border border-accent/30 rounded hover:bg-accent/10 transition-colors">+</button>
            </div>
          </div>

          {saving && <p className="font-mono text-[9px] text-muted-foreground/40 animate-pulse">saving...</p>}
        </div>
      )}
    </div>
  );
};

export default PrivateContextPane;
