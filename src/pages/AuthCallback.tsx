import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/auth');
          return;
        }

        if (data.session) {
          // Check if user has completed onboarding
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarded_at, age, location')
            .eq('user_id', data.session.user.id)
            .single();

          if (!profile?.onboarded_at) {
            navigate('/onboarding');
          } else {
            navigate('/');
          }
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-glass-primary to-glass-secondary">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-neural-purple mx-auto mb-4" />
        <p className="text-text-primary">Completing authentication...</p>
      </div>
    </div>
  );
}