# 🌉 BridgeUp

**BridgeUp** creates small, meaningful bridges between people through quick cultural snapshots and tiny skill swaps. The app feels like a modern social product with the polish and restraint of Instagram/Threads/BeReal.

## ✨ Features

- **Bridge Cards**: Paired posts between two people about the same theme
- **Snap → Pair Flow**: Post a snapshot, get matched with someone else's related content
- **Smart Matching**: Auto-matches snapshots based on shared themes and interests
- **Light Social**: Like, save, and share bridges without the noise
- **Clean UI**: Large media, simple navigation, generous whitespace
- **Accessibility First**: Large tap targets, proper roles, dynamic type support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Expo CLI (`npm install -g @expo/cli`)
- Firebase project (for full functionality)

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd bridgeup
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **View on your device:**
   - Install Expo Go on your iPhone/Android
   - Scan the QR code from the terminal
   - Or press `w` to open in web browser

### Firebase Setup (Optional)

For full functionality including real-time data and user authentication:

1. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com)

2. **Enable services:**
   - Authentication (Email/Password, Google, Apple)
   - Firestore Database
   - Storage

3. **Add your config:**
   ```bash
   # Create .env file
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Seed demo data:**
   ```bash
   npm run seed
   ```

## 📱 App Structure

### Screens

- **Today**: Feed of latest Bridge Cards with theme filters
- **Create**: 3-step flow (Theme → Media → Preview → Post)
- **Bridges**: Your created bridges and saved content
- **Profile**: User settings, stats, and preferences

### Core Components

- `CardBridge`: Displays paired snapshots with actions
- `ThemeChip`: Interactive theme selection
- `Avatar`: User profile images
- `Button`: Primary and ghost button variants

### Services

- `MatchingService`: Auto-matches snapshots based on themes
- `InteractionService`: Handles likes, saves, and interactions
- `AuthService`: User authentication and profile management

## 🎨 Design System

### Colors
- Primary: `#6366F1` (Indigo)
- Background: `#FEFEFE` (Near white)
- Surface: `#FFFFFF` (Pure white)
- Text: Grayscale hierarchy

### Typography
- Font: Inter (Regular, Medium, SemiBold, Bold)
- Scale: 12px → 28px
- Line height: 1.4x for body text

### Spacing
- Scale: 4, 8, 12, 16, 24, 32px
- Consistent 8-point grid system

### Components
- Border radius: 8px (small), 12px (medium), 16px (large)
- Shadows: Single elevation style across app
- Buttons: Filled primary + ghost secondary only

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start Expo development server
npm run build:web    # Build for web
npm run lint         # Run ESLint
npm run seed         # Seed Firebase with demo data
```

### Project Structure

```
bridgeup/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Bottom tab navigation
│   │   ├── index.tsx      # Today screen
│   │   ├── create.tsx     # Create flow
│   │   ├── bridges.tsx    # User bridges
│   │   └── profile.tsx    # Profile settings
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── cards/            # Card components
│   └── ui/               # Basic UI elements
├── lib/                  # Core utilities
│   ├── firebase.ts       # Firebase configuration
│   ├── types.ts          # TypeScript definitions
│   └── services/         # Business logic
├── constants/            # App constants
└── scripts/              # Utility scripts
```

## 🏆 Hackathon Features

This app is optimized for hackathon demos with:

- **Polished UI**: No "AI-generated" look, real social app feel
- **Real Data**: Seed script creates realistic demo content
- **Smooth Interactions**: Haptic feedback, optimistic UI updates
- **Complete Flow**: End-to-end user journey from creation to matching
- **Performance**: Lazy loading, efficient rendering, cached images

## 🚀 Deployment

### Expo Application Services (EAS)

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure project
eas build:configure

# Build for production
eas build --platform ios
eas build --platform android
```

### Web Deployment

```bash
npm run build:web
# Deploy the 'dist' folder to your hosting service
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ for meaningful human connections**
