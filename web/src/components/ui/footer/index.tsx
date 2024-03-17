import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "white",
        px: 2,
        py: 0.5,
        boxShadow: 8,
        border: "1px solid #e0e0e0",
      }}
    >
      <Typography variant="body2" sx={{ color: "black" }}>
        Trace Asset Management - {new Date().getFullYear()} &copy; DigitalForge
        Dynamics
      </Typography>

      <Typography variant="body2" sx={{ color: "black" }}>
        Privacy Policy
      </Typography>
    </Box>
  );
};

export default Footer;
