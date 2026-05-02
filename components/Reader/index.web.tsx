import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import ePub from 'epubjs';

export interface ReaderProps {
  src: string | ArrayBuffer;
  onClose: () => void;
}

export default function Reader({ src, onClose }: ReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [book, setBook] = useState<any>(null);
  const [rendition, setRendition] = useState<any>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    // ePub is available globally or as default export in the dist file
    const newBook = ePub(src as ArrayBuffer);
    setBook(newBook);

    const newRendition = newBook.renderTo(viewerRef.current, {
      width: '100%',
      height: '100%',
      flow: 'paginated',
      manager: 'continuous',
    });

    setRendition(newRendition);
    newRendition.display();

    return () => {
      newBook.destroy();
    };
  }, [src]);

  const goNext = () => rendition?.next();
  const goPrev = () => rendition?.prev();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Close" onPress={onClose} />
        <Button title="Prev" onPress={goPrev} />
        <Button title="Next" onPress={goNext} />
      </View>
      <View style={styles.viewerContainer}>
        {/* We use a raw div here since it's the web implementation */}
        <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
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
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  viewerContainer: {
    flex: 1,
    width: '100%',
  },
});
