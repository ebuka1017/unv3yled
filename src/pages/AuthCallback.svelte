<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '@/lib/stores/auth';
  import { toastStore } from '@/lib/stores/toast';
  import { supabase } from '@/lib/supabase';
  import { Loader2, CheckCircle, XCircle } from 'lucide-svelte';
  
  let loading = true;
  let error: string | null = null;
  let success = false;
  
  onMount(async () => {
    try {
      // Handle the OAuth callback
      const { data, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        error = authError.message;
        toastStore.add({
          type: 'error',
          title: 'Authentication Failed',
          message: authError.message
        });
      } else if (data.session?.user) {
        authStore.setUser(data.session.user);
        success = true;
        toastStore.add({
          type: 'success',
          title: 'Welcome!',
          message: 'You have been successfully signed in.'
        });
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        error = 'No session found';
        toastStore.add({
          type: 'error',
          title: 'Authentication Failed',
          message: 'No session found. Please try signing in again.'
        });
      }
    } catch (err) {
      error = 'An unexpected error occurred';
      toastStore.add({
        type: 'error',
        title: 'Authentication Error',
        message: 'An unexpected error occurred during authentication.'
      });
    } finally {
      loading = false;
    }
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
  <div class="text-center">
    {#if loading}
      <Loader2 class="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
      <h1 class="text-2xl font-bold mb-4">Processing Authentication</h1>
      <p class="text-muted-foreground">Please wait while we complete your sign-in...</p>
    {:else if success}
      <CheckCircle class="w-8 h-8 mx-auto mb-4 text-green-500" />
      <h1 class="text-2xl font-bold mb-4">Authentication Successful</h1>
      <p class="text-muted-foreground">Redirecting to dashboard...</p>
    {:else if error}
      <XCircle class="w-8 h-8 mx-auto mb-4 text-red-500" />
      <h1 class="text-2xl font-bold mb-4">Authentication Failed</h1>
      <p class="text-muted-foreground mb-4">{error}</p>
      <button 
        on:click={() => window.location.href = '/auth'}
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
      >
        Try Again
      </button>
    {/if}
  </div>
</div>