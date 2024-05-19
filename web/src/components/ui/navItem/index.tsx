import { IconButton as MuiIconButton, styled } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

type NavItemProps = {
  icon: React.ReactElement;
  link: string;
  onClickCallback: () => void;
};

const IconButton = styled(MuiIconButton)({
    "&:hover": {
        backgroundColor: "grey",
        borderRadius: "2px",
        height: "inherit",
        weight: "inherit",
        boxShadow: "inset 0px 10px 20px 5px rgba(0, 0, 0, 0.5)",
        transform: "translateY(-2px)"
    },
    "&:selected": {
        backgroundColor: "blue"
    }
})

const NavItem: React.FC<NavItemProps> = ({ icon, link, onClickCallback }) => {
  return (
    <>
      <Link to={link}>
        <IconButton onClick={onClickCallback}>{icon}</IconButton>
      </Link>
    </>
  );
};

export default NavItem;
