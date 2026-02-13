// API Configuration
// Replace these values with your actual API keys

export const API_CONFIG = {
  // Spotify API - Get your credentials at https://developer.spotify.com/dashboard
  spotify: {
    clientId: '', // Your Spotify Client ID
    clientSecret: '', // Your Spotify Client Secret (keep private!)
    redirectUri: 'http://localhost:5174/callback',
    scopes: ['user-read-private', 'playlist-read-private', 'user-library-read']
  },
  
  // Google Calendar API - Get your credentials at https://console.cloud.google.com
  google: {
    clientId: '80818680137-rgkfh2kv9vhjm8ptu0f977htltg321js.apps.googleusercontent.com',
    apiKey: '', // Opcional: API Key para acceso público (sin auth)
    scopes: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
  },
  
  // ExerciseDB API - Free tier available at https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
  exerciseDB: {
    apiKey: '12bebe47a0mshf7372730b41bd86p13d8c1jsn29ccadd4498a', // Tu RapidAPI key
    baseUrl: 'https://exercisedb.p.rapidapi.com'
  }
};

// Spotify Auth Helper
export const getSpotifyAuthUrl = () => {
  const { clientId, redirectUri, scopes } = API_CONFIG.spotify;
  if (!clientId) return null;
  
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'token',
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    show_dialog: 'true'
  });
  
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// Google Calendar Auth Helper  
export const getGoogleAuthUrl = () => {
  const { clientId, scopes } = API_CONFIG.google;
  if (!clientId) return null;
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: 'http://localhost:5174/callback',
    response_type: 'token',
    scope: scopes
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};
