<script lang="ts">
  import { Link } from 'svelte-routing';
</script>

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold mb-6">Recommendations</h1>
    <p class="text-muted-foreground mb-8">Discover new content tailored to your taste.</p>
    
    <div class="grid md:grid-cols-3 gap-6">
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-4">Music</h3>
        <p class="text-muted-foreground mb-4">New songs and artists you might like.</p>
        <div class="space-y-2">
          <div class="p-3 bg-muted rounded">Song 1 - Artist 1</div>
          <div class="p-3 bg-muted rounded">Song 2 - Artist 2</div>
          <div class="p-3 bg-muted rounded">Song 3 - Artist 3</div>
        </div>
      </div>
      
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-4">Movies</h3>
        <p class="text-muted-foreground mb-4">Films and TV shows for you.</p>
        <div class="space-y-2">
          <div class="p-3 bg-muted rounded">Movie 1 (2024)</div>
          <div class="p-3 bg-muted rounded">Movie 2 (2023)</div>
          <div class="p-3 bg-muted rounded">TV Show 1</div>
        </div>
      </div>
      
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-4">Books</h3>
        <p class="text-muted-foreground mb-4">Reading recommendations.</p>
        <div class="space-y-2">
          <div class="p-3 bg-muted rounded">Book 1 - Author 1</div>
          <div class="p-3 bg-muted rounded">Book 2 - Author 2</div>
          <div class="p-3 bg-muted rounded">Book 3 - Author 3</div>
        </div>
      </div>
    </div>
  </div>
</div>