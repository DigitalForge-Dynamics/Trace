import { ModelStatic } from "sequelize";
import Paginator from "../../../utils/Paginator";
import { testPaginationAssets } from "../../helpers/testData";
import { MockedLogger } from "../../helpers/mockLogger";

jest.mock("../../../utils/Logger.ts", (): MockedLogger => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const MockedModel: jest.Mocked<ModelStatic<any>> =
  jest.createMockFromModule("sequelize");
const mockFindAndCountAll = jest.fn();
MockedModel.findAndCountAll = mockFindAndCountAll;

describe("Paginator Unit Tests", () => {
  let paginator: Paginator<any>;

  beforeEach(() => {
    paginator = new Paginator(MockedModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns paginated test data with 3 total records", async () => {

    mockFindAndCountAll.mockResolvedValueOnce({ rows: testPaginationAssets.data, count: testPaginationAssets.totalRecords });

    const page = 1;
    const pageSize = 10;
    const result = await paginator.paginate(page, pageSize);

    expect(result.lastPage).toBe(1);
    expect(result.totalRecords).toBe(3);
    expect(result.hasMorePages).toBe(false);
    expect(result.data).toEqual(testPaginationAssets.data);
    expect(mockFindAndCountAll).toHaveBeenCalledWith({
      limit: pageSize,
      offset: 0,
    });
  });

  it("should throw error for invalid page or pageSize", async () => {
    const page = 0;
    const pageSize = 10;

    await expect(paginator.paginate(page, pageSize)).rejects.toThrow();
    expect(mockFindAndCountAll).not.toHaveBeenCalled();

    await expect(paginator.paginate(pageSize, page)).rejects.toThrow();
    expect(mockFindAndCountAll).not.toHaveBeenCalled();
  });
});
