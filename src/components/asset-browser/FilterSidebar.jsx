import DetailPanel from "./DetailPanel.jsx";

function Field({ label, htmlFor, children }) {
  return (
    <div className="mb-3 last:mb-0">
      <label htmlFor={htmlFor} className="field-label mb-1 block">
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * Left rail: search, skin filters, and the selected-item detail panel.
 * Collapses to a 2.5rem rail that keeps the active-filter count visible.
 */
export default function FilterSidebar({
  open,
  onToggle,
  searchInput,
  onSearchInput,
  onSearchCommit,
  shownCount,
  totalCount,
  isSkins,
  filters,
  filterOptions,
  onFilterChange,
  onToggleRarity,
  onResetFilters,
  activeFilterCount,
  panelOpen,
  onTogglePanel,
  preview,
  previewId,
  category,
  assetsProps,
}) {
  return (
    <aside
      className={`z-40 flex h-full min-h-0 flex-none border-r border-ink-700/80 bg-ink-900/80 backdrop-blur-md transition-[width] duration-200 max-lg:absolute max-lg:inset-y-0 max-lg:left-0 max-lg:shadow-2xl ${
        open ? "w-[var(--sidebar-width)] max-w-[85vw]" : "w-10"
      }`}
      aria-expanded={open}
    >
      <button
        type="button"
        onClick={onToggle}
        title={open ? "Collapse sidebar" : "Expand sidebar"}
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        className="flex w-10 flex-none cursor-pointer flex-col items-center gap-2 border-r border-ink-700/80 pt-3 text-muted transition hover:bg-ink-800 hover:text-gold-400"
      >
        <span aria-hidden="true" className="text-lg leading-none font-bold">
          {open ? "‹" : "›"}
        </span>
        {!open && activeFilterCount > 0 && (
          <span className="grid size-4 place-items-center rounded-full bg-gold-500 text-[0.6rem] font-bold text-ink-950">
            {activeFilterCount}
          </span>
        )}
      </button>

      {open && (
        <div className="min-h-0 min-w-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto p-3">
          <div>
            <input
              type="search"
              className="input"
              placeholder="Search name, id, series…"
              value={searchInput}
              onChange={(e) => onSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearchCommit()}
            />
            <p className="mt-1.5 text-[0.7rem] text-muted">
              <span className="font-medium text-parchment/80">
                {shownCount.toLocaleString()}
              </span>{" "}
              / {totalCount.toLocaleString()} items
            </p>
          </div>

          {isSkins && (
            <div className="panel">
              <div className="panel-head panel-head-toggle">
                <button
                  type="button"
                  className="flex flex-1 cursor-pointer items-center gap-1.5 text-left"
                  aria-expanded={panelOpen.filters}
                  onClick={() => onTogglePanel("filters")}
                >
                  <span aria-hidden="true" className="w-2 text-[0.7em] opacity-80">
                    {panelOpen.filters ? "▾" : "▸"}
                  </span>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-gold-500/20 px-1.5 text-[0.65rem] text-gold-300">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                {activeFilterCount > 0 && (
                  <button type="button" className="link-quiet" onClick={onResetFilters}>
                    Reset
                  </button>
                )}
              </div>

              {panelOpen.filters && (
                <div className="panel-body">
                  <Field label="Rarity">
                    <div className="flex flex-wrap gap-1.5">
                      {filterOptions.rarities.map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => onToggleRarity(r.value)}
                          className={`chip ${
                            filters.rarities.includes(r.value) ? "chip-active" : ""
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Legacy" htmlFor="legacy-f">
                    <select
                      id="legacy-f"
                      className="select"
                      value={filters.legacy}
                      onChange={(e) => onFilterChange("legacy", e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="yes">Legacy only</option>
                      <option value="no">Non-legacy</option>
                    </select>
                  </Field>

                  <Field label="Base skins" htmlFor="base-f">
                    <select
                      id="base-f"
                      className="select"
                      value={filters.base}
                      onChange={(e) => onFilterChange("base", e.target.value)}
                    >
                      <option value="hide">Hide base</option>
                      <option value="all">Show all</option>
                      <option value="only">Base only</option>
                    </select>
                  </Field>

                  <Field label="Chromas" htmlFor="chroma-f">
                    <select
                      id="chroma-f"
                      className="select"
                      value={filters.hasChroma}
                      onChange={(e) => onFilterChange("hasChroma", e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="yes">Has chromas</option>
                      <option value="no">No chromas</option>
                    </select>
                  </Field>

                  <Field label="Champion" htmlFor="champ-f">
                    <select
                      id="champ-f"
                      className="select"
                      value={filters.championId}
                      onChange={(e) => onFilterChange("championId", e.target.value)}
                    >
                      <option value="">All champions</option>
                      {filterOptions.champions.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Series" htmlFor="line-f">
                    <select
                      id="line-f"
                      className="select"
                      value={filters.skinlineId}
                      onChange={(e) => onFilterChange("skinlineId", e.target.value)}
                    >
                      <option value="">All series</option>
                      {filterOptions.skinlines.map((l) => (
                        <option key={l.value} value={l.value}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}
            </div>
          )}

          <DetailPanel
            preview={preview}
            category={category}
            assetsProps={assetsProps}
            previewId={previewId}
            open={panelOpen.details}
            onToggle={() => onTogglePanel("details")}
          />
        </div>
      )}
    </aside>
  );
}
