import { describe, it, expect } from "bun:test";
import { packageName } from ".";
import packageJson from "./package.json";

describe("trace-api", () => {
  it("Has expected package name", () => {
    expect(packageJson.name).toEqual(packageName);
  });
});
