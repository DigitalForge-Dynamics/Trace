import {
  Box,
  IconButton as MuiIconButton,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

interface NavItemProps {
  icon: React.ReactElement;
  name: string;
  link: string;
  onClickCallback?: () => void;
}

const IconButton = styled(MuiIconButton)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "&:hover": {
    backgroundColor: "transparent",
  },
});

// Callback is in place ready for implementation in issue #114 (Menu Drawer)

const NavItem: React.FC<NavItemProps> = ({ icon, name, link }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          backgroundColor: "lightGrey",
          borderRadius: "2px",
        },
      }}
    >
      <Link to={link} style={{ textDecoration: "none" }}>
        <IconButton>
          {icon}
          <Typography sx={{ color: "grey" }}>{name}</Typography>
        </IconButton>
      </Link>
    </Box>
  );
};

export default NavItem;
