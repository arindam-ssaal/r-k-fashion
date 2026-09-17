import { X } from 'lucide-react';

import { useItemMaster } from '../../../../store/useItemMaster';

interface ItemTableDetail {
    itemCode: string;
    barCode: string;
    itemName: string;
    itemGroup: number;
    retailPrice: number;
    mrp: number;
    wholesalePrice: number;
    isActive: 'Y' | 'N';
}

export type ItemTableData = {
    itemCode: string;
    barCode: string;
    itemName: string;
    itemGroup: number;
    retailPrice: number;
    mrp: number;
    wholesalePrice: number;
    isActive: 'Y' | 'N';
    objDetails: ItemTableDetail[];
};

interface ItemTableViewerProps {
    data: ItemTableData;
}

function ItemMasterTableViewer({ data }: ItemTableViewerProps) {
    const details = data?.objDetails || [];
    const closeModal = useItemMaster((state) => state.close);

    return (
        <div className="relative bg-white shadow-lg rounded-lg p-6 space-y-6 border border-gray-200">
            {/* Close Button */}
            <button onClick={closeModal} className="absolute right-4 top-4 text-gray-500 hover:text-gray-800">
                <X size={20} />
            </button>
            
            {/* Item Basic Details Table */}
            {/* <h3 className="font-semibold text-lg">Item Details</h3> */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Item Code</th>
                        <th className="border border-gray-300 p-2">Bar Code</th>
                        <th className="border border-gray-300 p-2">Item Name</th>
                        <th className="border border-gray-300 p-2">Item Group</th>
                        <th className="border border-gray-300 p-2">MRP</th>
                        <th className="border border-gray-300 p-2">Retail Price</th>
                        <th className="border border-gray-300 p-2">Wholesale Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300 p-2">{data.itemCode}</td>
                        <td className="border border-gray-300 p-2">{data.barCode}</td>
                        <td className="border border-gray-300 p-2">{data.itemName}</td>
                        <td className="border border-gray-300 p-2">{data.itemGroup}</td>
                        <td className="border border-gray-300 p-2">{data.mrp ?? "No Data"}</td>
                        <td className="border border-gray-300 p-2">{data.retailPrice}</td>
                        <td className="border border-gray-300 p-2">{data.wholesalePrice}</td>
                    </tr>
                </tbody>
            </table>
            
            {/* Item Table Details */}
            {details.length > 0 && (
                <div>
                    <h3 className="font-semibold text-lg">Item Additional Details</h3>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2">Item Code</th>
                                <th className="border border-gray-300 p-2">Bar Code</th>
                                <th className="border border-gray-300 p-2">Item Name</th>
                                <th className="border border-gray-300 p-2">Item Group</th>
                                <th className="border border-gray-300 p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.map((detail, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 p-2">{detail.itemCode}</td>
                                    <td className="border border-gray-300 p-2">{detail.barCode}</td>
                                    <td className="border border-gray-300 p-2">{detail.itemName}</td>
                                    <td className="border border-gray-300 p-2">{detail.itemGroup}</td>
                                    <td className="border border-gray-300 p-2">{detail.isActive === 'Y' ? 'Active' : 'Inactive'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ItemMasterTableViewer;
