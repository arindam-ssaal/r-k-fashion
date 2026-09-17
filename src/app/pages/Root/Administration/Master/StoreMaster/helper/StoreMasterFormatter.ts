import { z } from 'zod'

//import { StoreMasterHeadSchema } from "../../schemas/StoreMasterHeadSchema"
import { StoreMasterHeadSchema } from '../schemas/StoreMasterHeadSchema'
import useStoreMasterHead from '../store/useStoreMasterStore'

import { formatDate } from '@/lib/utils'

export type StoreMasterFormatterType = z.infer<typeof StoreMasterHeadSchema>

const operation = {
  Create: 'I',
  Edit: 'U',
  Delete: 'D',
}

export function StoreMasterFormatter(data: StoreMasterFormatterType, id: number | string | null) {
  const mode = useStoreMasterHead.getState().mode as 'Create' | 'Edit' | 'Delete'

  const formattedData = {
    storeID: mode === 'Create' ? 0 : id, // Default value
    storeCode: data.storeCode ?? '',
    storeName: data.storeName ?? '',
    startDate: formatDate(String(data.startDate)) ?? '',
    closeDate: formatDate(String(data.closeDate)) ?? '',
    storeTypeCode: data.storeTypeCode ?? '',
    storeTypeName: data.storeTypeName ?? '',
    storeCategoryCode: data.storeCategoryCode ?? '',
    storeCategoryName: data.storeCategoryName ?? '',
    franchiseCode: data.franchiseCode ?? '',
    franchiseName: data.franchiseName ?? '',
    storeSize: data.storeSize ?? 0,
    operationTypeCode: data.operationTypeCode ?? '',
    operationTypeName: data.operationTypeName ?? '',
    defaultWarehouseCode: data.defaultWarehouseCode ?? '',
    defaultWarehouseName: data.defaultWarehouseName ?? '',
    defaultSaleWHCode: data.defaultSaleWarehouseCode ?? '',
    defaultSaleWHName: data.defaultSaleWarehouseCode ?? '',
    defaultReturnWHCode: data.defaultReturnWarehouseCode ?? '',
    defaultReturnWHName: data.defaultReturnWarehouseCode ?? '',
    isActive: data.isActive ?? 'N',
    billAddress: data.billToAddress ?? '',
    billCity: data.billToCity ?? '',
    billPostalCode: data.billToPostalCode ?? '',
    billStateCode: data.billToState ?? '',
    billStateName: data.billToState ?? '',
    billCountryCode: 'BANG',
    billCountryName: 'Bangladesh',
    shipAddress: data.shipToAddress ?? '',
    shipCity: data.shipToCity ?? '',
    shipPostalCode: data.shipToPostalCode ?? '',
    shipStateCode: data.shipToState ?? '',
    shipStateName: data.shipToState ?? '',
    shipCountryCode: 'IND',
    shipCountryName: 'India',
    contactPerson: data.contactPerson ?? '',
    contactNumber: String(data.contactNumber) || 0,
    alternateContactNumber: String(data.contactNumber) || 0,
    email: data.emailId ?? '',
    enteredBy: 0,
    usedFor: operation[mode],
    priceListName: StoreMasterHeadSchema.shape.priceList.safeParse(data.priceList).success
    ? (data.priceList as 'STANDARD' | 'PREMIUM' | 'DISCOUNTED')
    : 'STANDARD', // ✅ Ensures strict type compatibility
    priceListID: 0,
    gstin: data.GSTIN ?? '',
    gstinDate: formatDate(String(data?.GSTINDate)),
    gstinState: data?.stateCode,
    factor: '',
    // 🏭 Warehouse Mapping (Fix ✅)
    objWareHouse: data.sourcingWarehouse.map((wh) => ({
      storeID: mode === 'Create' ? 0 : id,
      sourcingWarehouseCode: wh.warehouseCode,
      sourcingWarehouseName: wh.warehouseCode ?? '',
    })),

    // 💳 Payment Mode Mapping (Fix ✅)
    objPayMode: data.objPayMode.map((pm) => ({
      storeID: mode === 'Create' ? 0 : id,
      paymentModeID: Number(pm.paymentCode), // Backend required but missing in frontend, default 0
      paymentModeName: pm.payMode,
      isCrossStoreUsage: pm.crossStore ?? 'N',
      ledgerCode: pm.ledgersCode ?? '',
      ledgerName: pm.ledgersName ?? '',
      subLedgerCode: pm.subLedgerCode ?? '',
      subLedgerName: pm.subLedgerName ?? '',
      discontinued: pm.discontinue ?? 'N',
    })),

    // 💰 Petty Cash Mapping (Fix ✅)
    objPettyCash: data.objPettyCash.map((pc) => ({
      storeID: mode === 'Create' ? 0 : id,
      pettyCashID: Number(pc.pettyCashCode), // Backend required but missing in frontend, default 0
      pettyCashName: pc.pettyCashName ?? '',
      limit: Number(pc.limit) || 0,
      modeOfOperation: pc.modeOfOperation ?? '',
      ledgerCode: pc.ledgerCode ?? '',
      ledgerName: pc.ledgerName ?? '',
      subLedgerCode: pc.subLedgerCode ?? '',
      subLedgerName: pc.subLedgerName ?? '',
      discontinued: pc.discontinued === 'Y' || pc.discontinued === 'N' ? pc.discontinued : 'N',
    })),

    // 📜 Series Mapping (Fix ✅)
    objSeries: data.objSeries.map((series) => ({
      storeID: mode === 'Create' ? 0 : id,
      transactionType: series.transactionType ?? '', // Convert SALE to number
      seriesName: series.seriesName ?? '',
      prefix: series.prefix ?? '',
      noOfDigit: Number(series.noOfDigit) || 0,
      suffix: series.suffix ?? '',
      discontinued: series.discontinued ?? 'N',
    })),

    // 📊 Ledger Mapping (Fix ✅)
    objLedger: data.objLedger.map((ledger) => ({
      storeID: mode === 'Create' ? 0 : id,
      ledgerCode: ledger.ledgerCode ?? '',
      ledgerName: ledger.ledgerName ?? '',
      subLedgerCode: ledger.subLedgerCode ?? '',
      subLedgerName: ledger.subLedgerName ?? '',
      costCenterCode: ledger.costCenterCode ?? '',
      costCenterName: ledger.costCenterName ?? '',
    })),
  }

  return formattedData
}
