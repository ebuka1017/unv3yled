<script lang="ts">
  let error: Error | null = null;
  
  // Simple error handling for Svelte
  function handleError(err: Error) {
    error = err;
    console.error('Error caught by boundary:', err);
  }
</script>

{#if error}
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="text-center p-8">
      <h1 class="text-2xl font-bold mb-4 text-destructive">Something went wrong</h1>
      <p class="text-muted-foreground mb-4">We're sorry, but something unexpected happened.</p>
      <button 
        on:click={() => window.location.reload()}
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
      >
        Reload Page
      </button>
      {#if error.message}
        <details class="mt-4 text-left">
          <summary class="cursor-pointer text-sm text-muted-foreground">Error Details</summary>
          <pre class="mt-2 text-xs bg-muted p-2 rounded overflow-auto">{error.message}</pre>
        </details>
      {/if}
    </div>
  </div>
{:else}
  <slot />
{/if}