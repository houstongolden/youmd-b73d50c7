import { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ease-out ${
        scrolled ? "bg-background/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <a href="/" className="text-foreground font-display text-lg font-medium tracking-tight">
          You.md
        </a>

        <div className="hidden md:flex items-center gap-10">
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200">
            How it works
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200">
            Pricing
          </a>
          <a href="#spec" className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200">
            Spec
          </a>
        </div>

        <a
          href="#get-started"
          className="bg-teal text-dusk text-sm font-medium px-5 py-2.5 rounded-lg hover:brightness-110 transition-all duration-200"
        >
          Get your You.md
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
