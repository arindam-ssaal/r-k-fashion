import { useState, useEffect } from "react";
import { PostAPI, GetAPI } from '@/services/apiCall';
import { toast } from 'sonner';
import { useCookies } from 'react-cookie';
import { User, Store, BarChart3, Shield, FileText, AlertTriangle, Info } from 'lucide-react';

/* ─── Static Data ─────────────────────────────────────────── */

const ARTICLE_CATEGORIES = [
  { id: 1, code: "ELEC", name: "Electronics" },
  { id: 2, code: "APRL", name: "Apparel & Clothing" },
  { id: 3, code: "GROC", name: "Groceries & FMCG" },
  { id: 4, code: "HOME", name: "Home & Kitchen" },
  { id: 5, code: "SPRT", name: "Sports & Fitness" },
  { id: 6, code: "COSM", name: "Cosmetics & Beauty" },
  { id: 7, code: "JWLY", name: "Jewellery & Accessories" },
  { id: 8, code: "FOOT", name: "Footwear" },
  { id: 9, code: "TOYS", name: "Toys & Games" },
  { id: 10, code: "BOOK", name: "Books & Stationery" },
];

const SIDEBAR_ITEMS = [
  { group: "Administration", items: [
      { label: "Security", sub: [] },
      { label: "Setup", sub: ["Policy", "Organization Policy", "Store Wise Policy", "Discount", "Promotion", "Sales Person Incentive"],
        active: true },
      { label: "Master", sub: ["Sales Person", "Customer", "Article", "Store"], activeSub: "Sales Person" },
    ]
  },
  { group: "Transaction", items: [{ label: "Transaction", sub: [] }] },
  { group: "Reports", items: [{ label: "Reports", sub: [] }] },
  { group: "Utilities", items: [{ label: "Utilities", sub: [] }] },
];

const DEMO_KPI = {
  todaySales: 28500,
  monthlyTarget: 200000,
  monthlyAchievement: 162000,
  ytdTarget: 2000000,
  ytdAchievement: 1540000,
  avgBillValue: 4750,
  todayBills: 6,
  monthlyBills: 87,
};

