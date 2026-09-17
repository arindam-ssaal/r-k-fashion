# Child to Parent Data Passing Guide

## Problem

You have a **child component** like `PosOrder` with local state:

```jsx
const [allowOrderModification, setAllowOrderModification] = useState('N');
const [orderValidityDays, setOrderValidityDays] = useState(0);
const [allowPartialDelivery, setAllowPartialDelivery] = useState('N');
const [advancePaymentMandatory, setAdvancePaymentMandatory] = useState('N');
```

You need to **send this data to the parent** (`OrganizationPolicy2/indexPage.jsx`) so it can call a POST API with all the collected data.

Below are **4 methods** — from simplest to most scalable.

---

## Method 1: Callback Function (Simplest & Recommended)

> Pass a function from parent to child. Child calls it whenever data changes.

### Step 1 — Parent creates a state + callback

```jsx
// OrganizationPolicy2/indexPage.jsx
const [posOrderData, setPosOrderData] = useState({
  allowOrderModification: 'N',
  orderValidityDays: 0,
  allowPartialDelivery: 'N',
  advancePaymentMandatory: 'N',
});

// This function will be passed to the child
const handlePosOrderChange = (data) => {
  setPosOrderData(data);
};

// Pass it as a prop
<PosOrder onDataChange={handlePosOrderChange} />
```

### Step 2 — Child receives the callback and calls it

```jsx
// PosOrder/indexPage.jsx
const PosOrder = ({ onDataChange }) => {
  const [allowOrderModification, setAllowOrderModification] = useState('N');
  const [orderValidityDays, setOrderValidityDays] = useState(0);
  const [allowPartialDelivery, setAllowPartialDelivery] = useState('N');
  const [advancePaymentMandatory, setAdvancePaymentMandatory] = useState('N');

  // Whenever any field changes, send ALL data to parent
  useEffect(() => {
    onDataChange({
      allowOrderModification,
      orderValidityDays,
      allowPartialDelivery,
      advancePaymentMandatory,
    });
  }, [allowOrderModification, orderValidityDays, allowPartialDelivery, advancePaymentMandatory]);

  // ... rest of JSX stays the same
};
```

### Step 3 — Parent uses the data in POST API

```jsx
// OrganizationPolicy2/indexPage.jsx
const handleSave = async () => {
  const payload = {
    ...posOrderData,
    // add other tab data here too
  };
  const response = await PostAPI('/api/OrganizationPolicy/Save', '', payload, cookies);
  console.log(response);
};
```

### Flow Diagram

```
Child (PosOrder)          Parent (OrganizationPolicy2)
─────────────────         ──────────────────────────────
User types/clicks
  ↓
setState runs
  ↓
useEffect fires
  ↓
onDataChange(data) ──→  handlePosOrderChange(data)
                           ↓
                         setPosOrderData(data)
                           ↓
                         handleSave() → PostAPI(payload)
```

---

## Method 2: Lift State Up (Move State to Parent)

> Remove state from child entirely. Parent owns the state, child just renders it.

### Step 1 — Parent owns ALL the state

```jsx
// OrganizationPolicy2/indexPage.jsx
const [posOrderData, setPosOrderData] = useState({
  allowOrderModification: 'N',
  orderValidityDays: 0,
  allowPartialDelivery: 'N',
  advancePaymentMandatory: 'N',
});

const handlePosOrderFieldChange = (fieldName, value) => {
  setPosOrderData(prev => ({ ...prev, [fieldName]: value }));
};

<PosOrder
  data={posOrderData}
  onFieldChange={handlePosOrderFieldChange}
/>
```

### Step 2 — Child becomes a "dumb" display component

