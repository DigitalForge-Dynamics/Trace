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

export interface MockResponseReturn {
  readonly response: Response;
  readonly status: jest.MockedFunction<any>;
  readonly send: jest.MockedFunction<any>;
  readonly end: jest.MockedFunction<any>;
}

export const mockResponse = ({ locals }: MockResponseParams): MockResponseReturn => {
  const status = jest.fn();
  const end = jest.fn();
  const send = jest.fn();
  const response = {
    status,
    send,
    end,
    locals,
  } as unknown as Response;
  status.mockReturnValue(response);
  send.mockReturnValue(response);
  return { response, status, send, end };
};

export const mockNext = (): jest.MockedFunction<NextFunction> => {
  return jest.fn();
};
