<script lang="ts">
  import { Router, Link, Route } from 'svelte-routing';
  import { onMount } from 'svelte';
  
  // Import pages
  import Dashboard from './pages/Dashboard.svelte';
  import Landing from './pages/Landing.svelte';
  import NotFound from './pages/NotFound.svelte';
  import AuthPage from './components/auth/AuthPage.svelte';
  import AuthCallback from './pages/AuthCallback.svelte';
  import Onboarding from './pages/Onboarding.svelte';
  import TasteProfile from './pages/TasteProfile.svelte';
  import Recommendations from './pages/Recommendations.svelte';
  import SpotifySync from './pages/SpotifySync.svelte';
  import TasteTwins from './pages/TasteTwins.svelte';
  import Saved from './pages/Saved.svelte';
  import Settings from './pages/Settings.svelte';
  import About from './pages/About.svelte';
  import Terms from './pages/Terms.svelte';
  import Privacy from './pages/Privacy.svelte';
  import DataUsage from './pages/DataUsage.svelte';
  import MediaSearch from './pages/MediaSearch.svelte';

  // Import components
  import Toaster from './components/ui/toaster/Toaster.svelte';
  import Sonner from './components/ui/sonner/Sonner.svelte';
  import TooltipProvider from './components/ui/tooltip/TooltipProvider.svelte';
  import ErrorBoundary from './components/ErrorBoundary.svelte';
  import ThemeProvider from './components/ui/theme/ThemeProvider.svelte';

  let isLoaded = false;

  onMount(() => {
    // Mark as loaded after a short delay to ensure styles are applied
    const timer = setTimeout(() => isLoaded = true, 100);
    return () => clearTimeout(timer);
  });
</script>

<ErrorBoundary>
  <div class="min-h-screen {isLoaded ? 'loaded' : 'loading'}">
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Route path="/" component={Landing} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/profile" component={TasteProfile} />
          <Route path="/recommendations" component={Recommendations} />
          <Route path="/spotify" component={SpotifySync} />
          <Route path="/friends" component={TasteTwins} />
          <Route path="/saved" component={Saved} />
          <Route path="/settings" component={Settings} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/auth/callback" component={AuthCallback} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/about" component={About} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/data-usage" component={DataUsage} />
          <Route path="/media" component={MediaSearch} />
          <Route path="*" component={NotFound} />
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  </div>
</ErrorBoundary>

<style>
  .loading {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  
  .loaded {
    opacity: 1;
  }
</style>