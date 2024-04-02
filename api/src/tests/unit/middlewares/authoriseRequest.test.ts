import { NextFunction, Request, Response } from "express";
import { authoriseRequest } from "../../../middlewares/authoriseRequest";
import { Scope } from "../../../utils/types/attributeTypes";
import { expectNonFinal, mockNext, mockRequest, mockResponse } from "../../helpers/mockExpress";
import { MockedLogger, resetMockLogger } from "../../helpers/mockLogger";
import Logger from "../../../utils/Logger";
import { TokenUse } from "../../../utils/types/authenticationTypes";

jest.mock("../../../utils/Logger.ts", (): MockedLogger => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const logger: MockedLogger = Logger as unknown as MockedLogger;

describe('authoriseRequest', () => {
  let request: Request;
  let response: Response;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Express
    request = mockRequest();
    const locals = { user: { scope: [], token_use: TokenUse.Access }, required_scopes: [Scope.READ] };
    response = mockResponse({ locals });
    next = mockNext();
    // Misc
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    resetMockLogger(logger);
  });

  it('Returns a 500 error response, logging the cause if the user is not present from authenticateRequest', async () => {
    // Given
    response.locals = {} as any;

    // When
    await authoriseRequest(request, response, next);

    // Then
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith("Missing user within authoriseRequest from authenticateRequest.");
  });

  it('Returns a 500 error response if no required scopes are defined for a path', async () => {
    // Given
    delete response.locals.required_scopes;

    // When
    await authoriseRequest(request, response, next);

    // Then
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith("No required_scopes defined for route.");
  });

  it('Returns a 401 error response if the token_use is not access', async () => {
    // Given
    response.locals.user!.token_use = 'Another value' as TokenUse;

    // When
    await authoriseRequest(request, response, next);

    // Then
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.send).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith("Invalid token_use: Another value provided. Expected access.");
  });

  it('Returns a 403 error response if a required scope is not present in the user attributes', async () => {
    // Given
    (response.locals.user as any).scope = [];
    response.locals.required_scopes = [Scope.READ];

    // When
    await authoriseRequest(request, response, next);

    // Then
    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.send).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('Proceeds to next middleware layer if all required scopes are present in the user attributes', async () => {
    // Given
    (response.locals.user as any).scope = [Scope.READ, Scope.ASSET_CREATE];
    response.locals.required_scopes = [Scope.READ];

    // When
    await authoriseRequest(request, response, next);

    // Then
    expect(next).toHaveBeenCalled();
    expectNonFinal(response);
  });
});
