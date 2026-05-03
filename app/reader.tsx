import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, SafeAreaView, ScrollView, Modal, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import Reader, { ReaderRef } from '../components/Reader';
import { Colors } from '../constants/Colors';

export default function ReaderScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const router = useRouter();
  const readerRef = useRef<ReaderRef>(null);
  
  const [epubData, setEpubData] = useState<string | ArrayBuffer | null>(null);
  const [toc, setToc] = useState<any[]>([]);
  const [showToc, setShowToc] = useState(true); // Default to showing chapters first
  const [showSettings, setShowSettings] = useState(false);

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

  const handleBack = () => {
    if (!showToc) {
      setShowToc(true); // Go back to Chapters list
    } else {
      router.back(); // Go back to Library
    }
  };

  const handleChapterClick = (href: string) => {
    setShowToc(false);
    // Give the view a moment to switch before telling epubjs to navigate
    setTimeout(() => {
      readerRef.current?.goTo(href);
    }, 100);
  };

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
          <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{showToc ? 'Chapters' : 'Reader'}</Text>
        </View>
        <View style={styles.topBarRight}>
          <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color={Colors.dark.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContainer}>
        {showToc ? (
          <ScrollView style={styles.tocContainer}>
            {toc.length === 0 ? (
              <Text style={styles.tocLoadingText}>Loading Chapters...</Text>
            ) : (
              toc.map((chapter: any, index: number) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.tocItem}
                  onPress={() => handleChapterClick(chapter.href)}
                >
                  <Text style={styles.tocItemText}>{chapter.label.trim()}</Text>
                </TouchableOpacity>
              ))
            )}
            {/* Hidden reader to parse TOC without showing it */}
            <View style={{ width: 0, height: 0, opacity: 0 }}>
              <Reader src={epubData} onToc={setToc} />
            </View>
          </ScrollView>
        ) : (
          <View style={styles.readerContainer}>
            {/* Active reader */}
            <Reader ref={readerRef} src={epubData} onToc={setToc} />
          </View>
        )}
      </View>

      {/* Settings Modal */}
      <Modal visible={showSettings} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons name="close" size={24} color={Colors.dark.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.sectionTitle}>Look Customization</Text>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Theme</Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity style={[styles.settingOption, styles.activeOption]}>
                    <Text style={styles.activeOptionText}>Dark</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.settingOption}>
                    <Text style={styles.optionText}>Light</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.settingOption}>
                    <Text style={styles.optionText}>Sepia</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Font Size</Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity style={styles.settingOption}><Text style={styles.optionText}>A-</Text></TouchableOpacity>
                  <Text style={[styles.optionText, { marginHorizontal: 16 }]}>100%</Text>
                  <TouchableOpacity style={styles.settingOption}><Text style={styles.optionText}>A+</Text></TouchableOpacity>
                </View>
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Font Family</Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity style={[styles.settingOption, styles.activeOption]}>
                    <Text style={styles.activeOptionText}>Sans</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.settingOption}>
                    <Text style={styles.optionText}>Serif</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Other Settings (Demos)</Text>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Auto-scroll</Text>
                <Switch value={false} onValueChange={() => {}} />
              </View>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Text-to-Speech</Text>
                <Switch value={false} onValueChange={() => {}} />
              </View>

            </ScrollView>
          </View>
        </View>
      </Modal>
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
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  mainContainer: {
    flex: 1,
  },
  readerContainer: {
    flex: 1,
  },
  tocContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tocLoadingText: {
    color: Colors.dark.textMuted,
    marginTop: 20,
    textAlign: 'center',
  },
  tocItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  tocItemText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.dark.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  modalBody: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: Colors.dark.primary,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  settingLabel: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 4,
  },
  settingOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeOption: {
    backgroundColor: Colors.dark.primary,
  },
  optionText: {
    color: Colors.dark.text,
  },
  activeOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
