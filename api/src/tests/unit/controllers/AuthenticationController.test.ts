import { NextFunction, Request, Response } from "express";
import ErrorController from "../../../controllers/ErrorController";
import { expectNonFinal, mockNext, mockRequest, mockResponse } from "../../helpers/mockExpress";
import { MockedLogger, mockLogger, resetMockLogger } from "../../helpers/mockLogger";
import Logger from "../../../utils/Logger";
import AuthenticationController from "../../../controllers/AuthenticationController";
import { TokenUse } from "../../../utils/types/authenticationTypes";
import AuthenticationService from "../../../services/AuthenticationService";
import UserService from "../../../services/UserService";
import { Scope, UserCreationAttributes, UserLoginAttributes, UserStoredAttributes } from "../../../utils/types/attributeTypes";

jest.mock("../../../services/UserService.ts");
jest.mock("../../../services/BaseService.ts");
jest.mock("../../../utils/Logger.ts", mockLogger);

const logger: MockedLogger = Logger as unknown as MockedLogger;

describe("signIn", () => {
  const authController: AuthenticationController = new AuthenticationController();
  const authService: AuthenticationService = new AuthenticationService();
  let request: Request;
  let response: Response;
  let next: NextFunction;
  let getUserMock: jest.MockedFunction<typeof UserService.prototype.getUser>;

  beforeEach(() => {
    request = mockRequest();
    request.body = { username: "USERNAME", password: "PASSWORD" };
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

  it.each<keyof UserLoginAttributes>(["username", "password"])
  ("Calls the next middleware with a BadRequestError if the request does not contain %p", async (fieldName: string) => {
    // Given
    delete request.body[fieldName];

    // When
    await authController.signIn(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError());
    expect(getUserMock).not.toHaveBeenCalled();
    expectNonFinal(response);
  });

  it("Calls the next middleware with a BadRequestError if the request contains an extra field", async () => {
    // Given
    request.body.extra = "EXTRA";

    // When
    await authController.signIn(request, response, next);

    // Then
    expect(getUserMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError());
    expectNonFinal(response);
  });

  it("Calls the next middleware with a ForbiddenError if the user does not exist", async () => {
    // Given
    getUserMock.mockResolvedValue(null);

    // When
    await authController.signIn(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.ForbiddenError());
    expect(logger.error).toHaveBeenCalledWith("User does not exist: 'USERNAME'");
    expect(getUserMock).toHaveBeenCalledWith(request.body.username);
    expectNonFinal(response);
  });

  it("Calls the next middleware with a ForbiddenError if the password does not match", async () => {
    // Given
    const user: UserStoredAttributes = {
        password: await authService.hashPassword("PASSWORD_OTHER"),
    } as UserStoredAttributes;
    getUserMock.mockResolvedValue(user);

    // When
    await authController.signIn(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.ForbiddenError());
    expect(logger.error).toHaveBeenCalledWith("Incorrect Password for user: 'USERNAME'");
    expectNonFinal(response);
  });

  it("Sets a 200 status with a body of tokens when the user authenticates successfully", async () => {
    // Given
    const user: UserStoredAttributes = {
        password: await authService.hashPassword("PASSWORD"),
		mfaSecret: null,
    } as UserStoredAttributes;
    getUserMock.mockResolvedValue(user);

    // When
    await authController.signIn(request, response, next);

    // Then
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).not.toHaveBeenCalled();
    expect(response.json).toHaveBeenCalledWith({
        idToken: expect.any(String),
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
    });
    expect(response.end).toHaveBeenCalled();
  });
});

describe("signUp", () => {
  const authController: AuthenticationController = new AuthenticationController();
  let request: Request;
  let response: Response;
  let next: NextFunction;
  let getUserMock: jest.MockedFunction<typeof UserService.prototype.getUser>;
  let createUserMock: jest.MockedFunction<typeof UserService.prototype.createUser>;
  let user: UserCreationAttributes;

  beforeEach(() => {
    user = {
      firstName: "FIRST_NAME",
      lastName: "LAST_NAME",
      username: "USERNAME",
      password: "PASSWORD",
      email: "EMAIL",
      isActive: true,
      scope: [],
    };
    request = mockRequest();
    request.body = user;
    const locals = { user: { token_use: TokenUse.Refresh } };
    response = mockResponse({ locals });
    next = mockNext();
    getUserMock = UserService.prototype.getUser as jest.MockedFunction<typeof UserService.prototype.getUser>;
    createUserMock = UserService.prototype.createUser as jest.MockedFunction<typeof UserService.prototype.createUser>;
  });

  afterEach(() => {
    jest.resetAllMocks();
    getUserMock.mockReset();
    createUserMock.mockReset();
    resetMockLogger(logger);
  });

  it.each<keyof UserCreationAttributes>(["firstName", "lastName", "username", "password", "email", "isActive", "scope"])
  ("Calls the next middleware with a BadRequestError if the request data is missing %p",
  async (fieldName: keyof UserCreationAttributes) => {
    // Given
    delete request.body[fieldName];

    // When
    await authController.signUp(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError("Invalid Request"));
    expect(logger.error).toHaveBeenCalledWith([expect.objectContaining({
      params: { "missingProperty": fieldName }
    })]);
    expect(getUserMock).not.toHaveBeenCalled();
    expect(createUserMock).not.toHaveBeenCalled();
    expectNonFinal(response);
  });
  
  it("Calls the next middleware with a BadRequestError if the request data has an extra field", async () => {
    // Given
    request.body.extra = "EXTRA";

    // When
    await authController.signUp(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError("Invalid Request"));
    expect(logger.error).toHaveBeenCalledWith([expect.objectContaining({
      params: { "additionalProperty": "extra" }
    })]);
    expect(getUserMock).not.toHaveBeenCalled();
    expect(createUserMock).not.toHaveBeenCalled();
    expectNonFinal(response);
  });

  it("Calls the next middleware with a BadRequestError if the user already exists", async () => {
    // Given
    getUserMock.mockResolvedValue(user as UserStoredAttributes);

    // When
    await authController.signUp(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError("User Already Exists"));
    expect(getUserMock).toHaveBeenCalledWith(request.body.username);
    expect(createUserMock).not.toHaveBeenCalled();
    expectNonFinal(response);
  });

  it("Creates the user overriding the plain text password with the hashed password", async () => {
    // Given
    getUserMock.mockResolvedValue(null);
    createUserMock.mockResolvedValue(true);

    // When
    await authController.signUp(request, response, next);

    // Then
    expect(next).not.toHaveBeenCalled();
    expect(request.body.password).toBe("PASSWORD");
    expect(createUserMock).toHaveBeenCalledWith({
      ...request.body,
      password: expect.stringMatching(/^\$argon2id\$v=19\$m=65536\,t=3\,p=[A-Za-z0-9\$\+\/]{68}$/)
    });
  });

  it("Calls the next middleware with an InternalServerError if unable to create the user in the database", async () => {
    // Given
    getUserMock.mockResolvedValue(null);
    createUserMock.mockResolvedValue(false);

    // When
    await authController.signUp(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.InternalServerError("Unable to create new user"));
    expectNonFinal(response);
  });

  it("Sets a 204 status with no content when the user is created successfully", async () => {
    // Given
    getUserMock.mockResolvedValue(null);
    createUserMock.mockResolvedValue(true);

    // When
    await authController.signUp(request, response, next);

    // Then
    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.send).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
  });
});

