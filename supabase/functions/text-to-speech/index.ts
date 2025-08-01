import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice = 'aria' } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenlabsApiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    // Use ElevenLabs text-to-speech
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${getVoiceId(voice)}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenlabsApiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ElevenLabs API error: ${error}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('TTS Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

function getVoiceId(voiceName: string): string {
  const voices: Record<string, string> = {
    'aria': '9BWtsMINqrJLrRacOk9x',
    'roger': 'CwhRBWXzGAHq8TQ4Fs17',
    'sarah': 'EXAVITQu4vr4xnSDxMaL',
    'laura': 'FGY2WhTYpPnrIDTdsKH5',
    'charlie': 'IKne3meq5aSn9XLyUdCD',
    'george': 'JBFqnCBsd6RMkjVDRZzb',
    'callum': 'N2lVS1w4EtoT3dr4eOWO',
    'river': 'SAz9YHcvj6GT2YYXdXww',
    'liam': 'TX3LPaxmHKxFdv7VOQHJ',
    'charlotte': 'XB0fDUnXU5powFXDhCwa',
    'alice': 'Xb7hH8MSUJpSbSDYk0k2',
    'matilda': 'XrExE9yKIg1WjnnlVkGX',
    'will': 'bIHbv24MWmeRgasZH58o',
    'jessica': 'cgSgspJ2msm6clMCkdW9',
    'eric': 'cjVigY5qzO86Huf0OWal',
    'chris': 'iP95p4xoKVk53GoZ742B',
    'brian': 'nPczCjzI2devNBz1zQrb',
    'daniel': 'onwK4e9ZLuTAKqWW03F9',
    'lily': 'pFZP5JQG7iQjIQuC4Bku',
    'bill': 'pqHfZKP75CvOlQylNhV4',
  };
  
  return voices[voiceName.toLowerCase()] || voices['aria'];
}