import { NextFunction, Request, Response } from "express";
import { authoriseRequest } from "../../../middlewares/authoriseRequest";
import { Scope } from "../../../utils/types/attributeTypes";
import { getRequiredScopes } from "../../../utils/RBAC";
import { mockNext, mockRequest, mockResponse } from "../../helpers/mockExpress";

jest.mock("../../../utils/RBAC", () => ({
  getRequiredScopes: jest.fn(),
}));

describe('authoriseRequest', () => {
  let request: Request;
  let response: Response;
  let next: jest.MockedFunction<NextFunction>;
  let getRequiredScopesMock: jest.MockedFunction<typeof getRequiredScopes>;

  beforeEach(() => {
    // Express
    request = mockRequest();
    const locals = { user: { scopes: [] } };
    response = mockResponse({ locals });
    next = mockNext();
    // Misc
    next = jest.fn();
    console.log = jest.fn();
    getRequiredScopesMock = getRequiredScopes as jest.MockedFunction<typeof getRequiredScopes>;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Returns a 500 error response, logging the cause if the user is not present from authenticateRequest', async () => {
    // Given
    response.locals = {};

    // When
    await authoriseRequest(request, response, next);

    // Then
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("authoriseRequest middleware called before authenticateRequest middleware");
  });

  it('Returns a 403 error response if no required scopes are defined for a path', async () => {
    // Given
    getRequiredScopesMock.mockReturnValue(null);

    // When
    await authoriseRequest(request, response, next);

    // Then
    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.send).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Path does not have any required scopes defined. If no scopes are required, explicitly require an empty array.");
  });

  it('Returns a 403 error response if a required scope is not present in the user attributes', async () => {
    // Given
    response.locals.user.scopes = [];
    getRequiredScopesMock.mockReturnValue([Scope.READ]);

    // When
    await authoriseRequest(request, response, next);

    // Then
    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.send).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('Proceeds to next middleware layer if all required scopes are present in the user attributes', async () => {
    // Given
    response.locals.user.scopes = [Scope.READ, Scope.ASSET_CREATE];
    getRequiredScopesMock.mockReturnValue([Scope.READ]);

    // When
    await authoriseRequest(request, response, next);

    // Then
    expect(next).toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
    expect(response.send).not.toHaveBeenCalled();
    expect(response.end).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });
});
