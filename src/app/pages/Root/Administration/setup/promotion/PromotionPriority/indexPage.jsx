import { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import { GetAPI, PostAPI } from "@/services/apiCall";

// ─── ChevronDown Icon ──────────────────────────────────────────────────────────
const ChevronDownIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// ─── Setup Priority Modal ──────────────────────────────────────────────────────
const SetupPriorityModal = ({ storeId, onClose, cookies }) => {
  const [allPromotions, setAllPromotions] = useState([]);
  const [priorityValues, setPriorityValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await GetAPI("/api/Promotion/GetPromotionForPriority", "", { StoreID: storeId }, cookies);
        const data = Array.isArray(res.data) ? res.data : [];
        setAllPromotions(data);
        const init = {};
        // data.forEach((p) => { init[p.PromotionID] = ""; });
        data.forEach((p) => {
          init[p.PromotionID] = p.priority !== null && p.priority !== undefined ? String(p.priority) : "";
        });
        setPriorityValues(init);
      } catch (err) {
        console.error("Failed to fetch all promotions:", err);
        setError("Failed to load promotions.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [cookies]);

  const handleSave = async () => {
    const payload = allPromotions
      .filter((p) => priorityValues[p.PromotionID] !== "" && priorityValues[p.PromotionID] !== undefined)
      .map((p) => ({
        column1: String(p.PromotionID),
        column2: String(storeId),
        column3: String(priorityValues[p.PromotionID]),
      }));

    if (payload.length === 0) {
      setError("Please enter at least one priority value.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await PostAPI("/api/PromotionRep/UpdatePromotionPriority", "", payload, cookies);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose(true);
      }, 1500);
    } catch (err) {
      console.error("Failed to update priority:", err);
      setError("Failed to save priorities. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className=" rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" style={{ backgroundColor: "#fff" }}>
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "black" }}>Set up Priority</h2>
            <p className="text-xs  mt-0.5" style={{ color: "black" }}>Assign priority values to promotions for this store</p>
          </div>
          <button
            onClick={() => onClose(false)}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : allPromotions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No promotions found.</p>
          ) : (
            <div className="space-y-3">
              {allPromotions.map((promo) => (
                <div
                  key={promo.PromotionID}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "black" }}>
                      {promo.PromotionName}
                    </p>
                    {promo.details && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: "black" }}>{promo.details}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <label className="text-xs font-medium" style={{ color: "black" }}>Priority</label>
                    <input
                      type="number"
                      min="1"
                      value={priorityValues[promo.PromotionID] ?? ""}
                      onChange={(e) =>
                        setPriorityValues((prev) => ({
                          ...prev,
                          [promo.PromotionID]: e.target.value,
                        }))
                      }
                      placeholder="—"
                      className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                      style={{ color: "black" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && (
            <p className="text-xs text-red-500 mt-3 text-center">{error}</p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3" style={{ backgroundColor: "#fff" }}>
          {saveSuccess && (
            <span className="text-sm text-emerald-600 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Saved successfully
            </span>
          )}
          <button
            onClick={() => onClose(false)}
            className="text-sm px-4 py-2 rounded-lg border bg-red-500 hover:bg-red-400 transition-colors" style={{color: '#fff'}}> 
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className={`text-sm px-5 py-2 rounded-lg font-semibold transition-all ${
              saving || loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200"
            }`}
          >
            {saving ? "Saving…" : "Save Priorities"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const PromotionPriority = () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [promotions, setPromotions] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingPromos, setLoadingPromos] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [cookies] = useCookies(["UserId", "DefaultStoreId"]);

  // ── Fetch Stores ───────────────────────────────────────────────────────────
  const fetchStores = useCallback(async () => {
    setLoadingStores(true);
    try {
      const response = await GetAPI("/api/StoreMaster/GetAllStoreMaster", "", {}, cookies);
      const data = response.data;
      if (Array.isArray(data)) {
        setStores(
          data.map((s) => ({
            id: String(s.storeID),
            name: s.storeName,
            code: s.storeCode,
            status: s.isActive?.trim() === "Y" ? "active" : "inactive",
          }))
        );
      } else {
        setStores([]);
      }
    } catch (err) {
      console.error("Failed to fetch stores:", err);
      setStores([]);
    } finally {
      setLoadingStores(false);
    }
  }, [cookies]);

  // ── Fetch Promotions for Priority (by Store) ───────────────────────────────
  const fetchPromotions = useCallback(async (storeId) => {
    if (!storeId) return;
    setLoadingPromos(true);
    try {
      const res = await GetAPI("/api/Promotion/GetPromotionForPriority", "", { StoreID: storeId }, cookies);
      const data = Array.isArray(res.data) ? res.data : [];
      const sorted = [...data].sort((a, b) => (b.priority ?? -Infinity) - (a.priority ?? -Infinity));
      setPromotions(sorted);
    } catch (err) {
      console.error("Failed to fetch promotions for priority:", err);
      setPromotions([]);
    } finally {
      setLoadingPromos(false);
    }
  }, [cookies]);

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  useEffect(() => {
    if (selectedStoreId) fetchPromotions(selectedStoreId);
    else setPromotions([]);
  }, [selectedStoreId, fetchPromotions]);

  const handleModalClose = (refresh) => {
    setShowModal(false);
    if (refresh && selectedStoreId) fetchPromotions(selectedStoreId);
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedStore = stores.find((s) => s.id === selectedStoreId);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#d6eaf8" }}>
      {/* Setup Priority Modal */}
      {showModal && (
        <SetupPriorityModal
          storeId={selectedStoreId}
          onClose={handleModalClose}
          cookies={cookies}
        />
      )}

      {/* ── Header ── */}
      <div className=" border-b border-gray-100 px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{color: 'black'}}>Promotion Priority</h1>
            <p className="text-sm mt-0.5" style={{color: 'black'}}>
              Manage promotion priorities per store
            </p>
          </div>

          {/* Set up Priority Button */}
          <button
            onClick={() => setShowModal(true)}
            disabled={!selectedStoreId}
            className={`
              text-sm px-5 py-2 rounded-lg font-semibold transition-all
              ${selectedStoreId
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"}
            `}
          >
            Set up Priority
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* ── Store Selector Card ── */}
        <div className=" rounded-2xl border border-gray-100 shadow-sm p-6" style={{background: '#fff'}}>
          <label className="block text-sm font-semibold mb-3" style={{color: 'black'}}>
            Select Store
          </label>

          <div className="relative w-full sm:w-80">
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              disabled={loadingStores}
              className="w-full appearance-none border border-gray-200 text-sm
                         rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-300
                         focus:border-indigo-400 transition-all disabled:opacity-50 cursor-pointer"
              style={{color: 'black'}}
            >
              <option value="">
                {loadingStores ? "Loading stores…" : "— Choose a store —"}
              </option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}  ({store.code})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronDownIcon />
            </div>
          </div>

          {selectedStore && (
            <p className="mt-3 text-xs" style={{color: 'black'}}>
              Store Code: <span className="font-mono font-semibold " style={{color: 'black'}}>{selectedStore.code}</span>
              &nbsp;·&nbsp; Status: <span className=" font-medium" style={{color: 'black'}}>Active</span>
            </p>
          )}
        </div>

        {/* ── Active Promotions List ── */}
        {selectedStoreId && (
          <div className=" rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{background: '#fff'}}>
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold" style={{color: 'black'}}>Active Promotions</h2>
                {!loadingPromos && (
                  <p className="text-xs mt-0.5" style={{color: 'black'}}>{promotions.length} promotion{promotions.length !== 1 ? "s" : ""} found</p>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {loadingPromos ? (
                /* Skeleton Loader */
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>
              ) : promotions.length === 0 ? (
                /* Empty State */
                <div className="py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-500">No active promotions</p>
                  <p className="text-xs text-gray-400 mt-1">This store has no promotions to display.</p>
                </div>
              ) : (
                /* Promotion Rows */
                <div className="space-y-2">
                  {/* Column Header */}
                  <div className="flex items-center gap-4 px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    <div className="w-8 text-center">#</div>
                    <div className="flex-1">Promotion Name</div>
                    <div className="w-24 text-center">Priority</div>
                  </div>
                  {promotions.map((promo, index) => (
                    <div
                      key={promo.PromotionID}
                      className="flex items-center gap-4 px-5 py-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                    >
                      {/* Index Badge */}
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-indigo-600">{index + 1}</span>
                      </div>
                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{color: 'black'}}>{promo.PromotionName}</p>
                      </div>
                      {/* Priority */}
                      <div className="w-24 flex justify-center">
                        {promo.priority !== null && promo.priority !== undefined ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
                            {promo.priority}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Not set</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── No Store Selected Placeholder ── */}
        {!selectedStoreId && !loadingStores && (
          <div className=" rounded-2xl border border-dashed border-gray-200 py-20 text-center" style={{background: '#fff'}}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background: '#d6eaf8'}}>
              <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-sm font-semibold" style={{color: 'black'}}>Select a store to manage promotions</p>
            <p className="text-xs mt-1" style={{color: 'black'}}>Choose an active store from the dropdown above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionPriority;
