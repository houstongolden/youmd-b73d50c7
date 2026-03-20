# You.md — Product Requirements Document

> **Version:** 2.0  
> **Last updated:** 2026-03-20  
> **Status:** In Development (~60-65% V1 complete)  
> **Founder:** Houston Golden  
> **Live URL:** https://youmd.lovable.app

---

## Table of Contents

1. [Vision & Mission](#1-vision--mission)
2. [Problem Statement](#2-problem-statement)
3. [Target Users](#3-target-users)
4. [Product Principles](#4-product-principles)
5. [Core Concepts](#5-core-concepts)
6. [User Flows](#6-user-flows)
7. [System Architecture](#7-system-architecture)
8. [Data Model](#8-data-model)
9. [Feature Specifications](#9-feature-specifications)
10. [Agent System](#10-agent-system)
11. [Security Model](#11-security-model)
12. [Open Protocol (you/v1)](#12-open-protocol-youv1)
13. [Pricing Model](#13-pricing-model)
14. [Landing Page & Marketing](#14-landing-page--marketing)
15. [Technical Stack](#15-technical-stack)
16. [Current Build Status](#16-current-build-status)
17. [Roadmap](#17-roadmap)
18. [Success Metrics](#18-success-metrics)
19. [Appendices](#19-appendices)

---

## 1. Vision & Mission

### Vision
**You.md is the identity context protocol for the agent internet.**

Every AI agent a person interacts with starts from scratch — no memory, no context, no understanding of who you are. You.md fixes that. One file, one link, full context. Every agent knows you instantly.

### Mission
Build the standard identity format that humans author and machines consume. A single, portable, open identity layer that travels with you across every AI tool, agent, and workflow.

### North Star
> "After interacting with your you.md, an agent should know who you are, what you do, how you work, and what matters to you — without asking a single question."

### Tagline
**Identity context protocol. MCP for your identity.**

---

## 2. Problem Statement

### The Problem
Every AI agent starts from a blank slate. Users re-explain themselves endlessly:
- **Lost context between tools** — Claude doesn't know what you told ChatGPT
- **Agents that forget everything** — every session resets to zero
- **Re-explain who you are** — name, role, preferences, projects, values — over and over

### The Pain
Users shouldn't have to onboard *themselves* to their own tools. The current state is like introducing yourself at every meeting in your own office.

### The Solution
**One link. Full context. Every agent.**

You.md creates a structured identity file that any agent can read. It contains who you are, what you build, how you like to work, what you care about — authored by you, readable by machines.

### Why Now
- AI agents are proliferating (Claude, GPT, Cursor, Copilot, Perplexity, CrewAI, etc.)
- MCP (Model Context Protocol) is establishing standards for agent context
- No standard exists for *personal* identity context
- The "blank slate" problem gets worse with every new agent tool

---

## 3. Target Users

### Primary: Builders & Power Users
- **Founders / CEOs** — manage identity across investor meetings, agent workflows, public presence
- **Engineers / Staff+ ICs** — maintain context across coding agents (Cursor, Copilot, Claude Code)
- **Indie hackers / Creators** — consistent identity across content, products, communities
- **DevRel / Developer advocates** — public identity that agents can reference accurately

### Secondary: Knowledge Workers
- Anyone who uses 2+ AI agents regularly and is tired of repeating themselves

### User Archetype
Someone who:
- Uses AI agents daily in their work
- Has context scattered across LinkedIn, GitHub, X, personal sites
- Wants control over how they're represented to machines
- Values ownership and portability over convenience

---

## 4. Product Principles

### 1. Create First, Auth Later
Users get value before they create an account. Profile creation requires zero authentication. Auth is only needed to claim ownership and unlock private features.

### 2. Conversation Over Forms
Identity is built through dialogue with the You Agent, not through form fields. The agent asks questions, scrapes sources, and synthesizes — the user just talks.

### 3. Terminal-Native Aesthetic
The product lives in a terminal/CLI paradigm. Monospaced type, command-line interactions, ASCII portraits. This isn't a design choice — it's a statement: identity as code.

### 4. Open & Portable
The `you/v1` protocol is open. No vendor lock-in. Users own their data. They can export, self-host, or fork. Identity belongs to the user, not the platform.

### 5. Public by Default, Private by Choice
Public identity is always accessible. Private context (projects, notes, sensitive data) requires explicit authorization. The boundary is strict and enforced.

### 6. Agents Are First-Class Citizens
The product is designed for machine consumption first, human readability second. Every feature asks: "How does this help an agent understand this person better?"

---

## 5. Core Concepts

### Identity Bundle
A structured collection of identity primitives that fully represent a person to AI agents:

| Primitive | Description | Example |
|-----------|-------------|---------|
| **Identity** | Name, username, tagline, location | `Houston Golden · Miami, FL` |
| **Bio** | Short and medium-length self-descriptions | 1-liner and paragraph versions |
| **Voice** | Tone, formality, preferences, avoid-list | `direct, warm, no jargon` |
| **Now** | Current focus areas and active projects | `building you.md, scaling BAMF Media` |
| **Values** | Core principles and beliefs | `ship fast, build in public` |
| **Links** | Connected platforms and websites | LinkedIn, GitHub, X, personal site |
| **Topics** | Areas of expertise and interest | `AI agents, growth marketing, identity` |
| **Credibility** | Achievements, credentials, track record | `YC W21, 8-figure agency` |
| **Projects** | Active and past work with context | Name, role, status, description |
| **Preferences** | How agents should interact | Tone, format, things to avoid |

### ASCII Portrait
A distinctive visual representation of the user rendered in ASCII characters from their profile photo. This is the user's "identity in code" — recognizable, unique, and aligned with the terminal-native aesthetic.

### Context Freshness
A score (0-100) measuring how current a profile's data is, based on:
- Time since last source sync
- Staleness of individual data sections (identity, projects, voice, sources)
- Recency of user edits

### Identity State
The system tracks the maturity of a user's identity context:
- **Memory Coverage** — how much of the person's identity has been captured (high/medium/low)
- **Voice Profile** — whether the system has enough data to replicate their tone (trained/partial/untrained)
- **Context Freshness** — how current the data is (current/stale/outdated)

---

## 6. User Flows

### 6.1 Create-First Onboarding (Primary Flow)

```
Landing Page → "Create Profile" CTA → /create
                                         ↓
                              Terminal: Pick username
                                         ↓
                              Profile created in DB (no auth)
                                         ↓
                              Agent greets user, asks for links
                                         ↓
                              User pastes X/GitHub/LinkedIn URLs
                                         ↓
                              Scraper fetches profile data + photo
                                         ↓
                              ASCII portrait generated from real photo
                                         ↓
                              Agent reacts to findings, asks deeper questions
                                         ↓
                              User types /done
                                         ↓
                              Profile page renders (magic moment ✨)
                                         ↓
                              ClaimBanner: "Sign in to own this profile"
                                         ↓
                              (Optional) User signs up → Profile claimed
```

**Key property:** The user sees their live profile *before* creating an account. This is the magic moment.

### 6.2 Returning User (Shell)

```
Auth → /shell (loads user's owned profile from DB)
           ↓
     Split view: Terminal (left 35%) | Preview (right 65%)
           ↓
     Agent is proactive — asks questions, suggests improvements
           ↓
     User can:
       - Paste links (scraped + added to sources)
       - Chat naturally (context extracted + stored)
       - Use slash commands (/profile, /settings, /tokens, etc.)
       - Toggle public/private preview
       - Manage tokens, sources, settings
```

### 6.3 Claim Flow

```
Visitor views unclaimed profile → ClaimBanner shown
           ↓
     "Claim this profile" → redirects to /auth with profile ID
           ↓
     User signs up or signs in
           ↓
     claim-profile edge function fires:
       - Sets owner_id = auth.uid()
       - Sets is_claimed = true
       - Sets claimed_at = now()
       - Creates private_contexts row
       - Logs security event
           ↓
     Redirect to /shell with claimed profile
```

### 6.4 Agent Access Flow

```
External agent makes request → /validate-token endpoint
           ↓
     Token validated (hash match, not expired, not revoked)
           ↓
     Scopes checked (read / write)
           ↓
     Returns:
       - Public profile data (always)
       - Private context (if read scope + valid token)
           ↓
     Logs access event in security_logs
```

### 6.5 Profile Viewing

```
Anyone visits you.md/username → /profile/:username
           ↓
     DB query for profile + sources + verifications
           ↓
     Renders public view:
       - ASCII portrait header
       - Identity (name, tagline, bio, location)
       - Current focus (/now)
       - Projects
       - Connected sources
       - Agent metrics
       - Values, preferences
       - Raw JSON toggle
           ↓
     If unclaimed: ClaimBanner shown
     If viewer is owner: edit capabilities
     Report button always available
```

---

## 7. System Architecture

### Frontend
```
React (Vite + TypeScript + Tailwind)
├── Landing Page (/)
│   ├── Navbar, Hero, FounderQuote, ProfilesShowcase
│   ├── ProblemStrip, HowItWorks, WhatsInside
│   ├── PortraitSection, OpenSpec, Integrations
│   ├── Pricing, CTAFooter
│   └── ThemeToggle (dark/light)
├── Create Profile (/create)
│   └── Terminal-based onboarding with You Agent
├── Auth (/auth)
│   └── Terminal-based email/password auth
├── Shell (/shell)
│   ├── Terminal (left panel — chat + commands)
│   └── Preview (right panel — pane switcher)
│       ├── ProfilePreview (public/private toggle)
│       ├── SettingsPane
│       ├── BillingPane
│       ├── TokensPane
│       ├── ActivityPane
│       ├── SourcesPane
│       ├── PortraitPane
│       ├── PublishPane
│       ├── AgentsPane
│       └── HelpPane
├── Profile Page (/profile/:username)
│   └── Full public profile view with raw JSON toggle
├── Directory (/profiles)
│   └── Searchable list of all profiles
└── 404 (Not Found)
```

### Backend (Lovable Cloud)
```
Lovable Cloud (Supabase)
├── Database (PostgreSQL)
│   ├── profiles
│   ├── profile_sources
│   ├── profile_verifications
│   ├── private_contexts
│   ├── access_tokens
│   ├── security_logs
│   └── profile_reports
├── Edge Functions
│   ├── fetch-x-profile (multi-platform scraper)
│   ├── claim-profile (ownership assignment)
│   ├── manage-tokens (create/revoke agent tokens)
│   ├── validate-token (agent access verification)
│   └── you-agent-chat (AI-powered agent responses)
├── Auth
│   └── Email/password authentication
└── Row Level Security (RLS)
    └── Per-table access policies
```

---

## 8. Data Model

### 8.1 profiles
The core identity record. Publicly readable, owner-writable.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| username | text | Unique handle (lowercase, alphanumeric + ._-) |
| name | text | Display name |
| tagline | text | One-line description |
| bio_short | text | ~1 sentence bio |
| bio_medium | text | ~1 paragraph bio |
| location | text | Geographic location |
| website | text | Primary website URL |
| avatar_url | text | Profile photo URL |
| cover_url | text | Cover/banner image URL |
| voice | text | Voice/tone description |
| topics | text[] | Expertise areas |
| credibility | text[] | Credentials and achievements |
| now_items | text[] | Current focus areas |
| values_list | text[] | Core values |
| links | jsonb | Structured link objects |
| preferences | jsonb | Agent interaction preferences |
| owner_id | uuid | FK to auth.users (null if unclaimed) |
| is_claimed | boolean | Whether profile has an owner |
| claimed_at | timestamptz | When ownership was established |
| created_at | timestamptz | Profile creation time |
| updated_at | timestamptz | Last modification time |

**RLS:** Anyone can view. Anyone can insert unclaimed profiles. Only owner can update/delete.

### 8.2 profile_sources
Connected platform data scraped from user's social profiles.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| profile_id | uuid | FK to profiles |
| platform | text | Platform identifier (x, github, linkedin) |
| platform_username | text | Username on that platform |
| display_name | text | Name from that platform |
| bio | text | Bio from that platform |
| profile_image_url | text | Avatar URL |
| location | text | Location from platform |
| website | text | Website from platform |
| headline | text | Professional headline |
| company | text | Current company |
| followers | int | Follower count |
| following | int | Following count |
| posts | int | Post/repo count |
| links | text[] | Additional links found |
| extras | jsonb | Platform-specific data (languages, top repos, etc.) |
| status | text | sync status (pending, synced, failed) |
| last_synced_at | timestamptz | Last successful sync |

**RLS:** Anyone can view. Anyone can add sources to unclaimed profiles. Owner can update/delete on claimed profiles.

### 8.3 private_contexts
Secure storage for private identity data. Never exposed publicly.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| profile_id | uuid | FK to profiles (1:1) |
| context_data | jsonb | Free-form private context |
| private_projects | jsonb | Non-public project data |
| private_links | jsonb | Non-public links and references |
| notes | text | Personal notes |

**RLS:** Owner-only for all operations (read, write, update).

### 8.4 access_tokens
Scoped credentials for external agent/app access.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| profile_id | uuid | FK to profiles |
| name | text | Human-readable token name |
| token_hash | text | SHA-256 hash of the raw token |
| scopes | text[] | Permission scopes (read, write) |
| expires_at | timestamptz | Optional expiration |
| is_revoked | boolean | Whether token has been revoked |
| last_used_at | timestamptz | Last access time |

**RLS:** Owner-only for all CRUD operations.

### 8.5 security_logs
Audit trail for security-relevant events.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| profile_id | uuid | FK to profiles |
| user_id | uuid | FK to auth.users |
| token_id | uuid | FK to access_tokens |
| event_type | text | Event category |
| details | jsonb | Event-specific data |
| created_at | timestamptz | Event timestamp |

**Event types:** profile_claimed, token_created, token_used, token_revoked, profile_updated, source_synced, login

### 8.6 profile_reports
Content integrity reports from community.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| profile_id | uuid | FK to profiles |
| reporter_id | uuid | Optional (can be anonymous) |
| reason | text | Report category |
| details | text | Additional context |
| status | text | pending / reviewed / dismissed |

**Report reasons:** not_this_person, false_info, harmful_abusive, private_info_exposed, duplicate

### 8.7 profile_verifications
Multi-signal verification system. Not a single boolean — supports multiple verification types.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| profile_id | uuid | FK to profiles |
| signal_type | text | Verification method |
| signal_value | text | Verification proof |
| is_active | boolean | Currently valid |
| verified_at | timestamptz | Verification timestamp |

**Signal types (planned):** domain_ownership, github_oauth, x_oauth, linkedin_oauth, email_match, manual_review

---

## 9. Feature Specifications

### 9.1 Profile Creation (No Auth Required)

**Route:** `/create`  
**Component:** `CreateProfilePage.tsx`

**Flow:**
1. Terminal boots with welcome message
2. User picks a username (validated: lowercase, alphanumeric + ._-, max 30 chars)
3. System checks for duplicates via `findSimilarProfiles()`
   - Exact match + unclaimed → suggest claiming
   - Exact match + claimed → reject, suggest alternative
   - No match → create profile in DB
4. Default ASCII portrait generated
5. You Agent greets user and begins gathering context
6. User pastes links → scraper fetches data → agent reacts
7. `/done` → redirect to profile page

**Database:** Inserts into `profiles` with `owner_id = null`, `is_claimed = false`

### 9.2 Multi-Platform Scraper

**Edge Function:** `fetch-x-profile`  
**Supports:** X/Twitter, GitHub, LinkedIn

**Data extracted per platform:**

| Field | X/Twitter | GitHub | LinkedIn |
|-------|-----------|--------|----------|
| Display name | ✓ | ✓ (API) | ✓ (og:title) |
| Username | ✓ | ✓ | ✓ |
| Bio | ✓ | ✓ (API) | ✓ (og:description) |
| Profile image | ✓ | ✓ (API) | ✓ (og:image) |
| Location | ✓ | ✓ (API) | ✗ |
| Website | ✓ | ✓ (API) | ✗ |
| Followers | ✓ | ✓ (API) | ✗ |
| Following | ✓ | ✓ (API) | ✗ |
| Post/repo count | ✓ | ✓ (API) | ✗ |
| Company | ✗ | ✓ (API) | ✗ |
| Headline | ✗ | ✗ | ✓ (og:description) |
| Top repos | ✗ | ✓ (API, top 5) | ✗ |
| Languages | ✗ | ✓ (API) | ✗ |
| Verified status | ✓ | ✗ | ✗ |
| Banner image | ✓ | ✗ | ✗ |

**GitHub** uses the public API (`api.github.com/users/:username` + `/repos`).  
**X/Twitter** scrapes the profile page HTML.  
**LinkedIn** scrapes OG meta tags (limited by platform restrictions).

### 9.3 ASCII Portrait Generation

**Component:** `AsciiAvatar.tsx`

**How it works:**
1. Profile photo loaded into an off-screen canvas
2. Image converted to grayscale
3. Each pixel block mapped to an ASCII character by brightness
4. Character density ramp: ` .:-=+*#%@` (light → dark)
5. Rendered as monospaced text in the terminal

**Configurations:**
- `cols`: Character width (default 80, hero uses 120)
- `canvasWidth`: Internal render resolution
- Display sizes range from 40px thumbnails to full-width hero portraits

### 9.4 Shell Environment

**Route:** `/shell`  
**Component:** `ShellPage.tsx`

**Layout:**
- Desktop: 35% terminal (left) / 65% preview (right)
- Mobile: toggle between terminal and preview views

**Terminal features:**
- Real-time chat with You Agent (AI-powered via `you-agent-chat` edge function)
- URL pasting triggers scraper + agent reaction
- Slash commands for pane navigation

**Slash commands:**

| Command | Action |
|---------|--------|
| `/profile` | Open profile preview pane |
| `/settings` | Open settings pane |
| `/billing` | Open billing pane |
| `/tokens` | Open tokens management pane |
| `/activity` | Open security activity log |
| `/sources` | Open connected sources pane |
| `/portrait` | Open portrait viewer/regenerator |
| `/publish` | Open publish/deploy pane |
| `/agents` | Open agent network pane |
| `/help` | Show all available commands |
| `/public` | Switch preview to public mode |
| `/private` | Switch preview to private mode |
| `/sync` | Trigger source re-sync |

**Preview panes (right panel):**

| Pane | Description | Data Source |
|------|-------------|-------------|
| ProfilePreview | Live profile as others see it | DB + sample fallback |
| SettingsPane | Account settings, preferences | Mock (needs wiring) |
| BillingPane | Plan and usage details | Mock |
| TokensPane | Create/revoke agent access tokens | Edge function (partial) |
| ActivityPane | Security event timeline | security_logs table (partial) |
| SourcesPane | Connected platforms, sync status | Mock (needs wiring to DB) |
| PortraitPane | ASCII portrait viewer | Client-side generation |
| PublishPane | Deploy status, version history | Mock |
| AgentsPane | Agent network, access policies, top queries | Mock |
| HelpPane | Command reference | Static |

### 9.5 Authentication

**Route:** `/auth`  
**Component:** `AuthTerminal.tsx`

**Methods:** Email/password (V1). OAuth planned for V2.

**Flow:**
1. Terminal-style interface
2. User types `signin` or `signup`
3. Enters email and password
4. On signup: email verification required (not auto-confirmed)
5. On signin: immediate redirect to `/shell`
6. If `claimProfileId` in state: auto-claims profile after auth

### 9.6 Profile Claiming

**Edge Function:** `claim-profile`

**Behavior:**
1. Requires authenticated user
2. Validates profile exists and is unclaimed
3. Sets `owner_id`, `is_claimed = true`, `claimed_at = now()`
4. Creates `private_contexts` row
5. Logs `profile_claimed` security event

**UI:** `ClaimBanner` component shown on unclaimed profile pages.

### 9.7 Public Profile Page

**Route:** `/profile/:username`  
**Component:** `ProfilePage.tsx`

**Sections (full view):**
1. Navigation (fixed top bar)
2. ASCII portrait header with identity info
3. Verification badges
4. Bio (medium)
5. Current focus (/now)
6. Connected sources with sync status
7. Projects
8. Agent metrics (total reads, 24h reads, connected agents, verified agents)
9. Agent connections list
10. Freshness dashboard (identity, projects, voice, sources scores)
11. Values
12. Preferences
13. Activity timeline
14. Recent changes
15. Top queries about this person
16. Raw JSON toggle (full profile as `you/v1` JSON)
17. Report button

**Two render paths (needs unification):**
- Sample profiles: full rich view with all sections
- DB-only profiles: minimal view (name, bio, sources, report)

### 9.8 Profile Directory

**Route:** `/profiles`  
**Component:** `ProfilesDirectory.tsx`

**Features:**
- Lists all profiles (sample + DB)
- ASCII avatar thumbnails with photo reveal on hover
- Search/filter (partial)
- Links to individual profile pages

### 9.9 Token Management

**Edge Function:** `manage-tokens`  
**UI:** `TokensPane`

**Token lifecycle:**
1. **Create:** User names token, selects scopes (read/write), optional expiration
2. **System:** Generates random token, stores SHA-256 hash, returns raw token once
3. **Use:** External agent sends token → `validate-token` checks hash, scopes, expiration
4. **Revoke:** User revokes token → `is_revoked = true`

### 9.10 Report System

**Component:** `ReportDialog.tsx`  
**Database:** `profile_reports` table

**Report reasons:**
- Not this person
- False information
- Harmful / abusive content
- Private information exposed
- Duplicate profile

### 9.11 Raw JSON View

**Component:** `RawJsonView.tsx`

Renders the full profile as a `you/v1` JSON object, matching the open protocol spec. Toggleable on the profile page.

---

## 10. Agent System

### 10.1 You Agent (Identity Agent)

The You Agent is the conversational AI that lives inside the terminal. It's not an assistant — it's a collaborator that helps build, maintain, and evolve identity context.

**Specification files:**
- `src/data/agent.md` — Behavioral spec (role, core behaviors, conversation boundaries)
- `src/data/soul.md` — Voice & tone (personality, emotional intelligence, thinking patterns)

**Implementation:** `src/hooks/useYouAgent.ts`

### 10.2 Voice & Personality

**Core traits:**
- Warm but not gushy
- Direct — no hedging
- Dry wit when natural
- Genuinely curious about people
- Lowercase everything
- No emoji, ever

**Anti-patterns (never do):**
- "Hello! Welcome! I'm so excited! 🎉"
- "That's a great link! I'll process that!"
- Exclamation marks (unless genuinely warranted)
- Reference self as AI/model
- Corporate speak ("leverage," "synergize")
- "Is there anything else I can help you with?"

### 10.3 Behavioral Patterns

**Read & React:** When ingesting a source, always comment on what was found. Make observations. Connect to existing knowledge.

**Progressive Depth:** Questions start surface-level and go deeper as rapport builds:
- L1: "What do you do?" / "Drop me some links"
- L2: "Your GitHub is mostly Rust — by choice or circumstance?"
- L3: "What do you want to be known for?"
- L4: "What drives your work that isn't on any resume?"

**Cross-Source Intelligence:** When multiple sources are connected, the agent surfaces patterns:
- "Your X presence and your GitHub paint two complementary pictures"
- "LinkedIn's the polished version, your X is the real-time version"

**Thinking Out Loud:** Never says "processing..." — says what it's actually doing:
- "digging into your github..."
- "interesting commit history — let me look closer..."
- "your linkedin paints one picture, let me see if the rest matches..."

### 10.4 AI Backend

**Edge Function:** `you-agent-chat`  
**Model:** Lovable AI supported models (no user API key required)  
**Context:** Receives profile data + sources + conversation history  
**Fallback:** Template-based responses via `useYouAgent` hook if AI call fails

---

## 11. Security Model

### 11.1 Access Layers

```
┌─────────────────────────────────────────┐
│           PUBLIC (no auth)              │
│  • View any profile                     │
│  • View profile sources                 │
│  • View verifications                   │
│  • Create unclaimed profile             │
│  • Add sources to unclaimed profiles    │
│  • Submit reports                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           OWNER (authenticated)         │
│  • Update own profile                   │
│  • Delete own profile                   │
│  • Manage private context               │
│  • Create/revoke access tokens          │
│  • View security logs                   │
│  • View reports on own profile          │
│  • Update/delete own sources            │
│  • Manage verifications                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│       AGENT TOKEN (scoped access)       │
│  • Read: public profile + private ctx   │
│  • Write: update profile fields         │
│  • Validated via token hash match       │
│  • Scoped, expirable, revocable         │
└─────────────────────────────────────────┘
```

### 11.2 Row Level Security (RLS)

Every table has RLS enabled. Key policies:

- **profiles:** Public read. Anonymous insert (unclaimed only). Owner update/delete via `is_profile_owner()` function.
- **private_contexts:** Owner-only for all operations. Never exposed publicly.
- **access_tokens:** Owner-only CRUD. Token hashes stored, never raw tokens.
- **security_logs:** Owner can view own logs. System can insert. No updates or deletes.

### 11.3 Security Function

```sql
create or replace function public.is_profile_owner(_profile_id uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = _profile_id and owner_id = auth.uid()
  )
$$;
```

### 11.4 Token Security

- Tokens are generated server-side with cryptographic randomness
- Only the SHA-256 hash is stored; raw token shown to user once on creation
- Token validation checks: hash match, not revoked, not expired, scope match
- Every token use is logged in `security_logs`

---

## 12. Open Protocol (you/v1)

### 12.1 Spec Overview

The `you/v1` protocol defines a directory-based identity bundle:

**Required files:**
- `you.md` — Human-readable markdown identity file
- `you.json` — Machine-readable compiled output
- `manifest.json` — Directory map

**Reserved paths:**
- `profile/` — Core identity data
- `preferences/` — Agent interaction preferences
- `sources/` — Connected platform data
- `analysis/` — Agent-generated insights
- `private/` — Private context (encrypted, access-controlled)

### 12.2 you.md Format

```markdown
---
schema: you/v1
name: Houston Golden
username: houston
---

# Houston Golden

Founder, BAMF Media. Building You.md.

## Now
- Building You.md
- Scaling BAMF Media

## Agent Preferences
Tone: direct, high-energy
Format: bullet points over paragraphs
Avoid: corporate jargon, unnecessary formality

## Links
- Website: https://houstongolden.com
- GitHub: github.com/houstongolden
- X: x.com/houstongolden
```

### 12.3 you.json Format

```json
{
  "$schema": "you/v1",
  "username": "houston",
  "name": "Houston Golden",
  "tagline": "Founder, BAMF Media. Building You.md.",
  "bio": { "short": "...", "medium": "..." },
  "now": ["Building You.md", "Scaling BAMF Media"],
  "voice": "Direct, high-energy, founder-coded.",
  "topics": ["AI agents", "growth marketing", "identity"],
  "preferences": { "tone": "direct", "formality": "low" },
  "links": [{ "label": "GitHub", "url": "..." }],
  "sources": [...],
  "agent_metrics": { "total_reads": 14203 }
}
```

### 12.4 Principles

- **Open standard** — no vendor lock-in, no walled gardens
- **Markdown-first** — humans author in markdown, machines consume JSON
- **Self-hostable** — users can host their own identity bundle
- **Compatible** — works with any agent that supports structured context or MCP

---

## 13. Pricing Model

### Free ($0/forever)
- Full identity bundle
- Public profile at you.md/username
- Shareable context link
- 3 auto-syncs/month

### Pro ($12/month)
- Unlimited auto-syncs
- BYOK (bring your own keys) — OpenRouter, Perplexity, Apify
- Private encrypted vault
- Version history & rollback
- Custom domain
- Analytics & scoped API keys

**Philosophy:** "We gate on usage intensity — never on core identity."

---

## 14. Landing Page & Marketing

### Page Structure

| Section | Component | Purpose |
|---------|-----------|---------|
| Navbar | `Navbar.tsx` | Navigation + "Enter system" CTA |
| Hero | `Hero.tsx` | Boot sequence animation, CLI commands, ASCII portrait, value prop |
| Founder Quote | `FounderQuote.tsx` | Houston's origin story in terminal style |
| Profiles Showcase | `ProfilesShowcase.tsx` | Sample profiles as social proof |
| Problem Strip | `ProblemStrip.tsx` | Pain point articulation |
| How It Works | `HowItWorks.tsx` | 3-step CLI flow (init, publish, link) |
| What's Inside | `WhatsInside.tsx` | Typewriter code demo of identity bundle |
| Portrait Section | `PortraitSection.tsx` | ASCII portrait showcase |
| Open Spec | `OpenSpec.tsx` | you/v1 open protocol messaging |
| Integrations | `Integrations.tsx` | Compatible agents list |
| Pricing | `Pricing.tsx` | Free/Pro tiers |
| CTA Footer | `CTAFooter.tsx` | Final conversion point |

### Supported Agents (Marketing)

**Primary:** Claude Code, Cursor, Codex CLI, Perplexity  
**Secondary:** ChatGPT, CrewAI, Goose, Aider, OpenClaw, Windsurf  
**Plus:** Any tool that supports structured context or MCP

---

## 15. Technical Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 8 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + tailwindcss-animate |
| Routing | React Router DOM 6 |
| State | React Query (TanStack) |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Backend | Lovable Cloud (Supabase) |
| Database | PostgreSQL |
| Auth | Supabase Auth (email/password) |
| Edge Functions | Deno (Supabase Edge Functions) |
| AI | Lovable AI (multi-model, no API key required) |
| Design System | Custom terminal-native system (monospace, ASCII, dark-first) |

### Design Tokens

| Token | Purpose |
|-------|---------|
| `--background` | Primary background |
| `--foreground` | Primary text |
| `--accent` | Brand accent (green-ish) |
| `--accent-mid` | Secondary accent |
| `--muted-foreground` | Subdued text |
| `--success` | Positive states |
| `--destructive` | Error/warning states |
| `--border` | UI borders |
| `--card` | Card/panel backgrounds |

---

## 16. Current Build Status

### ✅ Built & Working
- [x] Landing page with all sections
- [x] Terminal-native design system
- [x] ASCII portrait generation from real photos
- [x] Multi-platform scraper (X, GitHub, LinkedIn)
- [x] Create profile flow (no auth required)
- [x] Shell environment with split terminal/preview
- [x] You Agent with personality, progressive questions, cross-source insights
- [x] AI-powered agent responses via edge function
- [x] Auth terminal (email/password signup/signin)
- [x] Profile page with full sections (sample data)
- [x] Profile directory
- [x] Database schema (all 7 tables with RLS)
- [x] Edge functions (fetch-x-profile, claim-profile, manage-tokens, validate-token, you-agent-chat)
- [x] Profile creation persists to DB
- [x] Source scraping persists to DB (during /create)
- [x] Report dialog
- [x] Claim banner UI
- [x] Raw JSON toggle on profile page
- [x] Mobile responsive shell (terminal/preview toggle)
- [x] Theme toggle (dark/light)
- [x] Profile data helpers library (src/lib/profiles.ts)

### 🟡 Partially Built
- [ ] Claim flow (UI + edge function exist, not fully tested end-to-end)
- [ ] Token management (UI + edge function exist, needs verification)
- [ ] Activity/security logs (schema + partial UI, needs real data wiring)
- [ ] Profile page DB integration (loads from DB but falls back to sample data with separate render paths)
- [ ] Profile directory DB integration (loads from DB but also shows sample profiles separately)

### 🔴 Not Built
- [ ] Shell persistence to DB (all state is ephemeral)
- [ ] Auth → Shell redirect with profile lookup
- [ ] Sample profiles seeded into DB
- [ ] Private context management UI
- [ ] Public/private toggle with real data filtering
- [ ] Chat context persistence to private_contexts
- [ ] Source re-sync functionality (/sync command)
- [ ] Profile freshness scoring (real)
- [ ] you.md / you.json file generation & download
- [ ] Verification signals UI
- [ ] ASCII portrait caching/persistence
- [ ] OG meta tags for social sharing
- [ ] OAuth providers (GitHub, Google)
- [ ] Edge function rate limiting
- [ ] Profile deletion UI
- [ ] Custom domain support
- [ ] Version history / rollback

---

## 17. Roadmap

### Phase 1: Foundation Fixes 🔴
*Make the core loop work end-to-end with real data.*

1. Seed 6 sample profiles into DB
2. Remove dead code (InitializePage)
3. Fix auth → shell redirect with profile lookup
4. Wire and test full claim flow
5. Wire ShellPage to load/save from DB

### Phase 2: Unified Data Layer 🟡
*Eliminate the sample/DB data split.*

1. Merge ProfilePage render paths (DB-first)
2. Merge ProfilesDirectory listings
3. Wire TokensPane to real edge function
4. Wire ActivityPane to real security_logs

### Phase 3: Private Layer & Security 🟡
*Make the public/private separation real.*

1. Build PrivateContextPane (view/edit)
2. Wire public/private toggle to filter data
3. Persist chat context to private_contexts
4. Test token-based agent access end-to-end

### Phase 4: Polish & Completeness 🟢
*Fill gaps for a shippable V1.*

1. Audit and fix all landing page CTAs
2. Improve ClaimBanner copy + auto-claim
3. Wire /sync to real source re-fetch
4. Add profile matching by name + links
5. Mobile responsiveness audit
6. Profile deletion UI

### Phase 5: Identity Protocol 🟢
*Build toward the open spec vision.*

1. Generate downloadable you.md and you.json
2. Verification signals UI
3. Real freshness scoring
4. ASCII portrait caching

### Phase 6: Growth & Distribution 🔵
*Make profiles shareable and discoverable.*

1. OG meta tags for social sharing
2. OAuth providers (GitHub, Google)
3. Edge function rate limiting
4. Custom domain support
5. SEO optimization

---

## 18. Success Metrics

### V1 Launch Criteria
- [ ] User can create profile → view it → claim it without friction
- [ ] All 6 sample profiles visible and claimable
- [ ] Private data is never exposed publicly
- [ ] Tokens can be created, used, and revoked
- [ ] Profile page renders from DB data (not sample data)
- [ ] Shell persists data across sessions
- [ ] No duplicate systems or dead code

### Growth Metrics (Post-Launch)
- Profiles created per week
- Profiles claimed (conversion rate from creation to claiming)
- Agent reads per profile (via token access logs)
- Source connections per profile (average)
- Retention: users who return to shell within 7 days
- CLI installs (when npx youmd is real)

### Quality Metrics
- Context freshness score distribution
- Source scrape success rate
- Token usage patterns
- Report volume and resolution rate

---

## 19. Appendices

### A. Sample Profiles

Six pre-built profiles for showcasing and testing:

| Username | Name | Role | Focus |
|----------|------|------|-------|
| houston | Houston Golden | Founder, BAMF Media | Building You.md |
| priya | Priya Sharma | ML Engineer @ Anthropic | AI safety research |
| jmarcus | Jordan Marcus | Indie hacker (3 exits) | Micro-SaaS |
| sato.yuki | Yuki Sato | Staff Engineer @ Stripe | Payment infrastructure |
| emmawright | Emma Wright | Creative Director | Brand design |
| kai | Kai Andersen | DevRel Lead @ Vercel | Developer experience |

### B. Edge Function Reference

| Function | Method | Auth Required | Purpose |
|----------|--------|---------------|---------|
| fetch-x-profile | POST | No | Scrape profile from X/GitHub/LinkedIn |
| claim-profile | POST | Yes | Attach ownership to unclaimed profile |
| manage-tokens | POST | Yes | Create or revoke agent access tokens |
| validate-token | POST | Token | Verify agent token and return profile data |
| you-agent-chat | POST | No | AI-powered agent conversation |

### C. Design Philosophy

The terminal-native aesthetic isn't decoration — it's a statement:

- **Monospace everything** — identity as code, readable by humans and machines
- **ASCII portraits** — visual identity without photography dependency
- **Command-line interactions** — power-user oriented, intentional friction
- **Dark-first design** — matches developer environments
- **Minimal color** — accent green for brand, muted everything else
- **No gradients, no glassmorphism, no decorative elements** — function over form

### D. CLI Commands (Future)

```
$ npx youmd init          # create identity bundle locally
$ youmd sync              # pull from connected sources
$ youmd publish           # go live at you.md/username
$ youmd share             # generate scoped context link
$ youmd agent             # start identity context server
$ youmd link create       # generate scoped API token
$ youmd link revoke       # revoke an existing token
$ youmd export            # download you.md + you.json
```

---

*End of PRD. This document should be treated as the single source of truth for the You.md product. All development work should reference this document for scope, behavior, and architecture decisions.*
