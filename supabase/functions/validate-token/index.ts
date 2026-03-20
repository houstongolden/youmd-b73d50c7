import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
    const { token } = await req.json();
    if (!token) {
      return new Response(JSON.stringify({ valid: false, error: "Token required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tokenHash = await hashToken(token);

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: accessToken } = await adminClient
      .from("access_tokens")
      .select("id, profile_id, scopes, expires_at, is_revoked")
      .eq("token_hash", tokenHash)
      .single();

    if (!accessToken) {
      return new Response(
        JSON.stringify({ valid: false, error: "Token not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (accessToken.is_revoked) {
      return new Response(
        JSON.stringify({ valid: false, error: "Token revoked" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (accessToken.expires_at && new Date(accessToken.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ valid: false, error: "Token expired" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update last_used_at
    await adminClient
      .from("access_tokens")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", accessToken.id);

    // Log usage
    await adminClient.from("security_logs").insert({
      profile_id: accessToken.profile_id,
      token_id: accessToken.id,
      event_type: "token_used",
      details: {},
    });

    // Get the profile data based on scopes
    const { data: profile } = await adminClient
      .from("profiles")
      .select("*")
      .eq("id", accessToken.profile_id)
      .single();

    let privateContext = null;
    if (accessToken.scopes.includes("read")) {
      const { data } = await adminClient
        .from("private_contexts")
        .select("*")
        .eq("profile_id", accessToken.profile_id)
        .single();
      privateContext = data;
    }

    return new Response(
      JSON.stringify({
        valid: true,
        scopes: accessToken.scopes,
        profile,
        privateContext: accessToken.scopes.includes("read") ? privateContext : null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Validate error:", error);
    return new Response(
      JSON.stringify({ valid: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
