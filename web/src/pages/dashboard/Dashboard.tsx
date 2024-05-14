import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth.context";
import Layout from "../../components/layout/Layout";
import MfaForm from "../../components/auth/MfaForm.component";

function HomePage() {
  const { authState } = useAuthContext();
  if (!authState.isLoggedIn) return <Navigate to="/login" />;
  return <Layout>
    Welcome to your Dashboard, {authState.data.firstName}
    <br/>
    <MfaForm initialState="Unconfigured"/>
  </Layout>;
}

export default HomePage;
