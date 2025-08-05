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

    const { recommendations, userPrompt, userProfile } = await req.json();

    console.log(`Generating Gemini insights for user: ${user.id}`);

    // Create context for Gemini
    const contextPrompt = `
You are Unv3iled, an AI cultural intelligence companion that provides sophisticated insights about personal taste and cultural preferences. 
Analyze the following recommendation data and user context to provide a natural, conversational response that explains the cultural connections.

User Profile:
- Age: ${userProfile?.age || 'Not specified'}
- Location: ${userProfile?.location || 'Not specified'}

User Question: ${userPrompt}

Recommendations Data: ${JSON.stringify(recommendations, null, 2)}

Please provide:
1. A natural, conversational response to the user's question
2. Explain why these recommendations match their cultural taste profile using specific examples
3. Highlight interesting cross-domain connections between their preferences (e.g., how music taste relates to book preferences)
4. Suggest 2-3 specific next steps or follow-up explorations
5. Use cultural context and explain the deeper meaning behind the recommendations

Keep the response engaging, insightful, and culturally aware. Write as if you're a knowledgeable friend who understands both their personal taste and broader cultural context. Be specific about the cultural significance and connections.
`;

    console.log('Calling Gemini API...');

    // Call Gemini API with proper error handling
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: contextPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      }),
    });

    let insightText;
    if (geminiResponse.ok) {
      const geminiData = await geminiResponse.json();
      insightText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate insights at this time.';
      console.log('Gemini API call successful');
    } else {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
    }

    // Update the recommendation with Gemini insights
    const { error: updateError } = await supabaseClient
      .from('qloo_recommendations')
      .update({
        gemini_insights: insightText
      })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (updateError) {
      console.error('Error updating recommendation with insights:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        insights: insightText
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Gemini insights error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate insights' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});