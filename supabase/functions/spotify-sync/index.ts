import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user's session
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid user session');
    }

    console.log(`Starting Spotify sync for user: ${user.id}`);

    // Get user's Spotify tokens from profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('spotify_access_token, spotify_refresh_token')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile?.spotify_access_token) {
      throw new Error('No Spotify access token found');
    }

    // Function to refresh Spotify access token
    async function refreshSpotifyToken(refreshToken: string): Promise<string> {
      const spotifyClientId = Deno.env.get('SPOTIFY_CLIENT_ID');
      const spotifyClientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET');
      
      if (!spotifyClientId || !spotifyClientSecret) {
        throw new Error('Spotify client credentials not configured');
      }

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${spotifyClientId}:${spotifyClientSecret}`)}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh Spotify token: ${response.status}`);
      }

      const tokenData = await response.json();
      return tokenData.access_token;
    }

    // Function to make authenticated Spotify API calls with automatic token refresh
    async function fetchSpotifyData(endpoint: string, accessToken: string, refreshToken: string): Promise<any> {
      let currentToken = accessToken;
      
      const makeRequest = async (token: string) => {
        const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('TOKEN_EXPIRED');
          }
          throw new Error(`Spotify API error: ${response.status}`);
        }

        return response.json();
      };

      try {
        return await makeRequest(currentToken);
      } catch (error) {
        if (error.message === 'TOKEN_EXPIRED') {
          console.log('Refreshing Spotify token...');
          currentToken = await refreshSpotifyToken(refreshToken);
          
          // Update the token in the database
          await supabaseClient
            .from('profiles')
            .update({ spotify_access_token: currentToken })
            .eq('user_id', user.id);
          
          return await makeRequest(currentToken);
        }
        throw error;
      }
    }

    // Fetch user's Spotify data
    console.log('Fetching Spotify data...');
    
    const [topTracks, topArtists, recentlyPlayed, savedTracks, userPlaylists] = await Promise.all([
      fetchSpotifyData('/me/top/tracks?limit=50&time_range=medium_term', profile.spotify_access_token, profile.spotify_refresh_token),
      fetchSpotifyData('/me/top/artists?limit=50&time_range=medium_term', profile.spotify_access_token, profile.spotify_refresh_token),
      fetchSpotifyData('/me/player/recently-played?limit=50', profile.spotify_access_token, profile.spotify_refresh_token),
      fetchSpotifyData('/me/tracks?limit=50', profile.spotify_access_token, profile.spotify_refresh_token),
      fetchSpotifyData('/me/playlists?limit=20', profile.spotify_access_token, profile.spotify_refresh_token),
    ]);

    console.log('Spotify data fetched successfully');

    // Store the data in spotify_data table
    const spotifyDataEntries = [
      {
        user_id: user.id,
        spotify_id: 'top_tracks',
        data_type: 'top_tracks',
        name: 'Top Tracks',
        metadata: topTracks,
        last_synced: new Date().toISOString(),
      },
      {
        user_id: user.id,
        spotify_id: 'top_artists',
        data_type: 'top_artists',
        name: 'Top Artists',
        metadata: topArtists,
        last_synced: new Date().toISOString(),
      },
      {
        user_id: user.id,
        spotify_id: 'recently_played',
        data_type: 'recently_played',
        name: 'Recently Played',
        metadata: recentlyPlayed,
        last_synced: new Date().toISOString(),
      },
      {
        user_id: user.id,
        spotify_id: 'saved_tracks',
        data_type: 'saved_tracks',
        name: 'Saved Tracks',
        metadata: savedTracks,
        last_synced: new Date().toISOString(),
      },
      {
        user_id: user.id,
        spotify_id: 'playlists',
        data_type: 'playlists',
        name: 'User Playlists',
        metadata: userPlaylists,
        last_synced: new Date().toISOString(),
      },
    ];

    // Upsert the data
    for (const entry of spotifyDataEntries) {
      const { error: upsertError } = await supabaseClient
        .from('spotify_data')
        .upsert(entry, { 
          onConflict: 'user_id,spotify_id',
          ignoreDuplicates: false 
        });

      if (upsertError) {
        console.error('Error upserting Spotify data:', upsertError);
        throw upsertError;
      }
    }

    console.log('Spotify data stored successfully');

    return new Response(
      JSON.stringify({ 
        message: 'Spotify sync completed successfully',
        data: {
          topTracks: topTracks.items?.length || 0,
          topArtists: topArtists.items?.length || 0,
          recentlyPlayed: recentlyPlayed.items?.length || 0,
          savedTracks: savedTracks.items?.length || 0,
          playlists: userPlaylists.items?.length || 0,
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Spotify sync error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to sync Spotify data' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});