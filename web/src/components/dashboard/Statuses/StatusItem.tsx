import React from "react";
import {
  Box,
  Icon,
  Typography,
  Skeleton
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import HelpIcon from "@mui/icons-material/Help";
import { Status } from "../../../utils/types/attributes";

interface StatusItemProps {
  statusTotal: number | undefined;
  statusType: Status;
}

const StatusItem: React.FC<StatusItemProps> = ({ statusTotal, statusType }) => {
  return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          gap: 1,
          pr: 6
        }}
      >
        <Icon fontSize="large">{StatusIcon(statusType) ?? <Skeleton />}</Icon>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>{statusTotal}</Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>{statusType}</Typography>
      </Box>
  );
};

export default StatusItem;

const StatusIcon = (statusType: Status) => {
  switch (statusType) {
    case Status.UNKNOWN:
      return <HelpIcon fontSize="large" sx={{ color: "blue" }} />;
    case Status.UNSERVICEABLE:
      return <CancelIcon fontSize="large" sx={{ color: "red" }} />;
    case Status.IN_MAINTENANCE:
      return <RemoveCircleIcon fontSize="large" sx={{ color: "orange" }} />;
    case Status.SERVICEABLE:
      return <CheckCircleIcon fontSize="large" sx={{ color: "green" }} />;
  }
};
