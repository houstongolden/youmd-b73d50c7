

# ASCII Portrait Generator — Full Replication Guide

## What this document will contain

A single comprehensive markdown file at `project-context/ascii-portrait-replication-guide.md` with everything needed to replicate the ASCII portrait system in another project:

1. **Core Algorithm** — The complete `imgToAscii` pipeline, luminance ramp, and color mapping functions (copy-paste ready)
2. **Three component variants** — `AsciiAvatar` (thumbnail), `AsciiPortraitGenerator` (full interactive widget with upload/URL fetch/download), and `ProfileAsciiHeader` (responsive page header)
3. **HTTP Profile Fetching** — The full Edge Function code for `fetch-x-profile` that scrapes X/Twitter, GitHub, and LinkedIn for profile photos and metadata, with the default example URL set to `x.com/houstongolden`
4. **Client-side URL fetch** — The `allorigins.win` proxy approach used in the generator for browser-side image fetching
5. **Design system** — Complete CSS variables (burnt orange accent system), Tailwind config, font imports, and utility classes (`terminal-panel`, `cta-primary`, `cta-outline`, ASCII color classes)
6. **Prompt-ready instructions** — Written as a full implementation prompt you can paste into another Lovable project

## File to create

**`project-context/ascii-portrait-replication-guide.md`** — ~4000 lines covering:

- Section 1: Quick Start prompt (paste-ready for another Lovable project)
- Section 2: Core algorithm code (`RAMP`, `lumToColor`, `imgToAscii`, `renderToCanvas`)
- Section 3: `AsciiAvatar` component (small thumbnails)
- Section 4: `AsciiPortraitGenerator` component (full interactive widget)
- Section 5: `ProfileAsciiHeader` component (page-width responsive header)
- Section 6: Edge Function — `fetch-x-profile/index.ts` (X, GitHub, LinkedIn scraping)
- Section 7: CSS & Tailwind design tokens (full `index.css` + `tailwind.config.ts`)
- Section 8: Default example — fetching `x.com/houstongolden` as the seed portrait

No existing files will be modified. This is purely a new reference document.

