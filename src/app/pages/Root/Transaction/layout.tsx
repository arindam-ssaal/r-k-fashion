import { Outlet } from 'react-router-dom'

function TransactionLayout() {
  // const { pathname } = useLocation()

  // const pageTitle = pathname.split('/').at(-1)
  return (
    <div className="">
      <div>
        {/* <h3 className="text-2xl font-bold text-gray-600">Transactions</h3>
        <ul className="flex items-center gap-3 justify-end">
          {pathname
            .slice(1) // Remove the first slash
            .replace(/\/$/, '') // Remove the last slash if exists
            .split('/')
            .map((path, index, array) => (
              <li key={index} className={`capitalize ${path === pageTitle ? 'text-primary' : ''}`}>
                {path} {index !== array.length - 1 && <span>/</span>}
              </li>
            ))}
        </ul> */}
      </div>

      <Outlet />
    </div>
  )
}

export default TransactionLayout
