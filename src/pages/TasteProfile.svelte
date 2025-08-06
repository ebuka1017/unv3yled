<script lang="ts">
  import { Link } from 'svelte-routing';
</script>

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold mb-6">Taste Profile</h1>
    <p class="text-muted-foreground mb-8">Manage your cultural preferences and taste profile.</p>
    
    <div class="grid md:grid-cols-2 gap-6">
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-4">Music Preferences</h3>
        <p class="text-muted-foreground">Configure your music taste and genres.</p>
      </div>
      
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-4">Movie Preferences</h3>
        <p class="text-muted-foreground">Set your movie and TV show preferences.</p>
      </div>
      
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-4">Book Preferences</h3>
        <p class="text-muted-foreground">Configure your reading preferences.</p>
      </div>
      
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-4">Other Media</h3>
        <p class="text-muted-foreground">Set preferences for other types of media.</p>
      </div>
    </div>
  </div>
</div>