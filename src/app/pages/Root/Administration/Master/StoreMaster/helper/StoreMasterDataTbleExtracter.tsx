// mapStoreMasterFetchedTypeToTableData.ts
import { StoreMasterTableData } from "../components/StoreMasterTable/components/StoreMasterTableViewer/StoreMasterTableViewer";

import { FetchedStoreMasterType } from "@/types/storeMaster";

export default function mapStoreMasterFetchedTypeToTableData(
  storemaster: FetchedStoreMasterType
): StoreMasterTableData {
  return {
    alternateContactNumber: storemaster.alternateContactNumber.toString(),
    billAddress: storemaster.billAddress,
    billCity: storemaster.billCity,
    billCountryName: storemaster.billCountryName,
    contactNumber: storemaster.contactNumber.toString(),
    contactPerson: storemaster.contactPerson,
    email: storemaster.email,
    gstin: storemaster.gstin,
    costCenterName: storemaster.objLedger[0]?.costCenterName || "N/A",
    subLedgerName: storemaster.objLedger[0]?.subLedgerName || "N/A",
    ledgerName: storemaster.objPayMode[0]?.ledgerName || "N/A",
    paymentModeName: storemaster.objPayMode[0]?.paymentModeName || "N/A",
    pettyCashName: storemaster.objPettyCash[0]?.pettyCashName || "N/A",
    seriesName: storemaster.objSeries[0]?.seriesName || "N/A",
    noOfDigit: storemaster.objSeries[0]?.noOfDigit || 0,
    sourcingWarehouseName: storemaster.objWareHouse[0]?.sourcingWarehouseName || "N/A",
    objDetails: []
  };
}
