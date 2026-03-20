# You.md — Development Todos (Prioritized)

> Ordered by impact and dependency. Last updated: 2026-03-20

---

## Phase 1: Foundation Fixes (Do First)
*Goal: Make the core create → view → claim → manage loop actually work end-to-end with real data.*

| # | Task | Ref | Status | Est |
|---|------|-----|--------|-----|
| 1.1 | Seed 6 sample profiles into DB via migration | FR-01 | ⬜ Todo | 1hr |
| 1.2 | Remove InitializePage (dead code, already aliased to CreateProfilePage) | FR-19 | ⬜ Todo | 15min |
| 1.3 | Fix auth → shell redirect to load user's owned profile | FR-03 | ⬜ Todo | 1hr |
| 1.4 | Test & fix full claim flow (ClaimBanner → auth → claim-profile → redirect) | FR-04 | ⬜ Todo | 2hr |
| 1.5 | Wire ShellPage to load/save profile data from DB | FR-02 | ⬜ Todo | 3hr |

---

## Phase 2: Unified Data Layer
*Goal: Eliminate the sample-data / DB-data split. Everything reads from DB.*

| # | Task | Ref | Status | Est |
|---|------|-----|--------|-----|
| 2.1 | Merge ProfilePage render paths (DB-first, sample fallback) | FR-05 | ⬜ Todo | 3hr |
| 2.2 | Merge ProfilesDirectory to show DB + sample profiles unified | FR-09 | ⬜ Todo | 1hr |
| 2.3 | Wire TokensPane to real manage-tokens edge function | FR-07 | ⬜ Todo | 2hr |
| 2.4 | Wire ActivityPane to real security_logs table | FR-08 | ⬜ Todo | 1hr |

---

## Phase 3: Private Layer & Security
*Goal: Make the public/private separation real and functional.*

| # | Task | Ref | Status | Est |
|---|------|-----|--------|-----|
| 3.1 | Build PrivateContextPane (view/edit private notes, projects, links) | FR-06 | ⬜ Todo | 3hr |
| 3.2 | Wire public/private toggle to actually filter preview content | FR-06 | ⬜ Todo | 2hr |
| 3.3 | Persist freeform chat context to private_contexts table | FR-13 | ⬜ Todo | 2hr |
| 3.4 | Test token-based agent access (validate-token edge function) | FR-07 | ⬜ Todo | 1hr |

---

## Phase 4: Polish & Completeness
*Goal: Fill in the remaining gaps for a shippable V1.*

| # | Task | Ref | Status | Est |
|---|------|-----|--------|-----|
| 4.1 | Audit & fix all landing page CTAs (primary → /create) | FR-11 | ⬜ Todo | 30min |
| 4.2 | Improve ClaimBanner copy and auto-claim after auth | FR-12 | ⬜ Todo | 1hr |
| 4.3 | Wire /sync command to re-fetch all connected sources | FR-15 | ⬜ Todo | 2hr |
| 4.4 | Add profile matching by name + links before creation | FR-10 | ⬜ Todo | 1hr |
| 4.5 | Mobile responsiveness audit (375px all flows) | FR-18 | ⬜ Todo | 2hr |
| 4.6 | Add profile deletion UI in Settings pane | FR-23 | ⬜ Todo | 1hr |

---

## Phase 5: Identity Protocol Features
*Goal: Build toward the open spec vision.*

| # | Task | Ref | Status | Est |
|---|------|-----|--------|-----|
| 5.1 | Generate downloadable you.md and you.json files | FR-20 | ⬜ Todo | 3hr |
| 5.2 | Display verification signals on profile pages | FR-16 | ⬜ Todo | 2hr |
| 5.3 | Real freshness scoring based on source sync age | FR-14 | ⬜ Todo | 2hr |
| 5.4 | Cache/persist ASCII portrait output | FR-21 | ⬜ Todo | 2hr |

---

## Phase 6: Growth & Distribution
*Goal: Make profiles shareable and discoverable.*

| # | Task | Ref | Status | Est |
|---|------|-----|--------|-----|
| 6.1 | Add OG meta tags for profile social sharing | FR-25 | ⬜ Todo | 2hr |
| 6.2 | Add OAuth providers (GitHub, Google) | FR-24 | ⬜ Todo | 2hr |
| 6.3 | Edge function rate limiting & input validation | FR-22 | ⬜ Todo | 2hr |

---

## Summary

| Phase | Items | Priority | Dependency |
|-------|-------|----------|------------|
| 1. Foundation Fixes | 5 | 🔴 Critical | None |
| 2. Unified Data Layer | 4 | 🟡 High | Phase 1 |
| 3. Private Layer | 4 | 🟡 High | Phase 1 |
| 4. Polish | 6 | 🟢 Medium | Phase 2-3 |
| 5. Protocol Features | 4 | 🟢 Medium | Phase 2 |
| 6. Growth | 3 | 🔵 Low | Phase 4 |

**Total: 26 items across 6 phases**

Current completion estimate: **~60-65%** of V1 scope is built (schemas, edge functions, UI shells). The remaining work is primarily **wiring real data**, **unifying render paths**, and **testing end-to-end flows**.
