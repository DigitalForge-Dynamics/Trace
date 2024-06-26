import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth.context";
import Layout from "../../components/layout/Layout";

function HomePage() {
  const { authState } = useAuthContext();
  if (!authState.isLoggedIn) return <Navigate to="/login" />;
  return <Layout></Layout>;
}

export default HomePage;
