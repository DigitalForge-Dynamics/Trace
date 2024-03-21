import { NextFunction, Request, Response } from "express";
import { authoriseRequest } from "../../../middlewares/authoriseRequest";
import { Scope } from "../../../utils/types/attributeTypes";
import { expectNonFinal, mockNext, mockRequest, mockResponse } from "../../helpers/mockExpress";

describe('authoriseRequest', () => {
  let request: Request;
  let response: Response;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Express
    request = mockRequest();
    const locals = { user: { scopes: [] }, required_scopes: [Scope.READ] };
    response = mockResponse({ locals });
    next = mockNext();
    // Misc
    next = jest.fn();
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
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
    expect(console.log).toHaveBeenCalledWith("Path does not have any required scopes defined. If no scopes are required, explicitly require an empty array.");
  });

  it('Returns a 403 error response if a required scope is not present in the user attributes', async () => {
    // Given
    response.locals.user.scopes = [];
    response.locals.required_scopes = [Scope.READ];

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
    response.locals.required_scopes = [Scope.READ];

    // When
    await authoriseRequest(request, response, next);

    // Then
    expect(next).toHaveBeenCalled();
    expectNonFinal(response);
    expect(console.log).not.toHaveBeenCalled();
  });
});
