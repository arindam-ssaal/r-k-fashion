# Project Flows

## Table of Contents:

1. [Admin Flows](#admin-flows)
2. [Manager Flows](#manager-flows)
3. [Store Manager Flows](#store-manager-flows)
4. [Cashier Flows](#cashier-flows)

---

## Admin Flows

_This section will contain admin-specific workflows. For now, it's empty, but you can add admin flows here in the future._

---

## Manager Flows

_This section will contain manager-specific workflows. For now, it's empty, but you can add manager flows here in the future._

---

## Store Manager Flows

_This section will contain store manager-specific workflows. For now, it's empty, but you can add store manager flows here in the future._

---

## Cashier Flows

#### Flow Summary:

This document outlines the flow for the **Cashier** role in the POS system.

## Flow Summary:

## Detailed Steps:

### 1. Cashier Logs In

- Cashier navigates to the POS portal and logs in with their credentials (email and password).

### 2. Session Opening Modal Appears

- After logging in, the cashier sees a modal prompting them to **open their session**.
- Cashier clicks "Start Session" to begin their workday.

### 3. Dashboard Loads (Billing Section)

- Once the session starts, the **billing dashboard** is loaded.
- The **sidebar** contains only:
  - **Billing**
  - **Open/Close Session**
  - **Recent Transactions**
- The **header** contains:
  - **Search Product**
  - **Logout**
  - **Help (optional)**

### 4. Cashier Scans Products

- Cashier starts scanning products for a customer.
- Each product is added to the **billing list** (visible on the left).
- The product details (such as images and descriptions) are shown on the right.

### 5. Customer Requests for Product Availability

- If the customer asks for product details or availability, the cashier clicks **"Search Product"** from the header.
- A modal opens where the cashier can search for products and add them directly to the billing list.

### 6. Review Bill and Apply Discounts

- Once all products are scanned, the cashier reviews the final bill.
- If applicable, the cashier applies any **discounts** or **promotions** from the billing UI.

### 7. Checkout Process

- Cashier clicks the **Checkout** button.
- A modal appears with **payment options**:
  - **Cash**
  - **Credit/Debit Card**
  - **UPI**
  - **Other Payment Methods**
- Cashier selects the appropriate payment method, or processes multiple payments if requested by the customer (e.g., split between card and cash).

### 8. Complete Transaction

- Once the payment is complete, the cashier confirms the transaction.
- The system records the sale, updates inventory, and prints or emails a receipt.

### 9. Session Closing

- At the end of the shift or when the cashier is done, they can click **"Close Session"** from the sidebar.
- The system closes the cashier’s session, logs their activities, and prepares them for logout.

### 10. Cashier Logs Out

- The cashier clicks **"Logout"** from the header when they finish their shift.

## Edge Case: Cashier Logs In Before Store Manager Opens Day

### Cashier Logs In Before Store Manager

- If the **store manager hasn’t opened the day**, the cashier logs in and sees a notification or modal stating: **"Please wait for the store manager to open the day."**
- The cashier is unable to start their session or access billing until the store manager opens the day.

### Once the Store Manager Opens the Day:

- The cashier is then prompted with the **"Session Opening"** modal, and the workflow resumes as usual.
