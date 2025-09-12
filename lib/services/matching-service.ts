import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Snapshot, Bridge } from '@/lib/types';

export class MatchingService {
  /**
   * Find a matching snapshot for the given snapshot
   * Matches based on shared themes and different users
   */
  static async findMatch(snapshot: Snapshot): Promise<Snapshot | null> {
    try {
      // Query for snapshots with at least one shared theme, different user, and pending match
      const snapshotsRef = collection(db, 'snapshots');
      const q = query(
        snapshotsRef,
        where('pendingMatch', '==', true),
        where('userId', '!=', snapshot.userId),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      
      // Find the best match based on shared themes
      let bestMatch: Snapshot | null = null;
      let maxSharedThemes = 0;

      querySnapshot.forEach((doc) => {
        const candidateSnapshot = { id: doc.id, ...doc.data() } as Snapshot;
        const sharedThemes = snapshot.themes.filter(theme => 
          candidateSnapshot.themes.includes(theme)
        );

        if (sharedThemes.length > maxSharedThemes) {
          maxSharedThemes = sharedThemes.length;
          bestMatch = candidateSnapshot;
        }
      });

      return bestMatch;
    } catch (error) {
      console.error('Error finding match:', error);
      return null;
    }
  }

  /**
   * Create a bridge between two snapshots
   */
  static async createBridge(
    leftSnapshotId: string, 
    rightSnapshotId: string, 
    themes: string[]
  ): Promise<string | null> {
    try {
      const bridgeData = {
        leftSnapshotId,
        rightSnapshotId,
        themes,
        createdAt: Timestamp.now(),
        metrics: {
          views: 0,
          likes: 0,
        },
      };

      const docRef = await addDoc(collection(db, 'bridges'), bridgeData);
      
      // Update both snapshots to mark them as matched
      await updateDoc(doc(db, 'snapshots', leftSnapshotId), {
        pendingMatch: false,
      });
      
      await updateDoc(doc(db, 'snapshots', rightSnapshotId), {
        pendingMatch: false,
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating bridge:', error);
      return null;
    }
  }

  /**
   * Process a new snapshot for matching
   */
  static async processSnapshot(snapshot: Snapshot): Promise<{ matched: boolean; bridgeId?: string }> {
    try {
      // First, try to find a match
      const match = await this.findMatch(snapshot);
      
      if (match) {
        // Create a bridge
        const sharedThemes = snapshot.themes.filter(theme => 
          match.themes.includes(theme)
        );
        
        const bridgeId = await this.createBridge(
          snapshot.id,
          match.id,
          sharedThemes
        );

        if (bridgeId) {
          return { matched: true, bridgeId };
        }
      }

      // If no match found, mark as pending
      await updateDoc(doc(db, 'snapshots', snapshot.id), {
        pendingMatch: true,
      });

      return { matched: false };
    } catch (error) {
      console.error('Error processing snapshot:', error);
      return { matched: false };
    }
  }

  /**
   * Get pending matches for a user
   */
  static async getPendingMatches(userId: string): Promise<Snapshot[]> {
    try {
      const snapshotsRef = collection(db, 'snapshots');
      const q = query(
        snapshotsRef,
        where('userId', '==', userId),
        where('pendingMatch', '==', true),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Snapshot));
    } catch (error) {
      console.error('Error getting pending matches:', error);
      return [];
    }
  }

  /**
   * Retry matching for pending snapshots
   */
  static async retryMatching(): Promise<void> {
    try {
      const snapshotsRef = collection(db, 'snapshots');
      const q = query(
        snapshotsRef,
        where('pendingMatch', '==', true),
        orderBy('createdAt', 'asc'),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      
      for (const docSnapshot of querySnapshot.docs) {
        const snapshot = { id: docSnapshot.id, ...docSnapshot.data() } as Snapshot;
        await this.processSnapshot(snapshot);
      }
    } catch (error) {
      console.error('Error retrying matching:', error);
    }
  }
}
