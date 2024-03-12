import React, { useState } from "react";
import { Drawer, IconButton, Box, Typography, ListItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import AssetsIcon from "@mui/icons-material/ViewQuilt";
import HomeIcon from "@mui/icons-material/Home";

const Menu: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>();
  return (
    <Box>
      <IconButton sx={{ mr: 4 }} onClick={() => setIsDrawerOpen(true)}>
        <MenuIcon />
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
      <IconButton>
        <HomeIcon />
        <Typography>Home</Typography>
      </IconButton>
    </ListItem>
    <ListItem>
      <IconButton>
        <AssetsIcon />
        <Typography>Assets</Typography>
      </IconButton>
    </ListItem>
    <ListItem>
      <IconButton>
        <SettingsIcon />
        <Typography>Settings</Typography>
      </IconButton>
    </ListItem>
  </>
);
