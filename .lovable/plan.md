

## Export Sample Profiles as JSON Seed File

**What**: Generate a JSON file at `/mnt/documents/` containing all 6 sample profiles from `src/data/sampleProfiles.ts` in a clean, database-ready format.

**Profiles included**:
1. **houston** — Houston Golden (Founder, BAMF Media)
2. **priya** — Priya Sharma (ML Engineer @ Anthropic)
3. **jmarcus** — Jordan Marcus (Indie hacker, 3 exits)
4. **sato.yuki** — Yuki Sato (Staff Engineer @ Stripe)
5. **emmawright** — Emma Wright (Creative Director)
6. **kai** — Kai Andersen (DevRel Lead @ Vercel)

**Output format**: A single `profiles_seed.json` file with a top-level array of profile objects. Keys will use the `you/v1` schema format (snake_case, matching the JSON view already rendered in `RawJsonView.tsx`), plus all additional fields (activity, agent connections, top queries, etc.) so nothing is lost.

**Technical steps**:
1. Write a small Node script that imports the TypeScript profile data and serializes it to JSON
2. Output to `/mnt/documents/profiles_seed.json`
3. Verify the file is valid JSON with all 6 profiles

