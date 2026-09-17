import { BadgeDollarSign, BookText, Presentation, Settings, FileText, Table } from 'lucide-react'
import { ReactNode } from 'react'

export interface SubItem {
  name: string
  path: string
  subItems?: SubItem[] // Allows further nesting of subItems if required, without icons.
}

export interface SidebarItem {
  name: string
  path: string
  icon: ReactNode
  subItems?: SubItem[] // Sub-items now do not have icons.
}

export interface RoleBasedMenu {
  admin: SidebarItem[]
  manager: SidebarItem[]
  storemanager: SidebarItem[]
  cashier: SidebarItem[]
}

export const roleBasedMenu: RoleBasedMenu = {
  admin: [
    // {
    //   name: 'Dashboard',
    //   path: '/dashboard',
    //   icon: <FileText />,
    // },
    {
      name: 'Administration',
      path: '/administration',
      icon: <Settings />,
      subItems: [
        {
          name: 'Security',
          path: '/administration/security',

          subItems: [
            {
              name: 'Designation',
              path: '/administration/security/designation',
            },
            {
              name: 'Create Role',
              path: '/administration/security/create-role',
            },
            // {
            //   name: 'Role Defination',
            //   path: '/administration/security/role-defination',
            // },
            // {
            //   name: 'User Profile Creation',
            //   path: '/administration/security/user-profile-creation',
            // },
            {
              name: 'Change Password',
              path: '/administration/security/change-password',
            },
            {
              name: 'User Master',
              path: '/administration/security/user-master',
            },
            {
              name: 'Authorisation Matrix',
              path: '/administration/security/authorisation-matrix',
            },
            // {
            //   name: 'FottFall Entry',
            //   path: '/administration/security/footfall-entry',
            // },
          ],
        },
        {
          name: 'Setup',
          path: '/administration/setup',
          subItems: [
            {
              name: 'Policy',
              path: '/administration/setup/policy',
              subItems: [
                // {
                //   name: 'Organization Policy',
                //   path: '/administration/setup/policy/organization-policy',
                // },
                {
                  name: 'Organization Policy',
                  path: '/administration/setup/policy/organization-policy-2',
                },
                // {
                //   name: 'Store Wise Policy',
                //   path: '/administration/setup/policy/store-wise-policy',
                // },
                {
                  name: 'Store Wise Policy',
                  path: '/administration/setup/policy/store-wise-policy-2',
                }
              ],
            },
            {
              name: 'Discount',
              path: '/administration/setup/discount',
              subItems: [
                {
                  name: 'Assortment Management (Discount)',
                  path: '/administration/setup/discount/assortment-management-discount',
                },
                {
                  name: 'Discount Setup',
                  path: '/administration/setup/discount/discount-setup',
                },
                {
                  name: 'Discount Allocation',
                  path: '/administration/setup/discount/discount-allocation',
                },
              ],
            },

            {
              name: 'Promition',
              path: '/administration/setup/promotion',
              subItems: [
                {
                  name: 'Assortment Managment (Promotion)',
                  path: '/administration/setup/promotion/assortment-mangement-promotion',
                },
                {
                  name: 'Promotion Setup',
                  path: '/administration/setup/promotion/promotion-setup',
                },
                {
                  name: 'Promotion Setup Free',
                  path: '/administration/setup/promotion/promotion-setup-test',
                },
                {
                  name: 'Promotion Allocation',
                  path: '/administration/setup/promotion/promotion-allocation',
                },
                {
                  name: 'Promotion Priorty Setup',
                  path: '/administration/setup/promotion/promotion-priority-setup',
                },
                {
                  name: 'Quantity Slab Benefit',
                  path: '/administration/setup/promotion/qty-slab',
                },
                {
                  name: 'Bill Value Slab Benefit',
                  path: '/administration/setup/promotion/bill-slab',
                },
                {
                  name: 'Assortment For Promotion',
                  path: '/administration/setup/promotion/assortment-for-promotion',
                },
                {
                  name: 'Promotion Priority Setup',
                  path: '/administration/setup/promotion/promotion-priority',
                }
              ],
            },
            {
              name: 'Sales Person Incentive',
              path: '/administration/setup/salesperson-incentive',
              subItems: [
                // {
                //   name: 'Assortment Managment (Incentive)',
                //   path: '/administration/setup/salesperson-incentive/assortment-managemnt-incentive',
                // },
                // {
                //   name: 'Assortment Allocation for Incentive',
                //   path: '/administration/setup/salesperson-incentive/storewise-assortment-allocation',
                // },
                {
                  name: 'Sales Person Incentive',
                  path: '/administration/setup/salesperson-incentive/salesperson-incentive-new',
                },
                {
                  name: 'Sales Person Incentive Allocation',
                  path: '/administration/setup/salesperson-incentive/salesperson-incentive-allocation-new',
                }
              ],
            },
            // { name: 'Generic Policy', path: '/administration/setup/generic-policy' },
            // { name: 'Store Specific Policy', path: '/administration/setup/store-specific-policy' },
            // { name: 'Discount Policy', path: '/administration/setup/discount-policy' },
            // { name: 'Petty Cash Heads', path: '/administration/setup/petty-cash-heads' },
            // { name: 'Organization Policy', path: '/administration/setup/general-setup-option' },
            // { name: 'Store Specific Policy', path: '/administration/setup/storewise-setup-option' },
          ],
        },
        // {
        //   name: 'Loyality',
        //   path: '/administration/loyality',
        //   subItems: [
        //     {
        //       name: 'Membership Type',
        //       path: '/administration/loyality/membership-type-setup',
        //     },
        //     {
        //       name : 'Membership Details',
        //       path: '/administration/loyality/membership-details',
        //     },
        //     {
        //       name: 'Membership Card Generator',
        //       path: '/administration/loyality/membership-card-generator',
        //     }
        //   ]
        // },
        {
          name: 'Master',
          path: '/administration/master',
          subItems: [
            { name: 'Customer Master', path: '/administration/master/customer-master' },
            { name: 'Store Master', path: '/administration/master/store-master' },
            { name: 'Pay Mode Master', path: '/administration/master/paymode-master' },
            { name: 'Petty Cash Heads', path: '/administration/master/pettycash-heads' },
            { name: 'SalesPerson Master', path: '/administration/master/salesperson-master' },
            { name: 'Item Master', path: '/administration/master/item-master' },
            { name: 'Slot Master', path: '/administration/master/slot-master' },
          ],
        },
        // {
        //   name: 'Promotions',
        //   path: '/administration/promotions',
        //   subItems: [
        //     {
        //       name: 'Assortment Managements',
        //       path: '/administration/promotions/assortment-managements',
        //     },
        //     { name: 'Promotion Setup', path: '/administration/promotions/promotion-setup' },

        //     {
        //       name: 'Assortment Promotion',
        //       path: '/administration/promotions/assortment-promotion',
        //     },
        //     {
        //       name: 'Promotion Allocation',
        //       path: '/administration/promotions/promotion-allocation',
        //     },
        //     {
        //       name: 'Promotion Priority Setup',
        //       path: '/administration/promotions/promotion-priority-setup',
        //     },
        //   ],
        // },
      ],
    },
    {
      name: 'Transaction ',
      path: '/transaction',
      icon: <Table />,
      subItems: [
        {
          name: 'Purchase',
          path: '/transaction/purchase',
          subItems: [
            {
              name: 'Purchase Request',
              path: '/transaction/purchase/purchase-request',
            },
            // {
            //   name: 'Purchase Order',
            //   path: '/transaction/purchase/purchase-order',
            // },
            {
              name: 'GRPO',
              path: '/transaction/purchase/grpo',
            },
            // {
            //   name: 'A/P Invoice',
            //   path: '/transaction/purchase/ap-invoice',
            // },
          ],
        },
        {
          name: 'Inventory ',
          path: '/transaction/inventory',
          subItems: [
            {
              name: 'Inventory transfer Request',
              path: '/transaction/inventory/inventory-transfer-request',
            },
            {
              name: 'Inventory transfer',
              path: '/transaction/inventory/inventory-transfer',
            },
            {
              name: 'Goods Receipt',
              path: '/transaction/inventory/goods-receipt',
            },
            {
              name: 'Goods Issue',
              path: '/transaction/inventory/goods-issue',
            },
            // {
            //   name: 'Goods Receipt @ Store',
            //   path: '/transaction/inventory/goodsReceipt-store',
            // },
          ],
        },
        {
          name: 'Billing',
          path: '/transaction/billing',
          subItems: [
            // {
            //   name: 'Billing @ Request',
            //   path: '/transaction/billing/billing-request',
            // },
            {
              name: 'Billing @ Request',
              path: '/transaction/billing/billing-request-2',
            },
            // {
            //   name: 'Billing @ Return',
            //   path: '/transaction/billing/billing-return',
            // },
            {
              name: 'Billing @ Return',
              path: '/transaction/billing/billing-return-2',
            },
            {
              name: 'Petty Cash Expense',
              path: '/transaction/billing/petty-cash-expense',
            },
            {
              name: 'FootFall Entry',
              path: '/transaction/billing/footfall-entry',
            },
            // {
            //   name: 'Billing @ Return',
            //   path: '/transaction/billing/billing-return',
            //   subItems: [
            //     // {
            //     //   name: 'Billing @ Return',
            //     //   path: '/transaction/billing/billing-return'
            //     // }
            //   ],
            // },
            {
              name: 'Sessions',
              path: '/transaction/billing/sessions',
              subItems: [
                {
                  name: 'Session Open',
                  path: '/transaction/billing/sessions/session-open'
                },
                {
                  name: 'Session Close',
                  path: '/transaction/billing/sessions/session-close'
                },
              ],
            },
          ],
        },
        //!Tailormate menu items are commented as they are not required as of now. Will be added when needed.
        // {
        //   name: 'Tailormate',
        //   path: '/transaction/tailormate',
        //   subItems: [
        //     {
        //       name: 'New Order',
        //       path: '/transaction/tailormate/new-order',
        //     },
        //   ],
        // },
      ],
    },
    // {
    //   name: 'Reports',
    //   path: '/reports',
    //   icon: <BookText />,
    // },
    {
      name: 'Reports',
      path: '/reports',
      icon: <BookText />,
      subItems: [
        {
          name: 'POS Bill Register',
          path: '/reports/pos-bill-register',
        },
        {
          name: 'Credit Note Register',
          path: '/reports/credit-note-register',
        },
        {
          name: 'Paymode wise Collection',
          path: '/reports/paymode-wise-collection',
        },
        {
          name: 'User wise Paymode wise Collection',
          path: '/reports/user-wise-paymode-wise-collection',
        },
        {
          name: 'Item wise Sales',
          path: '/reports/item-wise-sales',
        },
        {
          name: 'User Wise Summary',
          path: '/reports/user-wise-summary',
        },
        {
          name: 'Credit Note Adjustment Register',
          path: '/reports/credit-note-adjustment-register',
        },
        {
          name: 'Day Summary',
          path: '/reports/day-summary',
        },
        {
          name: 'Daily Sales Stock Summary Report',
          path: '/reports/daily-sales-stock-summary-report',
        },
        {
          name: 'Division wise Sales Stock Report',
          path: '/reports/division-wise-sales-stock-report',
        },
        {
          name: 'Daily Sales Report',
          path: '/reports/daily-sales-report',
        },
        {
          name: 'Stock Sales Report (Excel)',
          path: '/reports/stock-sales-report-excel',
        },
        {
          name: 'Paymode wise Bill',
          path: '/reports/paymode-wise-bill',
        },
        {
          name: 'Petty Cash Expense',
          path: '/reports/petty-cash-expense',
        },
        {
          name: 'Store Wise Day Status',
          path: '/reports/store-wise-day-status',
        },
        {
          name: 'Hourly Sales Report',
          path: '/reports/hourly-sales-report',
        },
        {
          name: 'Store Wise Sales Return',
          path: '/reports/store-wise-sales-return',
        },
        {
          name: 'Promotion Wise Report',
          path: '/reports/promotion-wise-report',
        },
        {
          name: 'Item History Report',
          path: '/reports/item-history-report',
        },
        {
          name: 'Target Wise Sales Report',
          path: '/reports/target-wise-sales-report',
        },
        {
          name: 'Sale Tree Report',
          path: '/reports/sale-tree-report',
        },
        {
          name: 'Memo Wise Sales Report',
          path: '/reports/memo-wise-sales-report',
        },
        {
          name: 'Customer Master Report',
          path: '/reports/customer-master-report',
        },
        {
          name: 'Daily Cash Report',
          path: '/reports/daily-cash-report',
        },
        {
          name: 'Voucher Report',
          path: '/reports/voucher-report',
        }
      ],
    },
    {
      name: 'Utilities',
      path: '/utilities',
      icon: <Presentation />,
    },
    {
      name: 'Help',
      path: '/help',
      icon: <Presentation />,
    },
  ],
  manager: [
    // {
    //   name: 'Dashboard',
    //   path: '/dashboard',
    //   icon: <FileText />,
    //   subItems: [
    //     { name: 'Consolidated', path: '/dashboard/consolidated' },
    //     { name: 'Store Wise', path: '/dashboard/store-wise' },
    //   ],
    // },
    // {
    //   name: 'Administration',
    //   path: '/administration',
    //   icon: <Settings />,
    //   subItems: [
    //     {
    //       name: 'Security',
    //       path: '/administration/security',

    //       subItems: [
    //         {
    //           name: 'Designation',
    //           path: '/administration/security/designation',
    //         },
    //         {
    //           name: 'Create Role',
    //           path: '/administration/security/create-role',
    //         },
    //         {
    //           name: 'Role Defination',
    //           path: '/administration/security/role-defination',
    //         },
    //         {
    //           name: 'User Profile Creation',
    //           path: '/administration/security/user-profile-creation',
    //         },
    //         {
    //           name: 'Change Password',
    //           path: '/administration/security/change-password',
    //         },
    //         {
    //           name: 'User Master',
    //           path: '/administration/security/user-master',
    //         },
    //       ],
    //     },
    //     {
    //       name: 'Setup',
    //       path: '/administration/setup',
    //       subItems: [
    //         {
    //           name: 'Policy',
    //           path: '/administration/setup/policy',
    //           subItems: [
    //             {
    //               name: 'Organization Policy',
    //               path: '/administration/setup/policy/organization-policy',
    //             },
    //             {
    //               name: 'Store Wise Policy',
    //               path: '/administration/setup/policy/store-wise-policy',
    //             },
    //           ],
    //         },
    //         {
    //           name: 'Discount',
    //           path: '/administration/setup/discount',
    //           subItems: [
    //             {
    //               name: 'Assortment Management (Discount)',
    //               path: '/administration/setup/discount/assortment-management-discount',
    //             },
    //             {
    //               name: 'Discount Setup',
    //               path: '/administration/setup/discount/discount-setup',
    //             },
    //             {
    //               name: 'Discount Allocation',
    //               path: '/administration/setup/discount/discount-allocation',
    //             },
    //           ],
    //         },

    //         {
    //           name: 'Promotion',
    //           path: '/administration/setup/promotion',
    //           subItems: [
    //             {
    //               name: 'Assortment Managment (Promotion)',
    //               path: '/administration/setup/promotion/assortment-mangement-promotion',
    //             },
    //             {
    //               name: 'Promotion Setup',
    //               path: '/administration/setup/promotion/promotion-setup',
    //             },
    //             {
    //               name: 'Promotion Setup Free',
    //               path: '/administration/setup/promotion/promotion-setup-test',
    //             },
    //             {
    //               name: 'Promotion Allocation',
    //               path: '/administration/setup/promotion/promotion-allocation',
    //             },
    //             {
    //               name: 'Promotion Priorty Setup',
    //               path: '/administration/setup/promotion/promotion-priority-setup',
    //             },
    //             {
    //               name: 'Quantity Slab Benefit',
    //               path: '/administration/setup/promotion/qty-slab',
    //             },
    //             {
    //               name: 'Bill Value Slab Benefit',
    //               path: '/administration/setup/promotion/bill-slab',
    //             },
    //             {
    //               name: 'Assortment For Promotion',
    //               path: '/administration/setup/promotion/assortment-for-promotion',
    //             }
    //           ],
    //         },
    //         {
    //           name: 'Sales Person Incentive',
    //           path: '/administration/setup/salesperson-incentive',
    //           subItems: [
    //             {
    //               name: 'Assortment Managment (Incentive)',
    //               path: '/administration/setup/salesperson-incentive/assortment-managemnt-incentive',
    //             },
    //             {
    //               name: 'Assortment Allocation for Incentive',
    //               path: '/administration/setup/salesperson-incentive/storewise-assortment-allocation',
    //             },
    //           ],
    //         },
    //         // { name: 'Generic Policy', path: '/administration/setup/generic-policy' },
    //         // { name: 'Store Specific Policy', path: '/administration/setup/store-specific-policy' },
    //         // { name: 'Discount Policy', path: '/administration/setup/discount-policy' },
    //         // { name: 'Petty Cash Heads', path: '/administration/setup/petty-cash-heads' },
    //         // { name: 'Organization Policy', path: '/administration/setup/general-setup-option' },
    //         // { name: 'Store Specific Policy', path: '/administration/setup/storewise-setup-option' },
    //       ],
    //     },
    //     {
    //       name: 'Master',
    //       path: '/administration/master',
    //       subItems: [
    //         { name: 'Customer Master', path: '/administration/master/customer-master' },
    //         { name: 'Store Master', path: '/administration/master/store-master' },
    //         { name: 'Pay Mode Master', path: '/administration/master/paymode-master' },
    //         { name: 'Petty Cash Heads', path: '/administration/master/pettycash-heads' },
    //         { name: 'SalesPerson Master', path: '/administration/master/salesperson-master' },
    //         { name: 'Item Master', path: '/administration/master/item-master' },
    //         { name: 'Slot Master', path: '/administration/master/slot-master' },
    //       ],
    //     },
    //     // {
    //     //   name: 'Promotions',
    //     //   path: '/administration/promotions',
    //     //   subItems: [
    //     //     {
    //     //       name: 'Assortment Managements',
    //     //       path: '/administration/promotions/assortment-managements',
    //     //     },
    //     //     { name: 'Promotion Setup', path: '/administration/promotions/promotion-setup' },

    //     //     {
    //     //       name: 'Assortment Promotion',
    //     //       path: '/administration/promotions/assortment-promotion',
    //     //     },
    //     //     {
    //     //       name: 'Promotion Allocation',
    //     //       path: '/administration/promotions/promotion-allocation',
    //     //     },
    //     //     {
    //     //       name: 'Promotion Priority Setup',
    //     //       path: '/administration/promotions/promotion-priority-setup',
    //     //     },
    //     //   ],
    //     // },
    //   ],
    // },
    {
      name: 'Transaction ',
      path: '/transaction',
      icon: <Table />,
      subItems: [
        {
          name: 'Purchase',
          path: '/transaction/purchase',
          subItems: [
            {
              name: 'Purchase Request',
              path: '/transaction/purchase/purchase-request',
            },
            // {
            //   name: 'Purchase Order',
            //   path: '/transaction/purchase/purchase-order',
            // },
            {
              name: 'GRPO',
              path: '/transaction/purchase/grpo',
            },
            // {
            //   name: 'A/P Invoice',
            //   path: '/transaction/purchase/ap-invoice',
            // },
          ],
        },
        {
          name: 'Inventory ',
          path: '/transaction/inventory',
          subItems: [
            {
              name: 'Inventory transfer Request',
              path: '/transaction/inventory/inventory-transfer-request',
            },
            {
              name: 'Inventory transfer',
              path: '/transaction/inventory/inventory-transfer',
            },
            {
              name: 'Goods Receipt',
              path: '/transaction/inventory/goods-receipt',
            },
            {
              name: 'Goods Issue',
              path: '/transaction/inventory/goods-issue',
            },
            // {
            //   name: 'Goods Receipt @ Store',
            //   path: '/transaction/inventory/goodsReceipt-store',
            // },
          ],
        },
        {
          name: 'Billing',
          path: '/transaction/billing',
          subItems: [
            // {
            //   name: 'Billing @ Request',
            //   path: '/transaction/billing/billing-request',
            // },
            {
              name: 'Billing @ Request',
              path: '/transaction/billing/billing-request-2',
            },
            // {
            //   name: 'Billing @ Return',
            //   path: '/transaction/billing/billing-return',
            // },
            {
              name: 'Billing @ Return',
              path: '/transaction/billing/billing-return-2',
            },
            {
              name: 'Petty Cash Expense',
              path: '/transaction/billing/petty-cash-expense',
            },
            {
              name: 'FootFall Entry',
              path: '/transaction/billing/footfall-entry',
            },
            // {
            //   name: 'Billing @ Return',
            //   path: '/transaction/billing/billing-return',
            //   subItems: [
            //     // {
            //     //   name: 'Billing @ Return',
            //     //   path: '/transaction/billing/billing-return'
            //     // }
            //   ],
            // },
            {
              name: 'Sessions',
              path: '/transaction/billing/sessions',
              subItems: [
                {
                  name: 'Session Open',
                  path: '/transaction/billing/sessions/session-open'
                },
                {
                  name: 'Session Close',
                  path: '/transaction/billing/sessions/session-close'
                },
              ],
            },
          ],
        },
        //!Tailormate menu items are commented as they are not required as of now. Will be added when needed.
        // {
        //   name: 'Tailormate',
        //   path: '/transaction/tailormate',
        //   subItems: [
        //     {
        //       name: 'New Order',
        //       path: '/transaction/tailormate/new-order',
        //     },
        //   ],
        // },
      ],
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: <BookText />,
      subItems: [
        {
          name: 'POS Bill Register',
          path: '/reports/pos-bill-register',
        },
        {
          name: 'Credit Note Register',
          path: '/reports/credit-note-register',
        },
        {
          name: 'Paymode wise Collection',
          path: '/reports/paymode-wise-collection',
        },
        {
          name: 'User wise Paymode wise Collection',
          path: '/reports/user-wise-paymode-wise-collection',
        },
        {
          name: 'Item wise Sales',
          path: '/reports/item-wise-sales',
        },
        {
          name: 'User Wise Summary',
          path: '/reports/user-wise-summary',
        },
        {
          name: 'Credit Note Adjustment Register',
          path: '/reports/credit-note-adjustment-register',
        },
        {
          name: 'Day Summary',
          path: '/reports/day-summary',
        },
        {
          name: 'Daily Sales Stock Summary Report',
          path: '/reports/daily-sales-stock-summary-report',
        },
        {
          name: 'Division wise Sales Stock Report',
          path: '/reports/division-wise-sales-stock-report',
        },
        {
          name: 'Daily Sales Report',
          path: '/reports/daily-sales-report',
        },
        {
          name: 'Stock Sales Report (Excel)',
          path: '/reports/stock-sales-report-excel',
        },
        {
          name: 'Paymode wise Bill',
          path: '/reports/paymode-wise-bill',
        },
        {
          name: 'Petty Cash Expense',
          path: '/reports/petty-cash-expense',
        },
        {
          name: 'Store Wise Day Status',
          path: '/reports/store-wise-day-status',
        },
        {
          name: 'Hourly Sales Report',
          path: '/reports/hourly-sales-report',
        },
        {
          name: 'Store Wise Sales Return',
          path: '/reports/store-wise-sales-return',
        },
        {
          name: 'Promotion Wise Report',
          path: '/reports/promotion-wise-report',
        },
        {
          name: 'Item History Report',
          path: '/reports/item-history-report',
        },
        {
          name: 'Target Wise Sales Report',
          path: '/reports/target-wise-sales-report',
        },
        {
          name: 'Sale Tree Report',
          path: '/reports/sale-tree-report',
        },
        {
          name: 'Memo Wise Sales Report',
          path: '/reports/memo-wise-sales-report',
        },
        {
          name: 'Customer Master Report',
          path: '/reports/customer-master-report',
        },
        {
          name: 'Daily Cash Report',
          path: '/reports/daily-cash-report',
        },
        {
          name: 'Voucher Report',
          path: '/reports/voucher-report',
        }
      ],
    },
  ],
  storemanager: [
    // {
    //   name: 'Dashboard',
    //   path: '/dashboard',
    //   icon: <FileText />,
    //   subItems: [{ name: 'Store Wise', path: '/dashboard/store-wise' }],
    // },
    {
      name: 'Billing',
      path: '/billing',
      icon: <BadgeDollarSign />,
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: <BookText />,
    },
    {
      name: 'Session',
      path: '/sessions',
      icon: <Presentation />,
    },
  ],
  cashier: [
    {
      name: 'Billing',
      path: '/transaction/billing',
      icon: <BadgeDollarSign />,
      subItems: [
        // {
        //   name: 'Billing @ Request',
        //   path: '/transaction/billing/billing-request',
        // }, 
        {
          name: 'Billing @ Request',
          path: '/transaction/billing/billing-request-2',
        },       
        // {
        //   name: 'Billing @ Return',
        //   path: '/transaction/billing/billing-return',
        // },
        // {
        //   name: 'Billing @ Return',
        //   path: '/transaction/billing/billing-return-2',
        // },
        {
          name: 'Petty Cash Expense',
          path: '/transaction/billing/petty-cash-expense',
        },
        {
          name: 'FootFall Entry',
          path: '/transaction/billing/footfall-entry',
        },
        {
          name: 'Sessions',
          path: '/transaction/billing/sessions',
          subItems: [
            {
              name: 'Session Open',
              path: '/transaction/billing/sessions/session-open'
            },
            {
              name: 'Session Close',
              path: '/transaction/billing/sessions/session-close'
            },
          ],
        },
      ],
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: <BookText />,
      subItems: [
        {
          name: 'POS Bill Register',
          path: '/reports/pos-bill-register',
        },
        {
          name: 'Credit Note Register',
          path: '/reports/credit-note-register',
        },
        {
          name: 'Paymode wise Collection',
          path: '/reports/paymode-wise-collection',
        },
        {
          name: 'User wise Paymode wise Collection',
          path: '/reports/user-wise-paymode-wise-collection',
        },
        {
          name: 'Item wise Sales',
          path: '/reports/item-wise-sales',
        },
        {
          name: 'User Wise Summary',
          path: '/reports/user-wise-summary',
        },
        {
          name: 'Credit Note Adjustment Register',
          path: '/reports/credit-note-adjustment-register',
        },
        {
          name: 'Day Summary',
          path: '/reports/day-summary',
        },
        {
          name: 'Daily Sales Stock Summary Report',
          path: '/reports/daily-sales-stock-summary-report',
        },
        {
          name: 'Division wise Sales Stock Report',
          path: '/reports/division-wise-sales-stock-report',
        },
        {
          name: 'Daily Sales Report',
          path: '/reports/daily-sales-report',
        },
        {
          name: 'Stock Sales Report (Excel)',
          path: '/reports/stock-sales-report-excel',
        },
        {
          name: 'Paymode wise Bill',
          path: '/reports/paymode-wise-bill',
        },
        {
          name: 'Petty Cash Expense',
          path: '/reports/petty-cash-expense',
        },
        {
          name: 'Store Wise Day Status',
          path: '/reports/store-wise-day-status',
        },
        {
          name: 'Hourly Sales Report',
          path: '/reports/hourly-sales-report',
        },
        {
          name: 'Store Wise Sales Return',
          path: '/reports/store-wise-sales-return',
        },
        {
          name: 'Promotion Wise Report',
          path: '/reports/promotion-wise-report',
        },
        {
          name: 'Daily Cash Report',
          path: '/reports/daily-cash-report',
        },
      ],
    },
  ],
}