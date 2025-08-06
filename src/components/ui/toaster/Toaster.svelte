<script lang="ts">
  import { toastStore } from '@/lib/stores/toast';
  import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';
  
  let toasts: any[] = [];
  
  toastStore.subscribe(value => {
    toasts = value;
  });
  
  function removeToast(id: string) {
    toastStore.remove(id);
  }
  
  function getIcon(type: string) {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return XCircle;
      case 'warning':
        return AlertCircle;
      case 'info':
        return Info;
      default:
        return Info;
    }
  }
  
  function getToastClasses(type: string) {
    const baseClasses = 'flex items-center gap-3 p-4 rounded-lg shadow-lg border';
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-200`;
    }
  }
</script>

{#if toasts.length > 0}
  <div class="fixed top-4 right-4 z-50 space-y-2">
    {#each toasts as toast (toast.id)}
      <div 
        class={getToastClasses(toast.type)}
        in:fly={{ y: -50, duration: 300 }}
        out:fade={{ duration: 200 }}
      >
        <svelte:component this={getIcon(toast.type)} class="w-5 h-5 flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <h4 class="font-medium">{toast.title}</h4>
          {#if toast.message}
            <p class="text-sm opacity-90">{toast.message}</p>
          {/if}
        </div>
        <button
          on:click={() => removeToast(toast.id)}
          class="flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    {/each}
  </div>
{/if}