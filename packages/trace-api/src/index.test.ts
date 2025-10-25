import { describe, expect, it } from "bun:test";
import packageJson from "../package.json" with { type: "json" };
import { packageName } from "./index.ts";

describe("trace-api", () => {
  it("Has expected package name", () => {
    expect(packageJson.name).toEqual(packageName);
  });
});
