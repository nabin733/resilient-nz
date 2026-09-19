import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../db/database';
import { colors, spacing, fontSize, radius } from '../theme';
import OfflineBanner from '../components/OfflineBanner';
import Button from '../components/Button';

export default function SheltersScreen({ navigation }) {
  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    const rows = db.getAllSync('SELECT * FROM shelters;');
    setShelters(rows);
  }, []);

  return (
    <View style={styles.container}>
      <OfflineBanner />
      <View style={styles.headerRow}>
        <Ionicons name="shield-checkmark" size={26} color={colors.primary} />
        <Text style={styles.header}>Civil Defence Shelters</Text>
      </View>

      <View style={styles.actionsRow}>
        <View style={{ flex: 1 }}>
          <Button title="Check In" icon="checkmark-circle-outline" onPress={() => navigation.navigate('Check In')} />
        </View>
        <View style={{ width: spacing.sm }} />
        <View style={{ flex: 1 }}>
          <Button title="Map" icon="map-outline" variant="outline" onPress={() => navigation.navigate('Map')} />
        </View>
      </View>

      <FlatList
        style={{ marginTop: spacing.md }}
        data={shelters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Shelter Detail', { shelter: item })}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={[styles.statusPill, { backgroundColor: item.isOpen ? colors.successLight : colors.dangerLight }]}>
                <Ionicons
                  name={item.isOpen ? 'checkmark-circle' : 'close-circle'}
                  size={14}
                  color={item.isOpen ? colors.success : colors.danger}
                />
                <Text style={[styles.statusText, { color: item.isOpen ? colors.success : colors.danger }]}>
                  {item.isOpen ? 'Open' : 'Closed'}
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.meta}>{item.address}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.meta}>Capacity: {item.capacity}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.background },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  header: { fontSize: fontSize.display, fontWeight: '700', color: colors.textPrimary, marginLeft: spacing.sm },
  actionsRow: { flexDirection: 'row' },
  card: {
    padding: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xs },
  title: { flex: 1, fontWeight: '700', fontSize: fontSize.subheading, color: colors.textPrimary, marginRight: spacing.sm },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.sm },
  statusText: { fontSize: fontSize.caption, fontWeight: '700', marginLeft: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  meta: { color: colors.textSecondary, fontSize: fontSize.body, marginLeft: 6 },
});