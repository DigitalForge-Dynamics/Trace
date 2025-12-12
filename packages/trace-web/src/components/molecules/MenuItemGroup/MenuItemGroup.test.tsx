import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "bun:test";
import { MenuItemGroup } from "./MenuItemGroup";
import { GlobalRegistrator } from "@happy-dom/global-registrator";

describe("<MenuItemGroup />", () => {
  it.if(GlobalRegistrator.isRegistered)("Renders two Menu Items and expects both to be visible", () => {
    const test = [
      { name: "test1", link: "/test1", active: true },
      { name: "test2", link: "/test2", active: false },
    ];
    render(<MenuItemGroup group="testGroup" routes={test} />);

    const activeElement = screen.getByText("test1");

    expect(activeElement).toBeVisible();
  });
});
