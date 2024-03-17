import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";

function HomePage() {
	const { authState } = useContext(AuthContext);
	if (!authState.isLoggedIn) return <Navigate to="/login" />
	return `Welcome to your Dashboard, ${authState.firstName}`;
}

export default HomePage;
