<script lang="ts">
  import { onMount } from 'svelte';
  import { Search, Filter, Music, Film, Book, Mic, Heart, Star, Calendar, User } from 'lucide-svelte';
  import { mediaSearchService, type MediaItem, type SearchResult } from '@/lib/services/mediaSearch';
  import { userProfileService } from '@/lib/services/userProfile';
  import { authStore } from '@/lib/stores/auth';
  import { toastStore } from '@/lib/stores/toast';
  import Button from '@/components/ui/button/Button.svelte';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  
  let searchQuery = '';
  let searchResults: MediaItem[] = [];
  let loading = false;
  let selectedType: 'all' | 'music' | 'movie' | 'book' | 'podcast' = 'all';
  let authState: any;
  
  authStore.subscribe(state => {
    authState = state;
  });
  
  onMount(() => {
    // Load initial recommendations
    performSearch('recommendations');
  });
  
  async function performSearch(query: string) {
    if (!query.trim()) return;
    
    loading = true;
    searchQuery = query;
    
    try {
      let results: MediaItem[] = [];
      
      if (selectedType === 'all') {
        const searchResult = await mediaSearchService.searchAll(query, 20);
        results = searchResult.items;
      } else {
        switch (selectedType) {
          case 'music':
            results = await mediaSearchService.searchMusic(query, 10);
            break;
          case 'movie':
            results = await mediaSearchService.searchMovies(query, 10);
            break;
          case 'book':
            results = await mediaSearchService.searchBooks(query, 10);
            break;
          case 'podcast':
            results = await mediaSearchService.searchPodcasts(query, 10);
            break;
        }
      }
      
      searchResults = results;
    } catch (error) {
      console.error('Search error:', error);
      toastStore.add({
        type: 'error',
        title: 'Search Failed',
        message: 'Unable to perform search. Please try again.'
      });
    } finally {
      loading = false;
    }
  }
  
  async function handleSearch() {
    if (searchQuery.trim()) {
      await performSearch(searchQuery);
    }
  }
  
  async function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      await handleSearch();
    }
  }
  
  async function addToPreferences(item: MediaItem) {
    if (!authState?.user) {
      toastStore.add({
        type: 'info',
        title: 'Sign In Required',
        message: 'Please sign in to save your preferences.'
      });
      return;
    }
    
    try {
      const category = item.type === 'music' ? 'music' : 
                      item.type === 'movie' ? 'movies' : 
                      item.type === 'book' ? 'books' : 'podcasts';
      
      await userProfileService.addPreference(authState.user.id, category, item.title);
      
      toastStore.add({
        type: 'success',
        title: 'Added to Preferences',
        message: `${item.title} has been added to your ${category} preferences.`
      });
    } catch (error) {
      toastStore.add({
        type: 'error',
        title: 'Failed to Save',
        message: 'Unable to save to preferences. Please try again.'
      });
    }
  }
  
  function getTypeIcon(type: string) {
    switch (type) {
      case 'music': return Music;
      case 'movie': return Film;
      case 'book': return Book;
      case 'podcast': return Mic;
      default: return Heart;
    }
  }
  
  function getTypeColor(type: string) {
    switch (type) {
      case 'music': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'movie': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'book': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'podcast': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  }
</script>

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-6 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Media Search</h1>
      <p class="text-muted-foreground">Discover music, movies, books, and podcasts from across the web.</p>
    </div>
    
    <!-- Search Bar -->
    <div class="mb-6">
      <div class="flex gap-4 mb-4">
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            bind:value={searchQuery}
            on:keypress={handleKeyPress}
            type="text"
            placeholder="Search for music, movies, books, or podcasts..."
            class="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
        <Button on:click={handleSearch} disabled={loading || !searchQuery.trim()}>
          {#if loading}
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          {:else}
            Search
          {/if}
        </Button>
      </div>
      
      <!-- Filter Tabs -->
      <div class="flex gap-2">
        <Button
          variant={selectedType === 'all' ? 'default' : 'outline'}
          size="sm"
          on:click={() => { selectedType = 'all'; if (searchQuery) handleSearch(); }}
        >
          All
        </Button>
        <Button
          variant={selectedType === 'music' ? 'default' : 'outline'}
          size="sm"
          on:click={() => { selectedType = 'music'; if (searchQuery) handleSearch(); }}
        >
          <Music class="w-4 h-4 mr-1" />
          Music
        </Button>
        <Button
          variant={selectedType === 'movie' ? 'default' : 'outline'}
          size="sm"
          on:click={() => { selectedType = 'movie'; if (searchQuery) handleSearch(); }}
        >
          <Film class="w-4 h-4 mr-1" />
          Movies
        </Button>
        <Button
          variant={selectedType === 'book' ? 'default' : 'outline'}
          size="sm"
          on:click={() => { selectedType = 'book'; if (searchQuery) handleSearch(); }}
        >
          <Book class="w-4 h-4 mr-1" />
          Books
        </Button>
        <Button
          variant={selectedType === 'podcast' ? 'default' : 'outline'}
          size="sm"
          on:click={() => { selectedType = 'podcast'; if (searchQuery) handleSearch(); }}
        >
          <Mic class="w-4 h-4 mr-1" />
          Podcasts
        </Button>
      </div>
    </div>
    
    <!-- Results -->
    {#if loading}
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    {:else if searchResults.length > 0}
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each searchResults as item (item.id)}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-2">
                  <svelte:component this={getTypeIcon(item.type)} class="w-5 h-5 text-primary" />
                  <span class="text-xs px-2 py-1 rounded-full {getTypeColor(item.type)}">
                    {item.type}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  on:click={() => addToPreferences(item)}
                  className="p-1 h-8 w-8"
                >
                  <Heart class="w-4 h-4" />
                </Button>
              </div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              {#if item.artist || item.author}
                <CardDescription>
                  {item.artist || item.author}
                </CardDescription>
              {/if}
            </CardHeader>
            <CardContent className="pt-0">
              {#if item.description}
                <p class="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.description}
                </p>
              {/if}
              
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                {#if item.year}
                  <div class="flex items-center gap-1">
                    <Calendar class="w-3 h-3" />
                    {item.year}
                  </div>
                {/if}
                {#if item.rating}
                  <div class="flex items-center gap-1">
                    <Star class="w-3 h-3" />
                    {item.rating}
                  </div>
                {/if}
              </div>
              
              {#if item.url}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-3 inline-block text-sm text-primary hover:underline"
                >
                  View Details →
                </a>
              {/if}
            </CardContent>
          </Card>
        {/each}
      </div>
    {:else if searchQuery}
      <div class="text-center py-12">
        <Search class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 class="text-lg font-semibold mb-2">No results found</h3>
        <p class="text-muted-foreground">Try adjusting your search terms or filters.</p>
      </div>
    {:else}
      <div class="text-center py-12">
        <Search class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 class="text-lg font-semibold mb-2">Start searching</h3>
        <p class="text-muted-foreground">Enter a search term to discover new content.</p>
      </div>
    {/if}
  </div>
</div>