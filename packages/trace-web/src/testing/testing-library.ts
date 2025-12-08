/** biome-ignore-all lint/performance/noNamespaceImport: <explanation> */
import * as matchers from "@testing-library/jest-dom/matchers"
import { cleanup } from "@testing-library/react"
// biome-ignore lint/nursery/noUnresolvedImports: <explanation>
import { afterEach, expect } from "bun:test"

expect.extend(matchers)

afterEach(() => {
  cleanup()
})