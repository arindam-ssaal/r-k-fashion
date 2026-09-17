import { Outlet } from 'react-router-dom'

function AssortmentManagementLayout() {
  return (
    <div>
      <h4>Assortment Managements</h4>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AssortmentManagementLayout
