import "./OrderPage.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getItem, setItem } from "@/lib/localstorage";
import { STATUS_FLOW, STATUS_META } from "../data/masterData";

const TAILORMATE_ORDER_STORAGE_KEY = "tailormate_orders";

export default function OrderPage() {
  const [orders, setOrders] = useState(() => getItem(TAILORMATE_ORDER_STORAGE_KEY) || []);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch]             = useState("");
  const [expanded, setExpanded]         = useState(null);

  useEffect(() => {
    setOrders(getItem(TAILORMATE_ORDER_STORAGE_KEY) || []);
  }, []);

  function updateStatus(id, status) {
    setOrders(prev => {
      const nextOrders = prev.map(order => (order.id === id ? { ...order, status } : order));
      setItem(TAILORMATE_ORDER_STORAGE_KEY, nextOrders);
      return nextOrders;
    });
  }

  const filtered = orders.filter(o => {
    const ms = filterStatus === "All" || o.status === filterStatus;
    const mq = !search || [o.id, o.customerName, o.billNo, o.tailorName]
      .some(v => v.toLowerCase().includes(search.toLowerCase()));
    return ms && mq;
  });

  const counts = STATUS_FLOW.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length; return acc;
  }, {});

  function advance(id, cur) {
    const idx = STATUS_FLOW.indexOf(cur);
    if (idx < STATUS_FLOW.length - 1) {
      const next = STATUS_FLOW[idx + 1];
      updateStatus(id, next);
      toast.success(`Order moved to "${next}"`);
    }
  }

  function getStatusCls(s) {
    return ({
      Pending:       "tm-status--amber",
      "In Progress": "tm-status--blue",
      Ready:         "tm-status--green",
      Delivered:     "tm-status--teal",
    })[s] || "";
  }

  return (
    <div className="tm-page">
      <div className="tm-page-header">
        <div className="tm-page-header-bar" />
        <div>
          <h1 className="tm-page-title">Orders Management</h1>
          <p className="tm-page-sub">Track and manage all tailoring orders</p>
        </div>
        <Link to="/transaction/tailormate/new-order" className="tm-btn tm-btn-primary" style={{ marginLeft: "auto" }}>
          + New Order
        </Link>
      </div>

      {/* ── KPI strip ─────────────────────────────────── */}
      <div className="tm-kpi-strip">
        {["All", ...STATUS_FLOW].map(s => {
          const cnt = s === "All" ? orders.length : counts[s];
          const meta = STATUS_META[s] || { icon: "📋", color: "blue" };
          return (
            <div key={s} className={`tm-kpi-card ${filterStatus === s ? "tm-kpi-card--active" : ""}`}
              onClick={() => setFilterStatus(s)}>
              <div className={`tm-kpi-icon tm-kpi-icon--${meta.color || "blue"}`}>{meta.icon || "📋"}</div>
              <div className="tm-kpi-body">
                <div className="tm-kpi-value">{cnt}</div>
                <div className="tm-kpi-label">{s}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── toolbar ───────────────────────────────────── */}
      <div className="tm-toolbar">
        <div className="tm-search-wrap">
          <span className="tm-search-icon">🔍</span>
          <input className="tm-search-input" type="text" placeholder="Search by Order ID, Customer, Bill, Tailor…"
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="tm-search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>
        <div className="tm-filter-chips">
          {["All", ...STATUS_FLOW].map(s => (
            <button key={s} className={`tm-chip ${filterStatus === s ? "tm-chip--active" : ""}`}
              onClick={() => setFilterStatus(s)}>
              {s} {s !== "All" && counts[s] > 0 && <span className="tm-chip-cnt">{counts[s]}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── orders table ──────────────────────────────── */}
      <div className="tm-table-container">
        <div className="tm-table-header">
          <span className="tm-table-title">Orders</span>
          <span className="tm-table-count">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        {filtered.length === 0 ? (
          <div className="tm-empty">
            <div className="tm-empty-icon">📋</div>
            <div className="tm-empty-text">
              {orders.length === 0
                ? "No orders yet. Create your first order."
                : "No orders match your filter."}
            </div>
          </div>
        ) : (
          <div className="tm-table-scroll">
            <table className="tm-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Bill No.</th>
                  <th>Type</th>
                  <th>Tailor</th>
                  <th>Delivery</th>
                  <th style={{textAlign:"right"}}>Amount (₹)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <>
                    <tr key={o.id} className={expanded === o.id ? "tm-tr--expanded" : ""}
                      onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                      <td><span className="tm-code">{o.id}</span></td>
                      <td>
                        <div className="tm-cust-cell">
                          <div className="tm-cust-chip">{o.customerName.charAt(0)}</div>
                          <div>
                            <div className="tm-cust-name">{o.customerName}</div>
                            <div className="tm-cust-phone">{o.customerPhone}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="tm-code">{o.billNo}</span></td>
                      <td><span className="tm-type-pill">{o.orderTypeLabel}</span></td>
                      <td>✂ {o.tailorName}</td>
                      <td>{o.delivDate}</td>
                      <td style={{textAlign:"right"}}>
                        <strong>{o.net.toLocaleString("en-IN")}</strong>
                        {o.balance > 0 && <div className="tm-bal-pill">Bal: ₹{o.balance.toLocaleString("en-IN")}</div>}
                      </td>
                      <td><span className={`tm-status-badge ${getStatusCls(o.status)}`}>{STATUS_META[o.status]?.icon} {o.status}</span></td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="tm-act-row">
                          {STATUS_FLOW.indexOf(o.status) < STATUS_FLOW.length - 1 && (
                            <button className="tm-btn tm-btn-sm tm-btn-primary"
                              onClick={() => advance(o.id, o.status)}>
                              → {STATUS_FLOW[STATUS_FLOW.indexOf(o.status)+1]}
                            </button>
                          )}
                          <button className="tm-btn tm-btn-sm tm-btn-secondary"
                            onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                            {expanded === o.id ? "▲" : "▼"}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded === o.id && (
                      <tr className="tm-tr--detail">
                        <td colSpan={9}>
                          <div className="tm-detail-panel">
                            <div className="tm-dp-section">
                              <h4>Items & Work</h4>
                              <table className="tm-table">
                                <thead><tr><th>Description</th><th>Work Type</th><th>Qty</th><th>Remarks</th><th style={{textAlign:"right"}}>Charge</th></tr></thead>
                                <tbody>
                                  {o.items.map((it, i) => (
                                    <tr key={i}>
                                      <td>{it.description}</td>
                                      <td>{it.workName}</td>
                                      <td>{it.itemQty}</td>
                                      <td className="tm-cell-muted">{it.remarks || "—"}</td>
                                      <td style={{textAlign:"right"}}>₹ {(parseFloat(it.charge)*parseInt(it.itemQty)).toLocaleString("en-IN")}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="tm-dp-section">
                              <h4>Measurements ({o.measType})</h4>
                              <div className="tm-meas-chips">
                                {Object.entries(o.measures).filter(([,v])=>v).map(([k,v])=>(
                                  <span key={k} className="tm-meas-chip">{k}: {v}"</span>
                                ))}
                                {!Object.values(o.measures).some(Boolean) && <span className="tm-cell-muted">Not recorded</span>}
                              </div>
                            </div>
                            <div className="tm-dp-section">
                              <h4>Update Status</h4>
                              <div className="tm-status-flow">
                                {STATUS_FLOW.map(s => (
                                  <button key={s}
                                    className={`tm-sf-btn ${o.status === s ? "tm-sf-btn--active" : STATUS_FLOW.indexOf(o.status) > STATUS_FLOW.indexOf(s) ? "tm-sf-btn--done" : ""}`}
                                    onClick={() => { updateStatus(o.id, s); toast.success(`Status -> ${s}`); }}>
                                    {STATUS_META[s]?.icon} {s}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
