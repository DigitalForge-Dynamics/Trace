import React from "react";
import { AppBar, Toolbar } from "@mui/material";
import mainLogo from "../../../assets/trace-main.png";
import Menu from "../menu";

const Header: React.FC = () => {
  return (
    <AppBar position="sticky">
      <Toolbar sx={{ width: "100vw", backgroundColor: "white", p: 1 }}>
          <Menu />
        <img src={mainLogo} alt="Trace Main Logo" width="185px" height="75px" />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
