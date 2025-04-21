import { OAuthResponse } from '../types/auth';

export async function exchangeCodeForToken(code: string): Promise<OAuthResponse> {
  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;
  const redirectUri = process.env.OAUTH_REDIRECT_URI || 'http://localhost:3000';

  if (!clientId || !clientSecret) {
    throw new Error('Client ID or Client Secret is not configured');
  }

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OAuth Token Error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    });
    throw new Error(`Failed to exchange code for token: ${errorText}`);
  }

  return await response.json();
} 