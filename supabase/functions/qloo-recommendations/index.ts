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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user's session
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid user session');
    }

    const { prompt, context } = await req.json();

    console.log(`Generating Qloo recommendations for user: ${user.id}`);

    // Get user's profile and Spotify data
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('age, location, taste_profile')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
    }

    // Get user's Spotify data
    const { data: spotifyData, error: spotifyError } = await supabaseClient
      .from('spotify_data')
      .select('data_type, metadata')
      .eq('user_id', user.id);

    if (spotifyError) {
      console.error('Spotify data error:', spotifyError);
    }

    // Prepare data for Qloo API
    const qlooPayload = {
      user_context: {
        age: profile?.age,
        location: profile?.location,
        prompt: prompt,
        context: context
      },
      spotify_data: spotifyData?.reduce((acc, item) => {
        acc[item.data_type] = item.metadata;
        return acc;
      }, {} as any) || {},
      timestamp: new Date().toISOString()
    };

    console.log('Calling Qloo API...');

    // Call Qloo API
    const qlooResponse = await fetch(Deno.env.get('QLOO_BASE_URL') + '/recommendations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('QLOO_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(qlooPayload),
    });

    let qlooData;
    if (qlooResponse.ok) {
      qlooData = await qlooResponse.json();
      console.log('Qloo API call successful');
    } else {
      console.log('Qloo API unavailable, using mock data');
      // Mock Qloo response for development
      qlooData = {
        recommendations: {
          music: [
            { id: '1', title: 'Indie Rock Playlist', type: 'playlist', confidence: 0.85 },
            { id: '2', title: 'Lo-Fi Hip Hop', type: 'playlist', confidence: 0.78 }
          ],
          books: [
            { id: '3', title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', confidence: 0.82 },
            { id: '4', title: 'Klara and the Sun', author: 'Kazuo Ishiguro', confidence: 0.79 }
          ],
          movies: [
            { id: '5', title: 'Everything Everywhere All at Once', year: 2022, confidence: 0.88 },
            { id: '6', title: 'The Grand Budapest Hotel', year: 2014, confidence: 0.76 }
          ],
          travel: [
            { id: '7', title: 'Tokyo, Japan', type: 'city', confidence: 0.83 },
            { id: '8', title: 'Iceland Road Trip', type: 'experience', confidence: 0.81 }
          ]
        },
        confidence_score: 0.82
      };
    }

    // Store the recommendation in the database
    const { error: insertError } = await supabaseClient
      .from('qloo_recommendations')
      .insert({
        user_id: user.id,
        user_prompt: prompt,
        category: 'general',
        qloo_response: qlooData,
        confidence_score: qlooData.confidence_score || 0.8,
        metadata: {
          context: context,
          timestamp: new Date().toISOString()
        }
      });

    if (insertError) {
      console.error('Error storing recommendation:', insertError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        recommendations: qlooData.recommendations,
        confidence_score: qlooData.confidence_score
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Qloo recommendations error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate recommendations' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});