interface AssortmentManagementTableDetail {
    assortmentID: number;
    assortmentName: string;
    description: string;
    assortmentType: "I";
    enteredBy: number;
    usedFor: null;
    store: number;
  }
  
  export type AssortmentManagementTableData =  {
    assortmentID: number;
    assortmentName: string;
    description: string;
    assortmentType: "I";
    enteredBy: number;
    usedFor: null;
    store: number;
    objDetails: AssortmentManagementTableDetail[];
  }
  
  interface AssortmentManagementTableViewerProps {
    data: AssortmentManagementTableData;
  }
  
  function AssortmentManagementTableViewer({ data }: AssortmentManagementTableViewerProps) {
    const details = data?.objDetails || [];
    return (
      <div className="assortment_table_viewer space-y-6 pb-6">
        {/* Assortment Basic Details */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="font-semibold">Assortment ID</h3>
              <h6 className="text-sm">{data.assortmentID}</h6>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">Assortment Name</h3>
              <h6 className="text-sm">{data.assortmentName}</h6>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">Description</h3>
              <h6 className="text-sm">{data.description}</h6>
            </div>
          </div>
  
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="font-semibold">Store</h3>
              <h6 className="text-sm">{data.store}</h6>
            </div>
          </div>
        </div>
  
        {/* Assortment Details */}
        {details.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-semibold">Assortment Details</h3>
            <div className="space-y-4">
              {details.map((detail, index) => (
                <div
                  key={index}
                  className="border border-gray-200 p-4 rounded space-y-2"
                >
                  <h3 className="font-semibold">Detail {index + 1}</h3>
                  <h6 className="text-sm">Assortment Name: {detail.assortmentName}</h6>
                  <h6 className="text-sm">Description: {detail.description}</h6>
                  <h6 className="text-sm">Store: {detail.store}</h6>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default AssortmentManagementTableViewer;
  