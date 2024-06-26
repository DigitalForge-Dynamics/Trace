export type LoggerFunction = (message: string) => void;
export type MockedLogger = ILogger<jest.MockedFunction<LoggerFunction>>;

export interface ILogger<Fn=LoggerFunction> {
  info: Fn;
  warn: Fn;
  error: Fn;
}

export const resetMockLogger = (logger: MockedLogger) => {
  logger.info.mockReset();
  logger.warn.mockReset();
  logger.error.mockReset();
};

