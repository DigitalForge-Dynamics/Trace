import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth.context";
import Layout from "../../components/layout/Layout";
import ChartView from "../../components/ui/chartView";
import { Box, Divider, Typography } from "@mui/material";
import { useDashboardData } from "../../hooks/useAuthFetcher";
import StatusView from "../../components/views/statusView";

function HomePage() {
  const { authState } = useAuthContext();
  const { data } = useDashboardData();
  if (!authState.isLoggedIn) return <Navigate to="/login" />;

  return (
    <Layout>
      <Box sx={{ m: 5 }}>
        <Typography variant="h3">
          Welcome, {authState.data.firstName}
        </Typography>
      </Box>
      <Divider variant="middle" />
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
        <ChartView data={data?.totalInventoryCount} />
        <Divider orientation="vertical" flexItem />
        <Box>
          <StatusView data={data?.totalInventoryStatuses} />
        </Box>
      </Box>
    </Layout>
  );
}

export default HomePage;
