import { toastStore } from '@/lib/stores/toast';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  recommendations?: Array<{
    type: 'music' | 'movie' | 'book' | 'podcast';
    title: string;
    description: string;
    reason: string;
  }>;
}

class AIService {
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch(`${OPENAI_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'AI service error');
    }

    return response.json();
  }

  async generateChatResponse(
    messages: ChatMessage[],
    userProfile?: any
  ): Promise<AIResponse> {
    try {
      const systemPrompt = `You are an AI taste companion that helps users discover music, movies, books, and other cultural content. 

Your personality:
- Friendly and enthusiastic about cultural discovery
- Provide thoughtful, personalized recommendations
- Explain why you're suggesting something
- Ask follow-up questions to better understand preferences
- Be conversational and engaging

User context: ${userProfile ? `User is ${userProfile.age || 'unknown'} years old, from ${userProfile.location || 'unknown location'}.` : ''}

Respond naturally and provide 1-3 specific recommendations when appropriate.`;

      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      
      // Parse recommendations from the response
      const recommendations = this.parseRecommendations(content);

      return {
        content,
        recommendations
      };
    } catch (error) {
      console.error('AI service error:', error);
      toastStore.add({
        type: 'error',
        title: 'AI Service Error',
        message: 'Unable to get AI response. Please try again.'
      });
      
      // Fallback response
      return {
        content: "I'm having trouble connecting to my AI services right now. I can still help you discover new things! What type of content are you interested in exploring?",
        recommendations: []
      };
    }
  }

  private parseRecommendations(content: string): AIResponse['recommendations'] {
    const recommendations: AIResponse['recommendations'] = [];
    
    // Simple parsing logic - in production, you'd want more sophisticated parsing
    const lines = content.split('\n');
    let currentType: 'music' | 'movie' | 'book' | 'podcast' | null = null;
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('music') || lowerLine.includes('song') || lowerLine.includes('artist')) {
        currentType = 'music';
      } else if (lowerLine.includes('movie') || lowerLine.includes('film') || lowerLine.includes('show')) {
        currentType = 'movie';
      } else if (lowerLine.includes('book') || lowerLine.includes('read')) {
        currentType = 'book';
      } else if (lowerLine.includes('podcast')) {
        currentType = 'podcast';
      }
      
      // Look for titles in quotes or after colons
      const titleMatch = line.match(/"([^"]+)"/) || line.match(/^[•-]\s*([^:]+)/);
      if (titleMatch && currentType) {
        recommendations.push({
          type: currentType,
          title: titleMatch[1].trim(),
          description: line.trim(),
          reason: 'Based on your taste profile'
        });
      }
    }
    
    return recommendations.slice(0, 3); // Limit to 3 recommendations
  }

  async generateRecommendations(
    userProfile: any,
    preferences: string[]
  ): Promise<AIResponse['recommendations']> {
    try {
      const prompt = `Based on this user profile and preferences, suggest 3 specific cultural recommendations:

User Profile:
- Age: ${userProfile.age || 'unknown'}
- Location: ${userProfile.location || 'unknown'}
- Preferences: ${preferences.join(', ')}

Provide 3 specific recommendations (music, movies, books, or podcasts) with:
1. Title
2. Brief description
3. Why it matches their taste

Format as JSON array.`;

      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a cultural recommendation expert. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch {
        return [];
      }
    } catch (error) {
      console.error('Recommendation generation error:', error);
      return [];
    }
  }
}

export const aiService = new AIService();