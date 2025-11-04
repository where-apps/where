# Overview

Where is a cross-platform mobile application that provides users with transparent, community-driven insights about specific locations worldwide. The app enables users to discover, rate, and share information about places through a collaborative platform built with React Native for mobile (iOS/Android) and web.

The application combines location-based services with decentralized storage (Sia/S5 network) to create a community-powered location discovery and review platform. Users can add locations, upload images, rate various aspects of places, leave comments, and earn points for contributions.

# Recent Changes (November 2025)

## Critical Bug Fixes for Mobile App Crashes

Fixed several issues that were causing the Android APK to crash immediately after installation:

1. **Route Naming Issues** - Renamed files to match Expo Router conventions:
   - `my-location.tsx` → `my-locations.tsx`
   - `setting.tsx` → `settings.tsx`  
   - `+notfound.tsx` → `notfound.tsx` (removed invalid '+' prefix)

2. **Android Permissions** - Added missing permissions in `app.json`:
   - Location permissions (ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION)
   - Camera and storage permissions (CAMERA, READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE)

3. **iOS Permissions** - Added Info.plist descriptions:
   - NSLocationWhenInUseUsageDescription
   - NSPhotoLibraryUsageDescription
   - NSCameraUsageDescription

4. **Package Updates** - Updated all Expo packages to SDK 53 compatible versions:
   - expo: ~53.0.23
   - expo-router: ~5.1.7
   - react-native: 0.79.6 (updated from 0.79.5 to match Expo SDK 53 requirement)
   - Removed `@expo/config-plugins` from devDependencies (should only come from expo package)
   - All other expo-* packages updated to match SDK 53 requirements

5. **Stability Improvements**:
   - Disabled `newArchEnabled` in app.json (was causing compatibility issues)
   - Fixed @expo/config-plugins version mismatch (10.0.1 → ~10.1.1)
   - Added expo-location plugin configuration

These fixes resolve the immediate crash on app startup. The app should now build and run successfully on both iOS and Android devices.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React Native with Expo (~53.x SDK)
- Cross-platform codebase for iOS, Android, and web
- Expo Router for file-based navigation
- Platform-specific code splitting (`.native.tsx`, `.web.tsx`)

**State Management**: Zustand with persistence
- `auth-store`: User authentication, Supabase sessions, anonymous/guest modes
- `locations-store`: Location data, ratings, comments, contributions
- `points-store`: Gamification system, user activities, image likes
- `referral-store`: Referral code generation and tracking
- `theme-store`: Light/dark/system theme management
- All stores persist to AsyncStorage for offline capability

**UI/Theming**:
- Custom color system with light/dark modes
- Lucide React Native icons
- Linear gradients for visual polish
- Platform-aware components (web vs native implementations)

**Map Integration**:
- Native: `react-native-maps` for iOS/Android
- Web: Leaflet for browser-based mapping
- Conditional imports based on Platform.OS

## Backend Architecture

