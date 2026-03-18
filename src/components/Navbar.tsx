import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";

const sections = [
  { id: "how-it-works", label: "How it works" },
  { id: "pricing", label: "Pricing" },
  { id: "spec", label: "Spec" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 40);
    const offsets = sections.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return { id, top: Infinity };
      return { id, top: el.getBoundingClientRect().top };
    });
    const active = offsets.find((o) => o.top > -200 && o.top < 400);
    setActiveSection(active?.id ?? "");
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3 md:pt-4">
        <div
          className={`rounded-full flex items-center justify-between gap-6 px-5 py-2 w-full max-w-2xl transition-all duration-500 ${
            scrolled
              ? "glass-scrolled"
              : "bg-transparent"
          }`}
        >
          <a href="/" className="text-foreground font-display text-[15px] font-medium tracking-tight whitespace-nowrap">
            You.md
          </a>

          <div className="hidden md:flex items-center gap-7">
            {sections.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`text-[11px] uppercase tracking-[0.08em] font-medium transition-colors duration-200 ${
                  activeSection === id
                    ? "text-teal"
                    : "text-foreground/50 hover:text-foreground/80"
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#get-started"
              className="hidden md:inline-block cta-teal px-5 py-1.5 text-[11px] tracking-wide"
            >
              Claim your username
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-foreground/70 p-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMobileOpen(false)}
              className={`text-2xl font-display font-light transition-colors duration-200 ${
                activeSection === id ? "text-teal" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {label}
            </a>
          ))}
          <a
            href="#get-started"
            onClick={() => setMobileOpen(false)}
            className="cta-teal px-7 py-3 text-sm mt-4"
          >
            Claim your username
          </a>
        </div>
      )}
    </>
  );
};

export default Navbar;
