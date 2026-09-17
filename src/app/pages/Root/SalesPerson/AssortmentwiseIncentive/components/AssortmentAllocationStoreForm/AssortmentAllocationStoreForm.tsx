import AssortmentAllocationStoreTable from "../AssortmentAllocationStoreTable"

import { Button } from "@/components/ui/button"

 const AssortmentAllocationStoreForm = () => {
  return (
    <div>
      <div className="border-2 p-2">
      <AssortmentAllocationStoreTable/>
      </div>
       {/* Submit Button for form */}
       <div className="flex justify-end gap-3">
       <div className="h-[60px] sticky bottom-0 right-0 flex justify-end items-center">
          <Button type="submit" className=" btn btn-primary">
            Save
          </Button>
        </div>
        <div className="h-[60px] sticky bottom-0 right-0 flex justify-end items-center">
          <Button type="submit" className=" btn btn-primary">
            Cancel
          </Button>
        </div>
       </div>
      
    </div>
  )
}
export default AssortmentAllocationStoreForm