export interface Profile {
  username: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  voice: string;
  bio: string;
  goals: { current: string; next: string };
  tools: { primary: string; infra: string };
  preferences: { format: string; length: string };
  links: { label: string; url: string }[];
  tags: string[];
}

export const sampleProfiles: Profile[] = [
  {
    username: "alexchen",
    name: "Alex Chen",
    role: "Product designer & founder",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    voice: "Direct, warm, no jargon",
    bio: "Building tools that make AI agents understand humans better. Previously design lead at Figma. Obsessed with developer experience and type systems.",
    goals: { current: "Ship v2 by March", next: "Close seed round" },
    tools: { primary: "Cursor, Claude Code", infra: "Vercel, Supabase" },
    preferences: { format: "Bullet points over paragraphs", length: "Concise — max 3 paragraphs" },
    links: [
      { label: "Website", url: "#" },
      { label: "GitHub", url: "#" },
      { label: "Twitter", url: "#" },
    ],
    tags: ["design", "founder", "ai-tools", "typescript"],
  },
  {
    username: "priya",
    name: "Priya Sharma",
    role: "ML engineer @ Anthropic",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    voice: "Technical but approachable, loves analogies",
    bio: "Research engineer focused on RLHF and alignment. I think in probability distributions. Weekend ceramicist.",
    goals: { current: "Publish alignment paper Q2", next: "Open-source eval framework" },
    tools: { primary: "PyTorch, VS Code", infra: "AWS, Weights & Biases" },
    preferences: { format: "Structured with headers", length: "As long as needed for precision" },
    links: [
      { label: "Scholar", url: "#" },
      { label: "GitHub", url: "#" },
    ],
    tags: ["ml-research", "alignment", "python", "open-source"],
  },
  {
    username: "jmarcus",
    name: "Jordan Marcus",
    role: "Indie hacker & solopreneur",
    location: "Austin, TX",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    voice: "Casual, emoji-friendly, shipping energy",
    bio: "Building micro-SaaS products in public. 3 exits, 12 failed projects, infinite lessons. Currently running ScreenshotAPI and TinyInvoice.",
    goals: { current: "Hit $20k MRR across products", next: "Launch AI writing tool" },
    tools: { primary: "Next.js, Tailwind", infra: "Railway, Planetscale" },
    preferences: { format: "Short paragraphs, lots of examples", length: "Keep it tweet-length when possible" },
    links: [
      { label: "Twitter", url: "#" },
      { label: "Blog", url: "#" },
      { label: "Products", url: "#" },
    ],
    tags: ["indie-hacker", "saas", "building-in-public", "nextjs"],
  },
  {
    username: "sato.yuki",
    name: "Yuki Sato",
    role: "Staff engineer @ Stripe",
    location: "Tokyo, Japan",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    voice: "Precise, systems-thinking, dry humor",
    bio: "Distributed systems at scale. I care about correctness, observability, and well-written RFCs. Maintaining two popular open-source Rust crates.",
    goals: { current: "Migrate payment routing to new architecture", next: "Write a technical book" },
    tools: { primary: "Rust, Go, Neovim", infra: "AWS, Terraform, Datadog" },
    preferences: { format: "RFC-style with tradeoff analysis", length: "Thorough — I value completeness" },
    links: [
      { label: "GitHub", url: "#" },
      { label: "Blog", url: "#" },
    ],
    tags: ["systems", "rust", "distributed", "open-source"],
  },
  {
    username: "emmawright",
    name: "Emma Wright",
    role: "Creative director & brand strategist",
    location: "Brooklyn, NY",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    voice: "Visual thinker, storytelling-first, bold opinions",
    bio: "I make brands feel like they have a soul. Working with startups and cultural institutions. Previously at Pentagram. Strong feelings about kerning.",
    goals: { current: "Launch rebrand for a climate tech startup", next: "Teach a brand workshop series" },
    tools: { primary: "Figma, After Effects", infra: "Notion, Are.na" },
    preferences: { format: "Visual moodboards + concise briefs", length: "Enough to spark — not to lecture" },
    links: [
      { label: "Portfolio", url: "#" },
      { label: "Instagram", url: "#" },
      { label: "Are.na", url: "#" },
    ],
    tags: ["branding", "design", "creative-direction", "storytelling"],
  },
  {
    username: "kai",
    name: "Kai Andersen",
    role: "DevRel lead @ Vercel",
    location: "Copenhagen, Denmark",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    voice: "Enthusiastic, educational, community-driven",
    bio: "Helping developers build faster. Conference speaker, tutorial creator, and eternal optimist about the web platform. 50k+ YouTube subscribers.",
    goals: { current: "Launch new docs platform", next: "Keynote at React Conf" },
    tools: { primary: "Next.js, MDX, OBS", infra: "Vercel, GitHub, Loom" },
    preferences: { format: "Step-by-step with code examples", length: "Tutorial-length for learning, tweet-length for updates" },
    links: [
      { label: "YouTube", url: "#" },
      { label: "Twitter", url: "#" },
      { label: "GitHub", url: "#" },
    ],
    tags: ["devrel", "nextjs", "content-creator", "speaking"],
  },
];
