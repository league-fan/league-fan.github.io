import { useEffect, useState } from "react";

const PAGE_RANGE = 2;

function pageWindow(current, totalPages) {
  const start = Math.max(1, current - PAGE_RANGE);
  const end = Math.min(totalPages, current + PAGE_RANGE);
  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);
  return pages;
}

function PageButton({ page, active, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(page)}
      aria-current={active ? "page" : undefined}
      className={`h-7 min-w-7 cursor-pointer rounded-lg px-2 text-[0.78rem] font-medium transition ${
        active
          ? "bg-gold-500 text-ink-950 shadow-[0_0_14px_-4px_var(--color-gold-500)]"
          : "text-muted hover:bg-ink-800 hover:text-parchment"
      }`}
    >
      {page}
    </button>
  );
}

function Ellipsis() {
  return (
    <span aria-hidden="true" className="px-1 text-muted">
      …
    </span>
  );
}

function Arrow({ dir, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous page" : "Next page"}
      className="icon-btn size-7 disabled:cursor-default disabled:opacity-30 disabled:hover:border-ink-600 disabled:hover:text-muted"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
        <path d={dir === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}

/** Page controls with a windowed page list and a jump-to-page input. */
export default function Pagination({ current, totalPages, onChange }) {
  const [jump, setJump] = useState("");

  useEffect(() => {
    setJump("");
  }, [current]);

  const pages = pageWindow(current, totalPages);
  const showFirst = pages[0] > 1;
  const showLast = pages[pages.length - 1] < totalPages;

  const commitJump = () => {
    const page = Number(jump);
    if (!Number.isFinite(page) || page < 1 || page > totalPages) return;
    onChange(page);
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
    >
      <div className="flex items-center gap-1">
        <Arrow dir="prev" disabled={current <= 1} onClick={() => onChange(current - 1)} />

        {showFirst && (
          <>
            <PageButton page={1} active={current === 1} onClick={onChange} />
            {pages[0] > 2 && <Ellipsis />}
          </>
        )}

        {pages.map((p) => (
          <PageButton key={p} page={p} active={p === current} onClick={onChange} />
        ))}

        {showLast && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <Ellipsis />}
            <PageButton
              page={totalPages}
              active={current === totalPages}
              onClick={onChange}
            />
          </>
        )}

        <Arrow
          dir="next"
          disabled={current >= totalPages}
          onClick={() => onChange(current + 1)}
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="page-jump" className="field-label">
          Go to
        </label>
        <input
          id="page-jump"
          type="number"
          min={1}
          max={totalPages}
          inputMode="numeric"
          value={jump}
          placeholder={String(current)}
          onChange={(e) => setJump(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commitJump()}
          className="input w-16 py-1 text-center"
        />
        <button
          type="button"
          onClick={commitJump}
          className="h-7 cursor-pointer rounded-lg border border-ink-600 bg-ink-800 px-2.5 text-[0.75rem] font-medium text-parchment/85 transition hover:border-gold-600 hover:text-gold-300"
        >
          Go
        </button>
      </div>
    </nav>
  );
}
