import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc,
  updateDoc,
  increment,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Like, Save } from '@/lib/types';

export class InteractionService {
  /**
   * Like or unlike a snapshot or bridge
   */
  static async toggleLike(
    userId: string, 
    targetType: 'snapshot' | 'bridge', 
    targetId: string
  ): Promise<{ liked: boolean; likeId?: string }> {
    try {
      // Check if already liked
      const likesRef = collection(db, 'likes');
      const q = query(
        likesRef,
        where('userId', '==', userId),
        where('targetType', '==', targetType),
        where('targetId', '==', targetId)
      );

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Unlike - delete the like document
        const likeDoc = querySnapshot.docs[0];
        await deleteDoc(likeDoc.ref);
        
        // Decrement like count
        await updateDoc(doc(db, targetType + 's', targetId), {
          likeCount: increment(-1)
        });

        return { liked: false };
      } else {
        // Like - create new like document
        const likeData = {
          userId,
          targetType,
          targetId,
          createdAt: Timestamp.now(),
        };

        const likeRef = await addDoc(likesRef, likeData);
        
        // Increment like count
        await updateDoc(doc(db, targetType + 's', targetId), {
          likeCount: increment(1)
        });

        return { liked: true, likeId: likeRef.id };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return { liked: false };
    }
  }

  /**
   * Save or unsave a snapshot or bridge
   */
  static async toggleSave(
    userId: string, 
    targetType: 'snapshot' | 'bridge', 
    targetId: string
  ): Promise<{ saved: boolean; saveId?: string }> {
    try {
      // Check if already saved
      const savesRef = collection(db, 'saves');
      const q = query(
        savesRef,
        where('userId', '==', userId),
        where('targetType', '==', targetType),
        where('targetId', '==', targetId)
      );

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Unsave - delete the save document
        const saveDoc = querySnapshot.docs[0];
        await deleteDoc(saveDoc.ref);
        
        // Decrement save count
        await updateDoc(doc(db, targetType + 's', targetId), {
          saveCount: increment(-1)
        });

        return { saved: false };
      } else {
        // Save - create new save document
        const saveData = {
          userId,
          targetType,
          targetId,
          createdAt: Timestamp.now(),
        };

        const saveRef = await addDoc(savesRef, saveData);
        
        // Increment save count
        await updateDoc(doc(db, targetType + 's', targetId), {
          saveCount: increment(1)
        });

        return { saved: true, saveId: saveRef.id };
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      return { saved: false };
    }
  }

  /**
   * Check if user has liked a target
   */
  static async isLiked(
    userId: string, 
    targetType: 'snapshot' | 'bridge', 
    targetId: string
  ): Promise<boolean> {
    try {
      const likesRef = collection(db, 'likes');
      const q = query(
        likesRef,
        where('userId', '==', userId),
        where('targetType', '==', targetType),
        where('targetId', '==', targetId)
      );

      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  }

  /**
   * Check if user has saved a target
   */
  static async isSaved(
    userId: string, 
    targetType: 'snapshot' | 'bridge', 
    targetId: string
  ): Promise<boolean> {
    try {
      const savesRef = collection(db, 'saves');
      const q = query(
        savesRef,
        where('userId', '==', userId),
        where('targetType', '==', targetType),
        where('targetId', '==', targetId)
      );

      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking save status:', error);
      return false;
    }
  }

  /**
   * Get user's saved items
   */
  static async getSavedItems(
    userId: string, 
    targetType: 'snapshot' | 'bridge'
  ): Promise<Save[]> {
    try {
      const savesRef = collection(db, 'saves');
      const q = query(
        savesRef,
        where('userId', '==', userId),
        where('targetType', '==', targetType),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Save));
    } catch (error) {
      console.error('Error getting saved items:', error);
      return [];
    }
  }
}
