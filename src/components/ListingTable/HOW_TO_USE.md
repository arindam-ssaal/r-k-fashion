# How to Use `ListingPage` in Any Master Page

This guide walks through **exactly** how `PaymodeTable.tsx` was migrated to `ListingPage`,
and shows you the **step-by-step pattern** you repeat for every other master page.

---

## What `ListingPage` replaces

Before, every table page needed:
- `useReactTable(...)` with 6+ options
- Manual `<Table>` / `<TableHeader>` / `<TableBody>` JSX
- A separate filter `<Input>`, column-visibility `<DropdownMenu>`, pagination `<Button>`s
- A `<SkeletonLoaderTable />` guard
- A hand-rolled `columns` array in a separate file

With `ListingPage` you pass **data + column definitions + callbacks** and get all of that for free.

---

## Step-by-Step Migration

### 1 — Import `ListingPage` and its types

```tsx
import ListingPage, { ColumnDef } from '@/components/ListingTable/ListingPage'
```

`ColumnDef<T>` is the TypeScript type for one column definition.  
Pass your fetched-data type as the generic `T` so every field name is autocompleted.

---

### 2 — Define your columns (outside the component)

```tsx
import { YourFetchedType } from '@/types/yourType'

const COLUMNS: ColumnDef<YourFetchedType>[] = [
  // plain text (default)
  { field: 'id',   header: 'ID',   width: '80px' },

  // clickable link → calls onView(row)
  { field: 'name', header: 'Name', type: 'link' },

  // monospace blue code text
  { field: 'code', header: 'Code', type: 'code' },

  // formats number with en-IN locale  e.g. 12,000
  { field: 'displayOrder', header: 'Order', type: 'number', width: '130px' },

  // date  YYYY-MM-DD → DD-MM-YYYY
  { field: 'createdAt', header: 'Created', type: 'date' },

  // currency  ₹ 1,20,000
  { field: 'balance', header: 'Balance', type: 'currency' },

  // boolean  true/"Y"/1 → green badge,  false/"N"/0 → amber badge
  { field: 'isActive', header: 'Active', type: 'boolean', trueLabel: 'Yes', falseLabel: 'No' },

  // badge with a fixed value → label/color map
  {
    field: 'status',
    header: 'Status',
    type: 'badge',
    badgeMap: {
      Active:   { variant: 'success', label: 'Active',   dot: true },
      Inactive: { variant: 'warning', label: 'Inactive', dot: true },
      // Y / N pattern (like PaymodeTable):
      Y: { variant: 'success', label: 'Active',   dot: true },
      N: { variant: 'warning', label: 'Inactive', dot: true },
    },
  },

  // badge with a function (when logic is conditional)
  {
    field: 'category',
    header: 'Category',
    type: 'badge',
    badgeFn: (val) =>
      String(val).includes('Franchise')
        ? { variant: 'info',   label: 'COFO' }
        : { variant: 'purple', label: 'COCO' },
  },

  // fully custom JSX cell
  {
    field: 'tags',
    header: 'Tags',
    sortable: false,
    render: (val) => (
      <div style={{ display: 'flex', gap: 4 }}>
        {(val as string[]).map((t) => <span key={t}>{t}</span>)}
      </div>
    ),
  },
]
```

**Rules:**
- `field` must match the exact key (or dot path like `"address.city"`) in your data object.
- Put `COLUMNS` **outside** the component so it is not re-created on every render.
- `width` is a CSS string: `"80px"`, `"10%"`, `"auto"`.

---

### 3 — Wire up your hooks inside the component

Pull the same hooks you already have — data hook, modal store, ID store, mutation hooks.

```tsx
function YourTable() {
  // data
  const { yourData, isLoading } = useYourMasterData()

  // modal state (Zustand store pattern used in this project)
  const openModal  = useYourMaster((state) => state.toggleOpen)
  const setMode    = useYourMaster((state) => state.setMode)
  const clearID    = useYourDataStore((state) => state.clearCurrentId)
  const setId      = useYourDataStore((state) => state.setCurrentId)

  // mutation (for delete)
  const { fetchById }      = useFetchYourById()
  const { createAsync }    = useCreateYour()

  const data = yourData ?? []
```

---

### 4 — Build `stats` array (inside the component, uses `data`)

