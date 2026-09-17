# ListingPage Component

A fully reusable SAP B1-styled listing/master-data page for your POS React project.
Drop it into any module and pass data — zero boilerplate.

---

## Files

| File | Purpose |
|------|---------|
| `ListingPage.jsx` | React component |
| `ListingPage.css`  | All styles (scoped under `.lp-wrapper`) |

---

## Quick Start

```jsx
import ListingPage from "@/components/ListingPage/ListingPage";

<ListingPage
  title="Store Master"
  subtitle="Manage POS stores · SAP B1 integrated"
  titleIcon="🏪"
  rowData={stores}
  columns={columns}
  rowKey="id"
  onView={row => openViewModal(row)}
  onEdit={row => openEditModal(row)}
  onDelete={row => handleDelete(row)}
  primaryAction={{ label: "+ New Store", onClick: () => openCreateModal() }}
/>
```

---

## Props Reference

### Identity

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | `"Records"` | Page/table heading |
| `subtitle` | string | `""` | Small text below title |
| `titleIcon` | string | `"📋"` | Emoji or JSX for the icon tile |

---

### Data

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rowData` | `Array<object>` | `[]` | Your data array |
| `columns` | `Array<Column>` | `[]` | Column definitions (see below) |
| `rowKey` | string | `"id"` | Unique key field on each row |
| `loading` | boolean | `false` | Show skeleton rows instead of data |

---

### Column Definition (`columns` array items)

```ts
{
  field:     string,        // key on the row object (supports dot notation: "address.city")
  header:    string,        // column header label
  type?:     ColumnType,    // built-in renderer
  width?:    string,        // CSS width e.g. "120px"
  minWidth?: string,        // CSS min-width
  sortable?: boolean,       // default true
  cellClass?: string,       // extra CSS class on <td>
  tdStyle?:  CSSObject,     // inline style on <td>
  render?:   (value, row) => JSX,  // full custom renderer (overrides type)

  // for type: "link" and type: "code"
  isLink?:   boolean,       // make code cells clickable (calls onView)

  // for type: "badge"
  badgeMap?: { [value]: { variant, label, dot } },
  badgeFn?:  (value, row) => { variant, label, dot },

  // for type: "boolean"
  trueLabel?:  string,      // default "Yes"
  falseLabel?: string,      // default "No"
}
```

#### Built-in `type` values

| Type | Description |
|------|-------------|
| `"code"` | Monospace blue text (like store codes). Add `isLink: true` to make it clickable. |
| `"link"` | Blue underline text, calls `onView(row)` on click |
| `"date"` | Auto-formats `YYYY-MM-DD` → `DD-MM-YYYY` |
| `"number"` | Formats with `en-IN` locale (e.g. `12,000`) |
| `"currency"` | Prefixes `₹` and formats with `en-IN` locale |
| `"badge"` | Colored badge via `badgeMap` or `badgeFn` |
| `"boolean"` | Green "Yes" / Amber "No" badge |
| `"checkbox"` | Readonly checkbox |
| _(default)_ | Plain string value |

#### Badge variants for `type: "badge"`

`"success"` `"warning"` `"error"` `"info"` `"purple"` `"teal"` `"neutral"`

---

### Stats Cards

```js
stats={[
  { label: "Total Stores", value: 12,  icon: "🏪", iconClass: "blue",  filterKey: "all"      },
  { label: "Active",       value: 10,  icon: "✅", iconClass: "green", filterKey: "active"   },
  { label: "Inactive",     value: 2,   icon: "⏸️", iconClass: "amber", filterKey: "inactive" },
  { label: "Sync Pending", value: 3,   icon: "🔄", iconClass: "red"                           },
]}
```

`filterKey` makes the card clickable — it activates the matching filter chip.
`iconClass` options: `"blue"` `"green"` `"amber"` `"red"` `"purple"` `"teal"`

---

### Filter Chips

```js
filterChips={[
  { key: "all",      label: "All",           chipClass: "lp-chip-blue"   },
  { key: "active",   label: "Active (10)",   chipClass: "lp-chip-green",  filterFn: row => row.status === "Active"   },
  { key: "inactive", label: "Inactive (2)",  chipClass: "lp-chip-amber",  filterFn: row => row.status === "Inactive" },
  { key: "coco",     label: "COCO",          chipClass: "lp-chip-purple", filterFn: row => row.category.includes("Company Operated") },
]}
defaultFilter="all"
```

`chipClass` preset options: `lp-chip-blue` `lp-chip-green` `lp-chip-amber` `lp-chip-purple` `lp-chip-teal` `lp-chip-red`

---

### Search

```jsx
searchPlaceholder="Search by code, name, city…"
searchFields={["code", "name", "city"]}   // search only these fields
// if searchFields is empty [] → searches ALL string/number fields
```

---

### Sorting

```jsx
defaultSortCol="code"     // field to sort by on mount
defaultSortDir="asc"      // "asc" | "desc"
```

---

### Pagination

```jsx
pageSize={8}    // rows per page
```

---

### Actions

#### Primary Button (top-right of title bar)

```jsx
primaryAction={{ label: "+ New Store", icon: "➕", onClick: () => openModal() }}
```

#### Row-level callbacks (built-in icons 👁 ✏️ 🗑)

```jsx
onView={row => openViewModal(row)}
onEdit={row => openEditModal(row)}
onDelete={row => handleDelete(row)}
```

Pass only the ones you need. Actions appear on row hover.

#### Custom row actions

```jsx
rowActions={[
  { icon: "🔗", title: "Sync to SAP",  btnClass: "lp-btn-ghost", onClick: row => syncToSAP(row)  },
  { icon: "📋", title: "Duplicate",    btnClass: "lp-btn-ghost", onClick: row => duplicate(row)  },
]}
```

#### Toolbar actions

```jsx
toolbarActions={[
  { label: "Export",  icon: "⬇",  btnClass: "lp-btn-secondary", onClick: (ids) => exportData(ids),   showWhen: "always"   },
  { label: "Print",   icon: "🖨",  btnClass: "lp-btn-secondary", onClick: () => window.print(),       showWhen: "always"   },
  { label: "Delete Selected", icon: "🗑", btnClass: "lp-btn-danger",   onClick: (ids) => bulkDelete(ids), showWhen: "selected" },
]}
```

`showWhen`: `"always"` (default) | `"selected"` (only when rows are checked) | `"never"`

`onClick` receives an array of selected `rowKey` values.

---

### Selection

```jsx
selectable={true}    // set false to hide checkboxes entirely
```

---

## Full Example — Store Master

```jsx
import ListingPage from "@/components/ListingPage/ListingPage";

