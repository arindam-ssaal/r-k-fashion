import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <nav className="navigation">
      <ul className="flex items-center ">
        <li>
          <Link className="inline-block px-4 py-3" to="/">
            Sales
          </Link>
        </li>
        <li>
          <Link className="inline-block px-4 py-3" to="inventory">
            Inventory
          </Link>
        </li>
        <li>
          <Link className="inline-block px-4 py-3" to="report">
            Report
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
