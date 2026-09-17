interface DiscountSetupDetail {
    discountID: number;
    discountName: string;
    discountType: string;
    discountBase: string;
    discountValue: number;
    appliedOn: string;
    employeeDiscount: string;
    maximumDiscount: number;
    minimumBilling: number;
    otpRequired: string;
    allowToChange: string;
    isActive: string;
    enteredBy: number;
    usedFor: string | null;
}

export type DiscountSetupDataType = {
    discountID: number;
    discountName: string;
    discountType: string;
    discountBase: string;
    discountValue: number;
    appliedOn: string;
    employeeDiscount: string;
    maximumDiscount: number;
    minimumBilling: number;
    otpRequired: string;
    allowToChange: string;
    isActive: string;
    enteredBy: number;
    usedFor: string | null;
    objDetails: DiscountSetupDetail[];
}

interface DiscountSetupViewerProps {
    data: DiscountSetupDataType;
}

function DiscountMasterTableViewer({ data }: DiscountSetupViewerProps) {
    const details = data?.objDetails || [];

    return (
        <div className="discount_master_viewer space-y-6 pb-6">
            <div className="grid grid-cols-2 gap-6">
                {/* <div className="space-y-5">
                    <div className="space-y-1">
                        <h3 className="font-semibold">Discount Name</h3>
                        <h6 className="text-sm">{data?.discountName}</h6>
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold">Discount Type</h3>
                        <h6 className="text-sm">{data?.discountType}</h6>
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold">Discount Value</h3>
                        <h6 className="text-sm">{data?.discountValue}</h6>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="space-y-1">
                        <h3 className="font-semibold">Applied On</h3>
                        <h6 className="text-sm">{data?.appliedOn}</h6>
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold">Maximum Discount</h3>
                        <h6 className="text-sm">{data?.maximumDiscount}</h6>
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold">Minimum Billing</h3>
                        <h6 className="text-sm">{data?.minimumBilling}</h6>
                    </div>
                </div> */}
            </div>
            <div className="space-y-6">
                <h3 className="font-semibold">Details</h3>
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Discount ID</th>
                            <th className="border p-2">Discount Name</th>
                            <th className="border p-2">Discount Type</th>
                            <th className="border p-2">Discount Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.map((item, index) => (
                            <tr key={index} className="border">
                                <td className="border p-2">{item.discountID}</td>
                                <td className="border p-2">{item.discountName}</td>
                                <td className="border p-2">{item.discountType}</td>
                                <td className="border p-2">{item.discountValue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DiscountMasterTableViewer;
