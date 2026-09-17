export type StoreMasterType = {
    documentValues: { transactionType: string; seriesname: string; prefix: string; noOfDigits: string; suffix: string; checkbox: boolean; }[];
    storeID: number;
    storeCode: string;
    storeName: string;
    startDate: string;
    closeDate: string;
    storeTypeCode: string;
    storeTypeName: string;
    storeCategoryCode: string;
    storeCategoryName: string;
    franchiseCode: string;
    franchiseName: string;
    storeSize: number;
    operationTypeCode: string;
    operationTypeName: string;
    defaultWarehouseCode: string;
    defaultWarehouseName: string;
    defaultSaleWHCode: string;
    defaultSaleWHName: string;
    defaultReturnWHCode: string;
    defaultReturnWHName: string;
    isActive: string;
    billAddress: string;
    billCity: string;
    billPostalCode: string;
    billStateCode: string;
    billStateName: string;
    billCountryCode: string;
    billCountryName: string;
    shipAddress: string;
    shipCity: string;
    shipPostalCode: string;
    shipStateCode: string;
    shipStateName: string;
    shipCountryCode: string;
    shipCountryName: string;
    contactPerson: string;
    contactNumber: number;
    alternateContactNumber: number;
    email: string;
    enteredBy: number;
    usedFor: string;
    gstinDate:string,
    gstin:string,
    gstinState:string,
    priceListName:string,
    factor:string,

    objWareHouse: {
      storeID: number;
      sourcingWarehouseCode: string;
      sourcingWarehouseName: string;
    }[];
    objPayMode: {
      storeID: number;
      paymentModeID: number;
      paymentModeName: string;
      isCrossStoreUsage: string;
      ledgerCode: string;
      ledgerName: string;
      subLedgerCode: string;
      subLedgerName: string;
      discontinued: string;
    }[];
    objPettyCash: {
      storeID: number;
      pettyCashID: number;
      pettyCashName: string;
      limit: number;
      modeOfOperation: string;
      ledgerCode: string;
      ledgerName: string;
      subLedgerCode: string;
      subLedgerName: string;
      discontinued: string;
    }[];
    objSeries: {
      storeID: number;
      transactionType: number;
      seriesName: string;
      prefix: string;
      noOfDigit: number;
      suffix: string;
      discontinued: string;
    }[];
    objLedger: {
      storeID: number;
      ledgerCode: string;
      ledgerName: string;
      subLedgerCode: string;
      subLedgerName: string;
      costCenterCode: string;
      costCenterName: string;
    }[];
  };
  
  export type FetchedStoreMasterType = StoreMasterType;
  
  export type StoreMasterResponseType = {
    returnCode: string;
    returnMsg: string;
  }[];
  