import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, Shield, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function DataUsage() {
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
              How We Use Your Data
            </h1>
            <p className="text-xl text-muted-foreground">
              Transparency about how your information powers your cultural discovery experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="glass-card">
              <CardHeader>
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Personalization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your Spotify data helps us understand your taste profile to provide 
                  personalized recommendations across music, movies, books, and more.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Taste Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We analyze patterns in your preferences to find taste twins - people 
                  with similar cultural DNA who can introduce you to new discoveries.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <Shield className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your data is anonymized for algorithmic improvements. We never sell 
                  your personal information or share it with third parties.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardContent className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">What We Access</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Spotify Listening History:</strong> Your top tracks, artists, and genres</li>
                  <li><strong>Playlists:</strong> Public playlists to understand your curation style</li>
                  <li><strong>Recently Played:</strong> Recent activity to track evolving tastes</li>
                  <li><strong>Saved Music:</strong> Your liked songs and followed artists</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">What We Don't Access</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Personal messages or private communications</li>
                  <li>Financial information or payment details</li>
                  <li>Location data beyond what you explicitly share</li>
                  <li>Data from other streaming services without permission</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Your Control</h2>
                <p className="text-muted-foreground">
                  You can disconnect your Spotify account, delete your data, or adjust privacy 
                  settings at any time in your account settings. We're committed to giving you 
                  full control over your information.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-6">
              Questions about how we use your data?
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:privacy@cortex.ai">Contact Our Privacy Team</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}