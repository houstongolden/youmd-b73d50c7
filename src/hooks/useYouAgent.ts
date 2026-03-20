/**
 * useYouAgent — Surfaces the You Agent's personality in the terminal UI.
 *
 * This hook provides:
 * - Rotating thinking phrases (never repeats in a session)
 * - Source reactions (comments on what was found)
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

// --- Source Reactions (agent comments on what it found) ---

const SOURCE_REACTIONS_GITHUB = [
  (username: string) => `your github tells a story — lots of ${username.length > 5 ? "focused" : "varied"} repos. let me pull the highlights.`,
  () => "interesting commit history — you've been building consistently.",
  () => "good repos in here. pulling your most active projects and tech stack.",
];

const SOURCE_REACTIONS_LINKEDIN = [
  () => "your linkedin's got some solid experience. let me extract the narrative.",
  () => "interesting career path — i see a few pivots. that's usually where the good stuff is.",
  () => "pulling your roles and the story between them.",
];

const SOURCE_REACTIONS_TWITTER = [
  () => "your twitter's a different side of you — pulling the signal from the noise.",
  () => "interesting feed. your tweets say things your linkedin doesn't.",
  () => "good threads in here. extracting the themes.",
];

const SOURCE_REACTIONS_BLOG = [
  () => "your writing's revealing — processing the themes.",
  () => "good content. your blog tells me more than most profiles would.",
  () => "interesting perspective in your posts. pulling the key ideas.",
];

const SOURCE_REACTIONS_GENERIC = [
  () => "reading through this now...",
  () => "found some useful context in here.",
  () => "interesting — adding this to your identity graph.",
  () => "good source. pulling what's relevant.",
  () => "this fills in some gaps. nice.",
];

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

  // Get a source-specific reaction based on URL
  const getSourceReaction = useCallback((url: string) => {
    const lower = url.toLowerCase();
    let pool: Array<(u: string) => string>;

    if (lower.includes("github.com")) pool = SOURCE_REACTIONS_GITHUB;
    else if (lower.includes("linkedin.com")) pool = SOURCE_REACTIONS_LINKEDIN;
    else if (lower.includes("twitter.com") || lower.includes("x.com")) pool = SOURCE_REACTIONS_TWITTER;
    else if (lower.includes("blog") || lower.includes("substack") || lower.includes("medium.com")) pool = SOURCE_REACTIONS_BLOG;
    else pool = SOURCE_REACTIONS_GENERIC;

    sourcesAdded.current++;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return pick(username);
  }, [username]);

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
    getNextQuestion,
    getGreeting,
    getSourceFollowUp,
    getDoneMessage,
    getDoneResult,
  };
}
