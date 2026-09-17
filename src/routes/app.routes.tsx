import { Navigate } from 'react-router-dom'

import ErrorPage from '@/app/pages/ErrorPage/page'
import { AdministrationLayout } from '@/app/pages/Root/Administration/layout'
import CustomerMaster from '@/app/pages/Root/Administration/Master/CustomerMaster/page'
import ItemMaster from '@/app/pages/Root/Administration/Master/ItemMaster/page'
import MasterLayout from '@/app/pages/Root/Administration/Master/layout'
import PaymodeMasterPage from '@/app/pages/Root/Administration/Master/PayModeMaster/page'
import PettyCashHead from '@/app/pages/Root/Administration/Master/PettyCashHead/page'
import SalesPersonMasterLayout from '@/app/pages/Root/Administration/Master/SalesPersonMaster/layout'
import SalesPersonMasterPage from '@/app/pages/Root/Administration/Master/SalesPersonMaster/page'
import { StoreMaster } from '@/app/pages/Root/Administration/Master/StoreMaster/page'
//import { SalesPersonTable } from '@/app/pages/Root/Administration/SalesPersonMaster/components/SalesPersonTable/SalesPersonTable'
import ChangePasswordPage from '@/app/pages/Root/Administration/Security/ChangePassword/page'
//import CreateRole from '@/app/pages/Root/Administration/Security/CreateRole/page'
import CreateRolePage from '@/app/pages/Root/Administration/Security/CreateRole/page'
import DesignationMaster from '@/app/pages/Root/Administration/Security/Designation/page'
//import FootFall from '@/app/pages/Root/Administration/Security/FootFallEntry/FootFall'
import FootFall from '@/app/pages/Root/Administration/Security/FootFallEntry/indexPage';
import SecurityLayout from '@/app/pages/Root/Administration/Security/layout'
import RoleDefination from '@/app/pages/Root/Administration/Security/RoleDefination/page'
//import UserMaster from '@/app/pages/Root/Administration/Security/UserMaster/Page'
//import UserMasterPage from '@/app/pages/Root/Administration/Security/UserMaster/Page'
import UserMasterPage from '@/app/pages/Root/Administration/Security/UserMaster/indexPage'
import AuthorisationMatrix from '@/app/pages/Root/Administration/Security/AuthorisationMatrix/indexPage'
import UserProfileCreationTable from '@/app/pages/Root/Administration/Security/UserProfileCreation/components/UserProfileCreationTable'
//import DiscountAllocation from '@/app/pages/Root/Administration/setup/discount/DiscountAllocation/page'
import DiscountListing from '@/app/pages/Root/Administration/setup/discount/DiscountAllocation/DiscountListing'
import DiscountAssortmentManagementLayout from '@/app/pages/Root/Administration/setup/discount/DiscountAssortmentManagement/layout'
import DiscountAssortmentManagementPage from '@/app/pages/Root/Administration/setup/discount/DiscountAssortmentManagement/page'
import DiscountMasterPage from '@/app/pages/Root/Administration/setup/discount/DiscountMaster/page'
import SectupLayout from '@/app/pages/Root/Administration/setup/layout'
import OrganizationPolicyPage from '@/app/pages/Root/Administration/setup/policy/OrganizationPolicy/page'
import OrganizationPolicy2 from '@/app/pages/Root/Administration/setup/policy/OrganizationPolicy2/indexPage'
import StoreSpecificPolicy from '@/app/pages/Root/Administration/setup/policy/StoreSpecificPolicy/page'
import StoreSpecificPolicy2 from '@/app/pages/Root/Administration/setup/policy/StoreSpecificPolicy2/indexPage'
import PromotionAllocationmainTable from '@/app/pages/Root/Administration/setup/promotion/PromotionAllocation/components/PromotionSelectionTable/PromotionAllocationmainTable'
//import PromotionAllocationPage from '@/app/pages/Root/Administration/setup/promotion/PromotionAllocation/page'
import PromotionAssortmentManagementPage from '@/app/pages/Root/Administration/setup/promotion/PromotionAssortmentManagement/page'
//import PromotionPrioritySetupPage from '@/app/pages/Root/Administration/setup/promotion/PromotionPrioritySetup/page'
import PromotionPrioritySetupmainTable from '@/app/pages/Root/Administration/setup/promotion/PromotionPrioritySetup/components/PromotionPrioritySetupTable/PromotionPrioritySetupmainTable'
import PromotionSetUpLayout from '@/app/pages/Root/Administration/setup/promotion/PromotionSetup/layout'
import PromotionSetUpPage from '@/app/pages/Root/Administration/setup/promotion/PromotionSetup/page'
import QuantitySlabBenefitPage from '@/app/pages/Root/Administration/setup/promotion/QuantitySlabBenefit/page'
import BillValueSlabBenefitPage from '@/app/pages/Root/Administration/setup/promotion/BillValueSlabBenefit/page'
import IncentiveAssortmentwiseIncentiveLayout from '@/app/pages/Root/Administration/setup/salesperson/IncentiveAssortmentwise/layout'
import IncentiveAssortmentwiseIncentivePage from '@/app/pages/Root/Administration/setup/salesperson/IncentiveAssortmentwise/page'
import IncentiveAssortmentManagementPage from '@/app/pages/Root/Administration/setup/salesperson/IntcentiveAssortmentManagement/page'
//import CustomerPage from '@/app/pages/Root/Customer/page'
import DashboardLayout from '@/app/pages/Root/Dashboard/layout'
import DashboardPage from '@/app/pages/Root/Dashboard/page'
import HelpLayout from '@/app/pages/Root/Help/layout'
import HelpPage from '@/app/pages/Root/Help/page'
import GoodsIssueLayout from '@/app/pages/Root/Inventroty/GoodsIssue/layout'
import GoodsIssuePage from '@/app/pages/Root/Inventroty/GoodsIssue/page'
import GoodsIssue from '@/app/pages/Root/Inventroty/GoodsIssue/page'
//import GoodsReceiptAtStore from '@/app/pages/Root/Inventroty/GoodsReceiptStore/page'
import GoodsReceiptAtStore from '@/app/pages/Root/Inventroty/GoodsReceiptStore/indexPage'
import GoodsRecieptLayout from '@/app/pages/Root/Inventroty/GoodsReciept/layout'
import GoodsRecieptPage from '@/app/pages/Root/Inventroty/GoodsReciept/page'
import GoodsReciept from '@/app/pages/Root/Inventroty/GoodsReciept/page'
import { InventoryTransferRequestLayout } from '@/app/pages/Root/Inventroty/Inventory_Transfer_Request/layout'
//import { InventoryTransferRequest } from '@/app/pages/Root/Inventroty/Inventory_Transfer_Request/page'
import { InventoryTransferRequest } from '@/app/pages/Root/Inventroty/Inventory_Transfer_Request/page'
import { InventoryTransferLayout } from '@/app/pages/Root/Inventroty/Inventroty_Transfer/layout'
import { InventoryTransfer } from '@/app/pages/Root/Inventroty/Inventroty_Transfer/page'
import { InventoryLayout } from '@/app/pages/Root/Inventroty/layout'
import RootLayout from '@/app/pages/Root/layout'
import CreditNoteAdjustmentRegisterPage from '@/app/pages/Root/Report/CreditNoteAdjustmentRegister/page'
import CreditNoteRegisterPage from '@/app/pages/Root/Report/CreditNoteRegister/page'
import DaySummaryPage from '@/app/pages/Root/Report/DaySummary/page'
import ItemWiseSalesPage from '@/app/pages/Root/Report/ItemWiseSales/page'
import PaymodeWiseCollectionPage from '@/app/pages/Root/Report/PaymodeWiseCollection/page'
import POSBillRegisterPage from '@/app/pages/Root/Report/POSBillRegister/page'
import PromotionWiseReport from '@/app/pages/Root/Report/PromotionWiseReport/page'
import ReportLayout from '@/app/pages/Root/Report/layout'
import ReportPage from '@/app/pages/Root/Report/page'
import UserWisePaymodeWiseCollectionPage from '@/app/pages/Root/Report/UserWisePaymodeWiseCollection/page'
import UserWiseSummaryPage from '@/app/pages/Root/Report/UserWiseSummary/page'
import DailySalesStockSummaryReportPage from '@/app/pages/Root/Report/DailySalesStockSummaryReport/page'
import DivisionWiseSalesStockReportPage from '@/app/pages/Root/Report/DivisionWiseSalesStockReport/page'
import DailySalesReportPage from '@/app/pages/Root/Report/DailySalesReport/page'
import StockSalesReportExcelPage from '@/app/pages/Root/Report/StockSalesReportExcel/page'
import PaymodeWiseBill from '@/app/pages/Root/Report/PaymodeWiseBill/page'
import PettyCashExpense from '@/app/pages/Root/Report/PettyCashExpense/page'
import StoreWiseDayStatus from '@/app/pages/Root/Report/StoreWiseDayStatus/page'
import HourlySalesReport from '@/app/pages/Root/Report/HourlySalesReport/page'
import StoreWiseSalesReturn from '@/app/pages/Root/Report/StoreWiseSalesReturn/page'
import MemoWiseSalesReport from '@/app/pages/Root/Report/MemoWiseDataReport/page'
import CustomerMasterReport from '@/app/pages/Root/Report/CustomermasterDataReport/page'
import DailyCashReport from '@/app/pages/Root/Report/DailyCashReport/page'
import VoucherReport from '@/app/pages/Root/Report/VoucherReport/page'

