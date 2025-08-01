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
    
    // Connect to ElevenLabs WebSocket
    const elevenlabsSocket = new WebSocket(`wss://api.elevenlabs.io/v1/text-to-speech/${Deno.env.get('ELEVENLABS_AGENT_ID')}/stream-input?model_id=eleven_monolingual_v1`);
    
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
          // This would typically involve:
          // 1. Convert audio to text (Whisper/similar)
          // 2. Process with AI (Gemini/ChatGPT)
          // 3. Convert response to speech (ElevenLabs)
          
          // For now, send a mock response
          socket.send(JSON.stringify({
            type: 'transcription',
            text: 'I heard you speak! Voice processing will be implemented with ElevenLabs integration.'
          }));
          
          // Mock AI response
          setTimeout(() => {
            socket.send(JSON.stringify({
              type: 'ai_response',
              text: 'This is where the AI would respond with cultural insights based on your voice input.',
              audio_url: null // Will contain ElevenLabs audio URL when implemented
            }));
          }, 1000);
        }
        
        if (data.type === 'text_input') {
          // Handle text input for TTS
          if (elevenlabsSocket.readyState === WebSocket.OPEN) {
            elevenlabsSocket.send(JSON.stringify({
              text: data.text,
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5
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