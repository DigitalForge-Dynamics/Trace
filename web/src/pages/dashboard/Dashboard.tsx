import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import Layout from "../../components/layout/Layout";

function HomePage() {
  const { authState } = useContext(AuthContext);
  if (!authState.isLoggedIn) return <Navigate to="/login" />;
  return <Layout>Welcome to your Dashboard, ${authState.firstName}</Layout>;
}

export default HomePage;