```tsx
  const stats = [
    { label: 'Total',    value: data.length,                              icon: '📋', iconClass: 'blue'  as const, filterKey: 'all'      },
    { label: 'Active',   value: data.filter((d) => d.isActive === 'Y').length, icon: '✅', iconClass: 'green' as const, filterKey: 'active'   },
    { label: 'Inactive', value: data.filter((d) => d.isActive === 'N').length, icon: '⏸️', iconClass: 'amber' as const, filterKey: 'inactive' },
  ]
```

- `iconClass` must have `as const` so TypeScript accepts the literal type.
- `filterKey` ties the card to a chip — clicking the card activates that chip.
- Leave out `filterKey` for a stat that is just informational (no click action).

---

### 5 — Build `filterChips` array (inside the component)

```tsx
  const filterChips = [
    { key: 'all',      label: 'All',      chipClass: 'lp-chip-blue'  },
    {
      key: 'active',
      label: 'Active',
      chipClass: 'lp-chip-green',
      // filterFn parameter MUST be Record<string, unknown> — cast inside
      filterFn: (r: Record<string, unknown>) => (r as YourFetchedType).isActive === 'Y',
    },
    {
      key: 'inactive',
      label: 'Inactive',
      chipClass: 'lp-chip-amber',
      filterFn: (r: Record<string, unknown>) => (r as YourFetchedType).isActive === 'N',
    },
  ]
```

> **TypeScript note:** `filterFn` must accept `Record<string, unknown>` — that is how `ListingPage.d.ts` declares it.
> Cast with `as YourFetchedType` inside to access your specific fields.

Available chip colour classes:
`lp-chip-blue` `lp-chip-green` `lp-chip-amber` `lp-chip-purple` `lp-chip-teal` `lp-chip-red`

---

### 6 — Write your action handlers

```tsx
  // Open modal in View mode
  function handleView(row: YourFetchedType) {
    setMode('View')
    setId(Number(row.yourID))
    openModal()
  }

  // Open modal in Edit mode
  function handleEdit(row: YourFetchedType) {
    setMode('Edit')
    setId(Number(row.yourID))
    openModal()
  }

  // Soft-delete: fetch fresh data, patch usedFor → 'D', save
  async function handleDelete(row: YourFetchedType) {
    setMode('Delete')
    const fetched = await fetchById(Number(row.yourID))
    await createAsync({ ...fetched, usedFor: 'D' })
  }

  // Open modal in Create mode
  function handleCreate() {
    setMode('Create')
    clearID()
    openModal()
  }
```

---

### 7 — Return the JSX

```tsx
  return (
    <>
      <ListingPage<YourFetchedType>
        title="Your Master"
        subtitle="Manage your records · SAP Business One integrated"
        titleIcon="📋"
        rowData={data}
        columns={COLUMNS}
        rowKey="yourID"            {/* unique key field — must exist in YourFetchedType */}
        loading={isLoading}
        stats={stats}
        filterChips={filterChips}
        defaultFilter="all"
        searchPlaceholder="Search by name, code…"
        searchFields={['name', 'code']}   {/* fields to search; [] = search all */}
        defaultSortCol="displayOrder"
        pageSize={8}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        primaryAction={{ label: '+ New Record', onClick: handleCreate }}
      />
      <YourModal />
    </>
  )
}

export default YourTable
```

---

## Complete Skeleton (copy-paste template)

