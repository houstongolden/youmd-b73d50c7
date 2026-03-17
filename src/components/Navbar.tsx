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
    setScrolled(window.scrollY > 40);

    // Find active section
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

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ease-out ${
          scrolled ? "bg-dusk/70 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
          <a href="/" className="text-sand font-display text-lg font-medium tracking-tight">
            You.md
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {sections.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`text-sm transition-colors duration-200 ${
                  activeSection === id ? "text-teal" : "text-sand/60 hover:text-sand"
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#get-started"
              className="hidden md:inline-block bg-teal text-dusk text-sm font-medium px-5 py-2.5 rounded-lg hover:brightness-110 transition-all duration-200"
            >
              Get your You.md
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-sand p-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-dusk/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 animate-fade-in">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMobileOpen(false)}
              className={`text-2xl font-display font-light transition-colors duration-200 ${
                activeSection === id ? "text-teal" : "text-sand/70 hover:text-sand"
              }`}
            >
              {label}
            </a>
          ))}
          <a
            href="#get-started"
            onClick={() => setMobileOpen(false)}
            className="bg-teal text-dusk font-medium px-7 py-3 rounded-lg text-sm mt-4"
          >
            Get your You.md
          </a>
        </div>
      )}
    </>
  );
};

export default Navbar;
