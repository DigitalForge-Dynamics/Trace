import { NextFunction, Request, Response } from "express";
import ErrorController from "../../../controllers/ErrorController";
import { mockNext, mockRequest, mockResponse } from "../../helpers/mockExpress";
import { MockedLogger, resetMockLogger } from "../../helpers/mockLogger";
import Logger from "../../../utils/Logger";
import AuthenticationController from "../../../controllers/AuthenticationController";
import { TokenUse } from "../../../utils/types/authenticationTypes";
import AuthenticationService from "../../../services/AuthenticationService";
import UserService from "../../../services/UserService";
import { Scope, UserAttributes } from "../../../utils/types/attributeTypes";

jest.mock("../../../services/UserService.ts");
jest.mock("../../../services/BaseService.ts");
jest.mock("../../../utils/Logger.ts", (): MockedLogger => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const logger: MockedLogger = Logger as unknown as MockedLogger;

describe("signIn", () => {
  it("Dummy Test", () => {});
});

describe("signUp", () => {
  it("Dummy Test", () => {});
});

describe("refresh", () => {
  const authController: AuthenticationController = new AuthenticationController();
  let request: Request;
  let response: Response;
  let next: NextFunction;
  let getUserMock: jest.MockedFunction<typeof UserService.prototype.getUser>;

  beforeEach(() => {
    request = mockRequest();
    const locals = { user: { token_use: TokenUse.Refresh } };
    response = mockResponse({ locals });
    next = mockNext();
    getUserMock = UserService.prototype.getUser as jest.MockedFunction<typeof UserService.prototype.getUser>;
  });

  afterEach(() => {
    jest.resetAllMocks();
    getUserMock.mockReset();
    resetMockLogger(logger);
  });

  it("Calls the next middleware with an InternalServerError if the user attribute is missing from authenticateUser.", async () => {
  	// Given
	delete response.locals.user;

	// When
	await authController.refresh(request, response, next);

	// Then
	expect(next).toHaveBeenCalledWith(ErrorController.InternalServerError());
  });


  it("Calls the next middleware with a ForbiddenError if the user token_use is not 'refresh'", async () => {
    // Given
	response.locals.user!.token_use = TokenUse.Access;

    // When
	await authController.refresh(request, response, next);

    // Then
	expect(next).toHaveBeenCalledWith(ErrorController.ForbiddenError("Unexpected token type."));
  });

  it("Calls the next middleware with a NotFoundError if the user is not found in the database", async () => {
  	// Given
	getUserMock.mockResolvedValue(null);

	// When
	await authController.refresh(request, response, next);

	// Then
	expect(next).toHaveBeenCalledWith(ErrorController.NotFoundError("User not found"));
  });

  it("Generates a new access token with the user's scopes as read from the database", async () => {
	// Given
	const scope: Scope[] = [Scope.ASSET_CREATE, Scope.ASSET_RETURN];
	getUserMock.mockResolvedValue({ scope } as UserAttributes);
	const generateAccessTokenSpy = jest.spyOn(AuthenticationService.prototype, "generateAccessToken");

	// When
	await authController.refresh(request, response, next);

	// Then
	expect(generateAccessTokenSpy).toHaveBeenCalledWith(scope);
	generateAccessTokenSpy.mockRestore();
  });

  it("Sets a 200 response with the access token in the body when successful", async () => {
  	// Given
	getUserMock.mockResolvedValue({ scope: [Scope.ASSET_CREATE, Scope.ASSET_RETURN] } as UserAttributes);

	// When
	await authController.refresh(request, response, next);

	// Then
	expect(next).not.toHaveBeenCalled()
	expect(response.status).toHaveBeenCalledWith(200);
	expect(response.send).toHaveBeenCalledWith(expect.any(String));
	expect(response.end).toHaveBeenCalled();
  });
});
