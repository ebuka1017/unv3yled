<script lang="ts">
  import Button from '@/components/ui/button/Button.svelte';
</script>

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold mb-6">Spotify Sync</h1>
    <p class="text-muted-foreground mb-8">Connect your Spotify account to analyze your music taste.</p>
    
    <div class="max-w-md">
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-4">Connect Spotify</h3>
        <p class="text-muted-foreground mb-6">We'll analyze your listening history to understand your music preferences.</p>
        <Button className="w-full">Connect Spotify Account</Button>
      </div>
    </div>
  </div>
</div>