const COLUMNS = [
  { field: "code",      header: "Code",        type: "code", isLink: true, width: "100px" },
  { field: "name",      header: "Store Name",  type: "link" },
  { field: "city",      header: "City" },
  { field: "type",      header: "Type",        cellClass: "lp-cell-sm" },
  {
    field: "category",
    header: "Category",
    type: "badge",
    badgeFn: (val) => val?.includes("Franchise Operated")
      ? { variant: "info",   label: "COFO" }
      : { variant: "purple", label: "COCO" },
  },
  { field: "operation", header: "Operation",   cellClass: "lp-cell-sm" },
  { field: "storeSize", header: "Size (sq ft)", type: "number" },
  { field: "startDate", header: "Start Date",  type: "date" },
  {
    field: "status",
    header: "Status",
    type: "badge",
    badgeMap: {
      Active:   { variant: "success", label: "Active",   dot: true },
      Inactive: { variant: "warning", label: "Inactive", dot: true },
    },
  },
  {
    field: "syncStatus",
    header: "SAP Sync",
    type: "badge",
    badgeMap: {
      Synced:  { variant: "success", label: "🔗 Synced"  },
      Pending: { variant: "warning", label: "⏳ Pending" },
    },
  },
];

const STATS = [
  { label: "Total Stores", value: stores.length,                              icon: "🏪", iconClass: "blue",  filterKey: "all"      },
  { label: "Active",       value: stores.filter(s => s.status === "Active").length,  icon: "✅", iconClass: "green", filterKey: "active"   },
  { label: "Inactive",     value: stores.filter(s => s.status !== "Active").length,  icon: "⏸️", iconClass: "amber", filterKey: "inactive" },
  { label: "Sync Pending", value: stores.filter(s => s.syncStatus !== "Synced").length, icon: "🔄", iconClass: "red" },
];

