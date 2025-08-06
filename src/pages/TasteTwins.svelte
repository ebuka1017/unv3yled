<script lang="ts">
  import { Link } from 'svelte-routing';
</script>

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold mb-6">Taste Twins</h1>
    <p class="text-muted-foreground mb-8">Find people with similar cultural preferences.</p>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-2">User 1</h3>
        <p class="text-muted-foreground mb-4">95% taste match</p>
        <p class="text-sm">Loves indie rock, sci-fi movies, and fantasy books</p>
      </div>
      
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-2">User 2</h3>
        <p class="text-muted-foreground mb-4">87% taste match</p>
        <p class="text-sm">Enjoys electronic music, thrillers, and mystery novels</p>
      </div>
      
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-2">User 3</h3>
        <p class="text-muted-foreground mb-4">82% taste match</p>
        <p class="text-sm">Fans of jazz, documentaries, and historical fiction</p>
      </div>
    </div>
  </div>
</div>