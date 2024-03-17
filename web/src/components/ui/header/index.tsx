import React from "react";
import { Box, AppBar, Toolbar, Avatar } from "@mui/material";
import mainLogo from "../../../assets/trace-main.png";
import Menu from "../menu";

const Header: React.FC = () => {
  return (
    <AppBar position="sticky">
      <Toolbar
        sx={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "space-between",
          minHeight: "6vh",
          backgroundColor: "white",
          py: 0.5,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Menu />
          <img
            src={mainLogo}
            alt="Trace Main Logo"
            width="140px"
            height="51px"
          />
        </Box>
        <Box>
          <Avatar>WW</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
