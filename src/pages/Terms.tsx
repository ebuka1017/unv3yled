import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Terms() {
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
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>

          <Card className="glass-card">
            <CardContent className="p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using Cortex, you accept and agree to be bound by the terms 
                  and provision of this agreement.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License</h2>
                <p className="text-muted-foreground">
                  Permission is granted to temporarily use Cortex for personal, non-commercial 
                  transitory viewing only. This is the grant of a license, not a transfer of title.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Privacy</h2>
                <p className="text-muted-foreground">
                  Your privacy is important to us. We only collect data necessary to provide 
                  personalized recommendations and improve our service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. User Content</h2>
                <p className="text-muted-foreground">
                  You retain ownership of any content you submit to Cortex. However, you grant 
                  us a license to use this content to provide and improve our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Contact</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms of Service, please contact us 
                  at legal@cortex.ai
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}