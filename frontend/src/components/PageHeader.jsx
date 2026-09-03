/**
 * A consistent photo masthead for secondary pages — same gradient
 * treatment as the homepage hero (tested there for text legibility),
 * reused here so every page that has one looks intentional rather than
 * bespoke-per-page. Not every page gets one: transactional pages
 * (Contact) and the policy document deliberately stay plain, since a
 * heavy photo band adds distraction, not value, on pages people are
 * trying to read or act on quickly.
 */
export default function PageHeader({ image, alt, eyebrow, title, subtitle, cta }) {
  return (
    <section className="relative overflow-hidden bg-pine text-sand-light min-h-[18rem] md:min-h-[21rem] flex items-end">
      <img src={image} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-pine-dark/90 via-pine-dark/55 to-pine-dark/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-pine-dark/85 via-pine-dark/35 to-pine-dark/15" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-10 w-full">
        <div className="text-xs uppercase tracking-[0.25em] font-mono text-brass-light mb-3">
          {eyebrow}
        </div>
        <h1 className="font-display text-3xl md:text-4xl leading-tight max-w-2xl drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-sand-light/90 max-w-xl leading-relaxed drop-shadow">
            {subtitle}
          </p>
        )}
        {cta}
      </div>
    </section>
  );
}
