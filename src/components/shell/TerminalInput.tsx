import { useState, useRef, useEffect } from "react";

interface TerminalInputProps {
  prompt?: string;
  placeholder?: string;
  type?: "text" | "password";
  onSubmit: (value: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
}

const TerminalInput = ({
  prompt = ">",
  placeholder = "",
  type = "text",
  onSubmit,
  autoFocus = true,
  disabled = false,
}: TerminalInputProps) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      onSubmit(value.trim());
      setValue("");
    }
  };

  return (
    <div
      className="flex items-start gap-1.5 sm:gap-2 font-mono text-[12px] sm:text-sm cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <span className="text-accent shrink-0 leading-relaxed pt-[1px]">{prompt}</span>
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-0 bg-transparent border-none outline-none text-foreground font-mono text-[12px] sm:text-sm leading-relaxed p-0 m-0 caret-accent placeholder:text-muted-foreground/40"
        autoFocus={autoFocus}
        disabled={disabled}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TerminalInput;
