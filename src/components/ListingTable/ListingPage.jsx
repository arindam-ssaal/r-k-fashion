/**
 * ListingPage.jsx  –  Reusable SAP B1-Inspired Listing Component
 *
 * Drop-in replacement for any master-data listing page.
 * Pass columns, rowData, stats, filterChips, toolbarActions and you're done.
 *
 * See README.md for full API docs and examples.
 */

import { useState, useMemo, useCallback } from "react";
import "./ListingPage.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── helpers ────────────────────────────────────────────────────────────────

function get(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function formatDate(val) {
  if (!val) return "—";
  // convert YYYY-MM-DD → DD-MM-YYYY for display
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
    const [y, m, d] = val.split("-");
    return `${d}-${m}-${y}`;
  }
  return val;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <span className="lp-sort-icon">⇅</span>;
  return <span className="lp-sort-icon">{sortDir === "asc" ? "▲" : "▼"}</span>;
}

/**
 * Badge  – render a colored badge from a preset or custom config.
 *
 * variant: "success"|"warning"|"error"|"info"|"purple"|"teal"|"neutral"
 */
function Badge({ children, variant = "neutral", dot = false, style }) {
  return (
    <span className={`lp-badge lp-badge-${variant}`} style={style}>
      {dot && <span className="lp-badge-dot" />}
      {children}
    </span>
  );
}

// ─── Cell renderer ───────────────────────────────────────────────────────────

/**
 * Renders a single cell based on column.type and column.render.
 *
 * Priority:
 *   1. column.render(value, row) — full custom renderer (JSX)
 *   2. column.type built-ins
 *   3. plain value
 */
