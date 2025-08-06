<script lang="ts">
  import { Moon, Sun } from 'lucide-svelte';
  import { themeStore } from '@/lib/stores/theme';
  
  let currentTheme: string = 'light';
  
  // Subscribe to theme changes
  themeStore.subscribe(theme => {
    currentTheme = theme;
  });
  
  function toggleTheme() {
    themeStore.toggle();
  }
</script>

<button
  on:click={toggleTheme}
  class="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
  aria-label="Toggle theme"
>
  {#if currentTheme === 'dark'}
    <Sun class="h-5 w-5" />
  {:else}
    <Moon class="h-5 w-5" />
  {/if}
</button>