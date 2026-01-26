import { type CreateLocationResponse, createLocationRequest } from "@DigitalForge-Dynamics/trace-schemas";
import { db } from "../db.ts";

const createLocation = async (req: Request): Promise<Response> => {
  const locationRequest = createLocationRequest.parse(await req.json());
  const location = await db.createLocation(locationRequest);
  return Response.json({ id: location.uid } satisfies CreateLocationResponse);
};

export { createLocation };