import PromotionSetupTest from '@/app/pages/Root/Administration/setup/promotion/PromotionSetupTest/page'

import SampleReportPage from '@/app/pages/Root/Report/SampleReport/page'

//import SalesLayout from '@/app/pages/Root/Sales/layout'
import SalesPersonLayout from '@/app/pages/Root/SalesPerson/layout'
//import SessionLayout from '@/app/pages/Root/Session/layout'
//import SessionPage from '@/app/pages/Root/Session/page'
//import SalesPage from '@/app/pages/Root/Transaction/Billing/Sales/page'
import BillingRequestPage from '@/app/pages/Root/Transaction/Billing/BillingRequest/indexPage';
import BillingRequest2Page from '@/app/pages/Root/Transaction/Billing/BillingRequest2/page';
import BillingReturnPage from '@/app/pages/Root/Transaction/Billing/BillingReturn/indexPage';
import BillingReturn2Page from '@/app/pages/Root/Transaction/Billing/BillingReturn2/page';
import BillingItemData from '@/app/pages/Root/Transaction/Billing/BillingItemData/page'
import BillingLayout from '@/app/pages/Root/Transaction/Billing/layout'
//import Session from '@/app/pages/Root/Transaction/Billing/Session/page'
//import SessionClosePage from '@/app/pages/Root/Transaction/Billing/Session/SessionClose/page'
import SessionClosePage from '@/app/pages/Root/Transaction/Billing/Session/SessionClose/page'
import SessionOpenPage from '@/app/pages/Root/Transaction/Billing/Session/SessionOpen/page'
import TransactionLayout from '@/app/pages/Root/Transaction/layout'
//import ApInvoice from '@/app/pages/Root/Transaction/Purchase/ApInvoice/page'
import GRPO from '@/app/pages/Root/Transaction/Purchase/GRPO/page'
//import Purchase from '@/app/pages/Root/Transaction/Purchase/page'
//import PurchaseOrder from '@/app/pages/Root/Transaction/Purchase/PurchaseOrder/page'
import PurchaseRequest from '@/app/pages/Root/Transaction/Purchase/PurchaseRequest/page'
import UtilitiesLayout from '@/app/pages/Root/Utilities/layout'
import UtilitiesPage from '@/app/pages/Root/Utilities/page'
import PettyCashExpensePage from '@/app/pages/Root/Transaction/Billing/PettyCashExpense/indexPage'

