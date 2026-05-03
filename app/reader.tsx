import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Reader, { ReaderRef } from '../components/Reader';
import { Colors } from '../constants/Colors';

export default function ReaderScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const router = useRouter();
  const readerRef = useRef<ReaderRef>(null);
  const [epubData, setEpubData] = useState<string | ArrayBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function loadEpub() {
      if (!uri) return;
      try {
        if (Platform.OS === 'web') {
          const response = await fetch(uri);
          const arrayBuffer = await response.arrayBuffer();
          setEpubData(arrayBuffer);
        } else {
          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
          setEpubData(base64);
        }
      } catch (e) {
        console.error('Failed to load EPUB:', e);
      }
    }
    loadEpub();
  }, [uri]);

  if (!epubData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: Colors.dark.text }}>Loading book...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, styles.activeIconBg]}>
            <Ionicons name="megaphone" size={20} color={Colors.dark.background} />
          </TouchableOpacity>
        </View>

        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={24} color={Colors.dark.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="bookmark-outline" size={24} color={Colors.dark.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="format-font-size-decrease" size={24} color={Colors.dark.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="translate" size={24} color={Colors.dark.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color={Colors.dark.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-vertical" size={24} color={Colors.dark.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Reader View */}
      <View style={styles.readerContainer}>
        <Reader ref={readerRef} src={epubData} />
      </View>

      {/* Bottom Control Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            The Book (0%) - Part 1 of X (0%)
          </Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton}>
            <MaterialCommunityIcons name="voice-off" size={28} color={Colors.dark.primary} />
          </TouchableOpacity>
          
          <View style={styles.playbackControls}>
            <TouchableOpacity style={styles.controlButton} onPress={() => readerRef.current?.goPrev()}>
              <Ionicons name="play-skip-back" size={32} color={Colors.dark.icon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.playButton} 
              onPress={() => setIsPlaying(!isPlaying)}
            >
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={36} 
                color="#fff" 
                style={{ marginLeft: isPlaying ? 0 : 4 }} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={() => readerRef.current?.goNext()}>
              <Ionicons name="play-skip-forward" size={32} color={Colors.dark.icon} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="caret-up-outline" size={28} color={Colors.dark.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 2,
  },
  activeIconBg: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 20,
    padding: 6,
    marginLeft: 8,
  },
  readerContainer: {
    flex: 1,
  },
  bottomBar: {
    backgroundColor: Colors.dark.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 12,
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  progressText: {
    color: Colors.dark.textMuted,
    fontSize: 14,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