const CHIPS = [
  { key: "all",      label: "All Stores",   chipClass: "lp-chip-blue"   },
  { key: "active",   label: "Active",       chipClass: "lp-chip-green",  filterFn: r => r.status === "Active"                        },
  { key: "inactive", label: "Inactive",     chipClass: "lp-chip-amber",  filterFn: r => r.status === "Inactive"                      },
  { key: "coco",     label: "COCO",         chipClass: "lp-chip-purple", filterFn: r => r.category?.includes("Company Operated")     },
  { key: "cofo",     label: "COFO",         chipClass: "lp-chip-teal",   filterFn: r => r.category?.includes("Franchise Operated")   },
];

const TOOLBAR = [
  { label: "Export", icon: "⬇", btnClass: "lp-btn-secondary", onClick: () => {},         showWhen: "always"   },
  { label: "Print",  icon: "🖨", btnClass: "lp-btn-secondary", onClick: () => {},         showWhen: "always"   },
  { label: "🗑 Delete Selected", btnClass: "lp-btn-danger",   onClick: ids => bulkDelete(ids), showWhen: "selected" },
];

export default function StoreMasterPage() {
  const [stores, setStores] = useState([]);

  return (
    <ListingPage
      title="Store Master"
      subtitle="Manage POS store configurations · SAP Business One integrated"
      titleIcon="🏪"
      rowData={stores}
      columns={COLUMNS}
      rowKey="id"
      stats={STATS}
      filterChips={CHIPS}
      toolbarActions={TOOLBAR}
      searchPlaceholder="Search by code, name, city…"
      searchFields={["code", "name", "city", "category"]}
      defaultSortCol="code"
      pageSize={8}
      onView={row => openViewModal(row.id)}
      onEdit={row => openEditModal(row.id)}
      onDelete={row => handleDelete(row.id)}
      primaryAction={{ label: "+ New Store", onClick: () => openCreateModal() }}
    />
  );
}
```

---

## Full Example — Customer Master

```jsx
const COLUMNS = [
  { field: "customerCode", header: "Code",     type: "code", isLink: true },
  { field: "customerName", header: "Name",     type: "link" },
  { field: "phone",        header: "Phone",    cellClass: "lp-cell-mono" },
  { field: "email",        header: "Email" },
  { field: "city",         header: "City" },
  { field: "balance",      header: "Balance",  type: "currency", cellClass: "lp-cell-right" },
  { field: "createdAt",    header: "Created",  type: "date" },
  {
    field: "tier",
    header: "Tier",
    type: "badge",
    badgeMap: {
      Gold:     { variant: "warning", label: "🥇 Gold"   },
      Silver:   { variant: "neutral", label: "🥈 Silver" },
      Standard: { variant: "info",    label: "Standard"  },
    },
  },
  {
    field: "isActive",
    header: "Status",
    type: "boolean",
    trueLabel: "Active",
    falseLabel: "Inactive",
  },
];
```

---

## Full Example — Custom Renderer

```jsx
{
  field: "tags",
  header: "Tags",
  sortable: false,
  render: (val, row) => (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {(val ?? []).map(t => (
        <span key={t} style={{ background: "#EBF3FC", color: "#0A6ED1", padding: "1px 6px", borderRadius: 10, fontSize: 11 }}>
          {t}
        </span>
      ))}
    </div>
  ),
}
```

---

## Using in a page with fixed height (POS shell)

The component is designed to fill its container vertically.
Wrap it in a container with a defined height:

```css
.page-content {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;   /* ListingPage has its own 12px 16px padding */
}
```

---

## CSS Utility Classes (available globally once CSS is imported)

| Class | Use |
|-------|-----|
| `lp-cell-code` | Monospace blue code text |
| `lp-cell-link` | Clickable blue link text |
| `lp-cell-mono` | Monospace font |
| `lp-cell-sm`   | Smaller 12px font |
| `lp-cell-muted`| Subtle grey text |
| `lp-cell-num`  | Tabular numerals |
| `lp-cell-center` | Center-aligned cell |
| `lp-cell-right`  | Right-aligned cell |
| `lp-badge-success` `lp-badge-warning` `lp-badge-error` `lp-badge-info` `lp-badge-purple` `lp-badge-teal` `lp-badge-neutral` | Badge color variants |

---

## Folder Structure Suggestion

```
src/
  components/
    ListingPage/
      ListingPage.jsx
      ListingPage.css
      README.md
```

Then import:

```js
import ListingPage from "@/components/ListingPage/ListingPage";
```
