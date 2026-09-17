import React from 'react'
import { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'
import { Button } from '@/components/ui/button'
import { GetAPI, PostAPI } from '@/services/apiCall'
import { useCookies } from 'react-cookie'
import Select from 'react-select';
ModuleRegistry.registerModules([AllCommunityModule])

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'


import General from './components/General/General'
import POSBill from './components/Pos Bill/indexPage'
import CreditNote from './components/CreditNote/indexPage'
import GoodsReciept from './components/GoodsReciept/indexPage'
import PosOrder from './components/PosOrder/indexPage'

const StoreSpecificPolicy2 = () => {
    // const [cookies] = useCookies();
    const [cookies] = useCookies(['UserId', 'DefaultStoreId'])
    const getCookieValue = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
        return match ? match[2] : null
    }
    const [activeTab, setActiveTab] = useState('general');
    const [errors, setErrors] = useState({});

    // Store & Date State
    const [storeList, setStoreList] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [toDate, setToDate] = useState('');

    // Fetch store list on mount
    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await GetAPI('/api/StoreMaster/GetAllStoreMaster', '', {}, cookies);
                const stores = response?.data?.map((s) => ({
                    value: s.storeID,
                    label: s.storeName,
                })) || [];
                setStoreList(stores);
            } catch (error) {
                console.error('Failed to fetch stores:', error);
            }
        };
        fetchStores();
    }, []);

    // General State
    const [GeneralData, setGeneralData] = useState({
        pendingSettlenmentDays: '',
        footfallEntryRequired: 'N',
        maximumAllowableDiscount: null,
        maximumBillingAmount: '',
        panNoMandatory: 'N',
        creditCardDetailsCapturePolicyID: 'N',
        isCCardAuthNoEntryMandatory: 'N',
        allowBackDateEntry: 'N',
        backDateEntryDays: 0,
        picture: 'N',
        dueDateIsMandatoryInPOSOrder: 'N',
        minPercentageOfAdvanceDuringPOSOrder: '',
        posOrderCancellationIsMandatory: 'N',
        negetiveStockCheckMode: 'N',
        directPrint: 'N'
    });

    const handleGeneralDataChange = (fieldName, value) => {
        setGeneralData(prev => ({ ...prev, [fieldName]: value }));
        if (errors[fieldName]) setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    };

    // POS Bill State
    const [POSBillData, setPOSBillData] = useState({
        allowItemLevelDiscount: 'N',
        allowBillLevelDiscount: 'N',
        maximumAllowableDiscountPercentage: null,
        maximumAllowableDiscountAmount: '',
        allowActivePromotion: 'N',
        allowToClearApplyPromotion: 'N',
        salesPersonTaggingMandatory: 'N',
        customerTaggingMandatory: 'N',
        salesPersonTaggingPolicy: 'S'
    });

    const handlePOSBillDataChange = (fieldName, value) => {
        setPOSBillData(prev => ({ ...prev, [fieldName]: value }));
        if (errors[fieldName]) setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    };

    // Credit Note State
    const [CreditNoteData, setCreditNoteData] = useState({
        returnItemsDays: '',
        creditNoteValidityDays: '',
        billTaggingMandatory: 'N',
        noOfcopiesPrinted: ''
    });

    const handleCreditNoteDataChange = (fieldName, value) => {
        setCreditNoteData(prev => ({ ...prev, [fieldName]: value }));
        if (errors[fieldName]) setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    };

    // Goods Receipt State
    const [GoodsRecieptData, setGoodsRecieptData] = useState(
        {
            excessGoodsRecieveTolerancePercentage: '',
            shortGoodsRecieveTolerancePercentage: '',
            allowToReceiveDamegedGoods: 'N'
        }
    );

    const handleGoodsDataChange = (fieldName, value) => {
        setGoodsRecieptData(prev => ({ ...prev, [fieldName]: value }));
        if (errors[fieldName]) setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    };

    // POS Order State
    const [PosOrderData, setPosOrderData] = useState({
        allowOrderModification: 'N',
        orderValidityDays: '',
        allowPartialDelivery: 'N',
        advancePaymentMandatory: 'N'
    });

    const handlePosOrderDataChange = (fieldName, value) => {
        setPosOrderData(prev => ({ ...prev, [fieldName]: value }));
        if (errors[fieldName]) setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    };
    
    const handleSave = async () => {
        // Validation: check all required fields
        const validationRules = [
            { field: 'selectedStore', value: selectedStore, tab: 'general', label: 'Store Name' },
            { field: 'startDate', value: startDate, tab: 'general', label: 'Start Date' },
            { field: 'pendingSettlenmentDays', value: GeneralData.pendingSettlenmentDays, tab: 'general', label: 'Pending Settlement Days' },
            { field: 'maximumAllowableDiscount', value: GeneralData.maximumAllowableDiscount, tab: 'general', label: 'Maximum Allowable Discount Policy' },
            { field: 'maximumBillingAmount', value: GeneralData.maximumBillingAmount, tab: 'general', label: 'Maximum Billing Amount' },
            ...(GeneralData.allowBackDateEntry === 'Y' ? [{ field: 'backDateEntryDays', value: GeneralData.backDateEntryDays, tab: 'general', label: 'Back Date Entry Days' }] : []),
            { field: 'minPercentageOfAdvanceDuringPOSOrder', value: GeneralData.minPercentageOfAdvanceDuringPOSOrder, tab: 'general', label: 'Min. % of Advance During POS Order' },
            { field: 'maximumAllowableDiscountPercentage', value: POSBillData.maximumAllowableDiscountPercentage, tab: 'posBill', label: 'Maximum Allowable Discount Percentage' },
            { field: 'maximumAllowableDiscountAmount', value: POSBillData.maximumAllowableDiscountAmount, tab: 'posBill', label: 'Maximum Allowable Discount Amount' },
            { field: 'returnItemsDays', value: CreditNoteData.returnItemsDays, tab: 'creditNote', label: 'Return of Item within (Days)' },
            { field: 'creditNoteValidityDays', value: CreditNoteData.creditNoteValidityDays, tab: 'creditNote', label: 'Credit Note Validity Days' },
            { field: 'noOfcopiesPrinted', value: CreditNoteData.noOfcopiesPrinted, tab: 'creditNote', label: 'No. of Copies to be Printed' },
            { field: 'excessGoodsRecieveTolerancePercentage', value: GoodsRecieptData.excessGoodsRecieveTolerancePercentage, tab: 'goodsReceiptReturn', label: 'Excess Goods Receipt Tolerance %' },
            { field: 'shortGoodsRecieveTolerancePercentage', value: GoodsRecieptData.shortGoodsRecieveTolerancePercentage, tab: 'goodsReceiptReturn', label: 'Short Goods Receipt Tolerance %' },
            { field: 'orderValidityDays', value: PosOrderData.orderValidityDays, tab: 'posOrder', label: 'Order Validity Days' },
        ];

        const newErrors = {};
        let firstErrorTab = null;
        let firstErrorField = null;

        for (const rule of validationRules) {
            const isEmpty = rule.value === '' || rule.value === null || rule.value === undefined;
            if (isEmpty) {
                newErrors[rule.field] = `${rule.label} is required`;
                if (!firstErrorTab) {
                    firstErrorTab = rule.tab;
                    firstErrorField = rule.field;
                }
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            if (firstErrorTab) {
                setActiveTab(firstErrorTab);
            }
            setTimeout(() => {
                const el = document.querySelector(`[data-field="${firstErrorField}"]`);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.focus();
                }
            }, 150);
            return;
        }

        setErrors({});

        if(GoodsRecieptData.excessGoodsRecieveTolerancePercentage < 0 || GoodsRecieptData.shortGoodsRecieveTolerancePercentage < 0) {
            alert("Tolerance percentage cannot be negative.");
            return;
        }

        const formData = {
            storeSpecificPolicyID: 0,
            storeID: selectedStore?.value || 0,
            fromDate: startDate,
            toDate: toDate,
            pendingSettlementDays: Number(GeneralData.pendingSettlenmentDays) || 0,
            footfallEntryRequiredInDaySettlement: GeneralData.footfallEntryRequired,
            maxAllowDiscountPolicyValidationID: GeneralData.maximumAllowableDiscount?.value || 0,
            maxBillAmountSinglePOSBill: Number(GeneralData.maximumBillingAmount) || 0,
            pan: GeneralData.panNoMandatory,
            creditCardDetailsCapturePolicyID: GeneralData.creditCardDetailsCapturePolicyID === 'Y' ? 1 : 0,
            isCCardAuthNoEntryMandatory: GeneralData.isCCardAuthNoEntryMandatory,
            allowBackDateEntry: GeneralData.allowBackDateEntry,
            backDateEntryDays: GeneralData.allowBackDateEntry === 'Y' ? Number(GeneralData.backDateEntryDays) : 0,
            negativeStockCheckingModeID: GeneralData.negetiveStockCheckMode === 'Y' ? 1 : 0,
            allowItemLevelDiscount: POSBillData.allowItemLevelDiscount,
            maxAllowDiscountPercentage: Number(POSBillData.maximumAllowableDiscountPercentage) || 0,
            allowBillLevelDiscount: POSBillData.allowBillLevelDiscount,
            maxAllowDiscountAmount: Number(POSBillData.maximumAllowableDiscountAmount) || 0,
            allowToSelectActivePromotionFromList: POSBillData.allowActivePromotion,
            allowToClearAppliedPromotion: POSBillData.allowToClearApplyPromotion,
            salePersonTaggingMandatory: POSBillData.salesPersonTaggingMandatory,
            salePersonTaggingPolicyID: POSBillData.salesPersonTaggingPolicy === 'S' ? 1 : 0,
            customerTaggingMandatory: POSBillData.customerTaggingMandatory,
            returnOfItemWithin: Number(CreditNoteData.returnItemsDays) || 0,
            creditNoteValidityDays: Number(CreditNoteData.creditNoteValidityDays) || 0,
            billTaggingMandatoryDuringReturn: CreditNoteData.billTaggingMandatory,
            noOfCopiesToBePrint: Number(CreditNoteData.noOfcopiesPrinted) || 0,
            excessGoodsReceiptTolerancePercentage: Number(GoodsRecieptData.excessGoodsRecieveTolerancePercentage) || 0,
            shortGoodsReceiptTolerancePercentage: Number(GoodsRecieptData.shortGoodsRecieveTolerancePercentage) || 0,
            allowReceiveDamagedGoods: GoodsRecieptData.allowToReceiveDamegedGoods,
            dueDateMandatoryInPOSOrder: GeneralData.dueDateIsMandatoryInPOSOrder,
            minPercentageOfAdvanceDuringPOSOrder: Number(GeneralData.minPercentageOfAdvanceDuringPOSOrder) || 0,
            posOrderCancellationIsMandatory: GeneralData.posOrderCancellationIsMandatory,
            enteredBy: Number(getCookieValue('UserId')) || 0,
            usedFor: "D"
        } 

        try {
            const response = await PostAPI('/api/storespecificPolicyRep/PostStoreSpecificPolicy', '', formData, cookies);
            console.log('API Response:', response);
        } catch (error) {
            console.error('API Error:', error);
        }
    }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#d6eaf8' }}>
      <div className="light-theme flex-1 flex flex-col bg-white">
      {/* Page Title */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">Store Wise Specific Policy</h1>
      </div>

      {/* Store Name, Start Date, To Date */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">Store Name</label>
            <Select
              value={selectedStore}
              onChange={(val) => {
                setSelectedStore(val);
                if (errors.selectedStore) setErrors(prev => ({ ...prev, selectedStore: undefined }));
              }}
              options={storeList}
              placeholder="Select store"
              isClearable
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: '38px',
                  fontSize: '0.875rem',
                  borderColor: state.isFocused ? '#0A6ED1' : errors.selectedStore ? '#ef4444' : '#d1d5db',
                  boxShadow: state.isFocused ? '0 0 0 2px rgba(10, 110, 209, 0.2)' : 'none',
                  borderRadius: '0.375rem',
                  '&:hover': { borderColor: '#9ca3af' }
                })
              }}
            />
            {errors.selectedStore && <p className="text-red-500 text-xs mt-1">{errors.selectedStore}</p>}
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              data-field="startDate"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (errors.startDate) setErrors(prev => ({ ...prev, startDate: undefined }));
              }}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all bg-white ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">To Date</label>
            <input
              type="date"
              data-field="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all bg-white border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1">
          {/* Tab Navigation */}
          <TabsList className="mb-0 flex border-b border-gray-200 bg-white rounded-none h-auto p-0 px-6">
            <TabsTrigger 
              className="flex-1 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#0A6ED1] data-[state=active]:text-[#0A6ED1] data-[state=active]:bg-transparent rounded-none font-medium text-[#6A6D70] hover:text-gray-800 transition-colors" 
              value="general"
            >
              General
            </TabsTrigger>
            <TabsTrigger 
              className="flex-1 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#0A6ED1] data-[state=active]:text-[#0A6ED1] data-[state=active]:bg-transparent rounded-none font-medium text-[#6A6D70] hover:text-gray-800 transition-colors" 
              value="posBill"
            >
              POS Bill
            </TabsTrigger>
            <TabsTrigger 
              className="flex-1 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#0A6ED1] data-[state=active]:text-[#0A6ED1] data-[state=active]:bg-transparent rounded-none font-medium text-[#6A6D70] hover:text-gray-800 transition-colors" 
              value="creditNote"
            >
              Credit Note
            </TabsTrigger>
            <TabsTrigger 
              className="flex-1 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#0A6ED1] data-[state=active]:text-[#0A6ED1] data-[state=active]:bg-transparent rounded-none font-medium text-[#6A6D70] hover:text-gray-800 transition-colors" 
              value="goodsReceiptReturn"
            >
              Goods Receipt & Return
            </TabsTrigger>
            <TabsTrigger 
              className="flex-1 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#0A6ED1] data-[state=active]:text-[#0A6ED1] data-[state=active]:bg-transparent rounded-none font-medium text-[#6A6D70] hover:text-gray-800 transition-colors" 
              value="posOrder"
            >
              POS Order
            </TabsTrigger>
          </TabsList>

          {/* Tab Content Area */}
          <div className="flex-1 bg-white overflow-y-auto" style={{ minHeight: '600px' }}>
            {/* General Tab */}
            <TabsContent value="general" className="h-full m-0">
              <General data={GeneralData} onFieldChange={handleGeneralDataChange} errors={errors} />
            </TabsContent>
            
            {/* POS Bill Tab */}
            <TabsContent value="posBill" className="h-full m-0">
              <POSBill data={POSBillData} onFieldChange={handlePOSBillDataChange} errors={errors} />
            </TabsContent>
            
            {/* Credit Note Tab */}
            <TabsContent value="creditNote" className="h-full m-0">
              <CreditNote data={CreditNoteData} onFieldChange={handleCreditNoteDataChange} errors={errors} />
            </TabsContent>
            
            {/* Goods Receipt & Return Tab */}
            <TabsContent value="goodsReceiptReturn" className="h-full m-0">
             <GoodsReciept data={GoodsRecieptData} onFieldChange={handleGoodsDataChange} errors={errors} />
            </TabsContent>
            
            {/* POS Order Tab */}
            <TabsContent value="posOrder" className="h-full m-0">
              <PosOrder data={PosOrderData} onFieldChange={handlePosOrderDataChange} errors={errors} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 px-6 py-4 bg-[#d6eaf8] border-t border-[#d6eaf8]">
        <Button 
          variant="outline" 
        //   onClick={handleClear}
          className="px-8 py-2"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          className="px-8 py-2 bg-[#0A6ED1] text-white hover:bg-[#085ba8]"
        >
          Submit
        </Button>
      </div>
      </div>
    </div>
  )
}

export default StoreSpecificPolicy2