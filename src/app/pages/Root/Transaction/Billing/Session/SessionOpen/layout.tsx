import { Outlet } from "react-router-dom"

function SessionOpen()  {
    return (
        <div className='p-5'>
            <div>
                <Outlet/>
            </div>

        </div>
    )
}
export default SessionOpen