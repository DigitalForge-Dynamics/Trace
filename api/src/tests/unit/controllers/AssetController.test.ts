import { NextFunction, Request, Response } from "express";
import AssetController from "../../../controllers/AssetController";
import { mockNext, mockRequest, mockResponse } from "../../helpers/mockExpress";
import ErrorController from "../../../controllers/ErrorController";
import { testAsset } from "../../helpers/testData";
import { AssetAttributes } from "../../../utils/types/attributeTypes";
import AssetService from "../../../services/AssetService";

// FIXME: How to mock the functions desired
jest.mock("../../../services/AssetService.ts");
jest.mock("../../../services/BaseService.ts");
jest.mock("../../../services/IService.ts");

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
    expect(response.status).not.toHaveBeenCalled();
    expect(response.send).not.toHaveBeenCalled();
    expect(response.end).not.toHaveBeenCalled();
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
  });

  it('Calls the next middleware with a BadRequestError when the params is missing id', async () => {
    // Given
    request.params = {} as { id: string };

    // When
    await assetController.getAssetById(request, response, next);

    // Then
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError());
    expect(response.status).not.toHaveBeenCalled();
    expect(response.send).not.toHaveBeenCalled();
    expect(response.end).not.toHaveBeenCalled();
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
    expect(response.status).not.toHaveBeenCalled();
    expect(response.send).not.toHaveBeenCalled();
    expect(response.end).not.toHaveBeenCalled();
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
    expect(response.status).not.toHaveBeenCalled();
    expect(response.send).not.toHaveBeenCalled();
    expect(response.end).not.toHaveBeenCalled();
    expect(findByIdMock).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Asset not found - Error Code 404");
  });
});
