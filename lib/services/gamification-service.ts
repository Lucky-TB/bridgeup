import { User, Snapshot, Bridge } from '@/lib/types';

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'creation' | 'social' | 'exploration' | 'achievement';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  points: number;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface UserStats {
  bridgesCreated: number;
  snapshotsPosted: number;
  likesReceived: number;
  savesReceived: number;
  bridgesLiked: number;
  bridgesSaved: number;
  themesExplored: string[];
  countriesConnected: string[];
  streakDays: number;
  lastActiveDate: Date;
  totalPoints: number;
  level: number;
  badges: Badge[];
  achievements: Achievement[];
}

export class GamificationService {
  private static readonly BADGES: Omit<Badge, 'unlockedAt' | 'progress' | 'maxProgress'>[] = [
    // Creation badges
    {
      id: 'first_bridge',
      name: 'Bridge Builder',
      description: 'Created your first bridge',
      emoji: '🌉',
      category: 'creation',
      rarity: 'common',
    },
    {
      id: 'bridge_master',
      name: 'Bridge Master',
      description: 'Created 10 bridges',
      emoji: '🏗️',
      category: 'creation',
      rarity: 'rare',
    },
    {
      id: 'cultural_architect',
      name: 'Cultural Architect',
      description: 'Created 50 bridges',
      emoji: '🏛️',
      category: 'creation',
      rarity: 'epic',
    },
    {
      id: 'bridge_legend',
      name: 'Bridge Legend',
      description: 'Created 100 bridges',
      emoji: '👑',
      category: 'creation',
      rarity: 'legendary',
    },

    // Social badges
    {
      id: 'first_like',
      name: 'First Impression',
      description: 'Received your first like',
      emoji: '❤️',
      category: 'social',
      rarity: 'common',
    },
    {
      id: 'popular_creator',
      name: 'Popular Creator',
      description: 'Received 100 likes',
      emoji: '⭐',
      category: 'social',
      rarity: 'rare',
    },
    {
      id: 'viral_sensation',
      name: 'Viral Sensation',
      description: 'Received 1000 likes',
      emoji: '🔥',
      category: 'social',
      rarity: 'epic',
    },
    {
      id: 'cultural_icon',
      name: 'Cultural Icon',
      description: 'Received 10000 likes',
      emoji: '🌟',
      category: 'social',
      rarity: 'legendary',
    },

    // Exploration badges
    {
      id: 'theme_explorer',
      name: 'Theme Explorer',
      description: 'Explored 5 different themes',
      emoji: '🗺️',
      category: 'exploration',
      rarity: 'common',
    },
    {
      id: 'cultural_nomad',
      name: 'Cultural Nomad',
      description: 'Connected with people from 10 countries',
      emoji: '🌍',
      category: 'exploration',
      rarity: 'rare',
    },
    {
      id: 'global_citizen',
      name: 'Global Citizen',
      description: 'Connected with people from 25 countries',
      emoji: '🌎',
      category: 'exploration',
      rarity: 'epic',
    },
    {
      id: 'world_bridge',
      name: 'World Bridge',
      description: 'Connected with people from 50 countries',
      emoji: '🌐',
      category: 'exploration',
      rarity: 'legendary',
    },

    // Achievement badges
    {
      id: 'early_adopter',
      name: 'Early Adopter',
      description: 'Joined in the first week',
      emoji: '🚀',
      category: 'achievement',
      rarity: 'rare',
    },
    {
      id: 'streak_master',
      name: 'Streak Master',
      description: 'Active for 30 consecutive days',
      emoji: '🔥',
      category: 'achievement',
      rarity: 'epic',
    },
    {
      id: 'cultural_ambassador',
      name: 'Cultural Ambassador',
      description: 'Shared content in 5 different languages',
      emoji: '🗣️',
      category: 'achievement',
      rarity: 'legendary',
    },
  ];

