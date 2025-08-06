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

    // Get the user's session using the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
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

    // Call Qloo API with proper error handling
    const qlooApiKey = Deno.env.get('QLOO_API_KEY');
    const qlooBaseUrl = Deno.env.get('QLOO_BASE_URL');

    if (!qlooApiKey || !qlooBaseUrl) {
      throw new Error('Qloo API configuration missing');
    }

    const qlooResponse = await fetch(`${qlooBaseUrl}/recommendations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${qlooApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(qlooPayload),
    });

    let qlooData;
    if (qlooResponse.ok) {
      qlooData = await qlooResponse.json();
      console.log('Qloo API call successful');
    } else {
      const errorText = await qlooResponse.text();
      console.error('Qloo API error:', qlooResponse.status, errorText);
      throw new Error(`Qloo API error: ${qlooResponse.status} - ${errorText}`);
    }

    // Transform Qloo response to our format
    const transformedRecommendations = Object.entries(qlooData.recommendations || {}).flatMap(([category, items]: [string, any[]]) => 
      items.map(item => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        category,
        title: item.title,
        metadata: {
          artist: item.artist || item.author || item.director,
          author: item.author,
          director: item.director,
          year: item.year,
          type: item.type,
          ...item
        },
        confidence: item.confidence || 0.8,
        reason: `Recommended based on your ${category} preferences`,
        external_urls: item.external_urls || {}
      }))
    );

    // Store each recommendation individually
    for (const rec of transformedRecommendations) {
      const { error: insertError } = await supabaseClient
        .from('qloo_recommendations')
        .insert({
          user_id: user.id,
          user_prompt: prompt,
          category: rec.category,
          qloo_response: rec,
          confidence_score: rec.confidence,
          metadata: {
            context: context,
            timestamp: new Date().toISOString()
          }
        });

      if (insertError) {
        console.error('Error storing recommendation:', insertError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        recommendations: transformedRecommendations
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