# Store Master - API Integration Documentation

> **File:** `indexPage.jsx`  
> **Purpose:** This document explains how the Store Master page was integrated with real backend APIs, replacing the earlier mock/hardcoded data.

---

## Table of Contents

1. [Overview - What Was Done](#1-overview)
2. [APIs Used](#2-apis-used)
3. [Key Concept: Two Mapper Functions](#3-key-concept-two-mapper-functions)
4. [Feature 1: Store List (GET All)](#4-feature-1-store-list)
5. [Feature 2: View & Edit Store (GET by ID)](#5-feature-2-view--edit-store)
6. [Feature 3: Create & Update Store (POST)](#6-feature-3-create--update-store)
7. [How GetAPI and PostAPI Work](#7-how-getapi-and-postapi-work)
8. [Field Mapping Reference Table](#8-field-mapping-reference-table)
9. [Complete Data Flow Diagrams](#9-complete-data-flow-diagrams)
10. [Common Patterns Used](#10-common-patterns-used)

---

## 1. Overview

The page originally used hardcoded `INITIAL_STORES` array. We replaced that with 3 API integrations:

| Action | API | Method |
|--------|-----|--------|
| Load store list | `GetAllStoreMaster` | GET |
| View/Edit store detail | `GetStoreMaster?StoreID=` | GET |
| Create/Update store | `PostStoreMaster` | POST |

**Key principle:** The UI uses its own **local field names** (e.g., `code`, `name`, `city`), but the API uses **different field names** (e.g., `storeCode`, `storeName`, `billCity`). So we use **mapper functions** to convert between the two.

---

## 2. APIs Used

### API 1: Get All Stores (List)
```
GET /api/StoreMaster/GetAllStoreMaster
```
- **Returns:** Array of store objects
- **Used for:** Populating the store list table
- **Response:** `[{ storeID, storeCode, storeName, ... }, ...]`

### API 2: Get Single Store (Detail)
```
GET /api/StoreMaster/GetStoreMaster?StoreID=1
```
- **Returns:** Single store object with full details (including objPayMode, objPettyCash, objSeries)
- **Used for:** Opening View Modal and Edit Modal with complete data

### API 3: Create/Update Store (Save)
```
POST /api/StoreMasterRep/PostStoreMaster
```
- **Accepts:** Store object as JSON body
- **Key field:** `usedFor` → `"I"` for Insert (create), `"U"` for Update (edit)
- **Returns:** `[{ returnCode: "Y"/"N", returnMsg: "..." }]`

---

## 3. Key Concept: Two Mapper Functions

This is the most important concept to understand. The UI and API use different field names, so we need two functions:

### 3a. `mapApiStoreToLocal(s)` — API → UI

**When is it used?** Every time we RECEIVE data from the API.

```
API Response                    →  mapApiStoreToLocal()  →  Local UI State
{ storeID: 1,                     converts to              { id: 1,
  storeCode: "DBMSG",            ──────────────►            code: "DBMSG",
  storeName: "DB-MARSHAGHAI",                                name: "DB-MARSHAGHAI",
  billCity: "Kolkata",                                       city: "Kolkata",
  objPayMode: [...] }                                        mop: [...] }
```

**Why?** Because the table columns, form fields, filters all use the local names like `s.code`, `s.name`, `s.city`. If we used API names directly, we'd have to change the entire UI code.

**How it handles missing data:**
```js
// The || "" pattern means: if the API returns null/undefined, use empty string
code: s.storeCode || "",
name: s.storeName || "",
city: s.billCity || "",
```

**How it handles nested arrays:**
```js
// Array.isArray() check prevents crash if API returns null instead of []
mop: Array.isArray(s.objPayMode) ? s.objPayMode.map(m => ({
  name: m.paymentModeName || "",      // API field → local field
  code: String(m.paymentModeID || ""), // Convert number to string for form input
  crossStore: m.isCrossStoreUsage === "Y",  // Convert "Y"/"N" → true/false
  discontinued: m.discontinued === "Y",
})) : [],
```

### 3b. `mapLocalStoreToApi(form, mode)` — UI → API

**When is it used?** Every time we SEND data to the API (Create or Edit).

```
Local UI Form                   →  mapLocalStoreToApi()  →  API Payload
{ id: 1,                           converts to              { storeID: 1,
  code: "DBMSG",                  ──────────────►             storeCode: "DBMSG",
  name: "DB-MARSHAGHAI",                                      storeName: "DB-MARSHAGHAI",
  city: "Kolkata",                                            billCity: "Kolkata",
  mop: [...] }                                                usedFor: "U",
                                                              objPayMode: [...] }
```

**The `mode` parameter controls two things:**

```js
// 1. storeID — 0 for new store, actual ID for edit
storeID: mode === "edit" ? (form.id || 0) : 0,

// 2. usedFor — "I" = Insert (create), "U" = Update (edit)
usedFor: mode === "edit" ? "U" : "I",
```

**How it handles boolean → string conversion (reverse of mapApiStoreToLocal):**
```js
// UI uses true/false, API uses "Y"/"N"
isActive: form.inactive ? "N" : "Y",
isCrossStoreUsage: m.crossStore ? "Y" : "N",
discontinued: m.discontinued ? "Y" : "N",
```

---

## 4. Feature 1: Store List

### What happens when the page loads:

```
Page Mounts
    │
    ▼
useEffect(() => { fetchStores(); }, []);    ← runs once on mount
    │
    ▼
fetchStores() called
    │
    ├── setLoading(true)                     ← show loading state
    │
    ├── GetAPI('/api/StoreMaster/GetAllStoreMaster', '', {}, '')
    │       │
    │       ▼
    │   API returns: [{ storeID: 1, storeCode: "DBMSG", ... }, ...]
    │       │
    │       ▼
    ├── response.data.map(mapApiStoreToLocal)  ← convert EACH item
    │       │
    │       ▼
    │   Mapped: [{ id: 1, code: "DBMSG", name: "DB-MARSHAGHAI", ... }, ...]
    │       │
    │       ▼
    ├── setStores(mappedData)                ← store in React state
    │
    └── setLoading(false)                    ← hide loading state
```

### The actual code:

```jsx
// Runs once when component mounts
useEffect(() => {
  fetchStores();
}, []);

const fetchStores = async () => {
  try {
    setLoading(true);

    // Call the API
    const response = await GetAPI('/api/StoreMaster/GetAllStoreMaster', '', {}, '');

    // Check if response has valid data
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      // Map EACH store from API format to local format
      setStores(response.data.map(mapApiStoreToLocal));
    }

    setLoading(false);
  } catch (error) {
    console.error('Error fetching stores:', error);
    setLoading(false);  // always stop loading even on error
  }
};
```

### Null-safe filtering (important!)

Since API data might have empty/missing fields, all `.includes()` calls were wrapped with `|| ""`:

```jsx
// BEFORE (would crash if s.code is null):
s.code.toLowerCase().includes(q)

// AFTER (safe — if s.code is null, uses empty string):
(s.code || "").toLowerCase().includes(q)
```

---

## 5. Feature 2: View & Edit Store

### Why fetch by ID separately?

The list API (`GetAllStoreMaster`) returns basic fields for the table. But when you open View or Edit, you need **full details** including MOP, Petty Cash, Document Series etc. So we fetch from `GetStoreMaster?StoreID=` which returns everything.

### Two helper functions:

```jsx
// Step 1: Fetch raw data from API and map it
const fetchStoreById = async (storeId) => {
  try {
    const response = await GetAPI(
      '/api/StoreMaster/GetStoreMaster',
      `?StoreID=${storeId}`,   // ← query string appended to path
      {},
      ''
    );
    if (response.data) {
      return mapApiStoreToLocal(response.data);  // ← map to local format
    }
    return null;
  } catch (error) {
    console.error('Error fetching store detail:', error);
    return null;
  }
};

// Step 2: Fetch detail, then open modal
const openStoreModal = async (mode, storeId) => {
  setDetailLoading(true);                        // ← show loading overlay
  const detail = await fetchStoreById(storeId);  // ← fetch from API
  setDetailLoading(false);                       // ← hide loading overlay
  if (detail) {
    setModal({ mode, store: detail });           // ← open modal with data
  } else {
    addToast('error', 'Error', 'Failed to fetch store details.');
  }
};
```

### How it's connected to the UI:

```jsx
// Table row click → opens View modal
<tr onClick={() => openStoreModal("view", s.id)}>

// View button in row actions
<button onClick={() => openStoreModal("view", s.id)}>👁</button>

// Edit button in row actions
<button onClick={() => openStoreModal("edit", s.id)}>✏️</button>

// Edit button inside ViewModal header
onEdit={store => openStoreModal("edit", store.id)}
```

### Flow diagram:

```
User clicks row/button
    │
    ▼
openStoreModal("view", 5)       ← mode="view", storeId=5
    │
    ├── setDetailLoading(true)   ← shows "Loading store details..." overlay
    │
    ├── fetchStoreById(5)
    │       │
    │       ▼
    │   GET /api/StoreMaster/GetStoreMaster?StoreID=5
    │       │
    │       ▼
    │   mapApiStoreToLocal(response.data)
    │       │
    │       ▼
    │   returns { id: 5, code: "023", name: "DB-ESPLANADE", mop: [...], ... }
    │
    ├── setDetailLoading(false)  ← hides loading overlay
    │
    └── setModal({ mode: "view", store: detail })  ← opens ViewModal
```

---

## 6. Feature 3: Create & Update Store

### The save flow:

```
User fills form in StoreModal → clicks "Create Store" or "Save Changes"
    │
    ▼
StoreModal's internal handleSave()
    │
    ├── validate() — checks required fields (code, name, startDate)
    │       │
    │       ├── If invalid → show error, switch to "store" tab, STOP
    │       │
    │       └── If valid → continue ▼
    │
    └── onSave(formData, mode)   ← calls parent's handleSave with mode
            │
            ▼
App's handleSave(store, mode)
    │
    ├── setSaving(true)          ← show "Saving store..." overlay
    │
    ├── mapLocalStoreToApi(store, mode)  ← convert form → API payload
    │       │
    │       ▼
    │   Creates payload like:
    │   {
    │     storeID: 0,            ← 0 for create, actual ID for edit
    │     storeCode: "NEWSTORE",
    │     storeName: "My Store",
    │     usedFor: "I",          ← "I" for create, "U" for edit
    │     objPayMode: [...],
    │     ...
    │   }
    │
    ├── PostAPI('/api/StoreMasterRep/PostStoreMaster', '', payload, '')
    │       │
    │       ▼
    │   API returns: [{ returnCode: "Y", returnMsg: "Store Created" }]
    │
    ├── Check returnCode
    │       │
    │       ├── "Y" → Success!
    │       │     ├── addToast("success", ...)
    │       │     ├── setModal(null)     ← close modal
    │       │     └── fetchStores()      ← refresh list from API
    │       │
    │       └── Not "Y" → Failed
    │             └── addToast("error", returnMsg)
    │
    └── setSaving(false)         ← hide saving overlay
```

### The actual code:

```jsx
const handleSave = async (store, mode) => {
  try {
    setSaving(true);

    // Convert local form data to API payload
    const payload = mapLocalStoreToApi(store, mode);

    // Send to API
    const response = await PostAPI('/api/StoreMasterRep/PostStoreMaster', '', payload, '');

    setSaving(false);

    // Check response
    if (response.data && response.data[0] && response.data[0].returnCode === 'Y') {
      // SUCCESS
      addToast("success",
        mode === "edit" ? "Store Updated" : "Store Created",
        response.data[0].returnMsg || `${store.name} saved successfully.`
      );
      setModal(null);     // close modal
      fetchStores();      // refresh list from API
    } else {
      // API returned error
      const msg = (response.data && response.data[0] && response.data[0].returnMsg)
                  || 'Something went wrong.';
      addToast("error", "Save Failed", msg);
    }
  } catch (error) {
    setSaving(false);
    console.error('Error saving store:', error);
    addToast("error", "Error", error?.message || 'Failed to save store.');
  }
};
```

### How mode passes through:

```
StoreModal (knows mode = "create" or "edit")
    │
    └── handleSave() inside StoreModal:
            onSave({ ...form }, mode)   ← passes mode to parent
                │
                ▼
        App's handleSave(store, mode)   ← receives mode
                │
                └── mapLocalStoreToApi(store, mode)
                        │
                        ├── mode === "create" → storeID: 0, usedFor: "I"
                        └── mode === "edit"   → storeID: form.id, usedFor: "U"
```

---

## 7. How GetAPI and PostAPI Work

These are imported from `@/services/apiCall.js`:

```jsx
import { PostAPI, GetAPI } from '@/services/apiCall';
```

### GetAPI signature:
```js
GetAPI(path, type, PData, PCookies)
```
- **path:** API endpoint, e.g., `'/api/StoreMaster/GetAllStoreMaster'`
- **type:** Query string suffix, e.g., `'?StoreID=1'` or `''`
- **PData:** Request params object (passed as axios params), e.g., `{}`
- **PCookies:** Cookie data (not used currently, pass `''`)

The function concatenates `path + type` and makes an axios GET request.

### PostAPI signature:
```js
PostAPI(path, type, PData, PCookies)
```
- **path:** API endpoint, e.g., `'/api/StoreMasterRep/PostStoreMaster'`
- **type:** Query string suffix, usually `''`
- **PData:** Request body (JSON object), this is the payload
- **PCookies:** Cookie data (not used currently, pass `''`)

### Example calls in our code:

```js
// GET list — no query params needed
await GetAPI('/api/StoreMaster/GetAllStoreMaster', '', {}, '');

// GET by ID — StoreID in query string
await GetAPI('/api/StoreMaster/GetStoreMaster', '?StoreID=5', {}, '');

// POST save — payload in body
await PostAPI('/api/StoreMasterRep/PostStoreMaster', '', payload, '');
```

---

## 8. Field Mapping Reference Table

### Main Store Fields

| Local (UI) Field | API Field | Notes |
|---|---|---|
| `id` | `storeID` | Number, 0 for new |
| `code` | `storeCode` | String |
| `name` | `storeName` | String |
| `startDate` | `startDate` | "DD-MM-YYYY" format |
| `closeDate` | `closeDate` | Empty if still active |
| `storeSize` | `storeSize` | Number |
| `type` | `storeTypeName` | String |
| `category` | `storeCategoryName` | String |
| `operation` | `operationTypeName` | String |
| `city` | `billCity` | String |
| `state` | `billStateName` | String |
| `status` | `isActive` | "Y"/"N"/" " → "Active"/"Inactive" |
| `warehouse` | `defaultWarehouseName` | String |
| `saleWarehouse` | `defaultSaleWHName` | String |
| `returnWarehouse` | `defaultReturnWHName` | String |
| `priceList` | `priceListName` | String |
| `factor` | `factor` | String |
| `billAddress` | `billAddress` | String |
| `shipAddress` | `shipAddress` | String |
| `postalCode` | `billPostalCode` | String |
| `contactPerson` | `contactPerson` | String |
| `contactNumber` | `contactNumber` | String |
| `email` | `email` | String |
| `gstin` | `gstin` | String |
| — | `usedFor` | "I" = Insert, "U" = Update (only in POST) |

### Nested Array: MOP (objPayMode)

| Local (UI) | API Field | Notes |
|---|---|---|
| `mop[].name` | `objPayMode[].paymentModeName` | |
| `mop[].code` | `objPayMode[].paymentModeID` | Number↔String |
| `mop[].crossStore` | `objPayMode[].isCrossStoreUsage` | Boolean↔"Y"/"N" |
| `mop[].ledger` | `objPayMode[].ledgerName` | |
| `mop[].controlAccount` | `objPayMode[].subLedgerName` | |
| `mop[].discontinued` | `objPayMode[].discontinued` | Boolean↔"Y"/"N" |

### Nested Array: Petty Cash (objPettyCash)

| Local (UI) | API Field | Notes |
|---|---|---|
| `pettyCash[].head` | `objPettyCash[].pettyCashName` | |
| `pettyCash[].limit` | `objPettyCash[].limit` | String↔Number |
| `pettyCash[].type` | `objPettyCash[].modeOfOperation` | Full word↔First char |
| `pettyCash[].ledger` | `objPettyCash[].ledgerName` | |
| `pettyCash[].subLedger` | `objPettyCash[].subLedgerName` | |
| `pettyCash[].discontinued` | `objPettyCash[].discontinued` | Boolean↔"Y"/"N" |

### Nested Array: Document Series (objSeries)

| Local (UI) | API Field | Notes |
|---|---|---|
| `docSeries[].txType` | `objSeries[].transactionType` | String↔Number |
| `docSeries[].seriesName` | `objSeries[].seriesName` | |
| `docSeries[].prefix` | `objSeries[].prefix` | |
| `docSeries[].digits` | `objSeries[].noOfDigit` | String↔Number |
| `docSeries[].suffix` | `objSeries[].suffix` | |
| `docSeries[].discontinued` | `objSeries[].discontinued` | Boolean↔"Y"/"N" |

---

## 9. Complete Data Flow Diagrams

### Full Page Lifecycle:

```
┌─────────────────────────────────────────────────────────────┐
│                    PAGE LOADS                                 │
│                       │                                      │
│              useEffect → fetchStores()                       │
│                       │                                      │
│         GET /api/StoreMaster/GetAllStoreMaster                │
│                       │                                      │
│              .map(mapApiStoreToLocal)                         │
│                       │                                      │
│              setStores([...])                                 │
│                       │                                      │
│              TABLE RENDERS WITH DATA                          │
└─────────────────────────────────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ View 👁  │  │ Edit ✏️  │  │ + New    │
    └────┬─────┘  └────┬─────┘  └────┬─────┘
         │             │             │
         ▼             ▼             │
    openStoreModal  openStoreModal   │
    ("view", id)    ("edit", id)     │
         │             │             │
         ▼             ▼             │
    fetchStoreById fetchStoreById    │
    (GET by ID)    (GET by ID)       │
         │             │             │
         ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ ViewModal│  │StoreModal│  │StoreModal│
    │ (read-   │  │ (edit)   │  │ (create) │
    │  only)   │  │          │  │          │
    └──────────┘  └────┬─────┘  └────┬─────┘
                       │             │
                       ▼             ▼
                  handleSave()  handleSave()
                  mode="edit"   mode="create"
                       │             │
                       ▼             ▼
                 mapLocalStoreToApi(form, mode)
                       │             │
                       │   usedFor:"U"  usedFor:"I"
                       ▼             ▼
                  POST /api/StoreMasterRep/PostStoreMaster
                       │
                       ▼
                 returnCode === "Y" ?
                  ├── Yes → toast success, close modal, fetchStores()
                  └── No  → toast error message
```

---

## 10. Common Patterns Used

### Pattern 1: Null-safe access with `|| ""`
```js
// If API returns null or undefined, fallback to empty string
(s.code || "").toLowerCase()
```

### Pattern 2: Array.isArray() guard
```js
// API might return null instead of [], this prevents .map() crash
Array.isArray(s.objPayMode) ? s.objPayMode.map(...) : []
```

### Pattern 3: Boolean ↔ "Y"/"N" conversion
```js
// API to UI:  "Y" → true
crossStore: m.isCrossStoreUsage === "Y"

// UI to API:  true → "Y"
isCrossStoreUsage: m.crossStore ? "Y" : "N"
```

### Pattern 4: Loading states
```js
const [loading, setLoading] = useState(false);      // list loading
const [detailLoading, setDetailLoading] = useState(false);  // detail fetch
const [saving, setSaving] = useState(false);         // save operation

// Pattern: always set false in both success and error paths
try {
  setLoading(true);
  // ... api call ...
  setLoading(false);
} catch (error) {
  setLoading(false);  // ← don't forget this!
}
```

### Pattern 5: Refresh after save
```js
// After successful save, don't update local state manually.
// Instead, re-fetch the full list from API to ensure data is in sync.
fetchStores();
```

### Pattern 6: Toast notifications for user feedback
```js
addToast("success", "Title", "Detail message");  // green toast
addToast("error", "Title", "Error message");      // red toast
```

---

## Quick Summary

| What | Where in Code | Function |
|------|--------------|----------|
| API→UI mapping | `mapApiStoreToLocal()` | Converts API response to form/table format |
| UI→API mapping | `mapLocalStoreToApi()` | Converts form data to API payload |
| Load list | `fetchStores()` | GET all + map + setState |
| Load detail | `fetchStoreById()` | GET by ID + map + return |
| Open modal | `openStoreModal()` | fetchById → open modal |
| Save store | `handleSave()` | map → POST → toast → refresh |
