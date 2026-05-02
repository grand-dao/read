import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, SafeAreaView, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Reader from '../components/Reader';

export default function Index() {
  const [epubData, setEpubData] = useState<string | ArrayBuffer | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/epub+zip',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        console.log('Picked EPUB:', uri);
        
        if (Platform.OS === 'web') {
          const response = await fetch(uri);
          const arrayBuffer = await response.arrayBuffer();
          setEpubData(arrayBuffer);
        } else {
          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
          setEpubData(base64);
        }
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  if (epubData) {
    return (
      <SafeAreaView style={styles.container}>
        <Reader src={epubData} onClose={() => setEpubData(null)} />
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
