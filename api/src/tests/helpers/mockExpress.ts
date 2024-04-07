import { NextFunction, Request, Response } from "express";

export const mockRequest = <T extends Record<string, any>>(params?: T): Request<T> => {
  if (params === undefined) {
    return {} as any;
  }
  return {
    params
  } as unknown as Request<T>;
};

export interface MockResponseParams {
  readonly locals?: Record<string, any>;
}

export const mockResponse = ({ locals }: MockResponseParams): Response => {
  const status = jest.fn();
  const end = jest.fn();
  const send = jest.fn();
  const json = jest.fn();
  const response = {
    status,
    send,
    end,
    json,
    locals,
  } as unknown as Response;
  // Set chaining
  status.mockReturnValue(response);
  send.mockReturnValue(response);
  json.mockReturnValue(response);

  return response;
};

export const mockNext = (): jest.MockedFunction<NextFunction> => {
  return jest.fn();
};

export const expectNonFinal = (response: Response) => {
  expect(response.status).not.toHaveBeenCalled();
  expect(response.send).not.toHaveBeenCalled();
  expect(response.json).not.toHaveBeenCalled();
  expect(response.end).not.toHaveBeenCalled();
};
