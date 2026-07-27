import { useEffect, useState } from "react";

/**
 * Gallery thumbnail with a hover zoom and a graceful broken-image fallback.
 * Failed loads still fire `onLoaded` so page load progress can complete.
 */
export default function AssetThumb({ src, id, name, scale = 1, onLoaded }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  const label = name || String(id ?? "");

  if (error || !src) {
    return (
      <div
        title={label}
        className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-ink-600 bg-ink-850 px-2 text-center text-muted"
      >
        <span aria-hidden="true" className="text-base opacity-60">
          ⚠
        </span>
        <span className="max-w-full truncate text-[0.65rem]">{label}</span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-ink-900/60">
      <img
        src={src}
        alt={label}
        title={label}
        loading="lazy"
        decoding="async"
        style={{ "--hover-scale": scale }}
        onLoad={onLoaded}
        onError={() => {
          setError(true);
          onLoaded?.();
        }}
        className="block w-full transition-transform duration-200 ease-out hover:scale-[var(--hover-scale)]"
      />
    </div>
  );
}
