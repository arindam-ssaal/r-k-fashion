import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { GetAPI } from "../../../../../services/apiCall";
import { useCookies } from "react-cookie";

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  navy: "#0A1628", navyMid: "#142035", navyCard: "rgba(20,32,53,0.95)",
  indigo: "#1E3A6E", indigoB: "#2D5BA3",
  accent: "#00B4D8", gold: "#F4A261", success: "#06D6A0",
  warning: "#FFB703", danger: "#EF233C",
  sky: "#E8F4FD", skyMid: "#B8D9F0",
};

// ─── Utility ──────────────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const fmtNum = (n) => Number(n).toLocaleString("en-IN");
const fmtCompact = (n) => {
  const num = Number(n);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num.toLocaleString("en-IN")}`;
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((type, msg) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, msg }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);
  return { toasts, show };
}

function ToastContainer({ toasts }) {
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  const colors = { success: C.success, error: "#FF8585", info: C.accent };
  return (
    <div style={{ position: "fixed", top: 72, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          background: "linear-gradient(135deg,rgba(20,32,53,0.98),rgba(30,58,110,0.95))",
          border: `1px solid ${colors[t.type]}55`, borderRadius: 10, padding: "12px 16px",
          minWidth: 280, display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)", fontSize: 13, color: colors[t.type],
          animation: "toastIn 0.3s ease",
        }}>
          <span style={{ fontSize: 16 }}>{icons[t.type]}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── NAV DATA ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", icon: "🏠", label: "Dashboard", section: null },
  { id: "TRANSACTIONS", section: true },
  { id: "sale", icon: "🛒", label: "Sale / POS Billing" },
  { id: "purchase", icon: "📥", label: "Purchase Entry" },
  { id: "return", icon: "↩️", label: "Sales Return" },
  { id: "MASTERS", section: true },
  {
    id: "masters", icon: "📚", label: "Masters", chevron: true,
    sub: [
      { id: "items", icon: "📦", label: "Item Master" },
      { id: "customers", icon: "👥", label: "Customer Master" },
      { id: "suppliers", icon: "🏭", label: "Supplier Master" },
      { id: "category", icon: "🏷️", label: "Category Master" },
      { id: "unit", icon: "📏", label: "Unit Master" },
      { id: "stores", icon: "🏪", label: "Store Master" },
    ],
  },
  { id: "REPORTS", section: true },
  {
    id: "reports", icon: "📈", label: "Reports", chevron: true,
    sub: [
      { id: "rpt-sales", icon: "📊", label: "Sales Summary" },
      { id: "rpt-itemwise", icon: "📦", label: "Item-wise Sales" },
      { id: "rpt-categorywise", icon: "🏷️", label: "Category Sales" },
      { id: "rpt-customerwise", icon: "👥", label: "Customer Sales" },
      { id: "rpt-stock", icon: "📋", label: "Stock Report" },
      { id: "rpt-dayend", icon: "📅", label: "Day End Report" },
      { id: "rpt-gst", icon: "🧾", label: "GST Report" },
    ],
  },
  { id: "ADMINISTRATION", section: true },
  {
    id: "setup", icon: "⚙️", label: "Setup", chevron: true,
    sub: [
      { id: "setup-company", icon: "🏢", label: "Company Setup" },
      { id: "setup-tax", icon: "🧾", label: "Tax Setup" },
      { id: "setup-printer", icon: "🖨️", label: "Printer Setup" },
      { id: "setup-sap", icon: "🔗", label: "SAP Integration" },
      { id: "setup-db", icon: "🗄️", label: "Database Setup" },
    ],
  },
  {
    id: "security", icon: "🔐", label: "Security", chevron: true,
    sub: [
      { id: "users", icon: "👤", label: "User Management" },
      { id: "roles", icon: "🛡️", label: "Roles & Permissions" },
      { id: "auditlog", icon: "📋", label: "Audit Log" },
    ],
  },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ collapsed, activePage, onNavigate, onToggle }) {
  const [openMenus, setOpenMenus] = useState({ masters: false, reports: false, setup: false, security: false });

  const toggleMenu = (id) => setOpenMenus((p) => ({ ...p, [id]: !p[id] }));

  const isActive = (item) => {
    if (item.id === activePage) return true;
    if (item.sub) return item.sub.some((s) => s.id === activePage);
    return false;
  };

  return (
    <nav style={{
      width: collapsed ? 64 : 260, height: "100%", display: "flex", flexDirection: "column",
      background: "linear-gradient(180deg,#080E1A 0%,#0F1E38 40%,#0A1628 100%)",
      borderRight: "1px solid rgba(0,180,216,0.12)", flexShrink: 0,
      transition: "width 0.3s ease", overflow: "hidden", position: "relative", zIndex: 100,
    }}>
      {/* Color stripe */}
      <div style={{ position: "absolute", right: 0, top: 0, width: 3, height: "100%", background: "linear-gradient(180deg,#2D5BA3 0%,#00B4D8 40%,#06D6A0 70%,#F4A261 100%)" }} />

      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: collapsed ? 0 : 12, padding: collapsed ? "16px 14px" : "16px 18px", borderBottom: "1px solid rgba(0,180,216,0.1)", minHeight: 60, justifyContent: collapsed ? "center" : "flex-start" }}>
        <div style={{ width: 36, height: 36, flexShrink: 0, background: "linear-gradient(135deg,#1E3A6E,#2D5BA3,#00B4D8)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 16px rgba(0,180,216,0.3)" }}>💎</div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 900, background: "linear-gradient(135deg,#E8F4FD,#00B4D8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap" }}>sapphire POS</div>
            <div style={{ fontSize: 10, color: C.skyMid, opacity: 0.5, fontFamily: "monospace" }}>v3.0 · SAP B1 Integrated</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "10px 0" }}>
        {NAV.map((item) => {
          if (item.section) {
            return collapsed ? null : (
              <div key={item.id} style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: C.skyMid, opacity: 0.4, padding: "12px 20px 6px" }}>{item.id}</div>
            );
          }
          const active = isActive(item);
          const open = openMenus[item.id];
          return (
            <div key={item.id}>
              <div onClick={() => item.chevron ? toggleMenu(item.id) : onNavigate(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: collapsed ? 0 : 12,
                  padding: collapsed ? "12px" : "10px 18px", cursor: "pointer",
                  borderLeft: `3px solid ${active ? C.accent : "transparent"}`,
                  background: active ? "linear-gradient(135deg,rgba(45,91,163,0.3),rgba(0,180,216,0.15))" : "transparent",
                  color: active ? C.accent : C.skyMid, fontSize: 13, fontWeight: active ? 600 : 500,
                  justifyContent: collapsed ? "center" : "flex-start",
                  transition: "all 0.2s",
                }}>
                <span style={{ fontSize: 16, flexShrink: 0, width: 20, textAlign: "center" }}>{item.icon}</span>
                {!collapsed && <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
                {!collapsed && item.chevron && <span style={{ fontSize: 10, opacity: 0.5, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>▶</span>}
              </div>
              {item.sub && !collapsed && (
                <div style={{ overflow: "hidden", maxHeight: open ? 400 : 0, transition: "max-height 0.3s ease" }}>
                  {item.sub.map((s) => (
                    <div key={s.id} onClick={() => onNavigate(s.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 18px 8px 52px", cursor: "pointer",
                        fontSize: 12, color: activePage === s.id ? C.accent : C.skyMid,
                        background: activePage === s.id ? "rgba(0,180,216,0.08)" : "transparent",
                        borderLeft: `3px solid ${activePage === s.id ? C.accent : "transparent"}`,
                        transition: "all 0.2s",
                      }}>
                      {s.icon} {s.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom */}
      <div style={{ padding: 12, borderTop: "1px solid rgba(0,180,216,0.1)", display: "flex", flexDirection: "column", gap: 6 }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(45,91,163,0.15)", borderRadius: 8, border: "1px solid rgba(0,180,216,0.1)", cursor: "pointer" }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#2D5BA3,#00B4D8)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0 }}>A</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.sky, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Administrator</div>
              <div style={{ fontSize: 10, color: C.accent, opacity: 0.8 }}>ADMIN</div>
            </div>
            <span style={{ color: C.skyMid, opacity: 0.5, fontSize: 12 }}>⋮</span>
          </div>
        )}
        <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "9px 16px", borderRadius: 8, border: "1px solid rgba(184,217,240,0.15)", background: "transparent", color: C.skyMid, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          {collapsed ? "→" : "🚪 Logout"}
        </button>
      </div>
    </nav>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ onToggle, activePage, onRefresh, showToast }) {
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const breadcrumb = activePage === "dashboard" ? ["Home", "Dashboard"]
    : activePage === "items" ? ["Masters", "Item Master"]
    : activePage === "customers" ? ["Masters", "Customer Master"]
    : activePage === "users" ? ["Security", "User Management"]
    : activePage === "rpt-sales" ? ["Reports", "Sales Summary"]
    : ["Home", activePage];

  return (
    <header style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "rgba(10,22,40,0.95)", borderBottom: "1px solid rgba(0,180,216,0.1)", backdropFilter: "blur(10px)", flexShrink: 0, gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onToggle} style={{ background: "none", border: "none", color: C.skyMid, cursor: "pointer", fontSize: 18, padding: 6, borderRadius: 6 }}>☰</button>
        <div style={{ fontSize: 13, color: C.skyMid, display: "flex", alignItems: "center", gap: 6 }}>
          {breadcrumb[0]}<span style={{ opacity: 0.3 }}>›</span><span style={{ color: C.accent, fontWeight: 600 }}>{breadcrumb[1]}</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,217,240,0.12)", borderRadius: 20, padding: "7px 16px", width: 300 }}>
          <span style={{ opacity: 0.4 }}>🔍</span>
          <input placeholder="Search items, customers, bills..." style={{ background: "none", border: "none", color: C.sky, fontSize: 13, fontFamily: "inherit", outline: "none", width: "100%" }} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {["🔔", "🔄", "🖨️", "⛶"].map((icon, i) => (
          <button key={i} onClick={icon === "🔄" ? onRefresh : undefined}
            style={{ position: "relative", background: "none", border: "none", color: C.skyMid, cursor: "pointer", padding: 8, borderRadius: 8, fontSize: 18 }}>
            {icon}
            {icon === "🔔" && <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, background: C.danger, borderRadius: "50%", border: `2px solid ${C.navy}` }} />}
          </button>
        ))}
        <div style={{ fontFamily: "monospace", fontSize: 12, color: C.skyMid, opacity: 0.7, whiteSpace: "nowrap" }}>{clock}</div>
      </div>
    </header>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KPI_COLORS = { blue: "#2D5BA3,#00B4D8", green: "#059669,#06D6A0", gold: "#D97706,#F4A261", purple: "#7C3AED,#A78BFA", red: "#C62828,#EF233C", teal: "#0891B2,#06B6D4" };

function KpiCard({ color, icon, value, label, sub, trend, trendDir }) {
  const [c1, c2] = KPI_COLORS[color].split(",");
  return (
    <div style={{ background: "linear-gradient(135deg,rgba(20,32,53,0.95) 0%,rgba(30,58,110,0.6) 100%)", border: "1px solid rgba(184,217,240,0.1)", borderRadius: 14, padding: "22px 24px", position: "relative", overflow: "hidden", transition: "transform 0.3s, box-shadow 0.3s", cursor: "default", animation: "chartFadeIn 0.5s ease both" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${c1}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${c1},${c2})` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <span style={{ fontSize: 32, opacity: 0.9 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 12, background: trendDir === "up" ? "rgba(6,214,160,0.15)" : trendDir === "down" ? "rgba(239,35,60,0.15)" : "rgba(184,217,240,0.1)", color: trendDir === "up" ? C.success : trendDir === "down" ? C.danger : C.skyMid }}>{trend}</span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 900, color: C.sky, fontFamily: "monospace", lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.skyMid, textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.7 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: C.skyMid, opacity: 0.5, marginTop: 8 }}>{sub}</div>}
      <div style={{ position: "absolute", right: -10, bottom: -10, fontSize: 80, opacity: 0.04, pointerEvents: "none" }}>{icon}</div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ open, onClose, title, data, type }) {
  if (!open || !data || !data.length) return null;
  const total = data.reduce((s, d) => s + d.value, 0);
  const colors = ["#00B4D8", "#06D6A0", "#F4A261", "#A78BFA", "#FFB703", "#EF233C", "#06B6D4", "#8B5CF6", "#EC4899", "#14B8A6"];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(10,22,40,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, animation: "fadeIn 0.25s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(135deg,rgba(20,32,53,0.99),rgba(30,58,110,0.95))", border: "1px solid rgba(0,180,216,0.2)", borderRadius: 16, padding: 0, minWidth: 480, maxWidth: 720, maxHeight: "80vh", overflow: "hidden", animation: "modalSlideUp 0.35s ease", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid rgba(184,217,240,0.1)" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.sky }}>{title}</div>
          <button onClick={onClose} style={{ background: "rgba(239,35,60,0.15)", border: "1px solid rgba(239,35,60,0.3)", color: C.danger, width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px", overflowY: "auto", maxHeight: "calc(80vh - 70px)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ background: "rgba(10,22,40,0.6)", color: C.skyMid, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", padding: "12px 16px", textAlign: "left" }}>#</th>
                <th style={{ background: "rgba(10,22,40,0.6)", color: C.skyMid, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", padding: "12px 16px", textAlign: "left" }}>Name</th>
                <th style={{ background: "rgba(10,22,40,0.6)", color: C.skyMid, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", padding: "12px 16px", textAlign: "right" }}>Value</th>
                <th style={{ background: "rgba(10,22,40,0.6)", color: C.skyMid, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", padding: "12px 16px", textAlign: "right" }}>Share</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => {
                const share = total > 0 ? ((d.value / total) * 100).toFixed(1) : 0;
                return (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(184,217,240,0.06)", animation: `fadeSlideIn 0.3s ease ${i * 0.05}s both` }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors[i % colors.length] }} />
                    </td>
                    <td style={{ padding: "12px 16px", color: C.sky, fontSize: 14, fontWeight: 600 }}>{d.label}</td>
                    <td style={{ padding: "12px 16px", color: C.sky, fontSize: 14, fontWeight: 700, fontFamily: "monospace", textAlign: "right" }}>
                      {type === 'currency' ? fmt(d.value) : fmtNum(d.value)}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 60, height: 6, background: "rgba(184,217,240,0.1)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${share}%`, height: "100%", background: colors[i % colors.length], borderRadius: 3, animation: `barGrow 0.6s ease ${i * 0.08}s both` }} />
                        </div>
                        <span style={{ fontSize: 12, fontFamily: "monospace", color: C.skyMid, fontWeight: 600 }}>{share}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 0 4px", borderTop: "1px solid rgba(184,217,240,0.1)", marginTop: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 800, fontFamily: "monospace", color: C.accent }}>Total: {type === 'currency' ? fmt(total) : fmtNum(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chart Canvas (clean animated SVG charts) ────────────────────────────────
function BarChart({ data, height = 240, onBarClick, uid = "" }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 50); return () => clearTimeout(t); }, [data]);
  if (!data || !data.length) return null;
  const max = Math.max(...data.map(d => d.value));
  const barW = 56;
  const gap = 24;
  const totalW = data.length * (barW + gap) + gap;
  const padBottom = 56;
  return (
    <svg viewBox={`0 0 ${totalW} ${height}`} style={{ width: "100%", height }}>
      <defs>
        <linearGradient id={`barG-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D5BA3" />
          <stop offset="100%" stopColor="#00B4D8" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75].map((t, i) => (
        <line key={i} x1={0} y1={(height - padBottom) * t} x2={totalW} y2={(height - padBottom) * t} stroke="rgba(184,217,240,0.06)" strokeWidth={1} />
      ))}
      {data.map((d, i) => {
        const barH = max > 0 ? (d.value / max) * (height - padBottom - 20) : 0;
        const x = i * (barW + gap) + gap;
        const y = height - padBottom - barH;
        return (
          <g key={i} style={{ cursor: onBarClick ? "pointer" : "default" }} onClick={() => onBarClick && onBarClick(d, i)}>
            <rect x={x} y={animated ? y : height - padBottom} width={barW} height={animated ? barH : 0}
              fill={`url(#barG-${uid})`} rx={5} opacity={0.9}
              style={{ transition: `all 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.08}s` }} />
            {animated && barH > 0 && (
              <text x={x + barW / 2} y={y - 8} textAnchor="middle" fill={C.sky} fontSize={11} fontWeight={700} fontFamily="monospace"
                style={{ opacity: animated ? 1 : 0, transition: `opacity 0.3s ease ${0.4 + i * 0.08}s` }}>
                {d.value >= 100000 ? `${(d.value / 1000).toFixed(0)}k` : d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
              </text>
            )}
            <text x={x + barW / 2} y={height - padBottom + 14} textAnchor="end" fill={C.skyMid} fontSize={10} fontWeight={600}
              transform={`rotate(-35, ${x + barW / 2}, ${height - padBottom + 14})`}>
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({ data, height = 300, onPointClick, uid = "" }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 50); return () => clearTimeout(t); }, [data]);
  if (!data || !data.length) return null;
  const vals = data.map(d => d.value);
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  const W = Math.max(560, data.length * 80), H = height - 50, padX = 50, padY = 20;
  const range = max - min || 1;
  const pts = data.map((d, i) => ({
    x: padX + (i / Math.max(data.length - 1, 1)) * (W - padX * 2),
    y: padY + (1 - (d.value - min) / range) * (H - padY),
  }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${path} L${pts[pts.length - 1].x},${H + padY} L${pts[0].x},${H + padY} Z`;
  const pathLen = pts.reduce((acc, p, i) => i === 0 ? 0 : acc + Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y), 0);
  return (
    <svg viewBox={`0 0 ${W} ${height}`} style={{ width: "100%", height }}>
      <defs>
        <linearGradient id={`lineG-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00B4D8" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#00B4D8" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const yPos = padY + t * (H - padY);
        const val = max - t * range;
        return (
          <g key={i}>
            <line x1={padX} y1={yPos} x2={W - padX} y2={yPos} stroke="rgba(184,217,240,0.06)" strokeWidth={1} />
            <text x={padX - 8} y={yPos + 4} textAnchor="end" fill={C.skyMid} fontSize={10} fontFamily="monospace" opacity={0.5}>
              {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0)}
            </text>
          </g>
        );
      })}
      {/* Area fill */}
      <path d={area} fill={`url(#lineG-${uid})`} style={{ opacity: animated ? 1 : 0, transition: "opacity 0.8s ease 0.3s" }} />
      {/* Line */}
      <path d={path} fill="none" stroke="#00B4D8" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"
        strokeDasharray={pathLen} strokeDashoffset={animated ? 0 : pathLen}
        style={{ transition: `stroke-dashoffset 1.2s ease` }} />
      {/* Points */}
      {pts.map((p, i) => (
        <g key={i} style={{ cursor: onPointClick ? "pointer" : "default" }} onClick={() => onPointClick && onPointClick(data[i], i)}>
          <circle cx={p.x} cy={p.y} r={animated ? 5 : 0} fill="#00B4D8" stroke={C.navy} strokeWidth={2.5}
            style={{ transition: `r 0.3s ease ${0.6 + i * 0.1}s` }} />
          {animated && (
            <text x={p.x} y={p.y - 14} textAnchor="middle" fill={C.sky} fontSize={11} fontWeight={700} fontFamily="monospace"
              style={{ opacity: animated ? 1 : 0, transition: `opacity 0.3s ease ${0.8 + i * 0.1}s` }}>
              {data[i].value >= 1000 ? `${(data[i].value / 1000).toFixed(1)}k` : data[i].value}
            </text>
          )}
          <text x={p.x} y={H + padY + 18} textAnchor="middle" fill={C.skyMid} fontSize={11} fontWeight={600}>
            {data[i].label && data[i].label.length > 8 ? data[i].label.slice(0, 7) + '…' : data[i].label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// Generate N visually distinct colors using golden-angle hue spacing
function generateDistinctColors(n) {
  const colors = [];
  const golden = 137.508; // golden angle in degrees
  for (let i = 0; i < n; i++) {
    const hue = (i * golden) % 360;
    const sat = 65 + (i % 3) * 10;   // 65-85%
    const lit = 55 + (i % 4) * 5;    // 55-70%
    colors.push(`hsl(${Math.round(hue)}, ${sat}%, ${lit}%)`);
  }
  return colors;
}
function HorizontalBarChart({ data, height, onBarClick }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 50); return () => clearTimeout(t); }, [data]);
  if (!data || !data.length) return null;
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const max = Math.max(...sorted.map(d => d.value));
  const colors = generateDistinctColors(sorted.length);
  const barH = 32;
  const gap = 10;
  const labelW = 110;
  const padRight = 20;
  const totalH = height || sorted.length * (barH + gap) + 30;
  const chartW = 600;

  // X-axis ticks
  const ticks = 5;
  const niceMax = max > 0 ? Math.ceil(max / Math.pow(10, Math.floor(Math.log10(max)))) * Math.pow(10, Math.floor(Math.log10(max))) : 100;
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => Math.round((niceMax / ticks) * i));
  const barAreaW = chartW - labelW - padRight;

  return (
    <svg viewBox={`0 0 ${chartW} ${totalH}`} style={{ width: "100%", height: totalH }}>
      {/* Grid lines */}
      {tickVals.map((v, i) => {
        const x = labelW + (v / niceMax) * barAreaW;
        return (
          <g key={i}>
            <line x1={x} y1={0} x2={x} y2={totalH - 25} stroke="rgba(184,217,240,0.08)" strokeWidth={1} />
            <text x={x} y={totalH - 8} textAnchor="middle" fill={C.skyMid} fontSize={10} fontFamily="monospace" opacity={0.6}>
              {fmt(v)}
            </text>
          </g>
        );
      })}
      {/* Bars */}
      {sorted.map((d, i) => {
        const y = i * (barH + gap) + 4;
        const w = max > 0 ? (d.value / niceMax) * barAreaW : 0;
        return (
          <g key={i} style={{ cursor: onBarClick ? "pointer" : "default" }} onClick={() => onBarClick && onBarClick(d, i)}>
            <text x={labelW - 8} y={y + barH / 2 + 4} textAnchor="end" fill={C.sky} fontSize={12} fontWeight={600}>
              {d.label && d.label.length > 14 ? d.label.slice(0, 13) + '…' : d.label}
            </text>
            <rect x={labelW} y={y} width={animated ? w : 0} height={barH}
              fill={colors[i]} rx={4} opacity={0.85}
              style={{ transition: `width 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.06}s` }} />
            {animated && w > 40 && (
              <text x={labelW + w - 8} y={y + barH / 2 + 4} textAnchor="end" fill="#fff" fontSize={11} fontWeight={700} fontFamily="monospace"
                style={{ opacity: animated ? 1 : 0, transition: `opacity 0.3s ease ${0.5 + i * 0.06}s` }}>
                {fmt(d.value)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ data, size = 200, onSliceClick }) {
  const [animated, setAnimated] = useState(false);
  const [hovered, setHovered] = useState(-1);
  const [hidden, setHidden] = useState(new Set());
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 50); return () => clearTimeout(t); }, [data]);
  useEffect(() => { setHidden(new Set()); }, [data]);
  const colors = useMemo(() => generateDistinctColors(data.length), [data.length]);
  const allSlices = data.map((d, i) => ({ ...d, color: colors[i], idx: i }));
  const visibleData = allSlices.filter((_, i) => !hidden.has(i));
  const visibleTotal = visibleData.reduce((s, d) => s + d.value, 0);
  const total = data.reduce((s, d) => s + d.value, 0);
  let angle = -90;
  const slices = visibleData.map((d) => {
    const sweep = visibleTotal > 0 ? (d.value / visibleTotal) * 360 : 0;
    const start = angle;
    angle += sweep;
    return { ...d, start, sweep };
  });
  const toggleHidden = (i) => setHidden(prev => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next; });

  const toRad = (deg) => (deg * Math.PI) / 180;
  const cx = size / 2, cy = size / 2, R = size / 2 - 12, r = R * 0.58;
  const mid = (R + r) / 2;
  const circumference = 2 * Math.PI * mid;

  return (
    <div>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size, display: "block", margin: "0 auto" }}>
        {slices.map((s, vi) => {
          const dashLen = (s.sweep / 360) * circumference;
          const effectiveDash = Math.max(dashLen - 1, 0);
          const effectiveGap = circumference - effectiveDash;
          const offset = -((s.start + 90) / 360) * circumference;
          const isHov = hovered === s.idx;
          return (
            <circle key={s.idx} cx={cx} cy={cy} r={mid} fill="none" stroke={s.color} strokeWidth={isHov ? R - r + 6 : R - r}
              strokeDasharray={`${animated ? effectiveDash : 0} ${animated ? effectiveGap : circumference}`}
              strokeDashoffset={offset} strokeLinecap="butt" opacity={hovered >= 0 && !isHov ? 0.4 : 0.9}
              style={{ cursor: onSliceClick ? "pointer" : "default", transition: `stroke-dasharray 0.8s cubic-bezier(0.34,1.56,0.64,1) ${vi * 0.1}s, stroke-width 0.2s, opacity 0.2s`, transform: "rotate(0deg)", transformOrigin: "center" }}
              onMouseEnter={() => setHovered(s.idx)} onMouseLeave={() => setHovered(-1)}
              onClick={() => onSliceClick && onSliceClick(s, s.idx)} />
          );
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" fill={C.sky} fontSize={20} fontWeight={900} fontFamily="monospace"
          style={{ opacity: animated ? 1 : 0, transition: "opacity 0.4s ease 0.5s" }}>
          {hovered >= 0 && !hidden.has(hovered) ? fmtNum(allSlices[hovered].value) : fmtNum(visibleTotal)}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill={C.skyMid} fontSize={11} fontWeight={600}
          style={{ opacity: animated ? 1 : 0, transition: "opacity 0.4s ease 0.6s" }}>
          {hovered >= 0 && !hidden.has(hovered) ? allSlices[hovered].label : "TOTAL"}
        </text>
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", justifyContent: "center", marginTop: 12 }}>
        {allSlices.map((s, i) => {
          const isHidden = hidden.has(i);
          return (
          <div key={i} onMouseEnter={() => !isHidden && setHovered(i)} onMouseLeave={() => setHovered(-1)}
            onClick={(e) => { e.stopPropagation(); toggleHidden(i); }}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: isHidden ? C.skyMid + "66" : hovered === i ? C.sky : C.skyMid, cursor: "pointer", transition: "color 0.2s", fontWeight: hovered === i ? 700 : 500, textDecoration: isHidden ? "line-through" : "none" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: isHidden ? s.color + "44" : s.color, transition: "transform 0.2s", transform: hovered === i ? "scale(1.3)" : "scale(1)" }} />
            {s.label} {total > 0 ? `(${((s.value / total) * 100).toFixed(0)}%)` : ''}
          </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Chart Card wrapper ───────────────────────────────────────────────────────
function ChartCard({ title, sub, children, style, onClick }) {
  return (
    <div onClick={onClick} style={{ background: "linear-gradient(135deg,rgba(20,32,53,0.95),rgba(30,58,110,0.5))", border: "1px solid rgba(184,217,240,0.1)", borderRadius: 14, padding: 22, cursor: onClick ? "pointer" : "default", transition: "all 0.3s ease", animation: "chartFadeIn 0.5s ease both", ...style }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.borderColor = "rgba(0,180,216,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(184,217,240,0.1)"; e.currentTarget.style.transform = "none"; }}>
      {title && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.sky, letterSpacing: "0.3px" }}>{title}</div>
            {sub && <div style={{ fontSize: 12, color: C.skyMid, opacity: 0.6, marginTop: 3 }}>{sub}</div>}
          </div>
          {onClick && <span style={{ fontSize: 12, color: C.accent, opacity: 0.6, fontWeight: 600 }}>Click for details →</span>}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Demo Data ────────────────────────────────────────────────────────────────
const DEMO_KPIS = { todaySales: 84250, todayBills: 127, avgBill: 663, monthlySales: 2184500, customers: 3412, items: 892 };
const DEMO_TREND = [
  { label: "Mon", value: 52000 }, { label: "Tue", value: 68000 }, { label: "Wed", value: 45000 },
  { label: "Thu", value: 79000 }, { label: "Fri", value: 95000 }, { label: "Sat", value: 120000 }, { label: "Sun", value: 84250 },
];
const DEMO_PAYMENT = [
  { label: "Cash", value: 42 }, { label: "UPI", value: 31 }, { label: "Card", value: 18 }, { label: "Credit", value: 9 },
];
const DEMO_CATEGORY = [
  { label: "Grocery", value: 38 }, { label: "Dairy", value: 22 }, { label: "Beverages", value: 18 },
  { label: "Snacks", value: 14 }, { label: "Others", value: 8 },
];
const DEMO_TOP_ITEMS = [
  { name: "Amul Full Cream Milk 1L", qty: 412, revenue: 24720, share: 82 },
  { name: "Fortune Refined Oil 1L", qty: 234, revenue: 21060, share: 70 },
  { name: "Parle-G Biscuits 800g", qty: 567, revenue: 17010, share: 57 },
  { name: "Tata Salt 1kg", qty: 380, revenue: 11400, share: 38 },
  { name: "Maggi Noodles 4-Pack", qty: 198, revenue: 9900, share: 33 },
];
const DEMO_ITEMS = [
  { code: "ITM001", name: "Amul Full Cream Milk 1L", category: "Dairy", mrp: 66, rate: 62, stock: 450, gst: 5, active: true },
  { code: "ITM002", name: "Fortune Refined Oil 1L", category: "Grocery", mrp: 95, rate: 90, stock: 120, gst: 5, active: true },
  { code: "ITM003", name: "Parle-G Biscuits 800g", category: "Snacks", mrp: 32, rate: 30, stock: 800, gst: 12, active: true },
  { code: "ITM004", name: "Tata Salt 1kg", category: "Grocery", mrp: 32, rate: 30, stock: 200, gst: 0, active: true },
  { code: "ITM005", name: "Maggi Noodles 4-Pack", category: "Snacks", mrp: 56, rate: 50, stock: 180, gst: 12, active: false },
  { code: "ITM006", name: "Colgate MaxFresh 150g", category: "Personal Care", mrp: 78, rate: 70, stock: 95, gst: 18, active: true },
];
const DEMO_CUSTOMERS = [
  { id: "C001", name: "Rahul Sharma", phone: "9876543210", email: "rahul@email.com", points: 450, active: true },
  { id: "C002", name: "Priya Mehta", phone: "9876543211", email: "priya@email.com", points: 1200, active: true },
  { id: "C003", name: "Amit Patel", phone: "9876543212", email: "amit@email.com", points: 80, active: true },
  { id: "C004", name: "Sneha Joshi", phone: "9876543213", email: "sneha@email.com", points: 320, active: false },
];
const DEMO_USERS = [
  { id: "USR001", username: "admin", name: "System Administrator", type: "ADMIN", store: "ALL", email: "admin@pos.com", active: true },
  { id: "USR002", username: "cashier1", name: "Ravi Kumar", type: "CASHIER", store: "ST001", email: "ravi@pos.com", active: true },
  { id: "USR003", username: "manager1", name: "Sneha Joshi", type: "MANAGER", store: "ST001", email: "sneha@pos.com", active: true },
];
const DEMO_REPORT = [
  { date: "2025-01-01", store: "ST001", bills: 45, gross: 42500, discount: 2000, tax: 1800, net: 42300 },
  { date: "2025-01-02", store: "ST001", bills: 58, gross: 68000, discount: 3200, tax: 2800, net: 67600 },
  { date: "2025-01-03", store: "ST002", bills: 32, gross: 31000, discount: 1500, tax: 1200, net: 30700 },
];


// ─── Shared Table Card ────────────────────────────────────────────────────────
function TableCard({ title, children, actions }) {
  return (
    <div style={{ background: "linear-gradient(135deg,rgba(20,32,53,0.95),rgba(30,58,110,0.5))", border: "1px solid rgba(184,217,240,0.1)", borderRadius: 14, overflow: "hidden", animation: "chartFadeIn 0.5s ease both" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid rgba(184,217,240,0.1)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: C.sky, letterSpacing: "0.3px" }}>{title}</h3>
        {actions}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          {children}
        </table>
      </div>
    </div>
  );
}
const Th = ({ children }) => <th style={{ background: "rgba(10,22,40,0.6)", color: C.skyMid, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", padding: "12px 18px", textAlign: "left", whiteSpace: "nowrap" }}>{children}</th>;
const Td = ({ children, mono, bold, muted, style: s }) => (
  <td style={{ padding: "12px 18px", color: bold ? C.sky : muted ? `${C.skyMid}99` : C.sky, fontFamily: mono ? "monospace" : "inherit", fontWeight: bold ? 700 : 400, fontSize: muted ? 12 : 14, ...s }}>{children}</td>
);
const Badge = ({ color, children }) => {
  const map = {
    active: { bg: "rgba(6,214,160,0.12)", color: C.success, border: "rgba(6,214,160,0.25)" },
    inactive: { bg: "rgba(239,35,60,0.12)", color: C.danger, border: "rgba(239,35,60,0.25)" },
    info: { bg: "rgba(0,180,216,0.12)", color: C.accent, border: "rgba(0,180,216,0.25)" },
    warning: { bg: "rgba(255,183,3,0.12)", color: C.warning, border: "rgba(255,183,3,0.25)" },
  };
  const s = map[color] || map.info;
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{children}</span>;
};

// ─── Buttons ──────────────────────────────────────────────────────────────────
function Btn({ variant = "ghost", onClick, children, style: s }) {
  const variants = {
    primary: { background: "linear-gradient(135deg,#2D5BA3,#00B4D8)", color: "white", border: "none", boxShadow: "0 4px 15px rgba(0,180,216,0.25)" },
    success: { background: "linear-gradient(135deg,#059669,#06D6A0)", color: "white", border: "none" },
    danger: { background: "linear-gradient(135deg,#C62828,#EF233C)", color: "white", border: "none" },
    secondary: { background: "rgba(45,91,163,0.2)", color: C.sky, border: "1px solid rgba(45,91,163,0.4)" },
    ghost: { background: "transparent", color: C.skyMid, border: "1px solid rgba(184,217,240,0.15)" },
  };
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.3px", whiteSpace: "nowrap", ...variants[variant], ...s }}>
      {children}
    </button>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────
function Toolbar({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "linear-gradient(135deg,rgba(20,32,53,0.9),rgba(30,58,110,0.5))", border: "1px solid rgba(184,217,240,0.1)", borderRadius: 12, marginBottom: 16, flexWrap: "wrap" }}>
      {children}
    </div>
  );
}
function SearchBox({ placeholder, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,217,240,0.12)", borderRadius: 8, padding: "7px 12px" }}>
      <span>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ background: "none", border: "none", color: C.sky, fontSize: 13, fontFamily: "inherit", outline: "none", width: 180 }} />
    </div>
  );
}

// ─── Page Header ─────────────────────────────────────────────────────────────
function PageHeader({ icon, title, desc, actions }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12, animation: "chartFadeIn 0.4s ease both" }}>
      <div>
        <div style={{ fontSize: 26, fontWeight: 900, color: C.sky, display: "flex", alignItems: "center", gap: 12, letterSpacing: "0.3px" }}>
          <span style={{ fontSize: 28 }}>{icon}</span>{title}
        </div>
        <div style={{ fontSize: 13, color: C.skyMid, opacity: 0.6, marginTop: 4 }}>{desc}</div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{actions}</div>
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────
function DashboardPage({ showToast }) {
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const [selectedStore, setSelectedStore] = useState("0");
  const [lastUpdated, setLastUpdated] = useState("just now");
  const [storemasterData, setStoremasterData] = useState([]);
  const [storesLoading, setStoresLoading] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState('');
  const [visibleMonths, setVisibleMonths] = useState([]);
  const [type, setType] = useState(0);
  const [today, setToday] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(['UserId', 'DefaultStoreId']);

  useEffect(() => {
    setSelectedStore("ALL");
  }, [cookies.DefaultStoreId]);

  // API Response State
  const [totalSales, setTotalSales] = useState({});
  const [divisionWiseSales, setDivisionWiseSales] = useState([]);
  const [itemGroupWiseSales, setItemGroupWiseSales] = useState([]);
  const [categoryWiseStock, setCategoryWiseStock] = useState([]);
  const [itemGroupWiseStock, setItemGroupWiseStock] = useState([]);
  const [basketAnalysisValue, setBasketAnalysisValue] = useState([]);
  const [basketAnalysisQuantity, setBasketAnalysisQuantity] = useState([]);
  const [sqftSale, setSqftSale] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [categoryWiseSales, setCategoryWiseSales] = useState([]);
  const [footfallAnalysis, setFootfallAnalysis] = useState([]);
  const [apiData, setApiData] = useState(null);

  const fetchStoreMaster = async () => {
    try {
      setStoresLoading(true);
      let PJsonData = {};
      let PType = '';
      let responseJson = await GetAPI('/api/StoreMaster/GetAllStoreMaster', PType, PJsonData, '');
      setStoremasterData(responseJson.data || []);
      setStoresLoading(false);
    } catch (error) {
      console.error('fetchStoreMaster error=>', error);
      setStoresLoading(false);
    }
  };

  const fetchServerDate = async () => {
    try {
      setLoading(true);
      let PJsonData = {};
      let PType = '';
      let responseJson = await GetAPI('/api/Bill/GetServerDate', PType, PJsonData, cookies);
      const serverDate = responseJson.data || '';
      let formattedDate = '';
      if (serverDate) {
        const parts = serverDate.split('-');
        if (parts.length === 3) {
          formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else {
          formattedDate = serverDate;
        }
      }
      setToday(serverDate);
      setCurrentDate(formattedDate);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreMaster();
    fetchServerDate();
  }, []);

  useEffect(() => {
    if (today) {
      const parts = today.split('-');
      if (parts.length === 3) {
        const monthIndex = parseInt(parts[1], 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          const currentMonth = MONTHS[monthIndex];
          const prevMonth1 = MONTHS[(monthIndex - 1 + 12) % 12];
          const prevMonth2 = MONTHS[(monthIndex - 2 + 12) % 12];
          setVisibleMonths([prevMonth2, prevMonth1, currentMonth]);
          setSelectedMonth(currentMonth);
          setType(0);
        }
      }
    }
  }, [today]);

  const handleSelectMonth = (month) => {
    setSelectedMonth(month);
    setLoading(true);
    const monthIndex = visibleMonths.indexOf(month);
    if (monthIndex === 2) setType(0);
    else if (monthIndex === 1) setType(1);
    else if (monthIndex === 0) setType(2);
  };

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setLoading(true);
        const formatDateForAPI = (dateStr) => {
          if (!dateStr) return '';
          return new Date(dateStr).toLocaleDateString('en-GB').replace(/\//g, '-');
        };
        const AsOnDate = formatDateForAPI(currentDate);
        const storeID = selectedStore === "ALL" ? 0 : selectedStore || "2";
        // const storeID = selectedStore === "ALL" ? 0 : 0; // API expects 0 for ALL stores
        if (!AsOnDate) return;

        let PType = `?AsOnDate=${AsOnDate}&Type=${type}&StoreID=${storeID}`;
        let PJsonData = {};
        const response = await GetAPI(`/api/dashboard/GetDashBoard`, PType, PJsonData, cookies);
        setTotalSales(response.data.Table[0] || {});
        setDivisionWiseSales(response.data.Table1 || []);
        setItemGroupWiseSales(response.data.Table2 || []);
        setCategoryWiseStock(response.data.Table3 || []);
        setItemGroupWiseStock(response.data.Table4 || []);
        setBasketAnalysisValue(response.data.Table5 || []);
        setBasketAnalysisQuantity(response.data.Table6 || []);
        setSqftSale(response.data.Table7 || []);
        setDailySales(response.data.Table8 || []);
        setCategoryWiseSales(response.data.Table9 || []);
        setFootfallAnalysis(response.data.Table10 || []);
        setApiData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApiData();
  }, [currentDate, selectedStore, type, cookies, cookies.DefaultStoreId]);

  const refresh = () => {
    // setLoading(true);
    // setType((prev) => prev); // trigger re-fetch
    // fetchServerDate();
    // setLastUpdated(new Date().toLocaleTimeString());
    // Simplest way to reload the current page
    window.location.reload();
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("info", "Refreshing dashboard data...");

  };

  // Detail modal state
  const [detailModal, setDetailModal] = useState({ open: false, title: "", data: [], type: "currency" });
  const openDetail = (title, data, type = "currency") => setDetailModal({ open: true, title, data, type });
  const closeDetail = () => setDetailModal({ open: false, title: "", data: [], type: "currency" });

  // Ratio-based color for monthly sales KPI
  const ratioColor = totalSales?.Ratio >= 95 ? "green" : totalSales?.Ratio >= 90 ? "gold" : "red";
  const ratioTrend = totalSales?.Ratio >= 95 ? "↑ On Target" : totalSales?.Ratio >= 90 ? "— Near Target" : "↓ Below Target";
  const ratioDir = totalSales?.Ratio >= 95 ? "up" : totalSales?.Ratio >= 90 ? "neutral" : "down";

  // Transform API data for existing chart components
  const divisionDonutData = divisionWiseSales.map(item => ({ label: item.Catagory || 'Unknown', value: item.NetAmt || 0 }));
  const itemGroupDonutData = itemGroupWiseSales.map(item => ({ label: item.Catagory || 'Unknown', value: item.NetAmt || 0 }));
  // Prepare donut data: aggregate by label, filter zeros, sort desc, limit slices
  const prepareDonutData = (items, labelKey, valueKey, maxSlices = 12) => {
    const map = {};
    items.forEach(item => {
      const label = item[labelKey] || 'Unknown';
      const val = Number(item[valueKey]) || 0;
      if (val > 0) map[label] = (map[label] || 0) + val;
    });
    const sorted = Object.entries(map)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
    if (sorted.length <= maxSlices) return sorted;
    const top = sorted.slice(0, maxSlices - 1);
    const othersVal = sorted.slice(maxSlices - 1).reduce((s, d) => s + d.value, 0);
    if (othersVal > 0) top.push({ label: 'Others', value: othersVal });
    return top;
  };
  const catStockDonutData = prepareDonutData(categoryWiseStock, 'Catagory', 'Stock');
  const itemGroupStockDonutData = prepareDonutData(itemGroupWiseStock, 'Catagory', 'Stock');
  const sqftBarData = sqftSale.map(item => ({ label: item.Date || '', value: item.SquareFeetSale || 0 }));
  const basketValBarData = basketAnalysisValue.map(item => ({ label: item.Date || '', value: item.BasketValue || 0 }));
  const basketQtyBarData = basketAnalysisQuantity.map(item => ({ label: item.Date || '', value: item.BasketValue || 0 }));
  const dailySalesDateOnly = dailySales.filter(item => item.Date !== 'MTD' && item.Date !== 'YTD');
  const dailySalesBarData = dailySalesDateOnly.map(item => ({ label: item.Date || '', value: item.NetAmt || 0 }));
  const footfallLineData = footfallAnalysis.map(item => ({ label: item.Date || '', value: item.Total || 0 }));

  // Category-wise Sales table data
  const uniqueCategories = [...new Set(categoryWiseSales.map(item => item.Catagory))].filter(cat => cat !== "");
  const uniqueDates = [...new Set(categoryWiseSales.map(item => item.Date))];
  const sortedDates = uniqueDates.sort((a, b) => {
    if (a === 'YTD') return -1;
    if (b === 'YTD') return 1;
    if (a === 'MTD') return -1;
    if (b === 'MTD') return 1;
    return 0;
  });
  const columnDates = sortedDates.filter(date => date !== 'YTD');
  const getSalesByCategoryDate = (category, date) => {
    const item = categoryWiseSales.find(i => i.Catagory === category && i.Date === date);
    return item ? item.NetAmt : 0;
  };

  // Category-wise Sales chart data (YTD)
  const catSalesYTD = categoryWiseSales.filter(i => i.Date === 'YTD' && i.Catagory !== "");
  const catSalesYTDDonut = catSalesYTD.map(i => ({ label: i.Catagory, value: i.NetAmt || 0 }));
  const catSalesMTD = categoryWiseSales.filter(i => i.Date === 'MTD' && i.Catagory !== "");
  const catSalesMTDBar = catSalesMTD.map(i => ({ label: i.Catagory, value: i.NetAmt || 0 }));

  const selectStyle = { padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s" };

  return (
    <div>
      {/* Loading Overlay */}
      {loading && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,22,40,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "linear-gradient(135deg,rgba(20,32,53,0.98),rgba(30,58,110,0.95))", border: "1px solid rgba(0,180,216,0.2)", borderRadius: 16, padding: "32px 48px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, border: `4px solid rgba(0,180,216,0.2)`, borderTop: `4px solid ${C.accent}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <span style={{ color: C.sky, fontSize: 14, fontWeight: 600 }}>Loading data...</span>
          </div>
        </div>
      )}

      <PageHeader icon="🏠" title="Sales Dashboard" desc={`Real-time sales & performance overview • Last updated: ${lastUpdated}`}
        actions={[
          <Btn key="r" variant="secondary" onClick={refresh}>🔄 Refresh</Btn>,
        ]}
      />

      {/* Month Selector + Store Filter */}
      <div style={{ background: "linear-gradient(135deg,rgba(20,32,53,0.9),rgba(30,58,110,0.6))", border: "1px solid rgba(0,180,216,0.15)", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: C.skyMid, whiteSpace: "nowrap" }}>📅 Month:</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {visibleMonths.map((month) => {
            const sel = selectedMonth === month;
            return (
              <div key={month} onClick={() => handleSelectMonth(month)}
                style={{ ...selectStyle, border: `1px solid ${sel ? C.accent : "rgba(184,217,240,0.2)"}`, background: sel ? "linear-gradient(135deg,rgba(45,91,163,0.4),rgba(0,180,216,0.3))" : "rgba(255,255,255,0.05)", color: sel ? C.accent : C.skyMid }}>
                {month}
              </div>
            );
          })}
        </div>

        <div style={{ width: 1, height: 28, background: "rgba(184,217,240,0.15)", margin: "0 8px" }} />

        <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: C.skyMid, whiteSpace: "nowrap" }}>🏪 Store:</label>
        <div style={{ flex: 1, minWidth: 200, maxWidth: 350 }}>
          {storesLoading ? (
            <span style={{ fontSize: 12, color: C.skyMid, opacity: 0.6 }}>Loading stores...</span>
          ) : (
            <select
              value={selectedStore}
              onChange={(e) => {
                setLoading(true);
                setSelectedStore(e.target.value);
              }}
              style={{
                width: "100%",
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: C.accent,
                background: "linear-gradient(135deg,rgba(45,91,163,0.4),rgba(0,180,216,0.3))",
                border: `1px solid ${C.accent}`,
                outline: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <option value="ALL" style={{ background: C.navyMid, color: C.skyMid }}>
                🌐 All Stores
              </option>
              {storemasterData?.map((store) => (
                <option 
                  key={store.storeID} 
                  value={String(store.storeID)}
                  style={{ background: C.navyMid, color: C.skyMid }}
                >
                  {store.storeCode} – {store.storeName}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 18, marginBottom: 24 }}>
        {/* <KpiCard color="green" icon="💰" value="₹1,24,580" label="Today's Sales" sub="Demo data" trend="↑ 12.5%" trendDir="up" /> */}
        {/* <KpiCard color="gold" icon="📋" value="347" label="Today's Bills" sub="Demo data" trend="↑ 8%" trendDir="up" /> */}
        {/* <KpiCard color="teal" icon="📊" value="₹359" label="Avg Bill Value" sub="Per transaction average" trend="—" trendDir="neutral" /> */}
        <KpiCard color={ratioColor} icon="📅" value={fmtCompact(totalSales?.NetAmt || 0)} label="Monthly Sales" sub={`${selectedMonth} • Ratio: ${totalSales?.Ratio || 0}%`} trend={ratioTrend} trendDir={ratioDir} />
        {/* <KpiCard color="purple" icon="👥" value="2,847" label="Active Customers" sub="Registered customers" trend="↑ 3.2%" trendDir="up" /> */}
        {/* <KpiCard color="red" icon="📦" value="1,234" label="Active Items" sub="Total SKUs in inventory" trend="—" trendDir="neutral" /> */}
        <KpiCard color="blue" icon="📆" value={fmtCompact(totalSales?.Last12Month || 0)} label="Yearly Sales" sub="Last 12 months total" trend="—" trendDir="neutral" />
      </div>

      {/* Horizontal Bar Charts Row 1: Division & Item Group Sales */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>
        <ChartCard title="🏷️ Division Wise Sales" sub="For the selected month" onClick={() => divisionDonutData.length > 0 && openDetail("Division Wise Sales", divisionDonutData, "currency")}>
          {divisionDonutData.length > 0 ? <HorizontalBarChart data={divisionDonutData} onBarClick={(s) => openDetail("Division Wise Sales", divisionDonutData, "currency")} /> : <EmptyState />}
        </ChartCard>
        <ChartCard title="📦 Item Group Sales" sub="For the selected month" onClick={() => itemGroupDonutData.length > 0 && openDetail("Item Group Wise Sales", itemGroupDonutData, "currency")}>
          {itemGroupDonutData.length > 0 ? <HorizontalBarChart data={itemGroupDonutData} onBarClick={(s) => openDetail("Item Group Wise Sales", itemGroupDonutData, "currency")} /> : <EmptyState />}
        </ChartCard>
      </div>

      {/* //!Pie Charts Row 2: Stock */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>
        <ChartCard title="📊 Category Wise Stock" sub="Current stock distribution" onClick={() => catStockDonutData.length > 0 && openDetail("Category Wise Stock", catStockDonutData, "number")}>
          {catStockDonutData.length > 0 ? <DonutChart data={catStockDonutData} size={300} onSliceClick={(s) => openDetail("Category Wise Stock", catStockDonutData, "number")} /> : <EmptyState />}
        </ChartCard>
        <ChartCard title="📦 Item Group Wise Stock" sub="Current stock distribution" onClick={() => itemGroupStockDonutData.length > 0 && openDetail("Item Group Wise Stock", itemGroupStockDonutData, "number")}>
          {itemGroupStockDonutData.length > 0 ? <DonutChart data={itemGroupStockDonutData} size={300} onSliceClick={(s) => openDetail("Item Group Wise Stock", itemGroupStockDonutData, "number")} /> : <EmptyState />}
        </ChartCard>
      </div>

      {/* //!Avg Per SQFT Sale */}
      <div style={{ marginBottom: 20 }}>
        <TableCard title="📐 Average Per SQFT Sale – Last 7 Days">
          <thead>
            <tr>{sqftSale.map((d) => <Th key={d.Date}>{d.Date}</Th>)}</tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(184,217,240,0.06)" }}>
              {sqftSale.map((d, i) => <Td key={i} mono>{d.SquareFeetSale || 0}</Td>)}
            </tr>
          </tbody>
        </TableCard>
        <ChartCard title="" style={{ marginTop: 12 }} onClick={() => sqftBarData.length > 0 && openDetail("Avg Per SQFT Sale", sqftBarData, "number")}>
          {sqftBarData.length > 0 ? <BarChart data={sqftBarData} height={200} uid="sqft" /> : <EmptyState />}
        </ChartCard>
      </div>

      {/* //!Basket Analysis Value */}
      <div style={{ marginBottom: 20 }}>
        <TableCard title="🧺 Average Basket Analysis Value – Last 7 Days">
          <thead>
            <tr>{basketAnalysisValue.map((d) => <Th key={d.Date}>{d.Date}</Th>)}</tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(184,217,240,0.06)" }}>
              {basketAnalysisValue.map((d, i) => <Td key={i} mono>{d.BasketValue || 0}</Td>)}
            </tr>
          </tbody>
        </TableCard>
        <ChartCard title="" style={{ marginTop: 12 }} onClick={() => basketValBarData.length > 0 && openDetail("Basket Analysis Value", basketValBarData, "currency")}>
          {basketValBarData.length > 0 ? <BarChart data={basketValBarData} height={200} uid="bav" /> : <EmptyState />}
        </ChartCard>
      </div>

      {/* //!Basket Analysis Quantity */}
      <div style={{ marginBottom: 20 }}>
        <TableCard title="🧺 Average Basket Analysis Quantity – Last 7 Days">
          <thead>
            <tr>{basketAnalysisQuantity.map((d) => <Th key={d.Date}>{d.Date}</Th>)}</tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(184,217,240,0.06)" }}>
              {basketAnalysisQuantity.map((d, i) => <Td key={i} mono>{d.BasketValue || 0}</Td>)}
            </tr>
          </tbody>
        </TableCard>
        <ChartCard title="" style={{ marginTop: 12 }} onClick={() => basketQtyBarData.length > 0 && openDetail("Basket Analysis Quantity", basketQtyBarData, "number")}>
          {basketQtyBarData.length > 0 ? <BarChart data={basketQtyBarData} height={200} uid="baq" /> : <EmptyState />}
        </ChartCard>
      </div>

      {/* //!Daily Sales */}
      <div style={{ marginBottom: 20 }}>
        <TableCard title="📈 Daily Sales – Last 7 Days">
          <thead>
            <tr>
              {dailySales.map((d) => (
                <Th key={d.Date}>{d.Date === 'MTD' ? 'Month To Date' : d.Date === 'YTD' ? 'Year To Date' : d.Date}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(184,217,240,0.06)" }}>
              {dailySales.map((d, i) => <Td key={i} mono>{fmt(d.NetAmt || 0)}</Td>)}
            </tr>
          </tbody>
        </TableCard>
        <ChartCard title="" style={{ marginTop: 12 }} onClick={() => dailySalesBarData.length > 0 && openDetail("Daily Sales", dailySalesBarData, "currency")}>
          {dailySalesBarData.length > 0 ? <BarChart data={dailySalesBarData} height={200} uid="daily" /> : <EmptyState />}
        </ChartCard>
      </div>

      {/* //!Category-wise Sales Table */}
      <div style={{ marginBottom: 20 }}>
        <TableCard title="🏷️ Item Category Wise Sales">
          <thead>
            <tr>
              <Th>Category</Th>
              <Th>Year To Date</Th>
              {columnDates.map((date) => (
                <Th key={date}>{date === 'MTD' ? 'Month To Date' : date}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {uniqueCategories.map((category) => {
              const ytdSales = getSalesByCategoryDate(category, 'YTD');
              return (
                <tr key={category} style={{ borderBottom: "1px solid rgba(184,217,240,0.06)" }}>
                  <Td bold>{category}</Td>
                  <Td mono>{fmt(ytdSales)}</Td>
                  {columnDates.map((date) => (
                    <Td key={date} mono>{fmt(getSalesByCategoryDate(category, date))}</Td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </TableCard>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 14 }}>
          <ChartCard title="🏷️ Category Sales – Year To Date" sub="YTD breakdown" onClick={() => catSalesYTDDonut.length > 0 && openDetail("Category Sales – YTD", catSalesYTDDonut, "currency")}>
            {catSalesYTDDonut.length > 0 ? <DonutChart data={catSalesYTDDonut} size={300} onSliceClick={() => openDetail("Category Sales – YTD", catSalesYTDDonut, "currency")} /> : <EmptyState />}
          </ChartCard>
          <ChartCard title="🏷️ Category Sales – Month To Date" sub="MTD breakdown" onClick={() => catSalesMTDBar.length > 0 && openDetail("Category Sales – MTD", catSalesMTDBar, "currency")}>
            {catSalesMTDBar.length > 0 ? <BarChart data={catSalesMTDBar} uid="catmtd" /> : <EmptyState />}
          </ChartCard>
        </div>
      </div>

      {/* //!Footfall Analysis */}
      <div style={{ marginBottom: 20 }}>
        <TableCard title="👣 Footfall Analysis">
          <thead>
            <tr>
              {footfallAnalysis.map((d) => (
                <Th key={d.Date}>{d.Date === 'MTD' ? 'Month To Date' : d.Date === 'YTD' ? 'Year To Date' : d.Date}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(184,217,240,0.06)" }}>
              {footfallAnalysis.map((d, i) => <Td key={i} mono>{fmtNum(d.Total || 0)}</Td>)}
            </tr>
          </tbody>
        </TableCard>
        <ChartCard title="" style={{ marginTop: 12 }} onClick={() => footfallLineData.length > 0 && openDetail("Footfall Analysis", footfallLineData, "number")}>
          {footfallLineData.length > 0 ? <LineChart data={footfallLineData} uid="footfall" /> : <EmptyState />}
        </ChartCard>
      </div>

      <DetailModal open={detailModal.open} onClose={closeDetail} title={detailModal.title} data={detailModal.data} type={detailModal.type} />
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 120, opacity: 0.4, color: C.skyMid, fontSize: 13 }}>
      No data available
    </div>
  );
}

function ItemMasterPage({ showToast }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("");
  const categories = [...new Set(DEMO_ITEMS.map(i => i.category))];
  const filtered = DEMO_ITEMS.filter(i =>
    (!search || i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase())) &&
    (!cat || i.category === cat)
  );
  return (
    <div>
      <PageHeader icon="📦" title="Item Master" desc="Manage products, pricing and inventory items"
        actions={[
          <Btn key="r" variant="secondary" onClick={() => showToast("info", "Refreshed")}>🔄 Refresh</Btn>,
          <Btn key="n" variant="success" onClick={() => showToast("info", "New item form – coming soon")}>➕ New Item</Btn>,
        ]}
      />
      <Toolbar>
        <SearchBox placeholder="Search items... (Ctrl+F)" value={search} onChange={setSearch} />
        <select value={cat} onChange={e => setCat(e.target.value)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,217,240,0.15)", color: C.sky, padding: "8px 12px", borderRadius: 8, fontSize: 12, fontFamily: "inherit", outline: "none" }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{ width: 1, height: 28, background: "rgba(184,217,240,0.1)" }} />
        <Btn onClick={() => showToast("info", "Exporting...")}>📊 Export</Btn>
        <Btn onClick={() => showToast("info", "Import coming soon")}>📥 Import</Btn>
        <Btn>🖨️ Print</Btn>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: C.skyMid, opacity: 0.6 }}>{filtered.length} of {DEMO_ITEMS.length} items</span>
      </Toolbar>
      <TableCard title="">
        <thead>
          <tr><Th>#</Th><Th>Item Code</Th><Th>Item Name</Th><Th>Category</Th><Th>MRP</Th><Th>Sale Rate</Th><Th>Stock Qty</Th><Th>GST%</Th><Th>Status</Th><Th>Actions</Th></tr>
        </thead>
        <tbody>
          {filtered.map((item, i) => (
            <tr key={item.code} style={{ borderBottom: "1px solid rgba(184,217,240,0.06)" }}>
              <Td muted>{i + 1}</Td>
              <Td mono style={{ color: C.accent, fontSize: 12 }}>{item.code}</Td>
              <Td bold>{item.name}</Td>
              <Td><Badge color="info">{item.category}</Badge></Td>
              <Td mono>{fmt(item.mrp)}</Td>
              <Td mono style={{ color: C.success }}>{fmt(item.rate)}</Td>
              <Td mono style={{ color: item.stock < 50 ? C.warning : C.sky }}>{item.stock}</Td>
              <Td mono>{item.gst}%</Td>
              <Td><Badge color={item.active ? "active" : "inactive"}>{item.active ? "✓ Active" : "✗ Inactive"}</Badge></Td>
              <Td>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => showToast("info", `Editing ${item.name}`)}>✏️</Btn>
                  <Btn style={{ padding: "5px 10px", fontSize: 11 }}>👁️</Btn>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </div>
  );
}

function CustomerMasterPage({ showToast }) {
  const [search, setSearch] = useState("");
  const filtered = DEMO_CUSTOMERS.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );
  return (
    <div>
      <PageHeader icon="👥" title="Customer Master" desc="Manage customer profiles, contacts and loyalty points"
        actions={[
          <Btn key="r" variant="secondary" onClick={() => showToast("info", "Refreshed")}>🔄 Refresh</Btn>,
          <Btn key="n" variant="success" onClick={() => showToast("info", "New customer form coming soon")}>➕ New Customer</Btn>,
        ]}
      />
      <Toolbar>
        <SearchBox placeholder="Search customers..." value={search} onChange={setSearch} />
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: C.skyMid, opacity: 0.6 }}>{filtered.length} customers</span>
      </Toolbar>
      <TableCard title="">
        <thead>
          <tr><Th>#</Th><Th>Customer ID</Th><Th>Name</Th><Th>Phone</Th><Th>Email</Th><Th>Loyalty Pts</Th><Th>Status</Th><Th>Actions</Th></tr>
        </thead>
        <tbody>
          {filtered.map((c, i) => (
            <tr key={c.id} style={{ borderBottom: "1px solid rgba(184,217,240,0.06)" }}>
              <Td muted>{i + 1}</Td>
              <Td mono style={{ color: C.accent, fontSize: 12 }}>{c.id}</Td>
              <Td bold>{c.name}</Td>
              <Td mono>{c.phone}</Td>
              <Td muted>{c.email}</Td>
              <Td><span style={{ color: C.gold, fontWeight: 700, fontFamily: "monospace" }}>⭐ {fmtNum(c.points)}</span></Td>
              <Td><Badge color={c.active ? "active" : "inactive"}>{c.active ? "✓ Active" : "✗ Inactive"}</Badge></Td>
              <Td>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn style={{ padding: "5px 10px", fontSize: 11 }}>✏️</Btn>
                  <Btn style={{ padding: "5px 10px", fontSize: 11 }}>👁️</Btn>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </div>
  );
}

function UsersPage({ showToast }) {
  return (
    <div>
      <PageHeader icon="👤" title="User Management" desc="Manage system users, roles and access permissions"
        actions={[
          <Btn key="n" variant="success" onClick={() => showToast("info", "New user form coming soon")}>➕ New User</Btn>,
        ]}
      />
      <TableCard title="System Users">
        <thead>
          <tr><Th>#</Th><Th>User ID</Th><Th>Username</Th><Th>Full Name</Th><Th>Role</Th><Th>Store</Th><Th>Email</Th><Th>Status</Th><Th>Actions</Th></tr>
        </thead>
        <tbody>
          {DEMO_USERS.map((u, i) => (
            <tr key={u.id} style={{ borderBottom: "1px solid rgba(184,217,240,0.06)" }}>
              <Td muted>{i + 1}</Td>
              <Td mono style={{ color: C.accent, fontSize: 12 }}>{u.id}</Td>
              <Td bold>{u.username}</Td>
              <Td>{u.name}</Td>
              <Td><Badge color="info">{u.type}</Badge></Td>
              <Td>{u.store}</Td>
              <Td muted>{u.email}</Td>
              <Td><Badge color={u.active ? "active" : "inactive"}>{u.active ? "✓ Active" : "✗ Inactive"}</Badge></Td>
              <Td>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => showToast("info", `Editing ${u.username}`)}>✏️ Edit</Btn>
                  <Btn variant="danger" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => showToast("info", "Password reset sent")}>🔑 Reset</Btn>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </div>
  );
}

function ReportPage({ showToast }) {
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
  const [from, setFrom] = useState(weekAgo);
  const [to, setTo] = useState(today);
  const [data, setData] = useState(null);
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,217,240,0.15)", color: C.sky, padding: "9px 12px", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none" };
  const generate = () => {
    if (!from || !to) { showToast("error", "Please select both dates"); return; }
    showToast("info", "Generating report...");
    setTimeout(() => { setData(DEMO_REPORT); showToast("success", "Report generated"); }, 500);
  };
  return (
    <div>
      <PageHeader icon="📊" title="Sales Summary Report" desc="Consolidated sales data across stores and date ranges" actions={[]} />
      <div style={{ background: "linear-gradient(135deg,rgba(20,32,53,0.95),rgba(30,58,110,0.5))", border: "1px solid rgba(184,217,240,0.1)", borderRadius: 12, padding: 24, marginBottom: 18 }}>
        <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color: C.accent, marginBottom: 18, borderBottom: "1px solid rgba(0,180,216,0.15)", paddingBottom: 10 }}>📅 Date Range & Filters</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: C.skyMid }}>From Date <span style={{ color: C.danger }}>*</span></label>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: C.skyMid }}>To Date <span style={{ color: C.danger }}>*</span></label>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: C.skyMid }}>Store</label>
            <select style={inputStyle}>
              <option>All Stores</option>
              <option>ST001 – Main Branch</option>
              <option>ST002 – West Branch</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn variant="primary" onClick={generate}>🔍 Generate Report</Btn>
          <Btn onClick={() => setData(null)}>🗑️ Clear</Btn>
          {data && <><Btn onClick={() => showToast("info", "Exporting...")}>📊 Export Excel</Btn><Btn onClick={() => showToast("info", "Printing...")}>🖨️ Print</Btn></>}
        </div>
      </div>
      {data && (
        <TableCard title="📊 Sales Summary" actions={<span style={{ fontSize: 12, color: C.skyMid, opacity: 0.6 }}>{data.length} records</span>}>
          <thead>
            <tr><Th>Sale Day</Th><Th>Store</Th><Th>Bill Count</Th><Th>Gross Sales</Th><Th>Discount</Th><Th>Tax</Th><Th>Net Sales</Th></tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(184,217,240,0.06)" }}>
                <Td mono>{r.date}</Td>
                <Td>{r.store}</Td>
                <Td mono>{r.bills}</Td>
                <Td mono>{fmt(r.gross)}</Td>
                <Td mono style={{ color: C.danger }}>{fmt(r.discount)}</Td>
                <Td mono style={{ color: C.warning }}>{fmt(r.tax)}</Td>
                <Td mono style={{ color: C.success, fontWeight: 700 }}>{fmt(r.net)}</Td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      )}
    </div>
  );
}

function PlaceholderPage({ icon, title }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 16, opacity: 0.5 }}>
      <div style={{ fontSize: 64 }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.sky }}>{title}</div>
      <div style={{ fontSize: 13, color: C.skyMid }}>This section is under development</div>
    </div>
  );
}

// ─── Status Bar ───────────────────────────────────────────────────────────────
function StatusBar() {
  return (
    <div style={{ height: 28, display: "flex", alignItems: "center", gap: 16, padding: "0 20px", background: "rgba(8,14,26,0.95)", borderTop: "1px solid rgba(0,180,216,0.08)", fontSize: 11, color: C.skyMid, opacity: 0.6, fontFamily: "monospace", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.success, animation: "pulse 2s infinite" }} />
        API Connected
      </div>
      <div style={{ width: 1, height: 14, background: "rgba(184,217,240,0.1)" }} />
      <span>DB: sapphire_pos</span>
      <div style={{ width: 1, height: 14, background: "rgba(184,217,240,0.1)" }} />
      <span>Store: ST001 – Main</span>
      <div style={{ width: 1, height: 14, background: "rgba(184,217,240,0.1)" }} />
      <span>v3.0.0</span>
      <div style={{ flex: 1 }} />
      <span>SAP B1 ✓ Synced</span>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { toasts, show: showToast } = useToast();

  return (
    <>
      <style>{`
        @keyframes toastIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes chartFadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes barGrow { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.5); cursor: pointer; }
        select option { background: #142035; color: #E8F4FD; }
        tr:hover { background: rgba(45,91,163,0.15) !important; }
      `}</style>

      <ToastContainer toasts={toasts} />

      <div style={{ padding: 0 }}>
        <DashboardPage showToast={showToast} />
      </div>
    </>
  );
}


//! Dashboard after store dynamic fix 