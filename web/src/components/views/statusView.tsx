import React from "react";
import { Box, Typography } from "@mui/material";
import StatusItem from "../ui/statusItem";
import {
  Status,
  TotalInventoryStatuses,
} from "../../utils/types/attributes";

interface StatusViewProps {
  data: TotalInventoryStatuses | undefined;
};

const StatusView: React.FC<StatusViewProps> = ({ data }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Typography>Inventory Status</Typography>
      {Object.values(Status)
        .map<[Status, number | undefined]>((status) => [status, data?.[status]])
        .map(([status, total], index) => (
          <Box id={index.toString()} key={index}>
            <StatusItem statusTotal={total} statusType={status} />
          </Box>
      ))}
    </Box>
  );
};

export default StatusView;
