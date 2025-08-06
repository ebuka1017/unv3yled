<script lang="ts">
  import { onMount } from 'svelte';
  
  onMount(() => {
    // TODO: Implement auth callback logic
    console.log('Auth callback page loaded');
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
  <div class="text-center">
    <h1 class="text-2xl font-bold mb-4">Processing Authentication</h1>
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
  </div>
</div>