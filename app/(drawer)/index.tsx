import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface Book {
  id: string;
  name: string;
  uri: string;
  dateAdded: number;
}

const STORAGE_KEY = '@epub_books';

export default function Library() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);

  const loadBooks = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBooks(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load books from storage', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );

  const saveBook = async (newBook: Book) => {
    try {
      const updatedBooks = [newBook, ...books];
      setBooks(updatedBooks);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
    } catch (e) {
      console.error('Failed to save book to storage', e);
    }
  };

  const removeBook = async (id: string) => {
    try {
      const updatedBooks = books.filter(b => b.id !== id);
      setBooks(updatedBooks);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
    } catch (e) {
      console.error('Failed to remove book from storage', e);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/epub+zip',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Prevent adding duplicates
        if (!books.find(b => b.name === asset.name || b.uri === asset.uri)) {
          const newBook: Book = {
            id: Date.now().toString(),
            name: asset.name.replace('.epub', ''),
            uri: asset.uri,
            dateAdded: Date.now(),
          };
          await saveBook(newBook);
        }

        // Navigate to reader passing the URI
        router.push({
          pathname: '/reader',
          params: { uri: asset.uri },
        });
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const renderBook = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => router.push({ pathname: '/reader', params: { uri: item.uri } })}
      activeOpacity={0.7}
    >
      <View style={styles.bookIconContainer}>
        <Ionicons name="book" size={32} color={Colors.dark.primary} />
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.bookDate}>Added {new Date(item.dateAdded).toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity onPress={() => removeBook(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color={Colors.dark.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {books.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={64} color={Colors.dark.icon} />
          <Text style={styles.emptyTitle}>Your Library is Empty</Text>
          <Text style={styles.emptySubtitle}>Import an EPUB file to start reading</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={item => item.id}
          renderItem={renderBook}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={pickDocument} activeOpacity={0.8}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Space for FAB
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  bookIconContainer: {
    width: 60,
    height: 80,
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  bookDate: {
    fontSize: 12,
    color: Colors.dark.textMuted,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.dark.textMuted,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
