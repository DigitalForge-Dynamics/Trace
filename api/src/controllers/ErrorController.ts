export default class ErrorController {
  public static InternalServerError(message: string = "Internal Server Error") {
    throw new HandleError(message, 500);
  }

  public static NotFoundError(message: string = "Resource Not Found") {
    throw new HandleError(message, 404);
  }

  public static BadRequestError(message: string = "Bad Request") {
    throw new HandleError(message, 400);
  }

  public static ForbiddenError(message: string = "Forbidden Request") {
    throw new HandleError(message, 403);
  }
}

class HandleError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
