import { Bridge, Snapshot } from '@/lib/types';
import { AIMatchingService } from './ai-matching-service';

// In-memory storage for demo purposes
// In a real app, this would be Firebase Firestore
let bridges: Bridge[] = [];
let snapshots: Snapshot[] = [];

// Initialize with some placeholder data
const initializePlaceholderData = () => {
  if (bridges.length === 0) {
    // Create some initial snapshots
    const initialSnapshots: Snapshot[] = [
      {
        id: 'init_snapshot_1',
        userId: 'marco',
        mediaType: 'photo',
        mediaPath: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        text: 'Traditional Italian pasta making with my nonna - the secret is in the hand-rolled technique passed down for generations',
        themes: ['food'],
        locale: 'en',
        pendingMatch: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        likeCount: 5,
        saveCount: 2,
      },
      {
        id: 'init_snapshot_2',
        userId: 'carmen',
        mediaType: 'photo',
        mediaPath: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
        text: 'Learning flamenco guitar in Seville - the passion and rhythm that connects generations',
        themes: ['music'],
        locale: 'en',
        pendingMatch: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        likeCount: 8,
        saveCount: 3,
      }
    ];

    // Create initial bridge
    const initialBridge: Bridge = {
      id: 'init_bridge_1',
      leftSnapshotId: initialSnapshots[0].id,
      rightSnapshotId: initialSnapshots[1].id,
      themes: ['food', 'music'],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      metrics: {
        views: 15,
        likes: 7,
      },
    };

    snapshots.push(...initialSnapshots);
    bridges.push(initialBridge);
  }
};

// Initialize on first load
initializePlaceholderData();

export class BridgeService {
  static async createSnapshot(snapshotData: Omit<Snapshot, 'id' | 'createdAt' | 'likeCount' | 'saveCount'>): Promise<Snapshot> {
    const snapshot: Snapshot = {
      ...snapshotData,
      id: `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      likeCount: 0,
      saveCount: 0,
    };
    
    snapshots.push(snapshot);
    return snapshot;
  }

  static async createBridge(leftSnapshotId: string, rightSnapshotId: string, themes: string[]): Promise<Bridge> {
    const bridge: Bridge = {
      id: `bridge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      leftSnapshotId,
      rightSnapshotId,
      themes,
      createdAt: new Date(),
      metrics: {
        views: 0,
        likes: 0,
      },
    };
    
    bridges.push(bridge);
    return bridge;
  }

  static async getAllBridges(): Promise<Bridge[]> {
    return [...bridges].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static async getBridgeById(id: string): Promise<Bridge | null> {
    return bridges.find(bridge => bridge.id === id) || null;
  }

  static async getSnapshotById(id: string): Promise<Snapshot | null> {
    return snapshots.find(snapshot => snapshot.id === id) || null;
  }

  static async getBridgesWithSnapshots(): Promise<Array<Bridge & { 
    leftSnapshot: Snapshot; 
    rightSnapshot: Snapshot; 
  }>> {
    const bridgesWithSnapshots = await Promise.all(
      bridges.map(async (bridge) => {
        const leftSnapshot = await this.getSnapshotById(bridge.leftSnapshotId);
        const rightSnapshot = await this.getSnapshotById(bridge.rightSnapshotId);
        
        if (!leftSnapshot || !rightSnapshot) {
          return null;
        }
        
        return {
          ...bridge,
          leftSnapshot,
          rightSnapshot,
        };
      })
    );
    
    return bridgesWithSnapshots.filter(Boolean) as Array<Bridge & { 
      leftSnapshot: Snapshot; 
      rightSnapshot: Snapshot; 
    }>;
  }

  static async simulateAIMatching(snapshot: Snapshot): Promise<Snapshot | null> {
    try {
      // Use AI to find the best matching placeholder bridge
      const matchedBridge = await AIMatchingService.findBestMatch(snapshot);
      
      if (!matchedBridge) {
        return null;
      }
      
      // Create a snapshot from the matched placeholder bridge
      const matchingSnapshot: Snapshot = {
        id: `snapshot_match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: matchedBridge.user.displayName.toLowerCase().replace(' ', '_'),
        mediaType: 'photo',
        mediaPath: matchedBridge.mediaPath,
        text: matchedBridge.description,
        themes: matchedBridge.themes,
        locale: 'en',
        pendingMatch: false,
        createdAt: new Date(),
        likeCount: 0,
        saveCount: 0,
      };
      
      snapshots.push(matchingSnapshot);
      return matchingSnapshot;
    } catch (error) {
      console.error('Error in AI matching:', error);
      // Fallback to random placeholder
      const placeholderBridges = AIMatchingService.getAllPlaceholderBridges();
      const randomBridge = placeholderBridges[Math.floor(Math.random() * placeholderBridges.length)];
      
      const fallbackSnapshot: Snapshot = {
        id: `snapshot_fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: randomBridge.user.displayName.toLowerCase().replace(' ', '_'),
        mediaType: 'photo',
        mediaPath: randomBridge.mediaPath,
        text: randomBridge.description,
        themes: randomBridge.themes,
        locale: 'en',
        pendingMatch: false,
        createdAt: new Date(),
        likeCount: 0,
        saveCount: 0,
      };
      
      snapshots.push(fallbackSnapshot);
      return fallbackSnapshot;
    }
  }

  static async createBridgeFromSnapshot(snapshot: Snapshot): Promise<Bridge | null> {
    try {
      // Find a matching snapshot using AI
      const matchingSnapshot = await this.simulateAIMatching(snapshot);
      
      if (!matchingSnapshot) {
        return null;
      }
      
      // Create the bridge
      const bridge = await this.createBridge(
        snapshot.id,
        matchingSnapshot.id,
        snapshot.themes
      );
      
      return bridge;
    } catch (error) {
      console.error('Error creating bridge from snapshot:', error);
      return null;
    }
  }
}
