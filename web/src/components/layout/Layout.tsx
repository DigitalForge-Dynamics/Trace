import React from "react";
import { Box } from "@mui/material";
import Header from "../ui/header";
import Menu from "../menu/MenuBar";
import { AuthData } from "../../utils/types/authTypes";

type LayoutProps = {
  userData: AuthData;
}

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({ children, userData }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Menu user={userData}/>
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Box>
  );
};

export default Layout;
