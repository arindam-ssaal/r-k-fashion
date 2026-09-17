import { Outlet } from 'react-router-dom'

export const AdministrationLayout = () => {
  return (
    <div className="m-3 p-3 text-center">
      {/* Pay Mode Master Layout */}
      <div className="content ">
        <Outlet />
      </div>
    </div>
  )
}
