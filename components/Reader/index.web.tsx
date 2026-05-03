import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import ePub from 'epubjs';
import { Colors } from '../../constants/Colors';

export interface ReaderProps {
  src: string | ArrayBuffer;
  onClose?: () => void;
  onToc?: (toc: any[]) => void;
}

export interface ReaderRef {
  goNext: () => void;
  goPrev: () => void;
  goTo: (href: string) => void;
}

const Reader = forwardRef<ReaderRef, ReaderProps & { onToc?: (toc: any) => void }>(({ src, onToc }, ref) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [rendition, setRendition] = useState<any>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    const newBook = ePub(src as ArrayBuffer);

    // Extract TOC
    newBook.loaded.navigation.then(function(nav) {
      if (onToc) {
        onToc(nav.toc);
      }
    });

    const newRendition = newBook.renderTo(viewerRef.current, {
      width: '100%',
      height: '100%',
      flow: 'scrolled',
      manager: 'default',
    });
    
    // Set theme styling for epubjs iframe
    newRendition.themes.default({
      body: { background: Colors.dark.background, color: Colors.dark.text, paddingBottom: "100px" },
      a: { color: Colors.dark.primary },
      '::selection': { background: Colors.dark.highlight }
    });

    // Expose methods to window for the injected buttons to call
    (window as any).goWebPrev = () => newRendition.prev();
    (window as any).goWebNext = () => newRendition.next();

    // Inject Next/Prev buttons at the bottom of each chapter
    newRendition.hooks.content.register(function(contents: any) {
      const doc = contents.document;
      const body = doc.body;
      const footer = doc.createElement('div');
      footer.innerHTML = '<div style="display:flex; justify-content:space-between; padding: 40px 20px; margin-top: 40px; border-top: 1px solid #333;"><button onclick="window.parent.goWebPrev()" style="padding:12px 24px; background:#9333EA; color:#fff; border:none; border-radius:8px; font-size:16px; cursor:pointer;">&larr; Prev Chapter</button><button onclick="window.parent.goWebNext()" style="padding:12px 24px; background:#9333EA; color:#fff; border:none; border-radius:8px; font-size:16px; cursor:pointer;">Next Chapter &rarr;</button></div>';
      body.appendChild(footer);
    });

    setRendition(newRendition);
    newRendition.display();

    return () => {
      newBook.destroy();
      delete (window as any).goWebPrev;
      delete (window as any).goWebNext;
    };
  }, [src, onToc]);

  useImperativeHandle(ref, () => ({
    goNext: () => rendition?.next(),
    goPrev: () => rendition?.prev(),
    goTo: (href: string) => rendition?.display(href),
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
