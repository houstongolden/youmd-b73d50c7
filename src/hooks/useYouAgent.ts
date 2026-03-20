/**
 * useYouAgent — Surfaces the You Agent's personality in the terminal UI.
 *
 * This hook provides:
 * - Rotating thinking phrases (never repeats in a session)
 * - Context-aware source reactions based on scraped data
 * - Progressive greeting and question logic
 * - Agent-voice response templates
 *
 * See: src/data/agent.md (behavioral spec), src/data/soul.md (voice & tone)
 */

import { useCallback, useRef } from "react";

// --- Thinking Phrases (shuffled per session, never repeated) ---

const THINKING_DISCOVERY = [
  "pulling that up now...",
  "reading through this...",
  "digging into your profile...",
  "interesting — let me look closer...",
  "cross-referencing with what you told me earlier...",
  "scraping that — might take a second...",
  "found some good stuff in here...",
  "this tells me a lot, actually...",
  "connecting some dots...",
  "let me see what's in here...",
];

const THINKING_ANALYSIS = [
  "piecing together your stack...",
  "finding the through-line in your work...",
  "there's a pattern here...",
  "extracting the signal...",
  "looking for what makes you distinct...",
  "synthesizing everything so far...",
  "mapping your expertise graph...",
  "building a timeline from your sources...",
  "reconciling your public and private context...",
  "your writing style says a lot — processing...",
];

const THINKING_IDENTITY = [
  "drafting your context layer...",
  "structuring what i know about you...",
  "writing your identity primitives...",
  "building your you.json...",
  "compiling your source graph...",
  "generating your context snapshot...",
  "weaving your narrative thread...",
  "assembling your identity bundle...",
  "crystallizing your professional identity...",
  "encoding your context for agents...",
];

const THINKING_PORTRAIT = [
  "rendering your portrait...",
  "finding the right character density...",
  "mapping your vibe to ascii...",
  "this portrait's going to be good...",
  "converting pixels to personality...",
];

const THINKING_SYNC = [
  "checking what's changed since last sync...",
  "your github's been busy...",
  "new content detected — reading...",
  "comparing against your current context...",
  "recalculating your freshness score...",
  "pulling the latest from your sources...",
];

export interface ScrapedContext {
  platform: string;
  username: string;
  displayName: string | null;
  bio: string | null;
}

// --- Context-aware source reactions ---

function buildSourceReaction(ctx: ScrapedContext, existingSources: ScrapedContext[]): string {
  const { platform, username, displayName, bio } = ctx;
  const name = displayName || username;
  const sourceCount = existingSources.length;

  if (platform === "github") {
    if (bio) {
      return `${name}'s github bio says "${bio}" — that's a useful signal. let me map your repos and tech stack.`;
    }
    if (displayName) {
      return `found ${displayName} on github. pulling your repos, languages, and contribution patterns.`;
    }
    return `your github tells a story. let me pull the highlights and map your stack.`;
  }

  if (platform === "x") {
    if (displayName && bio) {
      return `${displayName} on x — "${bio.slice(0, 80)}${bio.length > 80 ? "..." : ""}". your tweets say things your other profiles don't.`;
    }
    if (displayName) {
      return `found ${displayName} on x. your feed's a different side of you — pulling the signal from the noise.`;
    }
    return `your twitter's a different lens. extracting the themes and voice.`;
  }

  if (platform === "linkedin") {
    if (displayName && bio) {
      return `${displayName} — "${bio.slice(0, 80)}${bio.length > 80 ? "..." : ""}". linkedin's got the career arc. let me extract the narrative between the roles.`;
    }
    if (displayName) {
      return `found ${displayName} on linkedin. pulling your roles and the story between them.`;
    }
    return `your linkedin's got the professional layer. let me see what the career arc says about you.`;
  }

  return `interesting source. pulling what's relevant for your identity context.`;
}

