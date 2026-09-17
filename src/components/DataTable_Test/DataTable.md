# DataTable — Pro Component Guide

A feature-rich, zero-dependency React table component.  
Supports column freeze, global search, per-column filters, sorting, pagination, row selection, density toggle, column visibility, CSV/JSON/Print export, pivot table, analysis header with stats cards, AI insight banner, and a skeleton loading state.

---

## Quick Start

```jsx
import DataTable from '@/components/DataTable_Test/DataTable';
import '@/components/DataTable_Test/DataTable.css';

const columns = [
  { key: 'id',   label: 'ID'   },
  { key: 'name', label: 'Name' },
];

const data = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob'   },
];

<DataTable columns={columns} data={data} />
```

---

## Props Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `Column[]` | `[]` | Column definitions (see below) |
| `data` | `object[]` | `[]` | Row data array |
| `title` | `string` | `'DataTable'` | Table title; used as export filename base |
| `stats` | `Stat[]` | — | Cards shown in the analysis header |
| `aiInsight` | `string` | — | AI insight text shown below stats |
| `analysisTitle` | `string` | `'Overview'` | Heading text inside the analysis header |
| `defaultPageSize` | `number` | `10` | Initial rows per page |
| `pageSizeOptions` | `number[]` | `[10,25,50,100]` | Page-size dropdown options |
| `showRowNumbers` | `boolean` | `true` | Prepend a `#` row-number column |
| `selectable` | `boolean` | `true` | Show checkbox column for row selection |
| `showPivot` | `boolean` | `true` | Show the Pivot toggle button |
| `showExport` | `boolean` | `true` | Show Export (CSV / JSON / Print) button |
| `showColumnVisibility` | `boolean` | `true` | Show Columns toggle (hide/show columns) |
| `showDensityToggle` | `boolean` | `true` | Show Density cycle button |
| `showColumnFilter` | `boolean` | `true` | Show per-column filter input row |
| `loading` | `boolean` | `false` | Show skeleton loading state |
| `striped` | `boolean` | `true` | Alternate row background shading |
| `emptyText` | `string` | `'No records found'` | Message shown when data is empty |
| `onRowClick` | `(row) => void` | — | Fired when a data row is clicked |
| `onSelectionChange` | `(rows[]) => void` | — | Fired with the array of selected row objects |

---

## Column Definition

Each item in `columns` is an object with these fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | ✅ | Matches a field key in the data objects |
| `label` | `string` | ✅ | Column header text |
| `width` | `number` | — | Fixed pixel width |
| `minWidth` | `number` | — | Minimum pixel width (default `100`) |
| `type` | `string` | — | Built-in renderer: `'badge'` `'currency'` `'number'` `'date'` |
| `render` | `(value, row) => ReactNode` | — | Custom cell renderer; overrides `type` |
| `frozen` | `boolean` | — | Freeze column to the left (sticky) |
| `hidden` | `boolean` | — | Hidden by default (toggleable via Columns menu) |
| `sortable` | `boolean` | — | Set `false` to disable sorting on this column |
| `filterable` | `boolean` | — | Set `false` to hide the per-column filter input |

### Built-in `type` renderers

| `type` | Output |
|---|---|
| `'badge'` | Coloured status pill — auto-maps `active/inactive/open/closed/pending` |
| `'currency'` | `₹` + `toLocaleString('en-IN')` in monospace font |
| `'number'` | `toLocaleString()` in monospace font |
| `'date'` | `toLocaleDateString('en-IN')` |

---

## Stat Card Definition (`stats` prop)

```js
{
  label: 'Active Users',   // text under the value
  value: 42,               // number or pre-formatted string e.g. '₹1,20,000'
  type:  'active',         // controls icon colour class (see table below)
  icon:  '🔥',             // optional — overrides the default emoji
}
```

| `type` | Default icon | Colour class |
|---|---|---|
| `total` | 📊 | grey |
| `active` | 🟢 | green |
| `inactive` | 🔴 | red |
| `open` | 🔵 | indigo |
| `closed` | 🟡 | amber |
| `pending` | 🟣 | indigo |
| `revenue` | 💰 | cyan |
| `orders` | 📦 | cyan |
| `customers` | 👥 | cyan |
| `products` | 🏷️ | cyan |
| anything else | 📌 | cyan (`custom`) |

---

## Feature Examples

### 1 — Minimal table

```jsx
<DataTable
  columns={[
    { key: 'id',   label: 'ID'   },
    { key: 'name', label: 'Name' },
  ]}
  data={[
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob'   },
  ]}
  showPivot={false}
  showExport={false}
  selectable={false}
/>
```

---

### 2 — Column freeze

Add `frozen: true` to any column. Columns freeze **left-to-right** in the order they appear in the `columns` array. The table body scrolls horizontally while frozen columns stay fixed.

