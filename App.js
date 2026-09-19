import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase, seedShelterData, refreshSheltersFromAPI, syncPendingCheckins } from './src/db/database';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    async function setup() {
      initDatabase();
      seedShelterData();
      await refreshSheltersFromAPI();
      await syncPendingCheckins();
      setIsReady(true);
    }
    setup();

    // This listener stays active for the ENTIRE time the app is open,
    // regardless of which screen you're on — unlike the old version
    // which only worked while OfflineBanner happened to be mounted.
    const unsubscribe = NetInfo.addEventListener((state) => {
      const nowConnected = state.isConnected && state.isInternetReachable !== false;

      if (nowConnected && wasOffline.current) {
        console.log('Connection restored — auto-syncing...');
        syncPendingCheckins();
        refreshSheltersFromAPI();
      }

      wasOffline.current = !nowConnected;
    });

    return () => unsubscribe();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Setting up local database...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}