<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from '$lib/supabase'
  import { goto } from '$app/navigation'
  import { 
    Sparkles, 
    MessageSquare, 
    User, 
    Music, 
    Search, 
    Settings,
    ArrowRight,
    Play,
    Mic,
    Brain
  } from 'lucide-svelte'
  import { fly, fade } from 'svelte/transition'

  let user: any = null
  let loading = true

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    user = session?.user ?? null
    loading = false
  })

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Chat',
      description: 'Conversational cultural intelligence with real-time insights',
      href: '/chat'
    },
    {
      icon: User,
      title: 'Taste Profile',
      description: 'Your cultural fingerprint and preferences analysis',
      href: '/profile'
    },
    {
      icon: Search,
      title: 'Media Search',
      description: 'Discover music, videos, and books across platforms',
      href: '/media'
    },
    {
      icon: Music,
      title: 'Taste Twins',
      description: 'Find people with similar cultural preferences',
      href: '/twins'
    }
  ]

  const stats = [
    { label: 'Cultural Insights', value: 'AI-Powered' },
    { label: 'Media Platforms', value: '3+ Integrated' },
    { label: 'Real-time Voice', value: 'ElevenLabs' },
    { label: 'Taste Matching', value: 'Cosine Similarity' }
  ]
</script>

<svelte:head>
  <title>Unv3iled - Home</title>
</svelte:head>

{#if loading}
  <div class="min-h-screen flex items-center justify-center">
    <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
{:else}
  <div class="min-h-screen p-6">
    <!-- Hero Section -->
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16" in:fly={{ y: 50, duration: 800 }}>
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass-button border border-glass-border mb-6">
          <Sparkles class="w-4 h-4 text-primary" />
          <span class="text-sm font-medium text-primary">Modern AI Companion</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-bold text-gradient mb-6">
          Unv3iled
        </h1>
        
        <p class="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Your cultural intelligence companion powered by AI. Discover music, books, movies, and connect with people who share your taste.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            class="glass-button px-8 py-4 rounded-lg text-white font-medium flex items-center gap-2 hover-lift"
            on:click={() => goto('/chat')}
          >
            <Play class="w-5 h-5" />
            Start Chatting
          </button>
          
          <button 
            class="glass-card px-8 py-4 rounded-lg font-medium flex items-center gap-2 hover-lift"
            on:click={() => goto('/profile')}
          >
            <User class="w-5 h-5" />
            View Profile
          </button>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16" in:fly={{ y: 50, duration: 800, delay: 200 }}>
        {#each stats as stat, i}
          <div class="glass-card p-6 rounded-xl text-center hover-lift" transition:fly={{ y: 20, delay: i * 100 }}>
            <div class="text-2xl font-bold text-primary mb-2">{stat.value}</div>
            <div class="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        {/each}
      </div>

      <!-- Features Section -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-center mb-12">Features</h2>
        <div class="grid md:grid-cols-2 gap-6">
          {#each features as feature, i}
            <div 
              class="glass-card p-6 rounded-xl hover-lift cursor-pointer"
              on:click={() => goto(feature.href)}
              transition:fly={{ y: 50, delay: i * 200 }}
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svelte:component this={feature.icon} class="w-6 h-6 text-primary" />
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p class="text-muted-foreground mb-4">{feature.description}</p>
                  <div class="flex items-center gap-2 text-primary font-medium">
                    <span>Explore</span>
                    <ArrowRight class="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Voice Feature Highlight -->
      <div class="glass-strong rounded-2xl p-8 mb-16" in:fly={{ y: 50, duration: 800, delay: 600 }}>
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-4">
              <Mic class="w-5 h-5 text-primary" />
              <span class="text-sm font-medium text-primary">Voice Integration</span>
            </div>
            <h3 class="text-2xl font-bold mb-4">Real-time Voice Chat</h3>
            <p class="text-muted-foreground mb-6">
              Speak naturally with your AI companion. Powered by ElevenLabs for seamless speech-to-text and text-to-speech conversion.
            </p>
            <button 
              class="glass-button px-6 py-3 rounded-lg text-white font-medium"
              on:click={() => goto('/chat')}
            >
              Try Voice Chat
            </button>
          </div>
          <div class="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center">
            <Brain class="w-16 h-16 text-white" />
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center" in:fly={{ y: 50, duration: 800, delay: 800 }}>
        <h2 class="text-3xl font-bold mb-4">Ready to discover your cultural intelligence?</h2>
        <p class="text-muted-foreground mb-8">
          Connect your Spotify account and start exploring your taste profile today.
        </p>
        <button 
          class="glass-button px-8 py-4 rounded-lg text-white font-medium hover-lift"
          on:click={() => goto('/chat')}
        >
          Get Started
        </button>
      </div>
    </div>
  </div>
{/if}
