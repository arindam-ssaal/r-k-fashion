 export type PaymodeFetchedType={
    "paymentModeID": number,
    "paymentModeName": string,
    "displayOrder": number,
    "shortCode": string,
    "availablePaymentmethod": string,
    "isActive": "Y"|"N",
    "enteredBy": number,
    "usedFor": "I"|"U"|"D",
    "objCondition": [],
    "objCurrency": []
  }

export type PaymodeMasterResponseType = { returnCode: string; returnMsg: string }[];