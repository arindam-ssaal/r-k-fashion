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

const PromotionForAssortment = () => {
    // const [cookies] = useCookies();
    const [cookies] = useCookies(['UserId', 'DefaultStoreId'])
    const getCookieValue = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
        return match ? match[2] : null
    }
    const [activeTab, setActiveTab] = useState('general');
    const [errors, setErrors] = useState({});

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
        negetiveStockCheckMode: 'N'
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
        salesPersonTaggingPolicy: 'S',
        directPrint: 'N'
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
            orgPolicyID: -1,
            pendingSettlementDays: GeneralData.pendingSettlenmentDays,
            footfallEntryRequiredDaySettlement: GeneralData.footfallEntryRequired,
            maxAllowDiscountPolicyValidationID: GeneralData.maximumAllowableDiscount.value,
            // maxAllowDiscountPolicyValidationID:0,
            maxBillAmountSinglePOSBill: GeneralData.maximumBillingAmount,
            pan: GeneralData.panNoMandatory,
            creditCardDetailsCapturePolicyID: GeneralData.creditCardDetailsCapturePolicyID,
            isCCardAuthNoEntryMandatory: GeneralData.isCCardAuthNoEntryMandatory,
            allowBackDateEntry: GeneralData.allowBackDateEntry,
            backDateEntryDays: GeneralData.allowBackDateEntry === 'Y' ? Number(GeneralData.backDateEntryDays) : 0,
            picture: GeneralData.picture,
            allowItemLevelDiscount: POSBillData.allowItemLevelDiscount,
            maxAllowDiscountPercentage: POSBillData.maximumAllowableDiscountPercentage,
            allowBillLevelDiscount: POSBillData.allowBillLevelDiscount,
            maxAllowDiscountAmount: POSBillData.maximumAllowableDiscountAmount,
            allowToSelectActivePromotionFromList: POSBillData.allowActivePromotion,
            allowToClearAppliedPromotion: POSBillData.allowToClearApplyPromotion,
            salePersonTaggingMandatory: POSBillData.salesPersonTaggingMandatory,
            salePersonTaggingPolicyID: POSBillData.salesPersonTaggingPolicy,
            customerTaggingIsMandatory: POSBillData.customerTaggingMandatory,
            returnOfItemWithin: CreditNoteData.returnItemsDays,
            creditNoteValidityDays: CreditNoteData.creditNoteValidityDays,
            billTaggingMandatoryDuringReturn: CreditNoteData.billTaggingMandatory,
            noOfCopiesToBePrint: CreditNoteData.noOfcopiesPrinted,
            excessGoodsReceiptTolerancePercentage: GoodsRecieptData.excessGoodsRecieveTolerancePercentage,
            shortGoodsReceiptTolerancePercentage: GoodsRecieptData.shortGoodsRecieveTolerancePercentage,
            allowToReceiveDamagedGoods: GoodsRecieptData.allowToReceiveDamegedGoods,
            dueDateIsMandatoryInPOSOrder: GeneralData.dueDateIsMandatoryInPOSOrder,
            minPercentageOfAdvanceDuringPOSOrder: GeneralData.minPercentageOfAdvanceDuringPOSOrder,
            posOrderCancellationIsMandatory: GeneralData.posOrderCancellationIsMandatory,
            negetiveStockCheckMode: GeneralData.negetiveStockCheckMode,
            enteredBy: getCookieValue('UserId') || 0,
            usedFor: "I"
        } 

        try {
            const response = await PostAPI('/api/OrgPolicyRep/PostOrganizationPolicy', '', formData, cookies);
            console.log('API Response:', response);
            // Add success handling here (e.g., show success message, redirect, etc.)
        } catch (error) {
            console.error('API Error:', error);
            // Add error handling here (e.g., show error message)
        }
    }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#d6eaf8' }}>
      <div className="light-theme flex-1 flex flex-col bg-white">
      {/* Page Title */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">Organization Policy</h1>
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

export default PromotionForAssortment