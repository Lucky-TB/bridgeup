import { 
  collection, 
  addDoc, 
  doc, 
  setDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Snapshot, Bridge } from '@/lib/types';

// Seed users - 25 diverse profiles for hackathon demo
const seedUsers: Omit<User, 'id'>[] = [
  {
    displayName: 'Maria Rodriguez',
    photoURL: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    city: 'Rome, Italy',
    themes: ['food', 'places', 'language'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Alex Chen',
    photoURL: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?w=150',
    city: 'Bangkok, Thailand',
    themes: ['food', 'music', 'skills'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Jordan Smith',
    photoURL: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=150',
    city: 'London, UK',
    themes: ['music', 'study', 'places'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Sam Wilson',
    photoURL: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150',
    city: 'New York, USA',
    themes: ['music', 'skills', 'language'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Emma Davis',
    photoURL: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150',
    city: 'Paris, France',
    themes: ['food', 'places', 'study'],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Liam Johnson',
    photoURL: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=150',
    city: 'Tokyo, Japan',
    themes: ['skills', 'language', 'study'],
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Priya Patel',
    photoURL: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150',
    city: 'Mumbai, India',
    themes: ['food', 'music', 'places'],
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Ahmed Hassan',
    photoURL: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=150',
    city: 'Cairo, Egypt',
    themes: ['places', 'language', 'study'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Sofia Andersson',
    photoURL: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150',
    city: 'Stockholm, Sweden',
    themes: ['music', 'skills', 'places'],
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Carlos Mendez',
    photoURL: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    city: 'Mexico City, Mexico',
    themes: ['food', 'music', 'language'],
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Yuki Tanaka',
    photoURL: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=150',
    city: 'Osaka, Japan',
    themes: ['food', 'places', 'skills'],
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Isabella Silva',
    photoURL: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150',
    city: 'São Paulo, Brazil',
    themes: ['music', 'food', 'places'],
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Mohammed Al-Rashid',
    photoURL: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=150',
    city: 'Dubai, UAE',
    themes: ['places', 'skills', 'language'],
    createdAt: new Date('2024-03-25'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Anna Kowalski',
    photoURL: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150',
    city: 'Warsaw, Poland',
    themes: ['study', 'music', 'language'],
    createdAt: new Date('2024-03-30'),
    updatedAt: new Date(),
  },
  {
    displayName: 'David Kim',
    photoURL: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    city: 'Seoul, South Korea',
    themes: ['music', 'skills', 'study'],
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Fatima Al-Zahra',
    photoURL: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150',
    city: 'Marrakech, Morocco',
    themes: ['food', 'places', 'language'],
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date(),
  },
  {
    displayName: 'James O\'Connor',
    photoURL: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=150',
    city: 'Dublin, Ireland',
    themes: ['music', 'places', 'language'],
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Nina Petrov',
    photoURL: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=150',
    city: 'Moscow, Russia',
    themes: ['study', 'music', 'skills'],
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Hassan Ali',
    photoURL: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150',
    city: 'Istanbul, Turkey',
    themes: ['food', 'places', 'music'],
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Lisa Wang',
    photoURL: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    city: 'Shanghai, China',
    themes: ['language', 'study', 'skills'],
    createdAt: new Date('2024-04-25'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Diego Rodriguez',
    photoURL: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150',
    city: 'Buenos Aires, Argentina',
    themes: ['music', 'food', 'places'],
    createdAt: new Date('2024-04-30'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Aisha Mohammed',
    photoURL: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=150',
    city: 'Lagos, Nigeria',
    themes: ['music', 'language', 'places'],
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Klaus Mueller',
    photoURL: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=150',
    city: 'Berlin, Germany',
    themes: ['study', 'skills', 'music'],
    createdAt: new Date('2024-05-05'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Rosa Martinez',
    photoURL: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150',
    city: 'Barcelona, Spain',
    themes: ['food', 'places', 'music'],
    createdAt: new Date('2024-05-10'),
    updatedAt: new Date(),
  },
  {
    displayName: 'Takeshi Yamamoto',
    photoURL: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    city: 'Kyoto, Japan',
    themes: ['places', 'language', 'study'],
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date(),
  },
];

// Seed snapshots
const seedSnapshots: Omit<Snapshot, 'id'>[] = [
  {
    userId: 'user1',
    mediaType: 'photo',
    mediaPath: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    text: 'My grandmother\'s secret pasta recipe - been in our family for generations',
    themes: ['food'],
    locale: 'en-US',
    pendingMatch: false,
    createdAt: new Date('2024-02-25T10:00:00Z'),
    likeCount: 12,
    saveCount: 3,
  },
  {
    userId: 'user2',
    mediaType: 'photo',
    mediaPath: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    text: 'Street food from Bangkok that changed my perspective on flavors',
    themes: ['food'],
    locale: 'en-US',
    pendingMatch: false,
    createdAt: new Date('2024-02-25T11:30:00Z'),
    likeCount: 8,
    saveCount: 2,
  },
  {
    userId: 'user3',
    mediaType: 'photo',
    mediaPath: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
    text: 'Learning guitar during lockdown - this song got me through tough times',
    themes: ['music'],
    locale: 'en-US',
    pendingMatch: false,
    createdAt: new Date('2024-02-26T14:20:00Z'),
    likeCount: 15,
    saveCount: 4,
  },
  {
    userId: 'user4',
    mediaType: 'photo',
    mediaPath: 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg',
    text: 'Jazz improvisation session - finding my voice through music',
    themes: ['music'],
    locale: 'en-US',
    pendingMatch: false,
    createdAt: new Date('2024-02-26T16:45:00Z'),
    likeCount: 9,
    saveCount: 1,
  },
  {
    userId: 'user5',
    mediaType: 'photo',
    mediaPath: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    text: 'Café culture in Paris - there\'s something magical about morning coffee here',
    themes: ['food', 'places'],
    locale: 'en-US',
    pendingMatch: false,
    createdAt: new Date('2024-02-27T08:15:00Z'),
    likeCount: 6,
    saveCount: 2,
  },
  {
    userId: 'user6',
    mediaType: 'photo',
    mediaPath: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    text: 'Tokyo\'s hidden coffee shops - each one tells a different story',
    themes: ['food', 'places'],
    locale: 'en-US',
    pendingMatch: false,
    createdAt: new Date('2024-02-27T09:30:00Z'),
    likeCount: 11,
    saveCount: 3,
  },
  {
    userId: 'user1',
    mediaType: 'photo',
    mediaPath: 'https://images.pexels.com/photos/1591055/pexels-photo-1591055.jpeg',
    text: 'Studying Italian - every word feels like discovering a new world',
    themes: ['language', 'study'],
    locale: 'en-US',
    pendingMatch: false,
    createdAt: new Date('2024-02-28T13:00:00Z'),
    likeCount: 7,
    saveCount: 1,
  },
  {
    userId: 'user6',
    mediaType: 'photo',
    mediaPath: 'https://images.pexels.com/photos/1591055/pexels-photo-1591055.jpeg',
    text: 'Learning Japanese - the characters are like beautiful art',
    themes: ['language', 'study'],
    locale: 'en-US',
    pendingMatch: false,
    createdAt: new Date('2024-02-28T14:15:00Z'),
    likeCount: 5,
    saveCount: 2,
  },
];

// Seed bridges
const seedBridges: Omit<Bridge, 'id'>[] = [
  {
    leftSnapshotId: 'snapshot1',
    rightSnapshotId: 'snapshot2',
    themes: ['food'],
    createdAt: new Date('2024-02-25T12:00:00Z'),
    metrics: { views: 24, likes: 8 },
  },
  {
    leftSnapshotId: 'snapshot3',
    rightSnapshotId: 'snapshot4',
    themes: ['music'],
    createdAt: new Date('2024-02-26T17:00:00Z'),
    metrics: { views: 18, likes: 6 },
  },
  {
    leftSnapshotId: 'snapshot5',
    rightSnapshotId: 'snapshot6',
    themes: ['food', 'places'],
    createdAt: new Date('2024-02-27T10:00:00Z'),
    metrics: { views: 15, likes: 4 },
  },
  {
    leftSnapshotId: 'snapshot7',
    rightSnapshotId: 'snapshot8',
    themes: ['language', 'study'],
    createdAt: new Date('2024-02-28T15:00:00Z'),
    metrics: { views: 12, likes: 3 },
  },
];

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Add users
    const userIds: string[] = [];
    for (const user of seedUsers) {
      const userRef = await addDoc(collection(db, 'users'), {
        ...user,
        createdAt: Timestamp.fromDate(user.createdAt),
        updatedAt: Timestamp.fromDate(user.updatedAt),
      });
      userIds.push(userRef.id);
      console.log(`✅ Added user: ${user.displayName}`);
    }

    // Add snapshots
    const snapshotIds: string[] = [];
    for (let i = 0; i < seedSnapshots.length; i++) {
      const snapshot = seedSnapshots[i];
      const snapshotRef = await addDoc(collection(db, 'snapshots'), {
        ...snapshot,
        userId: userIds[i % userIds.length], // Distribute among users
        createdAt: Timestamp.fromDate(snapshot.createdAt),
      });
      snapshotIds.push(snapshotRef.id);
      console.log(`✅ Added snapshot: ${snapshot.text.substring(0, 50)}...`);
    }

    // Add bridges
    for (let i = 0; i < seedBridges.length; i++) {
      const bridge = seedBridges[i];
      const bridgeRef = await addDoc(collection(db, 'bridges'), {
        ...bridge,
        leftSnapshotId: snapshotIds[i * 2],
        rightSnapshotId: snapshotIds[i * 2 + 1],
        createdAt: Timestamp.fromDate(bridge.createdAt),
      });
      console.log(`✅ Added bridge: ${bridge.themes.join(', ')}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Added ${userIds.length} users, ${snapshotIds.length} snapshots, ${seedBridges.length} bridges`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