```jsx
// PosOrder/indexPage.jsx
const PosOrder = ({ data, onFieldChange }) => {
  // NO useState here! Data comes from props

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
      {/* ... header same as before ... */}

      {/* Example: Allow Order Modification */}
      <input
        type="radio"
        name="allowOrderModification"
        value="Y"
        checked={data.allowOrderModification === 'Y'}
        onChange={(e) => onFieldChange('allowOrderModification', e.target.value)}
      />

      {/* Example: Order Validity Days */}
      <input
        type="number"
        value={data.orderValidityDays}
        onChange={(e) => onFieldChange('orderValidityDays', e.target.value)}
      />

      {/* ... same pattern for other fields ... */}
    </div>
  );
};
```

### Step 3 — Parent already has data, just call API

```jsx
const handleSave = async () => {
  const response = await PostAPI('/api/OrganizationPolicy/Save', '', posOrderData, cookies);
};
```

### When to Use This

- When **parent needs real-time access** to child data (e.g., validation before save)
- When **multiple children share the same data**
- This is the official React-recommended pattern

---

## Method 3: useRef + useImperativeHandle (On-Demand Fetch)

> Parent asks child "give me your data" only when needed (e.g., on Save click).

### Step 1 — Parent creates a ref

```jsx
// OrganizationPolicy2/indexPage.jsx
import { useRef } from 'react';

const posOrderRef = useRef();

// When Save is clicked, ASK the child for its current data
const handleSave = async () => {
  const posOrderData = posOrderRef.current.getData();

  const payload = { ...posOrderData };
  const response = await PostAPI('/api/OrganizationPolicy/Save', '', payload, cookies);
};

<PosOrder ref={posOrderRef} />
```

### Step 2 — Child exposes a getData function

```jsx
// PosOrder/indexPage.jsx
import React, { useState, forwardRef, useImperativeHandle } from 'react';

const PosOrder = forwardRef((props, ref) => {
  const [allowOrderModification, setAllowOrderModification] = useState('N');
  const [orderValidityDays, setOrderValidityDays] = useState(0);
  const [allowPartialDelivery, setAllowPartialDelivery] = useState('N');
  const [advancePaymentMandatory, setAdvancePaymentMandatory] = useState('N');

  // Expose getData to parent via ref
  useImperativeHandle(ref, () => ({
    getData: () => ({
      allowOrderModification,
      orderValidityDays,
      allowPartialDelivery,
      advancePaymentMandatory,
    }),
    // You can also expose a setData for pre-filling from API response
    setData: (data) => {
      setAllowOrderModification(data.allowOrderModification || 'N');
      setOrderValidityDays(data.orderValidityDays || 0);
      setAllowPartialDelivery(data.allowPartialDelivery || 'N');
      setAdvancePaymentMandatory(data.advancePaymentMandatory || 'N');
    },
  }));

  // ... rest of JSX stays exactly the same as your current code
  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
      {/* ... everything unchanged ... */}
    </div>
  );
});

export default PosOrder;
```

### Complete Parent Example with Multiple Tabs

```jsx
// OrganizationPolicy2/indexPage.jsx
const posOrderRef = useRef();
const creditNoteRef = useRef();
const goodsReceiptRef = useRef();

const handleSave = async () => {
  // Collect data from ALL child tabs at once
  const posOrderData = posOrderRef.current.getData();
  const creditNoteData = creditNoteRef.current.getData();
  const goodsReceiptData = goodsReceiptRef.current.getData();

  const fullPayload = {
    ...posOrderData,
    ...creditNoteData,
    ...goodsReceiptData,
  };

  const response = await PostAPI('/api/OrganizationPolicy/Save', '', fullPayload, cookies);
};

// In JSX:
<PosOrder ref={posOrderRef} />
<CreditNote ref={creditNoteRef} />
<GoodsReciept ref={goodsReceiptRef} />
```

### When to Use This

- When you have **many child tabs** and don't want to manage all their state in the parent
- When you only need child data **at a specific moment** (like Save button click)
- When you want the child to **keep its own state** (less re-renders)
- **Best fit for your OrganizationPolicy2 page** with multiple tabs

---

## Method 4: Zustand Global Store (For Complex Apps)

> Use a shared store — any component can read/write without prop drilling.

### Step 1 — Create a store

