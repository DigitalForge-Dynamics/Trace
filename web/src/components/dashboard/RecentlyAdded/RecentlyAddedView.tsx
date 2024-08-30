import { Paper, Typography } from "@mui/material";
import React from "react";
import RecentlyAddedTable from "./RecentlyAddedTable";

const RecentlyAddedView: React.FC = () => {
  return (
    <Paper
      elevation={3}
      sx={{ display: "flex", flexDirection: "column", p: 3 }}
    >
      <Typography variant="h4">Recently Added</Typography>
      <RecentlyAddedTable />
    </Paper>
  );
};

export default RecentlyAddedView;
