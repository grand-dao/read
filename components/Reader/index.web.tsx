import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import ePub from 'epubjs';
import { Colors } from '../../constants/Colors';

export interface ReaderProps {
  src: string | ArrayBuffer;
  onClose?: () => void;
}

export interface ReaderRef {
  goNext: () => void;
  goPrev: () => void;
}

const Reader = forwardRef<ReaderRef, ReaderProps>(({ src }, ref) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [rendition, setRendition] = useState<any>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    const newBook = ePub(src as ArrayBuffer);

    const newRendition = newBook.renderTo(viewerRef.current, {
      width: '100%',
      height: '100%',
      flow: 'paginated',
      manager: 'continuous',
    });
    
    // Set theme styling for epubjs iframe
    newRendition.themes.default({
      body: { background: Colors.dark.background, color: Colors.dark.text },
      a: { color: Colors.dark.primary },
      '::selection': { background: Colors.dark.highlight }
    });

    setRendition(newRendition);
    newRendition.display();

    return () => {
      newBook.destroy();
    };
  }, [src]);

  useImperativeHandle(ref, () => ({
    goNext: () => rendition?.next(),
    goPrev: () => rendition?.prev(),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.viewerContainer}>
        <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
      </View>
    </View>
  );
});

Reader.displayName = 'Reader';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  viewerContainer: {
    flex: 1,
    width: '100%',
  },
});

export default Reader;
