import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { colors, spacing } from '../theme';

export default function OfflineBanner() {
  const isConnected = useNetworkStatus();

  if (isConnected) return null; // show nothing at all when online

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>📴 Offline — showing cached data</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warning,
    padding: spacing.sm,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});