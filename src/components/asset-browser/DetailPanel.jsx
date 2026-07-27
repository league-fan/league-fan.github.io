import { useMemo } from "react";
import { DETAIL_FIELDS } from "../../services/assets.js";

/** Build the visible property rows for one item, per category field spec. */
function buildRows(item, category) {
  const fields = DETAIL_FIELDS[category] || [];
  if (!item || !fields.length) return [];

  const rows = [];
  for (const [label, getter, type = "text"] of fields) {
    let value;
    try {
      value = getter(item);
    } catch {
      value = null;
    }

    if (value == null || value === "" || value === false) {
      // A literal `false` is meaningful for booleans ("Legacy: No")
      if (type === "bool" && value === false) rows.push({ label, value: false, type });
      continue;
    }
    if (type === "bool" && value !== true && value !== false) continue;
    rows.push({ label, value, type });
  }
  return rows;
}

function RowValue({ row }) {
  if (row.type === "bool") {
    return (
      <span
        className={`inline-flex items-center rounded-full px-1.5 py-px text-[0.66rem] font-medium ${
          row.value
            ? "bg-teal-600/20 text-teal-500"
            : "bg-ink-700 text-muted"
        }`}
      >
        {row.value ? "Yes" : "No"}
      </span>
    );
  }
  if (row.type === "link") {
    return (
      <a
        href={String(row.value)}
        target="_blank"
        rel="noopener"
        className="text-teal-500 underline decoration-teal-500/40 underline-offset-2 hover:text-teal-500/80"
      >
        Open ↗
      </a>
    );
  }
  if (row.type === "image") {
    return <img src={String(row.value)} alt="" className="size-5 object-contain" />;
  }
  if (row.type === "html") {
    // Riot-authored markup from the assets CDN, same as the previous v-html
    return (
      <div
        className="[&_li]:list-disc [&_ul]:my-1 [&_ul]:pl-4"
        dangerouslySetInnerHTML={{ __html: row.value }}
      />
    );
  }
  return <span className="break-words whitespace-pre-wrap">{row.value}</span>;
}

/** Selected-item property list shown at the bottom of the sidebar. */
export default function DetailPanel({ preview, category, assetsProps, previewId, open, onToggle }) {
  const rows = useMemo(() => buildRows(preview, category), [preview, category]);
  const src = preview?.[assetsProps.src] || preview?.tilePath || "";

  return (
    <div className="panel">
      <button
        type="button"
        className="panel-head panel-head-toggle"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="w-2 text-[0.7em] opacity-80">
            {open ? "▾" : "▸"}
          </span>
          Details
        </span>
        {previewId != null && (
          <span className="font-mono text-[0.7rem] normal-case text-muted">
            #{previewId}
          </span>
        )}
      </button>

      {open && (
        <div className="panel-body">
          {src && (
            <div className="mb-3 overflow-hidden rounded-lg border border-ink-700 bg-ink-900">
              <img
                src={src}
                alt={String(preview?.[assetsProps.title] || "")}
                className="mx-auto max-h-40 w-full object-contain"
              />
            </div>
          )}

          {rows.length ? (
            <dl className="space-y-2.5">
              {rows.map((row, idx) => (
                <div key={idx}>
                  <dt className="text-[0.64rem] font-semibold tracking-wide text-muted uppercase">
                    {row.label}
                  </dt>
                  <dd className="mt-0.5 text-[0.78rem] leading-snug text-parchment/90">
                    <RowValue row={row} />
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-[0.78rem] text-muted">
              Select an item to view its properties.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
