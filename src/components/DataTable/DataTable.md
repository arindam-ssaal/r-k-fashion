# DataTable Component

A reusable, self-contained data-table component with an **AG Grid-style API**. Just pass `columns`, `rowData`, and optional config — the table handles search, filtering, sorting, pagination, row selection, CSV export, and column visibility out of the box.

**Zero external dependencies** — only React.

---

## Quick Start

```jsx
import { DataTable, StatusPill, TypeBadge } from "@/components/DataTable";

const columns = [
  { field: "name", headerName: "Name" },
  { field: "category", headerName: "Category" },
  { field: "value", headerName: "Price", valueFormatter: (v) => `₹${v}` },
  { field: "status", headerName: "Status", sortable: false, cellRenderer: (v) => <StatusPill value={v} /> },
];

const data = [
  { id: 1, name: "Widget A", category: "Electronics", value: 500, status: "Active" },
  { id: 2, name: "Widget B", category: "Home", value: 300, status: "Inactive" },
];

function MyPage() {
  return <DataTable columns={columns} rowData={data} />;
}
```

---

## Full Example (Assortment Management)

```jsx
import { DataTable, StatusPill, TypeBadge } from "@/components/DataTable";

// --- Icons (use your own or lucide-react) ---
const ViewIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="8" rx="6" ry="4" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>;
const EditIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>;
const DeleteIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V2h4v2M5 4l1 9h4l1-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ActivateIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const DeactivateIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;

// --- Column Definitions ---
const columns = [
  {
    field: "name",
    headerName: "Assortment Name",
    filter: { type: "text", placeholder: "Filter name…" },
  },
  {
    field: "type",
    headerName: "Type",
    width: "80px",
    cellRenderer: (v) => <TypeBadge value={v} />,
    filter: {
      type: "select",
      options: [
        { label: "P – Promotion", value: "P" },
        { label: "D – Discount", value: "D" },
        { label: "B – Bundle", value: "B" },
      ],
    },
  },
  {
    field: "category",
    headerName: "Category",
    filter: {
      type: "select",
      options: ["Apparel", "Electronics", "Grocery", "Footwear", "Home"],
    },
  },
  {
    field: "value",
    headerName: "Discount Value",
    valueFormatter: (v) => `${v}%`,
    exportValue: (v) => `${v}%`,
  },
  {
    field: "startdate",
    headerName: "Start Date",
    filter: {
      type: "dateRange",
      fromLabel: "Start Date From",
      toLabel: "Start Date To",
    },
  },
  { field: "enddate", headerName: "End Date" },
  {
    field: "status",
    headerName: "Status",
    sortable: false,
    cellRenderer: (v) => <StatusPill value={v} />,
    filter: { type: "select", options: ["Active", "Inactive"] },
  },
];

// --- Row Actions ---
const actions = [
  { icon: <ViewIcon />,       title: "View",       onClick: (row) => console.log("view", row) },
  { icon: <EditIcon />,       title: "Edit",       onClick: (row) => console.log("edit", row) },
  { icon: <DeactivateIcon />, title: "Deactivate", variant: "warning", onClick: (row) => console.log("deactivate", row), show: (row) => row.status === "Active" },
  { icon: <ActivateIcon />,   title: "Activate",   variant: "success", onClick: (row) => console.log("activate", row),   show: (row) => row.status === "Inactive" },
  { icon: <DeleteIcon />,     title: "Delete",     variant: "danger",  onClick: (row) => console.log("delete", row) },
];

// --- Bulk Actions ---
const bulkActions = [
  { icon: <ActivateIcon />,   title: "Activate Selected",   variant: "success", iconOnly: true, onClick: (ids, rows) => console.log("bulk activate", ids) },
  { icon: <DeactivateIcon />, title: "Deactivate Selected", variant: "danger",  iconOnly: true, onClick: (ids, rows) => console.log("bulk deactivate", ids) },
];

// --- Render ---
function AssortmentPage() {
  const [data, setData] = useState([...yourData]);

  return (
    <DataTable
      columns={columns}
      rowData={data}
      rowIdField="id"
      rowSelection
      actions={actions}
      bulkActions={bulkActions}
      onAdd={() => console.log("open add modal")}
      addButtonLabel="Add New"
      exportFileName="Assortment_Report"
      defaultSortField="name"
      defaultPageSize={30}
      pageSizeOptions={[30, 40, 50]}
    />
  );
}
```

---

## Props Reference

