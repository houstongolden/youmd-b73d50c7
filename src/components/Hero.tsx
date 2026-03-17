import { motion } from "framer-motion";
import heroImage from "@/assets/hero-beam.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-end justify-center overflow-hidden">
      {/* Full-bleed hero image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="A figure standing in a beam of light, surrendering to unseen intelligence"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 text-center pb-24 md:pb-32 px-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-foreground text-4xl md:text-6xl lg:text-7xl font-display font-light tracking-tight mb-5"
        >
          Your identity file for the agent internet.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="text-muted-foreground text-base md:text-lg mb-10 max-w-xl mx-auto"
        >
          You.md is a structured identity bundle — context, preferences, voice, and goals — that travels with you across every AI interaction.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#get-started"
            className="bg-teal text-dusk font-medium px-7 py-3 rounded-lg text-sm hover:brightness-110 transition-all duration-200"
          >
            Get your You.md
          </a>
          <a
            href="#spec"
            className="border border-foreground/20 text-foreground font-medium px-7 py-3 rounded-lg text-sm hover:border-foreground/40 transition-all duration-200"
          >
            See the spec
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