```jsx
// store/useOrganizationPolicyStore.js
import { create } from 'zustand';

const useOrganizationPolicyStore = create((set, get) => ({
  // POS Order fields
  posOrder: {
    allowOrderModification: 'N',
    orderValidityDays: 0,
    allowPartialDelivery: 'N',
    advancePaymentMandatory: 'N',
  },

  // Update a single POS Order field
  setPosOrderField: (field, value) =>
    set((state) => ({
      posOrder: { ...state.posOrder, [field]: value },
    })),

  // Set entire POS Order data (e.g., from GET API)
  setPosOrder: (data) => set({ posOrder: data }),

  // Get all data for POST API
  getAllData: () => {
    const state = get();
    return {
      ...state.posOrder,
      // ...state.creditNote,  // add other sections
    };
  },

  // Reset
  resetAll: () =>
    set({
      posOrder: {
        allowOrderModification: 'N',
        orderValidityDays: 0,
        allowPartialDelivery: 'N',
        advancePaymentMandatory: 'N',
      },
    }),
}));

export default useOrganizationPolicyStore;
```

### Step 2 — Child reads/writes directly from store

```jsx
// PosOrder/indexPage.jsx
import useOrganizationPolicyStore from '@/store/useOrganizationPolicyStore';

const PosOrder = () => {
  // No props needed! Read directly from store
  const { posOrder, setPosOrderField } = useOrganizationPolicyStore();

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
      {/* Example field */}
      <input
        type="radio"
        name="allowOrderModification"
        value="Y"
        checked={posOrder.allowOrderModification === 'Y'}
        onChange={(e) => setPosOrderField('allowOrderModification', e.target.value)}
      />

      <input
        type="number"
        value={posOrder.orderValidityDays}
        onChange={(e) => setPosOrderField('orderValidityDays', e.target.value)}
      />
      {/* ... */}
    </div>
  );
};
```

### Step 3 — Parent calls API using store

```jsx
// OrganizationPolicy2/indexPage.jsx
import useOrganizationPolicyStore from '@/store/useOrganizationPolicyStore';

const PromotionForAssortment = () => {
  const getAllData = useOrganizationPolicyStore((state) => state.getAllData);

  const handleSave = async () => {
    const payload = getAllData();
    const response = await PostAPI('/api/OrganizationPolicy/Save', '', payload, cookies);
  };

  // No need to pass any props to children!
  <PosOrder />
  <CreditNote />
};
```

### When to Use This

- When **many deeply nested components** need the same data
- When passing props through 3+ levels becomes messy
- Your project already uses Zustand (`useAuth.ts`, `useSidebar.ts`) so this fits naturally

---

## Quick Comparison Table

| Method | Complexity | Child Keeps Own State? | Best For |
|--------|-----------|----------------------|----------|
| **1. Callback** | ⭐ Easy | Yes (syncs via useEffect) | Simple parent-child |
| **2. Lift State** | ⭐ Easy | No (parent owns it) | Shared data, validation |
| **3. useRef** | ⭐⭐ Medium | Yes | **Multiple tabs like yours** |
| **4. Zustand** | ⭐⭐ Medium | No (store owns it) | Large/complex apps |

---

## My Recommendation for Your Project

**Use Method 3 (useRef + useImperativeHandle)** because:

1. You have **5 tabs** (General, POSBill, CreditNote, GoodsReceipt, PosOrder) — each manages its own state
2. You only need the data **when the user clicks Save**
3. Each child keeps its own `useState` — **minimal changes to existing code**
4. You just add `forwardRef` + `useImperativeHandle` to each child
5. Parent collects all data at save time with `ref.current.getData()`

This keeps your current code structure almost untouched while giving the parent full access to all child data when needed.

---

## Real-World Example: Building a Complex Payload with Validation

Your actual payload looks like this — it has **simple fields, computed strings, transformed arrays, and nested objects**. Here's how to handle all of it using **Method 3 (useRef)**.

