import SectionHeading from '@/components/section-heading';

export default function AboutPage() {
  return (
    <section className="lux-container space-y-10 py-16">
      <SectionHeading
        label="About"
        title="LuxWear Co is built on elevated simplicity."
        description="Founded by a solo entrepreneur with a vision for timeless, inclusive, and luxurious essentials."
      />
      <div className="grid gap-10 text-sm text-ink/70 md:grid-cols-2">
        <p>
          LuxWear is a direct-to-consumer fashion label focused on intentional design and an uncompromising fit. Every
          piece balances softness with structure, giving you refined silhouettes that feel effortless.
        </p>
        <p>
          We believe luxury should be accessible, personal, and always elevated. Each collection is released in limited
          quantities to preserve quality and deliver a premium experience from first click to final wear.
        </p>
      </div>
    </section>
  );
}
