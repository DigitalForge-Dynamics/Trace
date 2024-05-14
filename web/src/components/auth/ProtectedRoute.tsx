import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/auth.context";

const PrivateRoutes = () => {
    const { authState } = useAuthContext();
    return (
        authState.isLoggedIn ? <Outlet/> : <Navigate to="/login"/>
    );
};

export default PrivateRoutes;
