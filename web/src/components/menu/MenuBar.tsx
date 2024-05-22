import React from "react";
import { Paper as MuiPaper, Box, styled } from "@mui/material";
import TraceIconLogo from "../../assets/trace-icon.png";
import SettingsIcon from "@mui/icons-material/Settings";
import AssetsIcon from "@mui/icons-material/ViewQuilt";
import HomeIcon from "@mui/icons-material/Home";
import NavItem from "../ui/navItem";

const AppBar = styled(MuiPaper)({
  backgroundColor: "whitesmoke",
  width: 100,
  height: "100vh",
  top: 0,
  left: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
});

const MenuBar: React.FC = () => {
  return (
    <AppBar>
      <Box sx={{ display: "flex", justifyContent: "space-around", pt: 2 }}>
        <img src={TraceIconLogo} alt="Trace Logo" width="60vw" height="60vh" />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 2,
          gap: 2,
        }}
      >
        <NavItem icon={<HomeIcon />} name="Home" link="/" />
        <NavItem icon={<AssetsIcon />} name="Assets" link="/assets" />
        <NavItem icon={<SettingsIcon />} name="Settings" link="/settings" />
      </Box>
    </AppBar>
  );
};

export default MenuBar;
