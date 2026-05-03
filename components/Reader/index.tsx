import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
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

const Reader = forwardRef<ReaderRef, ReaderProps>(({ src, onToc }, ref) => {
  const webviewRef = useRef<WebView>(null);

  const base64Book = typeof src === 'string' ? src : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js"></script>
        <style>
          body { margin: 0; padding: 0; height: 100vh; background-color: ${Colors.dark.background}; color: ${Colors.dark.text}; }
          #viewer { width: 100vw; height: 100vh; overflow: hidden; }
        </style>
      </head>
      <body>
        <div id="viewer"></div>
        <script>
          let book;
          let rendition;

          window.onload = function() {
            const base64Data = "${base64Book}";
            
            book = ePub(base64Data, { encoding: "base64" });
            
            // Extract TOC
            book.loaded.navigation.then(function(nav) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'toc',
                toc: nav.toc
              }));
            });

            rendition = book.renderTo("viewer", {
              width: "100%",
              height: "100%",
              manager: "default",
              flow: "scrolled"
            });

            rendition.themes.default({
              body: { background: "${Colors.dark.background}", color: "${Colors.dark.text}", paddingBottom: "100px" },
              a: { color: "${Colors.dark.primary}" },
              '::selection': { background: "${Colors.dark.highlight}" }
            });
            
            // Inject Next/Prev buttons at the bottom of each chapter
            rendition.hooks.content.register(function(contents) {
              const doc = contents.document;
              const body = doc.body;
              const footer = doc.createElement('div');
              footer.innerHTML = '<div style="display:flex; justify-content:space-between; padding: 40px 20px; margin-top: 40px; border-top: 1px solid #333;"><button onclick="window.ReactNativeWebView.postMessage(JSON.stringify({type: \\'prev\\'}))" style="padding:12px 24px; background:#9333EA; color:#fff; border:none; border-radius:8px; font-size:16px;">&larr; Prev Chapter</button><button onclick="window.ReactNativeWebView.postMessage(JSON.stringify({type: \\'next\\'}))" style="padding:12px 24px; background:#9333EA; color:#fff; border:none; border-radius:8px; font-size:16px;">Next Chapter &rarr;</button></div>';
              body.appendChild(footer);
            });

            rendition.display();

            rendition.on("relocated", function(location) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'relocated',
                location: location
              }));
            });
          };

          function goNext() { rendition.next(); }
          function goPrev() { rendition.prev(); }
          function goTo(href) { rendition.display(href); }
        </script>
      </body>
    </html>
  `;

  const executeJS = (code: string) => {
    webviewRef.current?.injectJavaScript(`
      try {
        ${code}
      } catch(e) { console.error(e); }
      true;
    `);
  };

  useImperativeHandle(ref, () => ({
    goNext: () => executeJS('goNext()'),
    goPrev: () => executeJS('goPrev()'),
    goTo: (href: string) => executeJS(`goTo('${href}')`),
  }));
  
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'toc' && onToc) {
        onToc(data.toc);
      } else if (data.type === 'next') {
        executeJS('goNext()');
      } else if (data.type === 'prev') {
        executeJS('goPrev()');
      }
    } catch (e) {
      console.error('Error parsing message from webview', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewerContainer}>
        <WebView
          ref={webviewRef}
          source={{ html: htmlContent }}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          onMessage={handleMessage}
          style={{ flex: 1, backgroundColor: Colors.dark.background }}
        />
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
