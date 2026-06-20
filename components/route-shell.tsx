interface RouteShellProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function RouteShell({ eyebrow, title, description }: RouteShellProps) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-brand-cream px-6 py-16 text-brand-ink sm:px-10 lg:px-16">
      <section className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-leaf">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-black/68">
          {description}
        </p>
      </section>
    </main>
  );
}
