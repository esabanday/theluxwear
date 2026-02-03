export default function SectionHeading({ label, title, description }: { label: string; title: string; description?: string }) {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-[0.3em] text-ink/50">{label}</p>
      <h2 className="text-3xl font-display sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm text-ink/70">{description}</p> : null}
    </div>
  );
}
