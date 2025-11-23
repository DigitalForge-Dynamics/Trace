import { type CreateUserResponse, createUserRequest } from "trace-schemas";
import { db } from "../db.ts";

const createUser = async (req: Request): Promise<Response> => {
  const userRequest = createUserRequest.parse(await req.json());
  const user = await db.createUser(userRequest);
  return Response.json(user satisfies CreateUserResponse);
};

export { createUser };
