import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius } from '../theme';
import Button from '../components/Button';

export default function ShelterDetailScreen({ route, navigation }) {
  const { shelter } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
      </View>

      <Text style={styles.title}>{shelter.title}</Text>

      <View style={[styles.statusPill, { backgroundColor: shelter.isOpen ? colors.successLight : colors.dangerLight }]}>
        <Ionicons
          name={shelter.isOpen ? 'checkmark-circle' : 'close-circle'}
          size={16}
          color={shelter.isOpen ? colors.success : colors.danger}
        />
        <Text style={[styles.statusText, { color: shelter.isOpen ? colors.success : colors.danger }]}>
          {shelter.isOpen ? 'Open' : 'Closed'}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
          <View style={{ marginLeft: spacing.sm, flex: 1 }}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{shelter.address}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={20} color={colors.textSecondary} />
          <View style={{ marginLeft: spacing.sm, flex: 1 }}>
            <Text style={styles.infoLabel}>Capacity</Text>
            <Text style={styles.infoValue}>{shelter.capacity} people</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons name="map-outline" size={20} color={colors.textSecondary} />
          <View style={{ marginLeft: spacing.sm, flex: 1 }}>
            <Text style={styles.infoLabel}>Region</Text>
            <Text style={styles.infoValue}>{shelter.region}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons name="navigate-outline" size={20} color={colors.textSecondary} />
          <View style={{ marginLeft: spacing.sm, flex: 1 }}>
            <Text style={styles.infoLabel}>Coordinates</Text>
            <Text style={styles.infoValue}>{shelter.latitude.toFixed(4)}, {shelter.longitude.toFixed(4)}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: spacing.lg }}>
        <Button title="View on Map" icon="map-outline" onPress={() => navigation.navigate('Map')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.background },
  iconWrap: { alignItems: 'center', marginBottom: spacing.sm },
  title: { fontSize: fontSize.display, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
  },
  statusText: { fontSize: fontSize.caption, fontWeight: '700', marginLeft: 4 },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start' },
  infoLabel: { fontSize: fontSize.caption, color: colors.textMuted, marginBottom: 2 },
  infoValue: { fontSize: fontSize.body, color: colors.textPrimary, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
});