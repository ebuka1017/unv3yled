<script lang="ts">
  import { Link } from 'svelte-routing';
  import { onMount } from 'svelte';
  import Button from '@/components/ui/button/Button.svelte';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import { Sparkles, Music, Users, Heart, ArrowRight, Brain, Zap } from 'lucide-svelte';
  import { authStore } from '@/lib/stores/auth';
  import { getCurrentUser } from '@/lib/supabase';
  
  let authState: any;
  let loading = true;
  
  authStore.subscribe(state => {
    authState = state;
    loading = state.loading;
  });
  
  onMount(async () => {
    // Check if user is already authenticated
    const { user, error } = await getCurrentUser();
    if (user) {
      authStore.setUser(user);
    } else {
      authStore.setLoading(false);
    }
  });
  
  function navigate(path: string) {
    window.location.href = path;
  }
</script>

<div class="min-h-screen">
  <!-- Hero Section -->
  <section class="py-20 px-6">
    <div class="container mx-auto max-w-4xl text-center">
      <div class="mb-8">
        <h1 class="text-5xl md:text-6xl font-bold text-foreground mb-6">
          Your AI Taste
          <span class="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-red-300">
            {" "}Companion
          </span>
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover personalized music, movies, books etc, tailored to your unique taste profile and Connect with like-minded people who share your taste.
        </p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
        <Button on:click={() => navigate(authState?.user ? '/dashboard' : '/auth')} size="lg" className="pill-button text-lg px-8 py-6">
          <Sparkles class="w-5 h-5 mr-2" />
          {authState?.user ? 'Go to Dashboard' : 'Get Started'}
          <ArrowRight class="w-5 h-5 ml-2" />
        </Button>
      </div>

      <div class="grid md:grid-cols-3 gap-6 mt-16">
        <Card className="glass-card">
          <CardHeader>
            <Sparkles class="w-10 h-10 text-primary mb-2" />
            <CardTitle>AI-Powered Discovery</CardTitle>
            <CardDescription>
              Advanced algorithms analyze your cultural preferences to suggest perfect matches across all media
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <Users class="w-10 h-10 text-primary mb-2" />
            <CardTitle>Taste Twins</CardTitle>
            <CardDescription>
              Find people with similar cultural DNA and discover new favorites through their recommendations
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <Zap class="w-10 h-10 text-primary mb-2" />
            <CardTitle>Serendipitous Moments</CardTitle>
            <CardDescription>
              Experience unexpected cultural discoveries that expand your horizons in delightful ways
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  </section>
</div>

<style>
  .glass-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .pill-button {
    border-radius: 9999px;
  }
</style>