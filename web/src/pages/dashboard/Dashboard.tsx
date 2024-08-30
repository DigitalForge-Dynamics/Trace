import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth.context";
import Layout from "../../components/layout/Layout";
import ChartView from "../../components/ui/chartView";
import { Box, Divider, Typography } from "@mui/material";
import { useDashboardData } from "../../hooks/useAuthFetcher";
import StatusView from "../../components/dashboard/Statuses/StatusView";
import RecentlyAddedView from "../../components/dashboard/RecentlyAdded/RecentlyAddedView";

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <ChartView data={data?.totalInventoryCount} />
          <ChartView data={data?.totalInventoryCount} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <StatusView data={data?.totalInventoryStatuses} />
          <RecentlyAddedView />
        </Box>
      </Box>
    </Layout>
  );
}

export default HomePage;
