// Media Embed Service for Spotify, YouTube, and Google Books

export interface MediaItem {
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

export interface SearchResult {
  items: MediaItem[];
  totalResults: number;
  query: string;
}

// Spotify API Integration
export class SpotifyEmbedService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async searchTracks(query: string, limit = 10): Promise<MediaItem[]> {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
      return data.tracks.items.map((track: any) => ({
        id: track.id,
        type: 'spotify' as const,
        title: track.name,
        description: track.album.name,
        thumbnail: track.album.images[0]?.url,
        url: track.external_urls.spotify,
        embedUrl: `https://open.spotify.com/embed/track/${track.id}`,
        metadata: {
          artist: track.artists[0]?.name,
          duration: this.formatDuration(track.duration_ms),
          year: new Date(track.album.release_date).getFullYear(),
          genre: track.album.genres?.[0],
        },
      }));
    } catch (error) {
      console.error('Spotify search error:', error);
      return [];
    }
  }

  async searchAlbums(query: string, limit = 10): Promise<MediaItem[]> {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
      return data.albums.items.map((album: any) => ({
        id: album.id,
        type: 'spotify' as const,
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
      }));
    } catch (error) {
      console.error('Spotify album search error:', error);
      return [];
    }
  }

  async searchPlaylists(query: string, limit = 10): Promise<MediaItem[]> {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
      return data.playlists.items.map((playlist: any) => ({
        id: playlist.id,
        type: 'spotify' as const,
        title: playlist.name,
        description: playlist.description,
        thumbnail: playlist.images[0]?.url,
        url: playlist.external_urls.spotify,
        embedUrl: `https://open.spotify.com/embed/playlist/${playlist.id}`,
        metadata: {
          artist: playlist.owner.display_name,
          duration: `${playlist.tracks.total} tracks`,
        },
      }));
    } catch (error) {
      console.error('Spotify playlist search error:', error);
      return [];
    }
  }

  private formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// YouTube API Integration
export class YouTubeEmbedService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchVideos(query: string, limit = 10): Promise<MediaItem[]> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${limit}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items.map((item: any) => ({
        id: item.id.videoId,
        type: 'youtube' as const,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
        metadata: {
          artist: item.snippet.channelTitle,
          year: new Date(item.snippet.publishedAt).getFullYear(),
          duration: item.snippet.duration,
        },
      }));
    } catch (error) {
      console.error('YouTube search error:', error);
      return [];
    }
  }

  async searchChannels(query: string, limit = 10): Promise<MediaItem[]> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=channel&maxResults=${limit}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items.map((item: any) => ({
        id: item.id.channelId,
        type: 'youtube' as const,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url,
        url: `https://www.youtube.com/channel/${item.id.channelId}`,
        embedUrl: `https://www.youtube.com/embed/?listType=user_uploads&list=${item.id.channelId}`,
        metadata: {
          artist: item.snippet.channelTitle,
          year: new Date(item.snippet.publishedAt).getFullYear(),
        },
      }));
    } catch (error) {
      console.error('YouTube channel search error:', error);
      return [];
    }
  }
}

// Google Books API Integration
export class GoogleBooksEmbedService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchBooks(query: string, limit = 10): Promise<MediaItem[]> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${limit}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Google Books API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items.map((item: any) => {
        const volumeInfo = item.volumeInfo;
        const saleInfo = item.saleInfo;
        
        return {
          id: item.id,
          type: 'google-books' as const,
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
        };
      });
    } catch (error) {
      console.error('Google Books search error:', error);
      return [];
    }
  }

  async getBookDetails(bookId: string): Promise<MediaItem | null> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Google Books API error: ${response.status}`);
      }

      const item = await response.json();
      const volumeInfo = item.volumeInfo;
      const saleInfo = item.saleInfo;

      return {
        id: item.id,
        type: 'google-books' as const,
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
      };
    } catch (error) {
      console.error('Google Books details error:', error);
      return null;
    }
  }
}

// Unified Media Search Service
export class MediaSearchService {
  private spotifyService?: SpotifyEmbedService;
  private youtubeService?: YouTubeEmbedService;
  private booksService?: GoogleBooksEmbedService;

  constructor(
    spotifyToken?: string,
    youtubeApiKey?: string,
    booksApiKey?: string
  ) {
    if (spotifyToken) {
      this.spotifyService = new SpotifyEmbedService(spotifyToken);
    }
    if (youtubeApiKey) {
      this.youtubeService = new YouTubeEmbedService(youtubeApiKey);
    }
    if (booksApiKey) {
      this.booksService = new GoogleBooksEmbedService(booksApiKey);
    }
  }

  async searchAll(query: string, types: ('spotify' | 'youtube' | 'google-books')[] = ['spotify', 'youtube', 'google-books']): Promise<SearchResult> {
    const results: MediaItem[] = [];

    const searchPromises = types.map(async (type) => {
      switch (type) {
        case 'spotify':
          if (this.spotifyService) {
            const [tracks, albums, playlists] = await Promise.all([
              this.spotifyService.searchTracks(query, 5),
              this.spotifyService.searchAlbums(query, 3),
              this.spotifyService.searchPlaylists(query, 2),
            ]);
            return [...tracks, ...albums, ...playlists];
          }
          break;
        case 'youtube':
          if (this.youtubeService) {
            const [videos, channels] = await Promise.all([
              this.youtubeService.searchVideos(query, 5),
              this.youtubeService.searchChannels(query, 3),
            ]);
            return [...videos, ...channels];
          }
          break;
        case 'google-books':
          if (this.booksService) {
            return await this.booksService.searchBooks(query, 10);
          }
          break;
      }
      return [];
    });

    const searchResults = await Promise.all(searchPromises);
    searchResults.forEach(items => results.push(...items));

    return {
      items: results,
      totalResults: results.length,
      query,
    };
  }

  async searchByType(query: string, type: 'spotify' | 'youtube' | 'google-books'): Promise<MediaItem[]> {
    switch (type) {
      case 'spotify':
        if (this.spotifyService) {
          const [tracks, albums, playlists] = await Promise.all([
            this.spotifyService.searchTracks(query, 10),
            this.spotifyService.searchAlbums(query, 5),
            this.spotifyService.searchPlaylists(query, 5),
          ]);
          return [...tracks, ...albums, ...playlists];
        }
        break;
      case 'youtube':
        if (this.youtubeService) {
          const [videos, channels] = await Promise.all([
            this.youtubeService.searchVideos(query, 10),
            this.youtubeService.searchChannels(query, 5),
          ]);
          return [...videos, ...channels];
        }
        break;
      case 'google-books':
        if (this.booksService) {
          return await this.booksService.searchBooks(query, 20);
        }
        break;
    }
    return [];
  }
}