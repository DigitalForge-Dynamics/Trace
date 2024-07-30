import { Box, Typography } from "@mui/material";
import React from "react";
import RecentlyAddedTable from "./RecentlyAddedTable";

const RecentlyAddedView: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h4">Recently Added</Typography>
      <RecentlyAddedTable />
    </Box>
  );
};

export default RecentlyAddedView;
