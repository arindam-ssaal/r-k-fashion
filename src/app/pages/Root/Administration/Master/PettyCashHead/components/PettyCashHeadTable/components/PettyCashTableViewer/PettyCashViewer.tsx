// Petty Cash  Details
interface PettyCashDetail {
  pettyCashCode: string,
  pettyCashName: string,
  accountCode: string,
  modeOfOperation: string,
  limit: number,
  remarks: string,
  isActive: 'Y' | 'N',
  // enteredBy: string,
  // usedFor: string,
}
//  Petty Cash Data Structure
export interface PettyCashDataType {
  pettyCashID: number,
  pettyCashCode: string,
  accountCode: string,
  pettyCashName: string,
  modeOfOperation: string,
  limit: number,
  remarks: string,
  isActive: 'Y' | 'N',
  enteredBy: number,
  usedFor: string,
  objDetails: PettyCashDetail[]
}
interface PettyCashViewerProps {
  data: PettyCashDataType
}

function PettyCashViewer({ data }: PettyCashViewerProps) {
  const details = data?.objDetails || []

  return (
    <div className="petty_cash_viewer space-y-6 pb-6">

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="font-semibold">Petty Cash Name</h3>
            <h6 className="text-sm">
              {data?.pettyCashName}
            </h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Postable Account Code</h3>
            <h6 className="text-sm">{data?.accountCode}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Mode of Operation</h3>
            <h6 className="text-sm">{data?.modeOfOperation}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Limit</h3>
            <h6 className="text-sm">{data?.limit}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Remarks</h3>
            <h6 className="text-sm">{data?.remarks}</h6>
          </div>
        </div>

        <div className="space-y-5">
          {/* <div className="space-y-1">
            <h3 className="font-semibold">Entered By</h3>
            <h6 className="text-sm">{data?.enteredBy}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Used For</h3>
            <h6 className="text-sm">{data?.usedFor}</h6>
          </div> */}
        </div>
      </div>
      {/* <div className="space-y-6">
        <h3 className="font-semibold">Details</h3>
        <div className="grid grid-cols-1 gap-6">
          {details.map((item, index) => (
            <div key={index} className="grid grid-cols-2 gap-6">
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="font-semibold">Petty Cash Code</h3>
                  <h6 className="text-sm">{item.pettyCashCode}</h6>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Petty Cash Name</h3>
                  <h6 className="text-sm">{item.pettyCashName}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default PettyCashViewer;
