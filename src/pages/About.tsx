import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Sparkles, Users, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-strong border-b border-primary/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">Cortex</span>
            </Link>
            
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About
              <span className="text-transparent bg-gradient-to-r from-primary to-primary-glow bg-clip-text">
                {" "}Cortex
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We believe that culture connects us all. Cortex helps you discover 
              the perfect music, movies, books, and experiences tailored to your unique taste.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="glass-card">
              <CardHeader>
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To democratize cultural discovery by using AI to understand your unique taste 
                  profile and connect you with content and people that truly resonate with you.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Community First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We're building a community of cultural explorers who share recommendations, 
                  discover taste twins, and expand their horizons together.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Ready to discover your cultural universe?
            </h2>
            <Link to="/auth">
              <Button size="lg" className="pill-button text-lg px-8 py-6">
                <Heart className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}