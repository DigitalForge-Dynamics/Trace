import React from "react";
import {
  AppBar as MuiAppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  styled,
  Drawer,
} from "@mui/material";
import TraceIconLogo from "../../assets/trace-icon.png";
import SettingsIcon from "@mui/icons-material/Settings";
import AssetsIcon from "@mui/icons-material/ViewQuilt";
import HomeIcon from "@mui/icons-material/Home";
import { AuthData } from "../../utils/types/authTypes";
import NavItem from "../ui/navItem";

type MenuBarProps = {
  user: AuthData;
};

const AppBar = styled(MuiAppBar)({
  backgroundColor: "whitesmoke",
  left: 0,
  right: "auto",
  minHeight: "100vh",
  maxWidth: "5vw",
});

const MenuBar: React.FC<MenuBarProps> = ({ user }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <>
      <AppBar position="sticky" sx={{ zIndex: 2 }}>
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ alignItems: "center" }}>
            <IconButton>
              <img
                src={TraceIconLogo}
                alt="Trace Logo"
                width="60vw"
                height="60vh"
              />
            </IconButton>
            <NavItem
              icon={<HomeIcon />}
              link="/"
              onClickCallback={() => console.log("Hello")}
            />
            <NavItem
              icon={<AssetsIcon />}
              link="/assets"
              onClickCallback={() => console.log("Hello")}
            />
          </Box>
          <Box>
            <NavItem
              icon={<SettingsIcon />}
              link="/settings"
              onClickCallback={() => console.log("Hello")}
            />
            <Avatar>
              {user.firstName.slice(0, 1)} {user.lastName.slice(0, 1)}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      {open && (
        <Drawer
          open={open}
          PaperProps={{ style: { marginLeft: "5vw" } }}
          sx={{ zIndex: 1 }}
        >
          Hello World, I am a potato
        </Drawer>
      )}
    </>
  );
};

export default MenuBar;
