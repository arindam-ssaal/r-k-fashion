import { useEffect, useState } from 'react'

import AssortmentSearchFilter from '../AssortmentSearchFilter'
import AssortmentSelectionTable from '../AssortmentSelectionTable'

import { useAssortmentManagementStore } from '@/components/AssortmentManagement/store/useAssortmentManagementStore'
import { Button } from '@/components/ui/button'

function AssortmentSelection() {
  const [show, setShow] = useState(false)

  const mode = useAssortmentManagementStore((state) => state.mode)

  useEffect(() => {
    if (mode === 'Edit') {
      setShow(true)
    }
  }, [mode])
  return (
    <div className="discountAssortmentTable mt-2">
      {!show && (
        <div className="text-end">
          <Button onClick={() => setShow((prev) => !prev)}>Generate</Button>
        </div>
      )}

      {show && <AssortmentSearchFilter setShow={setShow} />}

      <AssortmentSelectionTable />
    </div>
  )
}

export default AssortmentSelection
