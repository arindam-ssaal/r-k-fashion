import { useState, useEffect, useRef } from "react";
import { PostAPI, GetAPI } from '@/services/apiCall';
import { use } from "react";

// ─── SAP B1-Inspired Design System ───────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --sap-brand:       #0A6ED1;
    --sap-brand-dark:  #0854A0;
    --sap-accent:      #8B1A2B;
    --sap-accent-light:#A91E30;
    --sap-shell:       #354A5E;
    --sap-shell-text:  #FFFFFF;
    --sap-bg:          #F5F6FA;
    --sap-surface:     #FFFFFF;
    --sap-border:      #D9DBDD;
    --sap-border-focus:#0A6ED1;
    --sap-text:        #32363A;
    --sap-text-subtle: #6A6D70;
    --sap-text-link:   #0A6ED1;
    --sap-success:     #107E3E;
    --sap-warning:     #E9730C;
    --sap-error:       #BB0000;
    --sap-info:        #0A6ED1;
    --sap-row-alt:     #F7F7F7;
    --sap-row-hover:   #EBF3FC;
    --sap-row-selected:#D1E8FF;
    --sap-tab-active:  #8B1A2B;
    --sap-header-bg:   #EDEFF0;
    --shadow-sm:       0 2px 8px rgba(0,0,0,0.08);
    --shadow-md:       0 4px 20px rgba(0,0,0,0.14);
    --shadow-lg:       0 8px 40px rgba(0,0,0,0.18);
    --radius:          4px;
    --radius-lg:       6px;
  }

  body {
    font-family: 'IBM Plex Sans', -apple-system, sans-serif;
    background: var(--sap-bg);
    color: var(--sap-text);
    font-size: 13px;
    line-height: 1.5;
  }

  /* ── Shell Header ── */
  .shell-header {
    background: var(--sap-shell);
    height: 44px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    gap: 16px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.25);
    position: sticky; top: 0; z-index: 1000;
  }
  .shell-logo {
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 700; font-size: 15px;
    color: #fff; letter-spacing: 1.5px;
    padding: 4px 10px;
    border: 2px solid rgba(255,255,255,0.35);
    border-radius: 3px;
  }
  .shell-product {
    color: rgba(255,255,255,0.85);
    font-size: 13px; font-weight: 400;
    border-left: 1px solid rgba(255,255,255,0.25);
    padding-left: 16px; margin-left: 4px;
  }
  .shell-nav { margin-left: auto; display: flex; gap: 6px; }
  .shell-btn {
    background: transparent; border: none; color: rgba(255,255,255,0.75);
    width: 32px; height: 32px; border-radius: var(--radius);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.15s, color 0.15s; font-size: 16px;
  }
  .shell-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
  .shell-user {
    background: var(--sap-brand); color: #fff;
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; cursor: pointer; margin-left: 8px;
  }

  /* ── Page Layout ── */
  .page-wrapper { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
  .page-content { flex: 1; padding: 12px 16px; width: 100%; display: flex; flex-direction: column; overflow: hidden; }

  /* ── Breadcrumb ── */
  .breadcrumb {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: var(--sap-text-subtle);
    margin-bottom: 16px;
  }
  .breadcrumb a { color: var(--sap-text-link); text-decoration: none; cursor: pointer; }
  .breadcrumb a:hover { text-decoration: underline; }
  .breadcrumb-sep { color: var(--sap-border); }

  /* ── Page Title Bar ── */
  .page-title-bar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 8px; gap: 12px; flex-wrap: wrap;
  }
  .page-title {
    font-size: 20px; font-weight: 600; color: var(--sap-text);
    display: flex; align-items: center; gap: 10px;
  }
  .page-title-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--sap-brand), var(--sap-brand-dark));
    border-radius: var(--radius);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 16px;
  }
  .page-subtitle { font-size: 12px; color: var(--sap-text-subtle); margin-top: 2px; font-weight: 400; }

  /* ── Toolbar ── */
  .toolbar {
    display: flex; align-items: center; gap: 10px;
    background: var(--sap-surface); border: 1px solid var(--sap-border);
    border-radius: var(--radius-lg); padding: 8px 16px;
    margin-bottom: 8px; flex-wrap: wrap;
    box-shadow: var(--shadow-sm);
  }
  .toolbar-group { display: flex; align-items: center; gap: 8px; }
  .toolbar-sep { width: 1px; height: 24px; background: var(--sap-border); margin: 0 4px; }

  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: var(--radius); font-size: 13px;
    font-weight: 500; cursor: pointer; border: 1px solid transparent;
    transition: all 0.15s; font-family: inherit; white-space: nowrap;
  }
  .btn-primary {
    background: var(--sap-brand); color: #fff; border-color: var(--sap-brand);
  }
  .btn-primary:hover { background: var(--sap-brand-dark); border-color: var(--sap-brand-dark); }
  .btn-secondary {
    background: var(--sap-surface); color: var(--sap-text);
    border-color: var(--sap-border);
  }
  .btn-secondary:hover { background: var(--sap-row-hover); border-color: var(--sap-brand); color: var(--sap-brand); }
  .btn-danger {
    background: #fff; color: var(--sap-error); border-color: var(--sap-error);
  }
  .btn-danger:hover { background: #FFF0F0; }
  .btn-ghost {
    background: transparent; border-color: transparent; color: var(--sap-text-subtle);
  }
  .btn-ghost:hover { background: var(--sap-row-alt); color: var(--sap-text); }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn-icon { padding: 6px 8px; }
  .btn-sm { padding: 4px 10px; font-size: 12px; }
  .btn-accent { background: var(--sap-accent); color: #fff; border-color: var(--sap-accent); }
  .btn-accent:hover { background: var(--sap-accent-light); }

  /* ── Search Bar ── */
  .search-wrapper { position: relative; flex: 1; min-width: 200px; max-width: 400px; }
  .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--sap-text-subtle); font-size: 14px; }
  .search-input {
    width: 100%; padding: 6px 34px 6px 32px;
    border: 1px solid var(--sap-border); border-radius: var(--radius);
    font-size: 13px; font-family: inherit; background: var(--sap-bg);
    transition: border 0.15s, box-shadow 0.15s;
  }
  .search-input:focus { outline: none; border-color: var(--sap-brand); box-shadow: 0 0 0 2px rgba(10,110,209,0.15); background: #fff; }
  .search-clear { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); cursor: pointer; color: var(--sap-text-subtle); font-size: 14px; }
  .search-clear:hover { color: var(--sap-text); }

  /* ── Filter Chips ── */
  .filter-bar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
  .filter-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px 3px 10px; border-radius: 12px;
    font-size: 11px; font-weight: 500; cursor: pointer; border: 1px solid;
    transition: all 0.12s;
  }
  .chip-all { background: var(--sap-brand); color: #fff; border-color: var(--sap-brand); }
  .chip-active { background: #E8F5E9; color: #1B5E20; border-color: #81C784; }
  .chip-inactive { background: #FFF3E0; color: #E65100; border-color: #FFB74D; }
  .chip-coco { background: #EDE7F6; color: #4527A0; border-color: #B39DDB; }
  .filter-chip:hover { opacity: 0.8; }

  /* ── Stats Bar ── */
  .stats-bar {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 10px; margin-bottom: 10px;
  }
  .stat-card {
    background: var(--sap-surface); border: 1px solid var(--sap-border);
    border-radius: var(--radius-lg); padding: 14px 18px;
    display: flex; align-items: center; gap: 14px;
    box-shadow: var(--shadow-sm); cursor: pointer; transition: all 0.15s;
  }
  .stat-card:hover { box-shadow: var(--shadow-md); border-color: var(--sap-brand); transform: translateY(-1px); }
  .stat-icon {
    width: 40px; height: 40px; border-radius: var(--radius);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .stat-icon.blue { background: #EBF3FC; color: var(--sap-brand); }
  .stat-icon.green { background: #E8F5E9; color: #2E7D32; }
  .stat-icon.amber { background: #FFF8E1; color: #F57F17; }
  .stat-icon.red { background: #FFEBEE; color: #C62828; }
  .stat-value { font-size: 22px; font-weight: 700; color: var(--sap-text); line-height: 1; }
  .stat-label { font-size: 11px; color: var(--sap-text-subtle); margin-top: 3px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── Data Table ── */
  .table-container {
    background: var(--sap-surface); border: 1px solid var(--sap-border);
    border-radius: var(--radius-lg); overflow: hidden;
    box-shadow: var(--shadow-sm);
    flex: 1; display: flex; flex-direction: column; min-height: 0;
  }
  .table-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; border-bottom: 1px solid var(--sap-border);
    background: var(--sap-header-bg);
  }
  .table-title { font-size: 13px; font-weight: 600; color: var(--sap-text); }
  .table-count { font-size: 11px; color: var(--sap-text-subtle); margin-left: 8px; }

  table { width: 100%; border-collapse: collapse; }
  thead th {
    background: var(--sap-header-bg); text-align: left;
    padding: 9px 14px; font-size: 12px; font-weight: 600;
    color: var(--sap-text); border-bottom: 2px solid var(--sap-border);
    white-space: nowrap; user-select: none;
    position: sticky; top: 0; z-index: 1;
  }
  thead th.sortable { cursor: pointer; }
  thead th.sortable:hover { background: #E0E3E6; color: var(--sap-brand); }
  thead th.sorted { color: var(--sap-brand); }
  .sort-icon { margin-left: 4px; font-size: 10px; opacity: 0.7; }

  tbody tr {
    border-bottom: 1px solid #F0F1F2;
    transition: background 0.1s;
    cursor: pointer;
  }
  tbody tr:nth-child(even) { background: var(--sap-row-alt); }
  tbody tr:hover { background: var(--sap-row-hover); }
  tbody tr.selected { background: var(--sap-row-selected); }
  tbody td { padding: 9px 14px; font-size: 13px; vertical-align: middle; }

  .td-code { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 500; color: var(--sap-brand); }
  .td-link { color: var(--sap-brand); font-weight: 500; text-decoration: none; }
  .td-link:hover { text-decoration: underline; }

  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600;
  }
  .badge-active { background: #E8F5E9; color: #2E7D32; }
  .badge-inactive { background: #FFF3E0; color: #E65100; }
  .badge-coco { background: #EDE7F6; color: #4527A0; }
  .badge-foco { background: #E3F2FD; color: #1565C0; }
  .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

  .row-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s; }
  tbody tr:hover .row-actions { opacity: 1; }

  /* ── Pagination ── */
  .pagination {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; border-top: 1px solid var(--sap-border);
    background: var(--sap-header-bg); flex-wrap: wrap; gap: 8px;
  }
  .page-info { font-size: 12px; color: var(--sap-text-subtle); }
  .page-btns { display: flex; gap: 4px; }
  .page-btn {
    width: 28px; height: 28px; border: 1px solid var(--sap-border);
    background: var(--sap-surface); border-radius: var(--radius);
    cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center;
    transition: all 0.12s; font-family: inherit;
  }
  .page-btn:hover { border-color: var(--sap-brand); color: var(--sap-brand); background: #EBF3FC; }
  .page-btn.active { background: var(--sap-brand); color: #fff; border-color: var(--sap-brand); }
  .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Modal Overlay ── */
  .overlay {
    position: fixed; inset: 0;
    background: rgba(30, 40, 55, 0.55);
    backdrop-filter: blur(3px);
    z-index: 2000;
    display: flex; align-items: center; justify-content: center;
    padding: 0;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* ── Modal ── */
  .modal {
    background: #F5F6F7; border-radius: 0;
    width: 100%; max-width: 100%; height: 100vh; max-height: 100vh;
    display: flex; flex-direction: column;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.2s ease;
    overflow: hidden;
  }
  .modal-header {
    background: #fff;
    padding: 16px 24px; display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0; border-bottom: 1px solid #E5E7EB;
  }
  .modal-title-wrap { display: flex; align-items: center; gap: 12px; }
  .modal-icon {
    width: 36px; height: 36px; background: #EBF3FC;
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-size: 18px; color: #0A6ED1;
  }
  .modal-title { font-size: 18px; font-weight: 600; color: #1F2937; }
  .modal-subtitle { font-size: 12px; color: #6A6D70; margin-top: 2px; }
  .modal-close {
    background: #F3F4F6; border: none; color: #6B7280;
    width: 32px; height: 32px; border-radius: 8px; cursor: pointer;
    font-size: 18px; display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .modal-close:hover { background: #E5E7EB; color: #1F2937; }

  /* ── Tabs ── */
  .modal-tabs {
    display: flex; align-items: center; gap: 0;
    background: #fff; border-bottom: 1px solid #E5E7EB;
    padding: 0 24px; overflow-x: auto; flex-shrink: 0;
  }
  .tab-btn {
    padding: 14px 20px; font-size: 13px; font-weight: 500;
    background: transparent; border: none; cursor: pointer;
    color: #6A6D70; white-space: nowrap;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
    display: flex; align-items: center; gap: 7px;
    transition: color 0.15s, border-color 0.15s;
    font-family: inherit;
  }
  .tab-btn:hover { color: #1F2937; background: rgba(10,110,209,0.04); }
  .tab-btn.active { color: #0A6ED1; border-bottom-color: #0A6ED1; font-weight: 600; }
  .tab-badge {
    background: #EF4444; color: #fff;
    width: 16px; height: 16px; border-radius: 50%;
    font-size: 9px; font-weight: 700; display: inline-flex;
    align-items: center; justify-content: center;
  }
  .tab-done {
    width: 16px; height: 16px; border-radius: 50%;
    background: #10B981; color: #fff;
    font-size: 9px; display: inline-flex; align-items: center; justify-content: center;
  }

  /* ── Modal Body ── */
  .modal-body { flex: 1; overflow-y: auto; padding: 0; background: #F5F6F7; }
  .modal-footer {
    padding: 14px 24px; background: #fff;
    border-top: 1px solid #E5E7EB;
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0; gap: 12px; flex-wrap: wrap;
  }
  .footer-info { font-size: 11px; color: var(--sap-text-subtle); }

  /* ── Sky Theme Cards ── */
  .sky-card {
    background: #fff; border-radius: 8px; border: 1px solid #E5E7EB;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    overflow: hidden;
  }
  .sky-card-header {
    border-left: 4px solid #0A6ED1;
    padding: 14px 20px;
    border-bottom: 1px solid #E5E7EB;
    background: #e6f1fa;
    display: flex; align-items: center; gap: 12px;
  }
  .sky-card-icon {
    width: 36px; height: 36px; background: #dbeafe;
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .sky-card-title { font-size: 15px; font-weight: 700; color: #0A6ED1; line-height: 1.3; }
  .sky-card-desc { font-size: 12px; color: #6A6D70; margin-top: 2px; }
  .sky-card-body { padding: 20px 24px; }
  .sky-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px 28px; }
  .sky-grid-3 { grid-template-columns: repeat(3, 1fr); }
  .sky-label {
    display: block; font-size: 13px; font-weight: 500; color: #6A6D70; margin-bottom: 6px;
  }
  .sky-label.required::after { content: ' *'; color: #EF4444; font-weight: 600; }
  .sky-input {
    width: 100%; padding: 8px 12px; font-size: 13px; font-family: inherit;
    border: 1px solid #D1D5DB; border-radius: 6px; background: #fff;
    color: #1F2937; transition: border-color 0.15s, box-shadow 0.15s;
  }
  .sky-input:focus {
    outline: none; border-color: #0A6ED1;
    box-shadow: 0 0 0 2px rgba(10,110,209,0.15);
  }
  .sky-input.error { border-color: #EF4444; box-shadow: 0 0 0 2px rgba(239,68,68,0.1); }
  .sky-input:disabled { background: #F9FAFB; color: #9CA3AF; cursor: not-allowed; }
  .sky-select {
    width: 100%; padding: 8px 12px; font-size: 13px; font-family: inherit;
    border: 1px solid #D1D5DB; border-radius: 6px; background: #fff;
    color: #1F2937; cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s;
  }
  .sky-select:focus {
    outline: none; border-color: #0A6ED1;
    box-shadow: 0 0 0 2px rgba(10,110,209,0.15);
  }
  .sky-radio-group { display: flex; align-items: center; gap: 20px; margin-top: 2px; }
  .sky-radio-label {
    display: flex; align-items: center; gap: 6px; cursor: pointer;
    font-size: 13px; color: #374151;
  }
  .sky-radio {
    width: 16px; height: 16px; accent-color: #0A6ED1; cursor: pointer;
  }
  .sky-hint { font-size: 11px; color: #9CA3AF; margin-top: 4px; }
  .sky-error { font-size: 11px; color: #EF4444; margin-top: 4px; }
  .sky-section-content { padding: 24px; }
  .sky-section-content .space-y > * + * { margin-top: 24px; }
  .sky-checkbox-wrap {
    display: flex; align-items: center; gap: 8px; padding: 12px 0;
  }
  .sky-checkbox {
    width: 16px; height: 16px; accent-color: #0A6ED1; cursor: pointer;
  }
  .sky-checkbox-label { font-size: 13px; color: #374151; cursor: pointer; }

  /* ── Form Layout ── */
  .form-section { margin-bottom: 24px; }
  .form-section-title {
    font-size: 12px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.8px; color: var(--sap-text-subtle);
    margin-bottom: 14px; padding-bottom: 8px;
    border-bottom: 1px solid var(--sap-border);
    display: flex; align-items: center; gap: 8px;
  }
  .form-section-title::before {
    content: ''; width: 3px; height: 14px;
    background: var(--sap-accent); border-radius: 2px;
  }

  .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px 24px; }
  .form-grid-3 { grid-template-columns: repeat(3, 1fr); }
  .form-grid-4 { grid-template-columns: repeat(4, 1fr); }
  .col-span-2 { grid-column: span 2; }
  .col-span-full { grid-column: 1 / -1; }

  .form-field { display: flex; flex-direction: column; gap: 5px; }
  .form-label {
    font-size: 12px; font-weight: 500; color: var(--sap-text);
  }
  .form-label.required::after { content: ' *'; color: var(--sap-error); }
  .form-control {
    padding: 7px 10px; border: 1px solid var(--sap-border);
    border-radius: var(--radius); font-size: 13px; font-family: inherit;
    background: var(--sap-surface); color: var(--sap-text);
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
  }
  .form-control:focus {
    outline: none; border-color: var(--sap-brand);
    box-shadow: 0 0 0 2px rgba(10,110,209,0.15);
  }
  .form-control:disabled { background: #F7F7F7; color: var(--sap-text-subtle); cursor: not-allowed; }
  .form-control.error { border-color: var(--sap-error); box-shadow: 0 0 0 2px rgba(187,0,0,0.1); }
  .form-control.readonly { background: #FAFAFA; cursor: default; }
  select.form-control { cursor: pointer; }
  .form-hint { font-size: 11px; color: var(--sap-text-subtle); }
  .form-error { font-size: 11px; color: var(--sap-error); display: flex; align-items: center; gap: 4px; }

  /* ── Checkbox & Radio ── */
  .checkbox-wrap { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
  .form-checkbox {
    width: 15px; height: 15px; cursor: pointer;
    accent-color: var(--sap-brand); flex-shrink: 0;
  }
  .checkbox-label { font-size: 13px; color: var(--sap-text); cursor: pointer; }

  /* ── Sub-Table (MOP, Petty Cash, Doc Series) ── */
  .sub-table-wrapper {
    border: 1px solid var(--sap-border); border-radius: var(--radius-lg);
    overflow: hidden;
  }
  .sub-table-header {
    background: var(--sap-header-bg); padding: 10px 16px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--sap-border);
  }
  .sub-table-title { font-size: 12px; font-weight: 600; color: var(--sap-text); }
  .sub-table-actions { display: flex; gap: 8px; }

  .sub-table { width: 100%; border-collapse: collapse; }
  .sub-table thead th {
    background: #EDEFF0; padding: 8px 10px;
    font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.5px; color: var(--sap-text-subtle);
    border-bottom: 1px solid var(--sap-border); position: static;
  }
  .sub-table tbody tr { border-bottom: 1px solid #F5F5F5; }
  .sub-table tbody tr:hover { background: var(--sap-row-hover); }
  .sub-table tbody td { padding: 7px 10px; }
  .sub-table tbody td .form-control { padding: 5px 8px; font-size: 12px; }

  .empty-table {
    text-align: center; padding: 40px 20px;
    color: var(--sap-text-subtle);
  }
  .empty-icon { font-size: 32px; margin-bottom: 8px; opacity: 0.4; }
  .empty-text { font-size: 13px; }

  /* ── Toast Notification ── */
  .toast-container { position: fixed; top: 60px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; }
  .toast {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--sap-surface); border-radius: var(--radius-lg);
    padding: 12px 16px; min-width: 280px; max-width: 400px;
    box-shadow: var(--shadow-md); border-left: 4px solid;
    animation: slideIn 0.3s ease;
  }
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .toast.success { border-left-color: var(--sap-success); }
  .toast.error { border-left-color: var(--sap-error); }
  .toast.info { border-left-color: var(--sap-info); }
  .toast.warning { border-left-color: var(--sap-warning); }
  .toast-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .toast.success .toast-icon { color: var(--sap-success); }
  .toast.error .toast-icon { color: var(--sap-error); }
  .toast.info .toast-icon { color: var(--sap-info); }
  .toast.warning .toast-icon { color: var(--sap-warning); }
  .toast-title { font-size: 13px; font-weight: 600; color: var(--sap-text); }
  .toast-msg { font-size: 12px; color: var(--sap-text-subtle); margin-top: 2px; }
  .toast-close { margin-left: auto; cursor: pointer; font-size: 16px; color: var(--sap-text-subtle); background: none; border: none; }

  /* ── Confirm Dialog ── */
  .confirm-dialog {
    background: var(--sap-surface); border-radius: var(--radius-lg);
    padding: 28px; max-width: 420px; width: 100%;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.2s ease;
  }
  .confirm-icon { font-size: 36px; margin-bottom: 12px; }
  .confirm-title { font-size: 16px; font-weight: 600; color: var(--sap-text); margin-bottom: 8px; }
  .confirm-msg { font-size: 13px; color: var(--sap-text-subtle); line-height: 1.6; }
  .confirm-actions { display: flex; gap: 10px; margin-top: 24px; justify-content: flex-end; }

  /* ── Status Indicator ── */
  .sync-bar {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 16px; background: #EBF3FC; border-bottom: 1px solid #C2DBF7;
    font-size: 12px; color: var(--sap-brand);
  }
  .sync-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--sap-success); box-shadow: 0 0 0 2px rgba(16,126,62,0.2);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 2px rgba(16,126,62,0.2); }
    50% { box-shadow: 0 0 0 6px rgba(16,126,62,0); }
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .stats-bar { grid-template-columns: repeat(2, 1fr); }
    .form-grid { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: span 1; }
    .modal { max-height: 100vh; border-radius: 0; }
  }
  @media (max-width: 600px) {
    .page-content { padding: 12px; }
    .stats-bar { grid-template-columns: 1fr 1fr; }
    .modal-tabs { padding: 0 12px; }
    .tab-btn { padding: 10px 12px; font-size: 12px; }
  }

  /* ── Divider ── */
  .divider { height: 1px; background: var(--sap-border); margin: 20px 0; }

  /* ── Address Copy Button ── */
  .copy-addr-btn {
    background: none; border: 1px solid var(--sap-brand); color: var(--sap-brand);
    border-radius: var(--radius); padding: 3px 8px; font-size: 11px; cursor: pointer;
    display: inline-flex; align-items: center; gap: 4px; font-family: inherit;
    transition: all 0.15s;
  }
  .copy-addr-btn:hover { background: var(--sap-brand); color: #fff; }

  /* ── Loading skeleton ── */
  .skeleton { background: linear-gradient(90deg, #F0F1F2 25%, #E8E9EA 50%, #F0F1F2 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: var(--radius); }
  @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

  /* ── Column chooser dot ── */
  .col-indicator { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
`;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_STORES = [
  { id: 1, code: "001", name: "DB-NEWTOWN", startDate: "2024-04-01", storeSize: 2800, type: "Organization Owned", category: "Company Owned Company Operated", operation: "Outright Purchase", city: "Kolkata", state: "West Bengal", status: "Active", syncStatus: "Synced", warehouse: "Warehouse", saleWarehouse: "Warehouse2", returnWarehouse: "Warehouse3", priceList: "Retail Price List", factor: "1", billAddress: "Salt Lake Sector V", shipAddress: "Salt Lake Sector V", postalCode: "700091", contactPerson: "Rahul Sharma", contactNumber: "9800000001", email: "newtown@db.com", mop: [{ name: "Cash", code: "1", crossStore: false, ledger: "Cash A/c", controlAccount: "", discontinued: false }, { name: "UPI", code: "2", crossStore: true, ledger: "UPI A/c", controlAccount: "", discontinued: false }], pettyCash: [{ head: "General Expenses", limit: "30000", type: "Payment", ledger: "", subLedger: "", discontinued: false }], docSeries: [{ txType: "Sale", seriesName: "NT POS Invoice", prefix: "NTS/25-26", digits: "4", suffix: "", discontinued: false }] },
  { id: 2, code: "007", name: "DB-MARSHAGHAI", startDate: "2025-08-01", storeSize: 3500, type: "Organization Owned", category: "Company Owned Company Operated", operation: "Consignment Basis", city: "Kolkata", state: "West Bengal", status: "Active", syncStatus: "Synced", warehouse: "Warehouse", saleWarehouse: "Warehouse2", returnWarehouse: "Warehouse3", priceList: "Retail Price List", factor: "1", billAddress: "New Town Action Area II", shipAddress: "New Town Action Area II", postalCode: "700161", contactPerson: "", contactNumber: "", email: "", mop: [{ name: "Cash", code: "1", crossStore: false, ledger: "", controlAccount: "", discontinued: false }], pettyCash: [{ head: "General Expenses", limit: "50000", type: "Payment", ledger: "", subLedger: "", discontinued: false }], docSeries: [{ txType: "Sale", seriesName: "Marshaghai POS Invoice", prefix: "MRS/25-26", digits: "4", suffix: "", discontinued: false }] },
  { id: 3, code: "012", name: "DB-SALTLAKE", startDate: "2023-01-15", storeSize: 4200, type: "Franchise", category: "Company Owned Franchise Operated", operation: "Outright Purchase", city: "Kolkata", state: "West Bengal", status: "Active", syncStatus: "Pending", warehouse: "WH-SL", saleWarehouse: "WH-SL-SALE", returnWarehouse: "WH-SL-RET", priceList: "MRP", factor: "1.05", billAddress: "Sector II Salt Lake", shipAddress: "Sector II Salt Lake", postalCode: "700064", contactPerson: "Priya Das", contactNumber: "9800000003", email: "saltlake@db.com", mop: [], pettyCash: [], docSeries: [] },
  { id: 4, code: "019", name: "DB-GARIAHAT", startDate: "2022-06-01", storeSize: 1800, type: "Organization Owned", category: "Company Owned Company Operated", operation: "Outright Purchase", city: "Kolkata", state: "West Bengal", status: "Inactive", syncStatus: "Synced", warehouse: "WH-GH", saleWarehouse: "WH-GH-SALE", returnWarehouse: "WH-GH-RET", priceList: "B2B Price List", factor: "1", billAddress: "Gariahat Road", shipAddress: "Gariahat Road", postalCode: "700029", contactPerson: "Amit Bose", contactNumber: "9800000004", email: "gariahat@db.com", mop: [], pettyCash: [], docSeries: [] },
  { id: 5, code: "023", name: "DB-ESPLANADE", startDate: "2021-11-01", storeSize: 5100, type: "Organization Owned", category: "Company Owned Company Operated", operation: "Consignment Basis", city: "Kolkata", state: "West Bengal", status: "Active", syncStatus: "Synced", warehouse: "WH-ESP", saleWarehouse: "WH-ESP-SALE", returnWarehouse: "WH-ESP-RET", priceList: "Retail Price List", factor: "1", billAddress: "Esplanade Row", shipAddress: "Esplanade Row", postalCode: "700001", contactPerson: "Sneha Roy", contactNumber: "9800000005", email: "esplanade@db.com", mop: [], pettyCash: [], docSeries: [] },
];

const STORE_TYPES = ["Organization Owned", "Franchise", "Dealer"];
const STORE_CATEGORIES = ["Company Owned Company Operated", "Company Owned Franchise Operated", "Franchise Owned Franchise Operated"];
const OPERATION_TYPES = ["Outright Purchase", "Consignment Basis", "SOR"];
const PRICE_LISTS = ["Retail Price List", "B2B Price List", "MRP", "Standard Pricing"];
const WAREHOUSES = ["Warehouse", "Warehouse2", "Warehouse3", "WH-SL", "WH-SL-SALE", "WH-SL-RET", "WH-GH", "WH-GH-SALE"];
const STATES = ["West Bengal", "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "Rajasthan"];
const CITIES = ["Kolkata", "Mumbai", "Delhi", "Bengaluru", "Chennai", "Lucknow", "Jaipur"];
const MOP_NAMES = ["Cash", "UPI", "Credit Card", "Debit Card", "Net Banking", "Cheque", "Gift Card", "Wallet"];
const PETTY_HEADS = ["General Expenses", "Travel Expenses", "Pantry Expenses", "Repair & Maintenance", "Marketing Expenses"];
const TX_TYPES = ["Sale", "Sale Return", "Exchange", "Purchase", "Purchase Return", "Transfer", "Stock Adjustment"];
const LEDGERS = ["Cash A/c", "UPI A/c", "Bank A/c", "Sales A/c", "Purchase A/c", "Debtors A/c", "Creditors A/c"];
const TABS = [
  { id: "store", label: "Store Detail", icon: "🏪" },
  { id: "logistics", label: "Logistics", icon: "🚚" },
  { id: "mop", label: "MOP Details", icon: "💳" },
  { id: "petty", label: "Petty Cash Details", icon: "💰" },
  { id: "series", label: "Document Series", icon: "📄" },
  { id: "ledgers", label: "Ledgers", icon: "📊" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const emptyStore = () => ({
  id: null, code: "", name: "", startDate: "", closeDate: "", storeSize: "",
  type: "Organization Owned", category: "Company Owned Company Operated",
  operation: "Outright Purchase", priceList: "Retail Price List", factor: "1",
  warehouse: "", saleWarehouse: "", returnWarehouse: "",
  billAddress: "", shipAddress: "", city: "Kolkata", state: "West Bengal",
  postalCode: "", shipCity: "Kolkata", shipState: "West Bengal",
  contactPerson: "", contactNumber: "", email: "",
  inactive: false, status: "Active",
  mop: [], pettyCash: [], docSeries: [],
  ledgers: [],
});

function uid() { return Math.floor(Math.random() * 900000) + 100000; }

// ─── API Response Mapper ──────────────────────────────────────────────────────
function mapApiStoreToLocal(s) {
  return {
    id: s.storeID || 0,
    code: s.storeCode || "",
    name: s.storeName || "",
    startDate: s.startDate || "",
    closeDate: s.closeDate || "",
    storeSize: s.storeSize || 0,
    type: s.storeTypeName || "",
    category: s.storeCategoryName || "",
    operation: s.operationTypeName || "",
    city: s.billCity || "",
    state: s.billStateName || "",
    status: (s.isActive || "").trim() === "Y" ? "Active" : (s.isActive || "").trim() === "N" ? "Inactive" : "Active",
    syncStatus: "Synced",
    warehouse: s.defaultWarehouseName || "",
    saleWarehouse: s.defaultSaleWHName || "",
    returnWarehouse: s.defaultReturnWHName || "",
    priceList: s.priceListName || "",
    factor: s.factor || "",
    billAddress: s.billAddress || "",
    shipAddress: s.shipAddress || "",
    postalCode: s.billPostalCode || "",
    contactPerson: s.contactPerson || "",
    contactNumber: s.contactNumber || "",
    alternateContactNumber: s.alternateContactNumber || "",
    email: s.email || "",
    gstin: s.gstin || "",
    gstinDate: s.gstinDate || "",
    gstinState: s.gstinState || "",
    franchiseCode: s.franchiseCode || "",
    franchiseName: s.franchiseName || "",
    enteredBy: s.enteredBy || 0,
    mop: Array.isArray(s.objPayMode) ? s.objPayMode.map(m => ({
      name: m.paymentModeName || "",
      code: String(m.paymentModeID || ""),
      crossStore: m.isCrossStoreUsage === "Y",
      ledger: m.ledgerName || "",
      controlAccount: m.subLedgerName || "",
      discontinued: m.discontinued === "Y",
    })) : [],
    pettyCash: Array.isArray(s.objPettyCash) ? s.objPettyCash.map(p => ({
      head: p.pettyCashName || "",
      limit: String(p.limit || ""),
      type: p.modeOfOperation || "",
      ledger: p.ledgerName || "",
      subLedger: p.subLedgerName || "",
      discontinued: p.discontinued === "Y",
    })) : [],
    docSeries: Array.isArray(s.objSeries) ? s.objSeries.map(d => ({
      txType: String(d.transactionType || ""),
      seriesName: d.seriesname || d.seriesName || "",
      prefix: d.prefix || "",
      digits: String(d.noOfDigits || "4"),
      suffix: d.suffix || "",
      discontinued: false,
    })) : [],
  };
}

// ─── Local Form to API Payload Mapper ─────────────────────────────────────────
function mapLocalStoreToApi(form, mode) {
  return {
    storeID: mode === "edit" ? (form.id || 0) : 0,
    storeCode: form.code || "",
    storeName: form.name || "",
    startDate: form.startDate || "",
    closeDate: form.closeDate || "",
    storeTypeCode: "",
    storeTypeName: form.type || "",
    storeCategoryCode: "",
    storeCategoryName: form.category || "",
    franchiseCode: form.franchiseCode || "",
    franchiseName: form.franchiseName || "",
    storeSize: Number(form.storeSize) || 0,
    operationTypeCode: "",
    operationTypeName: form.operation || "",
    defaultWarehouseCode: "",
    defaultWarehouseName: form.warehouse || "",
    defaultSaleWHCode: "",
    defaultSaleWHName: form.saleWarehouse || "",
    defaultReturnWHCode: "",
    defaultReturnWHName: form.returnWarehouse || "",
    isActive: form.inactive ? "N" : "Y",
    billAddress: form.billAddress || "",
    billCity: form.city || "",
    billPostalCode: form.postalCode || "",
    billStateCode: "",
    billStateName: form.state || "",
    billCountryCode: "",
    billCountryName: "",
    shipAddress: form.shipAddress || "",
    shipCity: form.shipCity || form.city || "",
    shipPostalCode: form.postalCode || "",
    shipStateCode: "",
    shipStateName: form.shipState || form.state || "",
    shipCountryCode: "",
    shipCountryName: "",
    contactPerson: form.contactPerson || "",
    contactNumber: form.contactNumber || "",
    alternateContactNumber: form.alternateContactNumber || "",
    email: form.email || "",
    priceListID: 0,
    priceListName: form.priceList || "",
    factor: form.factor || "",
    gstin: form.gstin || "",
    gstinDate: form.gstinDate || "",
    gstinState: form.gstinState || "",
    enteredBy: form.enteredBy || 0,
    usedFor: mode === "edit" ? "U" : "I",
    objWareHouse: [],
    objPayMode: (form.mop || []).map(m => ({
      storeID: mode === "edit" ? (form.id || 0) : 0,
      paymentModeID: Number(m.code) || 0,
      paymentModeName: m.name || "",
      isCrossStoreUsage: m.crossStore ? "Y" : "N",
      ledgerCode: "",
      ledgerName: m.ledger || "",
      subLedgerCode: "",
      subLedgerName: m.controlAccount || "",
      discontinued: m.discontinued ? "Y" : "N",
    })),
    objPettyCash: (form.pettyCash || []).map(p => ({
      storeID: mode === "edit" ? (form.id || 0) : 0,
      pettyCashID: 0,
      pettyCashName: p.head || "",
      limit: Number(p.limit) || 0,
      modeOfOperation: (p.type || "").charAt(0) || "",
      ledgerCode: "",
      ledgerName: p.ledger || "",
      subLedgerCode: "",
      subLedgerName: p.subLedger || "",
      discontinued: p.discontinued ? "Y" : "N",
    })),
    objSeries: (form.docSeries || []).map(d => ({
      storeID: mode === "edit" ? (form.id || 0) : 0,
      transactionType: Number(d.txType) || 0,
      seriesName: d.seriesName || "",
      prefix: d.prefix || "",
      noOfDigit: Number(d.digits) || 4,
      suffix: d.suffix || "",
      discontinued: d.discontinued ? "Y" : "N",
    })),
    objLedger: [],
  };
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className="toast-icon">
            {t.type === "success" ? "✅" : t.type === "error" ? "❌" : t.type === "warning" ? "⚠️" : "ℹ️"}
          </span>
          <div>
            <div className="toast-title">{t.title}</div>
            {t.msg && <div className="toast-msg">{t.msg}</div>}
          </div>
          <button className="toast-close" onClick={() => removeToast(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (type, title, msg) => {
    const id = uid();
    setToasts(p => [...p, { id, type, title, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };
  const remove = id => setToasts(p => p.filter(t => t.id !== id));
  return { toasts, add, remove };
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ msg, onConfirm, onCancel }) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon">🗑️</div>
        <div className="confirm-title">Confirm Delete</div>
        <div className="confirm-msg">{msg}</div>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Store Detail ────────────────────────────────────────────────────────
function TabStoreDetail({ form, onChange }) {
  return (
    <div className="sky-section-content" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#f8fafc', minHeight: '100%' }}>
      {/* Basic Information Card */}
      <div className="sky-card">
        <div className="sky-card-header">
          <div className="sky-card-icon">🏪</div>
          <div>
            <div className="sky-card-title">Basic Information</div>
            <div className="sky-card-desc">Store identification and classification details</div>
          </div>
        </div>
        <div className="sky-card-body">
          <div className="sky-grid">
            <div>
              <label className="sky-label required">Store Code</label>
              <input className={`sky-input${!form.code ? " error" : ""}`} value={form.code} onChange={e => onChange("code", e.target.value)} placeholder="e.g. 007" maxLength={10} />
              {!form.code && <div className="sky-error">Required</div>}
            </div>
            <div>
              <label className="sky-label required">Store Name</label>
              <input className={`sky-input${!form.name ? " error" : ""}`} value={form.name} onChange={e => onChange("name", e.target.value)} placeholder="e.g. DB-MARSHAGHAI" />
              {!form.name && <div className="sky-error">Required</div>}
            </div>
            <div>
              <label className="sky-label required">Start Date</label>
              <input type="date" className={`sky-input${!form.startDate ? " error" : ""}`} value={form.startDate} onChange={e => onChange("startDate", e.target.value)} />
              {!form.startDate && <div className="sky-error">Required</div>}
            </div>
            <div>
              <label className="sky-label">Close Date</label>
              <input type="date" className="sky-input" value={form.closeDate} onChange={e => onChange("closeDate", e.target.value)} />
              <div className="sky-hint">Leave blank if store is still active</div>
            </div>
            <div>
              <label className="sky-label required">Price List</label>
              <select className="sky-select" value={form.priceList} onChange={e => onChange("priceList", e.target.value)}>
                {PRICE_LISTS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="sky-label required">Store Size (sq ft)</label>
              <input type="number" className="sky-input" value={form.storeSize} onChange={e => onChange("storeSize", e.target.value)} placeholder="e.g. 3500" />
            </div>
            <div>
              <label className="sky-label">Factor (if any)</label>
              <input type="number" step="0.01" className="sky-input" value={form.factor} onChange={e => onChange("factor", e.target.value)} placeholder="1" />
            </div>
            <div>
              <label className="sky-label required">Store Type</label>
              <select className="sky-select" value={form.type} onChange={e => onChange("type", e.target.value)}>
                {STORE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="sky-label required">Operation Type</label>
              <select className="sky-select" value={form.operation} onChange={e => onChange("operation", e.target.value)}>
                {OPERATION_TYPES.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="sky-label required">Store Category</label>
              <select className="sky-select" value={form.category} onChange={e => onChange("category", e.target.value)}>
                {STORE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Configuration Card */}
      <div className="sky-card">
        <div className="sky-card-header">
          <div className="sky-card-icon">🏭</div>
          <div>
            <div className="sky-card-title">Warehouse Configuration</div>
            <div className="sky-card-desc">Default warehouse assignments for store operations</div>
          </div>
        </div>
        <div className="sky-card-body">
          <div className="sky-grid sky-grid-3">
            <div>
              <label className="sky-label required">Default Warehouse</label>
              <select className="sky-select" value={form.warehouse} onChange={e => onChange("warehouse", e.target.value)}>
                <option value="">— Select —</option>
                {WAREHOUSES.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className="sky-label required">Default Sale Warehouse</label>
              <select className="sky-select" value={form.saleWarehouse} onChange={e => onChange("saleWarehouse", e.target.value)}>
                <option value="">— Select —</option>
                {WAREHOUSES.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className="sky-label required">Default Return Warehouse</label>
              <select className="sky-select" value={form.returnWarehouse} onChange={e => onChange("returnWarehouse", e.target.value)}>
                <option value="">— Select —</option>
                {WAREHOUSES.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div className="sky-card">
        <div className="sky-card-header">
          <div className="sky-card-icon">⚙️</div>
          <div>
            <div className="sky-card-title">Store Status</div>
            <div className="sky-card-desc">Control store active/inactive status</div>
          </div>
        </div>
        <div className="sky-card-body">
          <div className="sky-checkbox-wrap">
            <input type="checkbox" className="sky-checkbox" id="inactive" checked={form.inactive} onChange={e => onChange("inactive", e.target.checked)} />
            <label className="sky-checkbox-label" htmlFor="inactive">Mark as Inactive</label>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Logistics ───────────────────────────────────────────────────────────
function TabLogistics({ form, onChange }) {
  const copyBillToShip = () => {
    onChange("shipAddress", form.billAddress);
    onChange("shipCity", form.city);
    onChange("shipState", form.state);
  };
  return (
    <div className="sky-section-content" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#f8fafc', minHeight: '100%' }}>
      {/* Billing Address Card */}
      <div className="sky-card">
        <div className="sky-card-header">
          <div className="sky-card-icon">📍</div>
          <div>
            <div className="sky-card-title">Billing Address</div>
            <div className="sky-card-desc">Primary billing address for the store</div>
          </div>
        </div>
        <div className="sky-card-body">
          <div className="sky-grid">
            <div style={{ gridColumn: 'span 2' }}>
              <label className="sky-label required">Bill To Address</label>
              <textarea className="sky-input" value={form.billAddress} onChange={e => onChange("billAddress", e.target.value)} placeholder="Street, Area, Landmark" rows={4} />
            </div>
            <div>
              <label className="sky-label required">Bill To City</label>
              {/* <select className="sky-select" value={form.city} onChange={e => onChange("city", e.target.value)}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select> */}
              <input className="sky-input" value={form.city} onChange={e => onChange("city", e.target.value)} placeholder="City" />
            </div>
            <div>
              <label className="sky-label required">Bill To State</label>
              <select className="sky-select" value={form.state} onChange={e => onChange("state", e.target.value)}>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="sky-label required">Bill To Postal Code</label>
              <input className="sky-input" value={form.postalCode} onChange={e => onChange("postalCode", e.target.value)} placeholder="700000" maxLength={6} />
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address Card */}
      <div className="sky-card">
        <div className="sky-card-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="sky-card-icon">🚚</div>
            <div>
              <div className="sky-card-title">Shipping Address</div>
              <div className="sky-card-desc">Delivery and shipping address for the store</div>
            </div>
          </div>
          <button className="copy-addr-btn" onClick={copyBillToShip}>📋 Copy from Billing</button>
        </div>
        <div className="sky-card-body">
          <div className="sky-grid">
            <div style={{ gridColumn: 'span 2' }}>
              <label className="sky-label required">Ship To Address</label>
              <textarea className="sky-input" value={form.shipAddress} onChange={e => onChange("shipAddress", e.target.value)} placeholder="Street, Area, Landmark" rows={4} />
            </div>
            <div>
              <label className="sky-label required">Ship To City</label>
              <select className="sky-select" value={form.shipCity || form.city} onChange={e => onChange("shipCity", e.target.value)}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="sky-label required">Ship To State</label>
              <select className="sky-select" value={form.shipState || form.state} onChange={e => onChange("shipState", e.target.value)}>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="sky-label required">Ship To Postal Code</label>
              <input className="sky-input" value={form.postalCode} onChange={e => onChange("postalCode", e.target.value)} placeholder="700000" maxLength={6} />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="sky-card">
        <div className="sky-card-header">
          <div className="sky-card-icon">📞</div>
          <div>
            <div className="sky-card-title">Contact Information</div>
            <div className="sky-card-desc">Store contact person and communication details</div>
          </div>
        </div>
        <div className="sky-card-body">
          <div className="sky-grid sky-grid-3">
            <div>
              <label className="sky-label required">Contact Person</label>
              <input className="sky-input" value={form.contactPerson} onChange={e => onChange("contactPerson", e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label className="sky-label required">Contact Number</label>
              <input className="sky-input" value={form.contactNumber} onChange={e => onChange("contactNumber", e.target.value)} placeholder="10-digit mobile" maxLength={10} />
            </div>
            <div>
              <label className="sky-label required">Email ID</label>
              <input type="email" className="sky-input" value={form.email} onChange={e => onChange("email", e.target.value)} placeholder="store@example.com" />
            </div>
          </div>
        </div>
      </div>

      {/* Sourcing Warehouse Card */}
      <div className="sky-card">
        <div className="sky-card-header">
          <div className="sky-card-icon">🏭</div>
          <div>
            <div className="sky-card-title">Sourcing Warehouse</div>
            <div className="sky-card-desc">Configure warehouse transit days and sourcing</div>
          </div>
        </div>
        <div className="sky-card-body" style={{ padding: 0 }}>
          <div className="sub-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <div className="sub-table-header">
              <span className="sub-table-title">Warehouse Transit Days</span>
              <button className="btn btn-sm btn-secondary">+ Add Row</button>
            </div>
            <div className="empty-table">
              <div className="empty-icon">🏭</div>
              <div className="empty-text">No sourcing warehouse configured</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: MOP Details ─────────────────────────────────────────────────────────
function TabMOPDetails({ form, onChange }) {
  const addRow = () => onChange("mop", [...form.mop, { name: "Cash", code: String(form.mop.length + 1), crossStore: false, ledger: "", controlAccount: "", discontinued: false }]);
  const delRow = i => onChange("mop", form.mop.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) => onChange("mop", form.mop.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  return (
    <div className="sky-section-content" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#f8fafc', minHeight: '100%' }}>
      <div className="sky-card">
        <div className="sky-card-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="sky-card-icon">💳</div>
            <div>
              <div className="sky-card-title">Mode of Payment Configuration</div>
              <div className="sky-card-desc">Configure accepted payment modes for the store</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-sm btn-secondary">📋 Copy from Site</button>
            <button className="btn btn-sm btn-primary" onClick={addRow}>+ Add Row</button>
          </div>
        </div>
        <div className="sky-card-body" style={{ padding: 0 }}>
          {form.mop.length === 0 ? (
            <div className="empty-table">
              <div className="empty-icon">💳</div>
              <div className="empty-text">No payment modes configured. Click "Add Row" to begin.</div>
            </div>
          ) : (
            <table className="sub-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>#</th>
                  <th>Paymode Name *</th>
                  <th>Paymode Code</th>
                  <th style={{ width: 110 }}>Cross Store Usage</th>
                  <th>Ledger *</th>
                  <th>Control Account</th>
                  <th style={{ width: 90 }}>Discontinued</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {form.mop.map((r, i) => (
                  <tr key={i}>
                    <td style={{ color: "#6A6D70", fontSize: 11 }}>{i + 1}</td>
                    <td>
                      <select className="sky-select" style={{ padding: '5px 8px', fontSize: 12 }} value={r.name} onChange={e => updateRow(i, "name", e.target.value)}>
                        {MOP_NAMES.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </td>
                    <td><input className="sky-input" style={{ padding: '5px 8px', fontSize: 12 }} value={r.code} onChange={e => updateRow(i, "code", e.target.value)} /></td>
                    <td style={{ textAlign: "center" }}>
                      <input type="checkbox" className="sky-checkbox" checked={r.crossStore} onChange={e => updateRow(i, "crossStore", e.target.checked)} />
                    </td>
                    <td>
                      <select className="sky-select" style={{ padding: '5px 8px', fontSize: 12 }} value={r.ledger} onChange={e => updateRow(i, "ledger", e.target.value)}>
                        <option value="">— Select —</option>
                        {LEDGERS.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </td>
                    <td>
                      <select className="sky-select" style={{ padding: '5px 8px', fontSize: 12 }} value={r.controlAccount} onChange={e => updateRow(i, "controlAccount", e.target.value)}>
                        <option value="">— Select Sub Ledger —</option>
                        {LEDGERS.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input type="checkbox" className="sky-checkbox" checked={r.discontinued} onChange={e => updateRow(i, "discontinued", e.target.checked)} />
                    </td>
                    <td>
                      <button className="btn btn-icon btn-danger btn-sm" onClick={() => delRow(i)} title="Delete row">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Petty Cash Details ──────────────────────────────────────────────────
function TabPettyCash({ form, onChange }) {
  const addRow = () => onChange("pettyCash", [...form.pettyCash, { head: "General Expenses", limit: "", type: "Payment", ledger: "", subLedger: "", discontinued: false }]);
  const delRow = i => onChange("pettyCash", form.pettyCash.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) => onChange("pettyCash", form.pettyCash.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  return (
    <div className="sky-section-content" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#f8fafc', minHeight: '100%' }}>
      <div className="sky-card">
        <div className="sky-card-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="sky-card-icon">💰</div>
            <div>
              <div className="sky-card-title">Petty Cash Head Configuration</div>
              <div className="sky-card-desc">Configure petty cash heads, limits and transaction types</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-sm btn-secondary">📋 Copy from Site</button>
            <button className="btn btn-sm btn-primary" onClick={addRow}>+ Add Row</button>
          </div>
        </div>
        <div className="sky-card-body" style={{ padding: 0 }}>
          {form.pettyCash.length === 0 ? (
            <div className="empty-table">
              <div className="empty-icon">💰</div>
              <div className="empty-text">No petty cash heads configured. Click "Add Row" to begin.</div>
            </div>
          ) : (
            <table className="sub-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>#</th>
                  <th>Petty Cash Head *</th>
                  <th>Limit</th>
                  <th>Type of Transaction *</th>
                  <th>Ledger *</th>
                  <th>Sub Ledger</th>
                  <th style={{ width: 90 }}>Discontinued</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {form.pettyCash.map((r, i) => (
                  <tr key={i}>
                    <td style={{ color: "#6A6D70", fontSize: 11 }}>{i + 1}</td>
                    <td>
                      <select className="sky-select" style={{ padding: '5px 8px', fontSize: 12 }} value={r.head} onChange={e => updateRow(i, "head", e.target.value)}>
                        {PETTY_HEADS.map(h => <option key={h}>{h}</option>)}
                      </select>
                    </td>
                    <td><input type="number" className="sky-input" style={{ padding: '5px 8px', fontSize: 12 }} value={r.limit} onChange={e => updateRow(i, "limit", e.target.value)} placeholder="0.00" /></td>
                    <td>
                      <select className="sky-select" style={{ padding: '5px 8px', fontSize: 12 }} value={r.type} onChange={e => updateRow(i, "type", e.target.value)}>
                        <option>Payment</option><option>Receipt</option>
                      </select>
                    </td>
                    <td>
                      <select className="sky-select" style={{ padding: '5px 8px', fontSize: 12 }} value={r.ledger} onChange={e => updateRow(i, "ledger", e.target.value)}>
                        <option value="">— Select Ledger —</option>
                        {LEDGERS.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </td>
                    <td>
                      <select className="sky-select" style={{ padding: '5px 8px', fontSize: 12 }} value={r.subLedger} onChange={e => updateRow(i, "subLedger", e.target.value)}>
                        <option value="">— Select Sub Ledger —</option>
                        {LEDGERS.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input type="checkbox" className="sky-checkbox" checked={r.discontinued} onChange={e => updateRow(i, "discontinued", e.target.checked)} />
                    </td>
                    <td>
                      <button className="btn btn-icon btn-danger btn-sm" onClick={() => delRow(i)}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Document Series ─────────────────────────────────────────────────────
function TabDocSeries({ form, onChange }) {
  const addRow = () => onChange("docSeries", [...form.docSeries, { txType: "Sale", seriesName: "", prefix: "", digits: "4", suffix: "", discontinued: false }]);
  const delRow = i => onChange("docSeries", form.docSeries.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) => onChange("docSeries", form.docSeries.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  return (
    <div className="sky-section-content" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#f8fafc', minHeight: '100%' }}>
      <div className="sky-card">
        <div className="sky-card-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="sky-card-icon">📄</div>
            <div>
              <div className="sky-card-title">Document Numbering Series</div>
              <div className="sky-card-desc">Configure transaction document numbering and prefixes</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-sm btn-secondary">📋 Copy from Site</button>
            <button className="btn btn-sm btn-primary" onClick={addRow}>+ Add Row</button>
          </div>
        </div>
        <div className="sky-card-body" style={{ padding: 0 }}>
          {form.docSeries.length === 0 ? (
            <div className="empty-table">
              <div className="empty-icon">📄</div>
              <div className="empty-text">No document series configured. Click "Add Row" to begin.</div>
            </div>
          ) : (
            <table className="sub-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>#</th>
                  <th>Transaction Type *</th>
                  <th>Series Name *</th>
                  <th>Prefix</th>
                  <th>No. of Digits *</th>
                  <th>Suffix</th>
                  <th>Preview</th>
                  <th style={{ width: 90 }}>Discontinued</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {form.docSeries.map((r, i) => (
                  <tr key={i}>
                    <td style={{ color: "#6A6D70", fontSize: 11 }}>{i + 1}</td>
                    <td>
                      <select className="sky-select" style={{ padding: '5px 8px', fontSize: 12 }} value={r.txType} onChange={e => updateRow(i, "txType", e.target.value)}>
                        {TX_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </td>
                    <td><input className="sky-input" style={{ padding: '5px 8px', fontSize: 12 }} value={r.seriesName} onChange={e => updateRow(i, "seriesName", e.target.value)} placeholder="Series name" /></td>
                    <td><input className="sky-input" style={{ padding: '5px 8px', fontSize: 12 }} value={r.prefix} onChange={e => updateRow(i, "prefix", e.target.value)} placeholder="e.g. MRS/25-26" /></td>
                    <td><input type="number" className="sky-input" style={{ padding: '5px 8px', fontSize: 12, width: 70 }} value={r.digits} onChange={e => updateRow(i, "digits", e.target.value)} min={1} max={10} /></td>
                    <td><input className="sky-input" style={{ padding: '5px 8px', fontSize: 12 }} value={r.suffix} onChange={e => updateRow(i, "suffix", e.target.value)} placeholder="Optional" /></td>
                    <td>
                      <code style={{ fontSize: 11, background: "#EBF3FC", color: "#0A6ED1", padding: "3px 8px", borderRadius: 4, fontWeight: 500 }}>
                        {r.prefix || "PRE"}/{String(1).padStart(parseInt(r.digits) || 4, "0")}{r.suffix || ""}
                      </code>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input type="checkbox" className="sky-checkbox" checked={r.discontinued} onChange={e => updateRow(i, "discontinued", e.target.checked)} />
                    </td>
                    <td>
                      <button className="btn btn-icon btn-danger btn-sm" onClick={() => delRow(i)}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Ledgers ─────────────────────────────────────────────────────────────
function TabLedgers({ form, onChange }) {
  const LEDGER_TYPES = [
    { key: "salesLedger", label: "Sales Ledger", hint: "Revenue account for POS sales" },
    { key: "returnLedger", label: "Sales Return Ledger", hint: "Account for returned goods" },
    { key: "discountLedger", label: "Discount Ledger", hint: "Account for discounts granted" },
    { key: "taxLedger", label: "GST Output Ledger", hint: "Output GST tax account" },
    { key: "roundoffLedger", label: "Round-Off Ledger", hint: "Account for rounding adjustments" },
    { key: "cashLedger", label: "Cash in Hand Ledger", hint: "Physical cash account" },
  ];
  return (
    <div className="sky-section-content" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#f8fafc', minHeight: '100%' }}>
      <div className="sky-card">
        <div className="sky-card-header">
          <div className="sky-card-icon">📊</div>
          <div>
            <div className="sky-card-title">Ledger Account Mapping</div>
            <div className="sky-card-desc">Map ledger accounts for store financial transactions</div>
          </div>
        </div>
        <div className="sky-card-body">
          <div className="sky-grid">
            {LEDGER_TYPES.map(({ key, label, hint }) => (
              <div key={key}>
                <label className="sky-label">{label}</label>
                <select className="sky-select" value={form[key] || ""} onChange={e => onChange(key, e.target.value)}>
                  <option value="">— Select Ledger —</option>
                  {LEDGERS.map(l => <option key={l}>{l}</option>)}
                </select>
                <div className="sky-hint">{hint}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Store Modal ──────────────────────────────────────────────────────────────
function StoreModal({ store, onClose, onSave, mode }) {
  const [activeTab, setActiveTab] = useState("store");
  const [form, setForm] = useState(store || emptyStore());
  const [errors, setErrors] = useState({});

  const onChange = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const validate = () => {
    const e = {};
    if (!form.code) e.code = "Required";
    if (!form.name) e.name = "Required";
    if (!form.startDate) e.startDate = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) { setActiveTab("store"); return; }
    onSave({ ...form, id: form.id || uid(), status: form.inactive ? "Inactive" : "Active" }, mode);
  };

  const tabValid = {
    store: form.code && form.name && form.startDate,
    logistics: form.billAddress && form.contactPerson,
    mop: form.mop.length > 0,
    petty: form.pettyCash.length > 0,
    series: form.docSeries.length > 0,
    ledgers: true,
  };

  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">🏪</div>
            <div>
              <div className="modal-title">{mode === "create" ? "Create New Store" : `Edit Store — ${form.name}`}</div>
              <div className="modal-subtitle">
                {mode === "create" ? "POS Store Master · SAP B1 Integrated" : `Store Code: ${form.code} · Last Sync: Just now`}
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-tabs">
          {TABS.map(tab => (
            <button key={tab.id} className={`tab-btn${activeTab === tab.id ? " active" : ""}`} onClick={() => setActiveTab(tab.id)}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tabValid[tab.id] && activeTab !== tab.id
                ? <span className="tab-done">✓</span>
                : (tab.id === "store" && (!form.code || !form.name) ? <span className="tab-badge">!</span> : null)
              }
            </button>
          ))}
        </div>

        <div className="modal-body">
          {activeTab === "store" && <TabStoreDetail form={form} onChange={onChange} />}
          {activeTab === "logistics" && <TabLogistics form={form} onChange={onChange} />}
          {activeTab === "mop" && <TabMOPDetails form={form} onChange={onChange} />}
          {activeTab === "petty" && <TabPettyCash form={form} onChange={onChange} />}
          {activeTab === "series" && <TabDocSeries form={form} onChange={onChange} />}
          {activeTab === "ledgers" && <TabLedgers form={form} onChange={onChange} />}
        </div>

        <div className="modal-footer">
          <div className="footer-info" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            Linked to SAP Business One · Real-time sync enabled
            {form.code && <span style={{ marginLeft: 12, fontFamily: "IBM Plex Mono, monospace", color: '#0A6ED1', fontWeight: 500 }}>#{form.code}</span>}
          </div>
          <div style={{ display: "flex", gap: 10, marginRight: '100px' }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-secondary" onClick={() => {
              const tabs = TABS.map(t => t.id);
              const cur = tabs.indexOf(activeTab);
              if (cur > 0) setActiveTab(tabs[cur - 1]);
            }}>← Previous</button>
            {activeTab !== "ledgers" ? (
              <button className="btn btn-primary" onClick={() => {
                const tabs = TABS.map(t => t.id);
                const cur = tabs.indexOf(activeTab);
                if (cur < tabs.length - 1) setActiveTab(tabs[cur + 1]);
              }}>Next →</button>
            ) : null}
            <button className="btn btn-accent" onClick={handleSave}>
              {mode === "create" ? "✅ Create Store" : "💾 Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── View Detail Modal ────────────────────────────────────────────────────────
function ViewModal({ store, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState("store");
  const F = ({ label, value, mono }) => (
    <div style={{ marginBottom: 4 }}>
      <div className="sky-label">{label}</div>
      <div style={{ fontFamily: mono ? "IBM Plex Mono, monospace" : "inherit", fontSize: 13, fontWeight: 500, color: "#1F2937", padding: "8px 12px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 6 }}>
        {value || <span style={{ color: "#9CA3AF", fontStyle: "italic" }}>Not set</span>}
      </div>
    </div>
  );
  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">🔍</div>
            <div>
              <div className="modal-title">Store Detail — {store.name}</div>
              <div className="modal-subtitle">Store Code: {store.code} · {store.status} · {store.syncStatus}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-sm btn-primary" onClick={() => onEdit(store)}>✏️ Edit</button>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
        </div>
        <div className="modal-tabs">
          {TABS.map(tab => (
            <button key={tab.id} className={`tab-btn${activeTab === tab.id ? " active" : ""}`} onClick={() => setActiveTab(tab.id)}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <div className="modal-body">
          {activeTab === "store" && (
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#f8fafc', minHeight: '100%' }}>
              <div className="sky-card">
                <div className="sky-card-header">
                  <div className="sky-card-icon">🏪</div>
                  <div>
                    <div className="sky-card-title">Basic Information</div>
                    <div className="sky-card-desc">Store identification and classification details</div>
                  </div>
                </div>
                <div className="sky-card-body">
                  <div className="sky-grid">
                    <F label="Store Code" value={store.code} mono />
                    <F label="Store Name" value={store.name} />
                    <F label="Start Date" value={store.startDate} />
                    <F label="Close Date" value={store.closeDate || "—"} />
                    <F label="Store Size" value={store.storeSize ? `${store.storeSize} sq ft` : ""} />
                    <F label="Price List" value={store.priceList} />
                    <F label="Factor" value={store.factor} />
                    <F label="Store Type" value={store.type} />
                    <F label="Store Category" value={store.category} />
                    <F label="Operation Type" value={store.operation} />
                  </div>
                </div>
              </div>
              <div className="sky-card">
                <div className="sky-card-header">
                  <div className="sky-card-icon">🏭</div>
                  <div>
                    <div className="sky-card-title">Warehouse Configuration</div>
                    <div className="sky-card-desc">Default warehouse assignments</div>
                  </div>
                </div>
                <div className="sky-card-body">
                  <div className="sky-grid sky-grid-3">
                    <F label="Default Warehouse" value={store.warehouse} />
                    <F label="Sale Warehouse" value={store.saleWarehouse} />
                    <F label="Return Warehouse" value={store.returnWarehouse} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "logistics" && (
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#f8fafc', minHeight: '100%' }}>
              <div className="sky-card">
                <div className="sky-card-header">
                  <div className="sky-card-icon">📍</div>
                  <div>
                    <div className="sky-card-title">Billing Address</div>
                    <div className="sky-card-desc">Primary billing address for the store</div>
                  </div>
                </div>
                <div className="sky-card-body">
                  <div className="sky-grid">
                    <F label="Address" value={store.billAddress} />
                    <F label="City" value={store.city} />
                    <F label="State" value={store.state} />
                    <F label="Postal Code" value={store.postalCode} />
                  </div>
                </div>
              </div>
              <div className="sky-card">
                <div className="sky-card-header">
                  <div className="sky-card-icon">📞</div>
                  <div>
                    <div className="sky-card-title">Contact Information</div>
                    <div className="sky-card-desc">Store contact details</div>
                  </div>
                </div>
                <div className="sky-card-body">
                  <div className="sky-grid sky-grid-3">
                    <F label="Contact Person" value={store.contactPerson} />
                    <F label="Contact Number" value={store.contactNumber} />
                    <F label="Email" value={store.email} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "mop" && (
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#f8fafc', minHeight: '100%' }}>
              <div className="sky-card">
                <div className="sky-card-header">
                  <div className="sky-card-icon">💳</div>
                  <div>
                    <div className="sky-card-title">Mode of Payment</div>
                    <div className="sky-card-desc">Configured payment modes</div>
                  </div>
                </div>
                <div className="sky-card-body" style={{ padding: 0 }}>
                  {store.mop?.length > 0 ? (
                    <table className="sub-table" style={{ border: "none" }}>
                      <thead><tr><th>#</th><th>Paymode</th><th>Code</th><th>Cross Store</th><th>Ledger</th><th>Status</th></tr></thead>
                      <tbody>{store.mop.map((r, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td><td>{r.name}</td><td><code style={{ background: '#EBF3FC', color: '#0A6ED1', padding: '2px 6px', borderRadius: 4 }}>{r.code}</code></td>
                          <td>{r.crossStore ? "✅ Yes" : "No"}</td><td>{r.ledger || "—"}</td>
                          <td><span className={`badge ${r.discontinued ? "badge-inactive" : "badge-active"}`}>{r.discontinued ? "Discontinued" : "Active"}</span></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  ) : <div className="empty-table"><div className="empty-icon">💳</div><div className="empty-text">No MOP configured</div></div>}
                </div>
              </div>
            </div>
          )}
          {activeTab === "petty" && (
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#f8fafc', minHeight: '100%' }}>
              <div className="sky-card">
                <div className="sky-card-header">
                  <div className="sky-card-icon">💰</div>
                  <div>
                    <div className="sky-card-title">Petty Cash Configuration</div>
                    <div className="sky-card-desc">Configured petty cash heads</div>
                  </div>
                </div>
                <div className="sky-card-body" style={{ padding: 0 }}>
                  {store.pettyCash?.length > 0 ? (
                    <table className="sub-table" style={{ border: "none" }}>
                      <thead><tr><th>#</th><th>Head</th><th>Limit</th><th>Type</th><th>Ledger</th><th>Status</th></tr></thead>
                      <tbody>{store.pettyCash.map((r, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td><td>{r.head}</td>
                          <td>₹ {Number(r.limit).toLocaleString("en-IN")}</td>
                          <td>{r.type}</td><td>{r.ledger || "—"}</td>
                          <td><span className={`badge ${r.discontinued ? "badge-inactive" : "badge-active"}`}>{r.discontinued ? "Discontinued" : "Active"}</span></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  ) : <div className="empty-table"><div className="empty-icon">💰</div><div className="empty-text">No petty cash configured</div></div>}
                </div>
              </div>
            </div>
          )}
          {activeTab === "series" && (
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#f8fafc', minHeight: '100%' }}>
              <div className="sky-card">
                <div className="sky-card-header">
                  <div className="sky-card-icon">📄</div>
                  <div>
                    <div className="sky-card-title">Document Series</div>
                    <div className="sky-card-desc">Configured document numbering series</div>
                  </div>
                </div>
                <div className="sky-card-body" style={{ padding: 0 }}>
                  {store.docSeries?.length > 0 ? (
                    <table className="sub-table" style={{ border: "none" }}>
                      <thead><tr><th>#</th><th>Type</th><th>Series Name</th><th>Prefix</th><th>Digits</th><th>Sample</th></tr></thead>
                      <tbody>{store.docSeries.map((r, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td><td>{r.txType}</td><td>{r.seriesName}</td>
                          <td><code style={{ background: '#EBF3FC', color: '#0A6ED1', padding: '2px 6px', borderRadius: 4 }}>{r.prefix}</code></td><td>{r.digits}</td>
                          <td><code style={{ background: "#EBF3FC", color: "#0A6ED1", padding: "3px 8px", borderRadius: 4, fontWeight: 500 }}>{r.prefix}/{String(1).padStart(parseInt(r.digits) || 4, "0")}</code></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  ) : <div className="empty-table"><div className="empty-icon">📄</div><div className="empty-text">No document series configured</div></div>}
                </div>
              </div>
            </div>
          )}
          {activeTab === "ledgers" && (
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#f8fafc', minHeight: '100%' }}>
              <div className="sky-card">
                <div className="sky-card-header">
                  <div className="sky-card-icon">📊</div>
                  <div>
                    <div className="sky-card-title">Ledger Mapping</div>
                    <div className="sky-card-desc">Ledger account configurations</div>
                  </div>
                </div>
                <div className="sky-card-body">
                  <div className="empty-table"><div className="empty-icon">📊</div><div className="empty-text">Ledger mapping not configured</div></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <div className="footer-info" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            Store ID: {store.id} · SAP Sync: {store.syncStatus}
          </div>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortCol, setSortCol] = useState("code");
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | { mode: "create"|"edit"|"view", store }
  const [confirm, setConfirm] = useState(null);
  const { toasts, add: addToast, remove: removeToast } = useToast();
  const [detailLoading, setDetailLoading] = useState(false);

  //! New for dynamic store Data fecthing
  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await GetAPI('/api/StoreMaster/GetAllStoreMaster', '', {}, '');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setStores(response.data.map(mapApiStoreToLocal));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setLoading(false);
    }
  };

  //! Fetch single store detail by ID
  const fetchStoreById = async (storeId) => {
    try {
      const response = await GetAPI('/api/StoreMaster/GetStoreMaster', `?StoreID=${storeId}`, {}, '');
      if (response.data) {
        return mapApiStoreToLocal(response.data);
      }
      return null;
    } catch (error) {
      console.error('Error fetching store detail:', error);
      return null;
    }
  };

  //! Open view/edit modal after fetching detail from API
  const openStoreModal = async (mode, storeId) => {
    setDetailLoading(true);
    const detail = await fetchStoreById(storeId);
    setDetailLoading(false);
    if (detail) {
      setModal({ mode, store: detail });
    } else {
      addToast('error', 'Error', 'Failed to fetch store details.');
    }
  };

  const PAGE_SIZE = 8;

  const filtered = stores.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || (s.code || "").toLowerCase().includes(q) || (s.name || "").toLowerCase().includes(q) || (s.city || "").toLowerCase().includes(q) || (s.category || "").toLowerCase().includes(q);
    const matchFilter = filter === "all" || (filter === "active" && s.status === "Active") || (filter === "inactive" && s.status === "Inactive") || (filter === "coco" && (s.category || "").includes("Company Operated")) || (filter === "cofo" && (s.category || "").includes("Franchise Operated"));
    return matchSearch && matchFilter;
  }).sort((a, b) => {
    const av = String(a[sortCol] || "").toLowerCase();
    const bv = String(b[sortCol] || "").toLowerCase();
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sort = col => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const stats = {
    total: stores.length,
    active: stores.filter(s => s.status === "Active").length,
    inactive: stores.filter(s => s.status === "Inactive").length,
    pending: stores.filter(s => s.syncStatus !== "Synced").length,
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async (store, mode) => {
    try {
      setSaving(true);
      const payload = mapLocalStoreToApi(store, mode);
      const response = await PostAPI('/api/StoreMasterRep/PostStoreMaster-1', '', payload, '');
      setSaving(false);

      if (response.data && response.data[0] && response.data[0].returnCode === 'Y') {
        addToast("success", mode === "edit" ? "Store Updated" : "Store Created", response.data[0].returnMsg || `${store.name} saved successfully.`);
        setModal(null);
        fetchStores(); // refresh list from API
      } else {
        const msg = (response.data && response.data[0] && response.data[0].returnMsg) || 'Something went wrong.';
        addToast("error", "Save Failed", msg);
      }
    } catch (error) {
      setSaving(false);
      console.error('Error saving store:', error);
      addToast("error", "Error", error?.message || 'Failed to save store.');
    }
  };

  const handleDelete = (id) => {
    const store = stores.find(s => s.id === id);
    setConfirm({
      msg: `Are you sure you want to delete store "${store?.name}" (${store?.code})? This action cannot be undone.`,
      onConfirm: () => {
        setStores(p => p.filter(s => s.id !== id));
        addToast("info", "Store Deleted", `${store?.name} has been removed.`);
        setConfirm(null);
      }
    });
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const SortIcon = ({ col }) => (
    <span className="sort-icon">
      {sortCol === col ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="page-wrapper">
        {/* Shell Header */}
        {/* <header className="shell-header">
          <div className="shell-logo">SAP</div>
          <div className="shell-product">Business One — POS Extension</div>
          <nav className="shell-nav">
            <button className="shell-btn" title="Home">🏠</button>
            <button className="shell-btn" title="Search">🔍</button>
            <button className="shell-btn" title="Notifications">🔔</button>
            <button className="shell-btn" title="Settings">⚙️</button>
            <div className="shell-user" title="Logged in user">AD</div>
          </nav>
        </header> */}

        {/* Sync Status Bar */}
        {/* <div className="sync-bar">
          <span className="sync-dot" />
          SAP B1 Connection Active · Last Sync: {new Date().toLocaleTimeString()} · Company: DEMO DB LLP · Server: 192.168.1.1
        </div> */}

        <div className="page-content">
          {/* Breadcrumb */}
          {/* <div className="breadcrumb">
            <a>Home</a><span className="breadcrumb-sep">›</span>
            <a>POS Configuration</a><span className="breadcrumb-sep">›</span>
            <span>Store Master</span>
          </div> */}

          {/* Page Title */}
          <div className="page-title-bar">
            <div>
              <div className="page-title">
                <div className="page-title-icon">🏪</div>
                <div>
                  Store Master
                  <div className="page-subtitle">Manage POS store configurations · SAP Business One integrated</div>
                </div>
              </div>
            </div>
            <button className="btn btn-accent" onClick={() => setModal({ mode: "create", store: null })}>
              + New Store
            </button>
          </div>

          {/* Stats */}
          <div className="stats-bar">
            <div className="stat-card" onClick={() => setFilter("all")}>
              <div className="stat-icon blue">🏪</div>
              <div><div className="stat-value">{stats.total}</div><div className="stat-label">Total Stores</div></div>
            </div>
            <div className="stat-card" onClick={() => setFilter("active")}>
              <div className="stat-icon green">✅</div>
              <div><div className="stat-value">{stats.active}</div><div className="stat-label">Active</div></div>
            </div>
            <div className="stat-card" onClick={() => setFilter("inactive")}>
              <div className="stat-icon amber">⏸️</div>
              <div><div className="stat-value">{stats.inactive}</div><div className="stat-label">Inactive</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red">🔄</div>
              <div><div className="stat-value">{stats.pending}</div><div className="stat-label">Sync Pending</div></div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="toolbar">
            <div className="toolbar-group">
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input className="search-input" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by code, name, city…" />
                {search && <span className="search-clear" onClick={() => setSearch("")}>×</span>}
              </div>
            </div>
            <div className="toolbar-sep" />
            <div className="toolbar-group">
              <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(""); setFilter("all"); }}>⟳ Reset</button>
              <button className="btn btn-secondary btn-sm">⬇ Export</button>
              <button className="btn btn-secondary btn-sm">🖨 Print</button>
            </div>
            <div className="toolbar-sep" />
            <div className="toolbar-group">
              {selected.size > 0 && (
                <>
                  <span style={{ fontSize: 12, color: "var(--sap-brand)", fontWeight: 600 }}>{selected.size} selected</span>
                  <button className="btn btn-danger btn-sm">🗑 Delete Selected</button>
                  <button className="btn btn-secondary btn-sm">⏸ Deactivate</button>
                </>
              )}
            </div>
          </div>

          {/* Filter Chips */}
          <div className="filter-bar">
            {[
              { id: "all", label: "All Stores", cls: "chip-all" },
              { id: "active", label: `Active (${stats.active})`, cls: "chip-active" },
              { id: "inactive", label: `Inactive (${stats.inactive})`, cls: "chip-inactive" },
              { id: "coco", label: "COCO", cls: "chip-coco" },
              { id: "cofo", label: "COFO", cls: "chip-foco" },
            ].map(f => (
              <span key={f.id} className={`filter-chip ${f.id === filter ? f.cls : ""}`} style={f.id !== filter ? { background: "#F5F6FA", color: "var(--sap-text-subtle)", borderColor: "var(--sap-border)" } : {}} onClick={() => { setFilter(f.id); setPage(1); }}>
                {f.label}
              </span>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--sap-text-subtle)" }}>
              {filtered.length} record{filtered.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {/* Table */}
          <div className="table-container">
            <div className="table-header">
              <span>
                <span className="table-title">Store List</span>
                <span className="table-count">({filtered.length} stores)</span>
              </span>
              <span style={{ fontSize: 11, color: "var(--sap-text-subtle)" }}>
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
            </div>
            <div style={{ overflowX: "auto", overflowY: "auto", flex: 1, minHeight: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>
                      <input type="checkbox" className="form-checkbox"
                        checked={paginated.length > 0 && paginated.every(s => selected.has(s.id))}
                        onChange={e => {
                          const next = new Set(selected);
                          paginated.forEach(s => e.target.checked ? next.add(s.id) : next.delete(s.id));
                          setSelected(next);
                        }} />
                    </th>
                    <th className="sortable sorted" onClick={() => sort("code")}>Code <SortIcon col="code" /></th>
                    <th className="sortable" onClick={() => sort("name")}>Store Name <SortIcon col="name" /></th>
                    <th className="sortable" onClick={() => sort("city")}>City <SortIcon col="city" /></th>
                    <th className="sortable" onClick={() => sort("type")}>Type <SortIcon col="type" /></th>
                    <th className="sortable" onClick={() => sort("category")}>Category <SortIcon col="category" /></th>
                    <th className="sortable" onClick={() => sort("operation")}>Operation <SortIcon col="operation" /></th>
                    <th>Size (sq ft)</th>
                    <th className="sortable" onClick={() => sort("startDate")}>Start Date <SortIcon col="startDate" /></th>
                    <th>Status</th>
                    <th>SAP Sync</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={12}>
                      <div className="empty-table">
                        <div className="empty-icon">🔍</div>
                        <div className="empty-text">No stores match the current filter/search criteria.</div>
                      </div>
                    </td></tr>
                  ) : paginated.map(s => (
                    <tr key={s.id} className={selected.has(s.id) ? "selected" : ""} onClick={() => openStoreModal("view", s.id)}>
                      <td onClick={e => { e.stopPropagation(); toggleSelect(s.id); }}>
                        <input type="checkbox" className="form-checkbox" checked={selected.has(s.id)} onChange={() => {}} />
                      </td>
                      <td className="td-code">{s.code}</td>
                      <td>
                        <span className="td-link" onClick={e => { e.stopPropagation(); openStoreModal("view", s.id); }}>
                          {s.name}
                        </span>
                      </td>
                      <td>{s.city}</td>
                      <td style={{ fontSize: 12 }}>{s.type}</td>
                      <td>
                        <span className={`badge ${(s.category || "").includes("Franchise Operated") ? "badge-foco" : "badge-coco"}`} style={{ fontSize: 10 }}>
                          {(s.category || "").includes("Franchise Operated") ? "COFO" : "COCO"}
                        </span>
                      </td>
                      <td style={{ fontSize: 12 }}>{s.operation}</td>
                      <td style={{ fontVariantNumeric: "tabular-nums" }}>{s.storeSize?.toLocaleString("en-IN") || "—"}</td>
                      <td style={{ fontSize: 12 }}>{s.startDate}</td>
                      <td>
                        <span className={`badge ${s.status === "Active" ? "badge-active" : "badge-inactive"}`}>
                          <span className="badge-dot" />
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${s.syncStatus === "Synced" ? "badge-active" : "badge-inactive"}`} style={{ fontSize: 10 }}>
                          {s.syncStatus === "Synced" ? "🔗 Synced" : "⏳ Pending"}
                        </span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="row-actions">
                          <button className="btn btn-icon btn-ghost btn-sm" title="View" onClick={() => openStoreModal("view", s.id)}>👁</button>
                          <button className="btn btn-icon btn-ghost btn-sm" title="Edit" onClick={() => openStoreModal("edit", s.id)}>✏️</button>
                          <button className="btn btn-icon btn-ghost btn-sm" title="Delete" onClick={() => handleDelete(s.id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span className="page-info">Rows per page: {PAGE_SIZE} · Page {page} of {totalPages}</span>
              <div className="page-btns">
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} className={`page-btn${n === page ? " active" : ""}`} onClick={() => setPage(n)}>{n}</button>
                ))}
                <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {modal?.mode === "view" && (
          <ViewModal
            store={modal.store}
            onClose={() => setModal(null)}
            onEdit={store => openStoreModal("edit", store.id)}
          />
        )}
        {(modal?.mode === "create" || modal?.mode === "edit") && (
          <StoreModal
            store={modal.mode === "edit" ? modal.store : null}
            mode={modal.mode}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
        {confirm && (
          <ConfirmDialog
            msg={confirm.msg}
            onConfirm={confirm.onConfirm}
            onCancel={() => setConfirm(null)}
          />
        )}

        {/* Detail Loading Overlay */}
        {detailLoading && (
          <div className="overlay" style={{ zIndex: 3000 }}>
            <div style={{ background: '#fff', borderRadius: 8, padding: '24px 36px', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--sap-text)' }}>Loading store details...</div>
            </div>
          </div>
        )}

        {/* Saving Overlay */}
        {saving && (
          <div className="overlay" style={{ zIndex: 3000 }}>
            <div style={{ background: '#fff', borderRadius: 8, padding: '24px 36px', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>💾</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--sap-text)' }}>Saving store...</div>
            </div>
          </div>
        )}

        {/* Toasts */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </>
  );
}
