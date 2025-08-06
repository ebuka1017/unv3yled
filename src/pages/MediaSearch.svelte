<script lang="ts">
  import { Link } from 'svelte-routing';
  import Button from '@/components/ui/button/Button.svelte';
  import { Search } from 'lucide-svelte';
  
  let searchQuery = '';
  let searchResults: any[] = [];
  
  function handleSearch() {
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  }
</script>

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold mb-6">Media Search</h1>
    <p class="text-muted-foreground mb-8">Search for music, movies, books, and more.</p>
    
    <div class="max-w-2xl mb-8">
      <div class="flex gap-2">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search for music, movies, books..."
          class="flex-1 px-4 py-2 border border-input rounded-lg bg-background"
        />
        <Button on:click={handleSearch}>
          <Search class="w-4 h-4" />
        </Button>
      </div>
    </div>
    
    {#if searchResults.length > 0}
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each searchResults as result}
          <div class="p-6 bg-card rounded-lg border">
            <h3 class="text-lg font-semibold mb-2">{result.title}</h3>
            <p class="text-muted-foreground">{result.description}</p>
          </div>
        {/each}
      </div>
    {:else}
      <div class="text-center text-muted-foreground">
        <p>Search for content to get started</p>
      </div>
    {/if}
  </div>
</div>