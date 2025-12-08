import type { FC } from "react";

const NavigationBar: FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        minHeight: "72px",
        backgroundColor: "#171C23",
        border: "1px solid #2A2F36",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          justifyContent: "center",
        }}
      >
        <img
          src="/trace-logo.png"
          alt="Trace Logo"
          width="48px"
          height="48px"
          style={{ alignSelf: "center" }}
        />
        <div>
          <h1
            style={{
              color: "white",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            Trace
          </h1>
          <p
            style={{
              marginTop: "-16px",
              color: "#A1A8B1",
              fontSize: "14x",
            }}
          >
            Asset Tracking
          </p>
        </div>
      </div>
    </div>
  );
};

export { NavigationBar };
