// import { useIncentiveAssortmentManagementStore } from '../../../IntcentiveAssortmentManagement/store/useIncentiveAssortmentManagementStore'
import AssortmentAllocationStoreTable from '../IncentiveAssortmentAllocationStoreTable'

import { Button } from '@/components/ui/button'

const IncentiveAssortmentAllocationStoreForm = () => {
  // const closeModal = useIncentiveAssortmentManagementStore((state) => state.close)
  return (
    <div>
      <div className="border-2 p-2">
        <AssortmentAllocationStoreTable />
      </div>
      {/* Submit Button for form */}
      <div className="flex justify-end gap-3">
        <div className="h-[60px] sticky bottom-0 right-0 flex justify-end items-center">
          <Button type="submit" className=" btn btn-primary">
            Save
          </Button>
          <Button className="btn btn-primary m-3" onClick={closeModal}>
            Cancel
          </Button>
        </div>
        {/* <div className="h-[60px] sticky bottom-0 right-0 flex justify-end items-center">
          
        </div> */}
      </div>
    </div>
  )
}
export default IncentiveAssortmentAllocationStoreForm
