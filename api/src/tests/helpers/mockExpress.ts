import { NextFunction, Request, Response } from "express";
import { vi, MockedFunction, expect } from "vitest";

export const mockRequest = <T extends Record<string, unknown>>(params?: T): Request<T> => {
  if (params === undefined) {
    return {} as Request<T>;
  }
  return {
    params
  } as unknown as Request<T>;
};

export interface MockResponseParams {
  readonly locals?: Record<string, unknown>;
}

export const mockResponse = ({ locals }: MockResponseParams): Response => {
  const status = vi.fn();
  const end = vi.fn();
  const send = vi.fn();
  const json = vi.fn();
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

export const mockNext = (): MockedFunction<NextFunction> => {
  return vi.fn();
};

export const expectNonFinal = (response: Response) => {
  expect(response.status).not.toHaveBeenCalled();
  expect(response.send).not.toHaveBeenCalled();
  expect(response.json).not.toHaveBeenCalled();
  expect(response.end).not.toHaveBeenCalled();
};