```tsx
// YourMasterTable.tsx

import { useCreateYour }       from '../../hooks_api/useCreateYour'
import { useYourMasterData }   from '../../hooks_api/useYourMasterData'
import { useFetchYourById }    from '../../hooks_api/useYourMasterDataById'
import { useYourDataStore }    from '../../store/useYourDataStore'
import { useYourMaster }       from '../../store/useYourMaster'
import YourModal               from '../YourModal/YourModal'

import ListingPage, { ColumnDef } from '@/components/ListingTable/ListingPage'
import { YourFetchedType }        from '@/types/yourType'

// ─── 1. Columns ──────────────────────────────────────────────────────────────
const COLUMNS: ColumnDef<YourFetchedType>[] = [
  { field: 'id',   header: 'ID',   width: '80px' },
  { field: 'name', header: 'Name', type: 'link'  },
  { field: 'code', header: 'Code', type: 'code'  },
  {
    field: 'isActive',
    header: 'Status',
    type: 'badge',
    width: '100px',
    badgeMap: {
      Y: { variant: 'success', label: 'Active',   dot: true },
      N: { variant: 'warning', label: 'Inactive', dot: true },
    },
  },
]

// ─── 2. Component ─────────────────────────────────────────────────────────────
function YourMasterTable() {
  const { yourData, isLoading } = useYourMasterData()
  const openModal  = useYourMaster((state) => state.toggleOpen)
  const setMode    = useYourMaster((state) => state.setMode)
  const clearID    = useYourDataStore((state) => state.clearCurrentId)
  const setId      = useYourDataStore((state) => state.setCurrentId)
  const { fetchById }   = useFetchYourById()
  const { createAsync } = useCreateYour()

  const data = yourData ?? []

  // ── 3. Stats
  const stats = [
    { label: 'Total',    value: data.length,                                   icon: '📋', iconClass: 'blue'  as const, filterKey: 'all'      },
    { label: 'Active',   value: data.filter((d) => d.isActive === 'Y').length, icon: '✅', iconClass: 'green' as const, filterKey: 'active'   },
    { label: 'Inactive', value: data.filter((d) => d.isActive === 'N').length, icon: '⏸️', iconClass: 'amber' as const, filterKey: 'inactive' },
  ]

  // ── 4. Filter chips
  const filterChips = [
    { key: 'all',      label: 'All',      chipClass: 'lp-chip-blue'  },
    { key: 'active',   label: 'Active',   chipClass: 'lp-chip-green',  filterFn: (r: Record<string, unknown>) => (r as YourFetchedType).isActive === 'Y' },
    { key: 'inactive', label: 'Inactive', chipClass: 'lp-chip-amber',  filterFn: (r: Record<string, unknown>) => (r as YourFetchedType).isActive === 'N' },
  ]

  // ── 5. Handlers
  function handleView(row: YourFetchedType) { setMode('View');   setId(Number(row.id)); openModal() }
  function handleEdit(row: YourFetchedType) { setMode('Edit');   setId(Number(row.id)); openModal() }
  async function handleDelete(row: YourFetchedType) {
    setMode('Delete')
    const fetched = await fetchById(Number(row.id))
    await createAsync({ ...fetched, usedFor: 'D' })
  }
  function handleCreate() { setMode('Create'); clearID(); openModal() }

  // ── 6. Render
  return (
    <>
      <ListingPage<YourFetchedType>
        title="Your Master"
        subtitle="Manage your records · SAP Business One integrated"
        titleIcon="📋"
        rowData={data}
        columns={COLUMNS}
        rowKey="id"
        loading={isLoading}
        stats={stats}
        filterChips={filterChips}
        defaultFilter="all"
        searchPlaceholder="Search by name, code…"
        searchFields={['name', 'code']}
        defaultSortCol="id"
        pageSize={8}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        primaryAction={{ label: '+ New Record', onClick: handleCreate }}
      />
      <YourModal />
    </>
  )
}

export default YourMasterTable
```

---

## Column Type Cheat-Sheet

| `type` | What it renders | Extra props |
|--------|----------------|-------------|
| _(none)_ | Plain string | — |
| `"code"` | Monospace blue text | `isLink: true` → clickable, calls `onView` |
| `"link"` | Blue underline, calls `onView` | — |
| `"date"` | `YYYY-MM-DD` → `DD-MM-YYYY` | — |
| `"number"` | `en-IN` locale e.g. `12,000` | — |
| `"currency"` | `₹ 1,20,000` | — |
| `"badge"` | Colored pill | `badgeMap` or `badgeFn` |
| `"boolean"` | Green/Amber badge | `trueLabel`, `falseLabel` |
| `"checkbox"` | Read-only checkbox | — |
| _(custom)_ | Any JSX | `render: (val, row) => JSX` |

**Badge variants:** `success` `warning` `error` `info` `purple` `teal` `neutral`

---

## Common TypeScript Gotchas

| Problem | Fix |
|---------|-----|
| `iconClass` type error on stats | Add `as const` → `'blue' as const` |
| `filterFn` type error on chips | Parameter must be `Record<string, unknown>`, cast inside |
| `ListingPage` import not found by TS | `ListingPage.d.ts` is already in `src/components/ListingTable/` — just import normally |
| Generic `<T>` not inferred | Write `<ListingPage<YourFetchedType> ...>` explicitly |

---

## Real Example — PaymodeTable.tsx

See the live implementation at:

```
src/app/pages/Root/Administration/Master/PayModeMaster/
  components/PaymodeTable/PaymodeTable.tsx
```

That file is the reference implementation of everything described above.
