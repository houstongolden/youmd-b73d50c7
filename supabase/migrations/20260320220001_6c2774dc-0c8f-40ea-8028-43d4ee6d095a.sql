
-- Seed remaining 2 sample profiles: emmawright and kai
INSERT INTO public.profiles (username, name, tagline, bio_short, bio_medium, location, website, avatar_url, cover_url, voice, topics, credibility, links, now_items, values_list, preferences, is_claimed, created_at)
VALUES
  (
    'emmawright',
    'Emma Wright',
    'Creative director. Brand strategist. Strong feelings about kerning.',
    'Making brands feel like they have a soul.',
    'Creative director working with startups and cultural institutions. Previously at Pentagram. I believe every brand has a story worth telling — most just haven''t found the right words yet. Strong feelings about kerning.',
    'Brooklyn, NY',
    NULL,
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=300&fit=crop',
    'Visual thinker, storytelling-first, bold opinions.',
    ARRAY['brand strategy', 'creative direction', 'visual identity', 'storytelling'],
    ARRAY['Previously at Pentagram', 'Worked with 40+ startups on brand identity'],
    '[{"label":"Portfolio","url":"#"},{"label":"Instagram","url":"#"},{"label":"Are.na","url":"#"}]'::jsonb,
    ARRAY['Launching rebrand for a climate tech startup', 'Teaching brand workshop series'],
    ARRAY['Story over aesthetics', 'Bold over safe', 'Details matter'],
    '{"tone":"warm, opinionated, visual","formality":"casual-creative","avoid":["bland corporate language","design-by-committee thinking"],"format":"visual moodboards + concise briefs"}'::jsonb,
    false,
    now() - interval '17 days'
  ),
  (
    'kai',
    'Kai Andersen',
    'DevRel lead @ Vercel. 50k YouTube subscribers.',
    'Helping developers build faster.',
    'DevRel lead at Vercel. Conference speaker, tutorial creator, and eternal optimist about the web platform. 50k+ YouTube subscribers. I believe the best docs are the ones people actually enjoy reading.',
    'Copenhagen, Denmark',
    NULL,
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=300&fit=crop',
    'Enthusiastic, educational, community-driven.',
    ARRAY['developer relations', 'Next.js', 'web platform', 'content creation'],
    ARRAY['DevRel Lead at Vercel', '50k+ YouTube subscribers', 'React Conf keynote speaker'],
    '[{"label":"YouTube","url":"#"},{"label":"X","url":"#"},{"label":"GitHub","url":"#"}]'::jsonb,
    ARRAY['Launching new docs platform', 'Keynote prep for React Conf'],
    ARRAY['Teach by building', 'Community first', 'Make it fun'],
    '{"tone":"enthusiastic, clear, encouraging","formality":"casual","avoid":["gatekeeping language","unnecessary jargon"],"format":"step-by-step with code examples"}'::jsonb,
    false,
    now() - interval '16 days'
  )
ON CONFLICT (username) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  bio_short = EXCLUDED.bio_short,
  bio_medium = EXCLUDED.bio_medium,
  location = EXCLUDED.location,
  avatar_url = EXCLUDED.avatar_url,
  cover_url = EXCLUDED.cover_url,
  voice = EXCLUDED.voice,
  topics = EXCLUDED.topics,
  credibility = EXCLUDED.credibility,
  links = EXCLUDED.links,
  now_items = EXCLUDED.now_items,
  values_list = EXCLUDED.values_list,
  preferences = EXCLUDED.preferences;
