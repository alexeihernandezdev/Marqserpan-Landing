/** Fallback de las páginas del panel mientras llegan sesión y datos (navegación instantánea). */
export function PageLoading() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-6">
      <span className="sr-only">Cargando…</span>
      <div className="flex flex-col gap-2">
        <div className="h-9 w-56 animate-pulse rounded-md bg-black/10" />
        <div className="h-4 w-32 animate-pulse rounded bg-black/5" />
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-black/5" />
    </div>
  );
}
