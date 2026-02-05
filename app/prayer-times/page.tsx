import SectionHeading from '@/components/section-heading';
import { formatTiming, getPrayerTimesForToday } from '@/lib/prayer-times';

const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export default async function PrayerTimesPage() {
  const data = await getPrayerTimesForToday();

  return (
    <section className="lux-container space-y-12 py-16">
      <SectionHeading
        label="Prayer Times"
        title="Daily prayer schedule"
        description={`Updated automatically at midnight (${data.timeZone}).`}
      />

      <div className="rounded-3xl border border-ink/10 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 text-sm text-ink/60">
          <span>{data.date.readable}</span>
          <span>{data.meta.method.name}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {PRAYER_ORDER.map((name) => (
            <div key={name} className="flex items-center justify-between rounded-2xl border border-ink/10 px-4 py-3">
              <span className="text-xs uppercase tracking-[0.2em] text-ink/60">{name}</span>
              <span className="font-display text-lg">{formatTiming(data.timings[name])}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink/50">
        Prayer times provided by AlAdhan. Timings may differ based on local mosque adjustments.
      </p>
    </section>
  );
}
