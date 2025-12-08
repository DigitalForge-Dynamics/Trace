import type { FC } from "react";

type StatusIconProps = {
  colour: `#${string}`;
  size: "medium" | "small";
};

const StatusIcon: FC<StatusIconProps> = ({ colour, size }) => {
  const sizing: string = size === "medium" ? "18px" : "12px";
  return (
    <div
      style={{
        backgroundColor: colour,
        width: sizing,
        height: sizing,
        borderRadius: "50%",
      }}
    ></div>
  );
};

export { StatusIcon };
