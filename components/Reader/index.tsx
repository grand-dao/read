import React, { useRef } from 'react';
import { View, StyleSheet, Button, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export interface ReaderProps {
  src: string | ArrayBuffer;
  onClose: () => void;
}

export default function Reader({ src, onClose }: ReaderProps) {
  const webviewRef = useRef<WebView>(null);

  // We expect `src` to be a base64 string on Native
  const base64Book = typeof src === 'string' ? src : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js"></script>
        <style>
          body { margin: 0; padding: 0; height: 100vh; background-color: #fff; }
          #viewer { width: 100vw; height: 100vh; overflow: hidden; }
        </style>
      </head>
      <body>
        <div id="viewer"></div>
        <script>
          let book;
          let rendition;

          window.onload = function() {
            // Read base64 data
            const base64Data = "${base64Book}";
            
            book = ePub(base64Data, { encoding: "base64" });
            rendition = book.renderTo("viewer", {
              width: "100%",
              height: "100%",
              manager: "continuous",
              flow: "paginated"
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Close" onPress={onClose} />
        <Button title="Prev" onPress={() => executeJS('goPrev()')} />
        <Button title="Next" onPress={() => executeJS('goNext()')} />
      </View>
      <View style={styles.viewerContainer}>
        <WebView
          ref={webviewRef}
          source={{ html: htmlContent }}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          style={{ flex: 1 }}
        />
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
    // ensure it displays above webview
    zIndex: 10,
    marginTop: Platform.OS === 'ios' ? 40 : 20,
  },
  viewerContainer: {
    flex: 1,
    width: '100%',
  },
});
