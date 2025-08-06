<script lang="ts">
  import { Link } from 'svelte-routing';
</script>

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold mb-6">Saved Items</h1>
    <p class="text-muted-foreground mb-8">Your saved recommendations and discoveries.</p>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-2">Saved Song</h3>
        <p class="text-muted-foreground">Artist Name - Album</p>
      </div>
      
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-2">Saved Movie</h3>
        <p class="text-muted-foreground">Movie Title (2024)</p>
      </div>
      
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-2">Saved Book</h3>
        <p class="text-muted-foreground">Book Title - Author</p>
      </div>
    </div>
  </div>
</div>