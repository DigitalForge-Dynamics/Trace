import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100vw",
        backgroundColor: "white",
        py: 1,
      }}
    >
      <Typography sx={{ color: "black" }}>
        Trace Asset Management - {new Date().getFullYear()} &copy; DigitalForge
        Dynamics
      </Typography>

      <Typography sx={{ color: "black" }}>Privacy Policy</Typography>
    </Box>
  );
};

export default Footer;
