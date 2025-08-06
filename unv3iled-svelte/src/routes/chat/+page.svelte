<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { supabase } from '$lib/supabase'
  import { goto } from '$app/navigation'
  import { 
    Send, 
    Mic, 
    MicOff, 
    Loader2,
    Sparkles,
    User,
    Bot,
    Volume2,
    VolumeX
  } from 'lucide-svelte'
  import { fly, fade, scale } from 'svelte/transition'

  interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: Date
    isTyping?: boolean
  }

  let messages: Message[] = []
  let inputMessage = ''
  let loading = false
  let user: any = null
  let mediaRecorder: MediaRecorder | null = null
  let isRecording = false
  let isProcessingVoice = false
  let isPlayingTTS = false
  let audioChunks: Blob[] = []

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      goto('/auth')
      return
    }
    user = session.user

    // Add welcome message
    messages = [{
      id: 'welcome',
      content: "Hello! I'm your cultural intelligence companion. I can help you discover music, books, movies, and connect you with people who share your taste. What would you like to explore today?",
      role: 'assistant',
      timestamp: new Date()
    }]
  })

  const sendMessage = async (content: string, isVoice = false) => {
    if (!content.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    }

    messages = [...messages, userMessage]
    inputMessage = ''
    loading = true

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isTyping: true
    }
    messages = [...messages, typingMessage]

    try {
      // Call Gemini insights edge function
      const { data, error } = await supabase.functions.invoke('gemini-insights', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: {
          userPrompt: content,
          context: isVoice ? 'voice_chat' : 'text_chat'
        },
      })

      if (error) throw error

      // Remove typing indicator and add response
      messages = messages.filter(m => m.id !== 'typing')
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data?.insights || "I'm here to help you discover cultural content. What interests you?",
        role: 'assistant',
        timestamp: new Date()
      }

      messages = [...messages, assistantMessage]

      // Auto-play TTS for voice interactions
      if (isVoice && data?.insights) {
        await playTTS(data.insights)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      messages = messages.filter(m => m.id !== 'typing')
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        role: 'assistant',
        timestamp: new Date()
      }
      messages = [...messages, errorMessage]
    } finally {
      loading = false
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder = new MediaRecorder(stream)
      audioChunks = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        await processVoiceInput(audioBlob)
      }

      mediaRecorder.start()
      isRecording = true
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach(track => track.stop())
      isRecording = false
    }
  }

  const processVoiceInput = async (audioBlob: Blob) => {
    isProcessingVoice = true

    try {
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer()
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      
      // Send to voice chat edge function
      const { data, error } = await supabase.functions.invoke('voice-chat', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: {
          audio: base64Audio,
        },
      })

      if (error) throw error

      const transcription = data?.transcription || "Could not transcribe audio"
      await sendMessage(transcription, true)

    } catch (error) {
      console.error('Voice processing error:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I couldn't process your voice input. Please try again.",
        role: 'assistant',
        timestamp: new Date()
      }
      messages = [...messages, errorMessage]
    } finally {
      isProcessingVoice = false
    }
  }

  const playTTS = async (text: string) => {
    try {
      isPlayingTTS = true
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: {
          text,
          voice_id: '21m00Tcm4TlvDq8ikWAM' // Rachel voice
        },
      })

      if (error) throw error

      if (data?.audio) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`)
        await audio.play()
      }
    } catch (error) {
      console.error('TTS error:', error)
    } finally {
      isPlayingTTS = false
    }
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage(inputMessage)
    }
  }
</script>

<svelte:head>
  <title>Chat - Unv3iled</title>
</svelte:head>

<div class="flex flex-col h-screen">
  <!-- Header -->
  <div class="glass-strong border-b border-glass-border p-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
        <Sparkles class="w-6 h-6 text-primary" />
      </div>
      <div>
        <h1 class="text-xl font-bold">Cultural Intelligence Chat</h1>
        <p class="text-sm text-muted-foreground">Your AI companion for cultural discovery</p>
      </div>
    </div>
  </div>

  <!-- Messages -->
  <div class="flex-1 overflow-y-auto p-4 space-y-4">
    {#each messages as message (message.id)}
      <div 
        class="flex gap-3 {message.role === 'user' ? 'justify-end' : 'justify-start'}"
        in:fly={{ y: 20, duration: 300 }}
      >
        {#if message.role === 'assistant'}
          <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Bot class="w-4 h-4 text-primary" />
          </div>
        {/if}
        
        <div class="max-w-[70%]">
          <div class="glass-card rounded-2xl p-4 {message.role === 'user' ? 'bg-primary text-white' : ''}">
            {#if message.isTyping}
              <div class="flex items-center gap-2">
                <div class="flex gap-1">
                  <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div class="w-2 h-2 bg-primary rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                  <div class="w-2 h-2 bg-primary rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
                </div>
                <span class="text-sm text-muted-foreground">AI is thinking...</span>
              </div>
            {:else}
              <p class="whitespace-pre-wrap">{message.content}</p>
            {/if}
          </div>
          <div class="text-xs text-muted-foreground mt-1 ml-1">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>

        {#if message.role === 'user'}
          <div class="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <User class="w-4 h-4 text-accent" />
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Input -->
  <div class="glass-strong border-t border-glass-border p-4">
    <div class="flex gap-3">
      <div class="flex-1 relative">
        <textarea
          bind:value={inputMessage}
          on:keypress={handleKeyPress}
          placeholder="Ask for music, movie, book, or travel recommendations..."
          class="w-full glass-input rounded-xl p-4 pr-12 resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
          rows="1"
          disabled={loading}
        />
        <button
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary disabled:opacity-50"
          disabled={loading || !inputMessage.trim()}
          on:click={() => sendMessage(inputMessage)}
        >
          <Send class="w-5 h-5" />
        </button>
      </div>

      <button
        class="glass-button p-4 rounded-xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading || isRecording || isProcessingVoice}
        on:click={isRecording ? stopRecording : startRecording}
      >
        {#if isRecording}
          <MicOff class="w-5 h-5 text-red-500" />
        {:else if isProcessingVoice}
          <Loader2 class="w-5 h-5 animate-spin" />
        {:else}
          <Mic class="w-5 h-5" />
        {/if}
      </button>

      <button
        class="glass-card p-4 rounded-xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading || isPlayingTTS}
        on:click={() => isPlayingTTS = !isPlayingTTS}
      >
        {#if isPlayingTTS}
          <VolumeX class="w-5 h-5" />
        {:else}
          <Volume2 class="w-5 h-5" />
        {/if}
      </button>
    </div>
  </div>
</div>