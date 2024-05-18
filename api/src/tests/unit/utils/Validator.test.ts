import ErrorController from "../../../controllers/ErrorController";
import { validateAsset } from "../../../utils/Validator";
import { AssetCreationAttributes } from "../../../utils/types/attributeTypes";
import { testCreationAsset } from "../../helpers/testData";

describe("validateAsset", () => {
	it("Throws a BadRequestError when an optional attribute is provided as undefined", () => {
		const data: AssetCreationAttributes = testCreationAsset;
		(data as any).nextAuditDate = undefined;

		expect(() => validateAsset(data)).toThrow(ErrorController.BadRequestError());
	});
});
