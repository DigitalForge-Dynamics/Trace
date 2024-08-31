import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth.context";
import Layout from "../../components/layout/Layout";
import { Box } from "@mui/material";
import { useDashboardData } from "../../hooks/useAuthFetcher";
import StatusView from "../../components/dashboard/Statuses/StatusView";
import RecentlyAddedView from "../../components/dashboard/RecentlyAdded/RecentlyAddedView";
import Header from "../../components/layout/Header/Header";
import ChartView from "../../components/dashboard/Charts/ChartView";

function HomePage() {
  const { authState } = useAuthContext();
  const { data } = useDashboardData();
  if (!authState.isLoggedIn) return <Navigate to="/login" />;

  return (
    <Layout>
      <Box sx={{ m: 5 }}>
        <Header
          title={`Welcome to your Dashboard, ${authState.data.firstName}`}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <ChartView
            labels={["Total Assets"]}
            data={data?.totalInventoryCount}
          />
          <ChartView labels={["Deployed Equipment"]} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <StatusView data={data?.totalInventoryStatuses} />
          <RecentlyAddedView />
        </Box>
      </Box>
    </Layout>
  );
}

export default HomePage;
