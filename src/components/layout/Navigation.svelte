<script lang="ts">
  import { Link } from 'svelte-routing';
  import { authStore } from '@/lib/stores/auth';
  import { signOut } from '@/lib/supabase';
  import { toastStore } from '@/lib/stores/toast';
  import { Brain, Menu, X, LogOut, User, Settings, MessageSquare } from 'lucide-svelte';
  import Button from '@/components/ui/button/Button.svelte';
  import ThemeToggle from '@/components/ui/theme-toggle/ThemeToggle.svelte';
  
  let authState: any;
  let mobileMenuOpen = false;
  
  authStore.subscribe(state => {
    authState = state;
  });
  
  async function handleSignOut() {
    try {
      const { error } = await signOut();
      if (error) {
        toastStore.add({
          type: 'error',
          title: 'Sign Out Failed',
          message: error.message
        });
      } else {
        authStore.logout();
        toastStore.add({
          type: 'success',
          title: 'Signed Out',
          message: 'You have been successfully signed out.'
        });
        window.location.href = '/';
      }
    } catch (error) {
      toastStore.add({
        type: 'error',
        title: 'Sign Out Error',
        message: 'An unexpected error occurred.'
      });
    }
  }
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
</script>

<nav class="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
  <div class="container mx-auto px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <Link to="/" class="flex items-center gap-2">
        <Brain class="w-8 h-8 text-primary" />
        <span class="text-2xl font-bold text-foreground">unv3iled</span>
      </Link>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-6">
        <Link to="/about" class="text-muted-foreground hover:text-foreground transition-colors">
          About
        </Link>
        
        {#if authState?.user}
          <Link to="/chat" class="text-muted-foreground hover:text-foreground transition-colors">
            Chat
          </Link>
          <Link to="/recommendations" class="text-muted-foreground hover:text-foreground transition-colors">
            Recommendations
          </Link>
          <Link to="/media" class="text-muted-foreground hover:text-foreground transition-colors">
            Search
          </Link>
        {/if}
        
        <ThemeToggle />
        
        {#if authState?.user}
          <div class="flex items-center gap-2">
            <span class="text-sm text-muted-foreground">
              {authState.user.email?.split('@')[0] || 'User'}
            </span>
            <Button variant="outline" size="sm" on:click={handleSignOut}>
              <LogOut class="w-4 h-4" />
            </Button>
          </div>
        {:else}
          <Button on:click={() => window.location.href = '/auth'} className="pill-button">
            Get Started
          </Button>
        {/if}
      </div>
      
      <!-- Mobile menu button -->
      <button
        on:click={toggleMobileMenu}
        class="md:hidden p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
        aria-label="Toggle mobile menu"
      >
        {#if mobileMenuOpen}
          <X class="w-6 h-6" />
        {:else}
          <Menu class="w-6 h-6" />
        {/if}
      </button>
    </div>
    
    <!-- Mobile Navigation -->
    {#if mobileMenuOpen}
      <div class="md:hidden mt-4 pb-4 border-t border-border">
        <div class="flex flex-col gap-4 pt-4">
          <Link 
            to="/about" 
            class="text-muted-foreground hover:text-foreground transition-colors"
            on:click={() => mobileMenuOpen = false}
          >
            About
          </Link>
          
          {#if authState?.user}
            <Link 
              to="/dashboard" 
              class="text-muted-foreground hover:text-foreground transition-colors"
              on:click={() => mobileMenuOpen = false}
            >
              Dashboard
            </Link>
            <Link 
              to="/chat" 
              class="text-muted-foreground hover:text-foreground transition-colors"
              on:click={() => mobileMenuOpen = false}
            >
              Chat
            </Link>
            <Link 
              to="/recommendations" 
              class="text-muted-foreground hover:text-foreground transition-colors"
              on:click={() => mobileMenuOpen = false}
            >
              Recommendations
            </Link>
            <Link 
              to="/media" 
              class="text-muted-foreground hover:text-foreground transition-colors"
              on:click={() => mobileMenuOpen = false}
            >
              Search
            </Link>
            <Link 
              to="/settings" 
              class="text-muted-foreground hover:text-foreground transition-colors"
              on:click={() => mobileMenuOpen = false}
            >
              Settings
            </Link>
            <button 
              on:click={() => { handleSignOut(); mobileMenuOpen = false; }}
              class="text-left text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <LogOut class="w-4 h-4" />
              Sign Out
            </button>
          {:else}
            <Button 
              on:click={() => { window.location.href = '/auth'; mobileMenuOpen = false; }} 
              className="w-full"
            >
              Get Started
            </Button>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</nav>

<style>
  .pill-button {
    border-radius: 9999px;
  }
</style>