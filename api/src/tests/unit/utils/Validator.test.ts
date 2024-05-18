import ErrorController from "../../../controllers/ErrorController";
import { validateAsset } from "../../../utils/Validator";
import { AssetCreationAttributes } from "../../../utils/types/attributeTypes";
import { MockedLogger } from "../../helpers/mockLogger";
import { testCreationAsset } from "../../helpers/testData";

jest.mock("../../../utils/Logger.ts", (): MockedLogger => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe("validateAsset", () => {
  it("Throws a BadRequestError when an optional attribute is provided as undefined", () => {
    const data: AssetCreationAttributes = testCreationAsset;
    (data as any).nextAuditDate = undefined;

    expect(() => validateAsset(data)).toThrow(ErrorController.BadRequestError());
  });
});
