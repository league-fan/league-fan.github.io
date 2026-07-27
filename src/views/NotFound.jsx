import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-6xl font-bold text-ink-600">404</p>
      <h1 className="text-xl font-semibold text-gold-300">Page not found</h1>
      <p className="max-w-sm text-muted">
        That route doesn&rsquo;t match any gallery in this collection.
      </p>
      <Link
        to="/"
        className="rounded-lg border border-gold-500/50 bg-gold-500/10 px-4 py-2 text-sm font-medium text-gold-300 transition hover:bg-gold-500/20"
      >
        Back to Icons
      </Link>
    </div>
  );
}
