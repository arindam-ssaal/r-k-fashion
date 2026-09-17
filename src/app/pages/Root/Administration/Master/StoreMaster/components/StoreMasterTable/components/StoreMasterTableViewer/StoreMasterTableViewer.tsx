interface StoreMasterTableDetail {
  alternateContactNumber: string
  billAddress: string
  billCity: string
  billCountryName: string
  contactNumber: string
  contactPerson: string
  email: string
  gstin: string

   //Ledger 
   costCenterName: string
   subLedgerName: string

   //Paymode
   ledgerName: string
   paymentModeName: string
   //subLedgerName: string

   // pettycash
   pettyCashName: string

   //series
   seriesName: string
   noOfDigit: number

   //warehouse
   sourcingWarehouseName: string
}
export type StoreMasterTableData = {
  alternateContactNumber: string
  billAddress: string
  billCity: string
  billCountryName: string
  contactNumber: string
  contactPerson: string
  email: string
  gstin: string

   //Ledger 
   costCenterName: string
   subLedgerName: string

   //Paymode
   ledgerName: string
   paymentModeName: string
   //subLedgerName: string

   // pettycash
   pettyCashName: string

   //series
   seriesName: string
   noOfDigit: number
   transactionType: number

   //warehouse
   sourcingWarehouseName: string


  objDetails: StoreMasterTableDetail[]
}

interface StoreMasterTableViewerProps {
  data: StoreMasterTableData
}

function StoreMasterTableViewer({ data }: StoreMasterTableViewerProps) {
 // const details = data?.objDetails || []
  return <div className="customer_table_viewer space-y-6 pb-6">
     <h2 className="text-lg font-semibold">Store Master Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <p><strong>Contact Person:</strong> {data.contactPerson}</p>
        <p><strong>Contact Number:</strong> {data.contactNumber}</p>
        <p><strong>Alternate Contact:</strong> {data.alternateContactNumber}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Billing Address:</strong> {data.billAddress}, {data.billCity}, {data.billCountryName}</p>
        <p><strong>GSTIN:</strong> {data.gstin}</p>
        <p><strong>Ledger Name:</strong> {data.ledgerName}</p>
        <p><strong>Sub Ledger Name:</strong> {data.subLedgerName}</p>
        <p><strong>Payment Mode:</strong> {data.paymentModeName}</p>
        <p><strong>Petty Cash Name:</strong> {data.pettyCashName}</p>
        <p><strong>Series Name:</strong> {data.seriesName} ({data.noOfDigit} Digits)</p>
        <p><strong>Sourcing Warehouse:</strong> {data.sourcingWarehouseName}</p>
        <p><strong>CostCenter Name:</strong> {data.costCenterName}</p>
        <p><strong>Ledger Name:</strong> {data.ledgerName}</p>
        <p><strong>Sub Ledger Name: </strong> {data.subLedgerName}</p>
        <p><strong>Paymentmode Name</strong> {data.paymentModeName}</p>
        <p><strong>Pettycash Name</strong> {data.pettyCashName}</p>
        <p><strong>Series Name</strong> {data.seriesName}</p>
        <p><strong>Transaction Type</strong> {data.transactionType}</p>
        <p><strong>No Of Digit</strong> {data.noOfDigit}</p>
      </div>
      
      {/* <h3 className="text-md font-semibold mt-4">Additional Details</h3>
      {data.objDetails.length > 0 ? (
        <div className="border-t pt-4 space-y-4">
          {data.objDetails.map((detail, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm">
              <p><strong>Contact Person:</strong> {detail.contactPerson}</p>
              <p><strong>Contact Number:</strong> {detail.contactNumber}</p>
              <p><strong>Email:</strong> {detail.email}</p>
              <p><strong>Billing Address:</strong> {detail.billAddress}, {detail.billCity}, {detail.billCountryName}</p>
              <p><strong>GSTIN:</strong> {detail.gstin}</p>
              <p><strong>Ledger Name:</strong> {detail.ledgerName}</p>
              <p><strong>Sub Ledger Name:</strong> {detail.subLedgerName}</p>
              <p><strong>Payment Mode:</strong> {detail.paymentModeName}</p>
              <p><strong>Petty Cash Name:</strong> {detail.pettyCashName}</p>
              <p><strong>Series Name:</strong> {detail.seriesName} ({detail.noOfDigit} Digits)</p>
              <p><strong>Sourcing Warehouse:</strong> {detail.sourcingWarehouseName}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No additional details available.</p>
      )} */}

  </div>
}
export default StoreMasterTableViewer
