export interface Profile {
  username: string;
  name: string;
  tagline: string;
  location: string;
  voice: string;
  bio: {
    short: string;
    medium: string;
  };
  now: string[];
  projects: { name: string; role: string; status: string; description: string }[];
  values: string[];
  preferences: {
    tone: string;
    formality: string;
    avoid: string[];
    format: string;
  };
  links: { label: string; url: string }[];
  topics: string[];
  credibility: string[];
}

export const sampleProfiles: Profile[] = [
  {
    username: "houston",
    name: "Houston Golden",
    tagline: "Founder, BAMF Media. Building You.md.",
    location: "Miami, FL",
    voice: "Direct, high-energy, founder-coded.",
    bio: {
      short: "Founder building identity infrastructure for the agent internet.",
      medium: "Founded BAMF Media (8-figure growth agency), LinkedIn growth pioneer. Now building You.md — the identity file standard for the agent internet. I ship fast and build in public.",
    },
    now: ["Building You.md", "Scaling BAMF Media"],
    projects: [
      { name: "You.md", role: "Founder", status: "building", description: "Identity as code for the agent internet." },
      { name: "BAMF Media", role: "Founder/CEO", status: "active", description: "Growth marketing agency." },
    ],
    values: ["Build in public", "Extreme ownership", "Ship fast"],
    preferences: {
      tone: "direct, confident, no fluff",
      formality: "casual-professional",
      avoid: ["corporate jargon", "passive voice"],
      format: "short paragraphs, punchy sentences",
    },
    links: [
      { label: "Website", url: "https://houstongolden.com" },
      { label: "LinkedIn", url: "https://linkedin.com/in/houstongolden" },
      { label: "X", url: "https://x.com/houstongolden" },
    ],
    topics: ["growth marketing", "AI agents", "identity protocols"],
    credibility: ["Founded BAMF Media (8-figure agency)", "LinkedIn growth pioneer"],
  },
  {
    username: "priya",
    name: "Priya Sharma",
    tagline: "ML engineer @ Anthropic. Alignment researcher.",
    location: "London, UK",
    voice: "Technical but approachable, loves analogies.",
    bio: {
      short: "Research engineer focused on RLHF and alignment.",
      medium: "ML engineer at Anthropic working on RLHF and alignment research. I think in probability distributions and communicate in analogies. Weekend ceramicist. Published 12 papers on reward modeling.",
    },
    now: ["Publishing alignment paper Q2", "Open-sourcing eval framework"],
    projects: [
      { name: "Reward Landscapes", role: "Lead researcher", status: "publishing", description: "Novel approach to multi-objective reward modeling." },
      { name: "EvalKit", role: "Creator", status: "building", description: "Open-source LLM evaluation framework." },
    ],
    values: ["Rigorous thinking", "Open science", "Making AI safe"],
    preferences: {
      tone: "precise, curious, grounded",
      formality: "academic-casual",
      avoid: ["hype language", "unsubstantiated claims"],
      format: "structured with headers, as long as needed for precision",
    },
    links: [
      { label: "Scholar", url: "#" },
      { label: "GitHub", url: "#" },
    ],
    topics: ["RLHF", "alignment", "reward modeling", "open-source ML"],
    credibility: ["ML Engineer at Anthropic", "12 published papers on reward modeling"],
  },
  {
    username: "jmarcus",
    name: "Jordan Marcus",
    tagline: "Indie hacker. 3 exits. Building in public.",
    location: "Austin, TX",
    voice: "Casual, emoji-friendly, shipping energy.",
    bio: {
      short: "Building micro-SaaS products in public.",
      medium: "3 exits, 12 failed projects, infinite lessons. Currently running ScreenshotAPI ($8k MRR) and TinyInvoice ($4k MRR). I document everything and believe the best marketing is building in public.",
    },
    now: ["Hit $20k MRR across products", "Launch AI writing tool"],
    projects: [
      { name: "ScreenshotAPI", role: "Solo founder", status: "active", description: "Website screenshot API. $8k MRR." },
      { name: "TinyInvoice", role: "Solo founder", status: "active", description: "Invoice generator for freelancers. $4k MRR." },
    ],
    values: ["Ship daily", "Revenue over fundraising", "Transparency"],
    preferences: {
      tone: "casual, encouraging, practical",
      formality: "very casual",
      avoid: ["corporate speak", "long intros"],
      format: "short paragraphs, lots of examples, tweet-length when possible",
    },
    links: [
      { label: "X", url: "#" },
      { label: "Blog", url: "#" },
      { label: "Products", url: "#" },
    ],
    topics: ["indie hacking", "micro-SaaS", "building in public", "solopreneurship"],
    credibility: ["3 successful exits", "$12k+ combined MRR across products"],
  },
  {
    username: "sato.yuki",
    name: "Yuki Sato",
    tagline: "Staff engineer @ Stripe. Distributed systems.",
    location: "Tokyo, Japan",
    voice: "Precise, systems-thinking, dry humor.",
    bio: {
      short: "Distributed systems at scale. Correctness over cleverness.",
      medium: "Staff engineer at Stripe working on payment routing infrastructure. I care about correctness, observability, and well-written RFCs. Maintaining two popular open-source Rust crates with 5k+ combined stars.",
    },
    now: ["Migrating payment routing to new architecture", "Writing a technical book on distributed systems"],
    projects: [
      { name: "tokio-retry", role: "Maintainer", status: "active", description: "Retry middleware for Tokio. 3.2k stars." },
      { name: "serde-diff", role: "Creator", status: "active", description: "Structural diffing for Serde types. 1.8k stars." },
    ],
    values: ["Correctness first", "Write it down", "Mentor generously"],
    preferences: {
      tone: "precise, thorough, occasionally wry",
      formality: "professional",
      avoid: ["hand-waving", "premature optimization claims"],
      format: "RFC-style with tradeoff analysis, thorough",
    },
    links: [
      { label: "GitHub", url: "#" },
      { label: "Blog", url: "#" },
    ],
    topics: ["distributed systems", "Rust", "observability", "payment infrastructure"],
    credibility: ["Staff Engineer at Stripe", "5k+ stars on open-source Rust crates"],
  },
  {
    username: "emmawright",
    name: "Emma Wright",
    tagline: "Creative director. Brand strategist. Strong feelings about kerning.",
    location: "Brooklyn, NY",
    voice: "Visual thinker, storytelling-first, bold opinions.",
    bio: {
      short: "Making brands feel like they have a soul.",
      medium: "Creative director working with startups and cultural institutions. Previously at Pentagram. I believe every brand has a story worth telling — most just haven't found the right words yet. Strong feelings about kerning.",
    },
    now: ["Launching rebrand for a climate tech startup", "Teaching brand workshop series"],
    projects: [
      { name: "Canopy Rebrand", role: "Creative Director", status: "building", description: "Full brand identity for climate tech startup." },
      { name: "Brand Bones", role: "Instructor", status: "launching", description: "Workshop series on brand fundamentals." },
    ],
    values: ["Story over aesthetics", "Bold over safe", "Details matter"],
    preferences: {
      tone: "warm, opinionated, visual",
      formality: "casual-creative",
      avoid: ["bland corporate language", "design-by-committee thinking"],
      format: "visual moodboards + concise briefs, enough to spark — not to lecture",
    },
    links: [
      { label: "Portfolio", url: "#" },
      { label: "Instagram", url: "#" },
      { label: "Are.na", url: "#" },
    ],
    topics: ["brand strategy", "creative direction", "visual identity", "storytelling"],
    credibility: ["Previously at Pentagram", "Worked with 40+ startups on brand identity"],
  },
  {
    username: "kai",
    name: "Kai Andersen",
    tagline: "DevRel lead @ Vercel. 50k YouTube subscribers.",
    location: "Copenhagen, Denmark",
    voice: "Enthusiastic, educational, community-driven.",
    bio: {
      short: "Helping developers build faster.",
      medium: "DevRel lead at Vercel. Conference speaker, tutorial creator, and eternal optimist about the web platform. 50k+ YouTube subscribers. I believe the best docs are the ones people actually enjoy reading.",
    },
    now: ["Launching new docs platform", "Keynote prep for React Conf"],
    projects: [
      { name: "Vercel Docs v3", role: "Lead", status: "building", description: "Next-gen documentation platform." },
      { name: "Ship It", role: "Host", status: "active", description: "YouTube series on web dev. 50k subs." },
    ],
    values: ["Teach by building", "Community first", "Make it fun"],
    preferences: {
      tone: "enthusiastic, clear, encouraging",
      formality: "casual",
      avoid: ["gatekeeping language", "unnecessary jargon"],
      format: "step-by-step with code examples",
    },
    links: [
      { label: "YouTube", url: "#" },
      { label: "X", url: "#" },
      { label: "GitHub", url: "#" },
    ],
    topics: ["developer relations", "Next.js", "web platform", "content creation"],
    credibility: ["DevRel Lead at Vercel", "50k+ YouTube subscribers"],
  },
];
