// Utility to track geolocation updates in localStorage
// Maintains timestamps per user ID to enforce 6-month update restrictions

const GEO_UPDATE_KEY = 'geo_update_timestamps';

interface GeoUpdateRecord {
  [userId: string]: number; // timestamp of last update
}

export const getGeoUpdateTimestamp = (userId: string): number | null => {
  try {
    const stored = localStorage.getItem(GEO_UPDATE_KEY);
    if (!stored) return null;

    const records: GeoUpdateRecord = JSON.parse(stored);
    return records[userId] || null;
  } catch (error) {
    console.error('Error reading geo update timestamp:', error);
    return null;
  }
};

export const setGeoUpdateTimestamp = (userId: string): void => {
  try {
    const stored = localStorage.getItem(GEO_UPDATE_KEY);
    const records: GeoUpdateRecord = stored ? JSON.parse(stored) : {};

    records[userId] = Date.now();
    localStorage.setItem(GEO_UPDATE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving geo update timestamp:', error);
  }
};

export const canUpdateGeoLocation = (userId: string): boolean => {
  const lastUpdate = getGeoUpdateTimestamp(userId);
  if (!lastUpdate) return true;

  const sixMonthsInMs = 6 * 30.44 * 24 * 60 * 60 * 1000; // 6 months approximation
  const now = Date.now();

  return (now - lastUpdate) >= sixMonthsInMs;
};

export const getDaysUntilNextGeoUpdate = (userId: string): number => {
  const lastUpdate = getGeoUpdateTimestamp(userId);
  if (!lastUpdate) return 0;

  const sixMonthsInMs = 6 * 30.44 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const nextAllowedUpdate = lastUpdate + sixMonthsInMs;

  if (now >= nextAllowedUpdate) return 0;

  const msUntilNext = nextAllowedUpdate - now;
  return Math.ceil(msUntilNext / (24 * 60 * 60 * 1000));
};

export const getNextGeoUpdateDate = (userId: string): Date | null => {
  const lastUpdate = getGeoUpdateTimestamp(userId);
  if (!lastUpdate) return null;

  const sixMonthsInMs = 6 * 30.44 * 24 * 60 * 60 * 1000;
  return new Date(lastUpdate + sixMonthsInMs);
};
