/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import ErrorController from "../../../controllers/ErrorController";
import Logger from "../../../utils/Logger";
import { validateAsset } from "../../../utils/Validator";
import { AssetCreationAttributes } from "../../../utils/types/attributeTypes";
import { MockedLogger } from "../../helpers/mockLogger";
import { testCreationAsset } from "../../helpers/testData";
import { vi, describe, it, expect } from "vitest";

vi.mock("../../../utils/Logger.ts", () => ({ default: {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}}));

const logger: MockedLogger = Logger as unknown as MockedLogger;

describe("validateAsset", () => {
  it("Throws a BadRequestError when an optional attribute is provided as undefined", () => {
    // Given
    const data: AssetCreationAttributes = testCreationAsset;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (data as any).nextAuditDate = undefined;

    // When + Then
    expect(() => validateAsset(data)).toThrow(ErrorController.BadRequestError());

    // Then
    expect(logger.error).toHaveBeenCalledTimes(3);
    expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({
      issues: expect.arrayContaining([expect.objectContaining({
        code: "custom",
        path: [ "nextAuditDate" ],
        message: "Explicit 'undefined' for optional key",
        fatal: true,
       })]),
    }));
  });
});
