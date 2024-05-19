import { Drawer, Typography } from "@mui/material";

type MenuDrawerProps = {
  open: boolean;
};

const MenuDrawer: React.FC<MenuDrawerProps> = ({ open }) => {
  return (
    <>
      <Drawer open={open}>
        <Typography>All Assets</Typography>
      </Drawer>
    </>
  );
};

export default MenuDrawer;
