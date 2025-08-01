import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Music, Brain } from "lucide-react";
import heroImage from "@/assets/cortex-hero.jpg";
export function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    signInWithSpotify,
    signInWithEmail,
    signUpWithEmail
  } = useAuth();
  const {
    toast
  } = useToast();
  const handleSpotifyAuth = async () => {
    try {
      setLoading(true);
      await signInWithSpotify();
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleEmailAuth = async (isSignUp: boolean) => {
    try {
      setLoading(true);
      if (isSignUp) {
        await signUpWithEmail(email, password);
        toast({
          title: "Account Created",
          description: "Check your email for verification link"
        });
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0" style={{
      backgroundImage: `url(${heroImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        <div className="absolute inset-0 bg-gradient-to-br from-glass-primary/90 via-glass-secondary/80 to-glass-tertiary/90" />
      </div>
      
      <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      duration: 0.5
    }} className="w-full max-w-md relative z-10">
        {/* Hero Section */}
        <motion.div initial={{
        y: -20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.2,
        duration: 0.5
      }} className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Brain className="w-12 h-12 text-neural-purple" />
              <Sparkles className="w-6 h-6 text-neural-cyan absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="font-bold text-neural bg-gradient-neural bg-clip-text text-transparent mb-2 text-5xl">unv3yled</h1>
          <p className="text-text-secondary text-lg">Discover things &amp; people you didn't know you loved with an Ai-powered taste companion</p>
        </motion.div>

        <Card className="glass-strong border-white/20 shadow-glass">
          <CardHeader className="text-center">
            <CardTitle className="text-text-primary">Get Started</CardTitle>
            <CardDescription className="text-text-secondary">
              Connect your Spotify to unlock personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Spotify Auth Button */}
              <motion.div whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                <Button onClick={handleSpotifyAuth} disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 rounded-xl shadow-elevation">
                  <Music className="w-5 h-5 mr-2" />
                  Continue with Spotify
                </Button>
              </motion.div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-glass-secondary text-text-muted">Or continue with email</span>
                </div>
              </div>

              {/* Email Auth Tabs */}
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5">
                  <TabsTrigger value="signin" className="text-text-secondary data-[state=active]:text-text-primary">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-text-secondary data-[state=active]:text-text-primary">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-text-primary">Email</Label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/5 border-white/20 text-text-primary" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-text-primary">Password</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-white/5 border-white/20 text-text-primary" />
                  </div>
                  <Button onClick={() => handleEmailAuth(false)} disabled={loading || !email || !password} className="w-full bg-gradient-neural hover:opacity-90 text-white font-medium py-2.5 rounded-xl">
                    Sign In
                  </Button>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="text-text-primary">Email</Label>
                    <Input id="email-signup" type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/5 border-white/20 text-text-primary" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup" className="text-text-primary">Password</Label>
                    <Input id="password-signup" type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-white/5 border-white/20 text-text-primary" placeholder="Minimum 6 characters" />
                  </div>
                  <Button onClick={() => handleEmailAuth(true)} disabled={loading || !email || !password} className="w-full bg-gradient-neural hover:opacity-90 text-white font-medium py-2.5 rounded-xl">
                    Create Account
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <motion.div initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.6,
        duration: 0.5
      }} className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="glass rounded-xl p-4">
            <Music className="w-6 h-6 text-neural-purple mx-auto mb-2" />
            <p className="text-xs text-text-muted">Music Discovery</p>
          </div>
          <div className="glass rounded-xl p-4">
            <Sparkles className="w-6 h-6 text-neural-cyan mx-auto mb-2" />
            <p className="text-xs text-text-muted">AI Recommendations</p>
          </div>
          <div className="glass rounded-xl p-4">
            <Brain className="w-6 h-6 text-neural-blue mx-auto mb-2" />
            <p className="text-xs text-text-muted">Taste Matching</p>
          </div>
        </motion.div>
      </motion.div>
    </div>;
}