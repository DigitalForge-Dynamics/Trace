import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { useContext } from "react";

const PrivateRoutes = () => {
    const auth = useContext(AuthContext);
    return (
        auth.authState.isLoggedIn ? <Outlet/> : <Navigate to="/login"/>
    );
}

export default PrivateRoutes;
