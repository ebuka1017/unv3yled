<script lang="ts">
  import { Link } from 'svelte-routing';
</script>

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold mb-6">About</h1>
    <p class="text-muted-foreground mb-4">This is the About page.</p>
    <Link to="/" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
      Back to Home
    </Link>
  </div>
</div>