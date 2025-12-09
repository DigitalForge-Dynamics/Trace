import type { FC } from "react";
import { StatusIcon } from "../StatusIcon/StatusIcon";

type MenuItemProps = {
  name: string;
  link: string;
  active: boolean;
};

const MenuItem: FC<MenuItemProps> = ({ name, link, active }) => {
  return (
    <div
      style={{
        minHeight: "40px",
        minWidth: "228px",
        backgroundColor: active ? "#1F242B" : undefined,
        borderRadius: "6px",
        paddingLeft: "16px",
        paddingTop: "4px",
      }}
      aria-label={`menu-item-${name}`}
    >
      <a href={link} style={{ all: "unset" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <StatusIcon colour={active ? "#3B82F6" : "#3A414A"} size="medium"/>
          <h1
            style={{
              color: active ? "#E5E7EB" : "#A1A8B1",
              fontSize: "14px",
              alignSelf: "center",
            }}
          >
            {name}
          </h1>
        </div>
      </a>
    </div>
  );
};

export type { MenuItemProps };
export { MenuItem };
