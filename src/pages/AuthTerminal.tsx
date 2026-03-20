import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TerminalInput from "@/components/shell/TerminalInput";
import TerminalHeader from "@/components/shell/TerminalHeader";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Step = "boot" | "choice" | "email" | "password" | "verify_email" | "authenticating" | "done";

const AuthTerminal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const returnTo = (location.state as any)?.returnTo;
  const claimProfileId = (location.state as any)?.claimProfileId;
  const [step, setStep] = useState<Step>("boot");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [lines, setLines] = useState<{ id: string; content: React.ReactNode; className?: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineCount = useRef(0);

  const addLine = useCallback((content: React.ReactNode, className?: string) => {
    const id = `l${lineCount.current++}`;
    setLines((prev) => [...prev, { id, content, className }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, step]);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (claimProfileId) {
        supabase.functions.invoke("claim-profile", {
          body: { profile_id: claimProfileId },
        }).then(() => {
          navigate(returnTo || "/shell", { replace: true });
        });
      } else {
        navigate(returnTo || "/shell", { replace: true });
      }
    }
  }, [user, navigate, returnTo, claimProfileId]);

  // Boot
  useEffect(() => {
    const timers = [
      setTimeout(() => addLine("you.md v0.1.0", "text-accent"), 200),
      setTimeout(() => addLine("identity context protocol for the agent internet", "text-muted-foreground/60"), 600),
      setTimeout(() => addLine("\u00A0"), 900),
      setTimeout(() => addLine("authentication required to claim & manage profiles", "text-muted-foreground/50"), 1100),
      setTimeout(() => addLine("\u00A0"), 1400),
      setTimeout(() => setStep("choice"), 1600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [addLine]);

  const handleChoice = useCallback((val: string) => {
    const lower = val.toLowerCase().trim();
    addLine(<span><span className="text-accent">&gt;</span> {val}</span>);
    if (lower === "signup" || lower === "register" || lower === "2") {
      setMode("signup");
      addLine(<span className="text-muted-foreground/50">→ creating a new account</span>);
    } else {
      setMode("signin");
      addLine(<span className="text-muted-foreground/50">→ signing in</span>);
    }
    addLine("\u00A0");
    setTimeout(() => setStep("email"), 300);
  }, [addLine]);

  const handleEmail = useCallback((val: string) => {
    setEmail(val);
    addLine(<span><span className="text-accent">&gt;</span> <span className="text-muted-foreground">email:</span> {val}</span>);
    setTimeout(() => setStep("password"), 300);
  }, [addLine]);

  const handlePassword = useCallback(async (val: string) => {
    addLine(<span><span className="text-accent">&gt;</span> <span className="text-muted-foreground">password:</span> {"•".repeat(val.length)}</span>);
    addLine("\u00A0");
    setStep("authenticating");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password: val,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        addLine(<span className="text-destructive">✗ {error.message}</span>);
        addLine("\u00A0");
        setTimeout(() => setStep("email"), 500);
        return;
      }
      addLine(<span className="text-success">✓ account created</span>);
      addLine(<span className="text-muted-foreground/50">→ check your email to verify, then sign in</span>);
      setStep("verify_email");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: val,
      });
      if (error) {
        addLine(<span className="text-destructive">✗ {error.message}</span>);
        addLine("\u00A0");
        setTimeout(() => setStep("email"), 500);
        return;
      }
      addLine(<span className="text-success">✓ authenticated</span>);
      setStep("done");
      // The useEffect above will handle redirect once user state updates
    }
  }, [addLine, email, mode]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl terminal-panel shadow-2xl">
        <TerminalHeader title="you.md — authenticate" />

        <div ref={scrollRef} className="p-4 sm:p-6 min-h-[300px] sm:min-h-[400px] max-h-[80vh] overflow-y-auto">
          {lines.map((line) => (
            <div key={line.id} className={`font-mono text-[12px] sm:text-[13px] leading-relaxed ${line.className || ""}`}>
              {line.content || "\u00A0"}
            </div>
          ))}

          {step === "choice" && (
            <div className="mt-1">
              <span className="font-mono text-[12px] sm:text-[13px] text-muted-foreground/70 block mb-1">
                type <span className="text-accent">signin</span> or <span className="text-accent">signup</span>
              </span>
              <TerminalInput prompt=">" placeholder="signin" onSubmit={handleChoice} />
            </div>
          )}

          {step === "email" && (
            <div className="mt-1">
              <TerminalInput prompt="email:" placeholder="you@example.com" onSubmit={handleEmail} />
            </div>
          )}

          {step === "password" && (
            <div className="mt-1">
              <TerminalInput prompt="password:" type="password" onSubmit={handlePassword} />
            </div>
          )}

          {step === "authenticating" && (
            <div className="font-mono text-[12px] sm:text-[13px] text-muted-foreground/50 flex items-center gap-2">
              <span className="animate-pulse">◌</span> authenticating...
            </div>
          )}

          {step === "verify_email" && (
            <div className="mt-2">
              <span className="font-mono text-[12px] sm:text-[13px] text-muted-foreground/70 block mb-1">
                verified? type <span className="text-accent">signin</span> to continue
              </span>
              <TerminalInput prompt=">" placeholder="signin" onSubmit={() => {
                setMode("signin");
                setStep("email");
                addLine("\u00A0");
              }} />
            </div>
          )}

          {step === "done" && (
            <div className="font-mono text-[12px] sm:text-[13px] text-muted-foreground/50 flex items-center gap-2">
              <span className="animate-pulse">◌</span> redirecting...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthTerminal;
