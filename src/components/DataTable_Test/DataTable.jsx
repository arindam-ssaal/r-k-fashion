/**
 * DataTable.jsx — Pro-Level DataTable Component
 * Features: Column Freeze, Global Search, Column Filters, Sorting,
 *           Pivot Table, CSV/JSON Export, Column Visibility,
 *           Row Selection, Pagination, Density Toggle,
 *           Analysis Header, AI Insight, Mobile Friendly
 *
 * Usage: import DataTable from './components/DataTable';
 */

import React, {
  useState, useMemo, useCallback, useRef, useEffect
} from 'react';
import './DataTable.css';

/* ============================================================
   ICONS (inline SVG — no icon-lib dependency)
   ============================================================ */
const Icon = {
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Filter: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Download: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  ChevronsLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
    </svg>
  ),
  ChevronsRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
    </svg>
  ),
  Table: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>
    </svg>
  ),
  Pivot: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  X: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Ai: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5V12h2a2 2 0 0 1 2 2v6H6v-6a2 2 0 0 1 2-2h2V9.5C8.8 8.8 8 7.5 8 6a4 4 0 0 1 4-4z"/>
    </svg>
  ),
  Density: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  Refresh: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
  Lock: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Info: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

/* ============================================================
   BADGE RENDERER
   ============================================================ */
const StatusBadge = ({ value }) => {
  const map = {
    active: 'dt-badge-active',
    inactive: 'dt-badge-inactive',
    open: 'dt-badge-open',
    closed: 'dt-badge-closed',
    pending: 'dt-badge-pending',
  };
  const cls = map[(value || '').toLowerCase()] || 'dt-badge-default';
  return <span className={`dt-badge ${cls}`}>{value}</span>;
};

/* ============================================================
   SORT ICON
   ============================================================ */
const SortIcon = ({ direction }) => (
  <span className={`dt-sort-icon ${direction || ''}`}>
    <span className="dt-sort-arrow sort-up" />
    <span className="dt-sort-arrow sort-down" />
  </span>
);

/* ============================================================
   EXPORT UTILITIES
   ============================================================ */
