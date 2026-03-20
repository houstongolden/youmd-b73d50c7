import { useEffect, useState } from "react";

interface TerminalLineProps {
  children: React.ReactNode;
  delay?: number;
  typing?: boolean;
  className?: string;
  onComplete?: () => void;
}

const TerminalLine = ({
  children,
  delay = 0,
  typing = false,
  className = "",
  onComplete,
}: TerminalLineProps) => {
  const [visible, setVisible] = useState(delay === 0);
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(!typing);
  const text = typeof children === "string" ? children : "";

  useEffect(() => {
    if (delay > 0) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    }
  }, [delay]);

  useEffect(() => {
    if (!visible || !typing || !text) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setTypingDone(true);
        onComplete?.();
      }
    }, 18);
    return () => clearInterval(interval);
  }, [visible, typing, text, onComplete]);

  useEffect(() => {
    if (visible && !typing) {
      onComplete?.();
    }
  }, [visible, typing, onComplete]);

  if (!visible) return null;

  return (
    <div className={`font-mono text-[13px] leading-relaxed ${className}`}>
      {typing ? (
        <span>
          {typedText}
          {!typingDone && <span className="cursor-blink text-accent">█</span>}
        </span>
      ) : (
        children
      )}
    </div>
  );
};

export default TerminalLine;
