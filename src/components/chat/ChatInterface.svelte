<script lang="ts">
  import { onMount } from 'svelte';
  import Button from '@/components/ui/button/Button.svelte';
  import { Send, Bot, User, Loader2 } from 'lucide-svelte';
  import { toastStore } from '@/lib/stores/toast';
  
  let messages: Array<{ id: string; text: string; sender: 'user' | 'bot'; timestamp: Date }> = [];
  let newMessage = '';
  let loading = false;
  
  onMount(() => {
    // Add welcome message
    messages = [
      {
        id: '1',
        text: "Hello! I'm your AI taste companion. I can help you discover new music, movies, books, and more based on your preferences. What would you like to explore today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ];
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
    
    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateResponse(messageText);
      messages = [...messages, {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }];
      loading = false;
    }, 1000);
  }
  
  function generateResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('music') || lowerMessage.includes('song') || lowerMessage.includes('artist')) {
      return "I'd love to help you discover new music! Based on your taste profile, I think you might enjoy artists like Radiohead, Tame Impala, or The Weeknd. Would you like me to create a personalized playlist for you?";
    } else if (lowerMessage.includes('movie') || lowerMessage.includes('film') || lowerMessage.includes('show')) {
      return "Great choice! For movies and TV shows, I can recommend based on your preferences. I see you enjoy sci-fi and drama. Have you seen 'Arrival' or 'The Expanse'? They might be right up your alley!";
    } else if (lowerMessage.includes('book') || lowerMessage.includes('read')) {
      return "I'm excited to help with book recommendations! Based on your profile, you seem to enjoy thought-provoking fiction. I'd recommend 'The Three-Body Problem' by Liu Cixin or 'The Midnight Library' by Matt Haig.";
    } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion')) {
      return "I'd be happy to make recommendations! I can suggest music, movies, books, or even podcasts based on your taste profile. What type of content are you most interested in right now?";
    } else {
      return "That's interesting! I'm here to help you discover new content that matches your taste. You can ask me about music, movies, books, or just tell me what you're in the mood for, and I'll suggest something perfect for you.";
    }
  }
  
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
</script>

<div class="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
  <!-- Chat Header -->
  <div class="flex items-center gap-3 p-4 border-b border-border">
    <Bot class="w-6 h-6 text-primary" />
    <h2 class="text-lg font-semibold">AI Taste Companion</h2>
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
        disabled={loading}
      ></textarea>
      <Button 
        on:click={sendMessage}
        disabled={loading || !newMessage.trim()}
        className="self-end"
      >
        <Send class="w-4 h-4" />
      </Button>
    </div>
  </div>
</div>