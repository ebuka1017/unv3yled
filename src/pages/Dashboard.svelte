<script lang="ts">
  import { onMount } from 'svelte';
  import { Link } from 'svelte-routing';
  
  let user: any = null;
  let loading = true;
  
  onMount(async () => {
    // TODO: Implement auth logic
    loading = false;
  });
  
  function navigate(path: string) {
    window.location.href = path;
  }
</script>

{#if loading}
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
{:else if !user}
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-4">No User Found</h1>
      <p class="text-muted-foreground mb-4">User state: {JSON.stringify({ user, loading })}</p>
      <button 
        on:click={() => navigate('/auth')}
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
      >
        Go to Auth
      </button>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-6 py-8">
      <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
      <p class="text-muted-foreground mb-8">Welcome back! Here's your personalized experience.</p>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="p-6 bg-card rounded-lg border">
          <h3 class="text-lg font-semibold mb-2">Chat Interface</h3>
          <p class="text-muted-foreground mb-4">Interact with your AI taste companion</p>
          <button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
            Open Chat
          </button>
        </div>
        
        <div class="p-6 bg-card rounded-lg border">
          <h3 class="text-lg font-semibold mb-2">Recommendations</h3>
          <p class="text-muted-foreground mb-4">Discover new music, movies, and more</p>
          <Link to="/recommendations" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg inline-block">
            View Recommendations
          </Link>
        </div>
        
        <div class="p-6 bg-card rounded-lg border">
          <h3 class="text-lg font-semibold mb-2">Taste Profile</h3>
          <p class="text-muted-foreground mb-4">Manage your cultural preferences</p>
          <Link to="/profile" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg inline-block">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  </div>
{/if}