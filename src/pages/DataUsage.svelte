<script lang="ts">
  import { Link } from 'svelte-routing';
</script>

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold mb-6">Data Usage</h1>
    <p class="text-muted-foreground mb-8">How we use your data to provide recommendations.</p>
    
    <div class="max-w-4xl space-y-6">
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-4">Music Data</h3>
        <p class="text-muted-foreground">We analyze your listening history to understand your music preferences and suggest similar artists and songs.</p>
      </div>
      
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-4">Movie Data</h3>
        <p class="text-muted-foreground">Your viewing history helps us recommend films and TV shows that match your taste.</p>
      </div>
      
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-4">Reading Data</h3>
        <p class="text-muted-foreground">We use your reading preferences to suggest books and authors you might enjoy.</p>
      </div>
      
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-4">Privacy Controls</h3>
        <p class="text-muted-foreground">You can control what data we collect and how we use it through your privacy settings.</p>
      </div>
    </div>
  </div>
</div>