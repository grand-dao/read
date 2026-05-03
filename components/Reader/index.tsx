import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
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
            rendition = book.renderTo("viewer", {
              width: "100%",
              height: "100%",
              manager: "continuous",
              flow: "paginated"
            });

            rendition.themes.default({
              body: { background: "${Colors.dark.background}", color: "${Colors.dark.text}" },
              a: { color: "${Colors.dark.primary}" },
              '::selection': { background: "${Colors.dark.highlight}" }
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
  }));

  return (
    <View style={styles.container}>
      <View style={styles.viewerContainer}>
        <WebView
          ref={webviewRef}
          source={{ html: htmlContent }}
          originWhitelist={['*']}
          javaScriptEnabled={true}
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
