import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth.context";
import Layout from "../../components/layout/Layout";
import ChartView from "../../components/ui/chartView";
import useSWR from "swr";
import { fetcher } from "../../data/api";
import { Box, Divider, Typography } from "@mui/material";
import { DashboardData } from "../../../../api/src/utils/types/attributeTypes";

function HomePage() {
  const { authState } = useAuthContext();
  if (!authState.isLoggedIn) return <Navigate to="/login" />;
  const fetcherWithToken = (url: string) => fetcher(url, authState.data);

  const { data } = useSWR<DashboardData>("/dashboard", fetcherWithToken);

  console.log(data);
  if (!data) return null;

  return (
    <Layout>
      <Box sx={{ m: 5 }}>
        <Typography variant="h3">
          Welcome, {authState.data.firstName}
        </Typography>
      </Box>
      <Divider variant="middle" />
        <ChartView data={data.totalInventoryCount} />
    </Layout>
  );
}

export default HomePage;
