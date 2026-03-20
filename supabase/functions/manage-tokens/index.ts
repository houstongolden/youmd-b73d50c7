import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "you_";
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, profile_id, token_id, name, scopes, expires_in_days } = body;

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify ownership
    const { data: profile } = await adminClient
      .from("profiles")
      .select("id, owner_id")
      .eq("id", profile_id)
      .single();

    if (!profile || profile.owner_id !== user.id) {
      return new Response(JSON.stringify({ error: "Not the profile owner" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create") {
      const rawToken = generateToken();
      const tokenHash = await hashToken(rawToken);
      const expiresAt = expires_in_days
        ? new Date(Date.now() + expires_in_days * 86400000).toISOString()
        : null;

      const { data: token, error } = await adminClient
        .from("access_tokens")
        .insert({
          profile_id,
          name: name || "Unnamed Token",
          token_hash: tokenHash,
          scopes: scopes || ["read"],
          expires_at: expiresAt,
        })
        .select("id, name, scopes, expires_at, created_at")
        .single();

      if (error) throw error;

      // Log
      await adminClient.from("security_logs").insert({
        profile_id,
        user_id: user.id,
        event_type: "token_created",
        details: { token_name: name },
      });

      // Return the raw token ONCE — it won't be retrievable again
      return new Response(
        JSON.stringify({ success: true, token: rawToken, metadata: token }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "revoke") {
      const { error } = await adminClient
        .from("access_tokens")
        .update({ is_revoked: true })
        .eq("id", token_id)
        .eq("profile_id", profile_id);

      if (error) throw error;

      await adminClient.from("security_logs").insert({
        profile_id,
        user_id: user.id,
        token_id,
        event_type: "token_revoked",
        details: {},
      });

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Token error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
