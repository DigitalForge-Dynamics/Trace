import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  TotalInventoryStatuses,
  Status,
} from "../../../utils/types/attributes";
import StatusItem from "./StatusItem";

interface StatusViewProps {
  data: TotalInventoryStatuses | undefined;
}

const StatusView: React.FC<StatusViewProps> = ({ data }) => {
  return (
    <Paper elevation={3} sx={{ backgroundColor: "whitesmoke", p: 3 }}>
      <Typography variant="h4">Inventory Status</Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 3, mt: 2 }}>
        {Object.values(Status)
          .map<[Status, number | undefined]>((status) => [
            status,
            data?.[status],
          ])
          .map(([status, total], index) => (
            <Box id={index.toString()} key={index}>
              <StatusItem statusTotal={total} statusType={status} />
            </Box>
          ))}
      </Box>
    </Paper>
  );
};

export default StatusView;
