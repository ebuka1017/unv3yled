import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { AuthPage } from "./components/auth/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import Onboarding from "./pages/Onboarding";
import TasteProfile from "./pages/TasteProfile";
import Recommendations from "./pages/Recommendations";
import SpotifySync from "./pages/SpotifySync";
import TasteTwins from "./pages/TasteTwins";
import Saved from "./pages/Saved";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import DataUsage from "./pages/DataUsage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<TasteProfile />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/spotify" element={<SpotifySync />} />
          <Route path="/friends" element={<TasteTwins />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/data-usage" element={<DataUsage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
