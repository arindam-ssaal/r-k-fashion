// import "./NewOrderPage.css";
import '../../../../../style.css'
import { useState } from "react";
import { toast } from "sonner";
import { getItem, setItem } from "@/lib/localstorage";
import { POS_BILLS, WORK_TYPES, TAILORS, MEASURE_FIELDS } from "../data/masterData";

const STEPS = ["Select Bill","Select Items","Measurements","Order Details","Confirm"];

const ORDER_TYPE_LABELS = {
  stitching:  "New Stitching",
  alteration: "Alteration",
  sale:       "Sale / Ready Pickup",
};

const TAILORMATE_ORDER_STORAGE_KEY = "tailormate_orders";

export default function NewOrderPage() {
  // wizard step
  const [step, setStep] = useState(0);

  // form state
  const [billSearch, setBillSearch]     = useState("");
  const [showDrop, setShowDrop]         = useState(false);
  const [selBill,  setSelBill]          = useState(null);
  const [orderType, setOrderType]       = useState("stitching");
  const [selItems,  setSelItems]        = useState([]);   // items chosen from bill
  const [measType,  setMeasType]        = useState("Gents");
  const [measures,  setMeasures]        = useState({});
  const [tailorId,  setTailorId]        = useState("");
  const [priority,  setPriority]        = useState("Normal");
  const [delivDate, setDelivDate]       = useState("");
  const [instrNote, setInstrNote]       = useState("");
  const [discount,  setDiscount]        = useState(0);
  const [advance,   setAdvance]         = useState(0);

  // ── bill search ───────────────────────────────────────────────────────────
  const filteredBills = POS_BILLS.filter(b =>
    b.billNo.toLowerCase().includes(billSearch.toLowerCase()) ||
    b.customerName.toLowerCase().includes(billSearch.toLowerCase()) ||
    b.customerPhone.includes(billSearch)
  );

  function pickBill(bill) {
    setSelBill(bill);
    setBillSearch(bill.billNo);
    setShowDrop(false);
    setSelItems([]);
  }

  // ── item toggle ───────────────────────────────────────────────────────────
  function toggleItem(item) {
    const exists = selItems.find(si => si.id === item.id);
    if (exists) {
      setSelItems(p => p.filter(si => si.id !== item.id));
    } else {
      const wts = WORK_TYPES[item.category] || WORK_TYPES.Readymade;
      setSelItems(p => [...p, {
        ...item,
        workId:    wts[0].id,
        workName:  wts[0].name,
        charge:    wts[0].charge,
        itemQty:   1,
        remarks:   "",
      }]);
    }
  }

  function updateItem(id, field, val) {
    setSelItems(p => p.map(si => {
      if (si.id !== id) return si;
      if (field === "workId") {
        const wts = WORK_TYPES[si.category] || WORK_TYPES.Readymade;
        const wt  = wts.find(w => w.id === val) || wts[0];
        return { ...si, workId: val, workName: wt.name, charge: wt.charge };
      }
      return { ...si, [field]: val };
    }));
  }

  // ── totals ────────────────────────────────────────────────────────────────
  const gross    = selItems.reduce((s, i) => s + parseFloat(i.charge||0) * parseInt(i.itemQty||1), 0);
  const net      = Math.max(0, gross - parseFloat(discount||0));
  const balance  = Math.max(0, net - parseFloat(advance||0));

  // ── submit ────────────────────────────────────────────────────────────────
  function handleSubmit() {
    if (!selBill)         return toast.error("Please select a POS Bill");
    if (!selItems.length) return toast.error("Select at least one item");
    if (!tailorId)        return toast.error("Please assign a Tailor");
    if (!delivDate)       return toast.error("Please set Delivery Date");

    const tailor = TAILORS.find(t => t.id === tailorId);
    const id     = "TAL-" + Date.now().toString().slice(-6);
    const newOrder = {
      id, orderDate: new Date().toISOString(),
      billNo: selBill.billNo, billDate: selBill.billDate,
      customerName:  selBill.customerName,
      customerPhone: selBill.customerPhone,
      orderType, orderTypeLabel: ORDER_TYPE_LABELS[orderType],
      items: selItems,
      measType, measures,
      tailorId, tailorName: tailor?.name || "",
      priority, delivDate, instrNote,
      gross, discount: parseFloat(discount||0),
      net, advance: parseFloat(advance||0), balance,
      status: "Pending",
    };

    const existingOrders = getItem(TAILORMATE_ORDER_STORAGE_KEY) || [];
    setItem(TAILORMATE_ORDER_STORAGE_KEY, [newOrder, ...existingOrders]);

    toast.success(`Order ${id} created successfully!`);
    resetForm();
  }

  function resetForm() {
    setStep(0); setSelBill(null); setBillSearch(""); setOrderType("stitching");
    setSelItems([]); setMeasures({}); setMeasType("Gents"); setTailorId("");
    setPriority("Normal"); setDelivDate(""); setInstrNote(""); setDiscount(0); setAdvance(0);
  }

  function canNext() {
    if (step === 0) return !!selBill;
    if (step === 1) return selItems.length > 0;
    return true;
  }

  const measFields = MEASURE_FIELDS[measType] || MEASURE_FIELDS.Gents;

  return (
    <div className="tm-page">
      {/* ── page header ────────────────────────────────── */}
      <div className="tm-page-header">
        <div className="tm-page-header-bar" />
        <div>
          <h1 className="tm-page-title">New Tailoring Order</h1>
          <p className="tm-page-sub">Create a stitching, alteration or sale order linked to a POS bill</p>
        </div>
      </div>

      {/* ── stepper ────────────────────────────────────── */}
      <div className="tm-stepper">
        {STEPS.map((s, i) => (
          <div key={i} className={`tm-step ${i === step ? "tm-step--active" : i < step ? "tm-step--done" : ""}`}
            onClick={() => i < step && setStep(i)} style={{ cursor: i < step ? "pointer" : "default" }}>
            <div className="tm-step-circle">
              {i < step ? <span>✓</span> : <span>{i + 1}</span>}
            </div>
            <span className="tm-step-label">{s}</span>
            {i < STEPS.length - 1 && <div className="tm-step-line" />}
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════
          STEP 0 — Select POS Bill
      ═══════════════════════════════════════════════════ */}
      {step === 0 && (
        <div className="tm-panel">
          <div className="tm-panel-title">
            <span className="tm-panel-bar" />
            Select POS Bill
          </div>

          {/* order type */}
          <div className="tm-field-row">
            <label className="tm-label">Order Type <span className="tm-req">*</span></label>
            <div className="tm-radio-group">
              {Object.entries(ORDER_TYPE_LABELS).map(([val, lbl]) => (
                <label key={val} className={`tm-radio-card ${orderType === val ? "tm-radio-card--active" : ""}`}>
                  <input type="radio" name="orderType" value={val}
                    checked={orderType === val} onChange={() => setOrderType(val)} />
                  {lbl}
                </label>
              ))}
            </div>
          </div>

          {/* search */}
          <div className="tm-field-row">
            <label className="tm-label">POS Bill No. / Customer <span className="tm-req">*</span></label>
            <div className="tm-search-wrap">
              <span className="tm-search-icon">🔍</span>
              <input className="tm-search-input" type="text" placeholder="Search Bill No., Name or Phone..."
                value={billSearch}
                onChange={e => { setBillSearch(e.target.value); setShowDrop(true); setSelBill(null); }}
                onFocus={() => setShowDrop(true)} />
              {showDrop && filteredBills.length > 0 && (
                <div className="tm-dropdown">
                  {filteredBills.map(b => (
                    <div key={b.billNo} className="tm-dropdown-item" onClick={() => pickBill(b)}>
                      <div className="tm-dd-left">
                        <span className="tm-code-badge">{b.billNo}</span>
                        <span className="tm-dd-name">{b.customerName}</span>
                      </div>
                      <div className="tm-dd-right">
                        <span className="tm-dd-date">{b.billDate}</span>
                        <span className="tm-dd-amt">₹{b.totalAmount.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* bills grid */}
          <div className="tm-bills-grid">
            {POS_BILLS.map(b => (
              <div key={b.billNo} className={`tm-bill-card ${selBill?.billNo === b.billNo ? "tm-bill-card--active" : ""}`}
                onClick={() => pickBill(b)}>
                {selBill?.billNo === b.billNo && <span className="tm-bill-check">✓</span>}
                <div className="tm-bill-no">{b.billNo}</div>
                <div className="tm-bill-customer">
                  <div className="tm-cust-chip">{b.customerName.charAt(0)}</div>
                  <div>
                    <div className="tm-bill-cname">{b.customerName}</div>
                    <div className="tm-bill-phone">📞 {b.customerPhone}</div>
                  </div>
                </div>
                <div className="tm-bill-meta">
                  <span>{b.billDate}</span>
                  <span className="tm-bill-items">{b.items.length} items</span>
                </div>
                <div className="tm-bill-amount">₹{b.totalAmount.toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>

          {selBill && (
            <div className="tm-info-strip">
              <span>✅ Bill selected:</span>
              <strong>{selBill.billNo}</strong>
              <span>|</span>
              <strong>{selBill.customerName}</strong>
              <span>📞 {selBill.customerPhone}</span>
            </div>
          )}

          <div className="tm-step-actions">
            <span />
            <button className="tm-btn tm-btn-primary" disabled={!canNext()} onClick={() => setStep(1)}>
              Next: Select Items →
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          STEP 1 — Select Items
      ═══════════════════════════════════════════════════ */}
      {step === 1 && selBill && (
        <div className="tm-panel">
          <div className="tm-panel-title">
            <span className="tm-panel-bar" />
            POS Bill Items — {selBill.billNo}
          </div>
          <div className="tm-customer-strip">
            <span className="tm-cust-chip">{selBill.customerName.charAt(0)}</span>
            <div>
              <div className="tm-cs-name">{selBill.customerName}</div>
              <div className="tm-cs-meta">{selBill.customerPhone} | {selBill.billDate} | Salesman: {selBill.salesman}</div>
            </div>
          </div>

          <div className="tm-table-wrap">
            <table className="tm-table">
              <thead>
                <tr>
                  <th style={{width:40}}>Sel.</th>
                  <th>Item Code</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th style={{textAlign:"right"}}>Rate (₹)</th>
                  <th style={{textAlign:"right"}}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {selBill.items.map(item => {
                  const checked = selItems.some(si => si.id === item.id);
                  return (
                    <tr key={item.id} className={checked ? "tm-tr--sel" : ""} onClick={() => toggleItem(item)}>
                      <td><div className={`tm-checkbox ${checked ? "tm-checkbox--on" : ""}`}>{checked ? "✓" : ""}</div></td>
                      <td><span className="tm-code">{item.itemCode}</span></td>
                      <td className="text-c-black">{item.description}</td>
                      <td><span className={`tm-cat-badge tm-cat-${item.category.toLowerCase()}`}>{item.category}</span></td>
                      <td>{item.qty}</td>
                      <td>{item.unit}</td>
                      <td style={{textAlign:"right"}}>{item.rate.toLocaleString("en-IN")}</td>
                      <td style={{textAlign:"right"}}>{item.amount.toLocaleString("en-IN")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {selItems.length > 0 && (
            <div className="tm-work-config">
              <div className="tm-section-title">Configure Work for Selected Items</div>
              {selItems.map(si => {
                const wts = WORK_TYPES[si.category] || WORK_TYPES.Readymade;
                return (
                  <div key={si.id} className="tm-work-row">
                    <div className="tm-work-item-label">
                      <span className={`tm-cat-badge tm-cat-${si.category.toLowerCase()}`}>{si.category}</span>
                      <span className="tm-work-item-name">{si.description}</span>
                    </div>
                    <div className="tm-work-fields">
                      <div className="tm-field-grp">
                        <label>Work Type</label>
                        <select value={si.workId} onChange={e => updateItem(si.id, "workId", e.target.value)}>
                          {wts.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                      </div>
                      <div className="tm-field-grp" style={{maxWidth:80}}>
                        <label>Qty</label>
                        <input type="number" min="1" value={si.itemQty}
                          onChange={e => updateItem(si.id, "itemQty", e.target.value)} />
                      </div>
                      <div className="tm-field-grp" style={{maxWidth:120}}>
                        <label>Charge (₹)</label>
                        <input type="number" value={si.charge}
                          onChange={e => updateItem(si.id, "charge", e.target.value)} />
                      </div>
                      <div className="tm-field-grp" style={{flex:2}}>
                        <label>Remarks</label>
                        <input type="text" placeholder="Special note…" value={si.remarks}
                          onChange={e => updateItem(si.id, "remarks", e.target.value)} />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="tm-work-total">
                <span>Total Charge (before discount)</span>
                <strong>₹ {gross.toLocaleString("en-IN")}</strong>
              </div>
            </div>
          )}

          <div className="tm-step-actions">
            <button className="tm-btn tm-btn-secondary" onClick={() => setStep(0)}>← Back</button>
            <button className="tm-btn tm-btn-primary" disabled={!canNext()} onClick={() => setStep(2)}>
              Next: Measurements →
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          STEP 2 — Measurements
      ═══════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="tm-panel">
          <div className="tm-panel-title"><span className="tm-panel-bar" />Customer Measurements</div>

          <div className="tm-meas-type-row">
            {Object.keys(MEASURE_FIELDS).map(t => (
              <button key={t} className={`tm-type-btn ${measType === t ? "tm-type-btn--active" : ""}`}
                onClick={() => setMeasType(t)}>{t}</button>
            ))}
            <span className="tm-meas-unit-note">All measurements in inches (in)</span>
          </div>

          <div className="tm-meas-grid">
            {measFields.map(f => (
              <div key={f} className="tm-meas-field">
                <label>{f}</label>
                <div className="tm-meas-input-wrap">
                  <input type="number" step="0.5" min="0" placeholder="0.0"
                    value={measures[f] || ""}
                    onChange={e => setMeasures(m => ({ ...m, [f]: e.target.value }))} />
                  <span className="tm-meas-unit">in</span>
                </div>
              </div>
            ))}
          </div>

          <div className="tm-step-actions">
            <button className="tm-btn tm-btn-secondary" onClick={() => setStep(1)}>← Back</button>
            <button className="tm-btn tm-btn-primary" onClick={() => setStep(3)}>Next: Order Details →</button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          STEP 3 — Order Details
      ═══════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="tm-panel">
          <div className="tm-panel-title"><span className="tm-panel-bar" />Order Details</div>
          <div className="tm-details-grid">

            {/* Tailor Assignment */}
            <div className="tm-detail-card">
              <div className="tm-section-title">Tailor Assignment</div>
              <div className="tm-tailor-list">
                {TAILORS.map(t => (
                  <div key={t.id}
                    className={`tm-tailor-card${tailorId === t.id ? " tm-tailor-card--active" : ""}${!t.available ? " tm-tailor-card--busy" : ""}`}
                    onClick={() => t.available && setTailorId(t.id)}>
                    <div className="tm-tailor-avatar">{t.name.charAt(0)}</div>
                    <div className="tm-tailor-info">
                      <div className="tm-tailor-name">{t.name}</div>
                      <div className="tm-tailor-spec">{t.speciality}</div>
                    </div>
                    {!t.available && <span className="tm-busy-tag">Busy</span>}
                    {tailorId === t.id && <span className="tm-sel-tag">✓</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Priority & Delivery */}
            <div className="tm-detail-card">
              <div className="tm-section-title">Priority & Delivery</div>
              <div className="tm-field-row">
                <label className="tm-label">Priority</label>
                <div className="tm-radio-group">
                  {["Normal","Urgent","Express"].map(p => (
                    <label key={p} className={`tm-radio-card ${priority === p ? "tm-radio-card--active" : ""}`}>
                      <input type="radio" name="priority" value={p} checked={priority === p} onChange={() => setPriority(p)} />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
              <div className="tm-field-row">
                <label className="tm-label">Delivery Date <span className="tm-req">*</span></label>
                <input className="tm-input" type="date" value={delivDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => setDelivDate(e.target.value)} />
              </div>
              <div className="tm-field-row">
                <label className="tm-label">Special Instructions</label>
                <textarea className="tm-textarea" rows={3} placeholder="Instructions for the tailor…"
                  value={instrNote} onChange={e => setInstrNote(e.target.value)} />
              </div>
            </div>

            {/* Payment */}
            <div className="tm-detail-card tm-payment-card">
              <div className="tm-section-title">Payment Details</div>
              <div className="tm-pay-table">
                <div className="tm-pay-row">
                  <span>Gross Charge</span>
                  <span>₹ {gross.toLocaleString("en-IN")}</span>
                </div>
                <div className="tm-pay-row">
                  <span>Discount (₹)</span>
                  <input className="tm-input tm-input-sm" type="number" min="0" max={gross}
                    value={discount} onChange={e => setDiscount(e.target.value)} />
                </div>
                <div className="tm-pay-row tm-pay-row--total">
                  <span>Net Charge</span>
                  <strong>₹ {net.toLocaleString("en-IN")}</strong>
                </div>
                <div className="tm-pay-row">
                  <span>Advance Received (₹)</span>
                  <input className="tm-input tm-input-sm" type="number" min="0" max={net}
                    value={advance} onChange={e => setAdvance(e.target.value)} />
                </div>
                <div className="tm-pay-row tm-pay-row--balance">
                  <span>Balance Due</span>
                  <strong className={balance > 0 ? "tm-bal-due" : "tm-bal-zero"}>
                    ₹ {balance.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="tm-step-actions">
            <button className="tm-btn tm-btn-secondary" onClick={() => setStep(2)}>← Back</button>
            <button className="tm-btn tm-btn-primary" onClick={() => setStep(4)}>Preview Order →</button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          STEP 4 — Confirm
      ═══════════════════════════════════════════════════ */}
      {step === 4 && selBill && (
        <div className="tm-panel">
          <div className="tm-panel-title"><span className="tm-panel-bar" />Order Summary — Review & Confirm</div>

          <div className="tm-summary-grid">
            <div className="tm-sum-block">
              <h4 className="tm-sum-heading">Bill & Customer</h4>
              <div className="tm-sum-rows">
                <div className="tm-sum-row"><span>Bill No.</span><strong>{selBill.billNo}</strong></div>
                <div className="tm-sum-row"><span>Customer</span><strong>{selBill.customerName}</strong></div>
                <div className="tm-sum-row"><span>Phone</span><strong>{selBill.customerPhone}</strong></div>
                <div className="tm-sum-row"><span>Order Type</span><strong>{ORDER_TYPE_LABELS[orderType]}</strong></div>
              </div>
            </div>
            <div className="tm-sum-block">
              <h4 className="tm-sum-heading">Assignment</h4>
              <div className="tm-sum-rows">
                <div className="tm-sum-row"><span>Tailor</span><strong>{TAILORS.find(t=>t.id===tailorId)?.name || "—"}</strong></div>
                <div className="tm-sum-row"><span>Priority</span>
                  <span className={`tm-priority-badge tm-priority-${priority.toLowerCase()}`}>{priority}</span>
                </div>
                <div className="tm-sum-row"><span>Delivery</span><strong>{delivDate}</strong></div>
              </div>
            </div>
            <div className="tm-sum-block tm-sum-block--full">
              <h4 className="tm-sum-heading">Items ({selItems.length})</h4>
              <table className="tm-table">
                <thead>
                  <tr><th>Description</th><th>Work Type</th><th>Qty</th><th style={{textAlign:"right"}}>Charge</th><th style={{textAlign:"right"}}>Total</th></tr>
                </thead>
                <tbody>
                  {selItems.map((si, i) => (
                    <tr key={i}>
                      <td>{si.description}</td>
                      <td>{si.workName}</td>
                      <td>{si.itemQty}</td>
                      <td style={{textAlign:"right"}}>₹ {parseFloat(si.charge).toLocaleString("en-IN")}</td>
                      <td style={{textAlign:"right"}}>₹ {(parseFloat(si.charge)*parseInt(si.itemQty)).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><td colSpan={4}><strong>Net Charge</strong></td><td style={{textAlign:"right"}}><strong>₹ {net.toLocaleString("en-IN")}</strong></td></tr>
                  <tr><td colSpan={4}>Advance Paid</td><td style={{textAlign:"right"}}>₹ {parseFloat(advance||0).toLocaleString("en-IN")}</td></tr>
                  <tr className="tm-tfoot-bal">
                    <td colSpan={4}><strong>Balance Due</strong></td>
                    <td style={{textAlign:"right"}}><strong className={balance > 0 ? "tm-bal-due" : "tm-bal-zero"}>₹ {balance.toLocaleString("en-IN")}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            {instrNote && (
              <div className="tm-sum-block tm-sum-block--full">
                <h4 className="tm-sum-heading">Instructions</h4>
                <p className="tm-note-text">{instrNote}</p>
              </div>
            )}
          </div>

          <div className="tm-step-actions">
            <button className="tm-btn tm-btn-secondary" onClick={() => setStep(3)}>← Back</button>
            <button className="tm-btn tm-btn-accent" onClick={handleSubmit}>✓ Confirm &amp; Create Order</button>
          </div>
        </div>
      )}
    </div>
  );
}
