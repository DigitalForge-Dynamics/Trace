import { describe, expect, it } from "bun:test";
import { packageName } from "./index.ts";
import packageJson from "./package.json" with { type: "json" };

describe("trace-api", () => {
  it("Has expected package name", () => {
    expect(packageJson.name).toEqual(packageName);
  });
});