### Your Actual Payload Structure

```jsx
const formData = {
  assortmentID: 0,
  assortmentName: assormentName,
  description: "",
  typeOfAssortment: selectedAssortmentType,
  assortmentType: "P",
  enteredBy: getCookieValue('UserId') || 0,
  usedFor: "I",
  store: getCookieValue('DefaultStoreId') || 0,
  isActive: inActive === true ? 'Y' : 'N',
  assortmentModel: assormentModel,
  itemGroup: itemGroupString,            // computed from selectedGroups
  brandCode: brandCodeString,            // computed from selectedAssortmentBrands
  brandName: brandNameString,            // computed from selectedAssortmentBrands
  promotion: assortmentItemPromotion || "",
  fromMRP: fromMrp || 0,
  toMRP: toMrp || 0,
  assortmentDetail: assortmentDetail,    // transformed from rowData
  assortmentProperty: assortmentProperty,
};
```

### Key Insight: Let the CHILD build its own part of the payload

Don't make the parent transform child data. Each child should return **API-ready data** from `getData()`.

### Step 1 — Child builds and validates its own payload chunk

```jsx
// PosOrder/indexPage.jsx
import React, { useState, forwardRef, useImperativeHandle } from 'react';

const PosOrder = forwardRef((props, ref) => {
  const [allowOrderModification, setAllowOrderModification] = useState('N');
  const [orderValidityDays, setOrderValidityDays] = useState(0);
  const [allowPartialDelivery, setAllowPartialDelivery] = useState('N');
  const [advancePaymentMandatory, setAdvancePaymentMandatory] = useState('N');

  useImperativeHandle(ref, () => ({
    // Returns API-ready data
    getData: () => ({
      allowOrderModification,
      orderValidityDays: Number(orderValidityDays),  // ensure correct type
      allowPartialDelivery,
      advancePaymentMandatory,
    }),

    // Validation — returns { isValid, errors }
    validate: () => {
      const errors = [];
      if (orderValidityDays <= 0) {
        errors.push('Order Validity Days must be greater than 0');
      }
      return { isValid: errors.length === 0, errors };
    },

    // Pre-fill from GET API response
    setData: (data) => {
      setAllowOrderModification(data.allowOrderModification || 'N');
      setOrderValidityDays(data.orderValidityDays || 0);
      setAllowPartialDelivery(data.allowPartialDelivery || 'N');
      setAdvancePaymentMandatory(data.advancePaymentMandatory || 'N');
    },
  }));

  return (
    // ... your existing JSX unchanged ...
  );
});

export default PosOrder;
```

### Step 2 — A child with complex data transformation (like your Assortment tab)

```jsx
// Example: AssortmentDetails child component
const AssortmentDetails = forwardRef((props, ref) => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedAssortmentBrands, setSelectedAssortmentBrands] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [assortmentItemPromotion, setAssortmentItemPromotion] = useState('');
  const [fromMrp, setFromMrp] = useState('');
  const [toMrp, setToMrp] = useState('');

  useImperativeHandle(ref, () => ({
    getData: () => {
      // ✅ All transformations happen HERE inside the child
      const itemGroupString = selectedGroups.map(g => g.value).join(',');
      const brandCodeString = selectedAssortmentBrands.map(b => b.value).join(',');
      const brandNameString = selectedAssortmentBrands.map(b => b.label).join(',');

      const assortmentDetail = rowData.map((item, index) => ({
        assortmentID: 0,
        itemCode: item.ItemCode || "",
        itemName: item.ItemName || "",
        tableID: item.IsIncluded === true ? 1 : 2,
        lineNum: index + 1,
        barcode: item.barCode || "",
        group: String(item.itemGroup || ""),
      }));

      return {
        itemGroup: itemGroupString,
        brandCode: brandCodeString,
        brandName: brandNameString,
        promotion: assortmentItemPromotion || "",
        fromMRP: fromMrp || 0,
        toMRP: toMrp || 0,
        assortmentDetail,
        assortmentProperty: selectedProperties,
      };
    },

    validate: () => {
      const errors = [];
      if (selectedGroups.length === 0) errors.push('Select at least one group');
      if (rowData.length === 0) errors.push('Add at least one item');
      if (fromMrp && toMrp && Number(fromMrp) > Number(toMrp)) {
        errors.push('From MRP cannot be greater than To MRP');
      }
      return { isValid: errors.length === 0, errors };
    },

    setData: (data) => {
      // Pre-fill from GET API response
      // Convert comma strings back to select options, etc.
    },
  }));

  return ( /* ... your JSX ... */ );
});
```

