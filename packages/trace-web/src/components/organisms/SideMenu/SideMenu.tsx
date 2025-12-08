import type { FC } from "react";
import { MenuItemGroup } from "../../molecules/MenuItemGroup/MenuItemGroup";
import { StatusIcon } from "../../atoms/StatusIcon/StatusIcon";

const SideMenu: FC = () => {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 108px)",
        minWidth: "320px",
        backgroundColor: "#171C23",
        border: "1px solid #2A2F36",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
        <MenuItemGroup
          group="Operations"
          routes={[
            { name: "Dashboard", link: "/dashboard", active: true },
            { name: "Assets", link: "/dashboard", active: false },
          ]}
        />
        <MenuItemGroup
          group="Admin"
          routes={[
            { name: "Users & Roles", link: "/dashboard", active: false },
            { name: "Settings", link: "/dashboard", active: false },
          ]}
        />
      </div>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyItems: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <StatusIcon colour="#22C55E" size="small" />
          <h4
            style={{
              color: "#A1A8B1",
              fontSize: "14px",
            }}
          >
            Systems Operational
          </h4>
        </div>
        {/** TODO: Update with actual version */}
        <h4
          style={{
            color: "#6B7280",
            fontSize: "12px",
            marginTop: "-8px",
            paddingLeft: "20px"
          }}
        >
          v0.0.1-alpha
        </h4>
      </div>
    </div>
  );
};

export { SideMenu };
