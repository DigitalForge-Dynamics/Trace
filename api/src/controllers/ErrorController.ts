export default class ErrorController {
  public static InternalServerError(message: string = "Internal Server Error") {
    return new HandleError(message, 500);
  }

  public static NotFoundError(message: string = "Resource Not Found") {
    return new HandleError(message, 404);
  }

  public static BadRequestError(message: string = "Bad Request") {
    return new HandleError(message, 400);
  }

  public static ForbiddenError(message: string = "Forbidden Request") {
    return new HandleError(message, 403);
  }
}

class HandleError extends Error {
  readonly statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
