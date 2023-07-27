import {Routes,Route} from "react-router-dom"
import Register from "../Pages/Register"
import Login from "../Pages/Login"
import Dashboard from "../Pages/Dashboard"

function AllRoutes(){
    return(
        <Routes>
            <Route path="/register" element={<Register/>}/>
            <Route path="/" element={<Login/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
    )
}
export default AllRoutes