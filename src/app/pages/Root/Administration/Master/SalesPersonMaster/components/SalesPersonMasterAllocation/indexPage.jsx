import { useState, useEffect, useMemo } from "react";
import { PostAPI, GetAPI } from '@/services/apiCall';
import { toast } from 'sonner';
import { useCookies } from 'react-cookie';
import { Package, Store, AlertTriangle, Info, X } from 'lucide-react';
import ListingPage from '@/components/ListingTable/ListingPage';
import SkeletonLoaderTable from '@/components/SkeletonLoaderTable';

/* ─── Helper Components ───────────────────────────────────── */

function SectionBar({ title, sub }) {
  return (
    <div className="flex items-start gap-2.5 border-l-4 border-[#0A6ED1] py-2.5 px-3.5 mb-3.5 rounded-r" style={{color: 'black'}}>
      <div className="w-2 h-2 rounded-full bg-[#0A6ED1] mt-1.5 shrink-0" />
      <div>
        <div className="text-sm font-semibold leading-tight" style={{color: 'black'}}>{title}</div>
        {sub && <div className="text-xs mt-0.5" style={{color: 'black'}}>{sub}</div>}
      </div>
    </div>
  );
}

function FormCard({ icon, title, subtitle, children }) {
  return (
    <div className="rounded-lg border border-gray-200 shadow-sm mb-3.5 overflow-hidden" style={{background: 'white'}}>
      <div className="border-l-4 border-[#0A6ED1] px-6 py-4 border-b border-b-gray-200" style={{backgroundColor: '#d6eaf8'}}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-md">{icon}</div>
          <div>
            <h2 className="text-base font-bold text-[#0376e8]">{title}</h2>
            {subtitle && <p className="text-xs text-[#090100] mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="px-6 py-4">{children}</div>
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
function mapFormToApi(form, incentiveDetails, mode, enteredBy) {
  return {
    assortmentID: form.assortmentID || 0,
    assortmentName: form.assortmentName || "",
    storeName: form.storeName || "",
    enteredBy: enteredBy || 0,
    usedFor: mode === "edit" ? "U" : "I",
    salePersonIncentiveDetails: incentiveDetails.map(d => ({
      storeID: d.storeID || 0,
      storeName: d.storeName || "",
      fromDate: toDDMMYYYY(d.fromDate) || "",
      toDate: toDDMMYYYY(d.toDate) || "",
      incentivePercentage: parseFloat(d.incentivePercentage) || 0,
      isActive: d.isActive === "Y" ? "Y" : "N",
      isTerminated: d.isTerminated === "Y" ? "Y" : "N",
    })),
  };
}

/* ─── Form Component (used inside modal) ─────────────────── */
function SalePersonIncentiveForm({ initialMode, initialData, onClose }) {
  const [cookies] = useCookies(['UserId', 'DefaultStoreId']);
  const [mode, setMode] = useState(initialMode || "create");

  /* Basic Details */
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        assortmentID: initialData.assortmentID || 0,
        assortmentName: initialData.assortmentName || "",
        storeName: initialData.storeName || "",
      };
    }
    return { assortmentID: 0, assortmentName: "", storeName: "" };
  });

  /* Incentive Details */
  const [incentiveDetails, setIncentiveDetails] = useState([]);
  const [showAddDetail, setShowAddDetail] = useState(false);
  const [newDetail, setNewDetail] = useState({
    storeID: "", storeName: "", fromDate: "", toDate: "", incentivePercentage: "",
  });
  const [detailError, setDetailError] = useState("");

  /* Dropdown data */
  const [assortmentsList, setAssortmentsList] = useState([]);
  const [storesList, setStoresList] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  /* Validation */
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const isReadOnly = mode === "view";

  /* Fetch assortments */
  useEffect(() => {
    GetAPI('/api/assortment/GetAllAssortment', '?AssortmentID=0&AssortmentType=S', '', '')
      .then(res => {
        if (res.data && Array.isArray(res.data)) setAssortmentsList(res.data);
      })
      .catch(err => console.error('Failed to fetch assortments:', err));
  }, []);

  /* Fetch stores */
  useEffect(() => {
    GetAPI('/api/StoreMaster/GetAllStoreMaster', '', '', '')
      .then(res => {
        if (res.data && Array.isArray(res.data)) setStoresList(res.data);
      })
      .catch(err => console.error('Failed to fetch stores:', err));
  }, []);

  /* Fetch details for view/edit */
  useEffect(() => {
    if (initialData?.assortmentID && (initialMode === 'view' || initialMode === 'edit')) {
      setLoadingDetails(true);
      GetAPI('/api/SalePersonIncentive/GetSalePersonIncentives', `?AssortmentID=${initialData.assortmentID}`, '', '')
        .then(res => {
          if (res.data) {
            const data = Array.isArray(res.data) ? res.data[0] : res.data;
            if (data?.salePersonIncentiveDetails?.length) {
              setIncentiveDetails(data.salePersonIncentiveDetails.map((d, i) => ({
                id: d.storeID || Date.now() + i,
                storeID: d.storeID || 0,
                storeName: d.storeName || "",
                fromDate: d.fromDate || "",
                toDate: d.toDate || "",
                incentivePercentage: d.incentivePercentage || 0,
                isActive: d.isActive || "N",
                isTerminated: d.isTerminated || "N",
              })));
            }
          }
        })
        .catch(err => console.error('Failed to fetch incentive details:', err))
        .finally(() => setLoadingDetails(false));
    }
  }, [initialData, initialMode]);

  /* Handlers */
  const setField = (field, val) => {
    if (!isReadOnly) setForm(p => ({ ...p, [field]: val }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: "" }));
  };

  const handleAssortmentChange = (assortmentID) => {
    const selected = assortmentsList.find(a => a.assortmentID === Number(assortmentID));
    setForm(p => ({
      ...p,
      assortmentID: Number(assortmentID) || 0,
      assortmentName: selected?.assortmentName || "",
    }));
    if (errors.assortmentID) setErrors(p => ({ ...p, assortmentID: "" }));
  };

  const handleSaveDetail = () => {
    if (!newDetail.storeID) { setDetailError("Please select a store."); return; }
    if (!newDetail.fromDate) { setDetailError("From Date is required."); return; }
    if (!newDetail.incentivePercentage || isNaN(parseFloat(newDetail.incentivePercentage))) {
      setDetailError("Valid incentive percentage is required."); return;
    }
    const store = storesList.find(s => s.storeID === Number(newDetail.storeID));
    setIncentiveDetails(p => [...p, {
      id: Date.now(),
      storeID: Number(newDetail.storeID),
      storeName: store?.storeName || "",
      fromDate: newDetail.fromDate,
      toDate: newDetail.toDate,
      incentivePercentage: parseFloat(newDetail.incentivePercentage),
      isActive: "Y",
      isTerminated: "N",
    }]);
    setNewDetail({ storeID: "", storeName: "", fromDate: "", toDate: "", incentivePercentage: "" });
    setShowAddDetail(false);
    setDetailError("");
  };

  const terminateDetail = (id) => {
    setIncentiveDetails(p => p.map(d => d.id === id ? {
      ...d,
      isTerminated: "Y",
      isActive: "N",
      toDate: new Date().toISOString().split("T")[0],
    } : d));
  };

  const validate = () => {
    const e = {};
    if (!form.assortmentID) e.assortmentID = "Assortment is required";
    // if (!form.storeName) e.storeName = "Store Name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      const payload = mapFormToApi(form, incentiveDetails, mode, cookies.UserId);
      const response = await PostAPI('/api/SalePersonIncentiveRepository/PostSalePersonIncentive', '', payload, '');
      setSaving(false);
      if (response.data && response.data[0] && response.data[0].returnCode === 'Y') {
        toast.success(response.data[0].returnMsg || 'Incentive saved successfully.');
        setMode("view");
        if (onClose) onClose();
      } else {
        const msg = (response.data && response.data[0] && response.data[0].returnMsg) || 'Something went wrong.';
        toast.error(msg);
      }
    } catch (error) {
      setSaving(false);
      console.error('Error saving incentive:', error);
      toast.error(error?.message || 'Failed to save incentive.');
    }
  };

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="h-full flex flex-col" style={{backgroundColor: '#d6eaf8'}}>
      <div className="flex flex-1 overflow-hidden min-h-0">
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">

            {/* Assortment Information */}
            <FormCard icon={<Package className="w-5 h-5 text-[#0A6ED1]" />} title="Assortment Information" subtitle="Select assortment and store for incentive allocation">
              <SectionBar title="Assortment Details" sub="Choose the incentive assortment and store" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{color: 'black'}}>
                    Assortment <span className="text-red-600" style={{color: 'red'}}>*</span>
                  </label>
                  <select
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all appearance-none ${isReadOnly ? ' border-gray-200 cursor-default' :  ' border-gray-300 cursor-pointer'} ${errors.assortmentID ? 'border-red-500' : ''}`}
                    value={form.assortmentID}
                    onChange={e => handleAssortmentChange(e.target.value)}
                    disabled={isReadOnly || mode === 'edit'}>
                    <option value={0}>— Select Assortment —</option>
                    {assortmentsList.map(a => (
                      <option key={a.assortmentID} value={a.assortmentID}>{a.assortmentName}</option>
                    ))}
                  </select>
                  {errors.assortmentID && <p className="text-red-500 text-xs mt-1">{errors.assortmentID}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{color: 'black'}}>Assortment Name</label>
                  <input
                    className="w-full px-3 py-2 text-sm border rounded-md bg-gray-100 border-gray-200 cursor-default"
                    value={form.assortmentName} readOnly placeholder="Auto-filled on selection" />
                </div>
              </div>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
                    Store Name <span className="text-red-600">*</span>
                  </label>
                  <select
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all appearance-none ${isReadOnly ? 'bg-gray-100 border-gray-200 cursor-default' : 'bg-white border-gray-300 cursor-pointer'} ${errors.storeName ? 'border-red-500' : ''}`}
                    value={form.storeName}
                    onChange={e => setField("storeName", e.target.value)}
                    disabled={isReadOnly}>
                    <option value="">— Select Store —</option>
                    {storesList.map(st => (
                      <option key={st.storeID} value={st.storeName}>{st.storeName}</option>
                    ))}
                  </select>
                  {errors.storeName && <p className="text-red-500 text-xs mt-1">{errors.storeName}</p>}
                </div>
              </div> */}
            </FormCard>

            {/* Incentive Details */}
            <FormCard icon={<Store className="w-5 h-5 text-[#0A6ED1]" />} title="Incentive Store Details" subtitle="Store-wise incentive percentage and date range allocation">
              <SectionBar title="Store Incentive Allocations" sub="Manage store-wise incentive percentages and date ranges" />

              {detailError && (
                <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>{detailError}</span>
                </div>
              )}

              {loadingDetails ? (
                <div className="text-center text-sm text-[#6A6D70] py-6">Loading details...</div>
              ) : (
                <>
                  {/* Details Table */}
                  <div className="border border-gray-200 rounded overflow-hidden mb-3">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="" style={{backgroundColor: '#d6eaf8'}}>
                          <th className="text-xs font-semibold text-[#000408] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">#</th>
                          <th className="text-xs font-semibold text-[#000408] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">Store</th>
                          <th className="text-xs font-semibold text-[#000408] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">From Date</th>
                          <th className="text-xs font-semibold text-[#000408] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">To Date</th>
                          <th className="text-xs font-semibold text-[#000408] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">Incentive %</th>
                          <th className="text-xs font-semibold text-[#000408] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">Status</th>
                          {!isReadOnly && <th className="text-xs font-semibold text-[#000408] px-3 py-2 border-b border-gray-200 text-left whitespace-nowrap">Action</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {incentiveDetails.length === 0 ? (
                          <tr><td colSpan={isReadOnly ? 6 : 7} className="text-center py-5 px-3 border-b border-gray-100" style={{color: 'black'}}>No incentive details found</td></tr>
                        ) : incentiveDetails.map((d, i) => {
                          const isActive = d.isActive === "Y" && d.isTerminated !== "Y";
                          return (
                            <tr key={d.id} className={i % 2 === 0 ? '' : ''}>
                              <td className="px-3 py-2 border-b border-gray-100  align-middle" style={{color:'black'}}>{i + 1}</td>
                              <td className="px-3 py-2 border-b border-gray-100  align-middle">
                                <span className={isActive ? 'font-semibold' : 'font-normal'} style={{color: 'black'}}>{d.storeName}</span>
                              </td>
                              <td className="px-3 py-2 border-b border-gray-100  align-middle" style={{color:'black'}}>{d.fromDate}</td>
                              <td className="px-3 py-2 border-b border-gray-100  align-middle" style={{color:'black'}}>
                                {d.toDate || <span className="text-[#6A6D70] italic">Ongoing</span>}
                              </td>
                              <td className="px-3 py-2 border-b border-gray-100 align-middle font-semibold" style={{color:'green'}}>
                                {d.incentivePercentage}%
                              </td>
                              <td className="px-3 py-2 border-b border-gray-100 align-middle">
                                <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${isActive ? 'bg-green-50 text-green-700 border-green-300' : 'bg-gray-100 text-[#000408] border-gray-300'}`}>
                                  {isActive ? "Active" : d.isTerminated === "Y" ? "Terminated" : "Inactive"}
                                </span>
                              </td>
                              {!isReadOnly && (
                                <td className="px-3 py-2 border-b border-gray-100 align-middle">
                                  {isActive && (
                                    <button className="h-7 px-3.5 text-xs rounded bg-red-50 text-red-700 border border-red-200 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => terminateDetail(d.id)}>Terminate</button>
                                  )}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Inline add form */}
                  {showAddDetail && !isReadOnly && (
                    <div className="bg-blue-50/70 border border-blue-300 rounded p-3.5 my-3">
                      <div className="text-sm font-semibold text-[#0A6ED1] mb-3">New Incentive Detail</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-[#00050a] mb-1.5">Store <span className="text-red-600">*</span></label>
                          <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent  cursor-pointer" value={newDetail.storeID}
                            onChange={e => setNewDetail(p => ({ ...p, storeID: e.target.value }))}>
                            <option value="">— Select Store —</option>
                            {storesList.map(st => <option key={st.storeID} value={st.storeID}>{st.storeName}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#00070e] mb-1.5">From Date <span className="text-red-600">*</span></label>
                          <input type="date" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent bg-white" value={newDetail.fromDate}
                            onChange={e => setNewDetail(p => ({ ...p, fromDate: e.target.value }))} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#00060b] mb-1.5">To Date</label>
                          <input type="date" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent bg-white" value={newDetail.toDate}
                            onChange={e => setNewDetail(p => ({ ...p, toDate: e.target.value }))} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-[#00050a] mb-1.5">Incentive % <span className="text-red-600">*</span></label>
                          <input type="number" step="0.01" min="0" max="100" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent bg-white" value={newDetail.incentivePercentage}
                            onChange={e => setNewDetail(p => ({ ...p, incentivePercentage: e.target.value }))}
                            placeholder="e.g. 8.50" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="h-7 px-3.5 text-xs rounded bg-green-50 text-green-700 border border-green-300 cursor-pointer hover:bg-green-100 transition-colors" onClick={handleSaveDetail}>Add Detail</button>
                        <button className="h-7 px-3.5 text-xs rounded bg-white text-[#6A6D70] border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => { setShowAddDetail(false); setDetailError(""); }}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {!isReadOnly && !showAddDetail && (
                    <button className="h-7 px-3.5 text-xs rounded bg-[#f0f3f5] text-[#002951] border border-blue-300 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => { setDetailError(""); setShowAddDetail(true); }}>+ Add Incentive Detail</button>
                  )}
                </>
              )}
            </FormCard>

          </div>

          {/* Footer */}
          <div className=" border-t border-gray-200 px-6 py-2.5 flex justify-end gap-2.5 shrink-0" style={{backgroundColor: '#fff'}}>
            {mode === "view" ? (
              <>
                <button className="h-8 px-4 text-xs rounded bg-white text-[#6A6D70] border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => { setMode("create"); setForm({ assortmentID: 0, assortmentName: "", storeName: "" }); setIncentiveDetails([]); }}>New</button>
                <button className="h-8 px-5 text-sm rounded bg-white text-[#0A6ED1] border border-[#0A6ED1] cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => setMode("edit")}>Edit</button>
                {onClose && <button className="h-8 px-4 text-xs rounded bg-white text-[#6A6D70] border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onClose}>Close</button>}
              </>
            ) : (
              <>
                <button className="h-8 px-4 text-xs rounded bg-white text-[#6A6D70] border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => { if (mode === "edit") setMode("view"); else if (onClose) onClose(); }}>Cancel</button>
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

/* ─── Main Listing Page (default export) ──────────────────── */
export default function SalePersonIncentivePage() {
  const [cookies] = useCookies(['UserId', 'DefaultStoreId']);
  const [incentiveData, setIncentiveData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchIncentiveList = async () => {
    try {
      setIsLoading(true);
      const response = await GetAPI('/api/SalePersonIncentive/GetAllSalePersonIncentives', '', {}, cookies);
      console.log('SalePersonIncentive List API Response:', response.data);
      setIncentiveData(response.data || []);
    } catch (err) {
      console.error('Failed to fetch incentives:', err);
      setError(err?.message || 'Failed to fetch incentives');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncentiveList();
  }, []);

  const columns = useMemo(() => [
    { field: 'assortmentID', header: 'ID', type: 'number', width: '80px' },
    { field: 'assortmentName', header: 'Assortment Name', type: 'link' },
    { field: 'storeName', header: 'Store Name' },
    {
      field: 'status',
      header: 'Status',
      type: 'badge',
      width: '110px',
      badgeMap: {
        Active: { variant: 'success', label: 'Active', dot: true },
        Inactive: { variant: 'warning', label: 'Inactive', dot: true },
      },
    },
  ], []);

  const rowData = useMemo(() => {
    if (!incentiveData) return [];
    return incentiveData.map(item => ({
      ...item,
      id: item.assortmentID,
      status: item.isActive === 'Y' ? 'Active' : 'Inactive',
    }));
  }, [incentiveData]);

  const handleView = (row) => { setSelectedRow(row); setModalMode('view'); setModalOpen(true); };
  const handleEdit = (row) => { setSelectedRow(row); setModalMode('edit'); setModalOpen(true); };

  const handleAdd = () => { setSelectedRow(null); setModalMode('create'); setModalOpen(true); };
  const handleCloseModal = () => { setModalOpen(false); setSelectedRow(null); fetchIncentiveList(); };

  const stats = useMemo(() => [
    { label: 'Total', value: rowData.length, icon: '📋', iconClass: 'blue', filterKey: 'all' },
    { label: 'Active', value: rowData.filter((r) => r.status === 'Active').length, icon: '✅', iconClass: 'green', filterKey: 'active' },
    { label: 'Inactive', value: rowData.filter((r) => r.status === 'Inactive').length, icon: '⏸️', iconClass: 'amber', filterKey: 'inactive' },
  ], [rowData]);

  const filterChips = useMemo(() => [
    { key: 'all', label: 'All Incentives', chipClass: 'lp-chip-blue' },
    { key: 'active', label: 'Active', chipClass: 'lp-chip-green', filterFn: (r) => r.status === 'Active' },
    { key: 'inactive', label: 'Inactive', chipClass: 'lp-chip-amber', filterFn: (r) => r.status === 'Inactive' },
  ], []);

  if (isLoading) return <SkeletonLoaderTable />;
  if (error) return <h3 className="text-center p-6">{error}</h3>;

  return (
    <div className="relative z-40 flex flex-col h-full">
      <ListingPage
        title="Sales Person Incentive Allocation"
        subtitle="Manage assortment-wise store incentive allocations"
        titleIcon="💰"
        rowData={rowData}
        columns={columns}
        rowKey="assortmentID"
        loading={isLoading}
        stats={stats}
        filterChips={filterChips}
        defaultFilter="all"
        searchPlaceholder="Search by assortment and store…"
        searchFields={['assortmentName', 'storeName']}
        defaultSortCol="assortmentID"
        defaultSortDir="desc"
        pageSize={30}
        onView={handleView}
        onEdit={handleEdit}
        primaryAction={{ label: '+ Add Incentive', onClick: handleAdd }}
      />

      {/* Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="fixed inset-0  shadow-2xl w-screen h-screen flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0" style={{backgroundColor: '#fff'}}>
              <h2 className="text-lg font-semibold text-[#0376e8]">
                {modalMode === 'create' ? 'Create New Incentive' : modalMode === 'edit' ? 'Edit Incentive' : 'View Incentive'}
              </h2>
              <button onClick={handleCloseModal} className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="flex-1 min-h-0">
              <SalePersonIncentiveForm
                key={selectedRow?.assortmentID || 'new'}
                initialMode={modalMode}
                initialData={selectedRow}
                onClose={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