### `<DataTable />` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Array` | **required** | Column definitions array (see below) |
| `rowData` | `Array` | **required** | Data array — each item is one row |
| `rowIdField` | `string` | `"id"` | Property name used as unique row identifier |
| `globalSearch` | `boolean` | `true` | Show the global search bar |
| `searchPlaceholder` | `string` | `"Search across all columns…"` | Placeholder text for search input |
| `columnChooser` | `boolean` | `true` | Show the column visibility toggle dropdown |
| `exportable` | `boolean` | `true` | Show the "Export to Excel" (CSV) button |
| `exportFileName` | `string` | `"export"` | Downloaded CSV filename (without extension) |
| `pagination` | `boolean` | `true` | Enable pagination footer |
| `defaultPageSize` | `number` | `30` | Default rows per page |
| `pageSizeOptions` | `number[]` | `[30, 40, 50]` | Options in the "Rows per page" dropdown |
| `rowSelection` | `boolean` | `false` | Enable row checkboxes for multi-select |
| `serialNumber` | `boolean` | `true` | Show S.No. column |
| `defaultSortField` | `string` | — | Field to sort by on initial render |
| `defaultSortDir` | `"asc" \| "desc"` | `"asc"` | Initial sort direction |
| `actions` | `Array` | — | Row-level action buttons (see below) |
| `bulkActions` | `Array` | — | Bulk action buttons shown when rows are selected |
| `onAdd` | `Function` | — | Callback for "+ Add New" button (button hidden if not set) |
| `addButtonLabel` | `string` | `"Add New"` | Text for the add button |
| `toolbarLeft` | `ReactNode` | — | Extra JSX injected into toolbar left side |
| `toolbarRight` | `ReactNode` | — | Extra JSX injected into toolbar right side |
| `onSelectionChange` | `Function(Set)` | — | Called with a `Set` of selected row IDs whenever selection changes |
| `emptyMessage` | `string` | `"No records found"` | Heading shown when table is empty |
| `emptySubMessage` | `string` | `"Try adjusting…"` | Subtext shown when table is empty |
| `actionsColumnWidth` | `number` | — | Fixed width (px) for the Actions column |

---

### Column Definition Object

Each object in the `columns` array can have:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `field` | `string` | **required** | Key in each data object to read the value from |
| `headerName` | `string` | **required** | Display name for the column header |
| `sortable` | `boolean` | `true` | Whether clicking the header sorts the column |
| `width` | `string` | — | CSS width (e.g. `"80px"`, `"200px"`) |
| `hide` | `boolean` | `false` | If `true`, column is hidden by default (can be toggled via Columns button) |
| `cellRenderer` | `(value, row) => ReactNode` | — | Custom JSX renderer for each cell |
| `valueFormatter` | `(value, row) => string` | — | Format cell value as a string (used in display & search) |
| `exportValue` | `(value, row) => string` | — | Custom value for CSV export (falls back to `valueFormatter`, then raw value) |
| `filter` | `FilterDef` | — | Adds a filter control for this column (see below) |

---

### Filter Definition Object (`filter`)

| Property | Type | Description |
|----------|------|-------------|
| `type` | `"text" \| "select" \| "date" \| "dateRange"` | Filter input type |
| `options` | `string[] \| { label, value }[]` | Options for `"select"` type |
| `placeholder` | `string` | Placeholder for `"text"` type |
| `label` | `string` | Custom label (defaults to `headerName`) |
| `fromLabel` | `string` | Label for "from" input in `"dateRange"` |
| `toLabel` | `string` | Label for "to" input in `"dateRange"` |
| `width` | `number` | Input width in px |

**Filter types explained:**

- **`text`** — Free-text search within that column
- **`select`** — Dropdown menu. Pass `options` as `["Active", "Inactive"]` or `[{ label: "P – Promotion", value: "P" }]`
- **`date`** — Single date picker, matches exact date
- **`dateRange`** — From/To date pickers, filters rows within the range

---

### Action Definition Object (`actions`)

Each object in the `actions` array:

| Property | Type | Description |
|----------|------|-------------|
| `icon` | `ReactNode` | Icon JSX to render inside the button |
| `title` | `string` | Tooltip text |
| `onClick` | `(row) => void` | Callback when the action is clicked |
| `variant` | `"default" \| "danger" \| "warning" \| "success"` | Hover color style |
| `show` | `(row) => boolean` | Conditionally show/hide this action per row |

---

### Bulk Action Definition Object (`bulkActions`)

Each object in the `bulkActions` array:

| Property | Type | Description |
|----------|------|-------------|
| `icon` | `ReactNode` | Icon JSX |
| `label` | `string` | Button text (omit for icon-only) |
| `title` | `string` | Tooltip text |
| `onClick` | `(selectedIds, selectedRows) => void` | Callback with Set of IDs and array of selected row objects |
| `variant` | `"default" \| "danger" \| "success" \| "warning"` | Button style |
| `iconOnly` | `boolean` | If `true`, renders as a compact icon-only button |

---

## Built-in Cell Renderer Helpers

Import these from the same path:

```jsx
import { StatusPill, TypeBadge } from "@/components/DataTable";
```

### `<StatusPill value="Active" />`

Renders a colored pill with a dot. Supports `"Active"` (green) and `"Inactive"` (orange).

### `<TypeBadge value="P" />`

Renders a small monospace badge (e.g., showing "P", "D", "B").

---

## Features Summary

| Feature | How it works |
|---------|-------------|
| **Global Search** | Searches across all column values (uses `valueFormatter` if provided) |
| **Column Filters** | Defined per-column via `filter` property; supports text, select, date, dateRange |
| **Filter Tags** | Active filters shown as removable tags below the toolbar |
| **Sorting** | Click any sortable column header to toggle asc/desc |
| **Pagination** | Configurable page size with dropdown |
| **Row Selection** | Checkbox column with select-all, indeterminate state, bulk actions bar |
| **Column Chooser** | Toggle column visibility via a dropdown |
| **CSV Export** | Exports all filtered data (respects visible columns, uses `exportValue`/`valueFormatter`) |
| **Empty State** | Customizable message when no rows match |
| **S.No. Column** | Auto-generated serial numbers |
| **Custom Actions** | Per-row action buttons with conditional visibility |
| **Bulk Actions** | Actions on selected rows shown in a selection bar |
| **Add Button** | Shows when `onAdd` callback is provided |
| **Custom Toolbar** | Inject extra JSX via `toolbarLeft` / `toolbarRight` |
