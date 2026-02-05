type PrayerTimings = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
};

type PrayerTimesResponse = {
  data: {
    timings: PrayerTimings;
    date: {
      readable: string;
      gregorian: { date: string };
    };
    meta: {
      timezone: string;
      method: { name: string };
    };
  };
};

const DEFAULT_API_BASES = [
  'https://aladhan.api.islamic.network/v1',
  'https://aladhan.api.alislam.ru/v1',
  'https://api.aladhan.com/v1'
];

function getEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

function getApiBases() {
  const raw = process.env.PRAYER_API_BASE || '';
  const bases = raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  return bases.length ? bases : DEFAULT_API_BASES;
}

function getTodayParts(timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const parts = formatter.formatToParts(new Date());
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    day: map.day,
    month: map.month,
    year: map.year,
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second)
  };
}

function secondsUntilMidnight(timeZone: string) {
  const { hour, minute, second } = getTodayParts(timeZone);
  const remaining = (23 - hour) * 3600 + (59 - minute) * 60 + (60 - second);
  return Math.max(60, remaining);
}

export async function getPrayerTimesForToday() {
  const timeZone = process.env.PRAYER_TIMEZONE || 'America/New_York';
  const latitude = getEnv('PRAYER_LATITUDE');
  const longitude = getEnv('PRAYER_LONGITUDE');
  const method = process.env.PRAYER_METHOD || '2';

  const { day, month, year } = getTodayParts(timeZone);
  const date = `${day}-${month}-${year}`;
  const revalidate = secondsUntilMidnight(timeZone);

  const errors: string[] = [];

  for (const base of getApiBases()) {
    const url = new URL(`${base}/timings/${date}`);
    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);
    url.searchParams.set('method', method);

    try {
      const res = await fetch(url.toString(), { next: { revalidate } });
      if (!res.ok) {
        errors.push(`${base} -> ${res.status}`);
        continue;
      }
      const json = (await res.json()) as PrayerTimesResponse;
      return { ...json.data, timeZone };
    } catch (error) {
      errors.push(`${base} -> ${(error as Error).message}`);
    }
  }

  throw new Error(`Prayer times request failed: ${errors.join('; ')}`);
}

export function formatTiming(value: string) {
  return value.replace(/\s*\(.*\)$/, '');
}
