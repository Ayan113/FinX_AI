export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <div className="text-xs uppercase tracking-[0.3em] text-cyan-700 dark:text-cyanGlow">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}
