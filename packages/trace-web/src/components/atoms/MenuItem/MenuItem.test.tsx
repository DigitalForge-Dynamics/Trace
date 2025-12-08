import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "bun:test";
import { MenuItem } from "./MenuItem";

describe("MenuItem />", () => {
  it("Renders the icon as expected", () => {
    const text: string = "test";
    render(<MenuItem name={text} link="/test" active={true} />);

    const element = screen.getByText(text);

    expect(element).toBeVisible();
  });
});
