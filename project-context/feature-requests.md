# You.md — Feature Requests & Gap Analysis

> Auto-generated audit against PRD goals. Last updated: 2026-03-20

---

## 🔴 Critical (Blocks core flow)

### FR-01: Seed sample profiles into database
**Status:** Not built  
**Why:** The 6 sample profiles in `sampleProfiles.ts` only exist in client-side code. They don't exist in the DB, so they can't be claimed, have sources attached, or participate in the real data layer. The ProfilePage falls back to sample data which creates a split-brain rendering path.  
**Action:** Write a migration or seed script to insert all 6 profiles into the `profiles` table. Merge the sample data rendering path so ProfilePage always reads from DB.

### FR-02: Shell page should persist to DB
**Status:** Not built  
**Why:** ShellPage keeps all profile data in React state (`useState`). When the user refreshes, everything is lost. Scraped sources, profile updates, and context are ephemeral.  
**Action:** On shell load, fetch profile + sources from DB. On source scrape or profile update, persist to DB in real-time. Remove duplicate local state.

### FR-03: Auth → Shell redirect with profile context
**Status:** Partial  
**Why:** After sign-in, user is redirected to `/shell` but without knowing which profile they own. Shell defaults to "houston" username from location state. No lookup of owned profiles happens.  
**Action:** After auth, query `profiles` for `owner_id = user.id`, then redirect to shell with the correct username. If no profile exists, redirect to `/create`.

### FR-04: Claim flow end-to-end wiring
**Status:** Partial (UI exists, edge function exists, but not fully tested/connected)  
**Why:** ClaimBanner links to `/auth` with state, but after auth the claim-profile function needs to fire and update the profile. The full loop (view unclaimed → click claim → auth → profile updates to claimed) needs verification.  
**Action:** Test and fix the complete claim flow. Ensure security log is created on claim.

---

## 🟡 Important (Core experience gaps)

### FR-05: Profile page should merge DB + sample data gracefully
**Status:** Partial  
**Why:** ProfilePage has two completely separate render paths — one for sample profiles (rich, full sections) and one for DB-only profiles (minimal). DB profiles that were seeded from samples should render the full rich view with DB data taking precedence.  
**Action:** Unify the render path. Use DB as source of truth, fall back to sample data only for fields that are null.

### FR-06: Private context management UI
**Status:** Schema exists, no UI  
**Why:** The `private_contexts` table exists with RLS, but there's no UI to view/edit private notes, projects, or links. The shell's private mode toggle doesn't actually show/hide different data.  
**Action:** Build a PrivateContextPane in the shell. Wire the public/private toggle to actually filter what's shown in ProfilePreview.

### FR-07: Token creation UI (real, not mock)
**Status:** Partial (TokensPane exists with mock-ish UI)  
**Why:** TokensPane has UI for creating tokens but calls `supabase.functions.invoke('manage-tokens')`. Need to verify the edge function works, tokens are hashed, and the raw token is shown once.  
**Action:** Test token create/revoke flow end-to-end. Show the raw token in a copyable field on creation. Display active vs revoked tokens.

### FR-08: Security activity log (real data)
**Status:** Partial (ActivityPane exists, schema exists)  
**Why:** ActivityPane may be reading from DB but needs to display real events (profile claimed, token created, source synced, etc.) instead of sample data.  
**Action:** Wire ActivityPane to `security_logs` table. Ensure events are logged from claim-profile, manage-tokens, and source sync operations.

### FR-09: Profile directory should show DB profiles
**Status:** Partial  
**Why:** ProfilesDirectory fetches from DB via `getAllProfiles()` but also renders sample profiles separately. Users who created profiles via `/create` should appear in the directory alongside sample profiles.  
**Action:** Merge both lists, deduplicate by username, and show all profiles in one unified list.

### FR-10: Simple profile matching before creation
**Status:** Partial  
**Why:** `findSimilarProfiles` exists and is called in CreateProfilePage, but only checks exact username match. PRD asks for name + links matching to suggest claiming instead of creating duplicates.  
**Action:** Enhance matching to also check `name` similarity and linked sources.

---

## 🟢 Nice to Have (Polish & depth)

