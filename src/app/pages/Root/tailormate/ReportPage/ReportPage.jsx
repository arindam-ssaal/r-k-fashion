import "./ReportPage.css";
import { useEffect, useState } from "react";
import { getItem } from "@/lib/localstorage";
import { TAILORS, STATUS_FLOW } from "../data/masterData";

const TAILORMATE_ORDER_STORAGE_KEY = "tailormate_orders";

export default function ReportPage() {
  const [orders, setOrders] = useState(() => getItem(TAILORMATE_ORDER_STORAGE_KEY) || []);

  useEffect(() => {
    setOrders(getItem(TAILORMATE_ORDER_STORAGE_KEY) || []);
  }, []);

  const total    = orders.length;
  const revenue  = orders.reduce((s,o) => s + o.net, 0);
  const advance  = orders.reduce((s,o) => s + (o.advance||0), 0);
  const balance  = orders.reduce((s,o) => s + (o.balance||0), 0);
  const delivered= orders.filter(o => o.status === "Delivered").length;
  const pending  = orders.filter(o => o.status !== "Delivered").length;

  const tailorStats = TAILORS.map(t => ({
    ...t,
    cnt: orders.filter(o => o.tailorId === t.id).length,
    rev: orders.filter(o => o.tailorId === t.id).reduce((s,o)=>s+o.net,0),
  })).sort((a,b)=>b.cnt-a.cnt);

  const workMap = {};
  orders.forEach(o => o.items.forEach(it => {
    workMap[it.workName] = (workMap[it.workName] || 0) + 1;
  }));
  const topWork = Object.entries(workMap).sort((a,b)=>b[1]-a[1]).slice(0,6);

  const KPI = [
    { label:"Total Orders",       val: total,                      icon:"📋", color:"blue" },
    { label:"Total Revenue (₹)",  val: `₹${revenue.toLocaleString("en-IN")}`, icon:"💰", color:"green" },
    { label:"Advance Collected",  val: `₹${advance.toLocaleString("en-IN")}`, icon:"💳", color:"purple" },
    { label:"Balance Pending",    val: `₹${balance.toLocaleString("en-IN")}`, icon:"⏳", color:"amber", red: balance > 0 },
    { label:"Delivered",          val: delivered, icon:"✅", color:"teal" },
    { label:"In Progress",        val: pending,   icon:"✂️", color:"blue" },
  ];

  return (
    <div className="tm-page">
      <div className="tm-page-header">
        <div className="tm-page-header-bar" />
        <div>
          <h1 className="tm-page-title">Reports & Analytics</h1>
          <p className="tm-page-sub">Business overview and performance metrics</p>
        </div>
      </div>

      <div className="tm-kpi-strip">
        {KPI.map(k => (
          <div key={k.label} className="tm-kpi-card">
            <div className={`tm-kpi-icon tm-kpi-icon--${k.color}`}>{k.icon}</div>
            <div className="tm-kpi-body">
              <div className={`tm-kpi-value${k.red ? " tm-bal-due" : ""}`}>{k.val}</div>
              <div className="tm-kpi-label">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="tm-reports-grid">
        {/* Tailor performance */}
        <div className="tm-panel">
          <div className="tm-panel-title"><span className="tm-panel-bar" />Tailor Performance</div>
          {total === 0
            ? <div className="tm-empty-text tm-cell-muted">No orders yet.</div>
            : (
              <table className="tm-table">
                <thead><tr><th>Tailor</th><th>Speciality</th><th style={{textAlign:"right"}}>Orders</th><th style={{textAlign:"right"}}>Revenue (₹)</th></tr></thead>
                <tbody>
                  {tailorStats.map(t => (
                    <tr key={t.id}>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div className="tm-tailor-avatar" style={{width:28,height:28,fontSize:12}}>{t.name.charAt(0)}</div>
                          {t.name}
                        </div>
                      </td>
                      <td className="tm-cell-muted">{t.speciality}</td>
                      <td style={{textAlign:"right"}}><span className="tm-chip tm-chip--active">{t.cnt}</span></td>
                      <td style={{textAlign:"right"}}>₹{t.rev.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>

        {/* Status distribution */}
        <div className="tm-panel">
          <div className="tm-panel-title"><span className="tm-panel-bar" />Order Status Distribution</div>
          {total === 0
            ? <div className="tm-empty-text tm-cell-muted">No orders yet.</div>
            : STATUS_FLOW.map(s => {
              const cnt = orders.filter(o => o.status === s).length;
              const pct = total ? Math.round(cnt/total*100) : 0;
              const COLOR = { Pending:"#f9a825","In Progress":"#1565c0",Ready:"#2e7d32",Delivered:"#00796b" };
              return (
                <div key={s} className="tm-dist-row">
                  <span className="tm-dist-label">{s}</span>
                  <div className="tm-dist-bar-wrap">
                    <div className="tm-dist-bar" style={{ width:`${pct}%`, background: COLOR[s] }} />
                  </div>
                  <span className="tm-dist-pct">{pct}% ({cnt})</span>
                </div>
              );
            })
          }
        </div>

        {/* Top work types */}
        <div className="tm-panel">
          <div className="tm-panel-title"><span className="tm-panel-bar" />Top Work Types</div>
          {topWork.length === 0
            ? <div className="tm-empty-text tm-cell-muted">No data yet.</div>
            : topWork.map(([name, cnt], i) => (
              <div key={name} className="tm-wt-row">
                <span className="tm-wt-rank">#{i+1}</span>
                <span className="tm-wt-name">{name}</span>
                <span className="tm-chip tm-chip--active">{cnt}</span>
              </div>
            ))
          }
        </div>

        {/* Recent orders */}
        <div className="tm-panel">
          <div className="tm-panel-title"><span className="tm-panel-bar" />Recent Orders</div>
          {orders.length === 0
            ? <div className="tm-empty-text tm-cell-muted">No orders yet.</div>
            : orders.slice(0,7).map(o => (
              <div key={o.id} className="tm-ro-row">
                <div>
                  <div className="tm-code">{o.id}</div>
                  <div className="tm-cell-muted" style={{fontSize:12}}>{o.customerName}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:"auto"}}>
                  <span className={`tm-status-badge ${({Pending:"tm-status--amber","In Progress":"tm-status--blue",Ready:"tm-status--green",Delivered:"tm-status--teal"})[o.status]}`}>{o.status}</span>
                  <span style={{fontWeight:600,fontSize:13}}>₹{o.net.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
