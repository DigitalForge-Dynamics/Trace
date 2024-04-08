import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import Layout from "../../components/layout/Layout";

function HomePage() {
  const { authState } = useContext(AuthContext);
  console.log(`Rendered HomePage with ${JSON.stringify(authState)}`);
  if (!authState.isLoggedIn) return <Navigate to="/login" />;
  return <Layout>Welcome to your Dashboard, {authState.data.firstName}</Layout>;
}

export default HomePage;
