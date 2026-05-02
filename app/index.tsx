import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, SafeAreaView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Reader, ReaderProvider } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';

export default function Index() {
  const [epubUri, setEpubUri] = useState<string | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/epub+zip',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('Picked EPUB:', result.assets[0].uri);
        setEpubUri(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  if (epubUri) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Button title="Back" onPress={() => setEpubUri(null)} />
          <Text style={styles.headerTitle} numberOfLines={1}>Reader</Text>
        </View>
        <ReaderProvider>
          <Reader
            src={epubUri}
            fileSystem={useFileSystem}
            onDisplayError={(error) => console.error('Display error:', error)}
          />
        </ReaderProvider>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Barebone EPUB Reader</Text>
      <Text style={styles.subtitle}>Import an .epub file to start reading</Text>
      <View style={styles.buttonContainer}>
        <Button title="Import EPUB" onPress={pickDocument} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 40,
  },
});