function buildCrossSourceInsight(newCtx: ScrapedContext, existingSources: ScrapedContext[]): string | null {
  if (existingSources.length === 0) return null;

  const platforms = existingSources.map((s) => s.platform);
  const newName = newCtx.displayName;

  // Cross-referencing observations
  if (newCtx.platform === "github" && platforms.includes("x")) {
    const xSource = existingSources.find((s) => s.platform === "x");
    if (xSource?.displayName && newName) {
      return `interesting — your x presence as ${xSource.displayName} and your github work paint two complementary pictures. the code backs up what you talk about.`;
    }
  }

  if (newCtx.platform === "x" && platforms.includes("github")) {
    return `your github shows what you build, your x shows how you think about it. that's a strong combination for context.`;
  }

  if (newCtx.platform === "linkedin" && platforms.includes("github")) {
    return `linkedin gives me the career narrative, github shows the actual output. i can see the through-line now.`;
  }

  if (newCtx.platform === "linkedin" && platforms.includes("x")) {
    return `your linkedin's the polished version, your x is the real-time version. both are useful — agents need both layers.`;
  }

  if (existingSources.length >= 2) {
    return `that's ${existingSources.length + 1} sources now — your identity context is getting sharper with each one.`;
  }

  return null;
}

// --- Context-aware conversation responses ---

function buildConversationalResponse(userInput: string, existingSources: ScrapedContext[], questionFn: () => string): string {
  const lower = userInput.toLowerCase();
  const hasSources = existingSources.length > 0;
  const names = existingSources.filter((s) => s.displayName).map((s) => s.displayName);
  const bios = existingSources.filter((s) => s.bio).map((s) => s.bio as string);

  // If user mentions building/creating something
  if (/build|creat|mak|ship|launch|found|start/i.test(lower)) {
    if (hasSources && bios.length > 0) {
      return `that tracks with what i see in your profiles — "${bios[0].slice(0, 60)}..." and now this. ${questionFn()}`;
    }
    return `builders think differently. tell me more — what's the thing you're most obsessed with right now?`;
  }

  // If user mentions their role/job
  if (/ceo|founder|engineer|design|market|growth|lead|manag|direct/i.test(lower)) {
    if (hasSources) {
      const platforms = existingSources.map((s) => s.platform).join(", ");
      return `got it — and cross-referencing with your ${platforms} presence, that makes sense. ${questionFn()}`;
    }
    return `noted — that shapes how agents should approach you. ${questionFn()}`;
  }

  // If user is sharing personal values/opinions
  if (/believ|think|care|passion|obsess|love|hate|value/i.test(lower)) {
    return `that's the kind of context that changes how an agent represents you. adding it to your identity layer. ${questionFn()}`;
  }

  // If user gives a short answer
  if (lower.split(/\s+/).length <= 5) {
    if (hasSources && names.length > 0) {
      return `brief but noted. based on what i've pulled from your profiles, ${questionFn()}`;
    }
    return `got it. ${questionFn()}`;
  }

  // Rich contextual fallback
  if (hasSources) {
    const sourceList = existingSources.map((s) => s.platform).join(" and ");
    const options = [
      () => `that adds depth to what i pulled from your ${sourceList}. ${questionFn()}`,
      () => `noted — that's context your ${sourceList} profiles don't capture. exactly what i need. ${questionFn()}`,
      () => `good. i'm weaving that into your identity layer alongside your ${sourceList} data. ${questionFn()}`,
      () => `interesting — that reframes some of what i saw on your ${sourceList}. ${questionFn()}`,
    ];
    return options[Math.floor(Math.random() * options.length)]();
  }

  // No sources yet fallback
  const options = [
    () => `interesting. tell me more about that — how does it connect to what you do day to day?`,
    () => `noted. that's useful context. ${questionFn()}`,
    () => `got it. that changes how i'd describe you to an agent. ${questionFn()}`,
    () => `that's the kind of thing that doesn't show up on a resume. noted. ${questionFn()}`,
  ];
  return options[Math.floor(Math.random() * options.length)]();
}

// --- Progressive Questions ---

const QUESTIONS_L1 = [
  "drop me some links and i'll start building your context.",
  "what do you do? or just paste a link and i'll figure it out.",
  "what's the one thing you want agents to know about you?",
];

const QUESTIONS_L2 = [
  "what are you working on right now that you're excited about?",
  "anything you're building that isn't public yet?",
  "what's the thing you keep coming back to, project-wise?",
  "how would you describe what you do to someone sharp but outside your field?",
];

