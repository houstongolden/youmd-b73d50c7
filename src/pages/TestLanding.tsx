import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ufoImage from "@/assets/ufo-abduction.png";

const BlinkingCursor = () => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      className="inline-block w-3 h-5 bg-primary align-middle"
      style={{ opacity: visible ? 1 : 0 }}
    />
  );
};

const Star = ({ x, y, char }: { x: string; y: string; char: string }) => (
  <span
    className="absolute text-primary/50 font-mono text-sm select-none"
    style={{ left: x, top: y }}
  >
    {char}
  </span>
);

const TestLanding = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    { label: "enter app", to: "/create" },
    { label: "view docs", to: "/profiles" },
    { label: "github", to: "https://github.com" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Top command line */}
      <div className="absolute top-6 left-6 md:top-8 md:left-10 font-mono text-primary text-sm md:text-base">
        <span className="text-primary/60">&gt;</span> npx youmd init
      </div>

      {/* Dotted separator line */}
      <div className="absolute top-12 md:top-14 left-6 right-6 md:left-10 md:right-10 border-t border-dotted border-primary/30" />

      {/* Main content */}
      <div className="flex flex-col items-center gap-2 mt-8">
        {/* UFO illustration with stars */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          <Star x="10%" y="15%" char="*" />
          <Star x="85%" y="10%" char="+" />
          <Star x="5%" y="55%" char="+" />
          <Star x="92%" y="50%" char="+" />
          <Star x="25%" y="5%" char="*" />
          <Star x="75%" y="75%" char="*" />
          <Star x="15%" y="80%" char="x" />
          <Star x="88%" y="80%" char="x" />
          <img
            src={ufoImage}
            alt="UFO beaming up astronaut - pixel art"
            className="w-full h-full object-contain"
            width={800}
            height={800}
          />
        </div>

        {/* Dotted separator */}
        <div className="w-64 md:w-80 border-t border-dotted border-primary/30 my-2" />

        {/* YOU.MD title - pixel font style */}
        <h1
          className="font-mono text-primary text-4xl md:text-6xl font-black tracking-wider"
          style={{ fontFamily: '"Courier New", monospace', letterSpacing: "0.08em" }}
        >
          YOU.MD
        </h1>

        {/* Subtitle */}
        <p className="font-mono text-primary/70 text-sm md:text-base mt-1">
          your identity file for the agent internet
        </p>

        {/* Menu items */}
        <nav className="mt-10 flex flex-col gap-3 font-mono text-primary text-lg md:text-xl">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group flex items-center gap-2 hover:text-primary/80 transition-colors"
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span className="text-primary/60">&gt;</span>
              <span className={hoveredItem === item.label ? "underline underline-offset-4" : ""}>
                {item.label}
              </span>
            </Link>
          ))}

          {/* Blinking cursor line */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-primary/60">&gt;</span>
            <BlinkingCursor />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default TestLanding;
