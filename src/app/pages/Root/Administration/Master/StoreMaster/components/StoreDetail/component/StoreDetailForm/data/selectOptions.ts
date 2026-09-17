export const warehouseOptions = [
    { code: 'WH001', name: 'General Warehouse' },
    { code: 'WH002', name: 'Lake Garden Store' },
    { code: 'WH003', name: 'SaltLake Store' },
    { code: 'WH004', name: 'NewTown Warehouse' },
    { code: 'WH005', name: 'Warehouse ' },
    { code: 'WH006', name: 'Warehouse2 ' },
  ]

  export const storeCodeOptions = [
    { code: 'ST001', name: 'P5001' },
    { code: 'ST002', name: '043' },
    { code: 'ST003', name: '0022' },
    { code: 'ST004', name: '0023' },
    { code: 'ST005', name: '0020' },
    { code: 'ST006', name: '007' },
  ]

  export const franchiseType = [
    { code: 'F001', name: 'Franchise 1' },
    { code: 'F002', name: 'Franchise 2' },
    { code: 'F003', name: 'Franchise 3' },
  ]

  export const stateOptions = [
    { code: 'WB', name: 'West Bengal' },
    { code: 'KA', name: 'Karnataka' },
    { code: 'MH', name: 'Maharashtra' },
    { code: 'DL', name: 'Delhi' },
    { code: 'TN', name: 'Tamil Nadu' },
  ]

  // Example Price List Options
  export const priceListOptions = [
    { code: 'STANDARD', name: 'Retail Price List' },
    { code: 'STANDARD', name: 'B2B Price List' },
    { code: 'STANDARD', name: 'MRP' },
    { code: 'STANDARD', name: 'Standard Pricing' },
    { code: 'PREMIUM', name: 'Premium Pricing' },
    { code: 'DISCOUNTED', name: 'Discounted Pricing' },
  ]

  export const storeTypeOptions = [
    { code: 'OOWNED', name: 'Organization Owned' },
    { code: 'FOWNED', name: 'Franchise Owned' },
  ]

  // Store Category Options Based on Store Type
  export const categoryOptions = {
    OOWNED: [
      { code: 'COCO', name: 'Company Owned Company Operated' },
      { code: 'COFO', name: 'Company Owned Franchise Operated' },
    ],
    FOWNED: [
      { code: 'FOFO', name: 'Franchise Owned Franchise Operated' },
      { code: 'FOCO', name: 'Franchise Owned Company Operated' },
    ],
  }
  export const franchiseOptions = [
    { code: 'F001', name: 'Franchise 1' },
    { code: 'F002', name: 'Franchise 2' },
    { code: 'F003', name: 'Franchise 3' },
  ]

  // Operation Type Options
  export const operationTypeOptions = [
    { code: 'CONSIGNMENT', name: 'Consignment Basis' },
    { code: 'OUTANDOUT', name: 'Out-and-Out Basis' },
  ]