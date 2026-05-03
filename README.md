# Read - Cross-Platform EPUB Reader

A lightweight, highly customizable EPUB reader application built with Expo and React Native. It utilizes a custom WebView-based implementation of `epub.js` for robust, cross-platform rendering across both mobile (Android/iOS) and Web.

## Features

- 📚 **Persistent Library**: Import EPUB files from your device. Your library state and book list are securely saved across sessions using `AsyncStorage`.
- 📖 **Immersive Reader**: Clean, distraction-free reading interface with hidden system headers.
- 📜 **Scrollable Reading Flow**: Modern, continuous vertical scrolling optimized for mobile and web reading.
- 📑 **Table of Contents**: Automatically parses the EPUB's structure to provide a dedicated, easy-to-use chapter selection screen.
- 🎨 **Dynamic Customization**:
  - **Themes**: Instantly switch between Dark, Light, and Sepia modes.
  - **Typography**: Adjust font sizes on the fly.
  - **Font Families**: Toggle between modern Sans and classic Serif fonts.
- 📱 **Cross-Platform**: Tailored `Reader` wrappers. Uses a robust bridge with `react-native-webview` for native apps, and direct DOM injection for Web.
- 🧭 **Intuitive Navigation**: Seamless routing using `expo-router` with a drawer layout for the main app and full-screen modals for reading.

## Tech Stack

- **Framework**: Expo (SDK 54) & React Native 0.81
- **Routing**: `expo-router`
- **EPUB Engine**: `epub.js` (via CDN and WebView bridge for Native, direct for Web)
- **File System**: `expo-file-system` & `expo-document-picker`
- **Storage**: `@react-native-async-storage/async-storage`
- **Styling**: React Native StyleSheet with centralized theme constants.

## Installation & Setup

1. **Prerequisites**: Ensure you have [Bun](https://bun.sh/) installed.
2. **Install Dependencies**:
   ```bash
   bun install
   ```
3. **Run the App**:
   - **Web**: `bun run web`
   - **Android**: `bun run android`
   - **iOS**: `bun run ios`
   - **Development Server**: `bun start`

## Architecture Overview

The application logic is broken down into clear boundaries:
- `app/(drawer)/index.tsx`: The main Library hub where users import and manage their saved EPUBs.
- `app/reader.tsx`: The main reading experience, handling the TOC flow, Reader wrapper instantiation, and the settings modal.
- `components/Reader/`: Contains the core rendering wrappers (`index.tsx` for Native, `index.web.tsx` for Web). These wrappers handle the heavy lifting of initializing `epub.js`, injecting themes dynamically, and managing navigation hooks without blocking the React Native thread.

## Upcoming Features (Roadmap)
- Text-to-Speech (TTS) integration
- Auto-scroll capabilities
- Reading history and statistics tracking
- Bookmarks and Highlights
