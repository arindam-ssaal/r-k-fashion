import { Outlet, useLocation } from 'react-router-dom'

export const AdministrationLayout = () => {
  const { pathname } = useLocation()

  const pageTitle = pathname.split('/').at(-1)

  return (
    // <div className="administration-layout px-4 relative z-40" style={{ backgroundColor: '#d6eaf8' }}>
    <div className="administration-layout px-4 relative z-40" style={{background: '#d6eaf8'}}>
      <div className="administration-header py-3 flex justify-between">
        {/* <h3 className="page-title mb-3 capitalize">{pageTitle?.split('-').join(' ')} </h3> */}
        <ul className="flex items-center gap-3">
          {/* {pathname
            .slice(1) // Remove the first slash
            .replace(/\/$/, '') // Remove the last slash if exists
            .split('/')
            .map((path, index, array) => (
              <li key={index} className={`capitalize ${path===pageTitle?"text-primary":""}`}>
                {path} {index !== array.length - 1 && <span>/</span>}
              </li>
            ))} */}
        </ul>
      </div>
      <Outlet />
    </div>
  )
}
