import type { FC, PropsWithChildren } from "react";
import { NavigationBar } from "../organisms/NavigationBar/NavigationBar";
import { SideMenu } from "../organisms/SideMenu/SideMenu";

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}
    >
      <NavigationBar />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <SideMenu />
        <div style={{ flexGrow: 1 }}>{children}</div>
      </div>
    </div>
  );
};

export { AppLayout };
