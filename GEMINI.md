# Project: read (EPUB Reader)

A lightweight EPUB reader application built with Expo and React Native, utilizing a WebView-based implementation of `epub.js` for rendering.

## Project Overview

- **Framework:** Expo (SDK 54) with React 19 and React Native 0.81.
- **Primary Purpose:** Provide a clean interface to import, manage, and read EPUB documents across mobile and web platforms.
- **Core Technology Stack:**
  - **Reader Engine:** Custom `WebView` component using `epub.js` (via CDN) and `jszip`.
  - **File System:** `expo-file-system` for reading book data.
  - **Routing:** `expo-router` with Drawer and Stack navigation.
  - **File Selection:** `expo-document-picker` for importing EPUB files.
  - **Storage:** `@react-native-async-storage/async-storage` for the book library.
  - **UI Components:** `react-native-gesture-handler` and `react-native-reanimated`.

## Architecture & Structure

- **`app/`**: Main application routes.
  - **`_layout.tsx`**: Root layout with a Stack navigator.
  - **`reader.tsx`**: The main reader screen that handles loading EPUB data and rendering the `Reader` component.
  - **`(drawer)/`**: Contains the drawer-based navigation.
    - **`_layout.tsx`**: Configures the Drawer navigator.
    - **`index.tsx`**: The Library screen, managing the list of imported books.
    - **`explore.tsx`, `history.tsx`, `settings.tsx`**: Placeholder screens for extended functionality.
- **`components/`**:
  - **`Reader/`**: Contains the core rendering logic.
    - **`index.tsx`**: `WebView` implementation that injects `epub.js` to render the EPUB.
- **`constants/`**:
  - **`Colors.ts`**: Centralized theme and color palette (Dark theme focused).

## Building and Running

Ensure you have [Bun](https://bun.sh/) installed:
```bash
bun install
```

Key commands:
- **Start Development Server:** `npm start`
- **Android:** `npm run android`
- **iOS:** `npm run ios`
- **Web:** `npm run web`
- **Linting:** `npm run lint`

## Development Conventions

- **Language:** TypeScript for type safety.
- **Styling:** React Native `StyleSheet` with a consistent dark-themed palette.
- **WebView Communication:** Uses `onMessage` and `injectJavaScript` for bi-directional communication between React Native and `epub.js`.
- **Navigation:** Uses `expo-router`'s file-based routing with typed parameters (e.g., passing `uri` to the reader).
- **Architecture:** Leverages the Expo New Architecture and React Compiler for performance.

## Key Files & Responsibilities

- **`app/(drawer)/index.tsx`**: Manages the library state, handles document picking, and persists the book list using AsyncStorage.
- **`app/reader.tsx`**: Orchestrates the reading experience, including TOC display and settings modal.
- **`components/Reader/index.tsx`**: Encapsulates the `epub.js` viewer logic within a `WebView`, handling themes and navigation hooks.
