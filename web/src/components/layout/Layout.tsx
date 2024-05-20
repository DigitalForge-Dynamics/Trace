import React from "react";
import { Box } from "@mui/material";
import Menu from "../menu/MenuBar";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", minWidth: "100vh" }}>
      <Menu />
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Box>
  );
};

export default Layout;
