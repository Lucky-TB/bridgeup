import { GoogleGenerativeAI } from '@google/generative-ai';
import { Snapshot } from '@/lib/types';

interface PlaceholderBridge {
  id: string;
  themes: string[];
  description: string;
  mediaPath: string;
  user: {
    displayName: string;
    photoURL: string;
    city: string;
  };
}

const PLACEHOLDER_BRIDGES: PlaceholderBridge[] = [
  {
    id: 'placeholder_1',
    themes: ['food'],
    description: 'Traditional Italian pasta making with my nonna - the secret is in the hand-rolled technique passed down for generations',
    mediaPath: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    user: {
      displayName: 'Marco',
      photoURL: '',
      city: 'Rome'
    }
  },
  {
    id: 'placeholder_2',
    themes: ['music'],
    description: 'Learning flamenco guitar in Seville - the passion and rhythm that connects generations',
    mediaPath: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
    user: {
      displayName: 'Carmen',
      photoURL: '',
      city: 'Seville'
    }
  },
  {
    id: 'placeholder_3',
    themes: ['art', 'culture'],
    description: 'Street art in Berlin that tells the story of the city\'s transformation and resilience',
    mediaPath: 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg',
    user: {
      displayName: 'Klaus',
      photoURL: '',
      city: 'Berlin'
    }
  },
  {
    id: 'placeholder_4',
    themes: ['food', 'family'],
    description: 'Sunday dim sum tradition in Hong Kong - where every dumpling tells a story of family and heritage',
    mediaPath: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    user: {
      displayName: 'Wei',
      photoURL: '',
      city: 'Hong Kong'
    }
  },
  {
    id: 'placeholder_5',
    themes: ['music', 'tradition'],
    description: 'Jazz night in New Orleans - where the music flows through the streets like the Mississippi River',
    mediaPath: 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg',
    user: {
      displayName: 'Louis',
      photoURL: '',
      city: 'New Orleans'
    }
  }
];

export class AIMatchingService {
  private static getGeminiModel() {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Try the newer model name first, fallback to gemini-pro
    try {
      return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } catch (error) {
      console.warn('Failed to use gemini-1.5-flash, falling back to gemini-pro');
      return genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
  }

  static async findBestMatch(userSnapshot: Snapshot): Promise<PlaceholderBridge | null> {
    try {
      const model = this.getGeminiModel();
      const prompt = `Find the best match for themes: ${userSnapshot.themes.join(', ')} and description: "${userSnapshot.text}". Respond with number 1-${PLACEHOLDER_BRIDGES.length}.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const matchIndex = parseInt(text.trim()) - 1;

      if (matchIndex >= 0 && matchIndex < PLACEHOLDER_BRIDGES.length) {
        return PLACEHOLDER_BRIDGES[matchIndex];
      }

      return this.getFallbackMatch(userSnapshot);
    } catch (error) {
      console.error('Error in AI matching:', error);
      return this.getFallbackMatch(userSnapshot);
    }
  }

  private static getFallbackMatch(userSnapshot: Snapshot): PlaceholderBridge {
    // Simple theme-based matching as fallback
    const userThemes = userSnapshot.themes.map(t => t.toLowerCase());
    
    // Find bridges with matching themes
    const matchingBridges = PLACEHOLDER_BRIDGES.filter(bridge => 
      bridge.themes.some(theme => 
        userThemes.some(userTheme => 
          theme.toLowerCase().includes(userTheme) || userTheme.includes(theme.toLowerCase())
        )
      )
    );

    if (matchingBridges.length > 0) {
      return matchingBridges[Math.floor(Math.random() * matchingBridges.length)];
    }

    // If no theme matches, return random bridge
    return PLACEHOLDER_BRIDGES[Math.floor(Math.random() * PLACEHOLDER_BRIDGES.length)];
  }

  static getAllPlaceholderBridges(): PlaceholderBridge[] {
    return [...PLACEHOLDER_BRIDGES];
  }
}
