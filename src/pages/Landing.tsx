import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, Music, Users, Heart, ArrowRight, Brain, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";
export default function Landing() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  return <div className="min-h-screen">
      {/* Header */}
      <header className="glass-strong border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">unv3iled</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <ThemeToggle />
              <Button onClick={() => navigate(user ? '/dashboard' : '/auth')} className="pill-button">
                {user ? 'Dashboard' : 'Get Started'}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20 px-6"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Your AI Taste
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-red-300">
                {" "}Companion
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Discover personalized music, movies, books etc, tailored to your unique taste profile and Connect with like-minded people who share your taste.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button onClick={() => navigate(user ? '/dashboard' : '/auth')} size="lg" className="pill-button text-lg px-8 py-6">
              <Sparkles className="w-5 h-5 mr-2" />
              {user ? 'Go to Dashboard' : 'Get Started'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="glass-card">
              <CardHeader>
                <Sparkles className="w-10 h-10 text-primary mb-2" />
                <CardTitle>AI-Powered Discovery</CardTitle>
                <CardDescription>
                  Advanced algorithms analyze your cultural preferences to suggest perfect matches across all media
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Taste Twins</CardTitle>
                <CardDescription>
                  Find people with similar cultural DNA and discover new favorites through their recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <Zap className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Serendipitous Moments</CardTitle>
                <CardDescription>
                  Experience unexpected cultural discoveries that expand your horizons in delightful ways
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Cultural Discovery
            </h2>
            <p className="text-xl text-muted-foreground">
              From music to movies, books to travel - we help you explore it all
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{
            icon: Music,
            title: "Music",
            desc: "Discover artists and tracks based on your Spotify history"
          }, {
            icon: "🎬",
            title: "Movies & TV",
            desc: "Find your next binge-watch or cinema masterpiece"
          }, {
            icon: "📚",
            title: "Books",
            desc: "Uncover literary gems that match your reading taste"
          }, {
            icon: "✈️",
            title: "Travel",
            desc: "Explore destinations that align with your cultural interests"
          }].map((feature, index) => <Card key={index} className="glass-card text-center">
                <CardContent className="pt-6">
                  {typeof feature.icon === 'string' ? <div className="text-4xl mb-4">{feature.icon}</div> : <feature.icon className="w-10 h-10 text-primary mx-auto mb-4" />}
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Discover Your Cultural Universe?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who have already transformed their cultural discovery experience
          </p>
          <Button onClick={() => navigate(user ? '/dashboard' : '/auth')} size="lg" className="pill-button text-lg px-8 py-6">
            <Heart className="w-5 h-5 mr-2" />
            {user ? 'Go to Dashboard' : 'Start Your Journey'}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 glass-strong">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">unv3iled</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your AI-powered cultural discovery companion
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link to="/terms" className="text-muted-foreground hover:text-foreground block">
                  Terms of Service
                </Link>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground block">
                  Privacy Policy
                </Link>
                <Link to="/data-usage" className="text-muted-foreground hover:text-foreground block">
                  How We Use Your Data
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <div className="space-y-2 text-sm">
                <Link to="/about" className="text-muted-foreground hover:text-foreground block">
                  About
                </Link>
                <a href="#" className="text-muted-foreground hover:text-foreground block">
                  Features
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground block">
                  Support
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="text-muted-foreground hover:text-foreground block">
                  Twitter
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground block">
                  Discord
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground block">
                  Contact
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 unv3iled. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
}