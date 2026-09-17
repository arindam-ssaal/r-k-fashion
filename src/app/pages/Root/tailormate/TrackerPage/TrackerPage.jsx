import "./TrackerPage.css";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getItem, setItem } from "@/lib/localstorage";
import { TAILORS, STATUS_FLOW, STATUS_META } from "../data/masterData";

const TAILORMATE_ORDER_STORAGE_KEY = "tailormate_orders";

export default function TrackerPage() {
  const [orders, setOrders] = useState(() => getItem(TAILORMATE_ORDER_STORAGE_KEY) || []);

  useEffect(() => {
    setOrders(getItem(TAILORMATE_ORDER_STORAGE_KEY) || []);
  }, []);

  function move(id, status) {
    setOrders(prev => {
      const nextOrders = prev.map(order => (order.id === id ? { ...order, status } : order));
      setItem(TAILORMATE_ORDER_STORAGE_KEY, nextOrders);
      return nextOrders;
    });
    toast.success(`Order moved to "${status}"`);
  }

  const COL_STYLES = {
    Pending:       { bg: "#fff8e1", border: "#fbc02d", head: "#f57f17" },
    "In Progress": { bg: "#e3f2fd", border: "#1976d2", head: "#1565c0" },
    Ready:         { bg: "#e8f5e9", border: "#388e3c", head: "#2e7d32" },
    Delivered:     { bg: "#e0f2f1", border: "#00796b", head: "#004d40" },
  };

  return (
    <div className="tm-page">
      <div className="tm-page-header">
        <div className="tm-page-header-bar" />
        <div>
          <h1 className="tm-page-title">Order Tracker — Kanban</h1>
          <p className="tm-page-sub">Drag view of orders across production stages</p>
        </div>
        <div className="tm-kanban-summary">
          {STATUS_FLOW.map(s => (
            <span key={s} className="tm-ks-pill">
              {STATUS_META[s].icon} {s}: <strong>{orders.filter(o => o.status === s).length}</strong>
            </span>
          ))}
        </div>
      </div>

      <div className="tm-kanban">
        {STATUS_FLOW.map(status => {
          const col = orders.filter(o => o.status === status);
          const st  = COL_STYLES[status];
          return (
            <div key={status} className="tm-kanban-col" style={{ "--col-border": st.border, "--col-bg": st.bg }}>
              <div className="tm-kc-header" style={{ color: st.head }}>
                <span>{STATUS_META[status].icon}</span>
                <span>{status}</span>
                <span className="tm-kc-count">{col.length}</span>
              </div>
              <div className="tm-kc-body">
                {col.length === 0 && <div className="tm-kc-empty">No orders</div>}
                {col.map(o => {
                  const daysLeft  = o.delivDate ? Math.ceil((new Date(o.delivDate)-new Date())/86400000) : null;
                  const isOverdue = daysLeft !== null && daysLeft < 0;
                  const isDueSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 1;
                  return (
                    <div key={o.id} className={`tm-kc-card${isOverdue ? " tm-kc-card--overdue" : isDueSoon ? " tm-kc-card--due-soon" : ""}`}>
                      <div className="tm-kc-top">
                        <span className="tm-code">{o.id}</span>
                        {o.priority !== "Normal" && (
                          <span className={`tm-priority-badge tm-priority-${o.priority.toLowerCase()}`}>{o.priority}</span>
                        )}
                        {(isOverdue || isDueSoon) && (
                          <span className="tm-overdue-badge">{isOverdue ? "Overdue" : "Due Soon"}</span>
                        )}
                      </div>
                      <div className="tm-kc-customer">{o.customerName}</div>
                      <div className="tm-kc-bill">{o.billNo} · {o.orderTypeLabel}</div>
                      <div className="tm-kc-items">
                        {o.items.slice(0,2).map((it,i)=>(
                          <span key={i} className="tm-kc-item-chip">{it.workName}</span>
                        ))}
                        {o.items.length > 2 && <span className="tm-kc-item-chip">+{o.items.length-2}</span>}
                      </div>
                      <div className="tm-kc-footer">
                        <span>✂ {o.tailorName}</span>
                        <span className="tm-kc-amt">₹{o.net.toLocaleString("en-IN")}</span>
                      </div>
                      {o.delivDate && (
                        <div className={`tm-kc-delivery${isOverdue?" tm-kc-delivery--over":isDueSoon?" tm-kc-delivery--soon":""}`}>
                          📅 {o.delivDate}
                          {daysLeft !== null && (
                            <span className="tm-kc-days">
                              {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? "Today" : `${daysLeft}d left`}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="tm-kc-actions">
                        {STATUS_FLOW.filter(s => s !== status).map(s => (
                          <button key={s} className="tm-kc-move" onClick={() => move(o.id, s)}>→ {s}</button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tailor workload */}
      <div className="tm-panel" style={{ marginTop: 24 }}>
        <div className="tm-panel-title"><span className="tm-panel-bar" />Tailor Workload</div>
        <div className="tm-workload-grid">
          {TAILORS.map(t => {
            const active = orders.filter(o => o.tailorId === t.id && o.status !== "Delivered").length;
            const total  = orders.filter(o => o.tailorId === t.id).length;
            return (
              <div key={t.id} className="tm-wl-card">
                <div className="tm-tailor-avatar">{t.name.charAt(0)}</div>
                <div className="tm-wl-info">
                  <div className="tm-tailor-name">{t.name}</div>
                  <div className="tm-tailor-spec">{t.speciality}</div>
                </div>
                <div className="tm-wl-counts">
                  <span className="tm-wl-active">{active} Active</span>
                  <span className="tm-wl-total">{total} Total</span>
                </div>
                <div className={`tm-wl-dot${t.available && active < 4 ? " tm-wl-dot--ok" : " tm-wl-dot--busy"}`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