### FR-11: Create profile via landing page CTAs
**Status:** Partial  
**Why:** "Enter system" goes to `/auth`. The Hero and CTAFooter sections have various buttons — some go to `/create`, some to anchors. The primary CTA should lead to the create-first flow.  
**Action:** Audit all CTAs on Index page. Primary action → `/create`. Secondary → `/auth` for returning users.

### FR-12: Post-create "claim" prompt
**Status:** Partial  
**Why:** After `/create` flow finishes, user is redirected to their profile page. The ClaimBanner shows, but the messaging could be stronger — "Sign in to own this profile permanently."  
**Action:** Improve ClaimBanner copy and make the auth redirect pass the profile ID for automatic claiming.

### FR-13: Chat-first context input in shell
**Status:** Partial  
**Why:** Shell accepts natural language and URLs, but doesn't persist freeform context to the `private_contexts` table. Text input is acknowledged but not stored.  
**Action:** Save freeform text inputs as context entries in `private_contexts.context_data`.

### FR-14: Profile freshness scoring (real)
**Status:** Mock only  
**Why:** Freshness scores, agent read counts, and integration metrics are hardcoded in sample data. No real tracking exists.  
**Action:** Track source sync timestamps, calculate freshness based on age. Track agent reads via token usage logs.

### FR-15: Source re-sync functionality
**Status:** Mock  
**Why:** Shell `/sync` command shows fake "4 sources synced" message. Doesn't actually re-fetch from platforms.  
**Action:** Wire `/sync` to re-invoke `fetch-x-profile` for each connected source and update `profile_sources`.

### FR-16: Verification signals UI
**Status:** Schema exists, no real UI  
**Why:** `profile_verifications` table supports multiple signal types, but there's no way to add or display verification badges beyond the sample data mock.  
**Action:** Add UI to display verification signals on profile. Allow domain verification (check website ownership) as V1 signal.

### FR-17: Password input masking in terminal
**Status:** Built  
**Why:** Auth terminal masks password with dots. Working as intended.

### FR-18: Mobile responsiveness audit
**Status:** Partial  
**Why:** Shell has mobile view toggle (terminal/preview), but the create flow and profile pages need mobile testing and polish.  
**Action:** Test all flows on 375px viewport. Fix any overflow or usability issues.

### FR-19: Consolidate InitializePage and CreateProfilePage
**Status:** Not done  
**Why:** Both pages serve similar purposes (onboarding terminal). InitializePage is the older version that doesn't persist to DB. CreateProfilePage is the newer DB-connected version. Having both creates confusion.  
**Action:** Remove InitializePage or redirect `/initialize` to `/create` (currently both map to CreateProfilePage in App.tsx — verify InitializePage is dead code).

### FR-20: you.json / you.md file generation
**Status:** Not built  
**Why:** The open spec defines `you.md` and `you.json` as core identity files. No generation or download exists yet.  
**Action:** Add a "Download you.md" and "Download you.json" option to the profile page and shell `/publish` pane.

### FR-21: Real ASCII portrait persistence
**Status:** Not built  
**Why:** ASCII portraits are generated client-side from profile images on every render. They're not stored or cached.  
**Action:** Generate ASCII art server-side or cache the output. Store in profile or as a file.

### FR-22: Edge function error handling & rate limiting
**Status:** Minimal  
**Why:** Edge functions (fetch-x-profile, claim-profile, manage-tokens) have basic error handling but no rate limiting or abuse prevention.  
**Action:** Add rate limiting headers. Validate inputs more strictly.

### FR-23: Profile deletion
**Status:** Schema supports (RLS allows owner delete), no UI  
**Why:** Owners can delete profiles via RLS policy but there's no UI for it.  
**Action:** Add delete option in Settings pane with confirmation dialog.

### FR-24: Social auth (OAuth providers)
**Status:** Not built  
**Why:** Auth is email/password only. OAuth would reduce friction and could auto-verify platform ownership.  
**Action:** Add GitHub and Google OAuth via Lovable Cloud auth configuration.

### FR-25: Profile sharing / OG meta tags
**Status:** Not built  
**Why:** Profile pages don't have dynamic meta tags for social sharing (title, description, image).  
**Action:** Add Helmet or meta tag injection for profile pages with username, name, tagline, and avatar.
