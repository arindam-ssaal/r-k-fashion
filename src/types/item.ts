export type FetchedItemGroupsType = {
  itemGrpID: number
  itemGrpName: string
  enteredBy: number
  usedFor: string | null
  itemGroupProperty: null
}



type PropertiesValues={
  value:string
}
export type FetchedItemPropertiesType={
propertyID: string,
    propertyName: string,
    propertyValues:PropertiesValues[]
}

export type ItemFilterType = {
  itemCode: string;
  barCode: string;
  itemName: string;
  itemGroup: number;
  hsnsacCode: string;
  wholesalePriceList: number;
  retailPriceList: number;
  //mrpPriceList: number;
  itemManagement: string;
  leadTime: string;         // Agar time days mein hai toh number bhi ho sakta hai
  toleranceDays: number;
  perScanNumber: string;
  purchaseUOM: string;
  saleUOM: string;
  inventoryUOM: string;
  wholesalePrice: number;
  retailPrice: number;
  mrp: number;
  manufacturer: string;
  mfrCatalogNo: string;
  isActive: "Y" | "N";
  remarks: string;
  enteredBy: number;
  usedFor: string | null;
  itemDetails: unknown;     // ya koi proper type define karo, jaise: ItemDetailType | null
  itemProperty: unknown;
  objDetails: []    // ya koi proper type define karo, jaise: ItemPropertyType | null
};




export type FetchedItemMaster = {
  itemCode: string;
  barCode: string;
  itemName: string;
  itemGroup: number;
  hsnsacCode: string;
  wholesalePriceList: number;
  retailPriceList: number;
  mrpPriceList: number;
  itemManagement: "default";
  leadTime: string;
  toleranceDays: number;
  perScanNumber: "default";
  purchaseUOM: string;
  saleUOM: string;
  inventoryUOM: string;
  wholesalePrice: number;
  retailPrice: number;
  mrp: number;
  manufacturer: string;
  mfrCatalogNo: string;
  isActive: "Y" | "N";
  remarks: string;
  enteredBy: number;
  usedFor: string | null;
  // itemDetails: any[]; // Consider defining a proper type if you know the structure
  // itemProperty: any[]; // Consider defining a proper type if you know the structure
};

export type ItemsResponseType ={ returnCode: string; returnMsg: string }[]
