const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function fetchXProfile(username: string) {
  let profileImageUrl: string | null = null;
  let displayName: string | null = null;
  let bio: string | null = null;

  // Strategy 1: Twitter syndication API
  try {
    const res = await fetch(
      `https://syndication.twitter.com/srv/timeline-profile/screen-name/${username}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'text/html',
        },
        redirect: 'follow',
      }
    );
    if (res.ok) {
      const html = await res.text();
      const imgMatch = html.match(/https:\/\/pbs\.twimg\.com\/profile_images\/[^"'\s]+/);
      if (imgMatch?.[0]) {
        profileImageUrl = imgMatch[0]
          .replace(/_normal\.(jpg|jpeg|png|gif|webp)/i, '_400x400.$1')
          .replace(/_bigger\.(jpg|jpeg|png|gif|webp)/i, '_400x400.$1')
          .replace(/_mini\.(jpg|jpeg|png|gif|webp)/i, '_400x400.$1');
      }
      const nameMatch = html.match(/"name"\s*:\s*"([^"]+)"/);
      if (nameMatch?.[1]) displayName = nameMatch[1];
    } else {
      await res.text();
    }
  } catch (e) {
    console.log('X syndication failed:', e);
  }

  // Strategy 2: unavatar.io fallback
  if (!profileImageUrl) {
    profileImageUrl = `https://unavatar.io/x/${username}`;
  }

  return { profileImageUrl, displayName, bio, platform: 'x' as const };
}

async function fetchGitHubProfile(username: string) {
  let profileImageUrl: string | null = null;
  let displayName: string | null = null;
  let bio: string | null = null;

  // GitHub API is public and reliable — no auth needed for basic user info
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'you-md-agent/1.0',
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    if (res.ok) {
      const data = await res.json();
      profileImageUrl = data.avatar_url; // already high-res
      displayName = data.name || null;
      bio = data.bio || null;
    } else {
      await res.text();
    }
  } catch (e) {
    console.log('GitHub API failed:', e);
  }

  // Fallback: direct redirect URL
  if (!profileImageUrl) {
    profileImageUrl = `https://github.com/${username}.png?size=400`;
  }

  return { profileImageUrl, displayName, bio, platform: 'github' as const };
}

async function fetchLinkedInProfile(slug: string) {
  let profileImageUrl: string | null = null;
  let displayName: string | null = null;
  let bio: string | null = null;

  // Strategy 1: Fetch LinkedIn public page HTML (some profiles have og:image)
  try {
    const res = await fetch(`https://www.linkedin.com/in/${slug}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    if (res.ok) {
      const html = await res.text();

      // og:image often has the profile photo on public profiles
      const ogMatch = html.match(/<meta\s+(?:property|name)="og:image"\s+content="([^"]+)"/i)
        || html.match(/content="([^"]+)"\s+(?:property|name)="og:image"/i);
      if (ogMatch?.[1] && !ogMatch[1].includes('static.licdn.com/sc/h/') && !ogMatch[1].includes('default')) {
        profileImageUrl = ogMatch[1];
      }

      // og:title usually has the name
      const titleMatch = html.match(/<meta\s+(?:property|name)="og:title"\s+content="([^"]+)"/i)
        || html.match(/content="([^"]+)"\s+(?:property|name)="og:title"/i);
      if (titleMatch?.[1]) {
        // Format: "First Last - Title - Company | LinkedIn"
        displayName = titleMatch[1].split(/\s*[-–|]\s*/)[0].trim();
      }

      // og:description has headline/bio
      const descMatch = html.match(/<meta\s+(?:property|name)="og:description"\s+content="([^"]+)"/i)
        || html.match(/content="([^"]+)"\s+(?:property|name)="og:description"/i);
      if (descMatch?.[1]) {
        bio = descMatch[1];
      }
    } else {
      await res.text();
      console.log(`LinkedIn returned ${res.status}`);
    }
  } catch (e) {
    console.log('LinkedIn fetch failed:', e);
  }

  // Strategy 2: unavatar.io (uses google image search as fallback)
  if (!profileImageUrl) {
    profileImageUrl = `https://unavatar.io/linkedin/${slug}`;
  }

  return { profileImageUrl, displayName, bio, platform: 'linkedin' as const };
}

function detectPlatform(url: string): { platform: string; identifier: string } | null {
  const lower = url.toLowerCase().trim();

  // X / Twitter
  const xMatch = lower.match(/(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]+)/i);
  if (xMatch) return { platform: 'x', identifier: xMatch[1] };

  // GitHub
  const ghMatch = lower.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  if (ghMatch && !['orgs', 'topics', 'settings', 'marketplace', 'explore'].includes(ghMatch[1]))
    return { platform: 'github', identifier: ghMatch[1] };

  // LinkedIn
  const liMatch = lower.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (liMatch) return { platform: 'linkedin', identifier: liMatch[1] };

  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const url: string | undefined = body.url;
    const username: string | undefined = body.username;
    const platform: string | undefined = body.platform;

    // Detect platform from URL or use explicit username+platform
    let detected: { platform: string; identifier: string } | null = null;

    if (url) {
      detected = detectPlatform(url);
    } else if (username && platform) {
      detected = { platform, identifier: username.replace(/^@/, '').trim() };
    } else if (username) {
      // Legacy: assume X if just username provided
      detected = { platform: 'x', identifier: username.replace(/^@/, '').trim() };
    }

    if (!detected) {
      return new Response(
        JSON.stringify({ success: false, error: 'Could not detect platform from URL. Supported: x.com, github.com, linkedin.com/in/' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching ${detected.platform} profile for: ${detected.identifier}`);

    let result;
    switch (detected.platform) {
      case 'x':
        result = await fetchXProfile(detected.identifier);
        break;
      case 'github':
        result = await fetchGitHubProfile(detected.identifier);
        break;
      case 'linkedin':
        result = await fetchLinkedInProfile(detected.identifier);
        break;
      default:
        return new Response(
          JSON.stringify({ success: false, error: `Unsupported platform: ${detected.platform}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`Result — platform: ${result.platform}, image: ${result.profileImageUrl ? 'found' : 'none'}, name: ${result.displayName || 'unknown'}`);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          username: detected.identifier,
          ...result,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
