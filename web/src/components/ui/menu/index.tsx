import React, { useState } from "react";
import { Drawer, IconButton, Box, Typography, ListItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import AssetsIcon from "@mui/icons-material/ViewQuilt";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";

// Note this component is temp & not the final build.

const Menu: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>();
  return (
    <Box>
      <IconButton
        size="large"
        sx={{
          p: 0.5,
          mt: 1,
          mr: 4,
          borderRadius: 2,
          border: "1px solid #D9D9D9",
        }}
        onClick={() => setIsDrawerOpen(true)}
      >
        <MenuIcon fontSize="inherit" />
      </IconButton>
      <Drawer open={isDrawerOpen}>
        <IconButton onClick={() => setIsDrawerOpen(false)}>
          <CloseIcon />
          <Typography>Close Menu</Typography>
        </IconButton>
        <MenuItems />
      </Drawer>
    </Box>
  );
};

export default Menu;

const MenuItems = () => (
  <>
    <ListItem>
      <Link to="/">
        <IconButton>
          <HomeIcon />
          <Typography>Home</Typography>
        </IconButton>
      </Link>
    </ListItem>
    <ListItem>
      <Link to="/assets">
        <IconButton>
          <AssetsIcon />
          <Typography>Assets</Typography>
        </IconButton>
      </Link>
    </ListItem>
    <ListItem>
      <Link to="/settings">
        <IconButton>
          <SettingsIcon />
          <Typography>Settings</Typography>
        </IconButton>
      </Link>
    </ListItem>
  </>
);