import SlotMasterPage from '@/app/pages/Root/Administration/Master/SlotMaster/indexPage'
import PromotionForAssortment from '@/app/pages/Root/Administration/setup/promotion/AssortmentForPromotion/indexPage'
import FootFallEntry from '@/app/pages/Root/Transaction/Billing/FootFallEntry/indexPage';

import ItemHistoryReport from '@/app/pages/Root/Report/ItemHistoryReport/page'
import SaleTreeReport from '@/app/pages/Root/Report/SaleTreeReport/page'
import TargetWiseSalesReport from '@/app/pages/Root/Report/TargetWiseSalesReport/page'
import path from 'path'

import SalesPersonIncentive from '@/app/pages/Root/Administration/setup/salesperson/SalesPersonIncentive/indexPage'
import SalesPersonIncentiveNew from '@/app/pages/Root/Administration/setup/salesperson/SalesPersonIncentive/page'
import SalesPersonIncentiveAllocationNew from '@/app/pages/Root/Administration/Master/SalesPersonMaster/components/SalesPersonMasterAllocation/indexPage'
import { elements } from 'chart.js'

import PromotionPriority from '@/app/pages/Root/Administration/setup/promotion/PromotionPriority/indexPage'


//! New imports for tairolmate application incormporating all the pages and layouts as per the new structure
import NewOrderPage from '@/app/pages/Root/tailormate/NewOrderPage/NewOrderPage'
import OrderPage from '@/app/pages/Root/tailormate/OrderPage/OrderPage'
import TailorMateReportPage from '@/app/pages/Root/tailormate/ReportPage/ReportPage'
import TrackerPage from '@/app/pages/Root/tailormate/TrackerPage/TrackerPage'


