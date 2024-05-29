import React from "react";
import { Box, Typography } from "@mui/material";
import StatusItem from "../ui/statusItem";
import {
  Status,
  TotalInventoryStatuses,
} from "../../utils/types/attributes";

type StatusViewProps = {
  data?: TotalInventoryStatuses;
};

const testData = [
  { status: Status.UNKNOWN, total: 0 },
  { status: Status.UNSERVICEABLE, total: 1 },
  { status: Status.IN_MAINTAINCE, total: 2 },
  { status: Status.SERVICEABLE, total: 3 },
];

const StatusView: React.FC<StatusViewProps> = ({ data }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Typography>Inventory Status</Typography>
      {testData.map((item, index) => {
        return (
          <Box id={index.toString()}>
            <StatusItem statusTotal={item.total} statusType={item.status} />
          </Box>
        );
      })}
    </Box>
  );
};

export default StatusView;
