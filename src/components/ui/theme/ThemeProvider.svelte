<script lang="ts">
  import { onMount } from 'svelte';
  import { themeStore } from '@/lib/stores/theme';
  
  export let attribute: string = 'class';
  export let defaultTheme: string = 'light';
  export let enableSystem: boolean = true;
  
  let currentTheme: string;
  
  onMount(() => {
    // Subscribe to theme changes
    const unsubscribe = themeStore.subscribe(theme => {
      currentTheme = theme;
    });
    
    return unsubscribe;
  });
</script>

<div class="theme-provider" data-theme={currentTheme}>
  <slot />
</div>

<style>
  .theme-provider {
    min-height: 100vh;
  }
</style>