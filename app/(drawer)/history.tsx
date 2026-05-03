import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function History() {
  return (
    <View style={styles.container}>
      <Ionicons name="time-outline" size={64} color={Colors.dark.icon} />
      <Text style={styles.title}>History</Text>
      <Text style={styles.subtitle}>Your recently read books will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textMuted,
  },
});
