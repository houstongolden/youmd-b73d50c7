/**
 * Profile database helpers — all Supabase interactions for profiles.
 */
import { supabase } from "@/integrations/supabase/client";

export interface DbProfile {
  id: string;
  username: string;
  name: string | null;
  tagline: string | null;
  bio_short: string | null;
  bio_medium: string | null;
  location: string | null;
  website: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  voice: string | null;
  topics: string[];
  credibility: string[];
  links: any[];
  now_items: string[];
  values_list: string[];
  preferences: Record<string, any>;
  owner_id: string | null;
  claimed_at: string | null;
  is_claimed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbProfileSource {
  id: string;
  profile_id: string;
  platform: string;
  platform_username: string | null;
  display_name: string | null;
  bio: string | null;
  profile_image_url: string | null;
  location: string | null;
  website: string | null;
  headline: string | null;
  company: string | null;
  followers: number | null;
  following: number | null;
  posts: number | null;
  links: string[];
  extras: Record<string, any>;
  status: string;
  last_synced_at: string | null;
  created_at: string;
}

// Check for duplicate profiles by username or similar name+links
export async function findSimilarProfiles(username: string, name?: string) {
  const { data } = await supabase
    .from("profiles")
    .select("id, username, name, avatar_url, is_claimed")
    .or(`username.eq.${username}${name ? `,name.ilike.%${name}%` : ""}`)
    .limit(5);
  return data || [];
}

// Create a new profile (no auth required)
export async function createProfile(username: string, name?: string) {
  const { data, error } = await supabase
    .from("profiles")
    .insert({ username, name: name || null })
    .select()
    .single();
  if (error) throw error;
  return data as DbProfile;
}

// Get profile by username
export async function getProfileByUsername(username: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  return data as DbProfile | null;
}

// Get profile by id
export async function getProfileById(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as DbProfile | null;
}

// Get all profiles (for directory)
export async function getAllProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as DbProfile[];
}

// Get sources for a profile
export async function getProfileSources(profileId: string) {
  const { data, error } = await supabase
    .from("profile_sources")
    .select("*")
    .eq("profile_id", profileId);
  if (error) throw error;
  return (data || []) as DbProfileSource[];
}

// Upsert a source for a profile
export async function upsertProfileSource(profileId: string, source: {
  platform: string;
  platform_username?: string;
  display_name?: string;
  bio?: string;
  profile_image_url?: string;
  location?: string;
  website?: string;
  headline?: string;
  company?: string;
  followers?: number;
  following?: number;
  posts?: number;
  links?: string[];
  extras?: Record<string, any>;
  status?: string;
}) {
  const { data, error } = await supabase
    .from("profile_sources")
    .upsert(
      {
        profile_id: profileId,
        platform: source.platform,
        platform_username: source.platform_username || null,
        display_name: source.display_name || null,
        bio: source.bio || null,
        profile_image_url: source.profile_image_url || null,
        location: source.location || null,
        website: source.website || null,
        headline: source.headline || null,
        company: source.company || null,
        followers: source.followers ?? null,
        following: source.following ?? null,
        posts: source.posts ?? null,
        links: source.links || [],
        extras: source.extras || {},
        status: source.status || "synced",
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: "profile_id,platform" }
    )
    .select()
    .single();
  if (error) throw error;
  return data as DbProfileSource;
}

// Update profile fields
export async function updateProfile(profileId: string, updates: Partial<DbProfile>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", profileId)
    .select()
    .single();
  if (error) throw error;
  return data as DbProfile;
}

// Get security logs for a profile
export async function getSecurityLogs(profileId: string) {
  const { data, error } = await supabase
    .from("security_logs")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

// Get access tokens for a profile
export async function getAccessTokens(profileId: string) {
  const { data, error } = await supabase
    .from("access_tokens")
    .select("id, profile_id, name, scopes, expires_at, is_revoked, last_used_at, created_at")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// Submit a profile report
export async function reportProfile(profileId: string, reason: string, details?: string) {
  const { data: session } = await supabase.auth.getSession();
  const { error } = await supabase
    .from("profile_reports")
    .insert({
      profile_id: profileId,
      reporter_id: session?.session?.user?.id || null,
      reason,
      details: details || null,
    });
  if (error) throw error;
}

// Get profile verifications
export async function getProfileVerifications(profileId: string) {
  const { data, error } = await supabase
    .from("profile_verifications")
    .select("*")
    .eq("profile_id", profileId)
    .eq("is_active", true);
  if (error) throw error;
  return data || [];
}

// Log a security event
export async function logSecurityEvent(event: {
  profile_id?: string;
  event_type: string;
  details?: Record<string, any>;
}) {
  const { data: session } = await supabase.auth.getSession();
  await supabase.from("security_logs").insert({
    profile_id: event.profile_id || null,
    user_id: session?.session?.user?.id || null,
    event_type: event.event_type,
    details: event.details || {},
  });
}
