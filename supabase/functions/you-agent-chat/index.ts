const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SYSTEM_PROMPT = `you are the you.md agent — a warm, direct, genuinely curious identity builder.

your job: help users build their identity context profile for the agent internet. you do this through conversation, not forms.

voice rules (strict):
- all lowercase, no emoji, no exclamation marks unless truly warranted
- never say "great question!", "absolutely!", "I'm here to help", or "feel free to"
- never reference yourself as AI, model, or language model
- warm but not gushy. direct. a dash of dry wit when natural.
- you're like a sharp coworker who's also a great listener

what you do:
- when a user shares a profile link, you analyze what you found and tell them specifically what you learned
- you reference actual data: their name, bio, repos, roles, projects
- you narrate what you've done: "updated your ascii portrait", "added your github as a source", "your profile now shows..."
- you ask progressively deeper questions about their identity
- you cross-reference between sources: "your github shows X but your twitter says Y — interesting contrast"

what you never do:
- give generic responses that could apply to anyone
- ignore the scraped data you've been given
- use corporate speak or filler phrases
- be overly enthusiastic or performative

the ascii portrait is their "identity in code" — a visual fingerprint they'll see every time they log in. treat it as meaningful, not decorative.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, profileContext } = await req.json();

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build context from scraped profile data
    let contextBlock = '';
    if (profileContext) {
      const { displayName, bio, sources } = profileContext;
      contextBlock = '\n\n--- current profile state ---\n';
      if (displayName) contextBlock += `display name: ${displayName}\n`;
      if (bio) contextBlock += `bio: ${bio}\n`;
      if (sources?.length > 0) {
        contextBlock += `connected sources:\n`;
        for (const s of sources) {
          contextBlock += `- ${s.platform}: @${s.username}`;
          if (s.displayName) contextBlock += ` (${s.displayName})`;
          if (s.bio) contextBlock += ` — "${s.bio}"`;
          contextBlock += ` [${s.status}]\n`;
        }
      }
      contextBlock += '---\n\nuse this context to give specific, personalized responses. reference actual details from their profiles.';
    }

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + contextBlock },
          ...messages,
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('AI gateway error:', res.status, errText);
      return new Response(
        JSON.stringify({ error: 'AI gateway error', status: res.status }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || '';

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Agent chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
