<script lang="ts">
  import { onMount } from 'svelte';
  import { Link } from 'svelte-routing';
  import { authStore } from '@/lib/stores/auth';
  import { getCurrentUser } from '@/lib/supabase';
  import { User, Music, Film, Book, MessageSquare } from 'lucide-svelte';
  
  let authState: any;
  let loading = true;
  
  authStore.subscribe(state => {
    authState = state;
    loading = state.loading;
  });
  
  onMount(async () => {
    // Check if user is already authenticated
    const { user, error } = await getCurrentUser();
    if (user) {
      authStore.setUser(user);
    } else {
      authStore.setLoading(false);
    }
  });
  
  function navigate(path: string) {
    window.location.href = path;
  }
</script>

{#if loading}
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
{:else if !authState?.user}
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-4">No User Found</h1>
      <p class="text-muted-foreground mb-4">Please sign in to access your dashboard.</p>
      <button 
        on:click={() => navigate('/auth')}
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
      >
        Go to Auth
      </button>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-6 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Welcome back, {authState.user.email?.split('@')[0] || 'User'}!</h1>
        <p class="text-muted-foreground">Here's your personalized experience.</p>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-4">
            <MessageSquare class="w-6 h-6 text-primary" />
            <h3 class="text-lg font-semibold">Chat Interface</h3>
          </div>
          <p class="text-muted-foreground mb-4">Interact with your AI taste companion</p>
          <Link to="/chat" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-block">
            Open Chat
          </Link>
        </div>
        
        <div class="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-4">
            <Music class="w-6 h-6 text-primary" />
            <h3 class="text-lg font-semibold">Recommendations</h3>
          </div>
          <p class="text-muted-foreground mb-4">Discover new music, movies, and more</p>
          <Link to="/recommendations" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-block">
            View Recommendations
          </Link>
        </div>
        
        <div class="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-4">
            <User class="w-6 h-6 text-primary" />
            <h3 class="text-lg font-semibold">Taste Profile</h3>
          </div>
          <p class="text-muted-foreground mb-4">Manage your cultural preferences</p>
          <Link to="/profile" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-block">
            Edit Profile
          </Link>
        </div>
        
        <div class="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-4">
            <Film class="w-6 h-6 text-primary" />
            <h3 class="text-lg font-semibold">Media Search</h3>
          </div>
          <p class="text-muted-foreground mb-4">Search for movies, TV shows, and more</p>
          <Link to="/media" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-block">
            Search Media
          </Link>
        </div>
        
        <div class="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-4">
            <Book class="w-6 h-6 text-primary" />
            <h3 class="text-lg font-semibold">Saved Items</h3>
          </div>
          <p class="text-muted-foreground mb-4">Your saved recommendations and discoveries</p>
          <Link to="/saved" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-block">
            View Saved
          </Link>
        </div>
        
        <div class="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-4">
            <User class="w-6 h-6 text-primary" />
            <h3 class="text-lg font-semibold">Settings</h3>
          </div>
          <p class="text-muted-foreground mb-4">Manage your account and preferences</p>
          <Link to="/settings" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-block">
            Open Settings
          </Link>
        </div>
      </div>
    </div>
  </div>
{/if}