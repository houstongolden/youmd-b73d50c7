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
    console.log(`Fetching X profile for: ${cleanUsername}`);

    // Fetch the X profile page server-side (no CORS restrictions)
    const response = await fetch(`https://x.com/${cleanUsername}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      console.error(`X.com returned status ${response.status}`);
      return new Response(
        JSON.stringify({ success: false, error: `Failed to fetch profile (${response.status})` }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = await response.text();

    // Extract profile image from meta tags
    let profileImageUrl: string | null = null;

    // Try og:image first (usually the profile photo)
    const ogImageMatch = html.match(/<meta\s+(?:property|name)="og:image"\s+content="([^"]+)"/i)
      || html.match(/content="([^"]+)"\s+(?:property|name)="og:image"/i);

    if (ogImageMatch?.[1]) {
      profileImageUrl = ogImageMatch[1];
    }

    // Try twitter:image
    if (!profileImageUrl) {
      const twitterImageMatch = html.match(/<meta\s+(?:property|name)="twitter:image"\s+content="([^"]+)"/i)
        || html.match(/content="([^"]+)"\s+(?:property|name)="twitter:image"/i);
      if (twitterImageMatch?.[1]) {
        profileImageUrl = twitterImageMatch[1];
      }
    }

    // Try profile_image_url in any JSON-LD or inline script
    if (!profileImageUrl) {
      const profileImgMatch = html.match(/"profile_image_url_https?"\s*:\s*"([^"]+)"/i);
      if (profileImgMatch?.[1]) {
        profileImageUrl = profileImgMatch[1].replace(/\\/g, '');
      }
    }

    // Extract display name from og:title or title tag
    let displayName: string | null = null;
    const ogTitleMatch = html.match(/<meta\s+(?:property|name)="og:title"\s+content="([^"]+)"/i)
      || html.match(/content="([^"]+)"\s+(?:property|name)="og:title"/i);
    if (ogTitleMatch?.[1]) {
      displayName = ogTitleMatch[1].split(/[(@]/)[0].trim();
    }

    // Extract bio from og:description
    let bio: string | null = null;
    const ogDescMatch = html.match(/<meta\s+(?:property|name)="og:description"\s+content="([^"]+)"/i)
      || html.match(/content="([^"]+)"\s+(?:property|name)="og:description"/i);
    if (ogDescMatch?.[1]) {
      bio = ogDescMatch[1];
    }

    console.log(`Found image: ${profileImageUrl ? 'yes' : 'no'}, name: ${displayName || 'unknown'}`);

    // If we got an image, try to get the higher-res version
    if (profileImageUrl) {
      // X profile images often come as _normal (48x48) or _200x200 or _400x400
      // Try to get the original (no size suffix)
      profileImageUrl = profileImageUrl
        .replace(/_normal\.(jpg|jpeg|png|gif|webp)/i, '_400x400.$1')
        .replace(/_200x200\.(jpg|jpeg|png|gif|webp)/i, '_400x400.$1');
    }

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
