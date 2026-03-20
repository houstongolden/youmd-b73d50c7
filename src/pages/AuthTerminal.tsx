import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TerminalLine from "@/components/shell/TerminalLine";
import TerminalInput from "@/components/shell/TerminalInput";
import TerminalHeader from "@/components/shell/TerminalHeader";

type Step = "boot" | "username" | "password" | "verify" | "authenticating" | "done";

const AuthTerminal = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("boot");
  const [username, setUsername] = useState("");
  const [lines, setLines] = useState<{ id: string; content: React.ReactNode; className?: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLine = useCallback((id: string, content: React.ReactNode, className?: string) => {
    setLines((prev) => [...prev, { id, content, className }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, step]);

  // Boot sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => addLine("b1", "you.md v0.1.0", "text-accent"), 200),
      setTimeout(() => addLine("b2", "identity context protocol for the agent internet", "text-muted-foreground/60"), 600),
      setTimeout(() => addLine("b3", ""), 900),
      setTimeout(() => addLine("b4", "initializing authentication...", "text-muted-foreground/50"), 1100),
      setTimeout(() => addLine("b5", ""), 1400),
      setTimeout(() => setStep("username"), 1600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [addLine]);

  const handleUsername = useCallback((val: string) => {
    setUsername(val);
    addLine("u1", <span><span className="text-accent">&gt;</span> <span className="text-muted-foreground">username:</span> <span className="text-foreground">{val}</span></span>);
    setTimeout(() => setStep("password"), 300);
  }, [addLine]);

  const handlePassword = useCallback((val: string) => {
    addLine("p1", <span><span className="text-accent">&gt;</span> <span className="text-muted-foreground">password:</span> <span className="text-foreground">{"•".repeat(val.length)}</span></span>);
    addLine("p2", "");
    setTimeout(() => {
      addLine("p3", <span className="text-muted-foreground/50">→ verification code sent to {username}@email.com</span>);
      addLine("p4", "");
      setTimeout(() => setStep("verify"), 400);
    }, 600);
  }, [addLine, username]);

  const handleVerify = useCallback((val: string) => {
    addLine("v1", <span><span className="text-accent">&gt;</span> <span className="text-muted-foreground">code:</span> <span className="text-foreground">{val}</span></span>);
    addLine("v2", "");
    setStep("authenticating");
    setTimeout(() => {
      addLine("v3", <span className="text-success">✓ authenticated</span>);
      addLine("v4", <span className="text-muted-foreground/50">→ redirecting to /initialize...</span>);
      setStep("done");
      setTimeout(() => navigate("/initialize", { state: { username } }), 1200);
    }, 1000);
  }, [addLine, navigate, username]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl terminal-panel shadow-2xl">
        <TerminalHeader title="you.md — authenticate" />

        <div ref={scrollRef} className="p-6 min-h-[400px] max-h-[70vh] overflow-y-auto">
          {/* Rendered lines */}
          {lines.map((line) => (
            <div key={line.id} className={`font-mono text-[13px] leading-relaxed ${line.className || ""}`}>
              {line.content || "\u00A0"}
            </div>
          ))}

          {/* Active input */}
          {step === "username" && (
            <div className="mt-1">
              <span className="font-mono text-[13px] text-muted-foreground/70 block mb-1">
                enter your username to begin
              </span>
              <TerminalInput
                prompt="username:"
                placeholder="houston"
                onSubmit={handleUsername}
              />
            </div>
          )}

          {step === "password" && (
            <div className="mt-1">
              <TerminalInput
                prompt="password:"
                type="password"
                onSubmit={handlePassword}
              />
            </div>
          )}

          {step === "verify" && (
            <div className="mt-1">
              <TerminalInput
                prompt="verification code:"
                placeholder="000000"
                onSubmit={handleVerify}
              />
            </div>
          )}

          {step === "authenticating" && (
            <div className="font-mono text-[13px] text-muted-foreground/50 flex items-center gap-2">
              <span className="animate-pulse">◌</span> verifying...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthTerminal;
