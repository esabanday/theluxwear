import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { formatTiming, getPrayerTimesForToday } from '@/lib/prayer-times';

export const runtime = 'nodejs';

type PrayerTimings = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
};

type PrayerState = {
  date: string;
  readable: string;
  timings: PrayerTimings;
  lastSent: Record<string, string>;
};

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

function getHeaderSecret(request: Request) {
  const secret = process.env.PRAYER_CRON_SECRET;
  if (!secret) return null;
  const header = request.headers.get('x-cron-secret') || '';
  const url = new URL(request.url);
  const query = url.searchParams.get('token') || '';
  if (header && header === secret) return secret;
  if (query && query === secret) return secret;
  return null;
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function getTimeParts(timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
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
    dateKey: `${map.year}-${map.month}-${map.day}`,
    now: `${map.hour}:${map.minute}`
  };
}

function normalizeTiming(value: string) {
  return formatTiming(value).trim();
}

async function readState(filePath: string): Promise<PrayerState | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as PrayerState;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') return null;
    throw error;
  }
}

async function writeState(filePath: string, state: PrayerState) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(state, null, 2));
}

export async function POST(request: Request) {
  const secret = process.env.PRAYER_CRON_SECRET;
  if (secret && !getHeaderSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const timeZone = process.env.PRAYER_TIMEZONE || 'America/New_York';
    const statePath = process.env.PRAYER_STATE_PATH || '/tmp/prayer-times.json';
    const { dateKey, now } = getTimeParts(timeZone);
    const url = new URL(request.url);
    const force = ['1', 'true', 'yes'].includes((url.searchParams.get('force') || '').toLowerCase());

    let state = await readState(statePath);
    if (!state || state.date !== dateKey) {
      const data = await getPrayerTimesForToday();
      state = {
        date: dateKey,
        readable: data.date.readable,
        timings: data.timings,
        lastSent: {}
      };
      await writeState(statePath, state);
    }

    let prayerToSend: (typeof PRAYER_NAMES)[number] | null = null;

    if (force) {
      prayerToSend = 'Fajr';
    } else {
      for (const prayer of PRAYER_NAMES) {
        const timing = normalizeTiming(state.timings[prayer]);
        if (timing === now) {
          prayerToSend = prayer;
          break;
        }
      }

      if (!prayerToSend) {
        return NextResponse.json({ ok: true, skipped: true, reason: 'not_prayer_time', now });
      }

      if (state.lastSent[prayerToSend] === dateKey) {
        return NextResponse.json({
          ok: true,
          skipped: true,
          reason: 'already_sent',
          now,
          prayer: prayerToSend
        });
      }
    }

    const message = [
      `Prayer times for ${state.readable}.`,
      `Fajr ${normalizeTiming(state.timings.Fajr)}.`,
      `Dhuhr ${normalizeTiming(state.timings.Dhuhr)}.`,
      `Asr ${normalizeTiming(state.timings.Asr)}.`,
      `Maghrib ${normalizeTiming(state.timings.Maghrib)}.`,
      `Isha ${normalizeTiming(state.timings.Isha)}.`
    ].join(' ');

    const token = requireEnv('VOICEMONKEY_TOKEN');
    const flow = process.env.VOICEMONKEY_FLOW;
    const modeEnv = (process.env.VOICEMONKEY_MODE || '').toLowerCase();
    const mode = modeEnv || (flow ? 'flow' : 'announcement');

    if (mode === 'flow') {
      if (!flow) {
        throw new Error('Missing env var: VOICEMONKEY_FLOW');
      }
      const flowUrl = new URL('https://api-v2.voicemonkey.io/flows');
      flowUrl.searchParams.set('token', token);
      flowUrl.searchParams.set('flow', flow);

      const res = await fetch(flowUrl.toString());
      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: text || 'Voice Monkey error' }, { status: 502 });
      }
      state.lastSent[prayerToSend ?? 'Fajr'] = dateKey;
      await writeState(statePath, state);
      return NextResponse.json({ ok: true, mode, prayer: prayerToSend, message });
    }

    const device = requireEnv('VOICEMONKEY_DEVICE');
    const endpoint =
      mode === 'trigger'
        ? 'https://api-v2.voicemonkey.io/trigger'
        : 'https://api-v2.voicemonkey.io/announcement';

    const payload =
      mode === 'trigger'
        ? { token, device }
        : { token, device, announcement: message };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || 'Voice Monkey error' }, { status: 502 });
    }

    state.lastSent[prayerToSend ?? 'Fajr'] = dateKey;
    await writeState(statePath, state);
    return NextResponse.json({ ok: true, mode, prayer: prayerToSend, message });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
