import { ModelStatic } from "sequelize";
import Paginator from "../../../utils/Paginator";
import type { MockedLogger } from "../../helpers/mockLogger";
import { testPaginationAssets } from "../../helpers/testData";
import Asset from "../../../database/models/asset.model";
import { vi, describe, it, expect, beforeEach, afterEach, Mocked } from "vitest";

vi.mock("../../../utils/Logger.ts", (): { default: MockedLogger } => ({ default: {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}}));

const mockFindAndCountAll = vi.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
const MockedModel: Promise<Mocked<ModelStatic<Asset>>> = vi.importMock("sequelize") as any;

void MockedModel.then((mock) => {
  mock.findAndCountAll = mockFindAndCountAll;
});

describe("Paginator Unit Tests", () => {
  let paginator: Paginator<Asset>;

  beforeEach(async () => {
    const model: Mocked<ModelStatic<Asset>> = await MockedModel;
    paginator = new Paginator(model);
  });

  afterEach(() => {
  	vi.clearAllMocks();
  });

  it("returns paginated test data with 3 total records", async () => {

    mockFindAndCountAll.mockResolvedValueOnce({ rows: testPaginationAssets.data, count: testPaginationAssets.totalRecords });

    const page = 1;
    const pageSize = 10;
    const result = await paginator.paginate(page, pageSize);

    expect(result.lastPage).toBe(1);
    expect(result.totalRecords).toBe(testPaginationAssets.data.length);
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
  });
});
