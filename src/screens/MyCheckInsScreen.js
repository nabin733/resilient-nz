import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../db/database';
import { colors, spacing, fontSize, radius } from '../theme';
import Button from '../components/Button';

const STATUS_META = {
  OK: { color: colors.success, bg: colors.successLight, icon: 'checkmark-circle' },
  NEED_HELP: { color: colors.warning, bg: colors.warningLight, icon: 'alert-circle' },
  SOS: { color: colors.danger, bg: colors.dangerLight, icon: 'warning' },
};

export default function MyCheckInsScreen({ navigation }) {
  const [checkIns, setCheckIns] = useState([]);

  const loadCheckIns = () => {
    const rows = db.getAllSync('SELECT * FROM pending_checkins ORDER BY createdAt DESC;');
    setCheckIns(rows);
  };

  useFocusEffect(
    useCallback(() => {
      loadCheckIns();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Check-ins</Text>
      <Button title="New Check-In" icon="add-circle-outline" onPress={() => navigation.navigate('Check In')} />

      {checkIns.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="document-text-outline" size={32} color={colors.textMuted} />
          <Text style={styles.emptyText}>No check-ins yet</Text>
        </View>
      ) : (
        <FlatList
          style={{ marginTop: spacing.md }}
          data={checkIns}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const meta = STATUS_META[item.status] || STATUS_META.OK;
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
                    <Ionicons name={meta.icon} size={14} color={meta.color} />
                    <Text style={[styles.statusText, { color: meta.color }]}>{item.status.replace('_', ' ')}</Text>
                  </View>
                  <View style={styles.syncPill}>
                    <Ionicons
                      name={item.synced ? 'cloud-done-outline' : 'cloud-offline-outline'}
                      size={14}
                      color={item.synced ? colors.success : colors.textMuted}
                    />
                    <Text style={[styles.syncText, { color: item.synced ? colors.success : colors.textMuted }]}>
                      {item.synced ? 'Synced' : 'Waiting'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
                <Text style={styles.meta}>📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</Text>
                <Text style={styles.meta}>Battery: {Math.round(item.batteryLevel * 100)}%</Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.background },
  header: { fontSize: fontSize.display, fontWeight: '700', marginBottom: spacing.md, color: colors.textPrimary },
  empty: { marginTop: spacing.xl, alignItems: 'center' },
  emptyText: { color: colors.textMuted, marginTop: spacing.sm },
  card: {
    padding: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.sm },
  statusText: { fontSize: fontSize.caption, fontWeight: '700', marginLeft: 4 },
  syncPill: { flexDirection: 'row', alignItems: 'center' },
  syncText: { fontSize: fontSize.caption, fontWeight: '600', marginLeft: 4 },
  meta: { color: colors.textSecondary, fontSize: fontSize.body, marginTop: 2 },
});