  private static readonly ACHIEVEMENTS: Omit<Achievement, 'unlockedAt' | 'progress' | 'maxProgress'>[] = [
    {
      id: 'first_steps',
      name: 'First Steps',
      description: 'Complete your profile setup',
      emoji: '👣',
      points: 10,
    },
    {
      id: 'content_creator',
      name: 'Content Creator',
      description: 'Post your first snapshot',
      emoji: '📸',
      points: 20,
    },
    {
      id: 'bridge_builder',
      name: 'Bridge Builder',
      description: 'Create your first bridge',
      emoji: '🌉',
      points: 50,
    },
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Like 10 bridges',
      emoji: '🦋',
      points: 30,
    },
    {
      id: 'collector',
      name: 'Collector',
      description: 'Save 20 bridges',
      emoji: '💾',
      points: 40,
    },
    {
      id: 'explorer',
      name: 'Explorer',
      description: 'Explore all available themes',
      emoji: '🗺️',
      points: 100,
    },
    {
      id: 'connector',
      name: 'Connector',
      description: 'Connect with 10 different people',
      emoji: '🤝',
      points: 80,
    },
    {
      id: 'cultural_expert',
      name: 'Cultural Expert',
      description: 'Share content from 5 different cultures',
      emoji: '🎭',
      points: 150,
    },
  ];

  /**
   * Calculate user stats from their data
   */
  static calculateUserStats(
    user: User,
    userSnapshots: Snapshot[],
    userBridges: Bridge[],
    allBridges: Bridge[],
    allUsers: User[]
  ): UserStats {
    const bridgesCreated = userBridges.length;
    const snapshotsPosted = userSnapshots.length;
    
    // Calculate likes and saves received
    const likesReceived = userSnapshots.reduce((sum, snapshot) => sum + snapshot.likeCount, 0);
    const savesReceived = userSnapshots.reduce((sum, snapshot) => sum + snapshot.saveCount, 0);
    
    // Calculate likes and saves given (simplified for demo)
    const bridgesLiked = Math.floor(Math.random() * 50); // Demo data
    const bridgesSaved = Math.floor(Math.random() * 30); // Demo data
    
    // Calculate themes explored
    const themesExplored = [...new Set(userSnapshots.flatMap(s => s.themes))];
    
    // Calculate countries connected (simplified)
    const countriesConnected = [...new Set(
      allUsers
        .filter(u => u.id !== user.id)
        .map(u => u.city.split(',').pop()?.trim())
        .filter(Boolean)
    )];
    
    // Calculate streak (simplified for demo)
    const streakDays = this.calculateStreakDays(userSnapshots);
    
    // Calculate total points
    const totalPoints = this.calculateTotalPoints({
      bridgesCreated,
      snapshotsPosted,
      likesReceived,
      savesReceived,
      themesExplored: themesExplored.length,
      countriesConnected: countriesConnected.length,
      streakDays,
    });
    
    // Calculate level
    const level = Math.floor(totalPoints / 100) + 1;
    
    // Get badges and achievements
    const badges = this.calculateBadges({
      bridgesCreated,
      likesReceived,
      themesExplored: themesExplored.length,
      countriesConnected: countriesConnected.length,
      streakDays,
      userCreatedAt: user.createdAt,
    });
    
    const achievements = this.calculateAchievements({
      bridgesCreated,
      snapshotsPosted,
      bridgesLiked,
      bridgesSaved,
      themesExplored: themesExplored.length,
      countriesConnected: countriesConnected.length,
    });

    return {
      bridgesCreated,
      snapshotsPosted,
      likesReceived,
      savesReceived,
      bridgesLiked,
      bridgesSaved,
      themesExplored,
      countriesConnected,
      streakDays,
      lastActiveDate: new Date(),
      totalPoints,
      level,
      badges,
      achievements,
    };
  }

  /**
   * Calculate streak days
   */
  private static calculateStreakDays(snapshots: Snapshot[]): number {
    if (snapshots.length === 0) return 0;
    
    const sortedSnapshots = snapshots.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const snapshot of sortedSnapshots) {
      const snapshotDate = new Date(snapshot.createdAt);
      snapshotDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - snapshotDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  }

  /**
   * Calculate total points
   */
  private static calculateTotalPoints(stats: {
    bridgesCreated: number;
    snapshotsPosted: number;
    likesReceived: number;
    savesReceived: number;
    themesExplored: number;
    countriesConnected: number;
    streakDays: number;
  }): number {
    let points = 0;
    
    points += stats.bridgesCreated * 10;
    points += stats.snapshotsPosted * 5;
    points += stats.likesReceived * 2;
    points += stats.savesReceived * 3;
    points += stats.themesExplored * 15;
    points += stats.countriesConnected * 20;
    points += stats.streakDays * 5;
    
    return points;
  }

  /**
   * Calculate unlocked badges
   */
  private static calculateBadges(stats: {
    bridgesCreated: number;
    likesReceived: number;
    themesExplored: number;
    countriesConnected: number;
    streakDays: number;
    userCreatedAt: Date;
  }): Badge[] {
    const badges: Badge[] = [];
    
    for (const badgeTemplate of this.BADGES) {
      let unlocked = false;
      let progress = 0;
      let maxProgress = 1;
      
      switch (badgeTemplate.id) {
        case 'first_bridge':
          unlocked = stats.bridgesCreated >= 1;
          progress = Math.min(stats.bridgesCreated, 1);
          break;
        case 'bridge_master':
          unlocked = stats.bridgesCreated >= 10;
          progress = Math.min(stats.bridgesCreated, 10);
          maxProgress = 10;
          break;
        case 'cultural_architect':
          unlocked = stats.bridgesCreated >= 50;
          progress = Math.min(stats.bridgesCreated, 50);
          maxProgress = 50;
          break;
        case 'bridge_legend':
          unlocked = stats.bridgesCreated >= 100;
          progress = Math.min(stats.bridgesCreated, 100);
          maxProgress = 100;
          break;
        case 'first_like':
          unlocked = stats.likesReceived >= 1;
          progress = Math.min(stats.likesReceived, 1);
          break;
        case 'popular_creator':
          unlocked = stats.likesReceived >= 100;
          progress = Math.min(stats.likesReceived, 100);
          maxProgress = 100;
          break;
        case 'viral_sensation':
          unlocked = stats.likesReceived >= 1000;
          progress = Math.min(stats.likesReceived, 1000);
          maxProgress = 1000;
          break;
        case 'cultural_icon':
          unlocked = stats.likesReceived >= 10000;
          progress = Math.min(stats.likesReceived, 10000);
          maxProgress = 10000;
          break;
        case 'theme_explorer':
          unlocked = stats.themesExplored >= 5;
          progress = Math.min(stats.themesExplored, 5);
          maxProgress = 5;
          break;
        case 'cultural_nomad':
          unlocked = stats.countriesConnected >= 10;
          progress = Math.min(stats.countriesConnected, 10);
          maxProgress = 10;
          break;
        case 'global_citizen':
          unlocked = stats.countriesConnected >= 25;
          progress = Math.min(stats.countriesConnected, 25);
          maxProgress = 25;
          break;
        case 'world_bridge':
          unlocked = stats.countriesConnected >= 50;
          progress = Math.min(stats.countriesConnected, 50);
          maxProgress = 50;
          break;
        case 'early_adopter':
          const daysSinceCreation = (Date.now() - stats.userCreatedAt.getTime()) / (1000 * 60 * 60 * 24);
          unlocked = daysSinceCreation <= 7;
          break;
        case 'streak_master':
          unlocked = stats.streakDays >= 30;
          progress = Math.min(stats.streakDays, 30);
          maxProgress = 30;
          break;
        case 'cultural_ambassador':
          // Simplified - assume unlocked if user has many themes
          unlocked = stats.themesExplored >= 5;
          progress = Math.min(stats.themesExplored, 5);
          maxProgress = 5;
          break;
      }
      
      if (unlocked) {
        badges.push({
          ...badgeTemplate,
          unlockedAt: new Date(),
          progress,
          maxProgress,
        });
      } else if (progress > 0) {
        badges.push({
          ...badgeTemplate,
          progress,
          maxProgress,
        });
      }
    }
    
    return badges;
  }

  /**
   * Calculate unlocked achievements
   */
  private static calculateAchievements(stats: {
    bridgesCreated: number;
    snapshotsPosted: number;
    bridgesLiked: number;
    bridgesSaved: number;
    themesExplored: number;
    countriesConnected: number;
  }): Achievement[] {
    const achievements: Achievement[] = [];
    
    for (const achievementTemplate of this.ACHIEVEMENTS) {
      let unlocked = false;
      let progress = 0;
      let maxProgress = 1;
      
      switch (achievementTemplate.id) {
        case 'first_steps':
          unlocked = true; // Always unlocked after onboarding
          break;
        case 'content_creator':
          unlocked = stats.snapshotsPosted >= 1;
          progress = Math.min(stats.snapshotsPosted, 1);
          break;
        case 'bridge_builder':
          unlocked = stats.bridgesCreated >= 1;
          progress = Math.min(stats.bridgesCreated, 1);
          break;
        case 'social_butterfly':
          unlocked = stats.bridgesLiked >= 10;
          progress = Math.min(stats.bridgesLiked, 10);
          maxProgress = 10;
          break;
        case 'collector':
          unlocked = stats.bridgesSaved >= 20;
          progress = Math.min(stats.bridgesSaved, 20);
          maxProgress = 20;
          break;
        case 'explorer':
          unlocked = stats.themesExplored >= 6; // All available themes
          progress = Math.min(stats.themesExplored, 6);
          maxProgress = 6;
          break;
        case 'connector':
          unlocked = stats.countriesConnected >= 10;
          progress = Math.min(stats.countriesConnected, 10);
          maxProgress = 10;
          break;
        case 'cultural_expert':
          unlocked = stats.countriesConnected >= 5;
          progress = Math.min(stats.countriesConnected, 5);
          maxProgress = 5;
          break;
      }
      
      if (unlocked) {
        achievements.push({
          ...achievementTemplate,
          unlockedAt: new Date(),
          progress,
          maxProgress,
        });
      } else if (progress > 0) {
        achievements.push({
          ...achievementTemplate,
          progress,
          maxProgress,
        });
      }
    }
    
    return achievements;
  }

  /**
   * Get badge by ID
   */
  static getBadgeById(id: string): Badge | undefined {
    return this.BADGES.find(badge => badge.id === id) as Badge | undefined;
  }

  /**
   * Get achievement by ID
   */
  static getAchievementById(id: string): Achievement | undefined {
    return this.ACHIEVEMENTS.find(achievement => achievement.id === id) as Achievement | undefined;
  }

  /**
   * Get all available badges
   */
  static getAllBadges(): Omit<Badge, 'unlockedAt' | 'progress' | 'maxProgress'>[] {
    return [...this.BADGES];
  }

  /**
   * Get all available achievements
   */
  static getAllAchievements(): Omit<Achievement, 'unlockedAt' | 'progress' | 'maxProgress'>[] {
    return [...this.ACHIEVEMENTS];
  }

  /**
   * Get rarity color
   */
  static getRarityColor(rarity: Badge['rarity']): string {
    switch (rarity) {
      case 'common': return '#6B7280';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      default: return '#6B7280';
    }
  }

  /**
   * Get level title
   */
  static getLevelTitle(level: number): string {
    if (level >= 50) return 'Cultural Legend';
    if (level >= 25) return 'Bridge Master';
    if (level >= 15) return 'Cultural Ambassador';
    if (level >= 10) return 'Global Connector';
    if (level >= 5) return 'Bridge Builder';
    if (level >= 3) return 'Cultural Explorer';
    if (level >= 2) return 'Newcomer';
    return 'Beginner';
  }
}
