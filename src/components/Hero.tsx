import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroWarm from "@/assets/hero-beam.png";
import heroCool from "@/assets/hero-beam-cool.png";

const Hero = () => {
  const { scrollY } = useScroll();
  const coolOpacity = useTransform(scrollY, [0, 600], [0, 1]);
  const parallaxY = useTransform(scrollY, [0, 800], [0, 120]);

  return (
    <section className="relative h-screen flex items-end justify-center overflow-hidden">
      {/* Warm hero (default) */}
      <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
        <img
          src={heroWarm}
          alt="A figure standing in a warm beam of light"
          className="w-full h-full object-cover scale-110"
        />
      </motion.div>

      {/* Cool hero (scroll reveal) */}
      <motion.div className="absolute inset-0" style={{ opacity: coolOpacity, y: parallaxY }}>
        <img
          src={heroCool}
          alt=""
          className="w-full h-full object-cover scale-110"
        />
      </motion.div>

      {/* Bottom gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-dusk/60 via-transparent to-transparent" />

      {/* Content overlay */}
      <div className="relative z-10 text-center pb-20 md:pb-28 px-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="text-sand text-4xl md:text-6xl lg:text-7xl font-display font-light tracking-tight mb-5 drop-shadow-lg"
        >
          Your identity file for the agent internet.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
          className="text-sand/70 text-base md:text-lg mb-10 max-w-xl mx-auto drop-shadow-md"
        >
          You.md is a structured identity bundle — context, preferences, voice, and goals — that travels with you across every AI interaction.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
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
            className="border border-sand/30 text-sand font-medium px-7 py-3 rounded-lg text-sm hover:border-sand/50 transition-all duration-200 backdrop-blur-sm"
          >
            See the spec
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