### Step 3 — Parent collects, validates, and POSTs

```jsx
// OrganizationPolicy2/indexPage.jsx
import { useRef, useState } from 'react';

const OrganizationPolicy2 = () => {
  const [cookies] = useCookies();

  // One ref per child tab
  const generalRef = useRef();
  const posBillRef = useRef();
  const creditNoteRef = useRef();
  const goodsReceiptRef = useRef();
  const posOrderRef = useRef();

  // Parent's own state (fields that belong to parent)
  const [assormentName, setAssortmentName] = useState('');
  const [selectedAssortmentType, setSelectedAssortmentType] = useState('');
  const [assormentModel, setAssortmentModel] = useState('');
  const [inActive, setInActive] = useState(false);

  const getCookieValue = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  // ─── VALIDATE ALL TABS ───
  const validateAll = () => {
    const allErrors = [];

    // Parent's own validation
    if (!assormentName.trim()) allErrors.push('Assortment Name is required');
    if (!selectedAssortmentType) allErrors.push('Select an Assortment Type');

    // Validate each child tab
    const refs = [
      { name: 'General', ref: generalRef },
      { name: 'POS Bill', ref: posBillRef },
      { name: 'Credit Note', ref: creditNoteRef },
      { name: 'Goods Receipt', ref: goodsReceiptRef },
      { name: 'POS Order', ref: posOrderRef },
    ];

    refs.forEach(({ name, ref }) => {
      if (ref.current?.validate) {
        const { isValid, errors } = ref.current.validate();
        if (!isValid) {
          errors.forEach(err => allErrors.push(`[${name}] ${err}`));
        }
      }
    });

    return allErrors;
  };

  // ─── SAVE HANDLER ───
  const handleSave = async () => {
    // Step 1: Validate everything
    const errors = validateAll();
    if (errors.length > 0) {
      alert(errors.join('\n'));  // or use toast/notification
      return;
    }

    // Step 2: Collect data from all children
    const generalData = generalRef.current?.getData() || {};
    const posBillData = posBillRef.current?.getData() || {};
    const creditNoteData = creditNoteRef.current?.getData() || {};
    const goodsReceiptData = goodsReceiptRef.current?.getData() || {};
    const posOrderData = posOrderRef.current?.getData() || {};

    // Step 3: Build the final payload
    const formData = {
      // Parent's own fields
      assortmentID: 0,
      assortmentName: assormentName,
      description: "",
      typeOfAssortment: selectedAssortmentType,
      assortmentType: "P",
      enteredBy: getCookieValue('UserId') || 0,
      usedFor: "I",
      store: getCookieValue('DefaultStoreId') || 0,
      isActive: inActive === true ? 'Y' : 'N',
      assortmentModel: assormentModel,

      // Spread child data into payload
      ...generalData,
      ...posBillData,
      ...creditNoteData,
      ...goodsReceiptData,
      ...posOrderData,
    };

    // Step 4: Call POST API
    const response = await PostAPI(
      '/api/AssortmentRep/PostAssortment', '', formData, cookies
    );
    console.log('Save response:', response);
  };

  // ─── PRE-FILL FROM GET API ───
  const handleLoad = async (id) => {
    const response = await GetAPI(`/api/AssortmentRep/GetAssortment?id=${id}`, '', {}, cookies);
    const data = response.data;

    // Fill parent's own fields
    setAssortmentName(data.assortmentName);
    setSelectedAssortmentType(data.typeOfAssortment);
    setAssortmentModel(data.assortmentModel);
    setInActive(data.isActive === 'Y');

    // Fill each child using setData
    generalRef.current?.setData(data);
    posBillRef.current?.setData(data);
    creditNoteRef.current?.setData(data);
    goodsReceiptRef.current?.setData(data);
    posOrderRef.current?.setData(data);
  };

  return (
    <div>
      {/* Parent's own fields */}
      <input value={assormentName} onChange={e => setAssortmentName(e.target.value)} />

      {/* Child tabs — each manages its own state internally */}
      <Tabs>
        <TabsContent value="general">
          <General ref={generalRef} />
        </TabsContent>
        <TabsContent value="posBill">
          <POSBill ref={posBillRef} />
        </TabsContent>
        <TabsContent value="creditNote">
          <CreditNote ref={creditNoteRef} />
        </TabsContent>
        <TabsContent value="goodsReceipt">
          <GoodsReciept ref={goodsReceiptRef} />
        </TabsContent>
        <TabsContent value="posOrder">
          <PosOrder ref={posOrderRef} />
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};
```

