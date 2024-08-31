import { Divider, Typography } from "@mui/material";
import React from "react";

interface Header {
  title: string;
}

const Header: React.FC<Header> = ({ title }) => {
  return (
    <>
      <Typography variant="h3" sx={{ pl: 4 }}>{title}</Typography>
      <Divider sx={{ pt: 2 }} />
    </>
  );
};

export default Header;
