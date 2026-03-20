const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();

    if (!username) {
      return new Response(
        JSON.stringify({ success: false, error: 'Username is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanUsername = username.replace(/^@/, '').trim();
    console.log(`Fetching X profile photo for: ${cleanUsername}`);

    let profileImageUrl: string | null = null;
    let displayName: string | null = null;
    let bio: string | null = null;

    // Strategy 1: Twitter syndication API (returns server-rendered HTML with profile data)
    try {
      const syndicationRes = await fetch(
        `https://syndication.twitter.com/srv/timeline-profile/screen-name/${cleanUsername}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Accept': 'text/html',
          },
          redirect: 'follow',
        }
      );

      if (syndicationRes.ok) {
        const html = await syndicationRes.text();

        // Profile images in syndication HTML
        const imgMatch = html.match(/https:\/\/pbs\.twimg\.com\/profile_images\/[^"'\s]+/);
        if (imgMatch?.[0]) {
          profileImageUrl = imgMatch[0]
            .replace(/_normal\.(jpg|jpeg|png|gif|webp)/i, '_400x400.$1')
            .replace(/_bigger\.(jpg|jpeg|png|gif|webp)/i, '_400x400.$1')
            .replace(/_mini\.(jpg|jpeg|png|gif|webp)/i, '_400x400.$1');
        }

        // Try to extract name
        const nameMatch = html.match(/data-testid="UserName"[^>]*>([^<]+)/i)
          || html.match(/"name"\s*:\s*"([^"]+)"/);
        if (nameMatch?.[1]) {
          displayName = nameMatch[1];
        }
      } else {
        await syndicationRes.text(); // consume body
      }
    } catch (e) {
      console.log('Syndication attempt failed:', e);
    }

    // Strategy 2: unavatar.io — reliable avatar proxy that handles X/Twitter
    if (!profileImageUrl) {
      try {
        const unavatarRes = await fetch(`https://unavatar.io/x/${cleanUsername}`, {
          method: 'HEAD',
          redirect: 'follow',
        });

        if (unavatarRes.ok || unavatarRes.status === 302 || unavatarRes.status === 301) {
          // unavatar.io redirects to the actual image — use the final URL or the service URL directly
          profileImageUrl = unavatarRes.url || `https://unavatar.io/x/${cleanUsername}`;
        }
      } catch (e) {
        console.log('unavatar.io attempt failed:', e);
      }
    }

    // Strategy 3: Direct unavatar URL as last resort (it proxies in real-time)
    if (!profileImageUrl) {
      profileImageUrl = `https://unavatar.io/x/${cleanUsername}`;
    }

    console.log(`Result — image: ${profileImageUrl ? 'found' : 'none'}, name: ${displayName || 'unknown'}`);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          username: cleanUsername,
          profileImageUrl,
          displayName,
          bio,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching X profile:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
