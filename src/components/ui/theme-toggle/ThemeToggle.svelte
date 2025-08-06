<script lang="ts">
  import { Moon, Sun } from 'lucide-svelte';
  
  let isDark = false;
  
  function toggleTheme() {
    isDark = !isDark;
    // TODO: Implement proper theme toggle
  }
</script>

<button
  on:click={toggleTheme}
  class="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
  aria-label="Toggle theme"
>
  {#if isDark}
    <Sun class="h-5 w-5" />
  {:else}
    <Moon class="h-5 w-5" />
  {/if}
</button>