import type { FC } from "react";

type StatusIconProps = {
  colour: `#${string}`;
  size: "medium" | "small";
};

const StatusIcon: FC<StatusIconProps> = ({ colour, size }) => {
  const sizing: string = {
    medium: "18px",
    small: "12px",
  }[size];

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
