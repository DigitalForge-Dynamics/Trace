import { Box, Icon, Typography } from "@mui/material";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import HelpIcon from "@mui/icons-material/Help";
import { Status } from "../../../../../api/src/utils/types/attributeTypes";

type StatusItemProps = {
  statusTotal: number;
  statusType: Status;
};

const StatusItem: React.FC<StatusItemProps> = ({ statusTotal, statusType }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Icon>{StatusIcon(statusType)}</Icon>
        <Typography>{statusTotal}</Typography>
        <Typography>{statusType}</Typography>
      </Box>
    </>
  );
};

export default StatusItem;

const StatusIcon = (statusType: Status) => {
  switch (statusType) {
    case Status.UNKNOWN:
      return <HelpIcon />;
    case Status.UNSERVICEABLE:
      return <CancelIcon />;
    case Status.IN_MAINTAINCE:
      return <RemoveCircleIcon />;
    case Status.SERVICEABLE:
      return <CheckCircleIcon />;
  }
};
