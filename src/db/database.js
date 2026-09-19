import * as SQLite from 'expo-sqlite';
import { seedShelters } from '../data/seedShelters';
import { fetchSheltersFromAPI, sendCheckinToAPI } from '../api/shelterApi';

export const db = SQLite.openDatabaseSync('resilient.db');

export function initDatabase() {
  db.execSync('PRAGMA journal_mode = WAL;');

  db.execSync(`
    CREATE TABLE IF NOT EXISTS shelters (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      capacity INTEGER NOT NULL,
      isOpen INTEGER NOT NULL,
      region TEXT NOT NULL
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS pending_checkins (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      batteryLevel REAL NOT NULL,
      createdAt TEXT NOT NULL,
      synced INTEGER DEFAULT 0
    );
  `);
}

export function seedShelterData() {
  const existing = db.getAllSync('SELECT id FROM shelters;');
  if (existing.length > 0) return;

  const insertQuery =
    'INSERT INTO shelters (id, title, address, latitude, longitude, capacity, isOpen, region) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';

  seedShelters.forEach((shelter) => {
    const params = [
      shelter.id,
      shelter.title,
      shelter.address,
      shelter.latitude,
      shelter.longitude,
      shelter.capacity,
      shelter.isOpen,
      shelter.region,
    ];
    db.runSync(insertQuery, params);
  });
}

export async function refreshSheltersFromAPI() {
  try {
    const apiShelters = await fetchSheltersFromAPI();

    db.runSync('DELETE FROM shelters;');

    apiShelters.forEach((shelter) => {
      db.runSync(
        `INSERT INTO shelters (id, title, address, latitude, longitude, capacity, isOpen, region)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          shelter.id.toString(),
          shelter.title,
          shelter.address,
          shelter.latitude,
          shelter.longitude,
          shelter.capacity,
          shelter.is_open ? 1 : 0,
          shelter.region,
        ]
      );
    });

    console.log('Shelters refreshed from API:', apiShelters.length);
  } catch (error) {
    console.log('Could not refresh from API, using cached data:', error.message);
  }
}

export async function syncPendingCheckins() {
  const unsynced = db.getAllSync('SELECT * FROM pending_checkins WHERE synced = 0;');

  for (const checkin of unsynced) {
    try {
      await sendCheckinToAPI(checkin);
      db.runSync('UPDATE pending_checkins SET synced = 1 WHERE id = ?;', [checkin.id]);
      console.log('Synced check-in:', checkin.id);
    } catch (error) {
      console.log('Failed to sync check-in, will retry later:', checkin.id, error.message);
    }
  }
}