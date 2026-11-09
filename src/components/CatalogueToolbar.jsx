import { useId, useRef, useState } from "react";

export default function CatalogueToolbar({ fields, count, hasSearch, pt, sort, view, onChange }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");
  const triggerRef = useRef(null);
  const filtersId = useId();
  const active = fields.filter(({ value }) => value);
  const title = pt ? "Filtros" : "Filters";
  const clear = () => onChange(Object.fromEntries(active.map(({ key }) => [key, null])));
  function closeOnEscape(event) {
    if (!open || event.key !== "Escape" || event.defaultPrevented) return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  async function share() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setLink(url);
    }
  }

  return (
    <div className="catalogue-controls" data-no-translate onKeyDown={closeOnEscape}>
      <div className="catalogue-bar" data-open={open}>
        {fields.length > 0 && (
          <button ref={triggerRef} type="button" className="catalogue-filter-trigger" aria-controls={filtersId} aria-expanded={open} onClick={() => { setOpen(!open); setCopied(false); setLink(""); }}>
            <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7h18M3 17h18M8 4v6m8 4v6" /></svg>
            {title}{active.length > 0 && <span className="catalogue-filter-number">{active.length}</span>}
          </button>
        )}
        {fields.length > 0 && (
          <div id={filtersId} className="catalogue-inline" role="group" aria-label={title} aria-hidden={!open} inert={!open}>
            {fields.map(({ key, label, value, options, emptyLabel }) => (
              <select key={key} aria-label={label} value={value || ""} onChange={(event) => onChange({ [key]: event.target.value || null })}>
                <option value="">{emptyLabel || (label === "Tipo de produto" || label === "Product type" ? (pt ? "Tipo" : "Type") : label)}</option>
                {value && !options.some(option => option.value === value) && <option value={value}>{value}</option>}
                {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            ))}
          </div>
        )}
        <div className="catalogue-meta">
          <p className="catalogue-result-count" role="status">
            {count} {pt ? (hasSearch ? (count === 1 ? "resultado" : "resultados") : (count === 1 ? "produto" : "produtos")) : (hasSearch ? "results" : "products shown")}
          </p>
          {count > 1 && (
            <select className="catalogue-sort" aria-label={pt ? "Ordenar produtos" : "Sort products"} value={sort} onChange={(event) => onChange({ sort: event.target.value === "featured" ? null : event.target.value })}>
              <option value="featured">{hasSearch ? (pt ? "Relevância" : "Relevance") : (pt ? "Destaques" : "Featured")}</option>
              <option value="name">{pt ? "Nome (A–Z)" : "Name (A–Z)"}</option>
            </select>
          )}
          {open && fields.length > 0 && (
            <details className="catalogue-more">
              <summary>{pt ? "Mais" : "More"}</summary>
              <div className="catalogue-more-panel">
                <label>{pt ? "Visualização" : "View"}
                  <select aria-label={pt ? "Visualização" : "View"} value={view} onChange={(event) => onChange({ view: event.target.value === "list" ? "list" : null })}>
                    <option value="grid">{pt ? "Grelha" : "Grid"}</option>
                    <option value="list">{pt ? "Lista" : "List"}</option>
                  </select>
                </label>
                <button type="button" className="catalogue-clear" onClick={share}>{pt ? "Copiar ligação atual" : "Copy current link"}</button>
                {copied && <p role="status">{pt ? "Ligação copiada." : "Link copied."}</p>}
                {link && <input aria-label={pt ? "Ligação para partilhar" : "Link to share"} readOnly value={link} onFocus={(event) => event.target.select()} />}
              </div>
            </details>
          )}
        </div>
      </div>
      {active.length > 0 && (
        <div className="catalogue-applied" role="group" aria-label={pt ? "Filtros aplicados" : "Applied filters"}>
          {active.map(({ key, value, options }) => {
            const label = options.find(option => option.value === value)?.label ?? value;
            return <button key={key} type="button" aria-label={pt ? `Retirar filtro: ${label}` : `Remove filter: ${label}`} onClick={() => onChange({ [key]: null })}>{label}<CloseIcon /></button>;
          })}
          <button type="button" className="catalogue-clear" onClick={clear}>{pt ? "Limpar filtros" : "Clear filters"}</button>
        </div>
      )}
    </div>
  );
}

function CloseIcon() {
  return <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="m4 4 8 8m0-8-8 8" /></svg>;
}
