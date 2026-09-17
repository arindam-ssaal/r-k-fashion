// DataTable.jsx – Reusable data-table component (AG Grid-style API)
// Dependencies: React
import { useState, useEffect, useRef } from "react";

// ============================================================
// CSS STYLES (scoped with sdt- prefix)
// ============================================================
const DT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

  .sdt-root {
    --sdt-brand: #0089b5; --sdt-brand-dark: #007a9e; --sdt-brand-light: rgba(0,137,181,0.15);
    --sdt-text: black; --sdt-text-muted: black;
    --sdt-border: #242d3d; --sdt-bg: #0f1729; --sdt-white: #0f1729;
    --sdt-input-border: #2d3a4d;
    --sdt-error: #ef4444; --sdt-success: #22c55e; --sdt-warning: #f59e0b;
    --sdt-row-hover: #1a2940; --sdt-row-selected: #1c3350;
    --sdt-radius: 4px; --sdt-shadow: 0 2px 8px rgba(0,0,0,0.3);
    font-family: 'IBM Plex Sans', Arial, sans-serif;
    font-size: 13px;
    color: var(--sdt-text);
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .sdt-toolbar { display: flex; align-items: center; gap: 8px; padding: 10px 24px; background: #d6eaf8; flex-wrap: wrap; flex-shrink: 0; }
  .sdt-toolbar-left { display: flex; align-items: center; gap: 8px; flex: 1; flex-wrap: wrap; }
  .sdt-toolbar-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

  .sdt-search-wrap { position: relative; display: flex; align-items: center; }
  .sdt-search-icon { position: absolute; left: 10px; color: var(--sdt-text-muted); pointer-events: none; }
  // .sdt-search-input { height: 32px; border: 1px solid var(--sdt-input-border); border-radius: var(--sdt-radius); padding: 0 10px 0 34px; font-size: 13px; color: var(--sdt-text); background: #0f1729; outline: none; width: 260px; font-family: inherit; }
  .sdt-search-input { height: 32px; border: 1px solid var(--sdt-input-border); border-radius: var(--sdt-radius); padding: 0 10px 0 34px; font-size: 13px; color: black; background: white; outline: none; width: 260px; font-family: inherit; }
  .sdt-search-input:focus { border-color: var(--sdt-brand); box-shadow: 0 0 0 2px rgba(10,110,209,.15); }

  .sdt-btn { height: 32px; padding: 0 16px; border-radius: var(--sdt-radius); font-size: 13px; cursor: pointer; font-weight: 400; transition: all .15s; display: inline-flex; align-items: center; gap: 6px; font-family: inherit; border: 1px solid transparent; white-space: nowrap; }
  .sdt-btn-primary { background: var(--sdt-brand); color: #fff; border-color: var(--sdt-brand); }
  .sdt-btn-primary:hover { background: var(--sdt-brand-dark); }
  // .sdt-btn-ghost { background: #1c2640; color: var(--sdt-text); border-color: var(--sdt-border); }
  .sdt-btn-ghost { background: white; color: black; border-color: var(--sdt-border); }
  .sdt-btn-ghost:hover { background: white; border-color: var(--sdt-input-border); }
  .sdt-btn-danger { background: #1c2640; color: var(--sdt-error); border-color: var(--sdt-error); }
  .sdt-btn-danger:hover { background: rgba(239,68,68,0.15); }
  .sdt-btn-success { background: #1c2640; color: var(--sdt-success); border-color: var(--sdt-success); }
  .sdt-btn-success:hover { background: rgba(34,197,94,0.15); }
  .sdt-btn-warning { background: #1c2640; color: var(--sdt-warning); border-color: var(--sdt-warning); }
  .sdt-btn-warning:hover { background: rgba(245,158,11,0.15); }
  .sdt-btn-icon { width: 32px; padding: 0; justify-content: center; }
  .sdt-btn:disabled { opacity: .5; cursor: not-allowed; }
  .sdt-filter-count-badge { background: var(--sdt-brand); color: #fff; border-radius: 8px; font-size: 10px; padding: 0 5px; font-weight: 700; }

  // .sdt-filter-bar { display: flex; padding: 10px 24px; background: #0d1420; border-bottom: 1px solid var(--sdt-border); gap: 10px; flex-wrap: wrap; align-items: flex-end; flex-shrink: 0; }
  .sdt-filter-bar { display: flex; padding: 10px 24px; background: #d6eaf8; border-bottom: 0px solid var(--sdt-border); gap: 10px; flex-wrap: wrap; align-items: flex-end; flex-shrink: 0; }
  .sdt-filter-group { display: flex; flex-direction: column; gap: 3px; }
  .sdt-filter-group label { font-size: 11px; color: var(--sdt-text-muted); font-weight: 500; }
  .sdt-filter-group select, .sdt-filter-group input { height: 28px; border: 1px solid var(--sdt-input-border); border-radius: var(--sdt-radius); padding: 0 8px; font-size: 12px; color: var(--sdt-text); outline: none; font-family: inherit; background: #1c2640; }
  .sdt-filter-group select:focus, .sdt-filter-group input:focus { border-color: var(--sdt-brand); }

  .sdt-filter-tags { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; padding: 6px 24px; background: #0d1420; border-bottom: 1px solid var(--sdt-border); }
  .sdt-filter-tag { display: inline-flex; align-items: center; gap: 4px; background: var(--sdt-brand-light); color: var(--sdt-brand); border: 1px solid rgba(0,137,181,0.3); border-radius: 10px; font-size: 11px; padding: 2px 8px; font-weight: 500; }
  .sdt-filter-tag-rm { background: none; border: none; cursor: pointer; color: var(--sdt-brand); font-size: 14px; line-height: 1; padding: 0; margin-left: 2px; }

  .sdt-selection-bar { display: flex; align-items: center; gap: 8px; padding: 8px 24px; background: var(--sdt-brand-light); border-bottom: 1px solid rgba(0,137,181,0.3); flex-shrink: 0; }
  .sdt-selection-bar > span { font-size: 13px; color: var(--sdt-brand); font-weight: 500; }
  .sdt-sel-spacer { flex: 1; }

  .sdt-table-area { flex: 1; overflow: auto; padding: 16px 24px; }
  .sdt-table-card { background: #fff; border: 1px solid var(--sdt-border); border-radius: var(--sdt-radius); overflow: hidden; box-shadow: var(--sdt-shadow); }

  .sdt-root table { width: 100%; border-collapse: collapse; }
  .sdt-root thead th { background: #fff; color: var(--sdt-text); font-size: 12px; font-weight: 600; padding: 10px 12px; text-align: left; border-bottom: 2px solid var(--sdt-border); white-space: nowrap; position: sticky; top: 0; z-index: 2; }
  .sdt-root thead th.sdt-sortable { cursor: pointer; user-select: none; }
  .sdt-root thead th.sdt-sortable:hover { background: #f0f0f0; color: var(--sdt-brand); }
  .sdt-th-inner { display: flex; align-items: center; gap: 6px; }
  .sdt-sort-icon { font-size: 10px; color: var(--sdt-text-muted); }
  .sdt-sort-icon.sdt-active { color: var(--sdt-brand); }
  .sdt-col-cb { width: 40px; }
  .sdt-col-sn { width: 50px; text-align: center; }
  .sdt-col-actions { text-align: center; }

  .sdt-root tbody tr { border-bottom: 1px solid var(--sdt-border); transition: background .1s; }
  .sdt-root tbody tr:last-child { border-bottom: none; }
  .sdt-root tbody tr:hover { background: #f5f5f5; }
  .sdt-root tbody tr.sdt-selected { background: var(--sdt-row-selected); }
  .sdt-root tbody td { padding: 9px 12px; font-size: 13px; color: var(--sdt-text); vertical-align: middle; }
  .sdt-root tbody td.sdt-col-sn { text-align: center; color: var(--sdt-text-muted); font-size: 12px; }
  .sdt-root tbody td.sdt-col-actions { text-align: center; }

  .sdt-root input[type="checkbox"] { accent-color: var(--sdt-brand); width: 15px; height: 15px; cursor: pointer; }

  .sdt-badge-type { display: inline-flex; align-items: center; justify-content: center; background: var(--sdt-brand-light); color: var(--sdt-brand); border: 1px solid rgba(0,137,181,0.3); border-radius: 3px; font-size: 11px; font-weight: 600; width: 26px; height: 20px; font-family: 'IBM Plex Mono', monospace; }
  .sdt-status-pill { display: inline-flex; align-items: center; gap: 4px; border-radius: 10px; font-size: 11px; font-weight: 500; padding: 2px 10px; }
  .sdt-status-active { background: rgba(34,197,94,0.15); color: var(--sdt-success); border: 1px solid rgba(34,197,94,0.3); }
  .sdt-status-inactive { background: rgba(245,158,11,0.15); color: var(--sdt-warning); border: 1px solid rgba(245,158,11,0.3); }
  .sdt-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .sdt-dot-active { background: var(--sdt-success); }
  .sdt-dot-inactive { background: var(--sdt-warning); }

  .sdt-action-btn { background: none; border: none; cursor: pointer; padding: 4px 6px; border-radius: 3px; color: var(--sdt-text-muted); transition: all .12s; font-size: 12px; display: inline-flex; align-items: center; }
  .sdt-action-btn:hover { background: var(--sdt-brand-light); color: var(--sdt-brand); }
  .sdt-action-btn.sdt-action-danger:hover { background: rgba(239,68,68,0.15); color: var(--sdt-error); }
  .sdt-action-btn.sdt-action-warning:hover { background: rgba(245,158,11,0.15); color: var(--sdt-warning); }
  .sdt-action-btn.sdt-action-success:hover { background: rgba(34,197,94,0.15); color: var(--sdt-success); }

  .sdt-table-footer { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: #fff; border-top: 1px solid var(--sdt-border); gap: 12px; flex-wrap: wrap; }
  .sdt-footer-info { font-size: 12px; color: var(--sdt-text-muted); }
  .sdt-footer-info strong { color: var(--sdt-text); }
  .sdt-pagination { display: flex; align-items: center; gap: 4px; }
  .sdt-pg-btn { height: 28px; min-width: 28px; padding: 0 8px; border: 1px solid var(--sdt-border); border-radius: var(--sdt-radius); background: #0f1729; font-size: 12px; cursor: pointer; color: var(--sdt-text); transition: all .12s; display: inline-flex; align-items: center; justify-content: center; font-family: inherit; }
  .sdt-pg-btn:hover:not(:disabled) { border-color: var(--sdt-brand); color: var(--sdt-brand); background: rgba(0,137,181,0.15); }
  .sdt-pg-btn.sdt-pg-active { background: var(--sdt-brand); color: #fff; border-color: var(--sdt-brand); }
  .sdt-pg-btn:disabled { opacity: .4; cursor: not-allowed; }
  .sdt-pg-ellipsis { font-size: 12px; color: var(--sdt-text-muted); padding: 0 4px; }
  .sdt-page-size-wrap { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--sdt-text-muted); }
  .sdt-page-size-wrap select { height: 28px; border: 1px solid var(--sdt-border); border-radius: var(--sdt-radius); padding: 0 6px; font-size: 12px; outline: none; font-family: inherit; background: #1c2640; color: var(--sdt-text); }

  .sdt-col-chooser-wrap { position: relative; }
  .sdt-col-chooser { position: absolute; right: 0; top: 36px; background: #1c2640; border: 1px solid var(--sdt-border); border-radius: var(--sdt-radius); box-shadow: 0 4px 16px rgba(0,0,0,0.4); padding: 12px; min-width: 180px; z-index: 50; }
  .sdt-col-chooser label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--sdt-text); padding: 4px 0; cursor: pointer; }

  .sdt-empty-state { text-align: center; padding: 48px 20px; color: var(--sdt-text-muted); }
  .sdt-empty-icon { font-size: 40px; margin-bottom: 12px; opacity: .4; }
  .sdt-empty-state h3 { font-size: 15px; font-weight: 500; color: var(--sdt-text); margin-bottom: 6px; }
`;

// ============================================================
// ICONS (internal)
// ============================================================
const DtIcons = {
  Search: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  Filter: () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Excel: () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="2" fill="#E8F5E9" stroke="#107E3E" strokeWidth="1.2"/><path d="M4 5l3 3-3 3M9 11h3" stroke="#107E3E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Cols: () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="2" rx="1" fill="currentColor"/><rect x="1" y="7" width="14" height="2" rx="1" fill="currentColor"/><rect x="1" y="11" width="14" height="2" rx="1" fill="currentColor"/></svg>,
};

// ============================================================
// EXPORTED CELL-RENDERER HELPERS
// ============================================================

export function StatusPill({ value }) {
  const cls = value.toLowerCase();
  return (
    <span className={`sdt-status-pill sdt-status-${cls}`}>
      <span className={`sdt-status-dot sdt-dot-${cls}`} />
      {value}
    </span>
  );
}

export function TypeBadge({ value }) {
  return <span className="sdt-badge-type">{value}</span>;
}

// ============================================================
// DATATABLE COMPONENT
// ============================================================

/**
 * @param {object} props
 * @param {Array} props.columns - Column definitions (see docs)
 * @param {Array} props.rowData - Array of data objects
 * @param {string} [props.rowIdField="id"] - Unique ID field name in each row
 * @param {boolean} [props.globalSearch=true] - Show global search bar
 * @param {string} [props.searchPlaceholder] - Search input placeholder
 * @param {boolean} [props.columnChooser=true] - Show column visibility toggle
 * @param {boolean} [props.exportable=true] - Show Export to Excel button
 * @param {string} [props.exportFileName="export"] - CSV download filename
 * @param {boolean} [props.pagination=true] - Enable pagination
 * @param {number} [props.defaultPageSize=30] - Initial page size
 * @param {Array<number>} [props.pageSizeOptions=[30,40,50]] - Page size dropdown options
 * @param {boolean} [props.rowSelection=false] - Enable row checkboxes
 * @param {boolean} [props.serialNumber=true] - Show S.No. column
 * @param {string} [props.defaultSortField] - Initial sort column field
 * @param {"asc"|"desc"} [props.defaultSortDir="asc"] - Initial sort direction
 * @param {Array} [props.actions] - Row action button definitions
 * @param {Array} [props.bulkActions] - Bulk action definitions for selected rows
 * @param {Function} [props.onAdd] - Callback for Add New button (shows button when provided)
 * @param {string} [props.addButtonLabel="Add New"] - Add button text
 * @param {React.ReactNode} [props.toolbarLeft] - Extra content for toolbar left
 * @param {React.ReactNode} [props.toolbarRight] - Extra content for toolbar right
 * @param {Function} [props.onSelectionChange] - Callback when selection changes
 * @param {string} [props.emptyMessage] - Empty state heading
 * @param {string} [props.emptySubMessage] - Empty state subtext
 * @param {number} [props.actionsColumnWidth] - Actions column width in px
 */
export default function DataTable({
  columns,
  rowData,
  rowIdField = "id",
  globalSearch: enableSearch = true,
  searchPlaceholder = "Search across all columns…",
  columnChooser: enableColumnChooser = true,
  exportable = true,
  exportFileName = "export",
  pagination: enablePagination = true,
  defaultPageSize = 30,
  pageSizeOptions = [30, 40, 50],
  rowSelection = false,
  serialNumber = true,
  defaultSortField,
  defaultSortDir = "asc",
  actions,
  bulkActions,
  onAdd,
  addButtonLabel = "Add New",
  toolbarLeft,
  toolbarRight,
  onSelectionChange,
  emptyMessage = "No records found",
  emptySubMessage = "Try adjusting your search or filter criteria.",
  actionsColumnWidth,
}) {
  // ---- STATE ----
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [sortField, setSortField] = useState(defaultSortField || "");
  const [sortDir, setSortDir] = useState(defaultSortDir);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selected, setSelected] = useState(new Set());
  const [visibleCols, setVisibleCols] = useState(() => {
    const v = {};
    columns.forEach(c => { v[c.field] = !c.hide; });
    return v;
  });
  const [showColChooser, setShowColChooser] = useState(false);
  const colRef = useRef(null);

  // Close column-chooser on outside click
  useEffect(() => {
    const handler = (e) => {
      if (colRef.current && !colRef.current.contains(e.target)) setShowColChooser(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Notify consumer of selection changes
  useEffect(() => {
    onSelectionChange?.(selected);
  }, [selected]);

  // ---- FILTER DEFINITIONS ----
  const filterColumns = columns.filter(c => c.filter);

  const filterTagDefs = [];
  filterColumns.forEach(col => {
    const f = col.filter;
    if (f.type === "dateRange") {
      filterTagDefs.push({
        key: `${col.field}_from`,
        label: (v) => `${f.fromLabel || col.headerName} ≥ ${v}`,
      });
      filterTagDefs.push({
        key: `${col.field}_to`,
        label: (v) => `${f.toLabel || col.headerName} ≤ ${v}`,
      });
    } else {
      filterTagDefs.push({
        key: col.field,
        label: (v) => {
          let display = v;
          if (f.type === "select" && f.options) {
            const opt = f.options.find(o => (typeof o === "object" ? o.value : o) === v);
            if (opt && typeof opt === "object") display = opt.label;
          }
          return `${col.headerName}: ${display}`;
        },
      });
    }
  });

  const activeTags = filterTagDefs.filter(d => filters[d.key]);
  const filterCount = activeTags.length;

  // ---- FILTER + SORT ----
  const filtered = (() => {
    const q = searchTerm.toLowerCase();
    let rows = rowData.filter(row => {
      // Global search
      if (q) {
        const hay = columns.map(c => {
          const val = row[c.field];
          if (c.valueFormatter) return c.valueFormatter(val, row);
          return String(val ?? "");
        }).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      // Column filters
      for (const col of filterColumns) {
        const f = col.filter;
        if (f.type === "text") {
          const fv = filters[col.field];
          if (fv && !String(row[col.field] ?? "").toLowerCase().includes(fv.toLowerCase())) return false;
        } else if (f.type === "select") {
          const fv = filters[col.field];
          if (fv && String(row[col.field]) !== fv) return false;
        } else if (f.type === "date") {
          const fv = filters[col.field];
          if (fv && String(row[col.field] ?? "") !== fv) return false;
        } else if (f.type === "dateRange") {
          const from = filters[`${col.field}_from`];
          const to = filters[`${col.field}_to`];
          const val = String(row[col.field] ?? "");
          if (from && val < from) return false;
          if (to && val > to) return false;
        }
      }
      return true;
    });

    if (sortField) {
      rows = [...rows].sort((a, b) => {
        const va = a[sortField] ?? "";
        const vb = b[sortField] ?? "";
        if (typeof va === "number" && typeof vb === "number")
          return sortDir === "asc" ? va - vb : vb - va;
        return sortDir === "asc"
          ? String(va).localeCompare(String(vb))
          : String(vb).localeCompare(String(va));
      });
    }
    return rows;
  })();

  // ---- PAGINATION ----
  const totalPages = enablePagination ? Math.max(1, Math.ceil(filtered.length / pageSize)) : 1;
  const safePage = Math.min(page, totalPages);
  const slice = enablePagination
    ? filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
    : filtered;
  const startNum = (safePage - 1) * pageSize + 1;
  const endNum = Math.min(safePage * pageSize, filtered.length);

  // ---- SORT ----
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(p => (p === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  // ---- SELECTION ----
  const visibleIds = slice.map(r => r[rowIdField]);
  const allChecked = visibleIds.length > 0 && visibleIds.every(id => selected.has(id));
  const someChecked = visibleIds.some(id => selected.has(id)) && !allChecked;

  const toggleSelectAll = () => {
    setSelected(p => {
      const s = new Set(p);
      if (allChecked) visibleIds.forEach(id => s.delete(id));
      else visibleIds.forEach(id => s.add(id));
      return s;
    });
  };

  const toggleRow = (id) =>
    setSelected(p => {
      const s = new Set(p);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });

  // ---- EXPORT ----
  const exportCSV = () => {
    const visCols = columns.filter(c => visibleCols[c.field]);
    const headers = [...(serialNumber ? ["S.No."] : []), ...visCols.map(c => c.headerName)];
    const rows = filtered.map((r, i) => [
      ...(serialNumber ? [i + 1] : []),
      ...visCols.map(c => {
        if (c.exportValue) return c.exportValue(r[c.field], r);
        if (c.valueFormatter) return c.valueFormatter(r[c.field], r);
        return String(r[c.field] ?? "");
      }),
    ]);
    const csv =
      headers.join(",") +
      "\n" +
      rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportFileName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ---- FILTER HELPERS ----
  const clearFilter = (key) => {
    setFilters(p => ({ ...p, [key]: "" }));
    setPage(1);
  };
  const clearAllFilters = () => {
    setFilters({});
    setPage(1);
  };

  // ---- PAGINATION HELPERS ----
  const pagesToShow = (cur, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const s = new Set([1, total, cur]);
    for (let d = 1; d <= 2; d++) {
      if (cur - d >= 1) s.add(cur - d);
      if (cur + d <= total) s.add(cur + d);
    }
    return [...s].sort((a, b) => a - b);
  };
  const pgList = pagesToShow(safePage, totalPages);

  // ---- INTERNAL SUB-COMPONENTS ----
  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="sdt-sort-icon">▲</span>;
    return <span className="sdt-sort-icon sdt-active">{sortDir === "asc" ? "▲" : "▼"}</span>;
  };

  const TH = ({ field, label, style }) => (
    <th className="sdt-sortable" onClick={() => handleSort(field)} style={style}>
      <div className="sdt-th-inner">
        {label} <SortIcon field={field} />
      </div>
    </th>
  );

  const visibleColumns = columns.filter(c => visibleCols[c.field]);
  const hasActions = actions && actions.length > 0;

  const actionVariantClass = (v) => {
    if (v === "danger") return " sdt-action-danger";
    if (v === "warning") return " sdt-action-warning";
    if (v === "success") return " sdt-action-success";
    return "";
  };

  const bulkVariantClass = (v) => {
    if (v === "danger") return "sdt-btn-danger";
    if (v === "success") return "sdt-btn-success";
    if (v === "warning") return "sdt-btn-warning";
    return "sdt-btn-ghost";
  };

  // ---- RENDER ----
  return (
    <>
      <style>{DT_STYLES}</style>
      <div className="sdt-root">
        {/* TOOLBAR */}
        <div className="sdt-toolbar">
          <div className="sdt-toolbar-left">
            {enableSearch && (
              <div className="sdt-search-wrap">
                <span className="sdt-search-icon"><DtIcons.Search /></span>
                <input
                  className="sdt-search-input"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                />
              </div>
            )}
            {filterColumns.length > 0 && (
              <button className="sdt-btn sdt-btn-ghost" onClick={() => setShowFilter(p => !p)}>
                <DtIcons.Filter /> Filter
                {filterCount > 0 && <span className="sdt-filter-count-badge">{filterCount}</span>}
              </button>
            )}
            {toolbarLeft}
          </div>
          <div className="sdt-toolbar-right">
            {exportable && (
              <button className="sdt-btn sdt-btn-ghost" onClick={exportCSV}>
                <DtIcons.Excel /> Export to Excel
              </button>
            )}
            {enableColumnChooser && (
              <div className="sdt-col-chooser-wrap" ref={colRef}>
                <button className="sdt-btn sdt-btn-ghost" onClick={() => setShowColChooser(p => !p)}>
                  <DtIcons.Cols /> Columns
                </button>
                {showColChooser && (
                  <div className="sdt-col-chooser">
                    {columns.map(c => (
                      <label key={c.field}>
                        <input
                          type="checkbox"
                          checked={visibleCols[c.field] ?? true}
                          onChange={e => setVisibleCols(p => ({ ...p, [c.field]: e.target.checked }))}
                        />
                        {c.headerName}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {toolbarRight}
            {onAdd && (
              <button className="sdt-btn sdt-btn-primary" onClick={onAdd}>
                <DtIcons.Plus /> {addButtonLabel}
              </button>
            )}
          </div>
        </div>

        {/* FILTER BAR */}
        {showFilter && (
          <div className="sdt-filter-bar">
            {filterColumns.map(col => {
              const f = col.filter;
              if (f.type === "text") {
                return (
                  <div className="sdt-filter-group" key={col.field}>
                    <label>{f.label || col.headerName}</label>
                    <input
                      style={{ width: f.width || 160 }}
                      value={filters[col.field] || ""}
                      placeholder={f.placeholder || `Filter ${col.headerName.toLowerCase()}…`}
                      onChange={e => { setFilters(p => ({ ...p, [col.field]: e.target.value })); setPage(1); }}
                    />
                  </div>
                );
              }
              if (f.type === "select") {
                const opts = f.options || [];
                return (
                  <div className="sdt-filter-group" key={col.field}>
                    <label>{f.label || col.headerName}</label>
                    <select
                      value={filters[col.field] || ""}
                      onChange={e => { setFilters(p => ({ ...p, [col.field]: e.target.value })); setPage(1); }}
                    >
                      <option value="">All</option>
                      {opts.map(o =>
                        typeof o === "object"
                          ? <option key={o.value} value={o.value}>{o.label}</option>
                          : <option key={o} value={o}>{o}</option>
                      )}
                    </select>
                  </div>
                );
              }
              if (f.type === "date") {
                return (
                  <div className="sdt-filter-group" key={col.field}>
                    <label>{f.label || col.headerName}</label>
                    <input
                      type="date"
                      style={{ width: f.width || 140 }}
                      value={filters[col.field] || ""}
                      onChange={e => { setFilters(p => ({ ...p, [col.field]: e.target.value })); setPage(1); }}
                    />
                  </div>
                );
              }
              if (f.type === "dateRange") {
                return (
                  <span key={col.field} style={{ display: "contents" }}>
                    <div className="sdt-filter-group">
                      <label>{f.fromLabel || `${col.headerName} From`}</label>
                      <input
                        type="date"
                        style={{ width: f.width || 140 }}
                        value={filters[`${col.field}_from`] || ""}
                        onChange={e => { setFilters(p => ({ ...p, [`${col.field}_from`]: e.target.value })); setPage(1); }}
                      />
                    </div>
                    <div className="sdt-filter-group">
                      <label>{f.toLabel || `${col.headerName} To`}</label>
                      <input
                        type="date"
                        style={{ width: f.width || 140 }}
                        value={filters[`${col.field}_to`] || ""}
                        onChange={e => { setFilters(p => ({ ...p, [`${col.field}_to`]: e.target.value })); setPage(1); }}
                      />
                    </div>
                  </span>
                );
              }
              return null;
            })}
            <button className="sdt-btn sdt-btn-ghost" style={{ marginTop: 16 }} onClick={clearAllFilters}>
              Clear Filters
            </button>
          </div>
        )}

        {/* FILTER TAGS */}
        {activeTags.length > 0 && (
          <div className="sdt-filter-tags">
            {activeTags.map(d => (
              <span className="sdt-filter-tag" key={d.key}>
                {d.label(filters[d.key])}
                <button className="sdt-filter-tag-rm" onClick={() => clearFilter(d.key)}>×</button>
              </span>
            ))}
          </div>
        )}

        {/* SELECTION BAR */}
        {rowSelection && selected.size > 0 && (
          <div className="sdt-selection-bar">
            <span>{selected.size} row{selected.size > 1 ? "s" : ""} selected</span>
            <div className="sdt-sel-spacer" />
            {bulkActions?.map((ba, i) => (
              <button
                key={i}
                className={`sdt-btn ${bulkVariantClass(ba.variant)}${ba.iconOnly ? " sdt-btn-icon" : ""}`}
                title={ba.title}
                onClick={() => {
                  const selectedRows = rowData.filter(r => selected.has(r[rowIdField]));
                  ba.onClick(new Set(selected), selectedRows);
                }}
              >
                {ba.icon}
                {ba.label && <span>{ba.label}</span>}
              </button>
            ))}
            <button className="sdt-btn sdt-btn-ghost" onClick={() => setSelected(new Set())}>Clear</button>
          </div>
        )}

        {/* TABLE */}
        <div className="sdt-table-area">
          <div className="sdt-table-card">
            <table>
              <thead style={{color: '#fff'}}>
                <tr>
                  {rowSelection && (
                    <th className="sdt-col-cb">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        ref={el => { if (el) el.indeterminate = someChecked; }}
                        onChange={toggleSelectAll}
                      />
                    </th>
                  )}
                  {serialNumber && <th className="sdt-col-sn">S.No.</th>}
                  {visibleColumns.map(col =>
                    col.sortable !== false ? (
                      <TH key={col.field} field={col.field} label={col.headerName} style={col.width ? { width: col.width } : undefined} />
                    ) : (
                      <th key={col.field} style={col.width ? { width: col.width } : undefined}>{col.headerName}</th>
                    )
                  )}
                  {hasActions && (
                    <th className="sdt-col-actions" style={actionsColumnWidth ? { width: actionsColumnWidth } : undefined}>
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {slice.map((row, i) => {
                  const rowId = row[rowIdField];
                  return (
                    <tr key={rowId} className={selected.has(rowId) ? "sdt-selected" : ""}>
                      {rowSelection && (
                        <td className="sdt-col-cb">
                          <input type="checkbox" checked={selected.has(rowId)} onChange={() => toggleRow(rowId)} />
                        </td>
                      )}
                      {serialNumber && <td className="sdt-col-sn">{(safePage - 1) * pageSize + i + 1}</td>}
                      {visibleColumns.map(col => (
                        <td key={col.field}>
                          {col.cellRenderer
                            ? col.cellRenderer(row[col.field], row)
                            : col.valueFormatter
                              ? col.valueFormatter(row[col.field], row)
                              : String(row[col.field] ?? "")}
                        </td>
                      ))}
                      {hasActions && (
                        <td className="sdt-col-actions">
                          {actions.map((act, ai) => {
                            if (act.show && !act.show(row)) return null;
                            return (
                              <button
                                key={ai}
                                className={`sdt-action-btn${actionVariantClass(act.variant)}`}
                                title={act.title}
                                onClick={() => act.onClick(row)}
                              >
                                {act.icon}
                              </button>
                            );
                          })}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="sdt-empty-state">
                <div className="sdt-empty-icon">🔍</div>
                <h3>{emptyMessage}</h3>
                <p>{emptySubMessage}</p>
              </div>
            )}

            {enablePagination && (
              <div className="sdt-table-footer">
                <div className="sdt-footer-info">
                  Showing <strong>{filtered.length ? startNum : 0}–{endNum}</strong> of <strong>{filtered.length}</strong> records
                </div>
                <div className="sdt-pagination">
                  <button className="sdt-pg-btn" disabled={safePage === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                  {pgList.map((p, idx) => {
                    const prev = pgList[idx - 1];
                    return (
                      <span key={p} style={{ display: "contents" }}>
                        {prev !== undefined && p - prev > 1 && <span className="sdt-pg-ellipsis">…</span>}
                        <button
                          className={`sdt-pg-btn${p === safePage ? " sdt-pg-active" : ""}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      </span>
                    );
                  })}
                  <button className="sdt-pg-btn" disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                </div>
                <div className="sdt-page-size-wrap">
                  Rows per page:
                  <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
                    {pageSizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