const exportCSV = (data, columns, filename = 'export.csv') => {
  const visibleCols = columns.filter(c => !c.hidden && c.key !== '__check__' && c.key !== '__num__');
  const headers = visibleCols.map(c => `"${c.label}"`).join(',');
  const rows = data.map(row =>
    visibleCols.map(c => {
      const v = row[c.key] ?? '';
      return `"${String(v).replace(/"/g, '""')}"`;
    }).join(',')
  );
  const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

const exportJSON = (data, filename = 'export.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

const printTable = (data, columns, title = 'DataTable') => {
  const visibleCols = columns.filter(c => !c.hidden && c.key !== '__check__' && c.key !== '__num__');
  const html = `
    <html><head><title>${title}</title>
    <style>
      body { font-family: sans-serif; font-size: 12px; }
      h2 { color: #0ea5e9; margin-bottom: 12px; }
      table { border-collapse: collapse; width: 100%; }
      th { background: #e0f2fe; color: #0284c7; padding: 8px 12px; text-align: left; border: 1px solid #bae6fd; }
      td { padding: 7px 12px; border: 1px solid #e2e8f0; }
      tr:nth-child(even) td { background: #f0f9ff; }
    </style></head><body>
    <h2>${title}</h2>
    <table>
      <thead><tr>${visibleCols.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>
      <tbody>${data.map(row => `<tr>${visibleCols.map(c => `<td>${row[c.key] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
    </body></html>`;
  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  w.print();
};

/* ============================================================
   PIVOT TABLE PANEL
   ============================================================ */
const PivotPanel = ({ data, columns }) => {
  const numericCols = columns.filter(c =>
    c.key !== '__check__' && c.key !== '__num__' && data.some(r => typeof r[c.key] === 'number')
  );
  const categoryCols = columns.filter(c =>
    c.key !== '__check__' && c.key !== '__num__' && !numericCols.find(n => n.key === c.key)
  );

  const [rowField, setRowField] = useState(categoryCols[0]?.key || '');
  const [colField, setColField] = useState(categoryCols[1]?.key || '');
  const [valueField, setValueField] = useState(numericCols[0]?.key || '');
  const [aggFunc, setAggFunc] = useState('sum');

  const pivotData = useMemo(() => {
    if (!rowField || !valueField) return { rows: [], cols: [], matrix: {} };
    const rows = [...new Set(data.map(d => d[rowField]))].filter(Boolean);
    const cols = colField ? [...new Set(data.map(d => d[colField]))].filter(Boolean) : ['Total'];

    const matrix = {};
    rows.forEach(r => {
      matrix[r] = {};
      cols.forEach(c => {
        const items = data.filter(d =>
          d[rowField] === r && (colField ? d[colField] === c : true)
        ).map(d => Number(d[valueField]) || 0);

        let agg = 0;
        if (items.length) {
          if (aggFunc === 'sum') agg = items.reduce((a, b) => a + b, 0);
          else if (aggFunc === 'avg') agg = items.reduce((a, b) => a + b, 0) / items.length;
          else if (aggFunc === 'count') agg = items.length;
          else if (aggFunc === 'max') agg = Math.max(...items);
          else if (aggFunc === 'min') agg = Math.min(...items);
        }
        matrix[r][c] = aggFunc === 'avg' ? +agg.toFixed(2) : agg;
      });
    });

    return { rows, cols, matrix };
  }, [data, rowField, colField, valueField, aggFunc]);

  const colTotal = (c) =>
    pivotData.rows.reduce((s, r) => s + (pivotData.matrix[r]?.[c] || 0), 0);

  return (
    <div className="dt-pivot-panel">
      <div className="dt-pivot-title"><Icon.Pivot /> Pivot Table</div>
      <div className="dt-pivot-controls">
        <div className="dt-pivot-control-group">
          <span className="dt-pivot-control-label">Row</span>
          <select className="dt-pivot-select" value={rowField} onChange={e => setRowField(e.target.value)}>
            {[...categoryCols, ...numericCols].map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="dt-pivot-control-group">
          <span className="dt-pivot-control-label">Column</span>
          <select className="dt-pivot-select" value={colField} onChange={e => setColField(e.target.value)}>
            <option value="">— None —</option>
            {categoryCols.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="dt-pivot-control-group">
          <span className="dt-pivot-control-label">Value</span>
          <select className="dt-pivot-select" value={valueField} onChange={e => setValueField(e.target.value)}>
            {numericCols.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="dt-pivot-control-group">
          <span className="dt-pivot-control-label">Aggregate</span>
          <select className="dt-pivot-select" value={aggFunc} onChange={e => setAggFunc(e.target.value)}>
            {['sum', 'avg', 'count', 'max', 'min'].map(f => (
              <option key={f} value={f}>{f.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>
      {pivotData.rows.length > 0 ? (
        <div className="dt-pivot-table-wrap">
          <table className="dt-pivot-table">
            <thead>
              <tr>
                <th>{columns.find(c => c.key === rowField)?.label || rowField}</th>
                {pivotData.cols.map(c => <th key={c}>{c}</th>)}
                <th>Grand Total</th>
              </tr>
            </thead>
            <tbody>
              {pivotData.rows.map(r => {
                const rowSum = pivotData.cols.reduce((s, c) => s + (pivotData.matrix[r]?.[c] || 0), 0);
                return (
                  <tr key={r}>
                    <td><strong>{r}</strong></td>
                    {pivotData.cols.map(c => (
                      <td key={c}>{(pivotData.matrix[r]?.[c] ?? 0).toLocaleString()}</td>
                    ))}
                    <td className="dt-pivot-total">{rowSum.toLocaleString()}</td>
                  </tr>
                );
              })}
              <tr>
                <td><strong>Total</strong></td>
                {pivotData.cols.map(c => (
                  <td key={c} className="dt-pivot-total">{colTotal(c).toLocaleString()}</td>
                ))}
                <td className="dt-pivot-total">
                  {pivotData.cols.reduce((s, c) => s + colTotal(c), 0).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="dt-empty"><div className="dt-empty-text">No pivot data available</div></div>
      )}
    </div>
  );
};

/* ============================================================
   ANALYSIS HEADER
   ============================================================ */
const AnalysisHeader = ({ stats, aiInsight, title }) => {
  if (!stats || stats.length === 0) return null;

  const iconMap = {
    active: '🟢', inactive: '🔴', open: '🔵', closed: '🟡',
    total: '📊', pending: '🟣', revenue: '💰', orders: '📦',
    customers: '👥', products: '🏷️', custom: '✨',
  };

  const iconClassMap = {
    active: 'active', inactive: 'inactive', open: 'open', closed: 'closed',
    total: 'total', pending: 'open', revenue: 'custom', orders: 'custom',
    customers: 'custom', products: 'custom',
  };

  return (
    <div className="dt-analysis-header">
      <div className="dt-analysis-title">
        <Icon.BarChart />
        {title || 'Overview'}
      </div>
      <div className="dt-analysis-stats">
        {stats.map((s, i) => {
          const typeKey = (s.type || '').toLowerCase();
          return (
            <div className="dt-stat-card" key={i}>
              <div className={`dt-stat-icon ${iconClassMap[typeKey] || 'custom'}`}>
                {s.icon || iconMap[typeKey] || '📌'}
              </div>
              <div className="dt-stat-info">
                <span className="dt-stat-value">{s.value?.toLocaleString?.() ?? s.value}</span>
                <span className="dt-stat-label">{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>
      {aiInsight && (
        <div className="dt-ai-insight">
          <span className="dt-ai-badge">✦ AI</span>
          <span className="dt-ai-text">{aiInsight}</span>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   MAIN DATATABLE COMPONENT
   ============================================================ */
/**
 * @param {Object[]} columns - Column definitions
 *   { key, label, sortable, filterable, frozen, hidden, width, render, type }
 * @param {Object[]} data - Row data array
 * @param {Object[]} stats - Analysis header stats
 *   { label, value, type, icon }
 * @param {string} aiInsight - AI insight text for header
 * @param {string} analysisTitle - Header section title
 * @param {string} title - Table title / export filename base
 * @param {boolean} showRowNumbers - Show row index column
 * @param {boolean} selectable - Enable row checkboxes
 * @param {boolean} showPivot - Show pivot panel toggle button
 * @param {boolean} showExport - Show export button
 * @param {boolean} showColumnVisibility - Show column visibility toggle
 * @param {boolean} showDensityToggle - Show density toggle
 * @param {boolean} showColumnFilter - Show per-column filter inputs
 * @param {number} defaultPageSize - Initial rows per page (default 10)
 * @param {number[]} pageSizeOptions - Page size choices
 * @param {Function} onRowClick - Called with (row) on row click
 * @param {Function} onSelectionChange - Called with selected rows array
 * @param {boolean} loading - Show skeleton loading state
 * @param {boolean} striped - Alternate row shading
 * @param {string} emptyText - Message when no rows
 */
const DataTable = ({
  columns: columnsProp = [],
  data: dataProp = [],
  stats,
  aiInsight,
  analysisTitle,
  title = 'DataTable',
  showRowNumbers = true,
  selectable = true,
  showPivot = true,
  showExport = true,
  showColumnVisibility = true,
  showDensityToggle = true,
  showColumnFilter = true,
  defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onRowClick,
  onSelectionChange,
  loading = false,
  striped = true,
  emptyText = 'No records found',
}) => {
  /* ---- State ---- */
  const [globalSearch, setGlobalSearch] = useState('');
  const [colFilters, setColFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, dir: null });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [hiddenCols, setHiddenCols] = useState(
    new Set(columnsProp.filter(c => c.hidden).map(c => c.key))
  );
  const [frozenCols] = useState(
    new Set(columnsProp.filter(c => c.frozen).map(c => c.key))
  );
  const [showColVisDropdown, setShowColVisDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showPivotPanel, setShowPivotPanel] = useState(false);
  const [density, setDensity] = useState('default'); // default | comfortable | compact
  const [activeFilters, setActiveFilters] = useState([]);

  const colVisRef = useRef(null);
  const exportRef = useRef(null);

  /* ---- Close dropdowns on outside click ---- */
  useEffect(() => {
    const handler = (e) => {
      if (colVisRef.current && !colVisRef.current.contains(e.target)) setShowColVisDropdown(false);
      if (exportRef.current && !exportRef.current.contains(e.target)) setShowExportDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ---- Columns with hidden state merged ---- */
  const columns = useMemo(() =>
    columnsProp.map(c => ({ ...c, hidden: hiddenCols.has(c.key) })),
    [columnsProp, hiddenCols]
  );

  const visibleColumns = useMemo(() =>
    columns.filter(c => !c.hidden),
    [columns]
  );

  /* ---- Frozen offsets ---- */
  const frozenOffsets = useMemo(() => {
    const offsets = {};
    let left = 0;
    if (selectable) { offsets['__check__'] = left; left += 40; }
    if (showRowNumbers) { offsets['__num__'] = left; left += 44; }
    visibleColumns.forEach(col => {
      if (frozenCols.has(col.key)) {
        offsets[col.key] = left;
        left += (col.width || 160);
      }
    });
    return offsets;
  }, [visibleColumns, frozenCols, selectable, showRowNumbers]);

  /* ---- Filtering ---- */
  const filteredData = useMemo(() => {
    let d = [...dataProp];

    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      d = d.filter(row =>
        visibleColumns.some(col => {
          const v = row[col.key];
          return v != null && String(v).toLowerCase().includes(q);
        })
      );
    }

    Object.entries(colFilters).forEach(([key, val]) => {
      if (!val?.trim()) return;
      const q = val.toLowerCase();
      d = d.filter(row => {
        const v = row[key];
        return v != null && String(v).toLowerCase().includes(q);
      });
    });

    return d;
  }, [dataProp, globalSearch, colFilters, visibleColumns]);

  /* ---- Sorting ---- */
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.dir) return filteredData;
    return [...filteredData].sort((a, b) => {
      const av = a[sortConfig.key], bv = b[sortConfig.key];
      if (av == null) return 1;
      if (bv == null) return -1;
      const result = typeof av === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sortConfig.dir === 'asc' ? result : -result;
    });
  }, [filteredData, sortConfig]);

  /* ---- Pagination ---- */
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const startRecord = sortedData.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, sortedData.length);

  /* ---- Sort handler ---- */
  const handleSort = useCallback((key) => {
    setSortConfig(prev => {
      if (prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return { key: null, dir: null };
    });
  }, []);

  /* ---- Page change with clamp ---- */
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  /* ---- Row selection ---- */
  const toggleRow = useCallback((id) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selectedRows.size === pageData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(pageData.map((_, i) => `${page}-${i}`)));
    }
  }, [pageData, selectedRows.size, page]);

  useEffect(() => {
    if (onSelectionChange) {
      const rows = [...selectedRows].map(id => {
        const [p, i] = id.split('-').map(Number);
        const start = (p - 1) * pageSize;
        return sortedData[start + i];
      }).filter(Boolean);
      onSelectionChange(rows);
    }
  }, [selectedRows]);

  /* ---- Column visibility ---- */
  const toggleColVisibility = (key) => {
    setHiddenCols(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  /* ---- Col filter with chip ---- */
  const applyColFilter = (key, value) => {
    setColFilters(prev => ({ ...prev, [key]: value }));
    if (value.trim()) {
      setActiveFilters(prev => {
        const without = prev.filter(f => f.key !== key);
        const label = columns.find(c => c.key === key)?.label || key;
        return [...without, { key, label, value }];
      });
    } else {
      setActiveFilters(prev => prev.filter(f => f.key !== key));
    }
    setPage(1);
  };

  const removeFilter = (key) => {
    setColFilters(prev => { const n = { ...prev }; delete n[key]; return n; });
    setActiveFilters(prev => prev.filter(f => f.key !== key));
  };

  const clearAllFilters = () => {
    setColFilters({});
    setActiveFilters([]);
    setGlobalSearch('');
  };

  /* ---- Density cycle ---- */
  const cycleDensity = () => {
    setDensity(d => d === 'default' ? 'comfortable' : d === 'comfortable' ? 'compact' : 'default');
  };

  /* ---- Page buttons ---- */
  const getPageButtons = () => {
    const btns = [];
    const delta = 1;
    const range = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }
    btns.push(1);
    if (range[0] > 2) btns.push('...');
    btns.push(...range);
    if (range[range.length - 1] < totalPages - 1) btns.push('...');
    if (totalPages > 1) btns.push(totalPages);
    return btns;
  };

  /* ---- Render cell ---- */
  const renderCell = (col, row) => {
    const val = row[col.key];
    if (col.render) return col.render(val, row);
    if (col.type === 'badge') return <StatusBadge value={val} />;
    if (col.type === 'currency') return (
      <span style={{ fontFamily: 'var(--dt-mono)', color: 'var(--dt-gray-700)' }}>
        ₹{Number(val || 0).toLocaleString('en-IN')}
      </span>
    );
    if (col.type === 'number') return (
      <span style={{ fontFamily: 'var(--dt-mono)' }}>{Number(val || 0).toLocaleString()}</span>
    );
    if (col.type === 'date') return val ? new Date(val).toLocaleDateString('en-IN') : '—';
    if (val == null || val === '') return <span style={{ color: 'var(--dt-gray-300)' }}>—</span>;
    return String(val);
  };

  /* ---- Skeleton rows ---- */
  const skeletonRows = Array.from({ length: pageSize > 8 ? 8 : pageSize });

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div className="dt-wrapper">

      {/* ANALYSIS HEADER */}
      {(stats?.length > 0 || aiInsight) && (
        <AnalysisHeader
          stats={stats}
          aiInsight={aiInsight}
          title={analysisTitle}
        />
      )}

      {/* TOOLBAR */}
      <div className="dt-toolbar">
        <div className="dt-toolbar-left">
          {/* Global Search */}
          <div className="dt-search-wrap">
            <span className="dt-search-icon"><Icon.Search /></span>
            <input
              className="dt-search-input"
              type="text"
              placeholder="Search all columns…"
              value={globalSearch}
              onChange={e => { setGlobalSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* Page Size */}
          <select
            className="dt-page-size-select"
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            {pageSizeOptions.map(s => (
              <option key={s} value={s}>{s} rows</option>
            ))}
          </select>

          {/* Density Toggle */}
          {showDensityToggle && (
            <button className="dt-btn dt-btn-outline" onClick={cycleDensity} title={`Density: ${density}`}>
              <Icon.Density />
              <span className="dt-btn-label" style={{ fontSize: 12, textTransform: 'capitalize' }}>{density}</span>
            </button>
          )}

          {/* Clear Filters */}
          {(activeFilters.length > 0 || globalSearch) && (
            <button className="dt-btn dt-btn-danger" onClick={clearAllFilters}>
              <Icon.X /> <span className="dt-btn-label">Clear Filters</span>
            </button>
          )}
        </div>

        <div className="dt-toolbar-right">
          {/* Pivot Toggle */}
          {showPivot && (
            <button
              className={`dt-btn ${showPivotPanel ? 'dt-btn-primary' : 'dt-btn-outline'}`}
              onClick={() => setShowPivotPanel(v => !v)}
            >
              <Icon.Pivot /> <span className="dt-btn-label">Pivot</span>
            </button>
          )}

          {/* Column Visibility */}
          {showColumnVisibility && (
            <div className="dt-col-visibility" ref={colVisRef}>
              <button className="dt-btn dt-btn-outline" onClick={() => setShowColVisDropdown(v => !v)}>
                <Icon.Eye /> <span className="dt-btn-label">Columns</span>
              </button>
              {showColVisDropdown && (
                <div className="dt-col-visibility-dropdown">
                  {columnsProp.map(col => (
                    <label className="dt-col-vis-item" key={col.key}>
                      <input
                        type="checkbox"
                        checked={!hiddenCols.has(col.key)}
                        onChange={() => toggleColVisibility(col.key)}
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Export */}
          {showExport && (
            <div className="dt-export-wrap" ref={exportRef}>
              <button className="dt-btn dt-btn-outline" onClick={() => setShowExportDropdown(v => !v)}>
                <Icon.Download /> <span className="dt-btn-label">Export</span>
              </button>
              {showExportDropdown && (
                <div className="dt-export-dropdown">
                  <button className="dt-export-item" onClick={() => { exportCSV(sortedData, columns, `${title}.csv`); setShowExportDropdown(false); }}>
                    📄 Export CSV
                  </button>
                  <button className="dt-export-item" onClick={() => { exportJSON(sortedData, `${title}.json`); setShowExportDropdown(false); }}>
                    📋 Export JSON
                  </button>
                  <button className="dt-export-item" onClick={() => { printTable(sortedData, columns, title); setShowExportDropdown(false); }}>
                    🖨️ Print
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Refresh */}
          <button className="dt-btn dt-btn-outline" onClick={() => { setGlobalSearch(''); setColFilters({}); setActiveFilters([]); setSortConfig({ key: null, dir: null }); setPage(1); setSelectedRows(new Set()); }} title="Reset">
            <Icon.Refresh />
          </button>
        </div>
      </div>

      {/* ACTIVE FILTER CHIPS */}
      {activeFilters.length > 0 && (
        <div className="dt-filter-row">
          <span className="dt-filter-label">Active filters:</span>
          {activeFilters.map(f => (
            <span className="dt-filter-chip" key={f.key}>
              <strong>{f.label}:</strong> {f.value}
              <button onClick={() => removeFilter(f.key)}><Icon.X /></button>
            </span>
          ))}
        </div>
      )}

      {/* TABLE */}
      <div className="dt-table-container">
        <table className={`dt-table${striped ? ' dt-striped' : ''} dt-density-${density}`}>
          <thead>
            {/* Column header row */}
            <tr>
              {selectable && (
                <th
                  className={`dt-check-col${frozenCols.size > 0 ? ' dt-frozen' : ''}`}
                  style={frozenCols.size > 0 ? { left: 0 } : {}}
                >
                  <input
                    className="dt-checkbox"
                    type="checkbox"
                    checked={pageData.length > 0 && selectedRows.size === pageData.length}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {showRowNumbers && (
                <th
                  className={frozenCols.size > 0 ? 'dt-frozen' : ''}
                  style={{ textAlign: 'center', width: 44, ...(frozenCols.size > 0 ? { left: selectable ? 40 : 0 } : {}) }}
                >
                  #
                </th>
              )}
              {visibleColumns.map(col => {
                const isFrozen = frozenCols.has(col.key);
                const isSorted = sortConfig.key === col.key;
                return (
                  <th
                    key={col.key}
                    className={isFrozen ? 'dt-frozen' : ''}
                    style={{
                      width: col.width || undefined,
                      minWidth: col.minWidth || 100,
                      ...(isFrozen ? { left: frozenOffsets[col.key] || 0 } : {}),
                    }}
                  >
                    <div
                      className="dt-th-inner"
                      onClick={() => col.sortable !== false && handleSort(col.key)}
                      style={{ cursor: col.sortable !== false ? 'pointer' : 'default' }}
                    >
                      {isFrozen && <Icon.Lock />}
                      {col.label}
                      {col.sortable !== false && (
                        <SortIcon direction={isSorted ? sortConfig.dir : null} />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>

            {/* Column filter row */}
            {showColumnFilter && (
              <tr>
                {selectable && <th className="dt-check-col" />}
                {showRowNumbers && <th />}
                {visibleColumns.map(col => (
                  <th key={col.key}>
                    {col.filterable !== false && (
                      <input
                        className="dt-col-filter-input"
                        type="text"
                        placeholder={`Filter ${col.label}…`}
                        value={colFilters[col.key] || ''}
                        onChange={e => applyColFilter(col.key, e.target.value)}
                      />
                    )}
                  </th>
                ))}
              </tr>
            )}
          </thead>

          <tbody>
            {loading ? (
              skeletonRows.map((_, i) => (
                <tr key={i}>
                  {selectable && <td className="dt-check-col"><div className="dt-skeleton" style={{ width: 16, height: 16, borderRadius: 4 }} /></td>}
                  {showRowNumbers && <td className="dt-row-num"><div className="dt-skeleton" style={{ width: 20 }} /></td>}
                  {visibleColumns.map(col => (
                    <td key={col.key}><div className="dt-skeleton" style={{ width: `${40 + Math.random() * 50}%` }} /></td>
                  ))}
                </tr>
              ))
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + (selectable ? 1 : 0) + (showRowNumbers ? 1 : 0)}>
                  <div className="dt-empty">
                    <div className="dt-empty-icon">📭</div>
                    <div className="dt-empty-text">{emptyText}</div>
                    <div className="dt-empty-sub">Try adjusting your search or filters</div>
                  </div>
                </td>
              </tr>
            ) : (
              pageData.map((row, rowIdx) => {
                const rowId = `${page}-${rowIdx}`;
                const isSelected = selectedRows.has(rowId);
                return (
                  <tr
                    key={rowIdx}
                    className={isSelected ? 'dt-selected' : ''}
                    onClick={() => onRowClick?.(row)}
                    style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <td
                        className={`dt-check-col${frozenCols.size > 0 ? ' dt-frozen' : ''}`}
                        style={frozenCols.size > 0 ? { left: 0 } : {}}
                        onClick={e => { e.stopPropagation(); toggleRow(rowId); }}
                      >
                        <input className="dt-checkbox" type="checkbox" checked={isSelected} onChange={() => {}} />
                      </td>
                    )}
                    {showRowNumbers && (
                      <td
                        className={`dt-row-num${frozenCols.size > 0 ? ' dt-frozen' : ''}`}
                        style={frozenCols.size > 0 ? { left: selectable ? 40 : 0 } : {}}
                      >
                        {startRecord + rowIdx}
                      </td>
                    )}
                    {visibleColumns.map(col => {
                      const isFrozen = frozenCols.has(col.key);
                      return (
                        <td
                          key={col.key}
                          className={isFrozen ? 'dt-frozen' : ''}
                          style={isFrozen ? { left: frozenOffsets[col.key] || 0, background: '#fff' } : {}}
                          title={typeof row[col.key] === 'string' ? row[col.key] : undefined}
                        >
                          {renderCell(col, row)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PIVOT PANEL */}
      {showPivotPanel && (
        <PivotPanel data={filteredData} columns={visibleColumns} />
      )}

      {/* FOOTER */}
      <div className="dt-footer">
        <div className="dt-info-text">
          {loading ? 'Loading…' : sortedData.length === 0
            ? 'No records'
            : <>Showing <strong>{startRecord}–{endRecord}</strong> of <strong>{sortedData.length}</strong> records
              {selectedRows.size > 0 && <> &nbsp;·&nbsp; <strong style={{ color: 'var(--dt-primary)' }}>{selectedRows.size} selected</strong></>}
              {dataProp.length !== sortedData.length && <> &nbsp;·&nbsp; filtered from <strong>{dataProp.length}</strong></>}
            </>
          }
        </div>

        <div className="dt-pagination">
          <button className="dt-page-btn" disabled={page === 1} onClick={() => setPage(1)}>
            <Icon.ChevronsLeft />
          </button>
          <button className="dt-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            <Icon.ChevronLeft />
          </button>

          {getPageButtons().map((btn, i) =>
            btn === '...'
              ? <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: 'var(--dt-gray-400)' }}>…</span>
              : (
                <button
                  key={btn}
                  className={`dt-page-btn${page === btn ? ' active' : ''}`}
                  onClick={() => setPage(btn)}
                >
                  {btn}
                </button>
              )
          )}

          <button className="dt-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            <Icon.ChevronRight />
          </button>
          <button className="dt-page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>
            <Icon.ChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;