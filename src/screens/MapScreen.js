import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { db } from '../db/database';
import { colors, spacing, fontSize, radius } from '../theme';

export default function MapScreen() {
  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    const rows = db.getAllSync('SELECT * FROM shelters;');
    setShelters(rows);
  }, []);

  const initialRegion = {
    latitude: -41.5,
    longitude: 173.5,
    latitudeDelta: 8,
    longitudeDelta: 8,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {shelters.map((shelter) => (
          <Marker
            key={shelter.id}
            coordinate={{ latitude: shelter.latitude, longitude: shelter.longitude }}
            pinColor={shelter.isOpen ? colors.success : colors.danger}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{shelter.title}</Text>
                <Text style={styles.calloutMeta}>{shelter.address}</Text>
                <Text style={styles.calloutMeta}>Capacity: {shelter.capacity}</Text>
                <Text style={[styles.calloutStatus, { color: shelter.isOpen ? colors.success : colors.danger }]}>
                  {shelter.isOpen ? '● Open' : '● Closed'}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  callout: { width: 200, padding: spacing.xs },
  calloutTitle: { fontWeight: '700', fontSize: fontSize.subheading, color: colors.textPrimary, marginBottom: 2 },
  calloutMeta: { fontSize: fontSize.body, color: colors.textSecondary },
  calloutStatus: { fontSize: fontSize.body, fontWeight: '700', marginTop: 4 },
});