**Framework**: Hono (lightweight Node.js framework)
- Deployed on Render (https://where-1.onrender.com)
- TypeScript with ESNext modules
- CORS-enabled for cross-platform access

**API Layer**: tRPC
- Type-safe API with `@trpc/server` and `@hono/trpc-server`
- SuperJSON transformer for advanced data types
- Client-side hooks via `@tanstack/react-query`
- Modular router structure (`/backend/trpc/routes/`)

**File Upload Endpoint**: `/s5/upload`
- Proxies uploads to S5 decentralized storage
- Uses S5 admin API key for authorization
- Returns CID (Content Identifier) for uploaded files

## Authentication System

**Provider**: Supabase Auth
- Base URL: `https://otbvkfzpcxzrcikwysrk.supabase.co`
- Multiple authentication methods:
  - Google OAuth (native and web)
  - Farcaster (web-only)
  - Email/password (planned)
  - Anonymous/guest mode
- Session management with access/refresh tokens
- User metadata stored in Supabase backend

**User System**:
- Points-based gamification for contributions
- Profile images uploaded to S5
- Referral system with unique codes
- Multiple authentication states (anonymous, authenticated, guest)

## Data Storage Solutions

**Decentralized Storage**: Sia S5 Network
- Images stored on S5 nodes with CID-based addressing
- Gateway URL pattern: `{S5_BASE_URL}/s5/gateway/{cid}`
- Admin API key required for uploads
- Retry queue for failed uploads (persisted to AsyncStorage)
- File type validation and 50MB size limit
- Fallback to local storage when S5 unavailable

**Local Persistence**: AsyncStorage
- User authentication state
- Location data cache
- User preferences and theme settings
- Points and activity history
- Referral codes and relationships
- Failed upload queue for retry logic

**Data Models**:
- `User`: Authentication, points, profile
- `Location`: Geographic data, ratings, images, comments
- `Rating`: 8-category scoring system (security, violence, welcoming, street food, restaurants, pickpocketing, quality of life, hookers)
- `Comment`: User feedback with optional anonymity
- `Contributor`: Track user contributions by type
- `PointActivity`: Gamification event logging

## Key Features

**Location Management**:
- Add locations with GPS coordinates (requires location permissions)
- Upload multiple images via camera or library
- Community verification system
- Distance-based discovery

**Rating System**:
- 8-category ratings (1-10 scale)
- Positive attributes (security, welcoming, food, quality of life)
- Negative attributes inverted for display (violence, pickpocketing, hookers)
- Aggregate scores with color-coded indicators

**Engagement System**:
- Comment on locations (authenticated or anonymous)
- Image likes with point distribution
- Points awarded for: adding locations, images, ratings, comments, verifications
- Point distribution to contributors when others engage

**Social Features**:
- Referral system with custom codes
- User profiles with contribution history
- Anonymous posting option
- Multi-language support (i18next)

## Design Patterns

**Platform Abstraction**: Conditional imports and platform-specific files ensure native features (camera, location, maps) work seamlessly while maintaining web compatibility through graceful fallbacks.

**Offline-First**: Zustand stores with AsyncStorage persistence enable the app to function without network connectivity, syncing when connection is restored.

**Type Safety**: Full TypeScript implementation with shared types between frontend and backend via tRPC, eliminating API contract mismatches.

**Component Composition**: Reusable components (ImageCarousel, LocationCard, RatingBar, etc.) with theme injection for consistent styling.

**Progressive Enhancement**: Core features work for anonymous users, with additional capabilities unlocked through authentication.

# External Dependencies

## Third-Party Services

**Supabase** (Authentication & Database):
- Project: `otbvkfzpcxzrcikwysrk.supabase.co`
- Services: Auth (Google OAuth, Farcaster), user management
- Configuration: Google Cloud Console OAuth client required
- API keys stored in environment variables

**Sia S5 Network** (Decentralized Storage):
- Base URL: Configurable via `S5_BASE_URL` (default: https://where-app.com)
- Admin API key: `S5_ADMIN_API_KEY` environment variable
- Setup: Requires running renterd (Zen testnet) and S5 node
- Documentation: https://docs.sfive.net/

**Render** (Backend Hosting):
- Production URL: https://where-1.onrender.com
- Hosts Hono backend with tRPC API
- Environment variables: `S5_BASE_URL`, `S5_ADMIN_API_KEY`

**Expo Services**:
- EAS Build for iOS/Android app compilation
- Project ID: `ecad5de4-316b-4556-8ee1-d8f66c364119`
- Credentials management for app signing
- Development/preview/production build profiles

## Key NPM Packages

**Core Framework**:
- `expo` ~53.0.23 - Development platform
- `react-native` 0.79.5 - Mobile framework
- `expo-router` ~5.1.7 - File-based routing

**Backend**:
- `hono` ^4.7.10 - Web framework
- `@trpc/server` ^11.1.4 - Type-safe API
- `@hono/trpc-server` ^0.3.4 - Hono-tRPC adapter

**State & Data**:
- `zustand` - State management (via import)
- `@tanstack/react-query` ^5.77.2 - Data fetching
- `@react-native-async-storage/async-storage` 2.1.2 - Persistence

**Native Features**:
- `expo-location` ~18.1.6 - GPS access
- `expo-image-picker` ~16.1.4 - Camera/gallery
- `react-native-maps` 1.20.1 - Native maps
- `leaflet` ^1.9.4 - Web maps

**UI/UX**:
- `lucide-react-native` ^0.475.0 - Icons
- `expo-linear-gradient` ~14.1.5 - Gradients
- `i18next` ^25.2.1 - Internationalization
- `react-i18next` ^15.5.2 - React bindings

**Build Tools**:
- `bun` - JavaScript runtime (scripts use `bunx`)
- `babel-preset-expo` - Transpilation
- `typescript` - Type checking

## Platform Permissions

**iOS** (Info.plist):
- `NSLocationWhenInUseUsageDescription` - Location access
- `NSPhotoLibraryUsageDescription` - Photo library
- `NSCameraUsageDescription` - Camera access

**Android** (AndroidManifest.xml):
- `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`
- `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE`
- `CAMERA`

## Environment Configuration

Required environment variables:
- `EXPO_PUBLIC_RORK_API_BASE_URL` - Backend API URL
- `EXPO_PUBLIC_S5_BASE_URL` - S5 gateway URL
- `S5_ADMIN_API_KEY` - S5 upload authorization

Platform-specific:
- Web: Uses environment variables directly
- Native: Loaded via `expo-constants`