```jsx
const columns = [
  { key: 'orderId',  label: 'Order ID', frozen: true, width: 110 },
  { key: 'product',  label: 'Product',  frozen: true, width: 200 },
  { key: 'category', label: 'Category', width: 130 },
  { key: 'qty',      label: 'Qty',      type: 'number', width: 80 },
  { key: 'total',    label: 'Total',    type: 'currency', width: 120 },
  // ... many more columns that scroll
];

<DataTable columns={columns} data={orders} />
```

> A lock icon appears on each frozen column header.  
> Checkboxes and the `#` row-number column are automatically sticky too.

---

### 3 — Built-in type renderers

```jsx
const columns = [
  { key: 'invoiceNo', label: 'Invoice #' },
  { key: 'amount',    label: 'Amount',   type: 'currency' },   // ₹ formatted
  { key: 'qty',       label: 'Qty',      type: 'number'   },   // 1,234
  { key: 'status',    label: 'Status',   type: 'badge'    },   // coloured pill
  { key: 'createdAt', label: 'Date',     type: 'date'     },   // dd/mm/yyyy
];
```

---

### 4 — Custom cell renderer (`render`)

`render` receives `(value, row)` and must return a React node.

```jsx
const columns = [
  { key: 'id',     label: 'ID' },
  { key: 'name',   label: 'Name' },
  {
    key: 'total',
    label: 'Total',
    render: (value, row) => (
      <span style={{ color: value > 1000 ? '#059669' : '#475569', fontWeight: 600 }}>
        ₹{value.toLocaleString('en-IN')}
      </span>
    ),
  },
  {
    key: 'isActive',
    label: 'Status',
    render: (value) => (
      <span style={{
        padding: '3px 10px', borderRadius: 20,
        background: value === 'Y' ? '#d1fae5' : '#fee2e2',
        color:      value === 'Y' ? '#065f46' : '#991b1b',
        fontWeight: 600, fontSize: 12,
      }}>
        {value === 'Y' ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  // Action buttons column — use a dummy key
  {
    key: '__actions__',
    label: 'Actions',
    width: 150,
    sortable: false,
    filterable: false,
    render: (_, row) => (
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={(e) => { e.stopPropagation(); handleView(row); }}>View</button>
        <button onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>Edit</button>
      </div>
    ),
  },
];
```

---

### 5 — Hidden columns (toggleable)

Set `hidden: true` to hide a column by default. Users can re-enable it via the **Columns** button in the toolbar.

```jsx
const columns = [
  { key: 'id',        label: 'ID' },
  { key: 'name',      label: 'Name' },
  { key: 'internalCode', label: 'Internal Code', hidden: true }, // hidden by default
];
```

---

### 6 — Disable sort / filter per column

```jsx
const columns = [
  { key: 'name',    label: 'Name' },
  { key: 'actions', label: 'Actions', sortable: false, filterable: false },
];
```

---

### 7 — Analysis header with stats + AI insight

```jsx
const stats = [
  { label: 'Total Orders', value: 240,    type: 'total'    },
  { label: 'Active',       value: 180,    type: 'active'   },
  { label: 'Inactive',     value: 60,     type: 'inactive' },
  { label: 'Revenue',      value: '₹1,24,000', type: 'revenue', icon: '💰' },
];

const insight = 'Zone A generates 34 % more revenue than other zones. UPI payments lead at 41 %.';

<DataTable
  title="Sales Report"
  analysisTitle="Sales Overview"
  columns={columns}
  data={orders}
  stats={stats}
  aiInsight={insight}
/>
```

---

### 8 — Pivot table

The Pivot panel is built-in. Toggle it with the **Pivot** button in the toolbar.  
It auto-detects numeric columns as value fields and string/category columns as row/column fields.  
Supported aggregations: **SUM · AVG · COUNT · MAX · MIN**.

To enable it (it is `true` by default):

```jsx
<DataTable
  columns={columns}
  data={orders}
  showPivot={true}   // default — just listing it for clarity
/>
```

To hide the Pivot button entirely:

```jsx
<DataTable columns={columns} data={orders} showPivot={false} />
```

---

### 9 — Row selection with callback

```jsx
const [selected, setSelected] = useState([]);

<DataTable
  columns={columns}
  data={data}
  selectable={true}
  onSelectionChange={(rows) => setSelected(rows)}
/>

{selected.length > 0 && (
  <p>{selected.length} row(s) selected</p>
)}
```

---

### 10 — Row click handler

```jsx
<DataTable
  columns={columns}
  data={data}
  onRowClick={(row) => {
    console.log('Clicked row:', row);
    openDetailModal(row);
  }}
/>
```

---

### 11 — Loading / skeleton state

Pass `loading={true}` while your data is being fetched. The table renders animated skeleton rows.