//! New imports for Loyality module in administration => 09-06-2026
import MemberCardGenerator from '@/app/pages/Root/Administration/Loyality/MemberCardGenerator/indexPage'
import MemberShipType from '@/app/pages/Root/Administration/Loyality/MemberShipType/indexPage'
import MembershipDetails from '@/app/pages/Root/Administration/Loyality/MembershipDetails/indexPage'
import LoyalityLayout from '@/app/pages/Root/Administration/Loyality/layout'


export const appRoutes = {
  path: '/',
  element: <RootLayout />,
  errorElement: <ErrorPage />,
  children: [
    {
      index: true,
      element: <Navigate to={'/dashboard'} />,
    },
    {
      path: 'promotion-setup-test',
      element: <PromotionSetupTest />,
    },
    {
      path: 'dashboard',
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
      ],
    },
    {
      path: 'help',
      element: <HelpLayout />,
      Children: [
        {
          index: true,
          element: <HelpPage />,
        },
      ],
    },
    {
      path: 'Utilities',
      element: <UtilitiesLayout />,
      children: [
        {
          index: true,
          element: <UtilitiesPage />,
        },
      ],
    },
    {
      path: 'administration',
      element: <AdministrationLayout />,
      children: [
        {
          path: 'security',
          element: <SecurityLayout />,
          children: [
            {
              path: 'designation',
              element: <DesignationMaster />,
            },
            {
              path: 'create-role',
              // element: <CreateRole />,
              element: <CreateRolePage />,
            },
            {
              path: 'role-defination',
              element: <RoleDefination />,
            },
            {
              path: 'user-profile-creation',
              element: <UserProfileCreationTable />,
            },
            {
              path: 'change-password',
              element: <ChangePasswordPage />,
            },
            {
              path: 'user-master',
              //element: <UserMaster />,
              element: <UserMasterPage />,
            },
            {
              path: 'authorisation-matrix',
              element: <AuthorisationMatrix />,
            },
            {
             path: 'footfall-entry',
             element: <FootFall/>
            },
          ],
        },
        {
          path: 'setup',
          element: <SectupLayout />,
          children: [
            {
              path: 'policy',
              element: <SectupLayout />,
              children: [
                {
                  path: 'organization-policy',
                  element: <OrganizationPolicyPage />,
                },
                {
                  path: 'organization-policy-2',
                  element: <OrganizationPolicy2 />,
                },
                {
                  path: 'store-wise-policy',
                  element: <StoreSpecificPolicy />,
                },
                {
                  path: 'store-wise-policy-2',
                  element: <StoreSpecificPolicy2 />,
                }
              ],
            },
            {
              path: 'discount',
              element: <DiscountAssortmentManagementLayout />,
              children: [
                {
                  path: 'assortment-management-discount',
                  element: <DiscountAssortmentManagementPage />,
                },
                {
                  path: 'discount-setup',
                  element: <DiscountMasterPage />,
                },
                {
                  path: 'discount-allocation',
                 // element: <DiscountAllocation />,
                  element: <DiscountListing/>
                },
              ],
            },
            {
              path: 'promotion',
              element: <PromotionSetUpLayout />,
              children: [
                {
                  path: 'assortment-mangement-promotion',
                  element: <PromotionAssortmentManagementPage />,
                },
                { 
                  path: 'promotion-setup',
                  element: <PromotionSetUpPage />,
                },
                {
                  path: 'promotion-setup-test',
                  element: <PromotionSetupTest/>
                 // element: <PromotionSetUpPage />,
                },
                {
                  path: 'promotion-allocation',
                  element : <PromotionAllocationmainTable/>
                 // element: <PromotionAllocationPage />,
                },
                {
                  path: 'promotion-priority-setup',
                  element : <PromotionPrioritySetupmainTable/>,
                 // element: <PromotionPrioritySetupPage />,
                },
                {
                  path: 'qty-slab',
                  element: <QuantitySlabBenefitPage />,
                },
                {
                  path: 'bill-slab',
                  element: <BillValueSlabBenefitPage />,
                },
                {
                  path: 'assortment-for-promotion',
                  element: <PromotionForAssortment />,
                },
                {
                  path: 'promotion-priority',
                  element: <PromotionPriority />,
                }
              ],
            },
            {
              path: 'salesperson-incentive',
              element: <SalesPersonLayout />,
              children: [
                {
                  index: true,
                  element: (
                    <Navigate to="/administration/setup/salesperson-incentive/assortment-managemnt-incentive" />
                  ),
                },
                {
                  path: 'storewise-assortment-allocation',
                  element: <IncentiveAssortmentwiseIncentiveLayout />,
                  children: [
                    {
                      index: true,
                      element: <IncentiveAssortmentwiseIncentivePage />,
                    },
                  ],
                },
                {
                  path: 'assortment-managemnt-incentive',
                  element: <IncentiveAssortmentManagementPage />,
                },
                {
                  path: 'salesperson-incentive-new',
                  element: <SalesPersonIncentive />,
                 // element: <SalesPersonIncentiveNew />,
                },
                {
                  path: 'salesperson-incentive-allocation-new',
                  element: <SalesPersonIncentiveAllocationNew />,
                }
              ],
            },
          ],
        },
        {
          path: 'loyality',
          element: <LoyalityLayout />,
          children: [
            {
              path: 'membership-type-setup',
              element: <MemberShipType />,
            },
            {
              path: 'membership-details',
              element: <MembershipDetails />,
            },
            {
              path: 'membership-card-generator',
              element: <MemberCardGenerator />,
            },
          ],
        },
        {
          path: 'master',
          element: <MasterLayout />,
          children: [
            {
              path: 'customer-master',
              element: <CustomerMaster />,
            },
            {
              path: 'store-master',
              element: <StoreMaster />,
            },
            {
              path: 'paymode-master',
              element: <PaymodeMasterPage />,
            },
            {
              path: 'pettycash-heads',
              element: <PettyCashHead />,
            },
            {
              path: 'item-master',
              element: <ItemMaster />,
            },
            {
              path: 'salesperson-master',
              element: <SalesPersonMasterLayout />,
              children: [
                {
                  index: true,
                  element: <SalesPersonMasterPage />,
                },
              ],
            },
            {
              path: 'slot-master',
              element: <SlotMasterPage />,
             // element: <SlotMasterPage />,
            }
          ],
        },
      ],
    },
    {
      path: 'transaction',
      element: <TransactionLayout />,
      children: [
        {
          path: 'purchase',
          // element: <SecurityLayout />,
          children: [
            {
              path: 'purchase-request',
              element: <PurchaseRequest />,
              // element: <Purchase />,
            },
            // {
            //   path: 'purchase-order',
            //   element: <PurchaseOrder />,
            // },
            {
              path: 'grpo',
              element: <GRPO />,
            },
            // {
            //   path: 'ap-invoice',
            //   element: <ApInvoice />,
            // },
          ],
        },
        {
          path: 'inventory',
          element: <InventoryLayout />,
          children: [
            {
              path: 'inventory-transfer-request',
              element: <InventoryTransferRequest />,
            },
            {
              path: 'inventory-transfer',
              element: <InventoryTransfer />,
            },
            {
              path: 'goods-receipt',
              element: <GoodsReciept />,
            },
            {
              path: 'goods-issue',
              element: <GoodsIssue />,
            },
            {
              path: 'goodsReceipt-store',
              element: <GoodsReceiptAtStore />,
             // element: <GoodsReceiptAtStore />,

            },
          ],
        },
        // {
        //   path: 'billing',
        //   element: <SalesLayout />,
        //   children: [
        //     {
        //       path: 'billing-return',
        //       element: <SalesPage />,
        //     },
        //     // {
        //     //   path: 'sessions',
        //     //   element: <Session />,
        //     // },
        //   ],
        // },
        {
          path: 'billing',
          element: <BillingLayout />,
          children: [
            {
              path: 'billing-request',
              //element: <SalesPage />,
              element: <BillingRequestPage />,
            },
            {
              path: 'billing-request-2',
              element: <BillingRequest2Page />,
            },
            {
              path: 'billing-return',
              element: <BillingReturnPage />,
            },
            {
              path: 'billing-return-2',
              element: <BillingReturn2Page />,
            },
            {
              path: 'item-data',
              element: <BillingItemData />,
            },
            {
              path: 'petty-cash-expense',
              element: <PettyCashExpensePage />,
            },
            {
              path: 'footfall-entry',
              element: <FootFallEntry/>
            },
            {
              path: 'sessions',
              element: <BillingLayout />,
              children: [
                {
                  path: 'session-open',
                  element: <SessionOpenPage />,
                },                
                {
                  path: 'session-close',
                  element: <SessionClosePage />,
                },
              ],
            },
          ],
        },
        {
          path: 'tailormate',
          children: [
            {
              path: 'new-order',
              element: <NewOrderPage />,
            },
            {
              path: 'orders',
              element: <OrderPage />,
            },
            {
              path: 'tracker',
              element: <TrackerPage />,
            },
            {
              path: 'reports',
              element: <TailorMateReportPage />,
            },
          ],
        },

        {
          path: 'master',
          element: <MasterLayout />,
          children: [
            {
              path: 'customer-master',
              element: <CustomerMaster />,
            },
            {
              path: 'store-master',
              element: <StoreMaster />,
            },
            {
              path: 'paymode-master',
              element: <PaymodeMasterPage />,
            },
            {
              path: 'pettycash-heads',
              element: <PettyCashHead />,
            },
          ],
        },
      ],
    },
    {
      path: 'inventroty',
      element: <InventoryLayout />,
      children: [
        {
          path: 'inventory-transfer-request',
          element: <InventoryTransferLayout />,
        },
        {
          path: 'inventory-transfer-request',
          element: <InventoryTransferLayout />,
          children: [
            {
              index: true,
            },
          ],
        },
        {
          path: 'inventory-transfer-request',
          element: <InventoryTransferRequestLayout />,
          children: [
            {
              index: true,
              // element: < />,
            },
          ],
        },
        {
          path: 'goods-reciept',
          element: <GoodsRecieptLayout />,
          children: [
            {
              index: true,
              element: <GoodsRecieptPage />,
            },
          ],
        },
        {
          path: 'goods-issue',
          element: <GoodsIssueLayout />,
          children: [
            {
              index: true,
              element: <GoodsIssuePage />,
            },
          ],
        },
      ],
    },
    // {
    //   path: 'billing',
    //   element: <SalesLayout />,
    //   children: [
    //     {
    //       path: 'biling-return',
    //       element: <SalesPage />,
    //     },
    //     {
    //       path: 'customers',
    //       element: <CustomerPage />,
    //     },
    //   ],
    // },
    {
      path: 'reports',
      element: <ReportLayout />,
      children: [
        {
          index: true,
          element: <ReportPage />,
        },
        {
          path: 'credit-note-register',
          element: <CreditNoteRegisterPage />,
        },
        {
          path: 'paymode-wise-collection',
          element: <PaymodeWiseCollectionPage />,
        },
        {
          path: 'user-wise-paymode-wise-collection',
          element: <UserWisePaymodeWiseCollectionPage />,
        },
        {
          path: 'item-wise-sales',
          element: <ItemWiseSalesPage />,
        },
        {
          path: 'user-wise-summary',
          element: <UserWiseSummaryPage />,
        },
        {
          path: 'credit-note-adjustment-register',
          element: <CreditNoteAdjustmentRegisterPage />,
        },
        {
          path: 'day-summary',
          element: <DaySummaryPage />,
        },
        {
          path: 'pos-bill-register',
          element: <POSBillRegisterPage />,
        },
        {
          path: 'daily-sales-stock-summary-report',
          element: <DailySalesStockSummaryReportPage />,
        },
        {
          path: 'division-wise-sales-stock-report',
          element: <DivisionWiseSalesStockReportPage />,
        },
        {
          path: 'daily-sales-report',
          element: <DailySalesReportPage />,
        },
        {
          path: 'stock-sales-report-excel',
          element: <StockSalesReportExcelPage />,
        },
        {
          path: 'paymode-wise-bill',
          element: <PaymodeWiseBill />,
        },
        {
          path: 'petty-cash-expense',
          element: <PettyCashExpense />,
        },
        {
          path: 'store-wise-day-status',
          element: <StoreWiseDayStatus />,
        },
        {
          path: 'hourly-sales-report',
          element: <HourlySalesReport />,
        },
        {
          path: 'store-wise-sales-return',
          element: <StoreWiseSalesReturn />,
        },
        {
          path: 'sample-report',
          element: <SampleReportPage />,
        },
        {
          path: 'promotion-wise-report',
          element: <PromotionWiseReport />,
        },
        {
          path: 'item-history-report',
          element: <ItemHistoryReport/>
        },
        {
          path: 'target-wise-sales-report',
          element: <TargetWiseSalesReport/>
        },
        {
          path: 'sale-tree-report',
          element: <SaleTreeReport/>
        },
        {
          path: 'memo-wise-sales-report',
          element: <MemoWiseSalesReport/>
        },
         {
          path: 'customer-master-report',
          element: <CustomerMasterReport/>
        },
        {
          path: 'daily-cash-report',
          element: <DailyCashReport/>
        },
        {
          path: 'voucher-report',
          element: <VoucherReport/>
        }
      ],
    },
    // {
    //   path: 'sessions',
    //   element: <SessionLayout />,
    //   children: [
    //     {
    //       index: true,
    //       element: <SessionPage />,
    //     },
    //   ],
    // },

    // {
    //   path: 'sessions',
    //   element: <BillingLayout />,
    //   children: [
    //     {
    //       index: true,
    //       element: <BillingLayout />,
    //       children: [
    //         {
    //           path: 'session-open',
    //           element: <SessionOpenPage/>
    //         },
    //         // {
    //         //   path: 'session-close',
    //         //   element: <SessionClosePage/>
    //         // }
    //       ]
    //     },
    //   ],
    // },
  ],
}