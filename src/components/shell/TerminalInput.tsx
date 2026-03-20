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

  const displayValue = type === "password" ? "•".repeat(value.length) : value;

  return (
    <div
      className="flex items-center gap-1.5 sm:gap-2 font-mono text-[12px] sm:text-sm cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <span className="text-accent shrink-0">{prompt}</span>
      <div className="relative flex-1 min-w-0">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 opacity-0 w-full"
          autoFocus={autoFocus}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
        />
        <span className="text-foreground break-all">{displayValue}</span>
        {!disabled && (
          <span className="cursor-blink text-accent ml-[1px]">█</span>
        )}
        {!value && placeholder && (
          <span className="text-muted-foreground/40 absolute left-0 top-0 pointer-events-none">
            {placeholder}
          </span>
        )}
      </div>
    </div>
  );
};

export default TerminalInput;
