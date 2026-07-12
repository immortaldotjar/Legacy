import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grain flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center text-paper">
      <p className="eyebrow flex items-center gap-2 text-xs text-rec">
        <span className="rec-dot" aria-hidden />
        00:00:00 — NO SIGNAL
      </p>

      <h1 className="mt-6 font-display text-6xl font-semibold md:text-7xl">
        Scene Not Found
      </h1>

      <p className="mt-6 max-w-md text-paper-dim">
        This frame isn't part of the reel. It may have been cut, or the
        link brought you somewhere that was never filmed.
      </p>

      <Link
        to="/"
        className="mt-10 rounded-full bg-paper px-7 py-3 font-medium text-ink transition hover:-translate-y-0.5"
      >
        Back to the Screening Room
      </Link>
    </div>
  );
}
