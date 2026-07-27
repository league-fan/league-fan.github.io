import { SORT_OPTIONS } from "../../services/assets.js";
import { DENSITY_OPTIONS, PAGE_SIZE_OPTIONS } from "./constants.js";

function Control({ label, id, value, onChange, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <select
        id={id}
        className="select min-w-28"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
    </div>
  );
}

/** Fixed control strip above the gallery: display, data source, and ordering. */
export default function Toolbar({
  language,
  onLanguageChange,
  imageCdn,
  onImageCdnChange,
  densityId,
  onDensityChange,
  pageSize,
  onPageSizeChange,
  sortMode,
  onSortModeChange,
  groupMode,
  onGroupModeChange,
  canGroup,
  isSkins,
  isChampions,
  rangeLabel,
  shownCount,
  pageCurr,
  totalPages,
}) {
  return (
    <div className="z-10 flex flex-none flex-wrap items-end justify-between gap-x-4 gap-y-3 border-b border-ink-700/80 bg-ink-900/60 px-3 py-2.5 backdrop-blur-md">
      <div className="flex min-w-0 flex-wrap items-end gap-x-3 gap-y-2">
        <Control id="lang-select" label="Language" value={language} onChange={onLanguageChange}>
          <option value="chinese">中文</option>
          <option value="english">English</option>
        </Control>

        <Control id="cdn-select" label="Image CDN" value={imageCdn} onChange={onImageCdnChange}>
          <option value="auto">Auto</option>
          <option value="global">Global</option>
          <option value="cn">中国大陆</option>
        </Control>

        <Control
          id="density-select"
          label="Card size"
          value={String(densityId)}
          onChange={(v) => onDensityChange(Number(v))}
        >
          {DENSITY_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </Control>

        <Control
          id="pagesize-select"
          label="Per page"
          value={String(pageSize)}
          onChange={(v) => onPageSizeChange(Number(v))}
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Control>

        <Control id="sort-select" label="Sort" value={sortMode} onChange={onSortModeChange}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Control>

        {canGroup && (
          <Control
            id="group-select"
            label="Group by"
            value={groupMode}
            onChange={onGroupModeChange}
          >
            <option value="flat">Flat</option>
            {isSkins && <option value="champion">Hero</option>}
            {isSkins && <option value="skinline">Series</option>}
            {isChampions && <option value="role">Roles</option>}
          </Control>
        )}
      </div>

      <p className="text-[0.75rem] whitespace-nowrap text-muted">
        {rangeLabel} of{" "}
        <span className="font-medium text-parchment/85">
          {shownCount.toLocaleString()}
        </span>
        <span aria-hidden="true" className="px-1.5 text-ink-600">
          ·
        </span>
        page <span className="font-medium text-parchment/85">{pageCurr}</span> /{" "}
        <span className="font-medium text-parchment/85">{totalPages}</span>
      </p>
    </div>
  );
}
