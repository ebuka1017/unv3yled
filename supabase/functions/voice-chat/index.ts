import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    console.log('WebSocket connection established for voice chat');
    
    // Connect to ElevenLabs WebSocket for real-time TTS
    const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    const elevenlabsVoiceId = Deno.env.get('ELEVENLABS_VOICE_ID') || '9BWtsMINqrJLrRacOk9x'; // Default to Aria
    
    if (!elevenlabsApiKey) {
      throw new Error('ElevenLabs API key not configured');
    }
    
    const elevenlabsSocket = new WebSocket(`wss://api.elevenlabs.io/v1/text-to-speech/${elevenlabsVoiceId}/stream-input?model_id=eleven_multilingual_v2`);
    
    socket.onopen = () => {
      console.log('Client WebSocket opened');
      socket.send(JSON.stringify({ type: 'connection', status: 'connected' }));
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received message type:', data.type);
        
        if (data.type === 'audio_input') {
          // Handle voice input from client
          const audioData = data.audio; // Base64 encoded audio
          
          // Convert audio to text using ElevenLabs Speech-to-Text
          const transcription = await convertSpeechToText(audioData);
          
          socket.send(JSON.stringify({
            type: 'transcription',
            text: transcription
          }));
          
          // Process with AI and get response
          const aiResponse = await processWithAI(transcription);
          
          // Convert AI response to speech
          if (elevenlabsSocket.readyState === WebSocket.OPEN) {
            elevenlabsSocket.send(JSON.stringify({
              text: aiResponse,
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: 0.0,
                use_speaker_boost: true
              }
            }));
          }
          
          // Send AI response to client
          socket.send(JSON.stringify({
            type: 'ai_response',
            text: aiResponse,
            audio_url: null // Will be streamed via ElevenLabs WebSocket
          }));
        }
        
        if (data.type === 'text_input') {
          // Handle text input for TTS
          if (elevenlabsSocket.readyState === WebSocket.OPEN) {
            elevenlabsSocket.send(JSON.stringify({
              text: data.text,
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: 0.0,
                use_speaker_boost: true
              }
            }));
          }
        }
      } catch (error) {
        console.error('Error processing message:', error);
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process voice input'
        }));
      }
    };

    elevenlabsSocket.onmessage = (event) => {
      // Forward ElevenLabs audio data to client
      socket.send(event.data);
    };

    elevenlabsSocket.onerror = (error) => {
      console.error('ElevenLabs WebSocket error:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Voice service temporarily unavailable'
      }));
    };

    socket.onclose = () => {
      console.log('Client WebSocket closed');
      if (elevenlabsSocket.readyState === WebSocket.OPEN) {
        elevenlabsSocket.close();
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return response;
  } catch (error) {
    console.error('WebSocket setup error:', error);
    return new Response('Failed to establish WebSocket connection', { 
      status: 500,
      headers: corsHeaders 
    });
  }
});

async function convertSpeechToText(audioBase64: string): Promise<string> {
  try {
    const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!elevenlabsApiKey) {
      throw new Error('ElevenLabs API key not configured');
    }
    
    // Convert base64 to buffer
    const audioBuffer = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
    
    // Use ElevenLabs Speech-to-Text API
    const formData = new FormData();
    formData.append('audio', new Blob([audioBuffer], { type: 'audio/wav' }), 'audio.wav');
    formData.append('model_id', 'eleven_multilingual_v2'); // Use ElevenLabs model
    
    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': elevenlabsApiKey,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs Speech-to-Text API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    return result.text || '';
  } catch (error) {
    console.error('Speech-to-text error:', error);
    throw error;
  }
}

async function processWithAI(userInput: string): Promise<string> {
  try {
    // This would typically call your Qloo + Gemini pipeline
    // For now, return a placeholder response
    return `I heard you say: "${userInput}". I'm processing your request for cultural recommendations. This voice integration is being enhanced to provide real-time cultural intelligence insights.`;
  } catch (error) {
    console.error('AI processing error:', error);
    return 'I apologize, but I encountered an error processing your request. Please try again.';
  }
}