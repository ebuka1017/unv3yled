import { toastStore } from '@/lib/stores/toast';

export interface MediaItem {
  id: string;
  type: 'music' | 'movie' | 'book' | 'podcast';
  title: string;
  artist?: string;
  author?: string;
  description?: string;
  image?: string;
  url?: string;
  rating?: number;
  year?: number;
  genre?: string[];
}

export interface SearchResult {
  items: MediaItem[];
  total: number;
  query: string;
}

class MediaSearchService {
  private SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  private SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
  private TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  private GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

  private async getSpotifyToken(): Promise<string | null> {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.SPOTIFY_CLIENT_ID}:${this.SPOTIFY_CLIENT_SECRET}`)}`,
        },
        body: 'grant_type=client_credentials',
      });

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting Spotify token:', error);
      return null;
    }
  }

  async searchMusic(query: string, limit: number = 10): Promise<MediaItem[]> {
    try {
      const token = await this.getSpotifyToken();
      if (!token) {
        return this.getMockMusicResults(query, limit);
      }

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist,album&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      const items: MediaItem[] = [];

      // Process tracks
      if (data.tracks?.items) {
        items.push(...data.tracks.items.map((track: any) => ({
          id: track.id,
          type: 'music' as const,
          title: track.name,
          artist: track.artists?.[0]?.name,
          description: track.album?.name,
          image: track.album?.images?.[0]?.url,
          url: track.external_urls?.spotify,
          year: new Date(track.album?.release_date).getFullYear(),
          genre: track.album?.genres || []
        })));
      }

      // Process albums
      if (data.albums?.items) {
        items.push(...data.albums.items.map((album: any) => ({
          id: album.id,
          type: 'music' as const,
          title: album.name,
          artist: album.artists?.[0]?.name,
          description: `Album by ${album.artists?.[0]?.name}`,
          image: album.images?.[0]?.url,
          url: album.external_urls?.spotify,
          year: new Date(album.release_date).getFullYear(),
          genre: album.genres || []
        })));
      }

      return items.slice(0, limit);
    } catch (error) {
      console.error('Error searching music:', error);
      return this.getMockMusicResults(query, limit);
    }
  }

  async searchMovies(query: string, limit: number = 10): Promise<MediaItem[]> {
    try {
      if (!this.TMDB_API_KEY) {
        return this.getMockMovieResults(query, limit);
      }

      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${this.TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`
      );

      const data = await response.json();
      
      return data.results?.slice(0, limit).map((movie: any) => ({
        id: movie.id.toString(),
        type: 'movie' as const,
        title: movie.title,
        description: movie.overview,
        image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
        url: `https://www.themoviedb.org/movie/${movie.id}`,
        rating: movie.vote_average,
        year: new Date(movie.release_date).getFullYear(),
        genre: movie.genre_ids || []
      })) || [];
    } catch (error) {
      console.error('Error searching movies:', error);
      return this.getMockMovieResults(query, limit);
    }
  }

  async searchBooks(query: string, limit: number = 10): Promise<MediaItem[]> {
    try {
      if (!this.GOOGLE_BOOKS_API_KEY) {
        return this.getMockBookResults(query, limit);
      }

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${this.GOOGLE_BOOKS_API_KEY}&maxResults=${limit}`
      );

      const data = await response.json();
      
      return data.items?.map((book: any) => ({
        id: book.id,
        type: 'book' as const,
        title: book.volumeInfo?.title,
        author: book.volumeInfo?.authors?.[0],
        description: book.volumeInfo?.description,
        image: book.volumeInfo?.imageLinks?.thumbnail,
        url: book.volumeInfo?.previewLink,
        rating: book.volumeInfo?.averageRating,
        year: book.volumeInfo?.publishedDate ? new Date(book.volumeInfo.publishedDate).getFullYear() : undefined,
        genre: book.volumeInfo?.categories || []
      })) || [];
    } catch (error) {
      console.error('Error searching books:', error);
      return this.getMockBookResults(query, limit);
    }
  }

  async searchPodcasts(query: string, limit: number = 10): Promise<MediaItem[]> {
    // For now, return mock data since podcast APIs require more setup
    return this.getMockPodcastResults(query, limit);
  }

  async searchAll(query: string, limit: number = 20): Promise<SearchResult> {
    const [music, movies, books, podcasts] = await Promise.all([
      this.searchMusic(query, Math.ceil(limit / 4)),
      this.searchMovies(query, Math.ceil(limit / 4)),
      this.searchBooks(query, Math.ceil(limit / 4)),
      this.searchPodcasts(query, Math.ceil(limit / 4))
    ]);

    const items = [...music, ...movies, ...books, ...podcasts].slice(0, limit);

    return {
      items,
      total: items.length,
      query
    };
  }

  // Mock data for when APIs are not configured
  private getMockMusicResults(query: string, limit: number): MediaItem[] {
    const mockMusic = [
      { title: 'Bohemian Rhapsody', artist: 'Queen', year: 1975 },
      { title: 'Hotel California', artist: 'Eagles', year: 1976 },
      { title: 'Imagine', artist: 'John Lennon', year: 1971 },
      { title: 'Stairway to Heaven', artist: 'Led Zeppelin', year: 1971 },
      { title: 'Like a Rolling Stone', artist: 'Bob Dylan', year: 1965 }
    ];

    return mockMusic
      .filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.artist.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit)
      .map((item, index) => ({
        id: `music-${index}`,
        type: 'music' as const,
        title: item.title,
        artist: item.artist,
        description: `Classic song by ${item.artist}`,
        year: item.year
      }));
  }

  private getMockMovieResults(query: string, limit: number): MediaItem[] {
    const mockMovies = [
      { title: 'The Shawshank Redemption', year: 1994, rating: 9.3 },
      { title: 'The Godfather', year: 1972, rating: 9.2 },
      { title: 'Pulp Fiction', year: 1994, rating: 8.9 },
      { title: 'Fight Club', year: 1999, rating: 8.8 },
      { title: 'Inception', year: 2010, rating: 8.8 }
    ];

    return mockMovies
      .filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit)
      .map((item, index) => ({
        id: `movie-${index}`,
        type: 'movie' as const,
        title: item.title,
        description: `A classic film from ${item.year}`,
        rating: item.rating,
        year: item.year
      }));
  }

  private getMockBookResults(query: string, limit: number): MediaItem[] {
    const mockBooks = [
      { title: '1984', author: 'George Orwell', year: 1949 },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
      { title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813 },
      { title: 'The Catcher in the Rye', author: 'J.D. Salinger', year: 1951 }
    ];

    return mockBooks
      .filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.author.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit)
      .map((item, index) => ({
        id: `book-${index}`,
        type: 'book' as const,
        title: item.title,
        author: item.author,
        description: `A classic novel by ${item.author}`,
        year: item.year
      }));
  }

  private getMockPodcastResults(query: string, limit: number): MediaItem[] {
    const mockPodcasts = [
      { title: 'Serial', author: 'Sarah Koenig', year: 2014 },
      { title: 'This American Life', author: 'Ira Glass', year: 1995 },
      { title: 'Radiolab', author: 'Jad Abumrad', year: 2002 },
      { title: 'The Joe Rogan Experience', author: 'Joe Rogan', year: 2009 },
      { title: 'Stuff You Should Know', author: 'Josh Clark', year: 2008 }
    ];

    return mockPodcasts
      .filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.author.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit)
      .map((item, index) => ({
        id: `podcast-${index}`,
        type: 'podcast' as const,
        title: item.title,
        author: item.author,
        description: `A popular podcast by ${item.author}`,
        year: item.year
      }));
  }
}

export const mediaSearchService = new MediaSearchService();