const QUESTIONS_L3 = [
  "what do you want to be known for?",
  "what do people consistently get wrong about you?",
  "if an agent was representing you in a meeting, what's the one thing it absolutely needs to know?",
  "what's the proudest thing you've built?",
];

const QUESTIONS_L4 = [
  "what drives your work that isn't on any resume?",
  "how do you want to be talked about when you're not in the room?",
  "what's the context that would make every agent interaction better if they just knew it upfront?",
];

// --- Shuffle utility ---
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- Hook ---

export function useYouAgent(username: string) {
  const usedThinking = useRef<Set<string>>(new Set());
  const questionDepth = useRef(0);
  const sourcesAdded = useRef(0);

  // Get a thinking phrase from a category, never repeating in session
  const getThinkingPhrase = useCallback((category: "discovery" | "analysis" | "identity" | "portrait" | "sync") => {
    const pools: Record<string, string[]> = {
      discovery: THINKING_DISCOVERY,
      analysis: THINKING_ANALYSIS,
      identity: THINKING_IDENTITY,
      portrait: THINKING_PORTRAIT,
      sync: THINKING_SYNC,
    };
    const pool = pools[category] || THINKING_DISCOVERY;
    const available = pool.filter((p) => !usedThinking.current.has(p));
    const pick = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : pool[Math.floor(Math.random() * pool.length)];
    usedThinking.current.add(pick);
    return pick;
  }, []);

  // Context-aware source reaction using actual scraped data
  const getSourceReaction = useCallback((ctx: ScrapedContext, existingSources: ScrapedContext[]) => {
    sourcesAdded.current++;
    const reaction = buildSourceReaction(ctx, existingSources);
    const crossInsight = buildCrossSourceInsight(ctx, existingSources);
    return crossInsight ? `${reaction}\n\n${crossInsight}` : reaction;
  }, []);

  // Context-aware conversational response
  const getConversationalResponse = useCallback((userInput: string, existingSources: ScrapedContext[]) => {
    const questionFn = () => {
      const depth = questionDepth.current;
      let pool: string[];
      if (depth < 2) pool = QUESTIONS_L1;
      else if (depth < 5) pool = QUESTIONS_L2;
      else if (depth < 8) pool = QUESTIONS_L3;
      else pool = QUESTIONS_L4;
      questionDepth.current++;
      return shuffle(pool)[0];
    };
    return buildConversationalResponse(userInput, existingSources, questionFn);
  }, []);

  // Get the next question based on conversation depth
  const getNextQuestion = useCallback(() => {
    const depth = questionDepth.current;
    let pool: string[];

    if (depth < 2) pool = QUESTIONS_L1;
    else if (depth < 5) pool = QUESTIONS_L2;
    else if (depth < 8) pool = QUESTIONS_L3;
    else pool = QUESTIONS_L4;

    questionDepth.current++;
    return shuffle(pool)[0];
  }, []);

  // Agent greeting for /initialize
  const getGreeting = useCallback(() => [
    `hey ${username}.`,
    "welcome to you.md — your identity context layer for the agent internet.",
    "",
    "i'm going to help you build your context profile so agents can understand who you are, what you do, and how to work with you.",
    "",
    "drop me some links — linkedin, github, personal site, whatever you've got — and i'll pull context from them.",
  ], [username]);

  // Follow-up after a source is added
  const getSourceFollowUp = useCallback(() => {
    const count = sourcesAdded.current;
    if (count === 1) return "nice. drop another link, or type /done when you're ready to move on.";
    if (count === 2) return "good — building a clearer picture. more links or /done to continue.";
    if (count === 3) return "solid foundation. anything else, or /done?";
    return "got it. /done whenever you're ready.";
  }, []);

  // Agent done/wrap message
  const getDoneMessage = useCallback(() => [
    "building your identity context from everything you've given me...",
  ], []);

  const getDoneResult = useCallback(() => [
    `identity context initialized.`,
    "",
    `your profile is live at you.md/${username}`,
    "entering shell environment...",
  ], [username]);

  return {
    getThinkingPhrase,
    getSourceReaction,
    getConversationalResponse,
    getNextQuestion,
    getGreeting,
    getSourceFollowUp,
    getDoneMessage,
    getDoneResult,
  };
}