describe("refresh", () => {
  const authController: AuthenticationController = new AuthenticationController();
  let request: Request;
  let response: Response;
  let next: NextFunction;
  let getUserMock: jest.MockedFunction<typeof UserService.prototype.getUser>;

  beforeEach(() => {
    request = mockRequest();
    const locals = { user: { token_use: TokenUse.Refresh, username: "USERNAME" } };
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
    expect(getUserMock).not.toHaveBeenCalled();
  });


  it("Calls the next middleware with a ForbiddenError if the user token_use is not 'refresh'", async () => {
    // Given
    response.locals.user!.token_use = TokenUse.Access;

    // When
    await authController.refresh(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.ForbiddenError("Unexpected token type."));
    expect(getUserMock).not.toHaveBeenCalled();
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
    getUserMock.mockResolvedValue({ scope } as UserStoredAttributes);
    const generateAccessTokenSpy = jest.spyOn(AuthenticationService.prototype, "generateAccessToken");

    // When
    await authController.refresh(request, response, next);

    // Then
    expect(generateAccessTokenSpy).toHaveBeenCalledWith(scope, "USERNAME");
    generateAccessTokenSpy.mockRestore();
  });

  it("Sets a 200 response with the access token in the body when successful", async () => {
    // Given
    getUserMock.mockResolvedValue({ scope: [Scope.ASSET_CREATE, Scope.ASSET_RETURN] } as UserStoredAttributes);

    // When
    await authController.refresh(request, response, next);

    // Then
    expect(next).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith(expect.any(String));
    expect(response.end).toHaveBeenCalled();
  });
});