### Flow Summary

```
┌──────────────────────────────────────────────────────────┐
│  User clicks SAVE                                         │
│    ↓                                                      │
│  Parent calls validateAll()                               │
│    ├─ generalRef.current.validate()     → { isValid, errors }
│    ├─ posBillRef.current.validate()     → { isValid, errors }
│    ├─ creditNoteRef.current.validate()  → { isValid, errors }
│    ├─ goodsReceiptRef.current.validate()→ { isValid, errors }
│    └─ posOrderRef.current.validate()    → { isValid, errors }
│                                                           │
│  If ALL valid:                                            │
│    ├─ generalRef.current.getData()      → { ... }         │
│    ├─ posBillRef.current.getData()      → { ... }         │
│    ├─ creditNoteRef.current.getData()   → { ... }         │
│    ├─ goodsReceiptRef.current.getData() → { ... }         │
│    └─ posOrderRef.current.getData()     → { ... }         │
│                                                           │
│  Parent merges all + own fields into formData             │
│    ↓                                                      │
│  PostAPI('/api/AssortmentRep/PostAssortment', formData)   │
└──────────────────────────────────────────────────────────┘
```

### 3 Functions Every Child Should Expose

| Function | Purpose | When Called |
|----------|---------|-------------|
| `getData()` | Returns API-ready object with transformed data | On Save click |
| `validate()` | Returns `{ isValid: bool, errors: string[] }` | Before Save |
| `setData(data)` | Pre-fills fields from a GET API response | On Edit/Load |

### Tips for Complex Payloads

1. **Transform in the child** — If a child has `selectedGroups` (array of objects), the child's `getData()` should return the computed `itemGroup: "G1,G2,G3"` string. Parent should never need to know about child's internal data structures.

2. **Type safety** — Always cast types in `getData()`:
   ```jsx
   getData: () => ({
     orderValidityDays: Number(orderValidityDays),  // not string
     fromMRP: Number(fromMrp) || 0,
   })
   ```

3. **Avoid key collisions** — If two children might return the same key, namespace them:
   ```jsx
   // Instead of both returning { isActive: ... }
   // General returns:  { generalIsActive: ... }
   // PosOrder returns: { posOrderIsActive: ... }
   ```

4. **Nested arrays** — The child should build its own nested detail arrays:
   ```jsx
   getData: () => ({
     assortmentDetail: rowData.map((item, i) => ({
       assortmentID: 0,
       itemCode: item.ItemCode || "",
       lineNum: i + 1,
       tableID: item.IsIncluded ? 1 : 2,
     })),
   })
   ```

5. **Pre-fill with setData** — When editing an existing record, parent fetches from GET API and pushes data down to each child via `ref.current.setData(apiResponse)`. Each child knows how to map API response fields back to its own state.
