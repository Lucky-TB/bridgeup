import { Bridge, Snapshot } from '@/lib/types';

// In-memory storage for demo purposes
// In a real app, this would be Firebase Firestore
let bridges: Bridge[] = [];
let snapshots: Snapshot[] = [];

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
    // Simulate AI finding a matching snapshot
    // In a real app, this would use AI matching service
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
    
    // For demo, create a mock matching snapshot
    const mockMatchingSnapshot: Snapshot = {
      id: `snapshot_match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: 'mock_user_id',
      mediaType: 'photo',
      mediaPath: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
      text: 'A matching cultural moment from someone else',
      themes: snapshot.themes,
      locale: 'en',
      pendingMatch: false,
      createdAt: new Date(),
      likeCount: 0,
      saveCount: 0,
    };
    
    snapshots.push(mockMatchingSnapshot);
    return mockMatchingSnapshot;
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
