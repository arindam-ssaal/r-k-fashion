import { createContext, useContext, useState, useCallback } from "react";

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);

  const addOrder = useCallback((order) => setOrders(p => [order, ...p]), []);

  const updateStatus = useCallback((id, status) =>
    setOrders(p => p.map(o => o.id === id ? { ...o, status } : o)), []);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <Ctx.Provider value={{ orders, addOrder, updateStatus, toast, showToast }}>
      {children}
      {toast && (
        <div className={`tm-toast tm-toast--${toast.type}`}>
          <span className="tm-toast-icon">{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.msg}
        </div>
      )}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);