```jsx
const { data, isLoading } = useFetch('/api/orders');

<DataTable
  columns={columns}
  data={data ?? []}
  loading={isLoading}
/>
```

---

### 12 — Custom pagination options

```jsx
<DataTable
  columns={columns}
  data={data}
  defaultPageSize={25}
  pageSizeOptions={[10, 25, 50, 100, 200]}
/>
```

---

### 13 — Strip down for simple listing

Disable all extra features for a lightweight, read-only table:

```jsx
<DataTable
  columns={columns}
  data={data}
  selectable={false}
  showRowNumbers={false}
  showPivot={false}
  showExport={false}
  showColumnVisibility={false}
  showDensityToggle={false}
  showColumnFilter={false}
  striped={true}
  defaultPageSize={5}
/>
```

---

### 14 — Full featured example (POS orders)

```jsx
import DataTable from '@/components/DataTable_Test/DataTable';

const columns = [
  { key: 'orderId',     label: 'Order ID',   frozen: true, width: 110 },
  { key: 'product',     label: 'Product',    frozen: true, width: 200 },
  { key: 'category',    label: 'Category',   width: 130 },
  { key: 'cashier',     label: 'Cashier',    width: 130 },
  { key: 'qty',         label: 'Qty',        type: 'number',   width: 80 },
  { key: 'price',       label: 'Price',      type: 'currency', width: 110 },
  { key: 'discount',    label: 'Discount',   type: 'currency', width: 110 },
  {
    key: 'total',
    label: 'Total',
    width: 120,
    render: (v, row) => (
      <span style={{ fontWeight: 600, color: v > 2000 ? '#059669' : '#0284c7' }}>
        ₹{Number(v).toLocaleString('en-IN')}
      </span>
    ),
  },
  { key: 'status',      label: 'Status',       type: 'badge', width: 110 },
  { key: 'orderStatus', label: 'Order Status', type: 'badge', width: 120 },
  { key: 'date',        label: 'Date',         type: 'date',  width: 110 },
  {
    key: '__actions__',
    label: 'Actions',
    width: 150,
    sortable: false,
    filterable: false,
    render: (_, row) => (
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={(e) => { e.stopPropagation(); handleView(row); }}>View</button>
        <button onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>Edit</button>
      </div>
    ),
  },
];

const stats = [
  { label: 'Total',    value: orders.length, type: 'total' },
  { label: 'Active',   value: orders.filter(o => o.status === 'Active').length, type: 'active' },
  { label: 'Inactive', value: orders.filter(o => o.status === 'Inactive').length, type: 'inactive' },
  { label: 'Revenue',  value: '₹' + orders.reduce((s, o) => s + o.total, 0).toLocaleString('en-IN'), type: 'revenue' },
];

<DataTable
  title="POS Orders"
  analysisTitle="Sales Overview"
  columns={columns}
  data={orders}
  stats={stats}
  aiInsight="Zone A generates 34% more revenue. UPI leads at 41% of payments."
  defaultPageSize={10}
  pageSizeOptions={[10, 25, 50]}
  selectable={true}
  showRowNumbers={true}
  showPivot={true}
  showExport={true}
  showColumnVisibility={true}
  showDensityToggle={true}
  showColumnFilter={true}
  striped={true}
  onSelectionChange={(rows) => console.log(rows)}
  onRowClick={(row) => alert(row.orderId)}
/>
```

---

## Toolbar Buttons Summary

| Button | Controlled by prop | What it does |
|---|---|---|
| Search box | always visible | Filters across all visible columns |
| Page size select | always visible | Changes rows per page |
| Density | `showDensityToggle` | Cycles Default → Comfortable → Compact row height |
| Clear Filters | auto-shows when active | Clears all filters + search |
| Pivot | `showPivot` | Opens the interactive pivot panel below the table |
| Columns | `showColumnVisibility` | Dropdown to hide/show individual columns |
| Export | `showExport` | CSV, JSON, or browser Print |
| Refresh (↺) | always visible | Resets search, filters, sort, page, selection |

---

## CSS Variables (theming)

Override any of these in your global CSS to theme the table:

```css
:root {
  --dt-primary:       #0ea5e9;   /* main accent colour */
  --dt-primary-dark:  #0284c7;
  --dt-primary-light: #e0f2fe;
  --dt-success:       #10b981;
  --dt-warning:       #f59e0b;
  --dt-danger:        #ef4444;
  --dt-font:          'DM Sans', sans-serif;
  --dt-mono:          'JetBrains Mono', monospace;
  --dt-radius:        12px;
  --dt-radius-sm:     8px;
}
```

---

## File Structure

```
src/components/DataTable_Test/
├── DataTable.jsx   ← component (single file, self-contained)
├── DataTable.css   ← all styles
└── DataTable.md    ← this file
```
