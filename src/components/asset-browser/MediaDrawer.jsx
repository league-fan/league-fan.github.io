/** Right-hand panel showing every extra image/video attached to the selection. */
export default function MediaDrawer({
  open,
  groups,
  title,
  previewId,
  groupOpen,
  onToggleGroup,
  onClose,
}) {
  return (
    <aside
      aria-label="Media assets"
      aria-hidden={!open}
      className={`z-40 flex h-full min-h-0 flex-col overflow-hidden border-ink-700/80 bg-ink-900/80 backdrop-blur-md transition-[width,border-width] duration-200 max-xl:absolute max-xl:inset-y-0 max-xl:right-0 max-xl:shadow-2xl ${
        open
          ? "w-[min(360px,85vw)] border-l"
          : "pointer-events-none w-0 border-l-0"
      }`}
    >
      <div className="flex flex-none items-start justify-between gap-2 border-b border-ink-700/80 px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gold-300">
            {title || "Media"}
          </p>
          {previewId != null && (
            <p className="font-mono text-[0.7rem] text-muted">#{previewId}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          title="Close media panel"
          aria-label="Close media panel"
          className="icon-btn size-7 flex-none text-base leading-none"
        >
          ›
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3">
        {groups.map((group) => {
          const isOpen = groupOpen[group.key] !== false;
          return (
            <div key={group.key} className="panel">
              <button
                type="button"
                className="panel-head panel-head-toggle w-full"
                aria-expanded={isOpen}
                onClick={() => onToggleGroup(group.key)}
              >
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="w-2 text-[0.7em] opacity-80">
                    {isOpen ? "▾" : "▸"}
                  </span>
                  {group.label}
                </span>
                <span className="text-[0.7rem] font-normal text-muted">
                  {group.items.length}
                </span>
              </button>

              {isOpen && (
                <div className="panel-body space-y-3">
                  {group.items.map((m) =>
                    m.kind === "video" ? (
                      <a
                        key={m.id}
                        href={m.src}
                        target="_blank"
                        rel="noopener"
                        className="block rounded-lg border border-dashed border-ink-600 px-3 py-2.5 text-center text-[0.78rem] text-teal-500 transition hover:border-teal-600 hover:bg-teal-600/10"
                      >
                        ▶ {m.title || "Video"}
                      </a>
                    ) : (
                      <figure key={m.id}>
                        <a href={m.src} target="_blank" rel="noopener">
                          <img
                            src={m.src}
                            alt={m.title || ""}
                            loading="lazy"
                            className="block max-h-56 w-full rounded-lg border border-ink-700 bg-ink-900 object-contain transition hover:border-ink-500"
                          />
                        </a>
                        {(m.title || m.caption || m.colors) && (
                          <figcaption className="mt-1.5">
                            {m.title && (
                              <p className="truncate text-[0.75rem] font-medium text-parchment/90">
                                {m.title}
                              </p>
                            )}
                            {m.colors?.length > 0 && (
                              <div className="mt-1 flex gap-0.5">
                                {m.colors.map((col, ci) => (
                                  <span
                                    key={ci}
                                    title={col}
                                    style={{ background: col }}
                                    className="size-3 rounded-sm ring-1 ring-ink-600"
                                  />
                                ))}
                              </div>
                            )}
                            {m.caption && (
                              <p className="mt-1 text-[0.7rem] leading-snug text-muted">
                                {m.caption}
                              </p>
                            )}
                          </figcaption>
                        )}
                      </figure>
                    ),
                  )}
                </div>
              )}
            </div>
          );
        })}

        {!groups.length && (
          <p className="py-8 text-center text-[0.8rem] text-muted">
            No media assets.
          </p>
        )}
      </div>
    </aside>
  );
}
