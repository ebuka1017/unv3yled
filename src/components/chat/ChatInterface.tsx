import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Loader2,
  Sparkles,
  Zap,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'voice';
}

interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  volume: number;
}

export function ChatInterface() {
  console.log('ChatInterface component rendering');
  const { user } = useAuth();
  
  console.log('ChatInterface user:', user);
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "Hello! I'm your AI music assistant. What can I help you discover today?", role: "assistant", timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    volume: 0.8
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (content: string, isVoice = false) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      type: isVoice ? 'voice' : 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call Qloo recommendations endpoint
      const { data, error } = await supabase.functions.invoke('qloo-recommendations', {
        body: {
          prompt: content,
          context: 'chat_interface'
        }
      });

      if (error) throw error;

      // Get AI insights from Gemini
      const { data: insightsData, error: insightsError } = await supabase.functions.invoke('gemini-insights', {
        body: {
          recommendations: data,
          userPrompt: content,
          userProfile: null // Will be populated from user's profile
        }
      });

      if (insightsError) console.warn('Insights generation failed:', insightsError);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: insightsData?.insights || "I've processed your request and found some great recommendations! Check out the detailed results.",
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If voice input, use text-to-speech
      if (isVoice && assistantMessage.content) {
        await speakText(assistantMessage.content);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Chat Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = async (text: string) => {
    setVoiceState(prev => ({ ...prev, isSpeaking: true }));
    
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: text
        }
      });

      if (error) throw error;

      // Play the audio response
      if (data?.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audio.volume = voiceState.volume;
        audio.onended = () => setVoiceState(prev => ({ ...prev, isSpeaking: false }));
        await audio.play();
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setVoiceState(prev => ({ ...prev, isListening: true }));

    } catch (error) {
      console.error('Voice recording error:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && voiceState.isListening) {
      mediaRecorderRef.current.stop();
      setVoiceState(prev => ({ ...prev, isListening: false, isProcessing: true }));
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    try {
      // Convert audio to base64 for server processing
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      // Send to voice chat edge function for processing
      const { data, error } = await supabase.functions.invoke('voice-chat', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: {
          audio: base64Audio,
        },
      });

      if (error) throw error;

      // Use the transcribed text from the server
      const transcription = data?.transcription || "Could not transcribe audio";
      
      setVoiceState(prev => ({ ...prev, isProcessing: false }));
      await sendMessage(transcription, true);

    } catch (error) {
      console.error('Voice processing error:', error);
      setVoiceState(prev => ({ ...prev, isProcessing: false }));
      toast({
        title: "Voice Processing Error",
        description: "Could not process voice input. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const toggleVoice = () => {
    if (voiceState.isListening) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const toggleVolume = () => {
    setVoiceState(prev => ({ 
      ...prev, 
      volume: prev.volume > 0 ? 0 : 0.8 
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center shimmer">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-transparent bg-gradient-primary bg-clip-text">
              Cultural Discovery Chat
            </h1>
            <p className="text-sm text-muted-foreground">
              Ask for personalized recommendations across music, movies, books & more
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] rounded-3xl p-4 ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'glass-card'
              }`}>
                <div className="flex items-start gap-2">
                  {message.role === 'assistant' && (
                    <Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  )}
                  {message.type === 'voice' && message.role === 'user' && (
                    <Mic className="w-4 h-4 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="glass-card rounded-3xl p-4 max-w-[70%]">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <p className="text-sm">Generating recommendations...</p>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-primary/20">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask for music, movie, book, or travel recommendations..."
              className="glass-input pr-12 py-3 rounded-full"
              disabled={isLoading || voiceState.isListening}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Voice Controls */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={toggleVolume}
              className="rounded-full glass-card"
            >
              {voiceState.volume > 0 ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>

            <Button
              type="button"
              variant={voiceState.isListening ? "destructive" : "outline"}
              size="icon"
              onClick={toggleVoice}
              disabled={voiceState.isProcessing || isLoading}
              className={`rounded-full ${voiceState.isListening ? 'animate-pulse' : 'glass-card'}`}
            >
              {voiceState.isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : voiceState.isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>

        {/* Voice Status */}
        <AnimatePresence>
          {(voiceState.isListening || voiceState.isProcessing || voiceState.isSpeaking) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 text-center"
            >
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                {voiceState.isListening && (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Listening...
                  </>
                )}
                {voiceState.isProcessing && (
                  <>
                    <Zap className="w-4 h-4 animate-pulse" />
                    Processing voice...
                  </>
                )}
                {voiceState.isSpeaking && (
                  <>
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    Speaking...
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}