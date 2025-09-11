export interface User {
  id: string;
  displayName: string;
  photoURL?: string | null;
  city: string;
  themes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Snapshot {
  id: string;
  userId: string;
  mediaType: 'photo' | 'audio';
  mediaPath: string;
  text: string;
  themes: string[];
  locale: string;
  pendingMatch: boolean;
  createdAt: Date;
  likeCount: number;
  saveCount: number;
}

export interface Bridge {
  id: string;
  leftSnapshotId: string;
  rightSnapshotId: string;
  themes: string[];
  createdAt: Date;
  metrics: {
    views: number;
    likes: number;
  };
}

export interface Like {
  id: string;
  userId: string;
  targetType: 'snapshot' | 'bridge';
  targetId: string;
  createdAt: Date;
}

export interface Save {
  id: string;
  userId: string;
  targetType: 'snapshot' | 'bridge';
  targetId: string;
  createdAt: Date;
}