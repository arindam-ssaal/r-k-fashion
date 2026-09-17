import { Outlet } from "react-router-dom"

function SessionClose()  {
    return (
        <div className='p-5'>
            <div>
                <Outlet/>
            </div>

        </div>
    )
}
export default SessionClose