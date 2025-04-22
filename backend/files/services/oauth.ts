let accessToken: string | null = null;
let tokenExpiry: number | null = null;

export const IGDB_BASE_URL = 'https://api.igdb.com/v4';

export async function getTwitchAccessToken(): Promise<string> {
  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Client ID or Client Secret is not configured');
  }

  // Check if we have a valid token
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  const data = await response.json();
  accessToken = data.access_token;
  // Set expiry to 1 hour from now (minus 5 minutes buffer)
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
  
  if (!accessToken) {
    throw new Error('Access token is null after successful response');
  }
  
  return accessToken;
}