<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from '$lib/supabase'
  import { goto } from '$app/navigation'
  import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff,
    Loader2,
    Sparkles,
    ArrowLeft
  } from 'lucide-svelte'
  import { fly, fade } from 'svelte/transition'

  let email = ''
  let password = ''
  let loading = false
  let showPassword = false
  let isSignUp = false
  let error = ''

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      goto('/')
    }
  })

  const handleAuth = async () => {
    loading = true
    error = ''

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password
        })
        if (signUpError) throw signUpError
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (signInError) throw signInError
      }
    } catch (err: any) {
      error = err.message
    } finally {
      loading = false
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    loading = true
    error = ''

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (oauthError) throw oauthError
    } catch (err: any) {
      error = err.message
      loading = false
    }
  }
</script>

<svelte:head>
  <title>Sign In - Unv3iled</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-6">
  <div class="w-full max-w-md">
    <!-- Back to home -->
    <button 
      class="flex items-center gap-2 text-muted-foreground mb-8 hover:text-primary transition-colors"
      on:click={() => goto('/')}
    >
      <ArrowLeft class="w-4 h-4" />
      Back to Home
    </button>

    <!-- Auth Card -->
    <div class="glass-strong rounded-2xl p-8" in:fly={{ y: 50, duration: 800 }}>
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass-button border border-glass-border mb-4">
          <Sparkles class="w-4 h-4 text-primary" />
          <span class="text-sm font-medium text-primary">Welcome Back</span>
        </div>
        
        <h1 class="text-3xl font-bold mb-2">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h1>
        
        <p class="text-muted-foreground">
          {isSignUp ? 'Join Unv3iled to discover your cultural intelligence' : 'Welcome to your cultural intelligence companion'}
        </p>
      </div>

      <!-- Error Message -->
      {#if error}
        <div class="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600" transition:fade>
          {error}
        </div>
      {/if}

      <!-- Auth Form -->
      <form on:submit|preventDefault={handleAuth} class="space-y-6">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium mb-2">Email</label>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="email"
              type="email"
              bind:value={email}
              required
              class="w-full pl-10 pr-4 py-3 glass-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium mb-2">Password</label>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              bind:value={password}
              required
              class="w-full pl-10 pr-12 py-3 glass-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your password"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
              on:click={() => showPassword = !showPassword}
            >
              {#if showPassword}
                <EyeOff class="w-5 h-5" />
              {:else}
                <Eye class="w-5 h-5" />
              {/if}
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={loading}
          class="w-full glass-button py-3 rounded-lg text-white font-medium hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {#if loading}
            <Loader2 class="w-5 h-5 animate-spin" />
          {/if}
          {isSignUp ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <!-- Divider -->
      <div class="my-6 flex items-center">
        <div class="flex-1 border-t border-glass-border"></div>
        <span class="px-4 text-sm text-muted-foreground">or</span>
        <div class="flex-1 border-t border-glass-border"></div>
      </div>

      <!-- OAuth Buttons -->
      <div class="space-y-3">
        <button
          disabled={loading}
          class="w-full glass-card py-3 rounded-lg font-medium hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          on:click={() => handleOAuth('google')}
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <button
          disabled={loading}
          class="w-full glass-card py-3 rounded-lg font-medium hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          on:click={() => handleOAuth('github')}
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Continue with GitHub
        </button>
      </div>

      <!-- Toggle Sign Up/Sign In -->
      <div class="mt-8 text-center">
        <p class="text-muted-foreground">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            class="text-primary font-medium hover:underline ml-1"
            on:click={() => isSignUp = !isSignUp}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  </div>
</div>