/* ─── Helper Components ───────────────────────────────────── */
function RadioGroup({ name, value, onChange, readOnly }) {
  return (
    <div className="flex items-center gap-6">
      {["Yes", "No"].map(opt => (
        <label key={opt} className="flex items-center cursor-pointer">
          <input type="radio" name={name} value={opt} checked={value === opt}
            onChange={() => !readOnly && onChange(opt)}
            className={`w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] ${readOnly ? 'cursor-default' : 'cursor-pointer'}`} />
          <span className="ml-2 text-sm text-gray-700">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function SectionBar({ title, sub }) {
  return (
    <div className="flex items-start gap-2.5 bg-[#E8F2FB] border-l-4 border-[#0A6ED1] py-2.5 px-3.5 mb-3.5 rounded-r">
      <div className="w-2 h-2 rounded-full bg-[#0A6ED1] mt-1.5 shrink-0" />
      <div>
        <div className="text-sm font-semibold text-[#0A6ED1] leading-tight">{title}</div>
        {sub && <div className="text-xs text-[#6A6D70] mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function FormCard({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-3.5 overflow-hidden">
      <div className="border-l-4 border-[#0A6ED1] px-6 py-4 border-b border-b-gray-200 bg-[#e6f1fa]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-md">
            {icon}
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0a6ed1]">{title}</h2>
            {subtitle && <p className="text-xs text-[#6A6D70] mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}

function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-[#6A6D70] mt-1.5">
        <span>Achievement: {pct}%</span>
        <span>{pct >= 100 ? "✓ Target Met" : `${100 - pct}% remaining`}</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-400" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/* ─── Format date from yyyy-mm-dd to dd-mm-yyyy ──────────── */
function toDDMMYYYY(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
}

/* ─── Map form data to API schema ─────────────────────────── */
function mapFormToApi(form, storeAssignments, mode, enteredBy) {
  const nameParts = (form.name || "").trim().split(/\s+/);
  return {
    salesPersonID: form.salesPersonID || 0,
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || "",
    mobileNo: form.mobile || "",
    whatsAppNo: form.mobile || "",
    email: form.email || "",
    employeeID: form.empCode || "",
    allocatedRole: form.userId ? Number(form.userId) : 0,
    allocatedUser: form.userId ? Number(form.userId) : 0,
    isActive: form.status === "Yes" ? "Y" : "N",
    enteredBy: enteredBy || 0,
    usedFor: mode === "edit" ? "U" : "I",
    objDetails: storeAssignments.map((s, i) => ({
      salesPersonID: form.salesPersonID || 0,
      storeID: s.id || 0,
      storeCode: "",
      storeName: s.store || "",
      startDate: toDDMMYYYY(s.fromDate) || "",
      endDate: toDDMMYYYY(s.toDate) || "",
      isTransfered: s.status === "Inactive" ? "Y" : "N",
    })),
  };
}

/* ─── Main Component ──────────────────────────────────────── */
export default function SalespersonMaster() {
  const [cookies] = useCookies(['UserId', 'DefaultStoreId']);
  const [mode, setMode] = useState("create"); // create | view | edit
  const [activeTab, setActiveTab] = useState("basic");
  const [sidebarOpen, setSidebarOpen] = useState({ Setup: true, Master: true });

  /* Basic Details */
  const [form, setForm] = useState({
    name: "", code: "", mobile: "", email: "",
    empCode: "", userId: "", status: "Yes",
  });

  /* Store Assignments */
  const [storeAssignments, setStoreAssignments] = useState([]);
  const [showAddStore, setShowAddStore] = useState(false);
  const [newStore, setNewStore] = useState({ store: "", fromDate: "", toDate: "" });
  const [storeError, setStoreError] = useState("");
  const [storesList, setStoresList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  /* Fetch users from API */
  useEffect(() => {
    GetAPI('/api/User/GetAllUser', '', '', '')
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setUsersList(res.data);
        }
      })
      .catch(err => console.error('Failed to fetch users:', err));
  }, []);

  /* Fetch stores from API */
  useEffect(() => {
    GetAPI('/api/StoreMaster/GetAllStoreMaster', '', '', '')
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setStoresList(res.data);
        }
      })
      .catch(err => console.error('Failed to fetch stores:', err));
  }, []);

  /* POS Permissions */
  const [perms, setPerms] = useState({
    billingAllowed: "Yes",
    discountType: "Percentage",
    discountLimit: "10",
    refundAuth: "Yes",
    cashHandling: "Yes",
    priceOverride: "No",
    voidTransaction: "No",
    cashDrawerAccess: "Yes",
  });

  /* Article Assignment */
  const [selectedArticles, setSelectedArticles] = useState([1, 2, 3]);
  const [articleSearch, setArticleSearch] = useState("");

  /* Validation */
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isReadOnly = mode === "view";
  const kpi = DEMO_KPI;

  /* Handlers */
  const setField = (field, val) => {
    if (!isReadOnly) setForm(p => ({ ...p, [field]: val }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: "" }));
  };

  const setPerm = (field, val) => { if (!isReadOnly) setPerms(p => ({ ...p, [field]: val })); };

  const toggleArticle = (id) => {
    if (isReadOnly) return;
    setSelectedArticles(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  const toggleAllArticles = () => {
    if (isReadOnly) return;
    const filtered = ARTICLE_CATEGORIES.filter(a => a.name.toLowerCase().includes(articleSearch.toLowerCase()));
    const allSel = filtered.every(a => selectedArticles.includes(a.id));
    if (allSel) setSelectedArticles(p => p.filter(id => !filtered.find(a => a.id === id)));
    else setSelectedArticles(p => [...new Set([...p, ...filtered.map(a => a.id)])]);
  };

  const hasActiveStore = storeAssignments.some(s => s.status === "Active");

  const handleAddStoreClick = () => {
    setStoreError("");
    //! Change this logic if multiple active store assignments are allowed in the future
    if (hasActiveStore) {
      setStoreError("An active store assignment already exists. Please inactivate the current store assignment before adding a new one.");
      return;
    }
    setShowAddStore(true);
  };

  const handleSaveStore = () => {
    if (!newStore.store) { setStoreError("Please select a store."); return; }
    if (!newStore.fromDate) { setStoreError("From Date is required."); return; }
    setStoreAssignments(p => [...p, { id: Date.now(), ...newStore, status: "Active" }]);
    setNewStore({ store: "", fromDate: "", toDate: "" });
    setShowAddStore(false);
    setStoreError("");
  };

  const inactivateStore = (id) => {
    setStoreAssignments(p => p.map(s => s.id === id ? { ...s, status: "Inactive", toDate: new Date().toISOString().split("T")[0] } : s));
  };

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Name is required";
    if (!form.code) e.code = "Code is required";
    if (!form.mobile) e.mobile = "Mobile is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) { setActiveTab("basic"); return; }
    try {
      setSaving(true);
      const payload = mapFormToApi(form, storeAssignments, mode, cookies.UserId);
      const response = await PostAPI('/api/SalePersonRep/PostSalePerson', '', payload, '');
      setSaving(false);
      if (response.data && response.data[0] && response.data[0].returnCode === 'Y') {
        toast.success(response.data[0].returnMsg || 'Salesperson saved successfully.');
        setMode("view");
      } else {
        const msg = (response.data && response.data[0] && response.data[0].returnMsg) || 'Something went wrong.';
        toast.error(msg);
      }
    } catch (error) {
      setSaving(false);
      console.error('Error saving salesperson:', error);
      toast.error(error?.message || 'Failed to save salesperson.');
    }
  };

  const fmtINR = (n) => "₹" + n.toLocaleString("en-IN");
  const pct = (a, t) => t > 0 ? Math.min(100, Math.round((a / t) * 100)) : 0;

  const filteredArticles = ARTICLE_CATEGORIES.filter(a =>
    a.name.toLowerCase().includes(articleSearch.toLowerCase()) ||
    a.code.toLowerCase().includes(articleSearch.toLowerCase())
  );

  /* ── Tab: Basic Details ─────────────────────────────────── */
  const TabBasic = () => (
    <>
      <FormCard icon={<User className="w-5 h-5 text-[#0A6ED1]" />} title="Salesperson Information" subtitle="Core identification and contact details">
        <SectionBar title="Identity Details" sub="Name, code and employee reference" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
              Salesperson Code <span className="text-red-600">*</span>
            </label>
            <input
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all ${isReadOnly ? 'bg-gray-100 border-gray-200 cursor-default' : 'bg-white'} ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
              value={form.code} onChange={e => setField("code", e.target.value)}
              placeholder="e.g. SP001" readOnly={isReadOnly} />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
              Salesperson Name <span className="text-red-600">*</span>
            </label>
            <input
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all ${isReadOnly ? 'bg-gray-100 border-gray-200 cursor-default' : 'bg-white'} ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              value={form.name} onChange={e => setField("name", e.target.value)}
              placeholder="Enter full name" readOnly={isReadOnly} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">Employee Code</label>
            <input
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all ${isReadOnly ? 'bg-gray-100 border-gray-200 cursor-default' : 'bg-white border-gray-300'}`}
              value={form.empCode}
              onChange={e => setField("empCode", e.target.value)}
              placeholder="HR Employee Code" readOnly={isReadOnly} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">Assigned User ID</label>
            <select
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all appearance-none ${isReadOnly ? 'bg-gray-100 border-gray-200 cursor-default' : 'bg-white border-gray-300 cursor-pointer'}`}
              value={form.userId}
              onChange={e => setField("userId", e.target.value)} disabled={isReadOnly}>
              <option value="">— Select User —</option>
              {usersList.map(u => <option key={u.userID} value={u.userID}>{u.userName}</option>)}
            </select>
          </div>
        </div>

        <hr className="border-t border-gray-200 my-4" />
        <SectionBar title="Contact Details" sub="Mobile number and email address" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
              Mobile Number <span className="text-red-600">*</span>
            </label>
            <input
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all ${isReadOnly ? 'bg-gray-100 border-gray-200 cursor-default' : 'bg-white'} ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
              value={form.mobile} onChange={e => setField("mobile", e.target.value)}
              placeholder="+91 98765 43210" readOnly={isReadOnly} />
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">Email Address</label>
            <input
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all ${isReadOnly ? 'bg-gray-100 border-gray-200 cursor-default' : 'bg-white border-gray-300'}`}
              type="email" value={form.email}
              onChange={e => setField("email", e.target.value)}
              placeholder="salesperson@company.com" readOnly={isReadOnly} />
          </div>
        </div>

        <hr className="border-t border-gray-200 my-4" />
        <SectionBar title="Status" sub="Current active status of the salesperson record" />
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#6A6D70] mb-2">Status</label>
          <RadioGroup name="sp-status" value={form.status}
            onChange={v => setField("status", v)} readOnly={isReadOnly} />
        </div>
      </FormCard>

      {/* Store Assignment */}
      <FormCard icon={<Store className="w-5 h-5 text-[#0A6ED1]" />} title="Store Assignment" subtitle="Allocate and manage store assignments for this salesperson">
        <SectionBar title="Store Allocation" sub="Only one store can be active at any point in time" />

        {storeError && (
          <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <span>{storeError}</span>
          </div>
        )}

        {hasActiveStore && (
          <div className="flex items-center gap-2 text-xs text-[#0A6ED1] bg-[#E8F2FB] border border-blue-300 rounded p-2 mb-3">
            <Info className="w-4 h-4 text-[#0A6ED1] shrink-0" />
            <span>To assign a new store, first inactivate the currently active store assignment below.</span>
          </div>
        )}

        {/* Assignments table */}
        <div className="border border-gray-200 rounded overflow-hidden mb-3">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-xs font-semibold text-[#6A6D70] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">#</th>
                <th className="text-xs font-semibold text-[#6A6D70] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">Store</th>
                <th className="text-xs font-semibold text-[#6A6D70] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">From Date</th>
                <th className="text-xs font-semibold text-[#6A6D70] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">To Date</th>
                <th className="text-xs font-semibold text-[#6A6D70] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">Status</th>
                {!isReadOnly && <th className="text-xs font-semibold text-[#6A6D70] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">Action</th>}
              </tr>
            </thead>
            <tbody>
              {storeAssignments.length === 0 ? (
                <tr><td colSpan={isReadOnly ? 5 : 6} className="text-center text-[#6A6D70] py-5 px-3 border-b border-gray-100">No store assignments found</td></tr>
              ) : storeAssignments.map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-3 py-2 border-b border-gray-100 text-gray-700 align-middle">{i + 1}</td>
                  <td className="px-3 py-2 border-b border-gray-100 text-gray-700 align-middle">
                    <span className={s.status === "Active" ? 'font-semibold' : 'font-normal'}>{s.store}</span>
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100 text-gray-700 align-middle">{s.fromDate}</td>
                  <td className="px-3 py-2 border-b border-gray-100 text-gray-700 align-middle">
                    {s.toDate || <span className="text-[#6A6D70] italic">Ongoing</span>}
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100 align-middle">
                    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${s.status === "Active" ? 'bg-green-50 text-green-700 border-green-300' : 'bg-gray-100 text-[#6A6D70] border-gray-300'}`}>
                      {s.status}
                    </span>
                  </td>
                  {!isReadOnly && (
                    <td className="px-3 py-2 border-b border-gray-100 align-middle">
                      {s.status === "Active" && (
                        <button className="h-7 px-3.5 text-xs rounded bg-red-50 text-red-700 border border-red-200 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => inactivateStore(s.id)}>Inactivate</button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inline add form */}
        {showAddStore && !isReadOnly && (
          <div className="bg-blue-50/70 border border-blue-300 rounded p-3.5 my-3">
            <div className="text-sm font-semibold text-[#0A6ED1] mb-3">New Store Assignment</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">Store <span className="text-red-600">*</span></label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent bg-white cursor-pointer" value={newStore.store}
                  onChange={e => setNewStore(p => ({ ...p, store: e.target.value }))}>
                  <option value="">— Select Store —</option>
                  {storesList.map(st => <option key={st.storeID} value={st.storeName}>{st.storeName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">From Date <span className="text-red-600">*</span></label>
                <input type="date" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent bg-white" value={newStore.fromDate}
                  onChange={e => setNewStore(p => ({ ...p, fromDate: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">To Date</label>
                <input type="date" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent bg-white" value={newStore.toDate}
                  onChange={e => setNewStore(p => ({ ...p, toDate: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="h-7 px-3.5 text-xs rounded bg-green-50 text-green-700 border border-green-300 cursor-pointer hover:bg-green-100 transition-colors" onClick={handleSaveStore}>Add Assignment</button>
              <button className="h-7 px-3.5 text-xs rounded bg-white text-[#6A6D70] border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => { setShowAddStore(false); setStoreError(""); }}>Cancel</button>
            </div>
          </div>
        )}

        {!isReadOnly && !showAddStore && (
          <button className="h-7 px-3.5 text-xs rounded bg-[#E8F2FB] text-[#0A6ED1] border border-blue-300 cursor-pointer hover:bg-blue-100 transition-colors" onClick={handleAddStoreClick}>+ Add Store Assignment</button>
        )}
      </FormCard>
    </>
  );

  /* ── Tab: KPI ───────────────────────────────────────────── */
  const TabKPI = () => (
    <FormCard icon={<BarChart3 className="w-5 h-5 text-[#0A6ED1]" />} title="Performance KPI Dashboard" subtitle="Real-time performance metrics and achievement tracking">
      <SectionBar title="Today's Performance" sub={`As of ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-white border border-gray-200 border-t-[3px] border-t-[#0A6ED1] rounded p-4">
          <div className="text-2xl font-light text-[#1B4F8A] leading-tight">{fmtINR(kpi.todaySales)}</div>
          <div className="text-xs text-[#6A6D70] mt-1">Today's Total Sales</div>
          <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8F2FB] text-[#0A6ED1] mt-1.5">{kpi.todayBills} bills today</span>
        </div>
        <div className="bg-white border border-gray-200 border-t-[3px] border-t-[#1B4F8A] rounded p-4">
          <div className="text-2xl font-light text-[#1B4F8A] leading-tight">{kpi.todayBills}</div>
          <div className="text-xs text-[#6A6D70] mt-1">Bills Processed Today</div>
          <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8EDF5] text-[#1B4F8A] mt-1.5">Avg {fmtINR(Math.round(kpi.todaySales / kpi.todayBills))} / bill</span>
        </div>
        <div className="bg-white border border-gray-200 border-t-[3px] border-t-[#107E3E] rounded p-4">
          <div className="text-2xl font-light text-[#1B4F8A] leading-tight">{fmtINR(kpi.avgBillValue)}</div>
          <div className="text-xs text-[#6A6D70] mt-1">Average Bill Value (Month)</div>
          <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-[#107E3E] mt-1.5">{kpi.monthlyBills} bills this month</span>
        </div>
      </div>

      <hr className="border-t border-gray-200 my-4" />
      <SectionBar title="Monthly Target vs Achievement" sub="Current month performance against assigned target" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="bg-white border border-gray-200 border-l-4 border-l-[#0A6ED1] rounded p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-[#6A6D70]">Monthly Target</div>
              <div className="text-xl font-light text-[#1B4F8A] mt-0.5">{fmtINR(kpi.monthlyTarget)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#6A6D70]">Achieved</div>
              <div className="text-xl font-light text-[#107E3E] mt-0.5">{fmtINR(kpi.monthlyAchievement)}</div>
            </div>
          </div>
          <ProgressBar value={kpi.monthlyAchievement} max={kpi.monthlyTarget} color="#0A6ED1" />
          <div className="text-xs text-[#6A6D70] mt-1">Shortfall: {fmtINR(Math.max(0, kpi.monthlyTarget - kpi.monthlyAchievement))}</div>
        </div>
        <div className="bg-white border border-gray-200 border-l-4 border-l-[#107E3E] rounded p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-[#6A6D70]">YTD Target</div>
              <div className="text-xl font-light text-[#1B4F8A] mt-0.5">{fmtINR(kpi.ytdTarget)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#6A6D70]">YTD Achieved</div>
              <div className="text-xl font-light text-[#107E3E] mt-0.5">{fmtINR(kpi.ytdAchievement)}</div>
            </div>
          </div>
          <ProgressBar value={kpi.ytdAchievement} max={kpi.ytdTarget} color="#107E3E" />
          <div className="text-xs text-[#6A6D70] mt-1">YTD Achievement: {pct(kpi.ytdAchievement, kpi.ytdTarget)}%</div>
        </div>
      </div>

      <hr className="border-t border-gray-200 my-4" />
      <SectionBar title="Summary Metrics" sub="Consolidated performance overview" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-white border border-gray-200 border-t-[3px] border-t-[#E65100] rounded p-4">
          <div className="text-2xl font-light text-[#1B4F8A] leading-tight">{pct(kpi.monthlyAchievement, kpi.monthlyTarget)}%</div>
          <div className="text-xs text-[#6A6D70] mt-1">Monthly Achievement %</div>
          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1.5 ${pct(kpi.monthlyAchievement, kpi.monthlyTarget) >= 100 ? 'bg-green-50 text-[#107E3E]' : 'bg-orange-50 text-[#E65100]'}`}>
            {pct(kpi.monthlyAchievement, kpi.monthlyTarget) >= 100 ? "Target Achieved" : "In Progress"}
          </span>
        </div>
        <div className="bg-white border border-gray-200 border-t-[3px] border-t-[#6A1B9A] rounded p-4">
          <div className="text-2xl font-light text-[#1B4F8A] leading-tight">{pct(kpi.ytdAchievement, kpi.ytdTarget)}%</div>
          <div className="text-xs text-[#6A6D70] mt-1">YTD Achievement %</div>
          <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-[#6A1B9A] mt-1.5">Year to Date</span>
        </div>
        <div className="bg-white border border-gray-200 border-t-[3px] border-t-[#00838F] rounded p-4">
          <div className="text-2xl font-light text-[#1B4F8A] leading-tight">{kpi.monthlyBills}</div>
          <div className="text-xs text-[#6A6D70] mt-1">Total Bills This Month</div>
          <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-[#00838F] mt-1.5">Processed</span>
        </div>
      </div>
    </FormCard>
  );

  /* ── Tab: POS Permissions ───────────────────────────────── */
  const TabPermissions = () => (
    <>
      <FormCard icon={<Shield className="w-5 h-5 text-[#0A6ED1]" />} title="POS Permissions & Authorization" subtitle="Define what this salesperson is allowed to do at the Point of Sale">
        <SectionBar title="Billing Permissions" sub="Control billing and transaction capabilities" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-2">Billing Allowed</label>
            <RadioGroup name="billing" value={perms.billingAllowed} onChange={v => setPerm("billingAllowed", v)} readOnly={isReadOnly} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-2">Cash Handling Permission</label>
            <RadioGroup name="cash" value={perms.cashHandling} onChange={v => setPerm("cashHandling", v)} readOnly={isReadOnly} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-2">Cash Drawer Access</label>
            <RadioGroup name="cashdrawer" value={perms.cashDrawerAccess} onChange={v => setPerm("cashDrawerAccess", v)} readOnly={isReadOnly} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-2">Void Transaction Allowed</label>
            <RadioGroup name="void" value={perms.voidTransaction} onChange={v => setPerm("voidTransaction", v)} readOnly={isReadOnly} />
          </div>
        </div>

        <hr className="border-t border-gray-200 my-4" />
        <SectionBar title="Discount Approval Limit" sub="Define the maximum discount this salesperson can authorize" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">Discount Limit Type</label>
            <select
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all appearance-none ${isReadOnly ? 'bg-gray-100 border-gray-200 cursor-default' : 'bg-white border-gray-300 cursor-pointer'}`}
              value={perms.discountType}
              onChange={e => setPerm("discountType", e.target.value)} disabled={isReadOnly}>
              <option>Percentage</option>
              <option>Amount</option>
              <option>Both</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
              {perms.discountType === "Amount" ? "Max Discount Amount (₹)" : "Max Discount (%)"}
            </label>
            <input
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all ${isReadOnly ? 'bg-gray-100 border-gray-200 cursor-default' : 'bg-white border-gray-300'}`}
              type="number" value={perms.discountLimit}
              onChange={e => setPerm("discountLimit", e.target.value)}
              placeholder={perms.discountType === "Amount" ? "e.g. 5000" : "e.g. 10"}
              readOnly={isReadOnly} />
          </div>
          {perms.discountType === "Both" && (
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">Max Discount Amount (₹)</label>
              <input
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all ${isReadOnly ? 'bg-gray-100 border-gray-200 cursor-default' : 'bg-white border-gray-300'}`}
                type="number" placeholder="e.g. 5000" readOnly={isReadOnly} />
            </div>
          )}
        </div>

        <hr className="border-t border-gray-200 my-4" />
        <SectionBar title="Returns & Price Override" sub="Manage authorization for refunds, returns and price changes" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-2">Refund / Return Authorization</label>
            <RadioGroup name="refund" value={perms.refundAuth} onChange={v => setPerm("refundAuth", v)} readOnly={isReadOnly} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-2">Price Override Rights</label>
            <RadioGroup name="price" value={perms.priceOverride} onChange={v => setPerm("priceOverride", v)} readOnly={isReadOnly} />
          </div>
        </div>
      </FormCard>

      {/* Article Assignment */}
      <FormCard icon={<FileText className="w-5 h-5 text-[#0A6ED1]" />} title="Article Category Assignment" subtitle="Define which article categories this salesperson is authorized to sell">
        <SectionBar title="Assigned Article Categories" sub="Select the product categories applicable for this salesperson" />

        <div className="flex items-center justify-between mb-3 gap-3">
          <input
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent bg-white max-w-[280px] w-full"
            placeholder="Search article category..."
            value={articleSearch} onChange={e => setArticleSearch(e.target.value)} />
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6A6D70]">{selectedArticles.length} of {ARTICLE_CATEGORIES.length} selected</span>
            {!isReadOnly && (
              <button className="h-7 px-3.5 text-xs rounded bg-[#E8F2FB] text-[#0A6ED1] border border-blue-300 cursor-pointer hover:bg-blue-100 transition-colors" onClick={toggleAllArticles}>
                {filteredArticles.every(a => selectedArticles.includes(a.id)) ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>
        </div>

        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {!isReadOnly && <th className="text-xs font-semibold text-[#6A6D70] px-3 py-2 border-b border-gray-200 text-left w-10"></th>}
                <th className="text-xs font-semibold text-[#6A6D70] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">Code</th>
                <th className="text-xs font-semibold text-[#6A6D70] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">Category Name</th>
                <th className="text-xs font-semibold text-[#6A6D70] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">Assigned</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-[#6A6D70] py-5 px-3 border-b border-gray-100">No categories found</td></tr>
              ) : filteredArticles.map((a, i) => {
                const sel = selectedArticles.includes(a.id);
                return (
                  <tr key={a.id}
                    className={`${sel ? 'bg-sky-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}
                    onClick={() => toggleArticle(a.id)}>
                    {!isReadOnly && (
                      <td className="px-3 py-2 border-b border-gray-100 align-middle">
                        <input type="checkbox" className="w-3.5 h-3.5 accent-[#0A6ED1] cursor-pointer" checked={sel}
                          onChange={() => toggleArticle(a.id)} onClick={e => e.stopPropagation()} />
                      </td>
                    )}
                    <td className="px-3 py-2 border-b border-gray-100 text-gray-700 align-middle">
                      <span className="font-mono text-xs text-[#0A6ED1]">{a.code}</span>
                    </td>
                    <td className={`px-3 py-2 border-b border-gray-100 text-gray-700 align-middle ${sel ? 'font-semibold' : 'font-normal'}`}>{a.name}</td>
                    <td className="px-3 py-2 border-b border-gray-100 align-middle">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${sel ? 'bg-green-50 text-green-700 border-green-300' : 'bg-gray-100 text-[#6A6D70] border-gray-300'}`}>
                        {sel ? "Assigned" : "Not Assigned"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FormCard>
    </>
  );

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Page Header */}
          <div className="bg-white border-b border-gray-200 px-6 pt-3 shrink-0">
            <div className="flex gap-0">
              {[
                { id: "basic", label: "Basic Details" },
                { id: "kpi", label: "KPI & Performance" },
                { id: "permissions", label: "POS Permissions" },
              ].map(t => (
                <div key={t.id}
                  className={`text-sm px-5 py-2 cursor-pointer whitespace-nowrap transition-all -mb-px ${activeTab === t.id ? 'text-[#0A6ED1] font-semibold border-b-[3px] border-[#0A6ED1]' : 'text-[#6A6D70] font-normal border-b-[3px] border-transparent'}`}
                  onClick={() => setActiveTab(t.id)}>
                  {t.label}
                </div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeTab === "basic" && TabBasic()}
            {activeTab === "kpi" && TabKPI()}
            {activeTab === "permissions" && TabPermissions()}
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 px-6 py-2.5 flex justify-end gap-2.5 shrink-0">
            {mode === "view" ? (
              <>
                <button className="h-8 px-4 text-xs rounded bg-white text-[#6A6D70] border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => { setMode("create"); setForm({ name:"",code:"",mobile:"",email:"",empCode:"",userId:"",status:"Yes" }); setActiveTab("basic"); }}>New</button>
                <button className="h-8 px-5 text-sm rounded bg-white text-[#0A6ED1] border border-[#0A6ED1] cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => setMode("edit")}>Edit</button>
              </>
            ) : (
              <>
                <button className="h-8 px-4 text-xs rounded bg-white text-[#6A6D70] border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => { if (mode === "edit") setMode("view"); }}>Cancel</button>
                <button className={`h-8 px-5 text-sm rounded bg-[#0A6ED1] text-white border border-[#0A6ED1] cursor-pointer hover:bg-[#0958a8] transition-colors ${saving ? 'opacity-60' : ''}`} onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : mode === "create" ? "Save & Create" : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
