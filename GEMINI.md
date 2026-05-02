# Project: read (EPUB Reader)

A barebone EPUB reader application built with Expo and React Native, utilizing the `@epubjs-react-native` ecosystem for rendering EPUB files.

## Project Overview

- **Framework:** Expo (SDK 54) with React 19 and React Native 0.81.
- **Primary Purpose:** Provide a simple interface to import and read EPUB documents on mobile and web platforms.
- **Core Technology Stack:**
  - **Reader Engine:** `@epubjs-react-native/core` for EPUB rendering.
  - **File System:** `@epubjs-react-native/expo-file-system` for file management.
  - **Routing:** `expo-router` (File-based routing).
  - **File Selection:** `expo-document-picker` for selecting EPUB files from the device.
  - **Gestures:** `react-native-gesture-handler` and `react-native-reanimated`.

## Architecture & Structure

- **`app/`**: Contains the application routes and main logic.
  - **`_layout.tsx`**: Root layout configuring `GestureHandlerRootView` and the main navigation stack.
  - **`index.tsx`**: The primary entry point. It handles the "Import EPUB" state and switches to the `Reader` view once a file is selected.
- **Config Files**:
  - **`app.json`**: Expo configuration, including `newArchEnabled` and `reactCompiler` experiments.
  - **`package.json`**: Dependency management and scripts.
  - **`tsconfig.json`**: TypeScript configuration.

## Building and Running

Ensure you have dependencies installed:
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

- **Language:** TypeScript is used throughout for type safety.
- **React Patterns:** Functional components with Hooks (`useState`, etc.).
- **Styling:** Standard React Native `StyleSheet` for layout and design.
- **Routing:** Strict adherence to `expo-router` conventions.
- **Experiments:** The project uses the React Compiler and the New Architecture (TurboModules/Fabric).

## Key Files & Responsibilities

- **`app/index.tsx`**: Manages the local state for the loaded EPUB URI and coordinates between the `DocumentPicker` and the `ReaderProvider`.
- **`app/_layout.tsx`**: Sets up the global UI context, including navigation headers and gesture handling.
