# FreelanceHub - Freelancer Automation Dashboard

## Overview
FreelanceHub is a comprehensive personal dashboard for freelancers to manage their business operations. Built with React Native and Expo, it provides a mobile-first experience with drawer navigation and iOS liquid glass design aesthetics.

## Features
- **Dashboard**: Overview stats including daily/monthly/all-time bids, revenue metrics, and win rate
- **Proposal Generator**: Create customized proposals from templates with keyword extraction
- **Kanban Board**: Visual project management with drag-and-drop across 6 workflow stages
- **CRM**: Client management with deal stages (Lead → Proposal Sent → Negotiation → Won/Lost)
- **Developer Library**: Track team members with availability status and hourly rates
- **Snippet Manager**: Save and copy frequently-used text snippets
- **Settings**: Profile customization with avatar selection

## Tech Stack
- React Native with Expo SDK 54
- React Navigation 7 (Drawer Navigator)
- Zustand for state management
- expo-clipboard for copy functionality
- react-native-reanimated for animations

## Project Structure
```
├── App.tsx                    # Root component with navigation
├── navigation/
│   └── DrawerNavigator.tsx   # Main drawer navigation
├── screens/
│   ├── DashboardScreen.tsx   # Stats overview
│   ├── ProposalsScreen.tsx   # Proposal generator
│   ├── ProjectsScreen.tsx    # Kanban board
│   ├── ClientsScreen.tsx     # CRM
│   ├── DevelopersScreen.tsx  # Developer library
│   ├── SnippetsScreen.tsx    # Snippet manager
│   └── SettingsScreen.tsx    # User settings
├── components/               # Reusable UI components
├── store/
│   └── dataStore.ts         # Zustand state management
├── constants/
│   └── theme.ts             # Design tokens
└── hooks/                   # Custom hooks
```

## Running the App
- Use `npm run dev` to start the Expo development server
- Scan QR code with Expo Go (iOS/Android) to test on device
- Web version accessible at localhost:8081

## Data Storage
Currently uses in-memory state management with Zustand. Mock data is provided for demonstration purposes. The app is designed for easy migration to persistent storage.

## Design Guidelines
The app follows the iOS 26 liquid glass interface design with:
- Indigo/purple color palette
- Subtle blur effects and transparency
- Smooth spring animations
- Light and dark mode support (auto-detects system preference)
