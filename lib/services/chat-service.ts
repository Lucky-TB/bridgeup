import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatUser {
  displayName: string;
  photoURL: string;
  city: string;
  themes: string[];
  description: string;
}

export class ChatService {
  private static getGeminiModel() {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  static async generateResponse(
    userMessage: string,
    chatUser: ChatUser,
    conversationHistory: ChatMessage[]
  ): Promise<string> {
    try {
      const model = this.getGeminiModel();
      
      // Create context about the person and their cultural background
      const context = `You are ${chatUser.displayName} from ${chatUser.city}. You are passionate about ${chatUser.themes.join(', ')} and your cultural moment is: "${chatUser.description}". 
      
You are chatting with someone who wants to learn about your skills and cultural traditions. You should:
- Be friendly and enthusiastic about sharing your knowledge
- Offer to teach specific techniques or methods
- Share personal stories related to your cultural background
- Ask questions about their interests and experience level
- Be encouraging and supportive
- Keep responses conversational and not too long (1-3 sentences)

Recent conversation context: ${conversationHistory.slice(-3).map(msg => 
  msg.isUser ? `User: ${msg.text}` : `${chatUser.displayName}: ${msg.text}`
).join('\n')}

User's latest message: "${userMessage}"

Respond as ${chatUser.displayName}:`;

      const result = await model.generateContent(context);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating chat response:', error);
      return this.getFallbackResponse(userMessage, chatUser);
    }
  }

  private static getFallbackResponse(userMessage: string, chatUser: ChatUser): string {
    const fallbackResponses = [
      `That's so interesting! I'd love to teach you more about ${chatUser.themes[0]} sometime.`,
      `I'm really excited to share my knowledge with you! What would you like to learn first?`,
      `Growing up in ${chatUser.city}, I learned so much about ${chatUser.themes.join(' and ')}. I'd be happy to show you!`,
      `That sounds amazing! I have some great techniques I could teach you.`,
      `I love connecting with people who are interested in ${chatUser.themes[0]}! Let's chat more about it.`
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  static createMessage(text: string, isUser: boolean): ChatMessage {
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      isUser,
      timestamp: new Date()
    };
  }
}
