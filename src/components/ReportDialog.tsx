import { useState } from "react";
import { reportProfile } from "@/lib/profiles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const REASONS = [
  { value: "not_this_person", label: "Not this person" },
  { value: "false_info", label: "False information" },
  { value: "harmful", label: "Harmful / abusive content" },
  { value: "private_info", label: "Private info exposed" },
  { value: "duplicate", label: "Duplicate profile" },
];

export default function ReportDialog({
  profileId,
  children,
}: {
  profileId: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!reason) return;
    try {
      await reportProfile(profileId, reason, details);
      setSubmitted(true);
      setTimeout(() => setOpen(false), 1500);
    } catch (e: any) {
      setError(e.message || "Failed to submit report");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm text-foreground">
            report profile
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <p className="font-mono text-[12px] text-success py-4">
            ✓ report submitted — we'll review it shortly.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              {REASONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setReason(r.value)}
                  className={`block w-full text-left font-mono text-[12px] px-3 py-2 rounded border transition-colors ${
                    reason === r.value
                      ? "border-accent text-accent bg-accent/5"
                      : "border-border text-muted-foreground hover:border-accent/30"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="additional details (optional)"
              className="w-full bg-background border border-border rounded p-2 font-mono text-[11px] text-foreground placeholder:text-muted-foreground/40 resize-none h-16"
            />
            {error && (
              <p className="font-mono text-[11px] text-destructive">{error}</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={!reason}
              className="w-full font-mono text-[12px] px-3 py-2 rounded bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40 transition-colors"
            >
              submit report
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
