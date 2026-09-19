const API_BASE_URL = 'http://192.168.1.142:8000/api';

export async function fetchSheltersFromAPI() {
  const response = await fetch(`${API_BASE_URL}/shelters/`);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return await response.json();
}

export async function sendCheckinToAPI(checkin) {
  const response = await fetch(`${API_BASE_URL}/checkins/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      device_id: 'test-device',
      status: checkin.status,
      latitude: checkin.latitude,
      longitude: checkin.longitude,
      battery_level: checkin.batteryLevel,
      created_at: checkin.createdAt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Sync failed with status ${response.status}`);
  }

  return await response.json();
}