import AssetThumb from "./AssetThumb.jsx";

function Cell({ item, itemKey, assetsProps, scale, selected, isSkins, isChampions, onSelect, onImgLoad }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-pressed={selected}
      className={`group min-w-0 cursor-pointer rounded-xl border p-1.5 text-left transition ${
        selected
          ? "border-gold-500 bg-gold-500/10 shadow-[0_0_18px_-6px_var(--color-gold-500)]"
          : "border-transparent hover:border-ink-600 hover:bg-ink-800/60"
      }`}
    >
      <AssetThumb
        src={item[assetsProps.src]}
        id={item[assetsProps.id]}
        name={item[assetsProps.title]}
        scale={scale}
        onLoaded={onImgLoad}
      />

      <div className="mt-1.5 min-w-0 px-0.5">
        <span
          className={`block truncate text-[0.72rem] font-medium ${
            selected ? "text-gold-300" : "text-parchment/90"
          }`}
        >
          {item[assetsProps.title]}
        </span>

        {isSkins && item.rarityName ? (
          <span className="mt-0.5 flex min-w-0 items-center gap-1 text-[0.66rem] text-muted">
            {item.rarityIcon && (
              <img
                src={item.rarityIcon}
                alt=""
                className="size-3 shrink-0 object-contain"
              />
            )}
            <span className="truncate">
              {item.rarityName}
              {item.chromaCount ? ` · ${item.chromaCount} chroma` : ""}
            </span>
          </span>
        ) : isChampions && item.rolesLabel ? (
          <span className="mt-0.5 block truncate text-[0.66rem] text-muted">
            {item.rolesLabel}
          </span>
        ) : item[assetsProps.description] ? (
          <span className="mt-0.5 block truncate text-[0.66rem] text-muted">
            {item[assetsProps.description]}
          </span>
        ) : null}

        {item._hasMedia && (
          <span className="mt-1 inline-block rounded-sm bg-teal-600/15 px-1 text-[0.58rem] font-semibold tracking-[0.08em] text-teal-500 uppercase">
            media
          </span>
        )}
      </div>
    </button>
  );
}

/** Paged asset grid, optionally split into labelled group sections. */
export default function AssetGrid({
  sections,
  gridTemplateColumns,
  itemKey,
  assetsProps,
  scale,
  previewId,
  isSkins,
  isChampions,
  onSelect,
  onImgLoad,
}) {
  return (
    <div>
      {sections.map((section) => (
        <section key={section.key}>
          {section.label && (
            <h3 className="mt-4 mb-2 flex items-baseline gap-2 border-b border-ink-700/70 pb-1.5 text-sm font-semibold text-gold-400 first:mt-0">
              {section.label}
              <span className="text-[0.7rem] font-normal text-muted">
                {section.items.length}
              </span>
            </h3>
          )}
          <div className="mb-3 grid gap-2" style={{ gridTemplateColumns }}>
            {section.items.map((item) => (
              <Cell
                key={itemKey(item)}
                item={item}
                itemKey={itemKey}
                assetsProps={assetsProps}
                scale={scale}
                selected={previewId === itemKey(item)}
                isSkins={isSkins}
                isChampions={isChampions}
                onSelect={onSelect}
                onImgLoad={onImgLoad}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
