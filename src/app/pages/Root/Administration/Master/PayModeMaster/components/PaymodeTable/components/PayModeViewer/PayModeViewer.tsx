
interface PayModeDetail {
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
  export interface PayModeDataType {
    paymentModeID: number,
    paymentModeName: string,
    displayOrder: number,
    shortCode: string,
    availablePaymentmethod: string,
    isActive: "Y"|"N",
    enteredBy: number,
    usedFor: "I"|"U"|"D",
    objDetails: PayModeDetail[]
  }
    interface PayModeViewerProps {
        data: PayModeDataType
    }
    function PayModeViewer({ data }: PayModeViewerProps) {
        return (
            <div className="paymode_viewer space-y-6 pb-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <h3 className="font-semibold">Payment Mode Name</h3>
                            <h6 className="text-sm">
                                {data?.paymentModeName}
                            </h6>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold">Display Order</h3>
                            <h6 className="text-sm">{data?.displayOrder}</h6>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold">Short Code</h3>
                            <h6 className="text-sm">{data?.shortCode}</h6>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold">Available Payment Method</h3>
                            <h6 className="text-sm">{data?.availablePaymentmethod}</h6>
                        </div>
                    </div>
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <h3 className="font-semibold">Entered By</h3>
                            <h6 className="text-sm">{data?.enteredBy}</h6>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    export default PayModeViewer