function CellRenderer({ col, row, onView }) {
  const raw = get(row, col.field);

  // 1. Custom render
  if (col.render) {
    return <>{col.render(raw, row)}</>;
  }

  // 2. Built-in types
  switch (col.type) {
    case "code":
      return (
        <span
          className={`lp-cell-code${col.isLink ? " lp-cell-link" : ""}`}
          onClick={col.isLink && onView ? (e) => { e.stopPropagation(); onView(row); } : undefined}
        >
          {raw ?? "—"}
        </span>
      );

    case "link":
      return (
        <span
          className="lp-cell-link"
          onClick={onView ? (e) => { e.stopPropagation(); onView(row); } : undefined}
        >
          {raw ?? "—"}
        </span>
      );

    case "date":
      return <span>{formatDate(raw)}</span>;

    case "number":
      return (
        <span className="lp-cell-num">
          {raw != null ? Number(raw).toLocaleString("en-IN") : "—"}
        </span>
      );

    case "currency":
      return (
        <span className="lp-cell-num">
          {raw != null ? `₹ ${Number(raw).toLocaleString("en-IN")}` : "—"}
        </span>
      );

    case "badge": {
      /**
       * col.badgeMap: { [value]: { variant, label, dot } }
       * OR col.badgeFn(value, row) → { variant, label, dot }
       */
      let cfg;
      if (col.badgeFn) {
        cfg = col.badgeFn(raw, row);
      } else if (col.badgeMap) {
        cfg = col.badgeMap[raw] ?? { variant: "neutral", label: raw };
      } else {
        cfg = { variant: "neutral", label: raw };
      }
      return (
        <Badge variant={cfg.variant} dot={cfg.dot} style={cfg.style}>
          {cfg.label ?? raw ?? "—"}
        </Badge>
      );
    }

    case "boolean":
      return (
        <Badge variant={raw ? "success" : "warning"}>
          {raw ? (col.trueLabel ?? "Yes") : (col.falseLabel ?? "No")}
        </Badge>
      );

    case "checkbox":
      return (
        <input
          type="checkbox"
          checked={!!raw}
          readOnly
          style={{ accentColor: "var(--lp-brand)", cursor: "default" }}
          onClick={(e) => e.stopPropagation()}
        />
      );

    default:
      return (
        <span className={col.cellClass ?? ""}>
          {raw != null && raw !== "" ? String(raw) : "—"}
        </span>
      );
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * ListingPage
 *
 * Props — see README.md for full docs.
 */
export default function ListingPage({
  // ── Identity
  title = "Records",
  subtitle = "",
  titleIcon = "📋",

  // ── Data
  rowData = [],
  columns = [],
  rowKey = "id",
  loading = false,

  // ── Stats cards  [{ label, value, icon, iconClass, filterKey }]
  stats = [],

  // ── Filter chips  [{ key, label, chipClass, filterFn }]
  filterChips = [],
  defaultFilter = "all",

  // ── Search
  searchPlaceholder = "Search…",
  searchFields = [],          // [string] — fields to search; if empty, searches all string fields

  // ── Sorting
  defaultSortCol = "",
  defaultSortDir = "asc",

  // ── Pagination
  pageSize = 8,

  // ── Selection
  selectable = true,

  // ── Toolbar buttons  [{ label, icon, btnClass, onClick, showWhen: "always"|"selected"|"never" }]
  toolbarActions = [],

  // ── Row actions  [{ label, icon, title, btnClass, onClick }]
  //    onClick(row) is called with the full row object
  rowActions = [],

  // ── Title-bar primary button (usually "+ New")
  primaryAction = null,       // { label, icon, onClick }

  // ── Callbacks
  onView   = null,   // (row) => void  — called on row click / link click
  onEdit   = null,   // (row) => void
  onDelete = null,   // (row) => void

  // ── Empty state
  emptyIcon = "🔍",
  emptyText = "No records match the current criteria.",

  // ── Extra class on the wrapper
  className = "",

  // ── Layout mode: true = full listing page, false = stats section only
  listing = true,
}) {
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState(defaultFilter);
  const [sortCol, setSortCol]   = useState(defaultSortCol || (columns[0]?.field ?? ""));
  const [sortDir, setSortDir]   = useState(defaultSortDir);
  const [selected, setSelected] = useState(new Set());
  const [page, setPage]         = useState(1);

  // ── Filter + search ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rowData
      .filter((row) => {
        // chip filter
        const chip = filterChips.find((c) => c.key === filter);
        if (chip && chip.filterFn && !chip.filterFn(row)) return false;

        // search
        if (!q) return true;
        const haystack =
          searchFields.length > 0
            ? searchFields.map((f) => String(get(row, f) ?? "")).join(" ")
            : Object.values(row)
                .filter((v) => typeof v === "string" || typeof v === "number")
                .join(" ");
        return haystack.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        if (!sortCol) return 0;
        const av = String(get(a, sortCol) ?? "").toLowerCase();
        const bv = String(get(b, sortCol) ?? "").toLowerCase();
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
  }, [rowData, search, filter, filterChips, searchFields, sortCol, sortDir]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const goPage = useCallback((n) => setPage(Math.max(1, Math.min(n, totalPages))), [totalPages]);

  // ── Sorting ───────────────────────────────────────────────────────────────
  const toggleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  // ── Selection ─────────────────────────────────────────────────────────────
  const toggleRow = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allPageSelected =
    paginated.length > 0 && paginated.every((r) => selected.has(r[rowKey]));

  const toggleAllPage = (checked) => {
    setSelected((prev) => {
      const next = new Set(prev);
      paginated.forEach((r) =>
        checked ? next.add(r[rowKey]) : next.delete(r[rowKey])
      );
      return next;
    });
  };

  // ── Stats filter click ────────────────────────────────────────────────────
  const handleStatClick = (stat) => {
    if (stat.filterKey) {
      setFilter(stat.filterKey);
      setPage(1);
    }
  };

  // ── Chip click ────────────────────────────────────────────────────────────
  const handleChipClick = (key) => {
    setFilter(key);
    setPage(1);
  };

  // ── Reset / Refresh ───────────────────────────────────────────────────────
  const handleReset = () => {
    setSearch("");
    setFilter(defaultFilter);
    setSortCol(defaultSortCol || (columns[0]?.field ?? ""));
    setSortDir(defaultSortDir);
    setSelected(new Set());
    setPage(1);
  };

  // ── Rows to export: selected rows first, fallback to all filtered ─────────
  const getExportRows = useCallback(() => {
    if (selected.size > 0) {
      return filtered.filter((r) => selected.has(r[rowKey]));
    }
    return filtered;
  }, [filtered, selected, rowKey]);

  // ── Get plain text value for a column cell ────────────────────────────────
  const getPlainValue = (col, row) => {
    const raw = get(row, col.field);
    if (raw == null || raw === "") return "";
    switch (col.type) {
      case "date": return formatDate(raw);
      case "currency": return `₹ ${Number(raw).toLocaleString("en-IN")}`;
      case "number": return Number(raw);
      case "boolean": return raw ? (col.trueLabel ?? "Yes") : (col.falseLabel ?? "No");
      default: return String(raw);
    }
  };

  // ── Export as Excel ───────────────────────────────────────────────────────
  const handleExportExcel = () => {
    const exportRows = getExportRows();
    const headers = columns.map((c) => c.header ?? c.field);
    const data = exportRows.map((row) => {
      const obj = {};
      columns.forEach((col) => {
        obj[col.header ?? col.field] = getPlainValue(col, row);
      });
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 31));
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf], { type: "application/octet-stream" }),
      `${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // ── Export as PDF ─────────────────────────────────────────────────────────
  const handleExportPDF = () => {
    const exportRows = getExportRows();
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.text(title, 14, 15);
    doc.setFontSize(9);
    doc.text(
      `Exported: ${new Date().toLocaleString("en-IN")}  |  Records: ${exportRows.length}`,
      14,
      22
    );
    autoTable(doc, {
      startY: 27,
      head: [columns.map((c) => c.header ?? c.field)],
      body: exportRows.map((row) => columns.map((col) => getPlainValue(col, row))),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });
    doc.save(
      `${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`
    );
  };

  // ── Toolbar actions visibility ────────────────────────────────────────────
  const visibleToolbarActions = toolbarActions.filter((a) => {
    if (a.showWhen === "selected") return selected.size > 0;
    if (a.showWhen === "never") return false;
    return true; // "always" or undefined
  });

  // ── Page number array (max 7 visible) ─────────────────────────────────────
  const pageNums = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const delta = 2;
    const left  = Math.max(safePage - delta, 1);
    const right = Math.min(safePage + delta, totalPages);
    const nums  = [];
    if (left > 1) { nums.push(1); if (left > 2) nums.push("…"); }
    for (let i = left; i <= right; i++) nums.push(i);
    if (right < totalPages) { if (right < totalPages - 1) nums.push("…"); nums.push(totalPages); }
    return nums;
  }, [totalPages, safePage]);

  // ── Computed show-from / show-to ──────────────────────────────────────────
  const showFrom = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const showTo   = Math.min(safePage * pageSize, filtered.length);

  // ─────────────────────────────────────────────────────────────────────────

  // ── Stats-only mode ──────────────────────────────────────────────────────
  if (!listing) {
    return (
      <div className={`lp-wrapper${className ? " " + className : ""}`}>
        {/* ── Title Bar ── */}
        <div className="lp-title-bar">
          <div className="lp-title-left">
            <div className="lp-title-icon">{titleIcon}</div>
            <div>
              <div className="lp-title-text">{title}</div>
              {subtitle && <div className="lp-subtitle">{subtitle}</div>}
            </div>
          </div>
          {primaryAction && (
            <div className="lp-title-actions">
              <button
                className={`lp-btn lp-btn-accent${primaryAction.btnClass ? " " + primaryAction.btnClass : ""}`}
                onClick={primaryAction.onClick}
              >
                {primaryAction.icon && <span>{primaryAction.icon}</span>}
                {primaryAction.label}
              </button>
            </div>
          )}
        </div>

        {/* ── Stats Bar ── */}
        {stats.length > 0 && (
          <div
            className="lp-stats-bar"
            style={{ "--lp-stats-cols": Math.min(stats.length, 6) }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className={`lp-stat-card${s.filterKey && filter === s.filterKey ? " lp-stat-active-filter" : ""}`}
                onClick={() => handleStatClick(s)}
                title={s.filterKey ? `Filter by: ${s.label}` : undefined}
              >
                {s.icon && (
                  <div className={`lp-stat-icon${s.iconClass ? " " + s.iconClass : " blue"}`}>
                    {s.icon}
                  </div>
                )}
                <div>
                  <div className="lp-stat-value">{s.value}</div>
                  <div className="lp-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`lp-wrapper${className ? " " + className : ""}`}>

      {/* ── Title Bar ── */}
      <div className="lp-title-bar">
        <div className="lp-title-left">
          <div className="lp-title-icon">{titleIcon}</div>
          <div>
            <div className="lp-title-text">{title}</div>
            {subtitle && <div className="lp-subtitle">{subtitle}</div>}
          </div>
        </div>
        {primaryAction && (
          <div className="lp-title-actions">
            <button
              className={`lp-btn lp-btn-accent${primaryAction.btnClass ? " " + primaryAction.btnClass : ""}`}
              onClick={primaryAction.onClick}
            >
              {primaryAction.icon && <span>{primaryAction.icon}</span>}
              {primaryAction.label}
            </button>
          </div>
        )}
      </div>

      {/* ── Stats Bar ── */}
      {stats.length > 0 && (
        <div
          className="lp-stats-bar"
          style={{ "--lp-stats-cols": Math.min(stats.length, 6) }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className={`lp-stat-card${s.filterKey && filter === s.filterKey ? " lp-stat-active-filter" : ""}`}
              onClick={() => handleStatClick(s)}
              title={s.filterKey ? `Filter by: ${s.label}` : undefined}
            >
              {s.icon && (
                <div className={`lp-stat-icon${s.iconClass ? " " + s.iconClass : " blue"}`}>
                  {s.icon}
                </div>
              )}
              <div>
                <div className="lp-stat-value">{s.value}</div>
                <div className="lp-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="lp-toolbar">
        {/* Search */}
        <div className="lp-toolbar-group">
          <div className="lp-search-wrap">
            <span className="lp-search-icon">🔍</span>
            <input
              className="lp-search-input"
              value={search}
              placeholder={searchPlaceholder}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button className="lp-search-clear" onClick={() => setSearch("")}>×</button>
            )}
          </div>
        </div>

        <div className="lp-toolbar-sep" />

        {/* Static toolbar actions (showWhen: "always") */}
        <div className="lp-toolbar-group">
          {visibleToolbarActions
            .filter((a) => !a.showWhen || a.showWhen === "always")
            .map((a, i) => (
              <button
                key={i}
                className={`lp-btn lp-btn-sm${a.btnClass ? " " + a.btnClass : " lp-btn-secondary"}`}
                onClick={() => a.onClick(Array.from(selected))}
                disabled={a.disabled}
              >
                {a.icon && <span>{a.icon}</span>}
                {a.label}
              </button>
            ))}
        </div>

        {/* Selection-based toolbar actions */}
        {selected.size > 0 && (
          <>
            <div className="lp-toolbar-sep" />
            <div className="lp-selection-bar">
              <span className="lp-selection-label">{selected.size} selected</span>
              {visibleToolbarActions
                .filter((a) => a.showWhen === "selected")
                .map((a, i) => (
                  <button
                    key={i}
                    className={`lp-btn lp-btn-sm${a.btnClass ? " " + a.btnClass : " lp-btn-secondary"}`}
                    onClick={() => a.onClick(Array.from(selected))}
                  >
                    {a.icon && <span>{a.icon}</span>}
                    {a.label}
                  </button>
                ))}
            </div>
          </>
        )}
      </div>

      {/* ── Filter Chips ── */}
      {filterChips.length > 0 && (
        <div className="lp-filter-bar">
          {filterChips.map((c) => (
            <span
              key={c.key}
              className={`lp-chip${filter === c.key ? " lp-chip--active-filter " + (c.chipClass ?? "lp-chip-blue") : ""}`}
              onClick={() => handleChipClick(c.key)}
            >
              {c.label}
            </span>
          ))}
          <span className="lp-filter-count">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>
      )}

      {/* ── Table ── */}
      <div className="lp-table-container">
        {/* Table Header */}
        <div className="lp-table-header">
          <span>
            <span className="lp-table-title">{title} List</span>
            <span className="lp-table-count">({filtered.length} records)</span>
          </span>
          <span className="lp-table-header-right">
            <span className="lp-showing-text">
              {filtered.length > 0
                ? `Showing ${showFrom}–${showTo} of ${filtered.length}`
                : "No records"}
            </span>
            <div className="lp-export-actions">
              <button
                className="lp-btn lp-btn-sm lp-btn-pdf"
                title={selected.size > 0 ? `Download ${selected.size} selected rows as PDF` : "Download all as PDF"}
                onClick={handleExportPDF}
              >
                <span>📄</span>
                {selected.size > 0 ? `PDF (${selected.size})` : "PDF"}
              </button>
              <button
                className="lp-btn lp-btn-sm lp-btn-excel"
                title={selected.size > 0 ? `Download ${selected.size} selected rows as Excel` : "Download all as Excel"}
                onClick={handleExportExcel}
              >
                <span>📊</span>
                {selected.size > 0 ? `Excel (${selected.size})` : "Excel"}
              </button>
              <button
                className="lp-btn lp-btn-sm lp-btn-reset"
                title="Reset table to default state"
                onClick={handleReset}
              >
                <span>↺</span>
                Reset
              </button>
            </div>
          </span>
        </div>

        {/* Scrollable body */}
        <div className="lp-table-scroll">
          <table className="lp-table">
            <thead>
              <tr>
                {selectable && (
                  <th className="lp-th-checkbox">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={(e) => toggleAllPage(e.target.checked)}
                      style={{ accentColor: "var(--lp-brand)", cursor: "pointer" }}
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.field}
                    className={[
                      col.sortable !== false ? "lp-th-sortable" : "",
                      sortCol === col.field ? "lp-th-sorted" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={{ width: col.width, minWidth: col.minWidth }}
                    onClick={col.sortable !== false ? () => toggleSort(col.field) : undefined}
                  >
                    {col.header}
                    {col.sortable !== false && (
                      <SortIcon col={col.field} sortCol={sortCol} sortDir={sortDir} />
                    )}
                  </th>
                ))}
                {(rowActions.length > 0 || onView || onEdit || onDelete) && (
                  <th className="lp-th-actions" style={{ textAlign: "center" }}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {/* Loading skeletons */}
              {loading &&
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={`sk-${i}`} className="lp-loading-row">
                    {selectable && <td><div className="lp-skeleton-cell" style={{ width: 16, margin: "10px auto" }} /></td>}
                    {columns.map((col) => (
                      <td key={col.field}>
                        <div
                          className="lp-skeleton-cell"
                          style={{ width: `${50 + Math.random() * 40}%` }}
                        />
                      </td>
                    ))}
                    {(rowActions.length > 0 || onView || onEdit || onDelete) && <td />}
                  </tr>
                ))}

              {/* Empty state */}
              {!loading && paginated.length === 0 && (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0) + (rowActions.length > 0 || onView || onEdit || onDelete ? 1 : 0)}>
                    <div className="lp-empty">
                      <div className="lp-empty-icon">{emptyIcon}</div>
                      <div className="lp-empty-text">{emptyText}</div>
                    </div>
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!loading &&
                paginated.map((row) => {
                  const id = row[rowKey];
                  return (
                    <tr
                      key={id}
                      className={selected.has(id) ? "lp-row-selected" : ""}
                      onClick={() => onView && onView(row)}
                    >
                      {selectable && (
                        <td onClick={(e) => { e.stopPropagation(); toggleRow(id); }}>
                          <input
                            type="checkbox"
                            checked={selected.has(id)}
                            onChange={() => {}}
                            style={{ accentColor: "var(--lp-brand)", cursor: "pointer" }}
                          />
                        </td>
                      )}

                      {columns.map((col) => (
                        <td
                          key={col.field}
                          className={col.cellClass ?? ""}
                          style={col.tdStyle}
                        >
                          <CellRenderer col={col} row={row} onView={onView} />
                        </td>
                      ))}

                      {/* Actions column */}
                      {(rowActions.length > 0 || onView || onEdit || onDelete) && (
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="lp-row-actions">
                            {/* Built-in shortcuts */}
                            {onView && (
                              <button
                                className="lp-btn lp-btn-icon lp-btn-ghost lp-btn-sm"
                                title="View"
                                onClick={() => onView(row)}
                              >
                                👁
                              </button>
                            )}
                            {onEdit && (
                              <button
                                className="lp-btn lp-btn-icon lp-btn-ghost lp-btn-sm"
                                title="Edit"
                                onClick={() => onEdit(row)}
                              >
                                ✏️
                              </button>
                            )}
                            {onDelete && (
                              <button
                                className="lp-btn lp-btn-icon lp-btn-ghost lp-btn-sm"
                                title="Delete"
                                onClick={() => onDelete(row)}
                              >
                                🗑
                              </button>
                            )}
                            {/* Custom row actions */}
                            {rowActions.map((a, i) => (
                              <button
                                key={i}
                                className={`lp-btn lp-btn-icon lp-btn-sm${a.btnClass ? " " + a.btnClass : " lp-btn-ghost"}`}
                                title={a.title ?? a.label}
                                onClick={() => a.onClick(row)}
                              >
                                {a.icon}
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="lp-pagination">
          <span className="lp-page-info">
            Rows per page: {pageSize} · Page {safePage} of {totalPages}
          </span>
          <div className="lp-page-btns">
            <button className="lp-page-btn" disabled={safePage === 1} onClick={() => goPage(1)}>«</button>
            <button className="lp-page-btn" disabled={safePage === 1} onClick={() => goPage(safePage - 1)}>‹</button>
            {pageNums.map((n, i) =>
              n === "…" ? (
                <span key={`el-${i}`} style={{ padding: "0 4px", color: "var(--lp-text-subtle)", fontSize: 13 }}>…</span>
              ) : (
                <button
                  key={n}
                  className={`lp-page-btn${n === safePage ? " lp-page-btn--active" : ""}`}
                  onClick={() => goPage(n)}
                >
                  {n}
                </button>
              )
            )}
            <button className="lp-page-btn" disabled={safePage === totalPages} onClick={() => goPage(safePage + 1)}>›</button>
            <button className="lp-page-btn" disabled={safePage === totalPages} onClick={() => goPage(totalPages)}>»</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Re-export Badge for external use ────────────────────────────────────────
export { Badge };
