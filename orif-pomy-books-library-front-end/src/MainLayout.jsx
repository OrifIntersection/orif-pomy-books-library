import { Outlet } from "react-router";
import Navbar from "./Navbar.jsx";

function MainLayout() {
    return (<>
        <Navbar />
        <Outlet />
    </>)
}

export default MainLayout