import React from "react";
import {
  Box,
  Icon,
  Typography,
  Skeleton,
  Paper as MuiPaper,
  styled,
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

const Paper = styled(MuiPaper)(() => ({
  width: 180,
  height: 180,
}));

const StatusItem: React.FC<StatusItemProps> = ({ statusTotal, statusType }) => {
  return (
    <Paper elevation={3}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Icon>{StatusIcon(statusType) ?? <Skeleton />}</Icon>
        <Typography variant="h6">{statusTotal}</Typography>
        <Typography variant="h6">{statusType}</Typography>
      </Box>
    </Paper>
  );
};

export default StatusItem;

const StatusIcon = (statusType: Status) => {
  switch (statusType) {
    case Status.UNKNOWN:
      return <HelpIcon />;
    case Status.UNSERVICEABLE:
      return <CancelIcon />;
    case Status.IN_MAINTENANCE:
      return <RemoveCircleIcon />;
    case Status.SERVICEABLE:
      return <CheckCircleIcon />;
  }
};
