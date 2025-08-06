<script lang="ts">
  import { Link } from 'svelte-routing';
  import Button from '@/components/ui/button/Button.svelte';
</script>

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold mb-6">Welcome to Taste Oracle</h1>
    <p class="text-muted-foreground mb-8">Let's set up your taste profile to get personalized recommendations.</p>
    
    <div class="max-w-2xl">
      <div class="space-y-6">
        <div class="p-6 bg-card rounded-lg border">
          <h3 class="text-lg font-semibold mb-2">Step 1: Connect Your Accounts</h3>
          <p class="text-muted-foreground mb-4">Connect your Spotify, Netflix, and other accounts to analyze your preferences.</p>
          <Button>Connect Accounts</Button>
        </div>
        
        <div class="p-6 bg-card rounded-lg border">
          <h3 class="text-lg font-semibold mb-2">Step 2: Rate Some Content</h3>
          <p class="text-muted-foreground mb-4">Rate a few movies, songs, or books to help us understand your taste.</p>
          <Button>Start Rating</Button>
        </div>
        
        <div class="p-6 bg-card rounded-lg border">
          <h3 class="text-lg font-semibold mb-2">Step 3: Get Recommendations</h3>
          <p class="text-muted-foreground mb-4">Receive personalized recommendations based on your preferences.</p>
          <Link to="/dashboard">
            <Button>Complete Setup</Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
</div>