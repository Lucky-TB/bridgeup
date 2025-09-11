import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Snapshot, Bridge, Like, Save } from '@/lib/types';

export class FirebaseService {
  // Snapshot operations
  static async createSnapshot(
    userId: string, 
    mediaBlob: Blob, 
    text: string, 
    themes: string[], 
    mediaType: 'photo' | 'audio'
  ) {
    try {
      // Upload media to Storage
      const fileName = `${Date.now()}.${mediaType === 'photo' ? 'jpg' : 'm4a'}`;
      const mediaRef = ref(storage, `snapshots/${userId}/${fileName}`);
      await uploadBytes(mediaRef, mediaBlob);
      const mediaPath = await getDownloadURL(mediaRef);

      // Create snapshot document
      const snapshotData = {
        userId,
        mediaType,
        mediaPath,
        text,
        themes,
        locale: 'en-US',
        pendingMatch: true,
        createdAt: serverTimestamp(),
        likeCount: 0,
        saveCount: 0,
      };

      const docRef = await addDoc(collection(db, 'snapshots'), snapshotData);
      
      // Try to find a match
      await this.tryAutoMatch(docRef.id, userId, themes);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating snapshot:', error);
      throw error;
    }
  }

  static async tryAutoMatch(snapshotId: string, userId: string, themes: string[]) {
    try {
      const q = query(
        collection(db, 'snapshots'),
        where('pendingMatch', '==', true),
        where('userId', '!=', userId),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      
      for (const doc of querySnapshot.docs) {
        const snapshot = doc.data() as Snapshot;
        const hasCommonTheme = snapshot.themes.some(theme => themes.includes(theme));
        
        if (hasCommonTheme) {
          // Create bridge
          await this.createBridge(snapshotId, doc.id, themes);
          
          // Mark both snapshots as matched
          await updateDoc(doc.ref, { pendingMatch: false });
          await updateDoc(doc(db, 'snapshots', snapshotId), { pendingMatch: false });
          
          break;
        }
      }
    } catch (error) {
      console.error('Error auto-matching:', error);
    }
  }

  static async createBridge(leftSnapshotId: string, rightSnapshotId: string, themes: string[]) {
    try {
      const bridgeData = {
        leftSnapshotId,
        rightSnapshotId,
        themes,
        createdAt: serverTimestamp(),
        metrics: {
          views: 0,
          likes: 0,
        },
      };

      const docRef = await addDoc(collection(db, 'bridges'), bridgeData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating bridge:', error);
      throw error;
    }
  }

  // Like/Save operations
  static async toggleLike(
    userId: string, 
    targetType: 'snapshot' | 'bridge', 
    targetId: string
  ) {
    try {
      const likesQuery = query(
        collection(db, 'likes'),
        where('userId', '==', userId),
        where('targetType', '==', targetType),
        where('targetId', '==', targetId)
      );

      const existingLikes = await getDocs(likesQuery);
      
      if (existingLikes.empty) {
        // Add like
        await addDoc(collection(db, 'likes'), {
          userId,
          targetType,
          targetId,
          createdAt: serverTimestamp(),
        });

        // Increment count
        const targetCollection = targetType === 'snapshot' ? 'snapshots' : 'bridges';
        const countField = targetType === 'snapshot' ? 'likeCount' : 'metrics.likes';
        await updateDoc(doc(db, targetCollection, targetId), {
          [countField]: increment(1)
        });

        return true; // liked
      } else {
        // Remove like
        existingLikes.forEach(async (likeDoc) => {
          await likeDoc.ref.delete();
        });

        // Decrement count
        const targetCollection = targetType === 'snapshot' ? 'snapshots' : 'bridges';
        const countField = targetType === 'snapshot' ? 'likeCount' : 'metrics.likes';
        await updateDoc(doc(db, targetCollection, targetId), {
          [countField]: increment(-1)
        });

        return false; // unliked
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  static async toggleSave(
    userId: string,
    targetType: 'snapshot' | 'bridge',
    targetId: string
  ) {
    try {
      const savesQuery = query(
        collection(db, 'saves'),
        where('userId', '==', userId),
        where('targetType', '==', targetType),
        where('targetId', '==', targetId)
      );

      const existingSaves = await getDocs(savesQuery);

      if (existingSaves.empty) {
        // Add save
        await addDoc(collection(db, 'saves'), {
          userId,
          targetType,
          targetId,
          createdAt: serverTimestamp(),
        });

        // Increment count for snapshots only
        if (targetType === 'snapshot') {
          await updateDoc(doc(db, 'snapshots', targetId), {
            saveCount: increment(1)
          });
        }

        return true; // saved
      } else {
        // Remove save
        existingSaves.forEach(async (saveDoc) => {
          await saveDoc.ref.delete();
        });

        // Decrement count for snapshots only
        if (targetType === 'snapshot') {
          await updateDoc(doc(db, 'snapshots', targetId), {
            saveCount: increment(-1)
          });
        }

        return false; // unsaved
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      throw error;
    }
  }

  // Real-time listeners
  static subscribeToBridges(callback: (bridges: Bridge[]) => void) {
    const q = query(
      collection(db, 'bridges'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const bridges = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Bridge[];
      callback(bridges);
    });
  }

  static subscribeToUserBridges(userId: string, callback: (bridges: Bridge[]) => void) {
    // This would require a more complex query in a real app
    // For now, we'll implement a simple version
    return this.subscribeToBridges(callback);
  }
}