import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth.context";
import Layout from "../../components/layout/Layout";
import ChartView from "../../components/ui/chartView";
import { Box, Divider, Typography } from "@mui/material";
import { DashboardData } from "../../../../api/src/utils/types/attributeTypes";
import { useAuthFetcher } from "../../hooks/useAuthFetcher";
import StatusView from "../../components/views/statusView";

function HomePage() {
  const { authState } = useAuthContext();
  if (!authState.isLoggedIn) return <Navigate to="/login" />;

  const { data } = useAuthFetcher<DashboardData>("/dashboard");
  
  return (
    <Layout>
      <Box sx={{ m: 5 }}>
        <Typography variant="h3">
          Welcome, {authState.data.firstName}
        </Typography>
      </Box>
      <Divider variant="middle" />
      <ChartView data={data?.totalInventoryCount || []} />
      <Box>
        <StatusView />
      </Box>
    </Layout>
  );
}

export default HomePage;
