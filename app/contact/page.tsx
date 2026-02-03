export default function ContactPage() {
  return (
    <section className="lux-container space-y-10 py-16">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Contact</p>
        <h1 className="text-4xl font-display">We’re here to help.</h1>
        <p className="max-w-xl text-sm text-ink/70">
          Questions about sizing, shipping, or collaborations? Reach us and we’ll respond within 1-2 business days.
        </p>
      </div>
      <form className="grid gap-4 max-w-xl">
        <input className="lux-input" type="text" placeholder="Full name" />
        <input className="lux-input" type="email" placeholder="Email" />
        <textarea className="lux-input h-32 rounded-3xl" placeholder="Message" />
        <button className="lux-btn lux-btn-primary w-fit" type="button">
          Send Message
        </button>
      </form>
    </section>
  );
}
