import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MediaItem {
  id: string;
  type: 'spotify' | 'youtube' | 'google-books';
  title: string;
  description?: string;
  thumbnail?: string;
  url: string;
  embedUrl: string;
  metadata: {
    artist?: string;
    author?: string;
    duration?: string;
    year?: number;
    genre?: string;
    rating?: number;
    isbn?: string;
    publisher?: string;
    pageCount?: number;
    language?: string;
  };
}

interface SearchResult {
  items: MediaItem[];
  totalResults: number;
  query: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get the user's session
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Invalid user session');
    }

    const { query, type, limit = 20 } = await req.json();

    if (!query) {
      throw new Error('Query is required');
    }

    console.log(`Media search for user: ${user.id}, query: "${query}", type: ${type || 'all'}`);

    const results: MediaItem[] = [];

    // Spotify Search
    if (!type || type === 'spotify') {
      try {
        // Get user's Spotify token
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('spotify_access_token')
          .eq('user_id', user.id)
          .single();

        if (profile?.spotify_access_token) {
          const spotifyResults = await searchSpotify(query, profile.spotify_access_token, Math.floor(limit / 3));
          results.push(...spotifyResults);
        }
      } catch (error) {
        console.error('Spotify search error:', error);
      }
    }

    // YouTube Search
    if (!type || type === 'youtube') {
      try {
        const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
        if (youtubeApiKey) {
          const youtubeResults = await searchYouTube(query, youtubeApiKey, Math.floor(limit / 3));
          results.push(...youtubeResults);
        }
      } catch (error) {
        console.error('YouTube search error:', error);
      }
    }

    // Google Books Search
    if (!type || type === 'google-books') {
      try {
        const booksApiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY');
        if (booksApiKey) {
          const booksResults = await searchGoogleBooks(query, booksApiKey, Math.floor(limit / 3));
          results.push(...booksResults);
        }
      } catch (error) {
        console.error('Google Books search error:', error);
      }
    }

    const searchResult: SearchResult = {
      items: results,
      totalResults: results.length,
      query,
    };

    return new Response(
      JSON.stringify(searchResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Media search error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to search media' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function searchSpotify(query: string, accessToken: string, limit: number): Promise<MediaItem[]> {
  const results: MediaItem[] = [];

  try {
    // Search tracks
    const tracksResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${Math.floor(limit / 3)}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (tracksResponse.ok) {
      const tracksData = await tracksResponse.json();
      tracksData.tracks.items.forEach((track: any) => {
        results.push({
          id: track.id,
          type: 'spotify',
          title: track.name,
          description: track.album.name,
          thumbnail: track.album.images[0]?.url,
          url: track.external_urls.spotify,
          embedUrl: `https://open.spotify.com/embed/track/${track.id}`,
          metadata: {
            artist: track.artists[0]?.name,
            duration: formatDuration(track.duration_ms),
            year: new Date(track.album.release_date).getFullYear(),
            genre: track.album.genres?.[0],
          },
        });
      });
    }

    // Search albums
    const albumsResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=${Math.floor(limit / 3)}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (albumsResponse.ok) {
      const albumsData = await albumsResponse.json();
      albumsData.albums.items.forEach((album: any) => {
        results.push({
          id: album.id,
          type: 'spotify',
          title: album.name,
          description: `${album.total_tracks} tracks`,
          thumbnail: album.images[0]?.url,
          url: album.external_urls.spotify,
          embedUrl: `https://open.spotify.com/embed/album/${album.id}`,
          metadata: {
            artist: album.artists[0]?.name,
            year: new Date(album.release_date).getFullYear(),
            genre: album.genres?.[0],
          },
        });
      });
    }

    // Search playlists
    const playlistsResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=${Math.floor(limit / 3)}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (playlistsResponse.ok) {
      const playlistsData = await playlistsResponse.json();
      playlistsData.playlists.items.forEach((playlist: any) => {
        results.push({
          id: playlist.id,
          type: 'spotify',
          title: playlist.name,
          description: playlist.description,
          thumbnail: playlist.images[0]?.url,
          url: playlist.external_urls.spotify,
          embedUrl: `https://open.spotify.com/embed/playlist/${playlist.id}`,
          metadata: {
            artist: playlist.owner.display_name,
            duration: `${playlist.tracks.total} tracks`,
          },
        });
      });
    }
  } catch (error) {
    console.error('Spotify search error:', error);
  }

  return results;
}

async function searchYouTube(query: string, apiKey: string, limit: number): Promise<MediaItem[]> {
  const results: MediaItem[] = [];

  try {
    // Search videos
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${Math.floor(limit / 2)}&key=${apiKey}`
    );

    if (videosResponse.ok) {
      const videosData = await videosResponse.json();
      videosData.items.forEach((item: any) => {
        results.push({
          id: item.id.videoId,
          type: 'youtube',
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high?.url,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
          metadata: {
            artist: item.snippet.channelTitle,
            year: new Date(item.snippet.publishedAt).getFullYear(),
          },
        });
      });
    }

    // Search channels
    const channelsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=channel&maxResults=${Math.floor(limit / 2)}&key=${apiKey}`
    );

    if (channelsResponse.ok) {
      const channelsData = await channelsResponse.json();
      channelsData.items.forEach((item: any) => {
        results.push({
          id: item.id.channelId,
          type: 'youtube',
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high?.url,
          url: `https://www.youtube.com/channel/${item.id.channelId}`,
          embedUrl: `https://www.youtube.com/embed/?listType=user_uploads&list=${item.id.channelId}`,
          metadata: {
            artist: item.snippet.channelTitle,
            year: new Date(item.snippet.publishedAt).getFullYear(),
          },
        });
      });
    }
  } catch (error) {
    console.error('YouTube search error:', error);
  }

  return results;
}

async function searchGoogleBooks(query: string, apiKey: string, limit: number): Promise<MediaItem[]> {
  const results: MediaItem[] = [];

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${limit}&key=${apiKey}`
    );

    if (response.ok) {
      const data = await response.json();
      data.items.forEach((item: any) => {
        const volumeInfo = item.volumeInfo;
        
        results.push({
          id: item.id,
          type: 'google-books',
          title: volumeInfo.title,
          description: volumeInfo.description,
          thumbnail: volumeInfo.imageLinks?.thumbnail,
          url: volumeInfo.infoLink,
          embedUrl: `https://books.google.com/books?id=${item.id}&hl=en&source=gbs_embed`,
          metadata: {
            author: volumeInfo.authors?.join(', '),
            publisher: volumeInfo.publisher,
            year: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : undefined,
            pageCount: volumeInfo.pageCount,
            language: volumeInfo.language,
            isbn: volumeInfo.industryIdentifiers?.[0]?.identifier,
            rating: volumeInfo.averageRating,
          },
        });
      });
    }
  } catch (error) {
    console.error('Google Books search error:', error);
  }

  return results;
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}