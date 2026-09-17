export function promotionDataFormatter(promotionData: z.infer<typeof promotionSetupSchema>) {
  const sendedData = {
    promotionID: (promotionData.promotionId) ? promotionData.promotionId : 0, //0, Debmalya
    promotionName: promotionData.promotionName,
    details: promotionData.details,
    appliedOn: promotionData.appliedOn,
    promotionType: promotionData.promotionType,
    isActive: promotionData.inactive ? 'Y' : 'N',
    storeID: 0,
    enteredBy: 0,
    usedFor: (promotionData.promotionId) ? 'U' : 'I', //'I', Debmalya,
    objCondition:
      promotionData.promotionType === 'F'
        ? [
            {
              promotionID: (promotionData.promotionId) ? promotionData.promotionId : 0, //0, Debmalya
              conditionID: promotionData.promotionParameters.paidForCondition.condition,
              value: promotionData.promotionParameters.paidForCondition.quantity,
            },
          ]
        : [],
    objAssortment: promotionData.promotionParameters.buyAssortments.map((assortment) => ({
      promotionID: (promotionData.promotionId) ? promotionData.promotionId : 0, //0, Debmalya
      value: 0,
      ...assortment,
      assortmentID: Number(assortment.assortmentID),
    })),
    objBenifit: [
      {
        promotionID: (promotionData.promotionId) ? promotionData.promotionId : 0, //0, Debmalya
        benifitID: promotionData?.promotionParameters?.benefitType?.type,
        value: promotionData?.promotionParameters?.benefitType?.value || 0,
        assortmentID: promotionData?.promotionParameters?.benefitType?.assortmentID || 0,
        assortmentName: promotionData?.promotionParameters?.benefitType?.assortmentName || '',
      },
    ],
    objValue:
      promotionData.promotionType !== 'F'
        ? promotionData?.promotionParameters.objValue ?? []
        : [],
    objDiscount: promotionData.promotionParameters.discountTypes.types
      .filter((item) => item.isSelected)
      .map((item) => {
        const discountObj: any = {
          promotionID: (promotionData.promotionId) ? promotionData.promotionId : 0, //0, Debmalya
          discountID: promotionData.promotionParameters.discountTypes.selectedDiscount,
          value: item.toValue ? item.toValue : 0,
          dropDown1: item.discountOn ? String(item.discountOn) : '', // ✅ If undefined/null → blank string
          dropDown2: item.condition ? String(item.condition) : '', // ✅ If undefined/null → blank string
          dropDown3: item.comparison ? String(item.comparison) : '', // ✅ If undefined/null → blank string
          fromValue: item.from !== undefined && item.from !== '' ? item.from : 0, // ✅ Default to 0
          toValue: item.to1 !== undefined && item.to1 !== '' ? item.to1 : 0, //Note: Debmalya, to => to1 // ✅ Default to 0 
        }

        return discountObj
      }),
  }

  return sendedData
}
