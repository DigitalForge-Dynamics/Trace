import type { FC } from "react";
import { MenuItem, type MenuItemProps } from "../../atoms/MenuItem/MenuItem";

type MenuItemGroupProps = {
  group: string;
  routes: MenuItemProps[];
};

const MenuItemGroup: FC<MenuItemGroupProps> = ({ group, routes }) => {
  return (
    <div>
      <h3 style={{ color: "#6B7280", fontSize: "12px" }}>{group}</h3>
      <div>
        {routes.map((item) => {
          const { link, name, active } = item;
          return (
            <MenuItem
              key={name}
              link={link}
              active={active}
              name={name}
            />
          );
        })}
      </div>
    </div>
  );
};

export { MenuItemGroup };
