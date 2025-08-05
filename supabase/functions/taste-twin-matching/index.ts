import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get the user's session
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Invalid user session');
    }

    console.log(`Finding taste twins for user: ${user.id}`);

    // Get user's taste profile
    const { data: userProfile, error: profileError } = await supabaseClient
      .from('taste_match_profiles')
      .select('qloo_vector, cultural_summary')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile) {
      throw new Error('User taste profile not found. Please complete your profile first.');
    }

    // Get all other users' taste profiles (excluding current user)
    const { data: allProfiles, error: profilesError } = await supabaseClient
      .from('taste_match_profiles')
      .select('user_id, qloo_vector, cultural_summary')
      .neq('user_id', user.id);

    if (profilesError) {
      throw new Error('Failed to fetch other users\' profiles');
    }

    // Calculate similarity scores
    const similarityScores = allProfiles.map(otherProfile => {
      const similarity = calculateTasteSimilarity(userProfile.qloo_vector, otherProfile.qloo_vector);
      return {
        user_id: otherProfile.user_id,
        similarity_score: similarity,
        cultural_summary: otherProfile.cultural_summary
      };
    });

    // Sort by similarity score (highest first)
    similarityScores.sort((a, b) => b.similarity_score - a.similarity_score);

    // Get top matches (similarity > 0.7)
    const topMatches = similarityScores.filter(match => match.similarity_score > 0.7).slice(0, 5);

    // Get user details for top matches
    const matchUserIds = topMatches.map(match => match.user_id);
    const { data: matchUsers, error: usersError } = await supabaseClient
      .from('profiles')
      .select('user_id, email, age, location')
      .in('user_id', matchUserIds);

    if (usersError) {
      console.error('Error fetching match user details:', usersError);
    }

    // Combine match data with user details
    const enrichedMatches = topMatches.map(match => {
      const userDetails = matchUsers?.find(u => u.user_id === match.user_id);
      return {
        ...match,
        user_details: userDetails ? {
          email: userDetails.email,
          age: userDetails.age,
          location: userDetails.location
        } : null
      };
    });

    // Store matches in database
    for (const match of enrichedMatches) {
      const { error: insertError } = await supabaseClient
        .from('matches')
        .upsert({
          user_a: user.id,
          user_b: match.user_id,
          similarity_score: match.similarity_score,
          status: 'pending'
        }, {
          onConflict: 'user_a,user_b',
          ignoreDuplicates: false
        });

      if (insertError) {
        console.error('Error storing match:', insertError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        matches: enrichedMatches,
        total_profiles_compared: allProfiles.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Taste twin matching error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to find taste twins' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function calculateTasteSimilarity(vectorA: any, vectorB: any): number {
  try {
    // Simple cosine similarity calculation
    // In a real implementation, this would use more sophisticated algorithms
    const keysA = Object.keys(vectorA);
    const keysB = Object.keys(vectorB);
    
    if (keysA.length === 0 || keysB.length === 0) {
      return 0;
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    // Calculate dot product and magnitudes
    for (const key of keysA) {
      const valA = vectorA[key] || 0;
      const valB = vectorB[key] || 0;
      
      dotProduct += valA * valB;
      magnitudeA += valA * valA;
    }

    for (const key of keysB) {
      const valB = vectorB[key] || 0;
      magnitudeB += valB * valB;
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  } catch (error) {
    console.error('Error calculating similarity:', error);
    return 0;
  }
}