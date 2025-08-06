<script lang="ts">
  import { onMount } from 'svelte';
  import Button from '@/components/ui/button/Button.svelte';
  import { Send, Bot, User, Loader2, Heart, Music, Film, Book, Mic, MicOff, Volume2, VolumeX } from 'lucide-svelte';
  import { toastStore } from '@/lib/stores/toast';
  import { aiService, type ChatMessage, type AIResponse } from '@/lib/services/ai';
  import { userProfileService, type UserProfile } from '@/lib/services/userProfile';
  import { voiceService } from '@/lib/services/voice';
  import { authStore } from '@/lib/stores/auth';
  
  let messages: Array<{ id: string; text: string; sender: 'user' | 'bot'; timestamp: Date; recommendations?: any[] }> = [];
  let newMessage = '';
  let loading = false;
  let userProfile: UserProfile | null = null;
  let authState: any;
  let voiceEnabled = false;
  let isListening = false;
  let isSpeaking = false;
  
  authStore.subscribe(state => {
    authState = state;
  });
  
  onMount(async () => {
    // Add welcome message
    messages = [
      {
        id: '1',
        text: "Hello! I'm your AI taste companion. I can help you discover new music, movies, books, and more based on your preferences. What would you like to explore today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ];
    
    // Load user profile if authenticated
    if (authState?.user) {
      userProfile = await userProfileService.getUserProfile(authState.user.id);
      if (!userProfile) {
        // Create profile if it doesn't exist
        userProfile = await userProfileService.createUserProfile(authState.user.id, authState.user.email);
      }
    }
    
    // Check voice support
    voiceEnabled = voiceService.isSupported();
  });
  
  async function sendMessage() {
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    messages = [...messages, userMessage];
    const messageText = newMessage;
    newMessage = '';
    loading = true;
    
    try {
      // Convert messages to AI service format
      const aiMessages: ChatMessage[] = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // Get AI response
      const aiResponse: AIResponse = await aiService.generateChatResponse(aiMessages, userProfile);
      
      // Add bot response
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.content,
        sender: 'bot' as const,
        timestamp: new Date(),
        recommendations: aiResponse.recommendations
      };
      
      messages = [...messages, botMessage];
      
      // Speak the response if voice is enabled
      if (voiceEnabled) {
        await voiceService.speak(aiResponse.content);
      }
      
      // If user is authenticated and there are recommendations, save them
      if (authState?.user && aiResponse.recommendations?.length) {
        for (const rec of aiResponse.recommendations) {
          const category = rec.type === 'music' ? 'music' : 
                          rec.type === 'movie' ? 'movies' : 
                          rec.type === 'book' ? 'books' : 'podcasts';
          
          await userProfileService.addPreference(authState.user.id, category, rec.title);
        }
      }
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      messages = [...messages, {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to my AI services right now. I can still help you discover new things! What type of content are you interested in exploring?",
        sender: 'bot',
        timestamp: new Date()
      }];
    } finally {
      loading = false;
    }
  }
  
  async function startVoiceInput() {
    if (!voiceEnabled) {
      toastStore.add({
        type: 'error',
        title: 'Voice Not Supported',
        message: 'Voice input is not supported in your browser.'
      });
      return;
    }
    
    isListening = true;
    
    const success = await voiceService.startListening(
      (transcript) => {
        newMessage = transcript;
        isListening = false;
        sendMessage();
      },
      (error) => {
        console.error('Voice recognition error:', error);
        isListening = false;
      }
    );
    
    if (!success) {
      isListening = false;
    }
  }
  
  function stopVoiceInput() {
    voiceService.stopListening();
    isListening = false;
  }
  
  async function toggleVoiceOutput() {
    if (!voiceEnabled) {
      toastStore.add({
        type: 'error',
        title: 'Voice Not Supported',
        message: 'Voice output is not supported in your browser.'
      });
      return;
    }
    
    if (isSpeaking) {
      voiceService.stopSpeaking();
      isSpeaking = false;
    } else {
      // Speak the last bot message
      const lastBotMessage = messages.filter(m => m.sender === 'bot').pop();
      if (lastBotMessage) {
        isSpeaking = true;
        await voiceService.speak(lastBotMessage.text);
        isSpeaking = false;
      }
    }
  }
  
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
  
  function getTypeIcon(type: string) {
    switch (type) {
      case 'music': return Music;
      case 'movie': return Film;
      case 'book': return Book;
      case 'podcast': return Mic;
      default: return Heart;
    }
  }
</script>

<div class="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
  <!-- Chat Header -->
  <div class="flex items-center gap-3 p-4 border-b border-border">
    <Bot class="w-6 h-6 text-primary" />
    <h2 class="text-lg font-semibold">AI Taste Companion</h2>
    {#if userProfile}
      <span class="text-sm text-muted-foreground">• Personalized</span>
    {/if}
    {#if voiceEnabled}
      <span class="text-sm text-muted-foreground">• Voice Enabled</span>
    {/if}
  </div>
  
  <!-- Messages -->
  <div class="flex-1 overflow-y-auto p-4 space-y-4">
    {#each messages as message (message.id)}
      <div class="flex {message.sender === 'user' ? 'justify-end' : 'justify-start'}">
        <div class="flex items-start gap-3 max-w-[80%]">
          {#if message.sender === 'bot'}
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot class="w-4 h-4 text-primary" />
            </div>
          {/if}
          <div class="bg-card border rounded-lg p-3 shadow-sm">
            <p class="text-sm">{message.text}</p>
            <p class="text-xs text-muted-foreground mt-1">
              {message.timestamp.toLocaleTimeString()}
            </p>
            
            <!-- Recommendations -->
            {#if message.recommendations && message.recommendations.length > 0}
              <div class="mt-3 pt-3 border-t border-border">
                <p class="text-xs font-medium text-muted-foreground mb-2">Recommendations:</p>
                <div class="space-y-2">
                  {#each message.recommendations as rec}
                    <div class="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <svelte:component this={getTypeIcon(rec.type)} class="w-4 h-4 text-primary" />
                      <div class="flex-1">
                        <p class="text-xs font-medium">{rec.title}</p>
                        <p class="text-xs text-muted-foreground">{rec.reason}</p>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
          {#if message.sender === 'user'}
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User class="w-4 h-4 text-primary" />
            </div>
          {/if}
        </div>
      </div>
    {/each}
    
    {#if loading}
      <div class="flex justify-start">
        <div class="flex items-start gap-3 max-w-[80%]">
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Bot class="w-4 h-4 text-primary" />
          </div>
          <div class="bg-card border rounded-lg p-3 shadow-sm">
            <div class="flex items-center gap-2">
              <Loader2 class="w-4 h-4 animate-spin" />
              <span class="text-sm text-muted-foreground">AI is thinking...</span>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Message Input -->
  <div class="border-t border-border p-4">
    <div class="flex gap-2">
      <textarea
        bind:value={newMessage}
        on:keypress={handleKeyPress}
        placeholder="Ask me about music, movies, books, or anything you'd like to discover..."
        class="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        rows="2"
        disabled={loading || isListening}
      ></textarea>
      
      <!-- Voice Input Button -->
      {#if voiceEnabled}
        <Button 
          on:click={isListening ? stopVoiceInput : startVoiceInput}
          variant={isListening ? 'destructive' : 'outline'}
          className="self-end"
          disabled={loading}
        >
          {#if isListening}
            <MicOff class="w-4 h-4" />
          {:else}
            <Mic class="w-4 h-4" />
          {/if}
        </Button>
      {/if}
      
      <!-- Voice Output Button -->
      {#if voiceEnabled}
        <Button 
          on:click={toggleVoiceOutput}
          variant="outline"
          className="self-end"
          disabled={loading}
        >
          {#if isSpeaking}
            <VolumeX class="w-4 h-4" />
          {:else}
            <Volume2 class="w-4 h-4" />
          {/if}
        </Button>
      {/if}
      
      <Button 
        on:click={sendMessage}
        disabled={loading || !newMessage.trim() || isListening}
        className="self-end"
      >
        <Send class="w-4 h-4" />
      </Button>
    </div>
    
    <!-- Voice Status -->
    {#if voiceEnabled}
      <div class="mt-2 text-xs text-muted-foreground">
        {#if isListening}
          <span class="flex items-center gap-1">
            <Mic class="w-3 h-3" />
            Listening... Speak now
          </span>
        {:else if isSpeaking}
          <span class="flex items-center gap-1">
            <Volume2 class="w-3 h-3" />
            Speaking...
          </span>
        {:else}
          <span class="flex items-center gap-1">
            <Mic class="w-3 h-3" />
            Click microphone to speak, or type your message
          </span>
        {/if}
      </div>
    {/if}
  </div>
</div>