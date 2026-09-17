# Organization Policy - Form Validation Guide

## How the Validation Works (Step by Step)

---

### 1. Error State (`errors`)

```js
const [errors, setErrors] = useState({});
```

This is a simple object that stores error messages. When empty `{}`, there are no errors.  
When a field has an error, it looks like:

```js
{
  pendingSettlenmentDays: "Pending Settlement Days is required",
  orderValidityDays: "Order Validity Days is required"
}
```

The **key** is the field name, and the **value** is the error message shown to the user.

---

### 2. Active Tab State (`activeTab`)

```js
const [activeTab, setActiveTab] = useState('general');
```

Previously, `Tabs` used `defaultValue="general"` (uncontrolled).  
Now it uses `value={activeTab}` (controlled), so we can **programmatically switch tabs** when validation fails on a different tab.

```jsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
```

---

### 3. Validation Rules (inside `handleSave`)

```js
const validationRules = [
    { field: 'pendingSettlenmentDays',   value: GeneralData.pendingSettlenmentDays,   tab: 'general',            label: 'Pending Settlement Days' },
    { field: 'maximumAllowableDiscount', value: GeneralData.maximumAllowableDiscount, tab: 'general',            label: 'Maximum Allowable Discount Policy' },
    { field: 'maximumBillingAmount',     value: GeneralData.maximumBillingAmount,     tab: 'general',            label: 'Maximum Billing Amount' },
    { field: 'orderValidityDays',        value: PosOrderData.orderValidityDays,       tab: 'posOrder',           label: 'Order Validity Days' },
    // ... more rules
];
```

Each rule has 4 properties:

| Property | Purpose |
|----------|---------|
| `field`  | The state key name (used to match input and clear error) |
| `value`  | The current value from state (checked if empty) |
| `tab`    | Which tab this field belongs to (for auto-switching) |
| `label`  | Human-readable name (used in error message) |

---

### 4. Validation Loop

```js
const newErrors = {};
let firstErrorTab = null;
let firstErrorField = null;

for (const rule of validationRules) {
    const isEmpty = rule.value === '' || rule.value === null || rule.value === undefined;
    if (isEmpty) {
        // Store error message
        newErrors[rule.field] = `${rule.label} is required`;

        // Track the FIRST error (for focus)
        if (!firstErrorTab) {
            firstErrorTab = rule.tab;
            firstErrorField = rule.field;
        }
    }
}
```

**What happens here:**
- Loops through every rule
- Checks if the value is empty (`''`), `null`, or `undefined`
- If empty → adds an error message to `newErrors`
- Remembers the **first** error's tab and field name (only the first one, because `firstErrorTab` is only set once)

---

### 5. If Errors Exist → Stop Submission, Switch Tab, Focus Field

```js
if (Object.keys(newErrors).length > 0) {
    // Step A: Save all errors to state (triggers re-render with red borders + messages)
    setErrors(newErrors);

    // Step B: Switch to the tab that has the first error
    if (firstErrorTab) {
        setActiveTab(firstErrorTab);
    }

    // Step C: After React re-renders (150ms delay), find and focus the first error input
    setTimeout(() => {
        const el = document.querySelector(`[data-field="${firstErrorField}"]`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus();
        }
    }, 150);

    return; // STOP - don't call the API
}
```

**Why `setTimeout` with 150ms?**  
When we call `setActiveTab(firstErrorTab)`, React needs time to:
1. Re-render the component
2. Show the correct tab content
3. Mount the input elements in the DOM

Only AFTER that can we find the input with `document.querySelector` and focus it.

---

### 6. How `data-field` Attribute Works

In each child component, inputs have a special attribute:

```jsx
<input
    data-field="pendingSettlenmentDays"    // ← This connects input to validation
    type="number"
    value={props.data.pendingSettlenmentDays}
    ...
/>
```

When we need to focus this input, we use:

```js
document.querySelector('[data-field="pendingSettlenmentDays"]')
```

This finds the exact input element in the DOM.

---

### 7. Showing Error Messages in Child Components

Each child component receives the `errors` prop:

```jsx
<General data={GeneralData} onFieldChange={handleGeneralDataChange} errors={errors} />
```

Inside the child, below each input:

```jsx
<input
    data-field="pendingSettlenmentDays"
    className={`w-full px-3 py-2 text-sm border rounded-md ...
        ${props.errors?.pendingSettlenmentDays ? 'border-red-500' : 'border-gray-300'}`}
/>
{props.errors?.pendingSettlenmentDays && (
    <p className="text-red-500 text-xs mt-1">{props.errors.pendingSettlenmentDays}</p>
)}
```

**Two things happen when there's an error:**
1. **Red border**: `border-red-500` replaces `border-gray-300`
2. **Error text**: A red `<p>` tag appears below the input with the message

**`props.errors?.pendingSettlenmentDays`** — the `?.` (optional chaining) prevents crashes if `errors` is undefined.

---

### 8. Clearing Errors on User Input

```js
const handleGeneralDataChange = (fieldName, value) => {
    setGeneralData(prev => ({ ...prev, [fieldName]: value }));
    // If this field had an error, remove it immediately
    if (errors[fieldName]) setErrors(prev => ({ ...prev, [fieldName]: undefined }));
};
```

As soon as the user types in a field, its error is **cleared instantly**. This gives real-time feedback — the red border and message disappear the moment they start fixing it.

---

## Visual Flow

```
User clicks "Submit"
        │
        ▼
┌─────────────────────────┐
│  Loop through all rules │
│  Check if value is empty│
└────────┬────────────────┘
         │
    ┌────▼────┐
    │ Errors? │
    └────┬────┘
         │
    YES  │  NO
    ▼    │   ▼
┌────────┐  ┌──────────────┐
│ Set     │  │ Clear errors │
│ errors  │  │ Call API     │
│ state   │  └──────────────┘
└────┬───┘
     │
     ▼
┌──────────────────────┐
│ Switch to first      │
│ error's tab          │
└────────┬─────────────┘
         │
         ▼ (after 150ms)
┌──────────────────────┐
│ Find input by        │
│ data-field attribute │
│ Scroll + Focus it    │
└──────────────────────┘
```

---

## Example Scenario

1. User is on **POS Order** tab
2. User fills `orderValidityDays` but leaves **Pending Settlement Days** (General tab) empty
3. User clicks **Submit**
4. Validation finds `pendingSettlenmentDays` is empty → first error is on `general` tab
5. Tab auto-switches to **General**
6. Red border appears on "Pending Settlement Days" input
7. Error message "Pending Settlement Days is required" shows below it
8. Input gets focused and scrolled into view
9. User types a value → red border and error message disappear immediately

---

## How to Add Validation for a New Field

If you add a new field in the future, just add one line to `validationRules`:

```js
{ field: 'newFieldName', value: SomeData.newFieldName, tab: 'tabName', label: 'Display Label' },
```

And in the child component's input, add:
```jsx
<input
    data-field="newFieldName"
    className={`... ${props.errors?.newFieldName ? 'border-red-500' : 'border-gray-300'}`}
/>
{props.errors?.newFieldName && <p className="text-red-500 text-xs mt-1">{props.errors.newFieldName}</p>}
```

That's it! The validation system is fully data-driven.
