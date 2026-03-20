
-- ============================================
-- YOU.MD DATABASE SCHEMA
-- ============================================

-- 1. PROFILES TABLE (public, no auth required to create)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  name TEXT,
  tagline TEXT,
  bio_short TEXT,
  bio_medium TEXT,
  location TEXT,
  website TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  voice TEXT,
  topics TEXT[] DEFAULT '{}',
  credibility TEXT[] DEFAULT '{}',
  links JSONB DEFAULT '[]',
  now_items TEXT[] DEFAULT '{}',
  values_list TEXT[] DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  claimed_at TIMESTAMPTZ,
  is_claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PROFILE SOURCES (scraped data per platform)
CREATE TABLE public.profile_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  platform_username TEXT,
  display_name TEXT,
  bio TEXT,
  profile_image_url TEXT,
  location TEXT,
  website TEXT,
  headline TEXT,
  company TEXT,
  followers INTEGER,
  following INTEGER,
  posts INTEGER,
  links TEXT[] DEFAULT '{}',
  extras JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  last_synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, platform)
);

-- 3. PRIVATE CONTEXTS (owner-only)
CREATE TABLE public.private_contexts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  context_data JSONB DEFAULT '{}',
  notes TEXT,
  private_projects JSONB DEFAULT '[]',
  private_links JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. ACCESS TOKENS (agent/app credentials)
CREATE TABLE public.access_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  scopes TEXT[] NOT NULL DEFAULT '{read}',
  expires_at TIMESTAMPTZ,
  is_revoked BOOLEAN NOT NULL DEFAULT false,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. SECURITY LOGS
CREATE TABLE public.security_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  token_id UUID REFERENCES public.access_tokens(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. PROFILE REPORTS
CREATE TABLE public.profile_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. PROFILE VERIFICATIONS (multiple signals)
CREATE TABLE public.profile_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  signal_type TEXT NOT NULL,
  signal_value TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  verified_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, signal_type)
);

-- ============================================
-- HELPER FUNCTIONS (SECURITY DEFINER)
-- ============================================

CREATE OR REPLACE FUNCTION public.is_profile_owner(_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _profile_id AND owner_id = auth.uid()
  )
$$;

-- ============================================
-- RLS POLICIES
-- ============================================

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create unclaimed profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (owner_id IS NULL AND is_claimed = false);

CREATE POLICY "Owner can update their profile"
  ON public.profiles FOR UPDATE
  USING (public.is_profile_owner(id));

CREATE POLICY "Owner can delete their profile"
  ON public.profiles FOR DELETE
  USING (public.is_profile_owner(id));

-- PROFILE SOURCES
ALTER TABLE public.profile_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profile sources"
  ON public.profile_sources FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add sources to unclaimed profiles"
  ON public.profile_sources FOR INSERT
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_claimed = true)
    OR public.is_profile_owner(profile_id)
  );

CREATE POLICY "Owner can update sources"
  ON public.profile_sources FOR UPDATE
  USING (public.is_profile_owner(profile_id));

CREATE POLICY "Owner can delete sources"
  ON public.profile_sources FOR DELETE
  USING (public.is_profile_owner(profile_id));

-- PRIVATE CONTEXTS
ALTER TABLE public.private_contexts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can view private context"
  ON public.private_contexts FOR SELECT
  USING (public.is_profile_owner(profile_id));

CREATE POLICY "Owner can create private context"
  ON public.private_contexts FOR INSERT
  WITH CHECK (public.is_profile_owner(profile_id));

CREATE POLICY "Owner can update private context"
  ON public.private_contexts FOR UPDATE
  USING (public.is_profile_owner(profile_id));

-- ACCESS TOKENS
ALTER TABLE public.access_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can view tokens"
  ON public.access_tokens FOR SELECT
  USING (public.is_profile_owner(profile_id));

CREATE POLICY "Owner can create tokens"
  ON public.access_tokens FOR INSERT
  WITH CHECK (public.is_profile_owner(profile_id));

CREATE POLICY "Owner can update tokens"
  ON public.access_tokens FOR UPDATE
  USING (public.is_profile_owner(profile_id));

CREATE POLICY "Owner can delete tokens"
  ON public.access_tokens FOR DELETE
  USING (public.is_profile_owner(profile_id));

-- SECURITY LOGS
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can view their security logs"
  ON public.security_logs FOR SELECT
  USING (
    public.is_profile_owner(profile_id)
    OR user_id = auth.uid()
  );

CREATE POLICY "Service can insert logs"
  ON public.security_logs FOR INSERT
  WITH CHECK (true);

-- PROFILE REPORTS
ALTER TABLE public.profile_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create reports"
  ON public.profile_reports FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owner can view reports on their profile"
  ON public.profile_reports FOR SELECT
  USING (public.is_profile_owner(profile_id));

-- PROFILE VERIFICATIONS
ALTER TABLE public.profile_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verifications"
  ON public.profile_verifications FOR SELECT
  USING (true);

CREATE POLICY "Owner can manage verifications"
  ON public.profile_verifications FOR INSERT
  WITH CHECK (public.is_profile_owner(profile_id));

CREATE POLICY "Owner can update verifications"
  ON public.profile_verifications FOR UPDATE
  USING (public.is_profile_owner(profile_id));

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_private_contexts_updated_at
  BEFORE UPDATE ON public.private_contexts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_profiles_owner ON public.profiles(owner_id) WHERE owner_id IS NOT NULL;
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profile_sources_profile ON public.profile_sources(profile_id);
CREATE INDEX idx_access_tokens_profile ON public.access_tokens(profile_id);
CREATE INDEX idx_access_tokens_hash ON public.access_tokens(token_hash);
CREATE INDEX idx_security_logs_profile ON public.security_logs(profile_id);
CREATE INDEX idx_security_logs_type ON public.security_logs(event_type);
CREATE INDEX idx_profile_reports_profile ON public.profile_reports(profile_id);

-- Enable realtime for profiles
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
