import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  { id: "how-it-works", label: "how-it-works" },
  { id: "pricing", label: "pricing" },
  { id: "spec", label: "spec" },
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
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:pt-4">
        <div
          className={`max-w-3xl mx-auto flex items-center justify-between gap-6 px-4 py-2 transition-all duration-500 rounded-lg ${
            scrolled ? "glass-scrolled" : "bg-transparent"
          }`}
        >
          <a href="/" className="text-green font-mono text-[13px] font-medium tracking-tight whitespace-nowrap">
            <span className="text-mist">~/</span>you.md
          </a>

          <div className="hidden md:flex items-center gap-6">
            {sections.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`text-[11px] font-mono transition-colors duration-200 ${
                  activeSection === id
                    ? "text-green"
                    : "text-mist/60 hover:text-mist"
                }`}
              >
                --{label}
              </a>
            ))}
            <Link
              to="/profiles"
              className="text-[11px] font-mono text-mist/60 hover:text-cyan transition-colors"
            >
              /profiles
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#get-started"
              className="hidden md:inline-block cta-green px-4 py-1.5 text-[11px]"
            >
              $ claim username
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-mist p-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-void/98 backdrop-blur-xl flex flex-col items-center justify-center gap-6">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMobileOpen(false)}
              className={`text-lg font-mono transition-colors duration-200 ${
                activeSection === id ? "text-green" : "text-mist/60 hover:text-foreground"
              }`}
            >
              --{label}
            </a>
          ))}
          <Link
            to="/profiles"
            onClick={() => setMobileOpen(false)}
            className="text-lg font-mono text-mist/60 hover:text-cyan transition-colors"
          >
            /profiles
          </Link>
          <a
            href="#get-started"
            onClick={() => setMobileOpen(false)}
            className="cta-green px-7 py-3 text-sm mt-4"
          >
            $ claim username
          </a>
        </div>
      )}
    </>
  );
};

export default Navbar;
