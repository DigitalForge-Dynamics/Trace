import { afterEach, expect } from "bun:test";
// biome-ignore lint/performance/noNamespaceImport: Bun documentation highlights this approach is needed for all matchers to work*/
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
