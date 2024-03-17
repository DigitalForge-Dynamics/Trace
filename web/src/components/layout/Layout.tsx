import { Box } from "@mui/material";
import React from "react";
import Header from "../ui/header";
import Footer from "../ui/footer";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: '100vh' }}>
      <Header />
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
      <Footer />
    </Box>
  );
};

export default Layout;
