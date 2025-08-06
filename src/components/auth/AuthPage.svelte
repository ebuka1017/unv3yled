<script lang="ts">
  import { Link } from 'svelte-routing';
  import Button from '@/components/ui/button/Button.svelte';
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
  <div class="w-full max-w-md p-6">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold mb-2">Welcome Back</h1>
      <p class="text-muted-foreground">Sign in to your account to continue</p>
    </div>
    
    <div class="space-y-4">
      <Button className="w-full" size="lg">
        Sign in with Google
      </Button>
      
      <Button variant="outline" className="w-full" size="lg">
        Sign in with Email
      </Button>
    </div>
    
    <div class="mt-6 text-center">
      <p class="text-sm text-muted-foreground">
        Don't have an account? 
        <Link to="/" class="text-primary hover:underline">Get started</Link>
      </p>
    </div>
  </div>
</div>