<script lang="ts">
  import { Link } from 'svelte-routing';
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
  <div class="text-center">
    <h1 class="text-6xl font-bold text-muted-foreground mb-4">404</h1>
    <h2 class="text-2xl font-semibold mb-4">Page Not Found</h2>
    <p class="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
    <Link to="/" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
      Go Home
    </Link>
  </div>
</div>