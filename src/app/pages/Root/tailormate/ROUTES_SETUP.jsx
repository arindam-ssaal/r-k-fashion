/**
 * TAILORMATE — Route Setup for POS Integration
 * ─────────────────────────────────────────────
 * Step 1: Copy the entire `tailormate` folder into your project's `src/pages/` folder.
 *         Final path: src/pages/tailormate/
 *
 * Step 2: Wrap your app (or the tailormate section) with <AppProvider>.
 *         Import from: src/pages/tailormate/context/AppContext.jsx
 *
 * Step 3: Add these routes inside your React Router <Routes> block.
 *
 * Step 4: Add the Google Fonts import below to your index.html or main CSS:
 *   <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
 */

// ── IMPORTS ──────────────────────────────────────────────────────────────────
import { AppProvider } from "./context/AppContext";
import NewOrderPage   from "./NewOrderPage/NewOrderPage";
import OrderPage      from "./OrderPage/OrderPage";
import ReportPage     from "./ReportPage/ReportPage";
import TrackerPage    from "./TrackerPage/TrackerPage";

// ── ROUTE DEFINITIONS (paste inside your <Routes>) ───────────────────────────
/*
  <Route path="/tailormate"                element={<Navigate to="/tailormate/orders" replace />} />
  <Route path="/tailormate/new-order"      element={<NewOrderPage />} />
  <Route path="/tailormate/orders"         element={<OrderPage />} />
  <Route path="/tailormate/reports"        element={<ReportPage />} />
  <Route path="/tailormate/tracker"        element={<TrackerPage />} />
*/

// ── EXAMPLE: Wrapping with AppProvider in your layout ────────────────────────
/*
  If you have a layout component for the tailormate section:

  import { AppProvider } from "./tailormate/context/AppContext";

  function TailorMateLayout() {
    return (
      <AppProvider>
        <Outlet />   // React Router outlet, renders child routes
      </AppProvider>
    );
  }

  Then in your router:
  <Route path="/tailormate" element={<TailorMateLayout />}>
    <Route index element={<Navigate to="orders" replace />} />
    <Route path="new-order" element={<NewOrderPage />} />
    <Route path="orders"    element={<OrderPage />} />
    <Route path="reports"   element={<ReportPage />} />
    <Route path="tracker"   element={<TrackerPage />} />
  </Route>
*/

// ── NOTE: OrderPage accepts an optional onNewOrder prop ───────────────────────
// <OrderPage onNewOrder={() => navigate("/tailormate/new-order")} />
// This wires the "+ New Order" button to navigate to the new order page.
