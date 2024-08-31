import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Tests Header Component", () => {
  it("Renders Welcome to Trace when passed into Header Component", () => {
    const TestHeaderTitle = "Welcome to Trace";

    render(<Header title={TestHeaderTitle} />);

    expect(screen.findByText(TestHeaderTitle)).toBeTruthy();

  });
});
