import { Snapshot, User, Bridge } from '@/lib/types';

interface MatchScore {
  snapshot: Snapshot;
  score: number;
  reasons: string[];
}

interface UserMatch {
  user: User;
  score: number;
  reasons: string[];
  sharedInterests: string[];
  sharedSkills: string[];
}

export class AIMatchingService {
  /**
   * Calculate text similarity between two strings using simple algorithms
   * In a real app, this would use more sophisticated NLP
   */
  private static calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  /**
   * Calculate theme compatibility score
   */
  private static calculateThemeScore(themes1: string[], themes2: string[]): number {
    if (themes1.length === 0 || themes2.length === 0) return 0;
    
    const sharedThemes = themes1.filter(theme => themes2.includes(theme));
    return sharedThemes.length / Math.max(themes1.length, themes2.length);
  }

  /**
   * Calculate cultural diversity bonus
   */
  private static calculateCulturalDiversityBonus(user1: User, user2: User): number {
    // Bonus for different cities/countries
    const location1 = user1.city.toLowerCase();
    const location2 = user2.city.toLowerCase();
    
    if (location1 !== location2) {
      return 0.2; // 20% bonus for different locations
    }
    return 0;
  }

  /**
   * Find the best matching snapshots for a given snapshot
   */
  static async findBestSnapshotMatches(
    targetSnapshot: Snapshot,
    allSnapshots: Snapshot[],
    allUsers: User[],
    limit: number = 3
  ): Promise<MatchScore[]> {
    const userMap = new Map(allUsers.map(user => [user.id, user]));
    const targetUser = userMap.get(targetSnapshot.userId);
    
    if (!targetUser) return [];

    const scores: MatchScore[] = [];

    for (const snapshot of allSnapshots) {
      // Skip same user's snapshots
      if (snapshot.userId === targetSnapshot.userId) continue;
      
      const user = userMap.get(snapshot.userId);
      if (!user) continue;

      let score = 0;
      const reasons: string[] = [];

      // Theme compatibility (40% weight)
      const themeScore = this.calculateThemeScore(targetSnapshot.themes, snapshot.themes);
      score += themeScore * 0.4;
      if (themeScore > 0) {
        const sharedThemes = targetSnapshot.themes.filter(t => snapshot.themes.includes(t));
        reasons.push(`Shared themes: ${sharedThemes.join(', ')}`);
      }

      // Text similarity (30% weight)
      const textSimilarity = this.calculateTextSimilarity(targetSnapshot.text, snapshot.text);
      score += textSimilarity * 0.3;
      if (textSimilarity > 0.3) {
        reasons.push('Similar content and interests');
      }

      // Cultural diversity bonus (20% weight)
      const diversityBonus = this.calculateCulturalDiversityBonus(targetUser, user);
      score += diversityBonus;
      if (diversityBonus > 0) {
        reasons.push(`Cultural exchange: ${targetUser.city} ↔ ${user.city}`);
      }

      // Recency bonus (10% weight)
      const daysDiff = (Date.now() - snapshot.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      const recencyBonus = Math.max(0, (7 - daysDiff) / 7) * 0.1;
      score += recencyBonus;
      if (recencyBonus > 0.05) {
        reasons.push('Recent and relevant content');
      }

      // User compatibility bonus
      const userCompatibility = this.calculateUserCompatibility(targetUser, user);
      score += userCompatibility * 0.2;
      if (userCompatibility > 0.3) {
        reasons.push('High user compatibility');
      }

      if (score > 0.1) { // Only include matches with meaningful scores
        scores.push({
          snapshot,
          score: Math.min(score, 1), // Cap at 1.0
          reasons
        });
      }
    }

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Find potential user matches based on interests and skills
   */
  static async findUserMatches(
    targetUser: User,
    allUsers: User[],
    limit: number = 5
  ): Promise<UserMatch[]> {
    const matches: UserMatch[] = [];

    for (const user of allUsers) {
      if (user.id === targetUser.id) continue;

      let score = 0;
      const reasons: string[] = [];
      const sharedInterests: string[] = [];
      const sharedSkills: string[] = [];

      // Interest matching (40% weight)
      const sharedInterestCount = targetUser.themes.filter(theme => 
        user.themes.includes(theme)
      ).length;
      const interestScore = sharedInterestCount / Math.max(targetUser.themes.length, user.themes.length);
      score += interestScore * 0.4;
      
      if (sharedInterestCount > 0) {
        sharedInterests.push(...targetUser.themes.filter(theme => user.themes.includes(theme)));
        reasons.push(`Shared interests: ${sharedInterests.join(', ')}`);
      }

      // Cultural diversity bonus (30% weight)
      const diversityBonus = this.calculateCulturalDiversityBonus(targetUser, user);
      score += diversityBonus;
      if (diversityBonus > 0) {
        reasons.push(`Cultural exchange opportunity: ${targetUser.city} ↔ ${user.city}`);
      }

      // Location proximity bonus (20% weight)
      const locationBonus = this.calculateLocationBonus(targetUser.city, user.city);
      score += locationBonus;
      if (locationBonus > 0) {
        reasons.push('Nearby cultural connection');
      }

      // Activity level bonus (10% weight)
      const activityBonus = this.calculateActivityBonus(user);
      score += activityBonus;
      if (activityBonus > 0) {
        reasons.push('Active community member');
      }

      if (score > 0.15) { // Only include meaningful matches
        matches.push({
          user,
          score: Math.min(score, 1),
          reasons,
          sharedInterests,
          sharedSkills
        });
      }
    }

    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Calculate user compatibility based on various factors
   */
  private static calculateUserCompatibility(user1: User, user2: User): number {
    let compatibility = 0;

    // Theme overlap
    const themeOverlap = user1.themes.filter(theme => user2.themes.includes(theme)).length;
    compatibility += (themeOverlap / Math.max(user1.themes.length, user2.themes.length)) * 0.5;

    // Cultural diversity bonus
    if (user1.city !== user2.city) {
      compatibility += 0.3;
    }

    // Account age similarity (newer users might connect better)
    const ageDiff = Math.abs(user1.createdAt.getTime() - user2.createdAt.getTime());
    const daysDiff = ageDiff / (1000 * 60 * 60 * 24);
    if (daysDiff < 30) {
      compatibility += 0.2;
    }

    return Math.min(compatibility, 1);
  }

  /**
   * Calculate location-based bonus
   */
  private static calculateLocationBonus(city1: string, city2: string): number {
    // Simple city matching - in a real app, you'd use geolocation APIs
    const city1Lower = city1.toLowerCase();
    const city2Lower = city2.toLowerCase();
    
    if (city1Lower === city2Lower) {
      return 0.1; // Same city bonus
    }
    
    // Check for same country (basic implementation)
    const country1 = city1Lower.split(',').pop()?.trim();
    const country2 = city2Lower.split(',').pop()?.trim();
    
    if (country1 && country2 && country1 === country2) {
      return 0.05; // Same country bonus
    }
    
    return 0;
  }

  /**
   * Calculate activity bonus based on user profile
   */
  private static calculateActivityBonus(user: User): number {
    // In a real app, this would be based on actual activity data
    // For now, we'll use account age as a proxy
    const daysSinceCreation = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceCreation < 7) {
      return 0.1; // New user bonus
    } else if (daysSinceCreation < 30) {
      return 0.05; // Recent user bonus
    }
    
    return 0;
  }

  /**
   * Generate personalized match explanations
   */
  static generateMatchExplanation(match: MatchScore | UserMatch): string {
    if ('snapshot' in match) {
      // Snapshot match
      const reasons = match.reasons.slice(0, 2); // Top 2 reasons
      return `Great match! ${reasons.join(' • ')}`;
    } else {
      // User match
      const reasons = match.reasons.slice(0, 2);
      return `Perfect connection! ${reasons.join(' • ')}`;
    }
  }

  /**
   * Get AI-powered bridge suggestions
   */
  static async getBridgeSuggestions(
    user: User,
    allSnapshots: Snapshot[],
    allUsers: User[]
  ): Promise<{
    topBridges: MatchScore[];
    potentialConnections: UserMatch[];
    personalizedThemes: string[];
  }> {
    // Get user's recent snapshots
    const userSnapshots = allSnapshots
      .filter(s => s.userId === user.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 3);

    // Find matches for each snapshot
    const allMatches: MatchScore[] = [];
    for (const snapshot of userSnapshots) {
      const matches = await this.findBestSnapshotMatches(snapshot, allSnapshots, allUsers, 2);
      allMatches.push(...matches);
    }

    // Get potential user connections
    const potentialConnections = await this.findUserMatches(user, allUsers, 3);

    // Suggest personalized themes based on user's interests and popular themes
    const personalizedThemes = this.getPersonalizedThemes(user, allSnapshots);

    return {
      topBridges: allMatches.slice(0, 3),
      potentialConnections,
      personalizedThemes
    };
  }

  /**
   * Get personalized theme suggestions
   */
  private static getPersonalizedThemes(user: User, allSnapshots: Snapshot[]): string[] {
    // Count theme popularity in user's snapshots
    const themeCounts = new Map<string, number>();
    
    allSnapshots
      .filter(s => s.userId === user.id)
      .forEach(snapshot => {
        snapshot.themes.forEach(theme => {
          themeCounts.set(theme, (themeCounts.get(theme) || 0) + 1);
        });
      });

    // Return top themes, but also include some new ones for discovery
    const userThemes = Array.from(themeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([theme]) => theme)
      .slice(0, 2);

    // Add some discovery themes
    const allThemes = ['food', 'music', 'places', 'skills', 'language', 'study'];
    const discoveryThemes = allThemes
      .filter(theme => !userThemes.includes(theme))
      .slice(0, 1);

    return [...userThemes, ...discoveryThemes];
  }
}
