<script lang="ts">
  import '../app.css'
  import { onMount } from 'svelte'
  import { supabase } from '$lib/supabase'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { fade, fly } from 'svelte/transition'
  import { 
    Home, 
    MessageSquare, 
    User, 
    Music, 
    Search, 
    Settings,
    LogOut,
    Menu,
    X
  } from 'lucide-svelte'

  let user: any = null
  let loading = true
  let sidebarOpen = false

  onMount(async () => {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession()
    user = session?.user ?? null

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      user = session?.user ?? null
      loading = false
    })

    loading = false
  })

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    goto('/auth')
  }

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Taste Profile', href: '/profile', icon: User },
    { name: 'Media Search', href: '/media', icon: Search },
    { name: 'Taste Twins', href: '/twins', icon: Music },
    { name: 'Settings', href: '/settings', icon: Settings }
  ]
</script>

<svelte:head>
  <title>Unv3iled - Modern AI Companion</title>
  <meta name="description" content="Your cultural intelligence companion powered by AI" />
</svelte:head>

{#if loading}
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
{:else if !user && $page.url.pathname !== '/auth'}
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gradient mb-4">Unv3iled</h1>
      <p class="text-muted-foreground mb-8">Your cultural intelligence companion</p>
      <button 
        class="glass-button px-6 py-3 rounded-lg text-white font-medium"
        on:click={() => goto('/auth')}
      >
        Sign In
      </button>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-background">
    <!-- Mobile sidebar overlay -->
    {#if sidebarOpen}
      <div 
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        on:click={() => sidebarOpen = false}
        transition:fade
      />
    {/if}

    <!-- Sidebar -->
    <div 
      class="fixed inset-y-0 left-0 z-50 w-64 bg-glass-strong backdrop-blur-xl border-r border-glass-border transform transition-transform duration-300 lg:translate-x-0 {sidebarOpen ? 'translate-x-0' : '-translate-x-full'}"
      transition:fly={{ x: -300 }}
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="p-6 border-b border-glass-border">
          <h1 class="text-2xl font-bold text-gradient">Unv3iled</h1>
          <p class="text-sm text-muted-foreground">Cultural Intelligence</p>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          {#each navigation as item}
            <a
              href={item.href}
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-glass-button hover-lift {$page.url.pathname === item.href ? 'bg-glass-button text-primary' : 'text-muted-foreground'}"
            >
              <svelte:component this={item.icon} class="w-5 h-5" />
              {item.name}
            </a>
          {/each}
        </nav>

        <!-- User section -->
        {#if user}
          <div class="p-4 border-t border-glass-border">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User class="w-5 h-5 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-primary truncate">
                  {user.email}
                </p>
                <p class="text-xs text-muted-foreground">Signed in</p>
              </div>
            </div>
            <button
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-glass-button hover-lift transition-all duration-200"
              on:click={handleSignOut}
            >
              <LogOut class="w-5 h-5" />
              Sign Out
            </button>
          </div>
        {/if}
      </div>
    </div>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Mobile header -->
      <div class="lg:hidden flex items-center justify-between p-4 border-b border-glass-border bg-glass-strong backdrop-blur-xl">
        <button
          class="p-2 rounded-lg hover:bg-glass-button transition-colors"
          on:click={() => sidebarOpen = !sidebarOpen}
        >
          {#if sidebarOpen}
            <X class="w-6 h-6" />
          {:else}
            <Menu class="w-6 h-6" />
          {/if}
        </button>
        <h1 class="text-xl font-bold text-gradient">Unv3iled</h1>
        <div class="w-10" />
      </div>

      <!-- Page content -->
      <main class="min-h-screen">
        <slot />
      </main>
    </div>
  </div>
{/if}
