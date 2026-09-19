import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../db/database';
import { colors, spacing, fontSize } from '../theme';
import Button from '../components/Button';

async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission was denied. Enable it in Settings to save your real location.');
  }
  const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return { latitude: location.coords.latitude, longitude: location.coords.longitude };
}

export default function CheckInScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const saveCheckIn = async (status) => {
    setLoading(true);
    try {
      const { latitude, longitude } = await getCurrentLocation();
      const id = Date.now().toString();
      const createdAt = new Date().toISOString();

      db.runSync(
        `INSERT INTO pending_checkins (id, status, latitude, longitude, batteryLevel, createdAt, synced)
         VALUES (?, ?, ?, ?, ?, ?, 0);`,
        [id, status, latitude, longitude, 0.8, createdAt]
      );

      Alert.alert('Saved locally', `Your status "${status}" was saved with your real location.`, [
        { text: 'View My Check-ins', onPress: () => navigation.navigate('My Check-ins') },
        { text: 'OK' },
      ]);
    } catch (error) {
      Alert.alert('Could not get location', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name="hand-left-outline" size={40} color={colors.primary} style={{ alignSelf: 'center', marginBottom: spacing.sm }} />
      <Text style={styles.header}>How are you doing?</Text>
      <Text style={styles.subheader}>Your status and location are saved on your device, even offline.</Text>

      <View style={{ marginTop: spacing.lg }}>
        <Button title="I'm OK" icon="checkmark-circle-outline" variant="success" onPress={() => saveCheckIn('OK')} />
        <View style={{ height: spacing.sm }} />
        <Button title="I Need Help" icon="alert-circle-outline" variant="warning" onPress={() => saveCheckIn('NEED_HELP')} />
        <View style={{ height: spacing.sm }} />
        <Button title="SOS" icon="warning-outline" variant="danger" onPress={() => saveCheckIn('SOS')} />
        <View style={{ height: spacing.lg }} />
        <Button title="View My Check-ins" icon="list-outline" variant="outline" onPress={() => navigation.navigate('My Check-ins')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center', backgroundColor: colors.background },
  header: { fontSize: fontSize.display, fontWeight: '700', textAlign: 'center', color: colors.textPrimary },
  subheader: { fontSize: fontSize.body, textAlign: 'center', color: colors.textSecondary, marginTop: spacing.xs },
  loadingText: { marginTop: spacing.sm, textAlign: 'center', color: colors.textSecondary },
});