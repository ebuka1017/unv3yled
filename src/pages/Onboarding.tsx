import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, MapPin, Calendar } from "lucide-react";

export default function Onboarding() {
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          age: parseInt(age),
          location,
          onboarded_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Welcome to Cortex! Let's discover your taste profile."
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-glass-primary via-glass-secondary to-glass-tertiary">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-12 h-12 text-neural-purple" />
          </div>
          <h1 className="text-3xl font-bold text-neural bg-gradient-neural bg-clip-text text-transparent mb-2">
            Complete Your Profile
          </h1>
          <p className="text-text-secondary">
            Help Cortex understand your cultural context for better recommendations
          </p>
        </motion.div>

        <Card className="glass-strong border-white/20 shadow-glass">
          <CardHeader>
            <CardTitle className="text-text-primary">Personal Details</CardTitle>
            <CardDescription className="text-text-secondary">
              This information helps improve recommendation accuracy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-text-primary flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="bg-white/5 border-white/20 text-text-primary"
                  placeholder="25"
                  min="13"
                  max="120"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-text-primary flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-white/5 border-white/20 text-text-primary"
                  placeholder="e.g., San Francisco, CA"
                  required
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={loading || !age || !location}
                  className="w-full bg-gradient-neural hover:opacity-90 text-white font-medium py-3 rounded-xl shadow-neural"
                >
                  {loading ? "Saving..." : "Start Discovering"}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>

        {/* Benefits */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 glass rounded-xl p-4"
        >
          <h3 className="text-sm font-medium text-text-primary mb-2">What's Next?</h3>
          <ul className="text-xs text-text-muted space-y-1">
            <li>• Sync your Spotify data for music insights</li>
            <li>• Get AI-powered cultural recommendations</li>
            <li>• Find taste twins with similar preferences</li>
            <li>• Explore books, movies, travel, and fashion</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}