import { useEffect } from 'react'

import AssortmentManagementTable from './components/AssortmentMangementTable'
import { useAssortmentManagementStore } from './store/useAssortmentManagementStore'

function AssortmentManagement({ type = 'D' }: { type: 'D' | 'P' | 'S' }) {
  const setType = useAssortmentManagementStore((state) => state.setType)

  useEffect(() => {
    setType(type)
  }, [setType])

  return <AssortmentManagementTable />
}

export default AssortmentManagement
