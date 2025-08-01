-- Enhanced profiles table for Cortex
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS onboarded_at TIMESTAMP WITH TIME ZONE;

-- Taste matching profiles for cultural similarity
CREATE TABLE IF NOT EXISTS taste_match_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  qloo_vector JSONB DEFAULT '{}',
  cultural_summary TEXT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE taste_match_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for taste_match_profiles
CREATE POLICY "Users can view all taste profiles for matching" 
ON taste_match_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own taste profile" 
ON taste_match_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own taste profile" 
ON taste_match_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Matches table for taste similarity results
CREATE TABLE IF NOT EXISTS matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_a UUID NOT NULL,
  user_b UUID NOT NULL,
  similarity_score FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  FOREIGN KEY (user_a) REFERENCES profiles(user_id) ON DELETE CASCADE,
  FOREIGN KEY (user_b) REFERENCES profiles(user_id) ON DELETE CASCADE,
  UNIQUE(user_a, user_b)
);

-- Enable RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- RLS policies for matches
CREATE POLICY "Users can view their own matches" 
ON matches 
FOR SELECT 
USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Users can create matches" 
ON matches 
FOR INSERT 
WITH CHECK (auth.uid() = user_a);

CREATE POLICY "Users can update their match status" 
ON matches 
FOR UPDATE 
USING (auth.uid() = user_a OR auth.uid() = user_b);

-- Chat messages for matched users
CREATE TABLE IF NOT EXISTS match_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES profiles(user_id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE match_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for match_messages
CREATE POLICY "Users can view messages from their matches" 
ON match_messages 
FOR SELECT 
USING (
  sender_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM matches 
    WHERE matches.id = match_id 
    AND (user_a = auth.uid() OR user_b = auth.uid())
  )
);

CREATE POLICY "Users can send messages to their matches" 
ON match_messages 
FOR INSERT 
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM matches 
    WHERE matches.id = match_id 
    AND (user_a = auth.uid() OR user_b = auth.uid())
    AND status = 'accepted'
  )
);

-- Triggers for updating timestamps
CREATE TRIGGER update_taste_match_profiles_updated_at
BEFORE UPDATE ON taste_match_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_taste_match_profiles_user_id ON taste_match_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_users ON matches(user_a, user_b);
CREATE INDEX IF NOT EXISTS idx_match_messages_match_id ON match_messages(match_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_qloo_recommendations_user_id ON qloo_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_spotify_data_user_id ON spotify_data(user_id);