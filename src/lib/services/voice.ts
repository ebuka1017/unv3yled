import { toastStore } from '@/lib/stores/toast';

export interface VoiceConfig {
  enabled: boolean;
  language: string;
  voice: string;
}

class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private isSpeaking = false;
  
  constructor() {
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
  }
  
  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }
  
  private initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }
  
  async startListening(onResult: (text: string) => void, onError?: (error: string) => void): Promise<boolean> {
    if (!this.recognition) {
      const error = 'Speech recognition is not supported in this browser.';
      onError?.(error);
      toastStore.add({
        type: 'error',
        title: 'Voice Not Supported',
        message: error
      });
      return false;
    }
    
    if (this.isListening) {
      return false;
    }
    
    try {
      this.isListening = true;
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        this.isListening = false;
      };
      
      this.recognition.onerror = (event) => {
        const error = `Speech recognition error: ${event.error}`;
        onError?.(error);
        toastStore.add({
          type: 'error',
          title: 'Voice Recognition Error',
          message: error
        });
        this.isListening = false;
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
      };
      
      this.recognition.start();
      
      toastStore.add({
        type: 'info',
        title: 'Listening...',
        message: 'Speak now to input your message.'
      });
      
      return true;
    } catch (error) {
      this.isListening = false;
      const errorMessage = 'Failed to start voice recognition.';
      onError?.(errorMessage);
      toastStore.add({
        type: 'error',
        title: 'Voice Error',
        message: errorMessage
      });
      return false;
    }
  }
  
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
  
  async speak(text: string, config?: Partial<VoiceConfig>): Promise<boolean> {
    if (!this.synthesis) {
      toastStore.add({
        type: 'error',
        title: 'Voice Not Supported',
        message: 'Text-to-speech is not supported in this browser.'
      });
      return false;
    }
    
    if (this.isSpeaking) {
      this.synthesis.cancel();
    }
    
    try {
      this.isSpeaking = true;
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings
      utterance.lang = config?.language || 'en-US';
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      // Try to use a good voice
      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.startsWith('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onend = () => {
        this.isSpeaking = false;
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        this.isSpeaking = false;
        toastStore.add({
          type: 'error',
          title: 'Voice Error',
          message: 'Failed to speak the text.'
        });
      };
      
      this.synthesis.speak(utterance);
      
      return true;
    } catch (error) {
      this.isSpeaking = false;
      toastStore.add({
        type: 'error',
        title: 'Voice Error',
        message: 'Failed to speak the text.'
      });
      return false;
    }
  }
  
  stopSpeaking(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }
  
  isSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }
  
  getListeningState(): boolean {
    return this.isListening;
  }
  
  getSpeakingState(): boolean {
    return this.isSpeaking;
  }
  
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    
    const voices = this.synthesis.getVoices();
    return voices.filter(voice => voice.lang.startsWith('en'));
  }
}

export const voiceService = new VoiceService();