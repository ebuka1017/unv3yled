<script lang="ts">
  import { Link } from 'svelte-routing';
  import { onMount } from 'svelte';
  import Button from '@/components/ui/button/Button.svelte';
  import { authStore } from '@/lib/stores/auth';
  import { toastStore } from '@/lib/stores/toast';
  import { signInWithGoogle, getCurrentUser } from '@/lib/supabase';
  import { Loader2 } from 'lucide-svelte';
  
  let loading = false;
  let authState: any;
  
  authStore.subscribe(state => {
    authState = state;
  });
  
  onMount(async () => {
    // Check if user is already authenticated
    const { user, error } = await getCurrentUser();
    if (user) {
      authStore.setUser(user);
    }
  });
  
  async function handleGoogleSignIn() {
    loading = true;
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toastStore.add({
          type: 'error',
          title: 'Authentication Failed',
          message: error.message
        });
      } else {
        toastStore.add({
          type: 'success',
          title: 'Redirecting to Google',
          message: 'Please complete the authentication process.'
        });
      }
    } catch (error) {
      toastStore.add({
        type: 'error',
        title: 'Authentication Error',
        message: 'An unexpected error occurred.'
      });
    } finally {
      loading = false;
    }
  }
  
  async function handleEmailSignIn() {
    toastStore.add({
      type: 'info',
      title: 'Coming Soon',
      message: 'Email authentication will be available soon.'
    });
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
  <div class="w-full max-w-md p-6">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold mb-2">Welcome Back</h1>
      <p class="text-muted-foreground">Sign in to your account to continue</p>
    </div>
    
    <div class="space-y-4">
      <Button 
        className="w-full" 
        size="lg" 
        on:click={handleGoogleSignIn}
        disabled={loading}
      >
        {#if loading}
          <Loader2 class="w-4 h-4 mr-2 animate-spin" />
        {/if}
        Sign in with Google
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full" 
        size="lg"
        on:click={handleEmailSignIn}
      >
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