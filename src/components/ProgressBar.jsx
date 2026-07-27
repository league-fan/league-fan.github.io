import { useProgress } from "../progress.js";

/** Thin load bar pinned to the top of the viewport, above the app shell. */
export default function ProgressBar() {
  const value = useProgress((s) => s.value);
  const visible = useProgress((s) => s.visible);
  const failed = useProgress((s) => s.failed);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-100 h-0.5"
      role="progressbar"
      aria-hidden={!visible}
      aria-valuenow={visible ? Math.round(value) : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full origin-left transition-[width,opacity] duration-200 ease-out ${
          failed
            ? "bg-red-500 shadow-[0_0_10px_var(--color-red-500)]"
            : "bg-gradient-to-r from-teal-600 via-teal-500 to-gold-500 shadow-[0_0_10px_var(--color-teal-500)]"
        }`}
        style={{ width: `${value}%`, opacity: visible ? 1 : 0 }}
      />
    </div>
  );
}
