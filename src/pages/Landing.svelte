<script lang="ts">
  import { Link } from 'svelte-routing';
  import { onMount } from 'svelte';
  import Button from '@/components/ui/button/Button.svelte';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import ThemeToggle from '@/components/ui/theme-toggle/ThemeToggle.svelte';
  import { Sparkles, Music, Users, Heart, ArrowRight, Brain, Zap } from 'lucide-svelte';
  
  let user: any = null;
  let loading = true;
  
  onMount(async () => {
    // TODO: Implement auth logic
    loading = false;
  });
  
  function navigate(path: string) {
    window.location.href = path;
  }
</script>

<div class="min-h-screen">
  <!-- Header -->
  <header class="glass-strong border-b border-primary/20 sticky top-0 z-50">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Brain class="w-8 h-8 text-primary" />
          <span class="text-2xl font-bold text-foreground">unv3iled</span>
        </div>
        
        <nav class="hidden md:flex items-center gap-6">
          <Link to="/about" class="text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <ThemeToggle />
          <Button on:click={() => navigate(user ? '/dashboard' : '/auth')} className="pill-button">
            {user ? 'Dashboard' : 'Get Started'}
          </Button>
        </nav>
      </div>
    </div>
  </header>

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
        <Button on:click={() => navigate(user ? '/dashboard' : '/auth')} size="lg" className="pill-button text-lg px-8 py-6">
          <Sparkles class="w-5 h-5 mr-2" />
          {user ? 'Go to Dashboard' : 'Get Started'}
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
  .glass-strong {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .pill-button {
    border-radius: 9999px;
  }
</style>