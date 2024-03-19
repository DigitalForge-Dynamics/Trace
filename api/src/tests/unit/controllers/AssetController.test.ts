import { NextFunction, Request, Response } from "express";
import AssetController from "../../../controllers/AssetController";
import { expectNonFinal, mockNext, mockRequest, mockResponse } from "../../helpers/mockExpress";
import ErrorController from "../../../controllers/ErrorController";
import { testAsset } from "../../helpers/testData";
import { AssetAttributes } from "../../../utils/types/attributeTypes";
import AssetService from "../../../services/AssetService";
import Asset from "../../../database/models/asset.model";

// FIXME: How to mock the functions desired
jest.mock("../../../services/AssetService.ts");
jest.mock("../../../services/BaseService.ts");

describe('getAllAssets', () => {
  const assetController: AssetController = new AssetController();
  let request: Request;
  let response: Response;
  let next: NextFunction;
  let findAllMock: jest.MockedFunction<() => Promise<AssetAttributes[]>>;

  beforeEach(() => {
    request = mockRequest();
    response = mockResponse({});
    next = mockNext();
    findAllMock = AssetService.prototype.findAll as jest.MockedFunction<typeof AssetService.prototype.findAll>;
    console.log = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    findAllMock.mockRestore();
  });

  it('Returns found asssets with a status code of 200', async () => {
    // Given
    findAllMock.mockResolvedValue([testAsset]);

    // When
    await assetController.getAllAssets(request, response, next);

    // Then
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith([testAsset]);
    expect(response.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('Calls next middleware with an NotFoundError with message when no assets are found', async () => {
    // Given
    findAllMock.mockResolvedValue([]);

    // When
    await assetController.getAllAssets(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.NotFoundError("No Assets Found"));
    expectNonFinal(response);
    expect(console.log).toHaveBeenCalledWith("No Assets found - Error Code 404");
  });
});

describe('getAssetById', () => {
  const assetController: AssetController = new AssetController();
  let request: Request<{ id: string }>;
  let response: Response;
  let next: NextFunction;
  let findByIdMock: jest.MockedFunction<typeof AssetService.prototype.findById>;

  beforeEach(() => {
    request = mockRequest({ id: "0" });
    response = mockResponse({});
    next = mockNext();
    findByIdMock = AssetService.prototype.findById as jest.MockedFunction<typeof AssetService.prototype.findById>;
    console.log = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    findByIdMock.mockRestore();
  });

  it('Calls the next middleware with a BadRequestError when the params is missing id', async () => {
    // Given
    request.params = {} as { id: string };

    // When
    await assetController.getAssetById(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError());
    expectNonFinal(response);
    expect(findByIdMock).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('Calls the next middleware with a BadRequestError when the params.id is not an integer', async () => {
    // Given
    request.params = { id: "NonStringValue" };

    // When
    await assetController.getAssetById(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError());
    expectNonFinal(response);
    expect(findByIdMock).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('Calls the next middleware with a NotFoundError when an asset with the id cannot be found', async () => {
    // Given
    findByIdMock.mockResolvedValue(null);

    // When
    await assetController.getAssetById(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.NotFoundError("Asset not Found"));
    expectNonFinal(response);
    expect(findByIdMock).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Asset not found - Error Code 404");
  });

  it('Sets a 200 status with the asset data when the asset is able to be found', async () => {
    // Given
    request.params = { id: "3" };
    findByIdMock.mockResolvedValue(testAsset as Asset);

    // When
    await assetController.getAssetById(request, response, next);

    // Then
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith(testAsset);
    expect(response.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(findByIdMock).toHaveBeenCalledWith(3);
    expect(console.log).not.toHaveBeenCalled();
  });
});

describe('createAsset', () => {
  const assetController: AssetController = new AssetController();
  let request: Request;
  let response: Response;
  let next: NextFunction;
  let createMock: jest.MockedFunction<typeof AssetService.prototype.create>;

  beforeEach(() => {
    request = mockRequest();
    response = mockResponse({});
    next = mockNext();
    createMock = AssetService.prototype.create as jest.MockedFunction<typeof AssetService.prototype.create>;
    console.log = jest.fn();
  });


  afterAll(() => {
    jest.restoreAllMocks();
    createMock.mockRestore();
  });

  it('Calls the next middleware with a BadRequestError when the request body does not match the asset schema', async () => {
    // Given
    request.body = {};

    // When
    await assetController.createAsset(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError("Invalid Request"));
    expectNonFinal(response);
    expect(createMock).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Invalid Request - Error Code 400");
  });

  it('Calls the next middleware with an InternalServerError when the asset is unable to be created', async () => {
    // Given
    createMock.mockResolvedValue(false);
    request.body = JSON.parse(JSON.stringify(testAsset));

    // When
    await assetController.createAsset(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.InternalServerError("Unable to create new asset"));
    expectNonFinal(response);
    expect(createMock).toHaveBeenCalledWith(request.body);
    expect(console.log).toHaveBeenCalledWith("Unable to create new asset - Error Code 500");
  });

  it('Sends a 204 response when the asset is successfully created', async () => {
    // Given
    createMock.mockResolvedValue(true);
    request.body = JSON.parse(JSON.stringify(testAsset));

    // When
    await assetController.createAsset(request, response, next);

    // Then
    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.send).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });
});

describe('updateAsset', () => {
  const assetController: AssetController = new AssetController();
  let request: Request<{ id: string }>;
  let response: Response;
  let next: NextFunction;
  let findByIdMock: jest.MockedFunction<typeof AssetService.prototype.findById>;
  let updateMock: jest.MockedFunction<typeof AssetService.prototype.update>;

  beforeEach(() => {
    request = mockRequest({ id: "2" });
    request.body = JSON.parse(JSON.stringify(testAsset));
    response = mockResponse({});
    next = mockNext();
    findByIdMock = AssetService.prototype.findById as jest.MockedFunction<typeof AssetService.prototype.findById>;
    updateMock = AssetService.prototype.update as jest.MockedFunction<typeof AssetService.prototype.update>;
    console.log = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    findByIdMock.mockRestore();
    updateMock.mockRestore();
  });

  it('Calls the next middleware with a BadRequestError if the params.id is not present', async () => {
    // Given
    request.params = {} as { id: string };

    // When
    await assetController.updateAsset(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError());
    expectNonFinal(response);
    expect(findByIdMock).not.toHaveBeenCalled();
    expect(updateMock).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('Calls the next middleware with a BadRequestError if the params.id is not an integer', async () => {
    // Given
    request.params = { id: "NotANumber" };

    // When
    await assetController.updateAsset(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError());
    expectNonFinal(response);
    expect(findByIdMock).not.toHaveBeenCalled();
    expect(updateMock).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('Calls the next middleware with a BadRequestError is the request body does not match the asset schema', async () => {
    // Given
    request.body = {};

    // When
    await assetController.updateAsset(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError("Invalid Request"));
    expectNonFinal(response);
    expect(findByIdMock).not.toHaveBeenCalled();
    expect(updateMock).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Invalid Request - Error Code 400");
  });

  it('Calls the next middleware with a NotFoundError if the requested id does not match an existing asset', async () => {
    // Given
    request.params = { id: "2" };
    findByIdMock.mockResolvedValue(null);

    // When
    await assetController.updateAsset(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.NotFoundError("Unable to find selected Asset to update"));
    expectNonFinal(response);
    expect(findByIdMock).toHaveBeenCalledWith(2);
    expect(updateMock).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Unable to find selected Asset to update - Error Code 404");
  });

  it('Calls the next middleware with an InternalServerError if updating the requested asset is unsuccessful', async () => {
    // Given
    request.params = { id: "3" };
    findByIdMock.mockResolvedValue({} as Asset);
    updateMock.mockResolvedValue(false);

    // When
    await assetController.updateAsset(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.InternalServerError("Unable to update selected asset"));
    expectNonFinal(response);
    expect(findByIdMock).toHaveBeenCalledWith(3);
    expect(updateMock).toHaveBeenCalledWith(3, request.body);
    expect(console.log).toHaveBeenCalledWith("Unable to update selected asset - Error Code 500");
  });

  it('Sets a 204 status when updating an asset is successful', async () => {
    // Given
    request.params = { id: "4" };
    findByIdMock.mockResolvedValue({} as Asset);
    updateMock.mockResolvedValue(true);

    // When
    await assetController.updateAsset(request, response, next);

    // Then
    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.send).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(findByIdMock).toHaveBeenCalledWith(4);
    expect(updateMock).toHaveBeenCalledWith(4, request.body);
    expect(console.log).not.toHaveBeenCalled();
  });
});

describe('deleteAsset', () => {
  const assetController: AssetController = new AssetController();
  let request: Request<{ id: string }>;
  let response: Response;
  let next: NextFunction;
  let deleteMock: jest.MockedFunction<typeof AssetService.prototype.delete>;

  beforeEach(() => {
    request = mockRequest({ id: "2" });
    response = mockResponse({});
    next = mockNext();
    deleteMock = AssetService.prototype.delete as jest.MockedFunction<typeof AssetService.prototype.delete>;
    console.log = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    deleteMock.mockRestore();
  });

  it('Calls the next middleware with a BadRequestError when the request is missing the id parameter', async () => {
    // Given
    request.params = {} as { id: string };

    // When
    await assetController.deleteAsset(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError());
    expectNonFinal(response);
    expect(deleteMock).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('Calls the next middleware with a BadRequestError when the request id parameter is not an integer', async () => {
    // Given
    request.params = { id: "NotAnInteger" };

    // When
    await assetController.deleteAsset(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError());
    expectNonFinal(response);
    expect(deleteMock).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('Calls the next middleware with an InternalServerError when unable to delete the asset', async () => {
    // Given
    request.params = { id: "2" };
    deleteMock.mockResolvedValue(false);

    // When
    await assetController.deleteAsset(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.InternalServerError("Unable to delete selected asset"));
    expectNonFinal(response);
    expect(deleteMock).toHaveBeenCalledWith(2);
    expect(console.log).toHaveBeenCalledWith("Unable to delete selected asset - Error Code 500");
  });

  it('Sets a 204 status when successfully able to delete the asset', async () => {
    // Given
    request.params = { id: "3" };
    deleteMock.mockResolvedValue(true);

    // When
    await assetController.deleteAsset(request, response, next);

    // Then
    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.send).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(deleteMock).toHaveBeenCalledWith(3);
    expect(console.log).not.toHaveBeenCalled();
  });
});
