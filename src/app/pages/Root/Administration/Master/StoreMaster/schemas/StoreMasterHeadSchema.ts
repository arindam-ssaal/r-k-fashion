import { z } from 'zod'

export const StoreMasterHeadSchema = z.object({
  // Store Details
  storeCode: z.string().nonempty('Store Code is required'),
  storeName: z.string().nonempty('Store Name is required'),
  startDate: z.coerce.date({ message: 'Store Start Date cannot be less than the Current Date.' }),

  closeDate: z.coerce.date({ message: 'Store Close date cannot be prior to store Start Date' }), // Optional Date field
  storeSize: z.number().optional(), // Numeric value

  // Warehouse Fields
  defaultWarehouseCode: z.string().optional(),
  defaultWarehouseName: z.string().optional(),
  defaultSaleWarehouseCode: z.string().optional(), // Selectable
  defaultReturnWarehouseCode: z.string().optional(), // Selectable
  GSTIN: z.string().optional(), // GSTIN validation
  GSTINDate: z.string().optional(), // Date as a string
  // Date and State Fields
  stateCode: z.string().optional(), // Dropdown for state
  stateName: z.string().optional(),
  priceList: z.string().optional(), // Dropdown options

  // Optional Factor
  factorIfAny: z.string().optional(), // Optional field

  // Store Type and Category
  storeTypeCode: z.enum(['OOWNED', 'FOWNED']), // Dropdown options
  storeTypeName: z.string().nonempty('Store Type Name is required'),
  storeCategoryCode: z.string().nonempty('Store Category Code is required'), // Dependent on Store Type
  storeCategoryName: z.string().nonempty('Store Category Name is required'),

  // Franchise Details
  franchiseCode: z.string().optional(), // Optional for organization-owned stores
  franchiseName: z.string().optional(),

  // Operation Type
  operationTypeCode: z.enum(['CONSIGNMENT', 'OUTANDOUT']),
  operationTypeName: z.string().nonempty('Operation Type Name is required'),

  // Boolean as "Y" or "N"
  isActive: z.enum(['Y', 'N']), // "Y" for active, "N" for inactive
  billToAddress: z.string().optional(),
  shipToAddress: z.string().optional(),
  billToCity: z.string().optional(),
  billToPostalCode: z.string().optional(),
  billToState: z.string().optional(),
  shipToCity: z.string().optional(),
  shipToPostalCode: z.string().optional(),
  shipToState: z.string().optional(),
  contactPerson: z.string().optional(),
  contactNumber: z.string().max(10, { message: 'Contact number cannot exceed 10 characters' }),
  emailId: z.string().optional(),

  // Sourcing Warehouse (dynamic rows)
  sourcingWarehouse: z
    .array(
      z.object({
        warehouseCode: z.string().optional(),
        transitDays: z.number().optional(),
      })
    ),
   

  objPayMode: z
    .array(
      z.object({
        payMode: z.string(),

        ledgersCode: z.string().optional(),
        ledgersName: z.string().optional(),
        paymentCode: z.string().optional(),
        subLedgerCode: z.string().optional(),
        subLedgerName: z.string().optional(),
        crossStore: z.enum(['Y', 'N']).default('N').optional(), // Enforce 'Y' or 'N'
        discontinue: z.enum(['Y', 'N']).default('N').optional(), // Enforce 'Y' or 'N'
      })
    ),

  objPettyCash: z.array(
    z.object({
      pettyCashName: z.string(),
      pettyCashCode: z.string(),
      limit: z.number().optional(),
      modeOfOperation: z.string().optional(),
      ledgerCode: z.string().optional(),
      ledgerName: z.string().optional(),
      subLedgerCode: z.string().optional(), // Dependent on Ledger
      subLedgerName: z.string().optional(), // Auto-populated
      discontinued: z.enum(['Y', 'N']).default('N'), // Checkbox: Y or N
    })
  ),
  objSeries: z.array(
    z.object({
      transactionType: z.string().optional(),
      seriesName: z.string(),
      prefix: z.string(),
      noOfDigit: z.number(),
      suffix: z.string(),
      discontinued: z.enum(['Y', 'N']).default('N'),
    })
  ),
  objLedger: z.array(
    z.object({
      ledgerCode: z.string(),
      ledgerName: z.string(),
      subLedgerCode: z.string(),
      subLedgerName: z.string(),
      costCenterCode: z.string(),
      costCenterName: z.string(),
      discontinued: z.enum(['Y', 'N']).default('N'),
    })
  ),
})
