import type { FC, PropsWithChildren } from "react";
import { NavigationBar } from "../organisms/NavigationBar/NavigationBar";
import { SideMenu } from "../organisms/SideMenu/SideMenu";

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      {/** Temporary measure to access the webpage body */}
      <head>
        <link rel="stylesheet" href="/global.css" />
      </head>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}
      >
        <NavigationBar />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <SideMenu />
          <div style={{ flexGrow: 1, margin: "24px" }}>{children}</div>
        </div>
      </div>
    </>
  );
};

export { AppLayout };
