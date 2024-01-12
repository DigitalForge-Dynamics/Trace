export const mockDatabaseClient = (data: any) => {
  define: jest.fn(() => ({
    init: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn().mockResolvedValue([data]),
  }));
};
