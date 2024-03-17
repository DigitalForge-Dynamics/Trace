import { NextFunction, Request, Response } from "express";
import AssetController from "../../../controllers/AssetController";
import { mockNext, mockRequest, mockResponse } from "../../helpers/mockExpress";
import ErrorController from "../../../controllers/ErrorController";
import { testAsset } from "../../helpers/testData";
import { AssetAttributes } from "../../../utils/types/attributeTypes";
import AssetService from "../../../services/AssetService";

// FIXME: How to mock the functions desired
jest.mock("../../../services/AssetService");
jest.mock("../../../services/BaseService");
jest.mock("../../../services/IService");

describe.skip('getAllAssets', () => {
  const assetController: AssetController = new AssetController();
  let request: Request;
  let response: Response;
  let mockStatus: jest.MockedFunction<typeof response.status>;
  let next: NextFunction;
  let mockSend: jest.MockedFunction<typeof response.send>;
  let mockEnd: jest.MockedFunction<typeof response.end>;
  let findAllMock: jest.MockedFunction<() => Promise<AssetAttributes[]>>;

  beforeEach(() => {
    request = mockRequest();
    const mockedResponse = mockResponse();
    response = mockedResponse.response;
    mockStatus = mockedResponse.status;
    mockSend = mockedResponse.send;
    mockEnd = mockedResponse.end;
    next = mockNext();
    findAllMock = AssetService.prototype.findAll as jest.MockedFunction<typeof AssetService.prototype.findAll>;
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
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledWith(testAsset);
    expect(mockEnd).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('Returns a 404 status with message when no assets are found', async () => {
    // Given
    findAllMock.mockResolvedValue([]);

    // When
    await assetController.getAllAssets(request, response, next);

    // Then
    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(ErrorController.NotFoundError("No Assets Found"));
    expect(mockSend).not.toHaveBeenCalled();
    expect(mockEnd).toHaveBeenCalled();
  });
});

describe.skip('getAssetById', () => {
  const assetController: AssetController = new AssetController();
  let request: Request<{ id: string }>;
  let response: Response;
  let mockStatus: jest.MockedFunction<typeof response.status>;
  let next: NextFunction;
  let mockSend: jest.MockedFunction<typeof response.send>;
  let mockEnd: jest.MockedFunction<typeof response.end>;
  let findByIdMock: jest.MockedFunction<typeof AssetService.prototype.findById>;

  beforeEach(() => {
    request = mockRequest({ id: "0" });
    const mockedResponse = mockResponse();
    response = mockedResponse.response;
    mockStatus = mockedResponse.status;
    mockSend = mockedResponse.send;
    mockEnd = mockedResponse.end;
    next = mockNext();
    // TODO: Once fix mocking: AssetService.prototype.findById rather than jest.fn
    findByIdMock = jest.fn() as jest.MockedFunction<typeof AssetService.prototype.findById>;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Returns a 400 status when the params is missing id', async () => {
    // Given
    request.params = {} as { id: string };

    // When
    await assetController.getAssetById(request, response, next);

    // Then
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError());
    expect(mockEnd).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
    expect(findByIdMock).not.toHaveBeenCalled();
  });

  it('Returns a 400 status when the params.id is not an integer', async () => {
    // Given
    request.params = { id: "NonStringValue" };

    // When
    await assetController.getAssetById(request, response, next);

    // Then
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(ErrorController.BadRequestError());
    expect(mockEnd).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
    expect(findByIdMock).not.toHaveBeenCalled();
  });

  it('Returns a 404 status when an asset with the id cannot be found', async () => {
    // Given
    findByIdMock.mockResolvedValue(null);

    // When
    await assetController.getAssetById(request, response, next);

    // Then
    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(ErrorController.NotFoundError("Asset not found"));
    expect(mockEnd).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
    expect(findByIdMock).toHaveBeenCalled();
  });
});
