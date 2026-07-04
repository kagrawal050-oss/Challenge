export function LoadingState() {
  return (
    <section
      className="rounded-lg border border-teal-100 bg-white p-6 shadow-soft"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-compass" aria-hidden="true" />
        <div>
          <h2 className="text-lg font-semibold text-ink">Generating your travel plan</h2>
          <p className="mt-1 text-sm text-slate-600">
            Blending local culture, practical tips, and your travel preferences.
          </p>
        </div>
      </div>
    </section>
  );
}
