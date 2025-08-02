import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Music, Book, Film, MapPin } from "lucide-react";

interface WelcomeMessageProps {
  onSuggestedPrompt: (prompt: string) => void;
}

const suggestedPrompts = [
  {
    icon: Music,
    text: "Recommend music based on my Spotify history",
    prompt: "I'd like some music recommendations based on my recent listening history and favorite artists"
  },
  {
    icon: Book,
    text: "Find books I might love",
    prompt: "Can you recommend some books that match my reading preferences and interests?"
  },
  {
    icon: Film,
    text: "Discover movies for tonight",
    prompt: "I'm looking for movie recommendations for tonight. Something that matches my taste"
  },
  {
    icon: MapPin,
    text: "Plan my next travel destination",
    prompt: "Help me discover travel destinations that align with my cultural interests and preferences"
  }
];

export function WelcomeMessage({ onSuggestedPrompt }: WelcomeMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/20 shimmer">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-gradient-bubblegum bg-clip-text mb-2">
            Welcome to Cortex
          </h2>
          <p className="text-muted-foreground">
            Your AI cultural discovery companion. Ask me for personalized recommendations!
          </p>
        </div>
      </div>

      <Card className="glass-card">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 text-center">Try asking me about:</h3>
          <div className="grid grid-cols-1 gap-3">
            {suggestedPrompts.map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-auto p-4 rounded-2xl glass hover:glass-strong transition-all"
                    onClick={() => onSuggestedPrompt(prompt.prompt)}
                  >
                    <div className="w-8 h-8 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-left">{prompt.text}</span>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}