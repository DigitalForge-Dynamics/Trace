import { render, screen } from "@testing-library/react";
import StatusItem from "./StatusItem";
import { Status } from "../../../utils/types/attributes";

describe("Tests Dashboard Statuses Component", () => {
  it("Checks Unknown Status renders on Status Component", () => {
    render(<StatusItem statusTotal={0} statusType={Status.UNKNOWN} />);

    expect(screen.findByText("UNKNOWN")).toBeTruthy();
  });

  it("Checks In Maintenance Status renders on Status Component", () => {
    render(<StatusItem statusTotal={0} statusType={Status.IN_MAINTENANCE} />);

    expect(screen.findByText("IN MAINTENANCE")).toBeTruthy();
  });

  it("Checks Serviceable Status renders on Status Component", () => {
    render(<StatusItem statusTotal={0} statusType={Status.SERVICEABLE} />);

    expect(screen.findByText("SERVICEABLE")).toBeTruthy();
  });

  it("Checks UnServiceable Status renders on Status Component", () => {
    render(<StatusItem statusTotal={0} statusType={Status.UNSERVICEABLE} />);

    expect(screen.findByText("UNSERVICEABLE")).toBeTruthy();
  });
});
