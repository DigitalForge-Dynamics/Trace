/** biome-ignore-all lint/nursery/noUnresolvedImports: <explanation> */
/** biome-ignore-all lint/style/useImportType: <explanation> */
import { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers"
import "bun:test"

declare module "bun:test" {
  interface Matchers<T>
    extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
  interface AsymmetricMatchers extends TestingLibraryMatchers {}
}