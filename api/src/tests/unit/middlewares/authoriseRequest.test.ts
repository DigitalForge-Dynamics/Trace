import { NextFunction, Request, Response } from "express";
import { getRequiredScopes, authoriseRequest } from "../../../middlewares/authoriseRequest";
import { Scope } from "../../../utils/types/attributeTypes";

jest.mock("../../../middlewares/authoriseRequest", () => ({
	...jest.requireActual("../../../middlewares/authoriseRequest"),
	getRequiredScopes: jest.fn(),
}));

describe('authoriseRequest', () => {
	let request: Request;
	let response: Response;
	let mockStatus: jest.MockedFunction<typeof response.status>;
	let next: jest.MockedFunction<NextFunction>;
	let getRequiredScopesMock: jest.MockedFunction<typeof getRequiredScopes>;

	beforeEach(() => {
		// Request
		mockStatus = jest.fn();
		mockStatus.mockReturnValue({end: jest.fn() } as any);
		request = { status: mockStatus } as unknown as Request;
		// Response
		response = {
			locals: {
				user: {
					scopes: [],
				},
			},
			status: mockStatus,
		} as unknown as Response;
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
		expect(mockStatus).toHaveBeenCalledWith(500);
		expect(next).not.toHaveBeenCalled();
		expect(console.log).toHaveBeenCalledWith("authoriseRequest middleware called before authenticateRequest middleware");
	});

	it.only('Returns a 403 error response if no required scopes are defined for a path', async () => {
		// Given

		getRequiredScopesMock.mockImplementation(() => {
			console.debug("Called mocked fn");
			return null;
		});

		// When
		await authoriseRequest(request, response, next);

		// Then
		expect(mockStatus).toHaveBeenCalledWith(403);
		expect(next).not.toHaveBeenCalled();
		expect(console.log).toHaveBeenCalledWith("");
	});

	xit('Returns a 403 error response if a required scope is not present in the user attributes', async () => {
		// Given
		response.locals.user.scopes = [];
		//getRequiredScopesMock.mockReturnValue([Scope.READ]);

		// When
		await authoriseRequest(request, response, next);

		// Then
		expect(mockStatus).toHaveBeenCalledWith(403);
		expect(next).not.toHaveBeenCalled();
	});

	xit('Proceeds to next middleware layer if all required scopes are present in the user attributes', async () => {
		// Given
		response.locals.user.scopes = [Scope.READ, Scope.ASSET_CREATE];
		//getRequiredScopesMock.mockReturnValue([Scope.READ]);

		// When
		await authoriseRequest(request, response, next);

		// Then
		expect(mockStatus).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});
});